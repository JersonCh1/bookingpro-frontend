import logoSrc from '../../assets/logoagendaya.png'

/*
  El PNG es 500×500 pero el logo real ocupa ~50% del alto y ~80% del ancho,
  centrado en el canvas. Usamos un contenedor con overflow:hidden para recortar
  el espacio transparente y mostrar solo el logo real.

  Medidas aproximadas del área de contenido dentro del 500×500:
    top:  28%   bottom: 22%   left: 8%   right: 12%
  → contenido: 50% de alto, 80% de ancho
*/
function LogoCrop({ height, style = {} }) {
  const fullH  = height / 0.50          // imagen ampliada para que contenido mida `height`
  const cropT  = fullH * 0.28           // recorte superior
  const cropL  = fullH * 0.08           // recorte izquierdo
  const width  = fullH * 0.80           // ancho visible del contenido

  return (
    <div style={{ width, height, overflow: 'hidden', position: 'relative', flexShrink: 0, ...style }}>
      <img
        src={logoSrc}
        alt='AgendaYa'
        draggable={false}
        style={{
          height: fullH,
          width: 'auto',
          position: 'absolute',
          top:  -cropT,
          left: -cropL,
        }}
      />
    </div>
  )
}

/* dark=true → fondo oscuro: cápsula blanca mínima para mantener colores reales */
export function LogoFull({ height = 44, dark = false, className = '' }) {
  if (dark) {
    return (
      <div
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: 10,
          padding: '4px 12px',
        }}
      >
        <LogoCrop height={height} />
      </div>
    )
  }
  return <LogoCrop height={height} />
}

/* Sidebar */
export function SidebarLogo() {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 8,
      padding: '4px 10px',
    }}>
      <LogoCrop height={36} />
    </div>
  )
}
