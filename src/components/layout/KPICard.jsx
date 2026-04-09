export default function KPICard({ label, value, unit, accentColor = '#003087' }) {
  return (
    <div className="kpi-card" style={{ '--accent-color': accentColor }}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">
        {value}
        <span className="kpi-unit">{unit}</span>
      </div>
    </div>
  )
}
