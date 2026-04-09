// Sección 8 — ERNC & CMG: barras duales + línea costo marginal (eje dual)
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function CMGChart({ data = [] }) {
  const svgRef     = useRef(null)
  const tipRef     = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!data.length || !svgRef.current) return

    const W      = wrapperRef.current?.clientWidth || 640
    const H      = 300
    const margin = { top: 20, right: 56, bottom: 36, left: 56 }
    const iW     = W - margin.left - margin.right
    const iH     = H - margin.top  - margin.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const hours = data.map(d => String(d.hora))
    const xBand = d3.scaleBand().domain(hours).range([0, iW]).padding(0.15)
    const xMid  = d3.scalePoint().domain(hours).range([xBand.bandwidth() / 2, iW - xBand.bandwidth() / 2])

    const yLeft  = d3.scaleLinear().domain([0, d3.max(data, d => d.seni) * 1.1]).range([iH, 0])
    const yRight = d3.scaleLinear().domain([0, d3.max(data, d => d.cmg)  * 1.15]).range([iH, 0])

    // Grilla
    g.append('g').call(d3.axisLeft(yLeft).ticks(5).tickSize(-iW).tickFormat(''))
      .call(ax => { ax.select('.domain').remove(); ax.selectAll('.tick line').attr('stroke', '#1A2B44') })

    // Barras SENI
    g.selectAll('.bar-seni')
      .data(data).join('rect').attr('class', 'bar-seni')
      .attr('x', d => xBand(String(d.hora)))
      .attr('y', d => yLeft(d.seni))
      .attr('width', xBand.bandwidth())
      .attr('height', d => iH - yLeft(d.seni))
      .attr('fill', '#1E3A5F').attr('rx', 2)

    // Barras ERNC (encima)
    g.selectAll('.bar-ernc')
      .data(data).join('rect').attr('class', 'bar-ernc')
      .attr('x', d => xBand(String(d.hora)))
      .attr('y', d => yLeft(d.ernc))
      .attr('width', xBand.bandwidth())
      .attr('height', d => iH - yLeft(d.ernc))
      .attr('fill', '#10B981').attr('opacity', 0.8).attr('rx', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('opacity', 1)
        const tip = tipRef.current
        if (!tip) return
        tip.innerHTML = `Hora <strong>${d.hora}</strong><br/>SENI: ${d.seni.toLocaleString()} MWh<br/>ERNC: ${d.ernc.toLocaleString()} MWh<br/>CMG: <strong>${d.cmg} US$/MWh</strong>`
        tip.style.opacity = 1
        const rect = wrapperRef.current.getBoundingClientRect()
        tip.style.left = `${event.clientX - rect.left + 14}px`
        tip.style.top  = `${event.clientY - rect.top  - 80}px`
      })
      .on('mouseleave', function () {
        d3.select(this).attr('opacity', 0.8)
        if (tipRef.current) tipRef.current.style.opacity = 0
      })

    // Línea CMG
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#F87171')
      .attr('stroke-width', 2)
      .attr('d', d3.line()
        .x(d => xBand(String(d.hora)) + xBand.bandwidth() / 2)
        .y(d => yRight(d.cmg))
        .curve(d3.curveMonotoneX))

    g.selectAll('.dot-cmg')
      .data(data).join('circle')
      .attr('cx', d => xBand(String(d.hora)) + xBand.bandwidth() / 2)
      .attr('cy', d => yRight(d.cmg))
      .attr('r', 3).attr('fill', '#F87171').attr('stroke', '#0C1220').attr('stroke-width', 1.5)

    // Eje izquierdo (MWh)
    g.append('g').call(d3.axisLeft(yLeft).ticks(5).tickFormat(d => `${d / 1000}k`))
      .call(ax => {
        ax.select('.domain').attr('stroke', '#1A2B44')
        ax.selectAll('.tick text').attr('fill', '#4D6A99').attr('font-size', '10px')
      })

    // Eje derecho (US$/MWh)
    g.append('g').attr('transform', `translate(${iW},0)`)
      .call(d3.axisRight(yRight).ticks(5).tickFormat(d => `$${d}`))
      .call(ax => {
        ax.select('.domain').attr('stroke', '#1A2B44')
        ax.selectAll('.tick text').attr('fill', '#4D6A99').attr('font-size', '10px')
      })

    // Eje X
    g.append('g').attr('transform', `translate(0,${iH})`)
      .call(d3.axisBottom(xBand).tickValues(hours.filter((_, i) => i % 2 === 0)))
      .call(ax => {
        ax.select('.domain').attr('stroke', '#1A2B44')
        ax.selectAll('.tick text').attr('fill', '#4D6A99').attr('font-size', '10px')
      })

  }, [data])

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <svg ref={svgRef} />
      <div ref={tipRef} className="d3-tooltip" />
      <div className="legend">
        <div className="legend-item"><span className="legend-sq" style={{ background: '#1E3A5F' }} /> SENI total (MWh)</div>
        <div className="legend-item"><span className="legend-sq" style={{ background: '#10B981' }} /> ERNC (MWh)</div>
        <div className="legend-item"><span className="legend-sq" style={{ background: '#F87171' }} /> CMG (US$/MWh)</div>
      </div>
    </div>
  )
}
