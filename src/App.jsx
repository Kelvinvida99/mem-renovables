import { useState, useEffect } from 'react'
import { useSENI } from './hooks/useSENI.js'
import { reportDate } from './data/mockData.js'

import Sidebar          from './components/layout/Sidebar.jsx'
import Header           from './components/layout/Header.jsx'
import KPICard          from './components/layout/KPICard.jsx'
import DateRangePicker  from './components/layout/DateRangePicker.jsx'

import DonutChart       from './components/charts/DonutChart.jsx'
import BarChartTech     from './components/charts/BarChartTech.jsx'
import GeoMap           from './components/charts/GeoMap.jsx'
import LineChart12M     from './components/charts/LineChart12M.jsx'
import HourlyAreaChart  from './components/charts/HourlyAreaChart.jsx'
import CMGChart         from './components/charts/CMGChart.jsx'
import BiomassBar       from './components/charts/BiomassBar.jsx'
import WindFarmBars     from './components/charts/WindFarmBars.jsx'
import SolarFarmBars    from './components/charts/SolarFarmBars.jsx'
import CurtailmentChart      from './components/charts/CurtailmentChart.jsx'
import EmisionesGEIChart     from './components/charts/EmisionesGEIChart.jsx'
import RenovableEvolucionChart from './components/charts/RenovableEvolucionChart.jsx'
import LimiteRenovablesChart  from './components/charts/LimiteRenovablesChart.jsx'

import './App.css'

// ── Utilidades ────────────────────────────────────────────────────
function prevDay() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

// ── Componente sección reutilizable ───────────────────────────────
function Section({ id, num, title, children }) {
  return (
    <div id={id} className="section">
      <div className="section-header">
        <span className="section-num">{num}</span>
        <span className="section-title">{title}</span>
      </div>
      <div className="section-body">{children}</div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────
export default function App() {
  // Fechas locales (controladas por el picker)
  const [desde, setDesde] = useState(prevDay())
  const [hasta, setHasta] = useState(prevDay())
  // Fechas confirmadas (sólo cambian al pulsar "Consultar")
  const [query, setQuery] = useState({ desde: prevDay(), hasta: prevDay() })
  const [activeId, setActiveId] = useState('s1')

  const { data, loading, error } = useSENI(query.desde, query.hasta)

  // ── Resaltar sección activa en sidebar (IntersectionObserver) ──
  useEffect(() => {
    if (!data) return
    const ids = ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11','s12','s13','s14','s15']
    const obs = new IntersectionObserver(
      entries => {
        const hit = entries.find(e => e.isIntersecting)
        if (hit) setActiveId(hit.target.id)
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [data])

  // ── Estados de carga ──────────────────────────────────────────
  if (loading) return (
    <div className="screen-center">
      <div className="loader" />
      <p style={{ color: '#4D6A99', fontSize: 13 }}>Cargando datos del SENI…</p>
    </div>
  )

  if (!data) return (
    <div className="screen-center">
      <p style={{ color: '#F87171' }}>Error: {error ?? 'No se pudo cargar la data'}</p>
    </div>
  )

  // Datos derivados para sección 1 (donut renovables vs térmica)
  const s1Data = [
    { tipo: 'Renovables', valor: data.energiaProducida.renovables.valor, color: '#10B981' },
    { tipo: 'Térmicas',   valor: data.energiaProducida.termicas.valor,   color: '#6B7280' },
  ]

  return (
    <div className="layout">
      {/* ── Sidebar vertical ── */}
      <Sidebar activeId={activeId} />

      {/* ── Contenido principal ── */}
      <main className="main">

        {/* Header fijo */}
        <div className="main-header">
          <Header reportDate={reportDate} updatedAt={data._updatedAt} />
          <DateRangePicker
            desde={desde} hasta={hasta}
            onDesde={setDesde} onHasta={setHasta}
            onApply={() => setQuery({ desde, hasta })}
          />
        </div>

        {/* ── KPIs ── */}
        <div className="kpi-row">
          {Object.values(data.kpis).map(kpi => (
            <KPICard key={kpi.label} {...kpi} />
          ))}
        </div>

        {/* ── Secciones ── */}
        <div className="sections">

          {/* S1 + S2 */}
          <div className="grid-2">
            <Section id="s1" num="1" title="Energía Eléctrica Producida [GWh]">
              <DonutChart
                data={s1Data}
                centerLabel="SENI"
                centerValue={data.energiaProducida.total.toFixed(2)}
                unit="GWh"
              />
            </Section>

            <Section id="s2" num="2" title="Energía Producida por Tecnología [GWh]">
              <BarChartTech data={data.generacionTech} unit="GWh" />
            </Section>
          </div>

          {/* S3: Mapa */}
          <Section id="s3" num="3" title="Distribución Geográfica de las Renovables">
            <GeoMap data={data.distribucionGeo} />
          </Section>

          {/* S4 + S5 */}
          <div className="grid-2">
            <Section id="s4" num="4" title="Capacidad Instalada en Energías Renovables [MW]">
              <DonutChart
                data={data.capacidadInstalada.porTech}
                centerLabel="SENI"
                centerValue={data.capacidadInstalada.total.toLocaleString('es-DO')}
                unit="MW"
              />
            </Section>

            <Section id="s5" num="5" title="Emisiones Evitadas de CO₂">
              <CO2Panel value={data.co2Evitado} />
            </Section>
          </div>

          {/* S6: 12 meses */}
          <Section id="s6" num="6" title="Registro Mensual EERR en el SENI — Últimos 12 Meses (%)">
            <LineChart12M data={data.participacion12M} />
          </Section>

          {/* S7 + S8 */}
          <div className="grid-2">
            <Section id="s7" num="7" title="Generación Horaria ERNC en el SENI (%)">
              <HourlyAreaChart data={data.generacionHoraria} />
            </Section>
            <Section id="s8" num="8" title="Costos Marginales Preliminares">
              <CMGChart data={data.cmgHorario} />
            </Section>
          </div>

          {/* S9 + S10 */}
          <div className="grid-2">
            <Section id="s9" num="9" title="Generación Central San Pedro Bio-Energy (MWh)">
              <BiomassBar data={data.biomasaCentrales} />
            </Section>
            <Section id="s10" num="10" title="Generación Eólica por Central (MWh)">
              <WindFarmBars data={data.eolicaCentrales} />
            </Section>
          </div>

          {/* S11 */}
          <Section id="s11" num="11" title="Generación Centrales Fotovoltaicas SENI (MWh)">
            <SolarFarmBars data={data.solarCentrales} />
          </Section>

          {/* S12 */}
          <Section id="s12" num="12" title="Comportamiento Indicadores del Vertimiento RE SENI [MWh]">
            <CurtailmentChart
              data={data.vertimiento.periodos}
              totalVertimiento={data.vertimiento.totalVertimiento}
              pctCurtailment={data.vertimiento.pctCurtailment}
            />
          </Section>

          {/* S13 + S14 */}
          <div className="grid-2">
            <Section id="s13" num="13" title="Emisiones GEI — Evolución Anual [GgCO₂eq]">
              <EmisionesGEIChart data={data.emisionesGEI} />
            </Section>
            <Section id="s14" num="14" title="Evolución de Generación Renovable por Tecnología [GWh]">
              <RenovableEvolucionChart data={data.renovableEvolucion} />
            </Section>
          </div>

          {/* S15 */}
          <Section id="s15" num="15" title="Resumen Límite Renovables Ponderado por Central [MWh]">
            <LimiteRenovablesChart data={data.limiteRenovables} />
          </Section>

        </div>{/* end .sections */}
      </main>
    </div>
  )
}

// ── Panel CO₂ (Sección 5) ─────────────────────────────────────────
function CO2Panel({ value }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: 220, gap: 10, padding: 24,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#4D6A99' }}>
        Emisiones Evitadas
      </div>
      <div style={{ fontSize: 52, fontWeight: 800, color: '#10B981', letterSpacing: -2, lineHeight: 1 }}>
        {value?.toLocaleString('es-DO', { maximumFractionDigits: 0 })}
      </div>
      <div style={{ fontSize: 16, color: '#C8D8F0' }}>tCO₂ evitadas</div>
      <div style={{
        marginTop: 12, padding: '10px 16px',
        background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: 8, maxWidth: 300, textAlign: 'center',
        fontSize: 11, color: '#4D6A99', lineHeight: 1.7,
      }}>
        Factor de Emisión de la Red Eléctrica — República Dominicana (ASB0047-2020) ·
        UNFCCC
      </div>
    </div>
  )
}
