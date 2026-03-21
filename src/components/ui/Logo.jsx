import logoSrc from '../../assets/logoagendaya.png'

/*
  PNG 500×500. Área del logo real (medida píxel a píxel):
    top 39% · bottom 31% · left 11% · right 11%
    contenido: 29% alto · 78% ancho

  dark=true  → filter invert+hue-rotate: blanco→negro (invisible sobre #0D0D0D),
                negro texto→blanco, rojo se preserva. Sin contenedor.
  dark=false → logo directo, sin filtros.
*/
function LogoCrop({ height }) {
  // Recorta el espacio blanco del PNG 500×500 sin cortar el logo
  // Left muy conservador (0%) para nunca cortar el borde izquierdo del ícono
  const full = height / 0.30   // contenido ocupa ~30% del alto del canvas
  const cTop = full * 0.37     // espacio transparente arriba
  const cLft = 0               // sin recorte izquierdo
  const cWid = full * 0.91     // ancho visible: muestra todo el contenido (texto "Agendaya" llega al 89%)

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

export function LogoFull({ height = 44, dark = false, className = '' }) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        filter: dark ? 'invert(1) hue-rotate(180deg)' : 'none',
      }}
    >
      <LogoCrop height={height} />
    </div>
  )
}

export function SidebarLogo() {
  return (
    <div style={{ display: 'inline-flex', filter: 'invert(1) hue-rotate(180deg)' }}>
      <LogoCrop height={48} />
    </div>
  )
}
