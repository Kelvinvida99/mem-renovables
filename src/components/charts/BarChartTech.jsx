// Sección 2 — Barras horizontales por tecnología con % del SENI
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function BarChartTech({ data = [], unit = 'GWh' }) {
  const svgRef     = useRef(null)
  const tipRef     = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!data.length || !svgRef.current) return

    const W   = wrapperRef.current?.clientWidth || 500
    const margin = { top: 8, right: 70, bottom: 8, left: 130 }
    const rowH = 32
    const H    = data.length * rowH + margin.top + margin.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H)

    const innerW = W - margin.left - margin.right
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear().domain([0, d3.max(data, d => d.valor ?? d.mw)]).range([0, innerW])
    const y = d3.scaleBand().domain(data.map(d => d.tipo)).range([0, H - margin.top - margin.bottom]).padding(0.25)

    // Barras
    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', d => y(d.tipo))
      .attr('height', y.bandwidth())
      .attr('width', d => x(d.valor ?? d.mw))
      .attr('fill', d => d.color)
      .attr('rx', 3)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('opacity', 0.8)
        const tip = tipRef.current
        if (!tip) return
        tip.innerHTML = `<strong>${d.tipo}</strong><br/>${(d.valor ?? d.mw).toFixed(2)} ${unit}&nbsp;&nbsp;${d.pct?.toFixed(2) ?? ''}%`
        tip.style.opacity = 1
        const rect = wrapperRef.current.getBoundingClientRect()
        tip.style.left = `${event.clientX - rect.left + 14}px`
        tip.style.top  = `${event.clientY - rect.top  - 38}px`
      })
      .on('mouseleave', function () {
        d3.select(this).attr('opacity', 1)
        if (tipRef.current) tipRef.current.style.opacity = 0
      })

    // Etiquetas izquierda
    g.selectAll('.label-left')
      .data(data)
      .join('text')
      .attr('class', 'label-left')
      .attr('x', -8)
      .attr('y', d => y(d.tipo) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('fill', '#C8D8F0')
      .attr('font-size', '11px')
      .text(d => d.tipo)

    // Valores derecha
    g.selectAll('.label-val')
      .data(data)
      .join('text')
      .attr('class', 'label-val')
      .attr('x', d => x(d.valor ?? d.mw) + 6)
      .attr('y', d => y(d.tipo) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('fill', '#8BAFD0')
      .attr('font-size', '10.5px')
      .text(d => `${(d.valor ?? d.mw).toFixed(2)} ${unit} · ${d.pct?.toFixed(2) ?? ''}%`)

  }, [data, unit])

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <svg ref={svgRef} />
      <div ref={tipRef} className="d3-tooltip" />
    </div>
  )
}
