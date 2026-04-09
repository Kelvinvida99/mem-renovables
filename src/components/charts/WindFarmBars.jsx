// Sección 10 — Eólica por central (barras horizontales)
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function WindFarmBars({ data = [] }) {
  const svgRef     = useRef(null)
  const tipRef     = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!data.length || !svgRef.current) return

    // Ordenar ascendente (el PDF los muestra así)
    const sorted = [...data].sort((a, b) => a.valor - b.valor)

    const W      = wrapperRef.current?.clientWidth || 520
    const rowH   = 28
    const margin = { top: 8, right: 90, bottom: 24, left: 175 }
    const H      = sorted.length * rowH + margin.top + margin.bottom
    const iW     = W - margin.left - margin.right

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear().domain([0, d3.max(sorted, d => d.valor) * 1.1]).range([0, iW])
    const y = d3.scaleBand().domain(sorted.map(d => d.central)).range([0, H - margin.top - margin.bottom]).padding(0.2)

    // Fondo alternado
    g.selectAll('.row-bg')
      .data(sorted).join('rect').attr('class', 'row-bg')
      .attr('x', -margin.left).attr('width', W)
      .attr('y', d => y(d.central)).attr('height', y.bandwidth() + y.step() * y.paddingInner())
      .attr('fill', (_, i) => i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent')

    g.selectAll('.bar')
      .data(sorted).join('rect').attr('class', 'bar')
      .attr('y', d => y(d.central))
      .attr('height', y.bandwidth())
      .attr('x', 0).attr('width', d => x(d.valor))
      .attr('fill', '#10B981').attr('rx', 3)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('opacity', 0.75)
        const tip = tipRef.current
        if (!tip) return
        tip.innerHTML = `<strong>${d.central}</strong><br/>${d.valor.toFixed(1)} MWh`
        tip.style.opacity = 1
        const rect = wrapperRef.current.getBoundingClientRect()
        tip.style.left = `${event.clientX - rect.left + 14}px`
        tip.style.top  = `${event.clientY - rect.top  - 44}px`
      })
      .on('mouseleave', function () {
        d3.select(this).attr('opacity', 1)
        if (tipRef.current) tipRef.current.style.opacity = 0
      })

    // Etiquetas
    g.selectAll('.lbl')
      .data(sorted).join('text').attr('class', 'lbl')
      .attr('x', -8).attr('y', d => y(d.central) + y.bandwidth() / 2)
      .attr('dy', '0.35em').attr('text-anchor', 'end')
      .attr('fill', '#C8D8F0').attr('font-size', '10.5px')
      .text(d => d.central)

    g.selectAll('.val')
      .data(sorted).join('text').attr('class', 'val')
      .attr('x', d => x(d.valor) + 6).attr('y', d => y(d.central) + y.bandwidth() / 2)
      .attr('dy', '0.35em').attr('fill', '#10B981')
      .attr('font-size', '10px').attr('font-weight', '600')
      .text(d => `${d.valor.toFixed(1)} MWh`)

    // Eje X
    g.append('g').attr('transform', `translate(0,${H - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(4).tickFormat(d => `${d} MWh`))
      .call(ax => {
        ax.select('.domain').attr('stroke', '#1A2B44')
        ax.selectAll('.tick text').attr('fill', '#4D6A99').attr('font-size', '9.5px')
      })

  }, [data])

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <svg ref={svgRef} />
      <div ref={tipRef} className="d3-tooltip" />
    </div>
  )
}
