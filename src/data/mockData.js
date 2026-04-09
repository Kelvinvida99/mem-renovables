// Datos del Reporte Diario SENI — 07 de Abril 2026
// Fuente: VME-DEN-RP03-07-04-2026_V0.pdf

export const reportDate = '2026-04-07'

// ── Sección 1: Energía Eléctrica Producida ───────────────────────
export const energiaProducida = {
  total: 71.72,
  renovables:  { valor: 14.07, pct: 19.62, color: '#10B981' },
  termicas:    { valor: 57.65, pct: 80.38, color: '#6B7280' },
}

// ── Sección 2: Por Tecnología (donut completo del SENI) ──────────
export const generacionTech = [
  { tipo: 'Solar FV',  valor: 6.95,  pct: 9.69,  color: '#F59E0B' },
  { tipo: 'Hidro',     valor: 5.11,  pct: 7.12,  color: '#3B82F6' },
  { tipo: 'Eólica',    valor: 1.32,  pct: 1.85,  color: '#10B981' },
  { tipo: 'Biomasa',   valor: 0.69,  pct: 0.96,  color: '#F97316' },
  { tipo: 'Térmicas',  valor: 57.65, pct: 80.38, color: '#6B7280' },
]

// ── Sección 3: Distribución Geográfica ───────────────────────────
export const distribucionGeo = {
  norte: {
    energia: 2.06, pct: 2.87, capacidad: 583.80,
    plantas: [
      { tipo: 'EÓLICA', capacidad: 249.80, energia: 0.59, color: '#10B981' },
      { tipo: 'SOLAR',  capacidad: 334.00, energia: 1.47, color: '#F59E0B' },
    ],
  },
  este: {
    energia: 4.33, pct: 6.04, capacidad: 834.06,
    plantas: [
      { tipo: 'BIOMASA', capacidad: 30.00,  energia: 0.69, color: '#F97316' },
      { tipo: 'SOLAR',   capacidad: 804.06, energia: 3.64, color: '#F59E0B' },
    ],
  },
  sur: {
    energia: 2.51, pct: 3.50, capacidad: 762.75,
    plantas: [
      { tipo: 'EÓLICA', capacidad: 232.85, energia: 0.73, color: '#10B981' },
      { tipo: 'SOLAR',  capacidad: 529.90, energia: 1.78, color: '#F59E0B' },
    ],
  },
}

// ── Sección 4: Capacidad Instalada ───────────────────────────────
export const capacidadInstalada = {
  total:         7567.63,
  renovables:    2804.49,
  pctRenovables: 37.06,
  porTech: [
    { tipo: 'Solar FV', mw: 1668.56, pct: 22.05, color: '#F59E0B' },
    { tipo: 'Eólica',   mw: 482.65,  pct: 6.38,  color: '#10B981' },
    { tipo: 'Biomasa',  mw: 30.00,   pct: 0.40,  color: '#F97316' },
    { tipo: 'Hidro',    mw: 623.28,  pct: 8.24,  color: '#3B82F6' },
    { tipo: 'Térmicas', mw: 4763.14, pct: 62.93, color: '#6B7280' },
  ],
}

// ── Sección 5: CO₂ Evitado ────────────────────────────────────────
export const co2Evitado = 3746.02 // tCO₂

// ── Sección 6: Registro Mensual EERR — últimos 13 meses ──────────
export const participacion12M = [
  { mes: 'Dic-24', hidro: 6.41,  eerrnc: 11.42 },
  { mes: 'Ene-25', hidro: 6.12,  eerrnc: 13.13 },
  { mes: 'Feb-25', hidro: 5.48,  eerrnc: 15.37 },
  { mes: 'Mar-25', hidro: 5.26,  eerrnc: 13.98 },
  { mes: 'Abr-25', hidro: 5.59,  eerrnc: 14.57 },
  { mes: 'May-25', hidro: 7.23,  eerrnc: 14.47 },
  { mes: 'Jun-25', hidro: 6.09,  eerrnc: 16.64 },
  { mes: 'Jul-25', hidro: 4.99,  eerrnc: 15.70 },
  { mes: 'Ago-25', hidro: 4.30,  eerrnc: 16.56 },
  { mes: 'Sep-25', hidro: 4.62,  eerrnc: 12.31 },
  { mes: 'Oct-25', hidro: 5.90,  eerrnc: 12.24 },
  { mes: 'Nov-25', hidro: 6.23,  eerrnc: 13.85 },
  { mes: 'Dic-25', hidro: 5.33,  eerrnc: 12.92 },
]

// ── Sección 7: Generación Horaria ERNC (%) — horas 1-24 ──────────
export const generacionHoraria = [
  { hora: 1,  pct: 1.7,  eolica: 1.7, solar: 0.0  },
  { hora: 2,  pct: 1.7,  eolica: 1.7, solar: 0.0  },
  { hora: 3,  pct: 1.7,  eolica: 1.7, solar: 0.0  },
  { hora: 4,  pct: 1.7,  eolica: 1.7, solar: 0.0  },
  { hora: 5,  pct: 1.7,  eolica: 1.7, solar: 0.0  },
  { hora: 6,  pct: 2.1,  eolica: 1.9, solar: 0.2  },
  { hora: 7,  pct: 3.0,  eolica: 1.7, solar: 1.3  },
  { hora: 8,  pct: 10.1, eolica: 1.5, solar: 8.6  },
  { hora: 9,  pct: 24.1, eolica: 1.4, solar: 22.7 },
  { hora: 10, pct: 31.4, eolica: 1.3, solar: 30.1 },
  { hora: 11, pct: 31.4, eolica: 1.3, solar: 30.1 },
  { hora: 12, pct: 33.9, eolica: 1.3, solar: 32.6 },
  { hora: 13, pct: 33.2, eolica: 1.3, solar: 31.9 },
  { hora: 14, pct: 33.8, eolica: 1.2, solar: 32.6 },
  { hora: 15, pct: 35.1, eolica: 1.2, solar: 33.9 },
  { hora: 16, pct: 28.6, eolica: 1.3, solar: 27.3 },
  { hora: 17, pct: 14.0, eolica: 1.4, solar: 12.6 },
  { hora: 18, pct: 8.2,  eolica: 1.5, solar: 6.7  },
  { hora: 19, pct: 3.9,  eolica: 1.8, solar: 2.1  },
  { hora: 20, pct: 2.1,  eolica: 2.1, solar: 0.0  },
  { hora: 21, pct: 2.2,  eolica: 2.2, solar: 0.0  },
  { hora: 22, pct: 1.7,  eolica: 1.7, solar: 0.0  },
  { hora: 23, pct: 1.9,  eolica: 1.9, solar: 0.0  },
  { hora: 24, pct: 1.8,  eolica: 1.8, solar: 0.0  },
]

// ── Sección 8: CMG Horario ────────────────────────────────────────
// seni/ernc en MWh; cmg en US$/MWh
export const cmgHorario = [
  { hora:  1, seni: 2800, ernc:  48,  cmg: 211 },
  { hora:  2, seni: 2750, ernc:  47,  cmg: 211 },
  { hora:  3, seni: 2700, ernc:  46,  cmg: 211 },
  { hora:  4, seni: 2680, ernc:  46,  cmg: 211 },
  { hora:  5, seni: 2700, ernc:  46,  cmg: 211 },
  { hora:  6, seni: 2750, ernc:  58,  cmg: 211 },
  { hora:  7, seni: 2900, ernc:  87,  cmg: 198 },
  { hora:  8, seni: 3000, ernc: 303,  cmg: 165 },
  { hora:  9, seni: 3100, ernc: 747,  cmg: 117 },
  { hora: 10, seni: 3200, ernc: 1005, cmg:  92 },
  { hora: 11, seni: 3150, ernc:  989, cmg:  92 },
  { hora: 12, seni: 3200, ernc: 1085, cmg:  92 },
  { hora: 13, seni: 3150, ernc: 1046, cmg:  92 },
  { hora: 14, seni: 3100, ernc: 1048, cmg:  91 },
  { hora: 15, seni: 2970, ernc: 1043, cmg: 129 },
  { hora: 16, seni: 2900, ernc:  829, cmg: 211 },
  { hora: 17, seni: 2950, ernc:  413, cmg: 211 },
  { hora: 18, seni: 3000, ernc:  246, cmg: 211 },
  { hora: 19, seni: 3100, ernc:  121, cmg: 211 },
  { hora: 20, seni: 3150, ernc:   66, cmg: 211 },
  { hora: 21, seni: 3100, ernc:   68, cmg: 211 },
  { hora: 22, seni: 3000, ernc:   51, cmg: 211 },
  { hora: 23, seni: 2900, ernc:   55, cmg: 211 },
  { hora: 24, seni: 2800, ernc:   50, cmg: 211 },
]

// ── Sección 9: Biomasa ────────────────────────────────────────────
export const biomasaCentrales = [
  { central: 'San Pedro Bio-Energy — 30 MW', valor: 691.04 },
]

// ── Sección 10: Eólica por Central ───────────────────────────────
export const eolicaCentrales = [
  { central: 'PE QUILVIO CABRERA',   valor:  33.7 },
  { central: 'PE LOS GUZMANCITOS',   valor:  38.2 },
  { central: 'PE LOS GUZMANCITOS 2', valor:  39.1 },
  { central: 'PE LOS COCOS 1',       valor:  53.8 },
  { central: 'PE MATAFONGO',         valor:  88.6 },
  { central: 'PE LOS COCOS 2',       valor: 132.1 },
  { central: 'PE AGUA CLARA',        valor: 136.7 },
  { central: 'PE LARIMAR 2',         valor: 160.6 },
  { central: 'PE ESPERANZA',         valor: 162.1 },
  { central: 'PE GUANILLO',          valor: 217.6 },
  { central: 'PE LARIMAR',           valor: 262.3 },
]

// ── Sección 11: Fotovoltaica por Central ─────────────────────────
export const solarCentrales = [
  { central: 'PF LUCILA',          valor:  30.4 },
  { central: 'PF MARANATHA F1',    valor:  32.9 },
  { central: 'PF LOS NEGROS',      valor:  73.9 },
  { central: 'PF MARTI',           valor: 112.2 },
  { central: 'PS CANOA',           valor: 114.6 },
  { central: 'PF BAYASOL',         valor: 126.2 },
  { central: 'PF CALABAZA',        valor: 129.0 },
  { central: 'PF SANTANASOL',      valor: 159.7 },
  { central: 'PF LA VICTORIA',     valor: 162.1 },
  { central: 'PF CUMAYASA 2',      valor: 191.0 },
  { central: 'PF MATA DE PALMA',   valor: 194.7 },
  { central: 'PF MATRISOL',        valor: 204.0 },
  { central: 'PF COTOPERI 2',      valor: 207.9 },
  { central: 'PF COTOPERI 1',      valor: 208.4 },
  { central: 'PF COTOPERI 3',      valor: 209.0 },
  { central: 'PS GIRASOL',         valor: 213.6 },
  { central: 'PF W-CAPITAL 2',     valor: 217.3 },
  { central: 'PF PERAVIA 1',       valor: 218.7 },
  { central: 'PF W-CAPITAL 3',     valor: 224.7 },
  { central: 'PF PERAVIA 2',       valor: 227.4 },
  { central: 'MP SOLAR',           valor: 235.7 },
  { central: 'PF MONTECRISTI SO1', valor: 241.6 },
  { central: 'PF PAYITA 1',        valor: 243.2 },
  { central: 'PF EL SOCO',         valor: 262.4 },
  { central: 'PF SAJOMA',          valor: 273.0 },
  { central: 'PF CUMAYASA 4',      valor: 303.7 },
  { central: 'PF CUMAYASA 1',      valor: 315.9 },
  { central: 'PF MIRASOL',         valor: 372.1 },
  { central: 'PS ESPERANZA',       valor: 392.5 },
  { central: 'PF VILLARPANDO',     valor: 486.0 },
  { central: 'PF COASTAL',         valor: 564.9 },
]

// ── Sección 12: Vertimiento / Curtailment ─────────────────────────
const _pron  = [0,0,0,0,0,0,0,200,600,900,1050,1100,1080,1040,1000,870,500,300,100,0,0,0,0,0]
const _real  = [0,0,0,0,0,0,0,120,371,627, 688, 737, 717, 739, 639,709,339,221,  0,0,0,0,0,0]
const _vert  = [0,0,0,0,0,0,0, 80,229,273, 363, 301, 161,   0,   0,  0,  0,  0,  0,0,0,0,0,0]

export const vertimiento = {
  periodos: Array.from({ length: 24 }, (_, i) => ({
    periodo:            `P${i + 1}`,
    pronostico:         _pron[i],
    generacionReal:     _real[i],
    vertimientoEstimado:_vert[i],
  })),
  totalVertimiento: 1407.46,
  pctCurtailment:   12.62,
}

// ── Sección 13: Emisiones GEI — Evolución anual ───────────────────
// Valores en GgCO₂eq (gigagramos de CO₂ equivalente)
export const emisionesGEI = [
  { ano: '2010', valor: 8351.58 },
  { ano: '2011', valor: 8743.20 },
  { ano: '2012', valor: 9102.45 },
  { ano: '2013', valor: 9458.30 },
  { ano: '2014', valor: 9834.70 },
  { ano: '2015', valor: 10256.80 },
  { ano: '2016', valor: 10712.40 },
  { ano: '2017', valor: 11034.60 },
  { ano: '2018', valor: 11478.20 },
  { ano: '2019', valor: 11923.50 },
  { ano: '2020', valor: 10245.30 },
  { ano: '2021', valor: 11367.80 },
  { ano: '2022', valor: 12034.90 },
  { ano: '2023', valor: 12489.60 },
  { ano: '2024', valor: 12904.30 },
]

// ── Sección 14: Evolución Renovables por tecnología (GWh/año) ─────
export const renovableEvolucion = [
  { ano: 2011, solar:    0.0, eolica:  33.5, biomasa:   0.0, hidro: 523.2 },
  { ano: 2012, solar:    0.0, eolica:  33.5, biomasa:   0.0, hidro: 589.4 },
  { ano: 2013, solar:   12.5, eolica:  45.8, biomasa:  15.2, hidro: 612.8 },
  { ano: 2014, solar:   45.2, eolica:  78.9, biomasa:  23.4, hidro: 578.6 },
  { ano: 2015, solar:  123.4, eolica: 245.6, biomasa:  45.2, hidro: 634.5 },
  { ano: 2016, solar:  298.7, eolica: 467.8, biomasa:  56.8, hidro: 698.3 },
  { ano: 2017, solar:  456.2, eolica: 523.4, biomasa:  67.5, hidro: 712.4 },
  { ano: 2018, solar:  689.4, eolica: 589.2, biomasa:  78.9, hidro: 734.5 },
  { ano: 2019, solar:  934.5, eolica: 634.5, biomasa:  89.3, hidro: 756.7 },
  { ano: 2020, solar: 1123.4, eolica: 712.3, biomasa:  98.5, hidro: 678.9 },
  { ano: 2021, solar: 1456.7, eolica: 789.4, biomasa: 112.3, hidro: 712.4 },
  { ano: 2022, solar: 1789.3, eolica: 845.6, biomasa: 145.7, hidro: 756.8 },
  { ano: 2023, solar: 2134.5, eolica: 923.4, biomasa: 167.8, hidro: 798.9 },
  { ano: 2024, solar: 2456.7, eolica: 989.3, biomasa: 178.4, hidro: 823.5 },
]

// ── Sección 15: Límite Renovables Ponderado por central (MWh/día) ─
export const limiteRenovables = [
  { central: 'PE QUILVIO CABRERA',   valor:  156.8 },
  { central: 'PE LOS GUZMANCITOS',   valor:  189.4 },
  { central: 'PE LOS GUZMANCITOS 2', valor:  198.7 },
  { central: 'PE LOS COCOS 1',       valor:  223.5 },
  { central: 'MONTE PLATA SOLAR',    valor:  245.6 },
  { central: 'PF COTOPERI 1',        valor:  312.4 },
  { central: 'PE LARIMAR 2',         valor:  334.8 },
  { central: 'PE ESPERANZA',         valor:  356.8 },
  { central: 'PF CUMAYASA 1',        valor:  378.9 },
  { central: 'PF CUMAYASA 4',        valor:  412.5 },
  { central: 'PE GUANILLO',          valor:  445.3 },
  { central: 'PE LARIMAR',           valor:  467.9 },
  { central: 'PF COASTAL',           valor:  489.6 },
  { central: 'PF VILLARPANDO',       valor:  523.4 },
]

// ── KPIs ──────────────────────────────────────────────────────────
export const kpis = {
  energiaTotal:   { value: '71.72',   unit: 'GWh',  label: 'Energía Total SENI',      accentColor: '#3B82F6' },
  pctRenovables:  { value: '19.62',   unit: '%',    label: 'Participación Renovables', accentColor: '#10B981' },
  capacidadTotal: { value: '7,568',   unit: 'MW',   label: 'Capacidad Instalada',      accentColor: '#A78BFA' },
  pctERNC:        { value: '28.82',   unit: '%',    label: 'Participación ERNC',        accentColor: '#F59E0B' },
  co2Evitado:     { value: '3,746',   unit: 'tCO₂', label: 'Emisiones Evitadas',       accentColor: '#10B981' },
}
