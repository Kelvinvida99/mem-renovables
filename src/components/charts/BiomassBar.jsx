// Sección 9 — Biomasa por central (barra horizontal)
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function BiomassBar({ data = [] }) {
  const svgRef     = useRef(null)
  const tipRef     = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!data.length || !svgRef.current) return

    const W      = wrapperRef.current?.clientWidth || 500
    const rowH   = 44
    const margin = { top: 8, right: 100, bottom: 16, left: 240 }
    const H      = data.length * rowH + margin.top + margin.bottom
    const iW     = W - margin.left - margin.right

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', '100%').attr('height', H)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear().domain([0, d3.max(data, d => d.valor) * 1.1]).range([0, iW])
    const y = d3.scaleBand().domain(data.map(d => d.central)).range([0, H - margin.top - margin.bottom]).padding(0.3)

    g.selectAll('.bar')
      .data(data).join('rect').attr('class', 'bar')
      .attr('y', d => y(d.central))
      .attr('height', y.bandwidth())
      .attr('x', 0).attr('width', d => x(d.valor))
      .attr('fill', '#F97316').attr('rx', 4)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('opacity', 0.75)
        const tip = tipRef.current
        if (!tip) return
        tip.innerHTML = `<strong>${d.central}</strong><br/>${d.valor.toFixed(2)} MWh`
        tip.style.opacity = 1
        const rect = wrapperRef.current.getBoundingClientRect()
        tip.style.left = `${event.clientX - rect.left + 14}px`
        tip.style.top  = `${event.clientY - rect.top  - 44}px`
      })
      .on('mouseleave', function () {
        d3.select(this).attr('opacity', 1)
        if (tipRef.current) tipRef.current.style.opacity = 0
      })

    // Etiquetas izquierda
    g.selectAll('.lbl')
      .data(data).join('text').attr('class', 'lbl')
      .attr('x', -8)
      .attr('y', d => y(d.central) + y.bandwidth() / 2)
      .attr('dy', '0.35em').attr('text-anchor', 'end')
      .attr('fill', '#C8D8F0').attr('font-size', '11px')
      .text(d => d.central)

    // Valores derecha
    g.selectAll('.val')
      .data(data).join('text').attr('class', 'val')
      .attr('x', d => x(d.valor) + 8)
      .attr('y', d => y(d.central) + y.bandwidth() / 2)
      .attr('dy', '0.35em').attr('fill', '#F97316')
      .attr('font-size', '12px').attr('font-weight', '700')
      .text(d => `${d.valor.toFixed(2)} MWh`)

  }, [data])

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <svg ref={svgRef} />
      <div ref={tipRef} className="d3-tooltip" />
    </div>
  )
}
