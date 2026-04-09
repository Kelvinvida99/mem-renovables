// Secciones 1, 2 y 4 — Donut chart D3
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function DonutChart({ data = [], centerLabel = '', centerValue = '', unit = 'GWh' }) {
  const svgRef     = useRef(null)
  const tipRef     = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!data.length || !svgRef.current) return

    const wrapper = wrapperRef.current
    const W = wrapper?.clientWidth || 380
    const H = 320
    const R = Math.min(W * 0.42, H * 0.42)

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H)

    const g = svg.append('g').attr('transform', `translate(${W / 2},${H / 2})`)

    const pie = d3.pie().value(d => d.valor ?? d.mw).sort(null).padAngle(0.025)
    const arc      = d3.arc().innerRadius(R * 0.54).outerRadius(R)
    const arcHover = d3.arc().innerRadius(R * 0.54).outerRadius(R + 7)

    const total = d3.sum(data, d => d.valor ?? d.mw)

    const paths = g.selectAll('.arc')
      .data(pie(data))
      .join('g').attr('class', 'arc')

    paths.append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .attr('stroke', '#0C1220')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).transition().duration(120).attr('d', arcHover)
        const tip = tipRef.current
        if (!tip) return
        const val = (d.data.valor ?? d.data.mw) ?? 0
        tip.innerHTML = `<strong>${d.data.tipo ?? d.data.label}</strong><br/>${val.toFixed(2)} ${unit}<br/>${((val / total) * 100).toFixed(2)}%`
        tip.style.opacity = 1
        const rect = wrapper.getBoundingClientRect()
        tip.style.left = `${event.clientX - rect.left + 14}px`
        tip.style.top  = `${event.clientY - rect.top  - 38}px`
      })
      .on('mouseleave', function () {
        d3.select(this).transition().duration(120).attr('d', arc)
        if (tipRef.current) tipRef.current.style.opacity = 0
      })

    // Texto central
    g.append('text').attr('text-anchor', 'middle').attr('dy', '-0.5em')
      .text(centerValue || total.toFixed(2))
      .attr('fill', '#E8F0FF').attr('font-size', '18px').attr('font-weight', '700')

    g.append('text').attr('text-anchor', 'middle').attr('dy', '1.1em')
      .text(centerLabel || unit)
      .attr('fill', '#4D6A99').attr('font-size', '12px')

  }, [data, centerLabel, centerValue, unit])

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <svg ref={svgRef} />
      <div ref={tipRef} className="d3-tooltip" />
      {/* Leyenda */}
      <div className="legend">
        {data.map(d => (
          <div key={d.tipo ?? d.label} className="legend-item">
            <span className="legend-dot" style={{ background: d.color }} />
            <span>{d.tipo ?? d.label}</span>
            <span style={{ color: '#E8F0FF', marginLeft: 4 }}>
              {(d.valor ?? d.mw)?.toFixed(2)} {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
