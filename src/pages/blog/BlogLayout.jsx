import { Link } from 'react-router-dom'

const S = {
  page:    { minHeight: '100vh', background: '#0D0D0D', color: '#f3f4f6', fontFamily: 'Inter, sans-serif' },
  header:  { borderBottom: '1px solid #1f2937', background: '#111111', position: 'sticky', top: 0, zIndex: 50 },
  headerInner: { maxWidth: '860px', margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo:    { color: '#C0392B', fontSize: '1.4rem', fontWeight: 800, textDecoration: 'none', letterSpacing: '-0.5px' },
  nav:     { display: 'flex', alignItems: 'center', gap: '20px' },
  navLink: { color: '#9ca3af', fontSize: '0.875rem', textDecoration: 'none' },
  cta:     { background: '#C0392B', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' },
  main:    { maxWidth: '860px', margin: '0 auto', padding: '40px 20px' },
  footer:  { borderTop: '1px solid #1f2937', background: '#111111', marginTop: '60px' },
  footerInner: { maxWidth: '860px', margin: '0 auto', padding: '32px 20px', textAlign: 'center' },
  footerText: { color: '#6b7280', fontSize: '0.85rem' },
  footerLinks: { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' },
  footerLink: { color: '#6b7280', fontSize: '0.85rem', textDecoration: 'none' },
}

export default function BlogLayout({ children, noscriptTitle, noscriptDescription }) {
  return (
    <div style={S.page}>
      {/* Fallback visible para crawlers que no ejecutan JS */}
      {(noscriptTitle || noscriptDescription) && (
        <noscript>
          {noscriptTitle && <h1>{noscriptTitle}</h1>}
          {noscriptDescription && <p>{noscriptDescription}</p>}
        </noscript>
      )}
      <header style={S.header}>
        <div style={S.headerInner}>
          <Link to="/" style={S.logo}>AgendaYa</Link>
          <nav style={S.nav}>
            <Link to="/blog" style={S.navLink}>Blog</Link>
            <Link to="/register" style={S.cta}>Probar gratis</Link>
          </nav>
        </div>
      </header>

      <main style={S.main}>{children}</main>

      <footer style={S.footer}>
        <div style={S.footerInner}>
          <p style={S.footerText}>© 2026 AgendaYa — Sistema de reservas online para negocios en Perú.</p>
          <div style={S.footerLinks}>
            <Link to="/" style={S.footerLink}>Inicio</Link>
            <Link to="/blog" style={S.footerLink}>Blog</Link>
            <Link to="/terminos" style={S.footerLink}>Términos</Link>
            <Link to="/register" style={S.footerLink}>Registrarse</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
