// Sección 14 — Evolución Renovables: barras apiladas por año
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const SERIES = [
  { key: 'hidro',   label: 'Hidro',    color: '#3B82F6' },
  { key: 'eolica',  label: 'Eólica',   color: '#10B981' },
  { key: 'biomasa', label: 'Biomasa',  color: '#F97316' },
  { key: 'solar',   label: 'Solar FV', color: '#F59E0B' },
]

export default function RenovableEvolucionChart({ data = [] }) {
  const svgRef     = useRef(null)
  const tipRef     = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!data.length || !svgRef.current) return

    const W      = wrapperRef.current?.clientWidth || 700
    const H      = 320
    const margin = { top: 20, right: 20, bottom: 50, left: 64 }
    const iW     = W - margin.left - margin.right
    const iH     = H - margin.top  - margin.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    // Apilar: hidro + eolica + biomasa + solar
    const stackGen = d3.stack().keys(SERIES.map(s => s.key))
    const stacked  = stackGen(data)

    const xBand = d3.scaleBand()
      .domain(data.map(d => String(d.ano)))
      .range([0, iW]).padding(0.2)

    const yMax = d3.max(data, d => d.hidro + d.eolica + d.biomasa + d.solar) * 1.1
    const y    = d3.scaleLinear().domain([0, yMax]).range([iH, 0])

    // Grilla
    g.append('g').call(d3.axisLeft(y).ticks(5).tickSize(-iW).tickFormat(''))
      .call(ax => { ax.select('.domain').remove(); ax.selectAll('.tick line').attr('stroke', '#1A2B44') })

    // Barras apiladas
    stacked.forEach((layer, li) => {
      const { color, label, key } = SERIES[li]
      g.selectAll(`.bar-${key}`)
        .data(layer).join('rect').attr('class', `bar-${key}`)
        .attr('x', d => xBand(String(d.data.ano)))
        .attr('y', d => y(d[1]))
        .attr('height', d => Math.max(0, y(d[0]) - y(d[1])))
        .attr('width', xBand.bandwidth())
        .attr('fill', color)
        .style('cursor', 'pointer')
        .on('mouseenter', function (event, d) {
          d3.select(this).attr('opacity', 0.75)
          const tip = tipRef.current
          if (!tip) return
          const total = (d.data.hidro + d.data.eolica + d.data.biomasa + d.data.solar).toFixed(1)
          tip.innerHTML = `<strong>${d.data.ano}</strong><br/>
            ${label}: <strong>${d.data[key].toFixed(1)} GWh</strong><br/>
            Total renovables: ${total} GWh`
          tip.style.opacity = 1
          const rect = wrapperRef.current.getBoundingClientRect()
          tip.style.left = `${event.clientX - rect.left + 14}px`
          tip.style.top  = `${event.clientY - rect.top  - 70}px`
        })
        .on('mouseleave', function () {
          d3.select(this).attr('opacity', 1)
          if (tipRef.current) tipRef.current.style.opacity = 0
        })
    })

    // Eje Y
    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d.toFixed(0)}`))
      .call(ax => {
        ax.select('.domain').attr('stroke', '#1A2B44')
        ax.selectAll('.tick text').attr('fill', '#4D6A99').attr('font-size', '10px')
      })

    // Etiqueta eje Y
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -iH / 2).attr('y', -50)
      .attr('text-anchor', 'middle')
      .attr('fill', '#4D6A99')
      .attr('font-size', '10px')
      .text('GWh / año')

    // Eje X
    g.append('g').attr('transform', `translate(0,${iH})`)
      .call(d3.axisBottom(xBand).tickSize(0))
      .call(ax => {
        ax.select('.domain').attr('stroke', '#1A2B44')
        ax.selectAll('.tick text')
          .attr('fill', '#4D6A99').attr('font-size', '10px')
          .attr('transform', 'rotate(-35)').attr('text-anchor', 'end')
          .attr('dx', '-4px').attr('dy', '2px')
      })

  }, [data])

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <svg ref={svgRef} />
      <div ref={tipRef} className="d3-tooltip" />
      <div className="legend">
        {SERIES.slice().reverse().map(({ key, label, color }) => (
          <div key={key} className="legend-item">
            <span className="legend-sq" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
