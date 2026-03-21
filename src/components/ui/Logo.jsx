import logoSrc from '../../assets/logoagendaya.png'

/*
  El logo PNG tiene fondo transparente con elementos negros (texto, marco).

  dark=false  → fondo claro (crema, blanco): logo se ve directo, sin filtros
  dark=true   → fondo oscuro (#0D0D0D): logo en cápsula blanca para visibilidad
*/

export function LogoFull({ height = 44, dark = false, className = '' }) {
  if (dark) {
    return (
      <div
        className={`inline-flex items-center rounded-xl ${className}`}
        style={{
          backgroundColor: 'white',
          padding: '7px 14px',
          boxShadow: '0 0 0 1px rgba(192,57,43,0.2), 0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        <img
          src={logoSrc}
          alt='AgendaYa'
          draggable={false}
          style={{ height, width: 'auto', display: 'block' }}
        />
      </div>
    )
  }

  return (
    <img
      src={logoSrc}
      alt='AgendaYa'
      draggable={false}
      className={className}
      style={{ height, width: 'auto', display: 'block' }}
    />
  )
}

/* Sidebar: cápsula blanca con el logo, tamaño compacto */
export function SidebarLogo() {
  return (
    <div
      className='inline-flex items-center rounded-xl'
      style={{
        backgroundColor: 'white',
        padding: '5px 10px',
        boxShadow: '0 0 0 1px rgba(192,57,43,0.25), 0 2px 8px rgba(0,0,0,0.4)',
      }}
    >
      <img
        src={logoSrc}
        alt='AgendaYa'
        draggable={false}
        style={{ height: 26, width: 'auto', display: 'block' }}
      />
    </div>
  )
}
