const SECTIONS = [
  { id: 's1',  label: 'Energía Producida',       icon: '⚡' },
  { id: 's2',  label: 'Por Tecnología',           icon: '🔧' },
  { id: 's3',  label: 'Distribución Geográfica',  icon: '🗺' },
  { id: 's4',  label: 'Capacidad Instalada',      icon: '🏭' },
  { id: 's5',  label: 'Emisiones CO₂',            icon: '🌿' },
  { id: 's6',  label: 'Últimos 12 Meses',         icon: '📈' },
  { id: 's7',  label: 'Generación Horaria',       icon: '🕐' },
  { id: 's8',  label: 'Costos Marginales',        icon: '💲' },
  { id: 's9',  label: 'Biomasa',                  icon: '🌾' },
  { id: 's10', label: 'Eólica por Central',       icon: '💨' },
  { id: 's11', label: 'Solar por Central',        icon: '☀' },
  { id: 's12', label: 'Vertimiento ERNC',         icon: '📉' },
  { id: 's13', label: 'Emisiones GEI',            icon: '🌡' },
  { id: 's14', label: 'Evolución Renovables',     icon: '📊' },
  { id: 's15', label: 'Límite Renovables',        icon: '⚖' },
]

export default function Sidebar({ activeId }) {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <aside className="sidebar">
      {/* Logo / título */}
      <div className="sidebar-logo">
        <div className="gov-tag">República Dominicana</div>
        <div className="app-title">SENI Dashboard</div>
        <div className="app-sub">Reporte Diario ERNC</div>
      </div>

      {/* Navegación */}
      <nav className="sidebar-nav">
        <ul>
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <button
                className={activeId === s.id ? 'active' : ''}
                onClick={() => scrollTo(s.id)}
                title={s.label}
              >
                <span className="nav-num">{i + 1}.</span>
                <span>{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        VME · Dirección de Energía Convencional
      </div>
    </aside>
  )
}
