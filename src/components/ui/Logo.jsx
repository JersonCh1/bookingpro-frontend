import logoSrc from '../../assets/logoagendaya.png'

/* ─────────────────────────────────────────────────────────
   LogoFull
   variant='light'  → logo original (sobre fondos claros)
   variant='dark'   → todo blanco + glow rojo (sobre fondos negros)
───────────────────────────────────────────────────────── */
export function LogoFull({ height = 38, className = '', variant = 'light' }) {
  return (
    <img
      src={logoSrc}
      alt='AgendaYa'
      draggable={false}
      className={className}
      style={{
        height,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
        filter: variant === 'dark'
          ? 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(192,57,43,0.5))'
          : 'none',
        transition: 'transform 0.25s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
    />
  )
}

/* ─────────────────────────────────────────────────────────
   SidebarLogo — icono blanco + wordmark para sidebar oscuro
───────────────────────────────────────────────────────── */
export function SidebarLogo() {
  return (
    <div className='flex items-center gap-2.5'>
      {/* Icono: logo todo-blanco en contenedor oscuro con ring rojo */}
      <div
        className='flex-shrink-0 rounded-xl flex items-center justify-center'
        style={{
          width: 34,
          height: 34,
          backgroundColor: '#1A1A1A',
          boxShadow: '0 0 0 1.5px rgba(192,57,43,0.6)',
          animation: 'logo-pulse 3s ease-in-out infinite',
        }}
      >
        <img
          src={logoSrc}
          alt=''
          draggable={false}
          style={{
            width: 22,
            height: 22,
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)',
          }}
        />
      </div>

      {/* Wordmark */}
      <div>
        <p className='text-sm font-black text-white tracking-tight leading-none'>
          AgendaYa
        </p>
        <div className='flex items-center gap-1 mt-0.5'>
          <span className='pulse-dot text-xs leading-none' style={{ color: '#C0392B' }}>●</span>
          <span className='text-[10px] font-bold uppercase tracking-widest' style={{ color: '#C0392B' }}>
            Perú
          </span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   LogoIcon — solo el icono cuadrado (para favicon, etc.)
───────────────────────────────────────────────────────── */
export function LogoIcon({ size = 36, variant = 'light', className = '' }) {
  return (
    <div
      className={`flex-shrink-0 rounded-xl flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: variant === 'dark' ? '#1A1A1A' : 'transparent',
        boxShadow: variant === 'dark' ? '0 0 0 1.5px rgba(192,57,43,0.5)' : 'none',
      }}
    >
      <img
        src={logoSrc}
        alt='AgendaYa'
        draggable={false}
        style={{
          width: size * 0.7,
          height: size * 0.7,
          objectFit: 'contain',
          filter: variant === 'dark' ? 'brightness(0) invert(1)' : 'none',
        }}
      />
    </div>
  )
}
