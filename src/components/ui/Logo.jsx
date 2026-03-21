import logoSrc from '../../assets/logoagendaya.png'

/*
  El logo PNG tiene fondo transparente con elementos negros.

  dark=false  → fondo claro: logo directo sin filtros
  dark=true   → fondo oscuro: logo invertido a blanco con filter
*/

export function LogoFull({ height = 44, dark = false, className = '' }) {
  return (
    <img
      src={logoSrc}
      alt='AgendaYa'
      draggable={false}
      className={className}
      style={{
        height,
        width: 'auto',
        display: 'block',
        filter: dark ? 'brightness(0) invert(1)' : 'none',
      }}
    />
  )
}

/* Sidebar: logo blanco directo sobre fondo oscuro */
export function SidebarLogo() {
  return (
    <img
      src={logoSrc}
      alt='AgendaYa'
      draggable={false}
      style={{
        height: 34,
        width: 'auto',
        display: 'block',
        filter: 'brightness(0) invert(1)',
      }}
    />
  )
}
