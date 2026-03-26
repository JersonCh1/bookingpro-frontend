import { Link } from 'react-router-dom'
import BlogLayout from './BlogLayout'
import { useSEO } from '../../hooks/useSEO'

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Sistema de citas para salones de belleza en Perú',
  description: 'Descubre cómo un sistema de citas puede transformar tu salón de belleza en Perú. Funciones clave, beneficios y cómo elegir la mejor herramienta.',
  author: { '@type': 'Organization', name: 'AgendaYa' },
  publisher: {
    '@type': 'Organization',
    name: 'AgendaYa',
    logo: { '@type': 'ImageObject', url: 'https://www.agendaya.online/favicon.png' },
  },
  datePublished: '2026-03-25',
  dateModified: '2026-03-25',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.agendaya.online/blog/sistema-citas-salon-belleza-peru',
  },
}

const S = {
  breadcrumb: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontSize: '0.85rem', color: '#6b7280' },
  bcLink: { color: '#6b7280', textDecoration: 'none' },
  bcSep: { color: '#374151' },
  tag: { display: 'inline-block', background: '#1f0a0a', color: '#C0392B', fontSize: '0.72rem', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' },
  h1: { fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '16px' },
  meta: { display: 'flex', gap: '16px', color: '#6b7280', fontSize: '0.85rem', marginBottom: '40px', flexWrap: 'wrap' },
  body: { fontSize: '1.05rem', lineHeight: 1.8, color: '#d1d5db' },
  h2: { fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginTop: '40px', marginBottom: '14px', paddingBottom: '8px', borderBottom: '2px solid #C0392B', display: 'inline-block' },
  p: { marginBottom: '18px' },
  ul: { paddingLeft: '20px', marginBottom: '18px' },
  li: { marginBottom: '8px' },
  table: { width: '100%', borderCollapse: 'collapse', margin: '24px 0', fontSize: '0.92rem' },
  th: { background: '#1a0505', color: '#C0392B', padding: '10px 14px', textAlign: 'left', fontWeight: 700, border: '1px solid #2a1010' },
  td: { padding: '10px 14px', border: '1px solid #1f2937', color: '#d1d5db' },
  trEven: { background: '#111111' },
  highlight: { background: '#1a0a0a', border: '1px solid #3b0d0d', borderRadius: '10px', padding: '20px 24px', margin: '28px 0' },
  highlightTitle: { color: '#C0392B', fontWeight: 700, marginBottom: '8px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
  cta: { background: 'linear-gradient(135deg, #1a0505 0%, #200808 100%)', border: '1px solid #3b0d0d', borderRadius: '14px', padding: '36px 28px', textAlign: 'center', marginTop: '48px' },
  ctaTitle: { color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '10px' },
  ctaSub: { color: '#9ca3af', marginBottom: '22px', fontSize: '0.95rem' },
  ctaBtn: { display: 'inline-block', background: '#C0392B', color: 'white', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' },
  backLink: { display: 'inline-block', marginTop: '32px', color: '#6b7280', fontSize: '0.9rem', textDecoration: 'none' },
}

export default function SistemaCitasSalonBelleza() {
  useSEO({
    title: 'Sistema de citas para salones de belleza en Perú | AgendaYa',
    description: 'Guía completa sobre sistemas de citas para salones de belleza en Perú. Funciones esenciales, reducción de no-shows y gestión de múltiples estilistas.',
    canonical: 'https://www.agendaya.online/blog/sistema-citas-salon-belleza-peru',
    schema: JSON_LD,
  })

  return (
    <BlogLayout
      noscriptTitle="Sistema de citas para salones de belleza en Perú"
      noscriptDescription="Guía completa sobre sistemas de citas para salones de belleza en Perú. Funciones esenciales, reducción de no-shows y gestión de múltiples estilistas."
    >
      <div style={S.breadcrumb}>
        <Link to="/" style={S.bcLink}>Inicio</Link>
        <span style={S.bcSep}>/</span>
        <Link to="/blog" style={S.bcLink}>Blog</Link>
        <span style={S.bcSep}>/</span>
        <span style={{ color: '#9ca3af' }}>Salones de Belleza</span>
      </div>

      <span style={S.tag}>Salones de Belleza</span>
      <h1 style={S.h1}>Sistema de citas para salones de belleza en Perú</h1>
      <div style={S.meta}>
        <span>📅 25 de marzo, 2026</span>
        <span>⏱ 6 min de lectura</span>
        <span>✍️ Equipo AgendaYa</span>
      </div>

      <article style={S.body}>
        <p style={S.p}>
          Gestionar un salón de belleza en Perú es mucho más que saber peinar, colorear o hacer tratamientos.
          Implica coordinar horarios de varias estilistas, manejar servicios de distinta duración, atender
          clientes que llegan sin cita y responder mensajes de WhatsApp sin parar. Si alguna vez has tenido
          dos clientas programadas al mismo tiempo o has perdido una reserva porque se te olvidó anotarla,
          sabes exactamente de qué estamos hablando.
        </p>
        <p style={S.p}>
          Un sistema de citas bien implementado soluciona todos esos problemas de raíz. No es solo una
          agenda digital: es una herramienta que transforma la operación completa de tu salón. En este
          artículo te explicamos qué funciones son imprescindibles, cómo elegir la herramienta correcta
          y qué esperar durante la implementación.
        </p>

        <h2 style={S.h2}>El problema de gestionar citas manualmente en un salón</h2>
        <p style={S.p}>
          La mayoría de salones en Perú todavía gestionan sus citas con una combinación de agenda en papel,
          WhatsApp personal y memoria. Este método tiene límites claros: funciona cuando el salón es pequeño
          y el volumen es bajo, pero empieza a fallar cuando creces.
        </p>
        <p style={S.p}>
          Los errores más comunes de la gestión manual son: citas duplicadas por falta de coordinación entre
          estilistas, tiempos muertos porque no hay visibilidad de la agenda completa, clientes que esperan
          más de lo esperado porque el servicio anterior se extendió, y propietarias que pasan más tiempo
          coordinando citas que atendiendo clientes.
        </p>

        <div style={S.highlight}>
          <div style={S.highlightTitle}>¿Cuánto tiempo pierdes al día?</div>
          <p style={{ ...S.p, marginBottom: 0 }}>
            Una estilista que atiende 8 clientes por día puede gastar hasta 45 minutos diarios solo
            respondiendo consultas de disponibilidad por WhatsApp. Eso son casi 4 horas a la semana
            que podrían dedicarse a atender más clientes.
          </p>
        </div>

        <h2 style={S.h2}>Funciones que sí o sí debe tener tu sistema de citas</h2>
        <p style={S.p}>No todos los sistemas son iguales. Antes de elegir uno, verifica que tenga estas capacidades:</p>
        <ul style={S.ul}>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Gestión de múltiples profesionales:</strong> Cada estilista con su propia agenda, horarios y servicios asignados.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Servicios con duración variable:</strong> Un corte tarda 30 minutos, una tintura completa puede tardar 2 horas. El sistema debe manejar eso sin problemas.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Recordatorios automáticos:</strong> Por WhatsApp o email, el día anterior y el mismo día.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Reserva online sin llamadas:</strong> Las clientas reservan solas desde su teléfono, sin necesitar que nadie las atienda.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Cancelación y reprogramación online:</strong> Reducir la fricción para cancelar también reduce las ausencias silenciosas.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Panel de control desde el celular:</strong> Ver la agenda de todo el salón en tiempo real, desde cualquier lugar.</li>
        </ul>

        <h2 style={S.h2}>Cómo reducir las ausencias (no-shows) en tu salón de belleza</h2>
        <p style={S.p}>
          Las ausencias sin previo aviso son uno de los mayores problemas para cualquier salón. Una clienta
          que no llega a su cita de tintura representa entre 30 y 90 minutos de tiempo perdido, además del
          costo de los materiales preparados. Multiplicado por semana, es una pérdida significativa.
        </p>
        <p style={S.p}>
          La solución más efectiva son los recordatorios automáticos. Cuando el sistema envía un mensaje
          por WhatsApp la tarde anterior con los detalles de la cita y un link para confirmar o cancelar,
          la tasa de ausencias cae drásticamente. Los estudios del sector indican que los recordatorios
          bien diseñados reducen los no-shows en un 30 a 50%.
        </p>
        <p style={S.p}>
          Pero hay más estrategias que puedes combinar: pedir confirmación 24 horas antes como requisito
          para mantener la reserva, tener una lista de clientas en espera para llenar turnos liberados
          de último momento, y ofrecer un incentivo pequeño (descuento o regalo) a las clientas que
          confirman puntualmente.
        </p>

        <h2 style={S.h2}>Ventajas de digitalizar las citas en tu salón de belleza</h2>
        <p style={S.p}>
          Más allá de la eficiencia operativa, digitalizar las citas tiene beneficios que impactan directamente
          en los ingresos y en la experiencia de tus clientas:
        </p>
        <ul style={S.ul}>
          <li style={S.li}>Aumentas la capacidad de atención sin contratar más personal administrativo.</li>
          <li style={S.li}>Tus clientas te perciben como un salón moderno y profesional.</li>
          <li style={S.li}>Puedes analizar qué servicios son los más demandados y en qué horarios.</li>
          <li style={S.li}>Las estilistas tienen visibilidad de su propia agenda y pueden planificar mejor su día.</li>
          <li style={S.li}>Construyes una base de datos de clientas que puedes usar para campañas de fidelización.</li>
        </ul>

        <h2 style={S.h2}>Integración con WhatsApp: el canal que ya usan tus clientas</h2>
        <p style={S.p}>
          En Perú, WhatsApp no es solo una aplicación: es el canal principal de comunicación para la mayoría
          de las personas. Tus clientas ya lo usan para todo, y prefieren recibir recordatorios de citas
          por ahí antes que por email o SMS.
        </p>
        <p style={S.p}>
          Un buen sistema de reservas debe enviar las confirmaciones y recordatorios directamente por
          WhatsApp, de forma automática. Así la clienta recibe la información en el canal donde ya presta
          atención, y la probabilidad de que no se olvide de su cita aumenta enormemente.
        </p>

        <h2 style={S.h2}>¿Por qué elegir AgendaYa para tu salón en Perú?</h2>
        <p style={S.p}>
          <strong style={{ color: '#C0392B' }}>AgendaYa</strong> fue construido específicamente para negocios
          de servicio en Perú. Eso significa que entiende la realidad del mercado local: clientes que reservan
          por WhatsApp, estilistas que trabajan con horarios variables, y propietarias que no tienen tiempo
          para aprender herramientas complicadas.
        </p>
        <p style={S.p}>
          La configuración toma menos de 20 minutos: creas tu cuenta, agregas los servicios del salón con
          sus duraciones y precios, defines los horarios de cada estilista y obtienes tu link personalizado
          para compartir. Desde ese momento, tus clientas pueden reservar 24 horas al día, los 7 días de la semana.
        </p>
        <p style={S.p}>
          Salones en Lima, Arequipa, Cusco y otras ciudades del Perú ya usan AgendaYa y han reportado
          mejoras concretas: más citas completadas, menos tiempo en coordinación y clientas más satisfechas
          con la experiencia de reserva.
        </p>

        <div style={S.cta}>
          <h2 style={S.ctaTitle}>Digitaliza las citas de tu salón hoy</h2>
          <p style={S.ctaSub}>Prueba AgendaYa gratis por 7 días y experimenta la diferencia.</p>
          <a href="https://agendaya.online/register" style={S.ctaBtn}>
            Prueba AgendaYa gratis 7 días →
          </a>
        </div>
      </article>

      <Link to="/blog" style={S.backLink}>← Volver al blog</Link>
    </BlogLayout>
  )
}
