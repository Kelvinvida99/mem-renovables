// Sección 12 — Vertimiento / Curtailment: Pronóstico (área) + Generación Real (barras) + Vertimiento (puntos rojos)
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function CurtailmentChart({ data = [], totalVertimiento = 0, pctCurtailment = 0 }) {
  const svgRef     = useRef(null)
  const tipRef     = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!data.length || !svgRef.current) return

    const W      = wrapperRef.current?.clientWidth || 640
    const H      = 300
    const margin = { top: 40, right: 20, bottom: 36, left: 54 }
    const iW     = W - margin.left - margin.right
    const iH     = H - margin.top  - margin.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const periodos = data.map(d => d.periodo)
    const xBand = d3.scaleBand().domain(periodos).range([0, iW]).padding(0.12)
    const xMid  = (d) => xBand(d.periodo) + xBand.bandwidth() / 2
    const yMax  = d3.max(data, d => Math.max(d.pronostico, d.generacionReal)) * 1.1
    const y     = d3.scaleLinear().domain([0, yMax]).range([iH, 0])

    // Grilla
    g.append('g').call(d3.axisLeft(y).ticks(5).tickSize(-iW).tickFormat(''))
      .call(ax => { ax.select('.domain').remove(); ax.selectAll('.tick line').attr('stroke', '#1A2B44') })

    // Área Pronóstico (gris suave)
    g.append('path')
      .datum(data)
      .attr('fill', '#3B82F6')
      .attr('opacity', 0.12)
      .attr('d', d3.area().x(xMid).y0(iH).y1(d => y(d.pronostico)).curve(d3.curveMonotoneX))

    // Línea Pronóstico
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3B82F6')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 3')
      .attr('d', d3.line().x(xMid).y(d => y(d.pronostico)).curve(d3.curveMonotoneX))

    // Barras Generación Real — rojas cuando hay vertimiento
    g.selectAll('.bar-real')
      .data(data).join('rect').attr('class', 'bar-real')
      .attr('x', d => xBand(d.periodo))
      .attr('y', d => y(d.generacionReal))
      .attr('width', xBand.bandwidth())
      .attr('height', d => iH - y(d.generacionReal))
      .attr('fill', d => d.vertimientoEstimado > 0 ? '#CE1126' : '#10B981')
      .attr('rx', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('opacity', 0.75)
        const tip = tipRef.current
        if (!tip) return
        tip.innerHTML = `<strong>${d.periodo}</strong><br/>Pronóstico: ${d.pronostico} MWh<br/>Generación Real: ${d.generacionReal} MWh<br/>Vertimiento: <strong style="color:#F87171">${d.vertimientoEstimado} MWh</strong>`
        tip.style.opacity = 1
        const rect = wrapperRef.current.getBoundingClientRect()
        tip.style.left = `${event.clientX - rect.left + 14}px`
        tip.style.top  = `${event.clientY - rect.top  - 80}px`
      })
      .on('mouseleave', function () {
        d3.select(this).attr('opacity', 1)
        if (tipRef.current) tipRef.current.style.opacity = 0
      })

    // Puntos Vertimiento Estimado
    g.selectAll('.dot-vert')
      .data(data.filter(d => d.vertimientoEstimado > 0))
      .join('circle').attr('class', 'dot-vert')
      .attr('cx', xMid)
      .attr('cy', d => y(d.vertimientoEstimado))
      .attr('r', 5)
      .attr('fill', '#F87171')
      .attr('stroke', '#0C1220')
      .attr('stroke-width', 1.5)

    // Etiquetas vertimiento
    g.selectAll('.lbl-vert')
      .data(data.filter(d => d.vertimientoEstimado > 0))
      .join('text').attr('class', 'lbl-vert')
      .attr('x', xMid)
      .attr('y', d => y(d.vertimientoEstimado) - 9)
      .attr('text-anchor', 'middle')
      .attr('fill', '#F87171').attr('font-size', '10px').attr('font-weight', '600')
      .text(d => d.vertimientoEstimado)

    // Ejes
    g.append('g').attr('transform', `translate(0,${iH})`)
      .call(d3.axisBottom(xBand).tickValues(periodos.filter((_, i) => i % 3 === 0)))
      .call(ax => {
        ax.select('.domain').attr('stroke', '#1A2B44')
        ax.selectAll('.tick text').attr('fill', '#4D6A99').attr('font-size', '10px')
      })
    g.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d => d ? `${d}` : '0'))
      .call(ax => {
        ax.select('.domain').attr('stroke', '#1A2B44')
        ax.selectAll('.tick text').attr('fill', '#4D6A99').attr('font-size', '10px')
      })

    // Badges resumen
    const badgeData = [
      { label: 'Vertimiento Total', val: `${totalVertimiento.toFixed(2)} MWh`, color: '#F87171' },
      { label: '% Curtailment',     val: `${pctCurtailment.toFixed(2)}%`,      color: '#F59E0B' },
    ]
    badgeData.forEach((b, i) => {
      const bx = 8 + i * 180
      svg.append('rect').attr('x', bx + margin.left).attr('y', 4).attr('width', 170).attr('height', 28).attr('fill', '#1A2B44').attr('rx', 5)
      svg.append('text').attr('x', bx + margin.left + 10).attr('y', 22).attr('fill', '#8BAFD0').attr('font-size', '10px').text(b.label + ':')
      svg.append('text').attr('x', bx + margin.left + 100).attr('y', 22).attr('fill', b.color).attr('font-size', '11px').attr('font-weight', '700').text(b.val)
    })

  }, [data, totalVertimiento, pctCurtailment])

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <svg ref={svgRef} />
      <div ref={tipRef} className="d3-tooltip" />
      <div className="legend">
        <div className="legend-item"><span className="legend-sq" style={{ background: '#3B82F6', opacity: 0.3, border: '1.5px dashed #3B82F6' }} /> Pronóstico</div>
        <div className="legend-item"><span className="legend-sq" style={{ background: '#10B981' }} /> Generación Real</div>
        <div className="legend-item"><span className="legend-sq" style={{ background: '#CE1126' }} /> Generación c/Vertimiento</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: '#F87171' }} /> Vertimiento Estimado</div>
      </div>
    </div>
  )
}
