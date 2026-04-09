// Sección 7 — Generación Horaria ERNC (área apilada + línea %)
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function HourlyAreaChart({ data = [] }) {
  const svgRef     = useRef(null)
  const tipRef     = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!data.length || !svgRef.current) return

    const W      = wrapperRef.current?.clientWidth || 600
    const H      = 280
    const margin = { top: 20, right: 16, bottom: 36, left: 44 }
    const iW     = W - margin.left - margin.right
    const iH     = H - margin.top  - margin.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear().domain([1, 24]).range([0, iW])
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.pct) * 1.15]).range([iH, 0])

    // Grilla
    g.append('g').call(d3.axisLeft(y).ticks(5).tickSize(-iW).tickFormat(''))
      .call(ax => { ax.select('.domain').remove(); ax.selectAll('.tick line').attr('stroke', '#1A2B44') })

    // Ejes
    g.append('g').attr('transform', `translate(0,${iH})`)
      .call(d3.axisBottom(x).ticks(24).tickFormat(d => `${d}h`))
      .call(ax => {
        ax.select('.domain').attr('stroke', '#1A2B44')
        ax.selectAll('.tick text').attr('fill', '#4D6A99').attr('font-size', '9px')
      })
    g.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`))
      .call(ax => {
        ax.select('.domain').attr('stroke', '#1A2B44')
        ax.selectAll('.tick text').attr('fill', '#4D6A99').attr('font-size', '10px')
      })

    const areaFn = (key) => d3.area()
      .x(d => x(d.hora)).y0(iH).y1(d => y(d[key]))
      .curve(d3.curveMonotoneX)

    // Área Solar (mayor)
    g.append('path').datum(data)
      .attr('fill', '#F59E0B').attr('opacity', 0.25)
      .attr('d', areaFn('solar'))

    // Área Eólica
    g.append('path').datum(data)
      .attr('fill', '#10B981').attr('opacity', 0.35)
      .attr('d', areaFn('eolica'))

    // Línea % ERNC total
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#A78BFA')
      .attr('stroke-width', 2.5)
      .attr('d', d3.line().x(d => x(d.hora)).y(d => y(d.pct)).curve(d3.curveMonotoneX))

    // Puntos con tooltip en % ERNC
    g.selectAll('.dot')
      .data(data)
      .join('circle')
      .attr('cx', d => x(d.hora))
      .attr('cy', d => y(d.pct))
      .attr('r', 3.5)
      .attr('fill', '#A78BFA')
      .attr('stroke', '#0C1220')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('r', 5.5)
        const tip = tipRef.current
        if (!tip) return
        tip.innerHTML = `Hora <strong>${d.hora}</strong><br/>ERNC: <strong>${d.pct}%</strong><br/>Solar: ${d.solar}% · Eólica: ${d.eolica}%`
        tip.style.opacity = 1
        const rect = wrapperRef.current.getBoundingClientRect()
        tip.style.left = `${event.clientX - rect.left + 14}px`
        tip.style.top  = `${event.clientY - rect.top  - 60}px`
      })
      .on('mouseleave', function () {
        d3.select(this).attr('r', 3.5)
        if (tipRef.current) tipRef.current.style.opacity = 0
      })

    // Etiqueta máximo
    const maxD = data.reduce((a, b) => b.pct > a.pct ? b : a)
    const badgeW = 90, badgeH = 24
    const bx = Math.min(x(maxD.hora), iW - badgeW)
    const by = y(maxD.pct) - badgeH - 6
    g.append('rect').attr('x', bx).attr('y', by).attr('width', badgeW).attr('height', badgeH)
      .attr('fill', '#1A2B44').attr('rx', 4)
    g.append('text').attr('x', bx + badgeW / 2).attr('y', by + badgeH / 2 + 1)
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
      .attr('fill', '#A78BFA').attr('font-size', '11px').attr('font-weight', '600')
      .text(`ERNC máx ${maxD.pct}%`)

  }, [data])

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <svg ref={svgRef} />
      <div ref={tipRef} className="d3-tooltip" />
      <div className="legend">
        <div className="legend-item"><span className="legend-sq" style={{ background: '#A78BFA' }} /> % ERNC total</div>
        <div className="legend-item"><span className="legend-sq" style={{ background: '#F59E0B', opacity: 0.5 }} /> Solar FV</div>
        <div className="legend-item"><span className="legend-sq" style={{ background: '#10B981', opacity: 0.5 }} /> Eólica</div>
      </div>
    </div>
  )
}
