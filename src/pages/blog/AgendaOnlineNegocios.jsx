import { Link } from 'react-router-dom'
import BlogLayout from './BlogLayout'
import { useSEO } from '../../hooks/useSEO'

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Agenda online para negocios en Arequipa: guía completa',
  description: 'Guía completa para implementar una agenda online en tu negocio en Arequipa. Paso a paso, herramientas recomendadas, costos y consejos prácticos.',
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
    '@id': 'https://www.agendaya.online/blog/agenda-online-negocios-arequipa',
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
  ol: { paddingLeft: '20px', marginBottom: '18px' },
  li: { marginBottom: '8px' },
  steps: { display: 'grid', gap: '16px', margin: '24px 0' },
  step: { background: '#151515', border: '1px solid #1f2937', borderRadius: '10px', padding: '18px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start' },
  stepNum: { background: '#C0392B', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 },
  stepContent: { flex: 1 },
  stepTitle: { color: '#f9fafb', fontWeight: 700, marginBottom: '4px', fontSize: '1rem' },
  stepDesc: { color: '#9ca3af', fontSize: '0.92rem', lineHeight: 1.6 },
  highlight: { background: '#1a0a0a', border: '1px solid #3b0d0d', borderRadius: '10px', padding: '20px 24px', margin: '28px 0' },
  highlightTitle: { color: '#C0392B', fontWeight: 700, marginBottom: '8px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
  cta: { background: 'linear-gradient(135deg, #1a0505 0%, #200808 100%)', border: '1px solid #3b0d0d', borderRadius: '14px', padding: '36px 28px', textAlign: 'center', marginTop: '48px' },
  ctaTitle: { color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '10px' },
  ctaSub: { color: '#9ca3af', marginBottom: '22px', fontSize: '0.95rem' },
  ctaBtn: { display: 'inline-block', background: '#C0392B', color: 'white', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' },
  backLink: { display: 'inline-block', marginTop: '32px', color: '#6b7280', fontSize: '0.9rem', textDecoration: 'none' },
}

export default function AgendaOnlineNegocios() {
  useSEO({
    title: 'Agenda online para negocios en Arequipa: guía completa | AgendaYa',
    description: 'Todo lo que necesitas saber para implementar una agenda online en tu negocio en Arequipa. Herramientas, pasos, costos y consejos para digitalizar tu gestión de citas.',
    canonical: 'https://www.agendaya.online/blog/agenda-online-negocios-arequipa',
    schema: JSON_LD,
  })

  return (
    <BlogLayout
      noscriptTitle="Agenda online para negocios en Arequipa: guía completa"
      noscriptDescription="Todo lo que necesitas saber para implementar una agenda online en tu negocio en Arequipa. Herramientas, pasos, costos y consejos para digitalizar tu gestión de citas."
    >
      <div style={S.breadcrumb}>
        <Link to="/" style={S.bcLink}>Inicio</Link>
        <span style={S.bcSep}>/</span>
        <Link to="/blog" style={S.bcLink}>Blog</Link>
        <span style={S.bcSep}>/</span>
        <span style={{ color: '#9ca3af' }}>Negocios</span>
      </div>

      <span style={S.tag}>Negocios</span>
      <h1 style={S.h1}>Agenda online para negocios en Arequipa: guía completa</h1>
      <div style={S.meta}>
        <span>📅 25 de marzo, 2026</span>
        <span>⏱ 7 min de lectura</span>
        <span>✍️ Equipo AgendaYa</span>
      </div>

      <article style={S.body}>
        <p style={S.p}>
          Arequipa tiene una economía vibrante con miles de pequeños y medianos negocios de servicio:
          barberías, salones de belleza, consultorios médicos y dentales, centros de estética, estudios
          de tatuaje, academias de idiomas, talleres de fotografía y muchos más. Todos tienen algo en
          común: necesitan gestionar citas o reservas con sus clientes.
        </p>
        <p style={S.p}>
          Muchos siguen haciéndolo de forma manual: agenda de papel, cuaderno de apuntes o una mezcla
          de WhatsApp y buena memoria. Esta guía te explica exactamente cómo dar el salto a una
          agenda online: qué es, qué negocios se benefician, cómo implementarla paso a paso y
          cuánto cuesta hacerlo hoy.
        </p>

        <h2 style={S.h2}>¿Qué es una agenda online para negocios?</h2>
        <p style={S.p}>
          Una agenda online es un sistema digital que permite a tus clientes reservar horarios contigo
          a través de internet, sin necesidad de llamar ni enviar mensajes. El cliente entra a tu
          página de reservas, elige el servicio que necesita, selecciona una fecha y hora disponible,
          ingresa sus datos de contacto y confirma. Listo: la cita queda registrada automáticamente en
          tu calendario y ambas partes reciben confirmación.
        </p>
        <p style={S.p}>
          Pero una buena agenda online hace mucho más que solo registrar reservas. También envía recordatorios
          automáticos, gestiona cancelaciones, te permite ver tu agenda desde el teléfono, y acumula un
          historial de clientes que es valioso para fidelizarlos.
        </p>

        <h2 style={S.h2}>Tipos de negocios en Arequipa que se benefician de una agenda online</h2>
        <p style={S.p}>
          Casi cualquier negocio que trabaje con citas o reservas puede beneficiarse. Estos son los
          más comunes en Arequipa:
        </p>
        <ul style={S.ul}>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Barberías y peluquerías:</strong> Gestión de múltiples barberos, servicios con duraciones distintas, recordatorios para reducir no-shows.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Salones de belleza:</strong> Coordinar estilistas, coloristas y especialistas en manicure con una sola agenda integrada.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Consultorios médicos y dentales:</strong> Agendar pacientes nuevos y de seguimiento, con recordatorios que reducen el ausentismo.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Centros de estética y spa:</strong> Servicios largos que requieren preparación previa y confirmación anticipada.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Psicólogos, nutricionistas y terapeutas:</strong> Sesiones periódicas con clientes fijos y nuevos.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Estudios de fotografía:</strong> Sesiones que deben coordinarse con preparación de espacio y equipo.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Academias y talleres:</strong> Clases individuales o en grupos pequeños con cupos limitados.</li>
        </ul>

        <h2 style={S.h2}>Paso a paso: cómo implementar una agenda online en tu negocio</h2>
        <p style={S.p}>
          Implementar una agenda online no requiere conocimientos técnicos ni una inversión grande.
          Este es el proceso completo:
        </p>
        <div style={S.steps}>
          {[
            { n: 1, t: 'Elige la herramienta correcta', d: 'Busca una plataforma diseñada para negocios de tu tipo. Prioriza facilidad de uso, soporte en español, integración con WhatsApp y precio accesible.' },
            { n: 2, t: 'Define tus servicios y duraciones', d: 'Crea la lista de servicios que ofreces, asigna un tiempo estándar a cada uno y define si tienen costo diferente.' },
            { n: 3, t: 'Configura los horarios de atención', d: 'Indica en qué días y horas atiendes, cuánto tiempo de descanso necesitas entre citas, y si hay días no laborables.' },
            { n: 4, t: 'Añade a tu equipo (si aplica)', d: 'Si trabajas con más personas, crea un perfil para cada una con sus propios horarios y servicios.' },
            { n: 5, t: 'Comparte tu link de reservas', d: 'Pega el link en tu Instagram, WhatsApp Business, Google My Business y donde tus clientes te busquen.' },
            { n: 6, t: 'Activa los recordatorios automáticos', d: 'Configura mensajes automáticos de confirmación y recordatorio para reducir ausencias desde el primer día.' },
          ].map(s => (
            <div key={s.n} style={S.step}>
              <div style={S.stepNum}>{s.n}</div>
              <div style={S.stepContent}>
                <div style={S.stepTitle}>{s.t}</div>
                <div style={S.stepDesc}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={S.h2}>Funcionalidades clave que debe tener tu agenda digital</h2>
        <p style={S.p}>
          No todas las herramientas ofrecen lo mismo. Estas son las funciones que marcan la diferencia
          entre una agenda que funciona bien y una que solo complica las cosas:
        </p>
        <ul style={S.ul}>
          <li style={S.li}>Reserva online desde móvil sin necesidad de descargar una app</li>
          <li style={S.li}>Recordatorios automáticos por WhatsApp (no solo por email)</li>
          <li style={S.li}>Cancelación y reprogramación self-service para el cliente</li>
          <li style={S.li}>Vista de agenda semanal y mensual para ti y tu equipo</li>
          <li style={S.li}>Historial de clientes y frecuencia de visitas</li>
          <li style={S.li}>Reportes básicos: servicios más solicitados, horarios pico, ingresos estimados</li>
          <li style={S.li}>Link o QR personalizado para compartir</li>
        </ul>

        <h2 style={S.h2}>Cuánto cuesta implementar una agenda online en Arequipa</h2>
        <p style={S.p}>
          El costo varía según la herramienta y el plan que elijas. Lo que sí es cierto es que el
          retorno de inversión es prácticamente inmediato: recuperar incluso dos citas perdidas por mes
          ya paga el costo de la mayoría de herramientas disponibles en el mercado.
        </p>

        <div style={S.highlight}>
          <div style={S.highlightTitle}>Costo real vs. beneficio</div>
          <p style={{ ...S.p, marginBottom: 0 }}>
            Si tu servicio promedio vale S/ 40 y reduces 5 no-shows al mes gracias a los recordatorios
            automáticos, estás recuperando S/ 200 por mes. Eso supera el costo de cualquier plan
            de herramienta de reservas del mercado.
          </p>
        </div>

        <h2 style={S.h2}>AgendaYa: diseñado para negocios de Arequipa</h2>
        <p style={S.p}>
          <strong style={{ color: '#C0392B' }}>AgendaYa</strong> nació como solución pensada para la
          realidad de los negocios peruanos. Está en español, se integra con WhatsApp, no requiere
          conocimientos técnicos y tiene un precio accesible para emprendedores y pequeñas empresas.
        </p>
        <p style={S.p}>
          Puedes tener tu agenda online funcionando en menos de 15 minutos. No necesitas un equipo de
          tecnología, no necesitas un sitio web propio. Solo creas tu cuenta, configuras tus servicios
          y empiezas a recibir reservas desde el mismo día.
        </p>
        <p style={S.p}>
          Negocios de todo tipo en Arequipa —barberías en Cayma, salones en Cercado, consultorios en
          Yanahuara, centros de estética en Miraflores— usan AgendaYa para digitalizar su gestión de
          citas. El resultado siempre es el mismo: más tiempo para atender clientes y menos tiempo
          perdido en coordinación.
        </p>

        <div style={S.cta}>
          <h2 style={S.ctaTitle}>Digitaliza tu negocio en Arequipa hoy</h2>
          <p style={S.ctaSub}>Configuración en 15 minutos. 7 días gratis. Sin tarjeta de crédito.</p>
          <a href="https://agendaya.online/register" style={S.ctaBtn}>
            Prueba AgendaYa gratis 7 días →
          </a>
        </div>
      </article>

      <Link to="/blog" style={S.backLink}>← Volver al blog</Link>
    </BlogLayout>
  )
}
