import { useId } from 'react'

/*
  Logo SVG nativo — sin PNG, sin filtros, sin cápsulas.
  Diseño flat minimalista inspirado en Stripe / Linear / Notion.

  CalendarIcon: ícono compacto calendario + check
  LogoFull:     ícono + texto horizontal  (dark=true para fondos oscuros)
  LogoIcon:     solo ícono               (favicon, apps)
  SidebarLogo:  versión sidebar           (dark, tamaño compacto)
*/

function CalendarIcon({ size = 40, dark = false }) {
  const uid = useId()
  const clipId = `cal-${uid}`

  /* Paleta según fondo */
  const bodyFill   = dark ? '#1C1C1C' : '#FFFFFF'
  const bodyStroke = dark ? '#333333' : '#D1D5DB'
  const headFill   = dark ? '#EFEFEF' : '#111111'
  const headText   = dark ? '#111111' : '#FFFFFF'   // para las líneas del header si las necesitas
  const pegFill    = '#C0392B'
  const checkColor = '#C0392B'

  /* ViewBox 30 × 36: cuerpo 30×30 (y=6..36) + pegs que sobresalen arriba */
  const W = 30, H = 36
  const iW = Math.round(size * (W / H))

  return (
    <svg
      width={iW}
      height={size}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="6" width="30" height="30" rx="4.5" />
        </clipPath>
      </defs>

      {/* ── Pegs (anclajes de espiral) ── */}
      <rect x="7"  y="0" width="4" height="9" rx="2" fill={pegFill} />
      <rect x="19" y="0" width="4" height="9" rx="2" fill={pegFill} />

      {/* ── Cuerpo del calendario ── */}
      <rect
        x="0" y="6" width="30" height="30" rx="4.5"
        fill={bodyFill}
        stroke={bodyStroke}
        strokeWidth="1.5"
      />

      {/* ── Header oscuro (clipeado al cuerpo) ── */}
      <rect
        x="0" y="6" width="30" height="11"
        fill={headFill}
        clipPath={`url(#${clipId})`}
      />

      {/* ── Checkmark ── */}
      <path
        d="M6 24 L11.5 29.5 L24 18"
        stroke={checkColor}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ════════════════════════════════════
   LogoFull — ícono + texto horizontal
   ════════════════════════════════════ */
export function LogoFull({ height = 40, dark = false, className = '' }) {
  const textColor = dark ? '#FFFFFF' : '#111111'
  const fontSize  = Math.round(height * 0.50)
  const gap       = Math.round(height * 0.30)

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap,
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      <CalendarIcon size={height} dark={dark} />
      <span
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize,
          fontWeight: 600,
          letterSpacing: '-0.03em',
          color: textColor,
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        Agenda
        <span style={{ color: '#C0392B', fontWeight: 700 }}>Ya</span>
      </span>
    </div>
  )
}

/* ════════════════════════════════
   LogoIcon — solo ícono (favicon)
   ════════════════════════════════ */
export function LogoIcon({ size = 32, dark = false }) {
  return <CalendarIcon size={size} dark={dark} />
}

/* ════════════════════════════════
   SidebarLogo — sidebar oscuro
   ════════════════════════════════ */
export function SidebarLogo() {
  return <LogoFull height={36} dark />
}
