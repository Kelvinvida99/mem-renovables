// Sección 6 — Registro mensual EERR últimos 12 meses (líneas)
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function LineChart12M({ data = [] }) {
  const svgRef     = useRef(null)
  const tipRef     = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!data.length || !svgRef.current) return

    const W      = wrapperRef.current?.clientWidth || 600
    const H      = 280
    const margin = { top: 24, right: 24, bottom: 50, left: 44 }
    const iW     = W - margin.left - margin.right
    const iH     = H - margin.top  - margin.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scalePoint().domain(data.map(d => d.mes)).range([0, iW])
    const yMax = d3.max(data, d => Math.max(d.hidro, d.eerrnc)) * 1.15
    const y = d3.scaleLinear().domain([0, yMax]).range([iH, 0])

    // Grilla
    g.append('g').attr('class', 'grid')
      .call(d3.axisLeft(y).ticks(5).tickSize(-iW).tickFormat(''))
      .call(ax => { ax.select('.domain').remove(); ax.selectAll('.tick line').attr('stroke', '#1A2B44') })

    // Ejes
    g.append('g').attr('transform', `translate(0,${iH})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call(ax => {
        ax.select('.domain').attr('stroke', '#1A2B44')
        ax.selectAll('.tick text').attr('fill', '#4D6A99').attr('font-size', '10px')
          .attr('transform', 'rotate(-35)').attr('text-anchor', 'end').attr('dy', '0em').attr('dx', '-6px')
      })

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`))
      .call(ax => {
        ax.select('.domain').attr('stroke', '#1A2B44')
        ax.selectAll('.tick text').attr('fill', '#4D6A99').attr('font-size', '10px')
      })

    const lineFn = key => d3.line().x(d => x(d.mes)).y(d => y(d[key])).curve(d3.curveMonotoneX)

    const series = [
      { key: 'eerrnc', color: '#F59E0B', label: 'EERRNC' },
      { key: 'hidro',  color: '#3B82F6', label: 'Hidro'  },
    ]

    series.forEach(({ key, color, label }) => {
      // Área suave
      const area = d3.area()
        .x(d => x(d.mes))
        .y0(iH)
        .y1(d => y(d[key]))
        .curve(d3.curveMonotoneX)
      g.append('path').datum(data).attr('fill', color).attr('opacity', 0.06).attr('d', area)

      // Línea
      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', lineFn(key))

      // Puntos con tooltip
      g.selectAll(`.dot-${key}`)
        .data(data)
        .join('circle')
        .attr('class', `dot-${key}`)
        .attr('cx', d => x(d.mes))
        .attr('cy', d => y(d[key]))
        .attr('r', 4)
        .attr('fill', color)
        .attr('stroke', '#0C1220')
        .attr('stroke-width', 1.5)
        .style('cursor', 'pointer')
        .on('mouseenter', function (event, d) {
          d3.select(this).attr('r', 6)
          const tip = tipRef.current
          if (!tip) return
          tip.innerHTML = `<strong>${d.mes}</strong><br/>${label}: <strong>${d[key]}%</strong>`
          tip.style.opacity = 1
          const rect = wrapperRef.current.getBoundingClientRect()
          tip.style.left = `${event.clientX - rect.left + 14}px`
          tip.style.top  = `${event.clientY - rect.top  - 44}px`
        })
        .on('mouseleave', function () {
          d3.select(this).attr('r', 4)
          if (tipRef.current) tipRef.current.style.opacity = 0
        })

      // Etiquetas de valores
      g.selectAll(`.lbl-${key}`)
        .data(data)
        .join('text')
        .attr('class', `lbl-${key}`)
        .attr('x', d => x(d.mes))
        .attr('y', d => y(d[key]) - 9)
        .attr('text-anchor', 'middle')
        .attr('fill', color)
        .attr('font-size', '9.5px')
        .text(d => `${d[key]}%`)
    })

  }, [data])

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <svg ref={svgRef} />
      <div ref={tipRef} className="d3-tooltip" />
      <div className="legend">
        <div className="legend-item"><span className="legend-dot" style={{ background: '#F59E0B' }} /> EERRNC</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: '#3B82F6' }} /> Hidro</div>
      </div>
    </div>
  )
}
