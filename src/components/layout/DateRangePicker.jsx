export default function DateRangePicker({ desde, hasta, onDesde, onHasta, onApply }) {
  return (
    <div className="date-picker">
      <label htmlFor="dp-desde">Desde</label>
      <input
        id="dp-desde"
        type="date"
        value={desde}
        max={hasta}
        onChange={e => onDesde(e.target.value)}
      />
      <label htmlFor="dp-hasta">Hasta</label>
      <input
        id="dp-hasta"
        type="date"
        value={hasta}
        min={desde}
        onChange={e => onHasta(e.target.value)}
      />
      <button onClick={onApply}>Consultar</button>
    </div>
  )
}
