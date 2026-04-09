export default function Header({ reportDate, updatedAt }) {
  const fmt = (iso) => iso
    ? new Date(iso).toLocaleString('es-DO', { dateStyle: 'medium', timeStyle: 'short' })
    : '—'

  return (
    <div className="main-header-left">
      <h1>Reporte Diario de Energías Renovables — SENI</h1>
      <p>
        {reportDate
          ? `Fecha del reporte: ${new Date(reportDate + 'T12:00:00').toLocaleDateString('es-DO', { dateStyle: 'full' })}`
          : 'Sistema Eléctrico Nacional Interconectado · República Dominicana'}
        {updatedAt && <> &nbsp;·&nbsp; Actualizado: {fmt(updatedAt)}</>}
      </p>
    </div>
  )
}
