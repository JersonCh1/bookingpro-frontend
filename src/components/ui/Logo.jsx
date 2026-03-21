import logoSrc from '../../assets/logoagendaya.png'

/*
  El PNG es 500×500 con espacio transparente:
    top ~28%  bottom ~22%  left ~8%  right ~12%
  LogoCrop recorta ese espacio para que el logo llene exactamente el height pedido.

  dark=true → contenedor premium con gradiente cálido + glow rojo
  dark=false → logo directo sobre fondo claro
*/

function LogoCrop({ height }) {
  const fullH   = height / 0.50
  const cropTop = fullH * 0.28
  const cropLft = fullH * 0.08
  const width   = fullH * 0.80

  return (
    <div style={{ width, height, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
      <img
        src={logoSrc}
        alt='AgendaYa'
        draggable={false}
        style={{
          height: fullH,
          width: 'auto',
          position: 'absolute',
          top: -cropTop,
          left: -cropLft,
        }}
      />
    </div>
  )
}

/* Contenedor estético para fondos oscuros */
function DarkPill({ children }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 14,
      padding: '6px 16px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(250,243,240,0.97) 100%)',
      border: '1px solid rgba(192,57,43,0.22)',
      boxShadow: `
        0 0 0 1px rgba(192,57,43,0.08),
        0 4px 16px rgba(0,0,0,0.35),
        0 0 28px rgba(192,57,43,0.14)
      `,
    }}>
      {children}
    </div>
  )
}

export function LogoFull({ height = 40, dark = false, className = '' }) {
  const logo = <LogoCrop height={height} />
  if (dark) return <DarkPill>{logo}</DarkPill>
  return <div className={className} style={{ display: 'inline-flex' }}>{logo}</div>
}

export function SidebarLogo() {
  return (
    <DarkPill>
      <LogoCrop height={28} />
    </DarkPill>
  )
}
