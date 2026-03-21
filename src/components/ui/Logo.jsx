import logoSrc from '../../assets/logoagendaya.png'

/*
  PNG 500×500 — mediciones exactas del contenido real:
    top margin:    39%   (pegs del calendario empiezan en y≈195/500)
    bottom margin: 31%   (texto termina en y≈345/500)
    left margin:   11%   (calendario empieza en x≈55/500)
    right margin:  11%   (texto termina en x≈445/500)
    content height: 29%  (150px de 500)
    content width:  78%  (390px de 500)
*/
function LogoCrop({ height }) {
  const full = height / 0.29          // imagen al tamaño que hace al contenido medir `height`
  const cTop = full * 0.39            // recortar margen superior
  const cLft = full * 0.11            // recortar margen izquierdo
  const cWid = full * 0.78            // ancho visible del contenido

  return (
    <div style={{ width: cWid, height, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
      <img
        src={logoSrc}
        alt='AgendaYa'
        draggable={false}
        style={{ height: full, width: 'auto', position: 'absolute', top: -cTop, left: -cLft }}
      />
    </div>
  )
}

/* Pill estético para fondos oscuros: gradiente cálido + glow rojo, padding mínimo */
function DarkPill({ height, children }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 10,
      padding: `${Math.round(height * 0.06)}px ${Math.round(height * 0.14)}px`,
      background: 'linear-gradient(135deg, #ffffff 0%, #fdf5f3 100%)',
      border: '1px solid rgba(192,57,43,0.18)',
      boxShadow: '0 0 0 1px rgba(192,57,43,0.06), 0 2px 12px rgba(0,0,0,0.3), 0 0 22px rgba(192,57,43,0.12)',
    }}>
      {children}
    </div>
  )
}

export function LogoFull({ height = 44, dark = false, className = '' }) {
  if (dark) {
    return (
      <DarkPill height={height}>
        <LogoCrop height={height} />
      </DarkPill>
    )
  }
  return (
    <div className={className} style={{ display: 'inline-flex' }}>
      <LogoCrop height={height} />
    </div>
  )
}

export function SidebarLogo() {
  return (
    <DarkPill height={30}>
      <LogoCrop height={30} />
    </DarkPill>
  )
}
