import { useState, useEffect, useCallback } from 'react'
import * as mock from '../data/mockData.js'

const OC_BASE = '/api/oc'
const USER    = import.meta.env.VITE_OC_USER ?? ''
const PASS    = import.meta.env.VITE_OC_PASS ?? ''

/** Convierte YYYY-MM-DD → MM/DD/YYYY (formato API) */
function toApiDate(iso) {
  const [y, m, d] = iso.split('-')
  return `${m}/${d}/${y}`
}

/** Helper: fetch con timeout y parse JSON, rechaza si falla */
async function apiFetch(path, params) {
  const url = `${OC_BASE}${path}?${new URLSearchParams({ ...params, Usuario: USER, Clave: PASS })}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// ── Normalizadores individuales ───────────────────────────────────

function normalizeGeneracion(raw) {
  const fuentes = raw?.GetGeneracionProducidaFuente ?? []
  if (!fuentes.length) return null

  const byTipo = Object.fromEntries(fuentes.map(f => [f.TIPO, f.VALOR]))
  const solarFV = byTipo['Solar FV'] ?? byTipo['SOLAR FV'] ?? 0
  const eolica  = byTipo['Eólica']   ?? byTipo['Eolica']   ?? byTipo['Eólico'] ?? 0
  const biomasa = byTipo['Biomasa']  ?? byTipo['BIOMASA']  ?? 0
  const hidro   = byTipo['Hidro']    ?? byTipo['HIDRO']    ?? 0
  const termicas = byTipo['Térmica'] ?? byTipo['Termica']  ?? byTipo['Gas']    ?? 0

  const toGWh = v => +(v / 1000).toFixed(4)
  const renovablesGWh = toGWh(solarFV + eolica + biomasa + hidro)
  const termicasGWh   = toGWh(termicas)
  const totalGWh      = renovablesGWh + termicasGWh || 1

  return {
    _updatedAt: fuentes[0]?.ACTUALIZADO ?? null,
    energiaProducida: {
      total: +totalGWh.toFixed(2),
      renovables: { valor: renovablesGWh, pct: +((renovablesGWh / totalGWh) * 100).toFixed(2), color: '#10B981' },
      termicas:   { valor: termicasGWh,   pct: +((termicasGWh   / totalGWh) * 100).toFixed(2), color: '#6B7280' },
    },
    generacionTech: [
      { tipo: 'Solar FV', valor: toGWh(solarFV), pct: +((solarFV  / (totalGWh * 1000)) * 100).toFixed(2), color: '#F59E0B' },
      { tipo: 'Hidro',    valor: toGWh(hidro),   pct: +((hidro    / (totalGWh * 1000)) * 100).toFixed(2), color: '#3B82F6' },
      { tipo: 'Eólica',   valor: toGWh(eolica),  pct: +((eolica   / (totalGWh * 1000)) * 100).toFixed(2), color: '#10B981' },
      { tipo: 'Biomasa',  valor: toGWh(biomasa), pct: +((biomasa  / (totalGWh * 1000)) * 100).toFixed(2), color: '#F97316' },
      { tipo: 'Térmicas', valor: termicasGWh,    pct: +((termicas / (totalGWh * 1000)) * 100).toFixed(2), color: '#6B7280' },
    ],
    kpisPartial: {
      energiaTotal:  +totalGWh.toFixed(2),
      pctRenovables: +((renovablesGWh / totalGWh) * 100).toFixed(2),
    },
  }
}

function normalizeCapacidadInstalada(raw) {
  const items = raw?.GetCapacidadInstaladaTecnologia ?? []
  if (!items.length) return null

  const techMap = {
    solar:    { tipo: 'Solar FV', color: '#F59E0B', mw: 0 },
    eolica:   { tipo: 'Eólica',   color: '#10B981', mw: 0 },
    biomasa:  { tipo: 'Biomasa',  color: '#F97316', mw: 0 },
    hidro:    { tipo: 'Hidro',    color: '#3B82F6', mw: 0 },
    termicas: { tipo: 'Térmicas', color: '#6B7280', mw: 0 },
  }

  items.forEach(({ FUENTE, VALOR }) => {
    const f = (FUENTE ?? '').toLowerCase()
    if (f.includes('solar') || f.includes('fotovolt') || f.includes(' fv'))
      techMap.solar.mw += VALOR
    else if (f.includes('eól') || f.includes('eoli') || f.includes('viento') || f.includes('eolica'))
      techMap.eolica.mw += VALOR
    else if (f.includes('biomas') || f.includes('biog'))
      techMap.biomasa.mw += VALOR
    else if (f.includes('hidro'))
      techMap.hidro.mw += VALOR
    else
      techMap.termicas.mw += VALOR
  })

  const total = Object.values(techMap).reduce((acc, t) => acc + t.mw, 0) || 1
  const porTech = Object.values(techMap)
    .map(t => ({ ...t, mw: +t.mw.toFixed(2), pct: +((t.mw / total) * 100).toFixed(2) }))
    .filter(t => t.mw > 0)

  const renovMW = techMap.solar.mw + techMap.eolica.mw + techMap.biomasa.mw + techMap.hidro.mw
  return {
    total:         +total.toFixed(2),
    renovables:    +renovMW.toFixed(2),
    pctRenovables: +((renovMW / total) * 100).toFixed(2),
    porTech,
  }
}

function normalizeEmisionesGEI(raw) {
  const items = raw?.GetEmisionesGEIEvolucion ?? []
  if (!items.length) return null
  return items
    .map(({ ANO, VALOR }) => ({ ano: String(ANO), valor: +VALOR }))
    .sort((a, b) => a.ano.localeCompare(b.ano))
}

function normalizeRenovableEvolucion(raw) {
  const items = raw?.GetRenovableEvolucion ?? []
  if (!items.length) return null
  return items
    .map(({ ANO, Solar, Eolica, Biomasa, Hidroelectrica }) => ({
      ano:    ANO,
      solar:  +(Solar          ?? 0),
      eolica: +(Eolica         ?? 0),
      biomasa:+(Biomasa        ?? 0),
      hidro:  +(Hidroelectrica ?? 0),
    }))
    .sort((a, b) => a.ano - b.ano)
}

function normalizeLimiteRenovables(raw) {
  const items = raw?.GetResumenLimiteRenovablesPonderado ?? []
  if (!items.length) return null

  // Agregar por CENTRAL: suma de todos los PERIODOs del día
  const byCentral = {}
  items.forEach(({ CENTRAL, VALOR }) => {
    byCentral[CENTRAL] = (byCentral[CENTRAL] ?? 0) + VALOR
  })

  return Object.entries(byCentral)
    .map(([central, valor]) => ({ central, valor: +valor.toFixed(2) }))
    .sort((a, b) => a.valor - b.valor)
}

function normalizeCMG(raw, existingHorario) {
  const items = raw?.GetCostoMarginalPonderado ?? []
  if (!items.length) return existingHorario

  // Agrupar por PERIODO
  const byPeriodo = {}
  items.forEach(({ PERIODO, VALOR }) => {
    if (!byPeriodo[PERIODO]) byPeriodo[PERIODO] = []
    byPeriodo[PERIODO].push(VALOR)
  })

  const maxPeriod = Math.max(...Object.keys(byPeriodo).map(Number))
  const periodsPerHour = maxPeriod > 24 ? Math.ceil(maxPeriod / 24) : 1

  return existingHorario.map((h, i) => {
    const hour = i + 1
    let vals = []
    for (let p = 0; p < periodsPerHour; p++) {
      const period = (hour - 1) * periodsPerHour + p + 1
      if (byPeriodo[period]) vals = [...vals, ...byPeriodo[period]]
    }
    const cmg = vals.length
      ? +(vals.reduce((a, v) => a + v, 0) / vals.length).toFixed(2)
      : h.cmg
    return { ...h, cmg }
  })
}

// ── Hook principal ────────────────────────────────────────────────

export function useSENI(desde, hasta) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (!USER) {
      await new Promise(r => setTimeout(r, 280))
      setData(mock)
      setLoading(false)
      return
    }

    const ano      = hasta.split('-')[0]
    const fechaApi = toApiDate(hasta)
    const desdeApi = toApiDate(desde)

    // Todas las llamadas en paralelo; usar allSettled para no fallar si alguna falla
    const [rGen, rCap, rGEI, rRen, rLim, rCMG] = await Promise.allSettled([
      apiFetch('/wsoc/serviceextended.asmx/GetGeneracionProducidaFuenteJSon',
        { Filtro: 'renovables', Desde: desdeApi, Hasta: fechaApi }),
      apiFetch('/wsoc/serviceextended.asmx/GetCapacidadInstaladaTecnologiaJSon',
        { Ano: ano }),
      apiFetch('/wsoc/serviceextended.asmx/GetEmisionesGEIEvolucionJSon', {}),
      apiFetch('/wsoc/serviceextended.asmx/GetRenovableEvolucionJSon', {}),
      apiFetch('/wsoc/serviceextended.asmx/GetResumenLimiteRenovablesPonderadoJSon',
        { Fecha: fechaApi }),
      apiFetch('/wsoc/serviceextended.asmx/GetCostoMarginalPonderadoJSon',
        { Fecha: fechaApi }),
    ])

    const val = r => r.status === 'fulfilled' ? r.value : null
    if (rGen.status === 'rejected') console.warn('[useSENI] generacion:', rGen.reason)
    if (rCap.status === 'rejected') console.warn('[useSENI] capacidad:', rCap.reason)
    if (rGEI.status === 'rejected') console.warn('[useSENI] GEI:', rGEI.reason)
    if (rRen.status === 'rejected') console.warn('[useSENI] renovables:', rRen.reason)
    if (rLim.status === 'rejected') console.warn('[useSENI] limites:', rLim.reason)
    if (rCMG.status === 'rejected') console.warn('[useSENI] CMG:', rCMG.reason)

    const gen = normalizeGeneracion(val(rGen))
    const cap = normalizeCapacidadInstalada(val(rCap))
    const gei = normalizeEmisionesGEI(val(rGEI))
    const ren = normalizeRenovableEvolucion(val(rRen))
    const lim = normalizeLimiteRenovables(val(rLim))
    const cmgHorario = normalizeCMG(val(rCMG), mock.cmgHorario)

    // Capacidad total para KPI
    const capTotal = cap?.total ?? mock.capacidadInstalada.total

    setData({
      ...mock,                                      // base mock para todo lo no cubierto
      _fromApi: true,
      _updatedAt: gen?._updatedAt ?? null,

      // Sección 1 & 2
      energiaProducida: gen?.energiaProducida  ?? mock.energiaProducida,
      generacionTech:   gen?.generacionTech    ?? mock.generacionTech,

      // Sección 4
      capacidadInstalada: cap ?? mock.capacidadInstalada,

      // Sección 8
      cmgHorario,

      // Sección 13
      emisionesGEI: gei ?? mock.emisionesGEI,

      // Sección 14
      renovableEvolucion: ren ?? mock.renovableEvolucion,

      // Sección 15
      limiteRenovables: lim ?? mock.limiteRenovables,

      // KPIs
      kpis: {
        ...mock.kpis,
        energiaTotal:   { ...mock.kpis.energiaTotal,   value: (gen?.kpisPartial.energiaTotal  ?? mock.kpis.energiaTotal.value).toString() },
        pctRenovables:  { ...mock.kpis.pctRenovables,  value: (gen?.kpisPartial.pctRenovables ?? mock.kpis.pctRenovables.value).toString() },
        capacidadTotal: { ...mock.kpis.capacidadTotal, value: capTotal.toLocaleString('es-DO', { maximumFractionDigits: 0 }) },
      },
    })

    setLoading(false)
  }, [desde, hasta])

  useEffect(() => { fetchData() }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
