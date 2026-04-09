// Sección 13 — Emisiones GEI: evolución anual (barras + línea tendencia)
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function EmisionesGEIChart({ data = [] }) {
  const svgRef     = useRef(null)
  const tipRef     = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!data.length || !svgRef.current) return

    const W      = wrapperRef.current?.clientWidth || 700
    const H      = 300
    const margin = { top: 24, right: 24, bottom: 48, left: 70 }
    const iW     = W - margin.left - margin.right
    const iH     = H - margin.top  - margin.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const years = data.map(d => d.ano)
    const xBand = d3.scaleBand().domain(years).range([0, iW]).padding(0.25)
    const yMax  = d3.max(data, d => d.valor) * 1.12
    const y     = d3.scaleLinear().domain([0, yMax]).range([iH, 0])

    // Color por valor (más alto = más naranja/rojo)
    const colorScale = d3.scaleSequential()
      .domain([d3.min(data, d => d.valor), d3.max(data, d => d.valor)])
      .interpolator(d3.interpolateRgb('#3B82F6', '#F87171'))

    // Grilla horizontal
    g.append('g').call(d3.axisLeft(y).ticks(5).tickSize(-iW).tickFormat(''))
      .call(ax => { ax.select('.domain').remove(); ax.selectAll('.tick line').attr('stroke', '#1A2B44') })

    // Barras
    g.selectAll('.bar-gei')
      .data(data).join('rect').attr('class', 'bar-gei')
      .attr('x', d => xBand(d.ano))
      .attr('y', d => y(d.valor))
      .attr('width', xBand.bandwidth())
      .attr('height', d => iH - y(d.valor))
      .attr('fill', d => colorScale(d.valor))
      .attr('rx', 3)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('opacity', 0.75)
        const tip = tipRef.current
        if (!tip) return
        tip.innerHTML = `<strong>${d.ano}</strong><br/>
          ${d.valor.toLocaleString('es-DO', { maximumFractionDigits: 1 })} GgCO₂eq`
        tip.style.opacity = 1
        const rect = wrapperRef.current.getBoundingClientRect()
        tip.style.left = `${event.clientX - rect.left + 14}px`
        tip.style.top  = `${event.clientY - rect.top  - 54}px`
      })
      .on('mouseleave', function () {
        d3.select(this).attr('opacity', 1)
        if (tipRef.current) tipRef.current.style.opacity = 0
      })

    // Línea de tendencia
    const lineX = d => xBand(d.ano) + xBand.bandwidth() / 2
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#F59E0B')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5 3')
      .attr('d', d3.line().x(lineX).y(d => y(d.valor)).curve(d3.curveMonotoneX))

    // Puntos sobre la línea
    g.selectAll('.dot-gei')
      .data(data).join('circle')
      .attr('cx', lineX)
      .attr('cy', d => y(d.valor))
      .attr('r', 3)
      .attr('fill', '#F59E0B')
      .attr('stroke', '#0C1220')
      .attr('stroke-width', 1.5)

    // Eje Y
    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${(d / 1000).toFixed(0)}k`))
      .call(ax => {
        ax.select('.domain').attr('stroke', '#1A2B44')
        ax.selectAll('.tick text').attr('fill', '#4D6A99').attr('font-size', '10px')
      })

    // Etiqueta eje Y
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -iH / 2).attr('y', -54)
      .attr('text-anchor', 'middle')
      .attr('fill', '#4D6A99')
      .attr('font-size', '10px')
      .text('GgCO₂eq')

    // Eje X (años)
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
        <div className="legend-item">
          <span className="legend-sq" style={{ background: 'linear-gradient(90deg,#3B82F6,#F87171)' }} />
          Emisiones GEI (GgCO₂eq)
        </div>
        <div className="legend-item">
          <span className="legend-sq" style={{ background: '#F59E0B', height: 2, borderRadius: 0 }} />
          Tendencia
        </div>
      </div>
    </div>
  )
}
