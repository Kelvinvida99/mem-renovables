// Sección 3 — Distribución Geográfica (mapa estilizado República Dominicana)
// SVG simplificado con las 3 macro-regiones del SENI

export default function GeoMap({ data }) {
  if (!data) return null

  const { norte, este, sur } = data

  const RegionCard = ({ title, region, cx, cy, fill }) => (
    <g>
      <circle cx={cx} cy={cy} r={10} fill={fill} opacity={0.9} />
      <circle cx={cx} cy={cy} r={14} fill={fill} opacity={0.2} />
    </g>
  )

  const techColor = { 'SOLAR': '#F59E0B', 'EÓLICA': '#10B981', 'BIOMASA': '#F97316', 'HIDRO': '#3B82F6' }

  const InfoCard = ({ region, title, x, y }) => {
    const lineH = 16
    return (
      <g>
        <rect x={x} y={y} width={220} height={region.plantas.length * lineH + 56} rx={6}
          fill="#111D2E" stroke="#1A2B44" strokeWidth={1} />
        <text x={x + 10} y={y + 18} fill="#E8F0FF" fontSize={12} fontWeight={700}>{title}</text>
        <text x={x + 10} y={y + 32} fill="#4D6A99" fontSize={10}>
          Cap: {region.capacidad.toLocaleString()} MW · {region.pct}% ({region.energia} GWh)
        </text>
        {region.plantas.map((p, i) => (
          <g key={p.tipo}>
            <rect x={x + 10} y={y + 44 + i * lineH} width={8} height={8} rx={2} fill={techColor[p.tipo] ?? '#888'} />
            <text x={x + 24} y={y + 52 + i * lineH} fill="#C8D8F0" fontSize={10}>
              {p.tipo}: {p.capacidad.toLocaleString()} MW · {p.energia} GWh
            </text>
          </g>
        ))}
      </g>
    )
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg viewBox="0 0 760 380" width="100%" style={{ display: 'block' }}>
        {/* República Dominicana — contorno simplificado */}
        <g transform="translate(20, 10)">
          {/* Contorno aproximado DR (forma rectangular-ovalada inclinada) */}
          <ellipse cx={330} cy={185} rx={265} ry={140} fill="#0C1220" stroke="#1A2B44" strokeWidth={1.5} />

          {/* Región Norte */}
          <path d="M80,100 Q200,60 330,90 Q380,95 420,110 Q350,130 280,135 Q190,140 80,125 Z"
            fill="#10B981" opacity={0.18} stroke="#10B981" strokeWidth={1} />

          {/* Región Este */}
          <path d="M330,90 Q450,85 540,120 Q580,140 590,185 Q560,220 500,235 Q420,230 380,200 Q340,170 330,130 Z"
            fill="#F59E0B" opacity={0.18} stroke="#F59E0B" strokeWidth={1} />

          {/* Región Sur */}
          <path d="M80,125 Q190,140 330,130 Q380,200 500,235 Q420,260 330,270 Q210,275 110,240 Q65,210 65,175 Z"
            fill="#3B82F6" opacity={0.18} stroke="#3B82F6" strokeWidth={1} />

          {/* Puntos de región */}
          <circle cx={220} cy={115} r={8} fill="#10B981" opacity={0.9} />
          <circle cx={220} cy={115} r={14} fill="#10B981" opacity={0.15} />
          <text x={220} y={97} textAnchor="middle" fill="#10B981" fontSize={11} fontWeight={700}>Norte</text>

          <circle cx={460} cy={165} r={8} fill="#F59E0B" opacity={0.9} />
          <circle cx={460} cy={165} r={14} fill="#F59E0B" opacity={0.15} />
          <text x={460} y={147} textAnchor="middle" fill="#F59E0B" fontSize={11} fontWeight={700}>Este</text>

          <circle cx={240} cy={215} r={8} fill="#3B82F6" opacity={0.9} />
          <circle cx={240} cy={215} r={14} fill="#3B82F6" opacity={0.15} />
          <text x={240} y={240} textAnchor="middle" fill="#3B82F6" fontSize={11} fontWeight={700}>Sur</text>

          {/* Líneas de conexión a tarjetas */}
          <line x1={220} y1={103} x2={515} y2={55} stroke="#10B981" strokeWidth={0.8} strokeDasharray="3 3" opacity={0.5} />
          <line x1={460} y1={151} x2={515} y2={148} stroke="#F59E0B" strokeWidth={0.8} strokeDasharray="3 3" opacity={0.5} />
          <line x1={240} y1={223} x2={515} y2={260} stroke="#3B82F6" strokeWidth={0.8} strokeDasharray="3 3" opacity={0.5} />
        </g>

        {/* Tarjetas de información */}
        <InfoCard region={norte} title="Región Norte" x={515} y={26} />
        <InfoCard region={este}  title="Región Este"  x={515} y={120} />
        <InfoCard region={sur}   title="Región Sur"   x={515} y={240} />

        {/* Total SENI en mapa */}
        <rect x={27} y={308} width={240} height={50} rx={6} fill="#111D2E" stroke="#1A2B44" strokeWidth={1} />
        <text x={147} y={326} textAnchor="middle" fill="#4D6A99" fontSize={10} fontWeight={600}>TOTAL ERNC (NORTE+ESTE+SUR)</text>
        <text x={147} y={346} textAnchor="middle" fill="#E8F0FF" fontSize={13} fontWeight={700}>
          {(norte.energia + este.energia + sur.energia).toFixed(2)} GWh
        </text>
        <text x={147} y={358} textAnchor="middle" fill="#4D6A99" fontSize={9.5}>
          Cap: {(norte.capacidad + este.capacidad + sur.capacidad).toLocaleString()} MW instalados
        </text>
      </svg>
    </div>
  )
}
