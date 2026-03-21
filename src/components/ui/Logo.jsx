import logoSrc from '../../assets/logoagendaya.jpg'

/* ── Logo icon only (square crop — just the calendar symbol) ── */
export function LogoIcon({ size = 36, className = '' }) {
  return (
    <div
      className={`relative flex-shrink-0 rounded-xl overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Idle red glow ring */}
      <div
        className='absolute inset-0 rounded-xl pointer-events-none z-10'
        style={{
          boxShadow: 'inset 0 0 0 1px rgba(192,57,43,0.35)',
          animation: 'logo-pulse 3s ease-in-out infinite',
        }}
      />
      <img
        src={logoSrc}
        alt='AgendaYa logo'
        draggable={false}
        style={{
          height: '100%',
          width: 'auto',
          objectFit: 'cover',
          objectPosition: 'left center',
          transform: 'scale(1)',
          transition: 'transform 0.3s ease',
          display: 'block',
        }}
      />
    </div>
  )
}

/* ── Full horizontal logo (image + wordmark) ── */
export function LogoFull({ height = 38, className = '', variant = 'light' }) {
  return (
    <div
      className={`relative inline-flex items-center group ${className}`}
      style={{ height }}
    >
      {/* Glow on hover */}
      <div
        className='absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-400'
        style={{ boxShadow: '0 0 24px rgba(192,57,43,0.35)' }}
      />
      <img
        src={logoSrc}
        alt='AgendaYa'
        draggable={false}
        className='relative z-10'
        style={{
          height: '100%',
          width: 'auto',
          objectFit: 'contain',
          filter: variant === 'dark'
            ? 'brightness(0) invert(1) drop-shadow(0 0 6px rgba(192,57,43,0.6))'
            : 'none',
          transition: 'filter 0.3s ease, transform 0.3s ease',
          transform: 'scale(1)',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
      />
    </div>
  )
}

/* ── Sidebar logo: icon + wordmark on dark background ── */
export function SidebarLogo() {
  return (
    <div className='flex items-center gap-2.5 group cursor-default'>
      {/* Icon badge */}
      <div
        className='relative flex-shrink-0 rounded-xl overflow-hidden'
        style={{ width: 34, height: 34 }}
      >
        <img
          src={logoSrc}
          alt=''
          draggable={false}
          style={{
            height: '100%',
            width: 'auto',
            objectFit: 'cover',
            objectPosition: 'left center',
            display: 'block',
          }}
        />
        {/* Red border ring */}
        <div
          className='absolute inset-0 rounded-xl pointer-events-none'
          style={{ boxShadow: 'inset 0 0 0 1.5px rgba(192,57,43,0.5)' }}
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
