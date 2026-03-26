import { Link } from 'react-router-dom'
import BlogLayout from './BlogLayout'
import { useSEO } from '../../hooks/useSEO'

const ARTICLES = [
  {
    slug: '/blog/reservas-online-barberia-arequipa',
    title: 'Cómo recibir reservas online en tu barbería en Arequipa',
    excerpt: 'Deja de perder clientes por falta de disponibilidad. Descubre cómo implementar un sistema de reservas online en tu barbería sin complicaciones técnicas.',
    category: 'Barberías',
    readTime: '5 min',
    date: '25 mar 2026',
  },
  {
    slug: '/blog/sistema-citas-salon-belleza-peru',
    title: 'Sistema de citas para salones de belleza en Perú',
    excerpt: 'Un sistema de citas bien implementado puede transformar la operación de tu salón. Aprende qué funciones necesitas y cómo elegir la mejor herramienta.',
    category: 'Salones de Belleza',
    readTime: '6 min',
    date: '25 mar 2026',
  },
  {
    slug: '/blog/agenda-online-negocios-arequipa',
    title: 'Agenda online para negocios en Arequipa: guía completa',
    excerpt: 'Todo lo que necesitas saber para digitalizar la agenda de tu negocio en Arequipa. Guía paso a paso con herramientas, costos y consejos prácticos.',
    category: 'Negocios',
    readTime: '7 min',
    date: '25 mar 2026',
  },
  {
    slug: '/blog/como-digitalizar-citas-consultorio-peru',
    title: 'Cómo digitalizar las citas de tu consultorio en Perú',
    excerpt: 'Los consultorios médicos, dentales y de terapia que digitalizan sus citas atienden más pacientes y reducen el ausentismo. Te explicamos cómo hacerlo.',
    category: 'Consultorios',
    readTime: '6 min',
    date: '25 mar 2026',
  },
  {
    slug: '/blog/reservas-whatsapp-automaticas-negocios',
    title: 'Reservas automáticas por WhatsApp para tu negocio',
    excerpt: 'WhatsApp es el canal preferido en Latinoamérica. Descubre cómo automatizar las reservas por WhatsApp para ahorrar tiempo y nunca perder un cliente.',
    category: 'Automatización',
    readTime: '5 min',
    date: '25 mar 2026',
  },
]

const S = {
  hero: { textAlign: 'center', marginBottom: '48px' },
  heroTag: { display: 'inline-block', background: '#1f0a0a', color: '#C0392B', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' },
  heroTitle: { fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '12px', lineHeight: 1.2 },
  heroSub: { color: '#9ca3af', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto' },
  grid: { display: 'grid', gap: '24px' },
  card: { background: '#151515', border: '1px solid #1f2937', borderRadius: '12px', padding: '28px', textDecoration: 'none', display: 'block', transition: 'border-color 0.2s' },
  cardMeta: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  badge: { background: '#1f0a0a', color: '#C0392B', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  readTime: { color: '#6b7280', fontSize: '0.8rem' },
  date: { color: '#6b7280', fontSize: '0.8rem' },
  cardTitle: { color: '#f9fafb', fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px', lineHeight: 1.35 },
  cardExcerpt: { color: '#9ca3af', fontSize: '0.95rem', lineHeight: 1.65 },
  readMore: { display: 'inline-block', marginTop: '16px', color: '#C0392B', fontWeight: 600, fontSize: '0.9rem' },
  ctaBanner: { marginTop: '60px', background: 'linear-gradient(135deg, #1a0505 0%, #200808 100%)', border: '1px solid #3b0d0d', borderRadius: '16px', padding: '40px 32px', textAlign: 'center' },
  ctaTitle: { color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginBottom: '10px' },
  ctaSub: { color: '#9ca3af', marginBottom: '24px', fontSize: '0.95rem' },
  ctaBtn: { display: 'inline-block', background: '#C0392B', color: 'white', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' },
}

export default function BlogIndex() {
  useSEO({
    title: 'Blog AgendaYa — Recursos para negocios con reservas online en Perú',
    description: 'Artículos, guías y consejos para gestionar citas y reservas online en barberías, salones, consultorios y más negocios en Arequipa y todo Perú.',
    canonical: 'https://www.agendaya.online/blog',
  })

  return (
    <BlogLayout>
      <div style={S.hero}>
        <span style={S.heroTag}>Blog</span>
        <h1 style={S.heroTitle}>Recursos para tu negocio</h1>
        <p style={S.heroSub}>Guías prácticas sobre reservas online, gestión de citas y digitalización para negocios en Perú.</p>
      </div>

      <div style={S.grid}>
        {ARTICLES.map(art => (
          <Link key={art.slug} to={art.slug} style={S.card}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#C0392B'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1f2937'}>
            <div style={S.cardMeta}>
              <span style={S.badge}>{art.category}</span>
              <span style={S.readTime}>⏱ {art.readTime}</span>
              <span style={S.date}>{art.date}</span>
            </div>
            <h2 style={S.cardTitle}>{art.title}</h2>
            <p style={S.cardExcerpt}>{art.excerpt}</p>
            <span style={S.readMore}>Leer artículo →</span>
          </Link>
        ))}
      </div>

      <div style={S.ctaBanner}>
        <h2 style={S.ctaTitle}>¿Listo para recibir reservas online?</h2>
        <p style={S.ctaSub}>Prueba AgendaYa gratis por 7 días. Sin tarjeta de crédito.</p>
        <a href="https://agendaya.online/register" style={S.ctaBtn}>Crear cuenta gratis →</a>
      </div>
    </BlogLayout>
  )
}
