import { Link } from 'react-router-dom'
import BlogLayout from './BlogLayout'
import { useSEO } from '../../hooks/useSEO'

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Reservas automáticas por WhatsApp para tu negocio',
  description: 'Cómo automatizar las reservas de tu negocio a través de WhatsApp. Ventajas, funcionamiento y cómo implementarlo sin conocimientos técnicos.',
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
    '@id': 'https://www.agendaya.online/blog/reservas-whatsapp-automaticas-negocios',
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
  flow: { display: 'flex', flexDirection: 'column', gap: '0', margin: '28px 0' },
  flowItem: { display: 'flex', gap: '16px', alignItems: 'flex-start' },
  flowLeft: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px', flexShrink: 0 },
  flowDot: { width: '36px', height: '36px', borderRadius: '50%', background: '#1a0505', border: '2px solid #C0392B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C0392B', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 },
  flowLine: { width: '2px', flex: 1, background: '#2a1010', minHeight: '24px' },
  flowContent: { paddingBottom: '24px', flex: 1 },
  flowTitle: { color: '#f9fafb', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' },
  flowDesc: { color: '#9ca3af', fontSize: '0.92rem', lineHeight: 1.6 },
  stat: { display: 'flex', gap: '0', margin: '24px 0', flexWrap: 'wrap' },
  statItem: { flex: '1 1 180px', background: '#151515', border: '1px solid #1f2937', padding: '20px', textAlign: 'center' },
  statNum: { color: '#C0392B', fontSize: '2rem', fontWeight: 800, lineHeight: 1 },
  statLabel: { color: '#9ca3af', fontSize: '0.85rem', marginTop: '6px' },
  highlight: { background: '#1a0a0a', border: '1px solid #3b0d0d', borderRadius: '10px', padding: '20px 24px', margin: '28px 0' },
  highlightTitle: { color: '#C0392B', fontWeight: 700, marginBottom: '8px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
  cta: { background: 'linear-gradient(135deg, #1a0505 0%, #200808 100%)', border: '1px solid #3b0d0d', borderRadius: '14px', padding: '36px 28px', textAlign: 'center', marginTop: '48px' },
  ctaTitle: { color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '10px' },
  ctaSub: { color: '#9ca3af', marginBottom: '22px', fontSize: '0.95rem' },
  ctaBtn: { display: 'inline-block', background: '#C0392B', color: 'white', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' },
  backLink: { display: 'inline-block', marginTop: '32px', color: '#6b7280', fontSize: '0.9rem', textDecoration: 'none' },
}

export default function ReservasWhatsapp() {
  useSEO({
    title: 'Reservas automáticas por WhatsApp para tu negocio | AgendaYa',
    description: 'Aprende a automatizar las reservas de tu negocio por WhatsApp. Sin bots complejos: un link, confirmación automática y recordatorios. Así funciona AgendaYa.',
    canonical: 'https://www.agendaya.online/blog/reservas-whatsapp-automaticas-negocios',
    schema: JSON_LD,
  })

  return (
    <BlogLayout
      noscriptTitle="Reservas automáticas por WhatsApp para tu negocio"
      noscriptDescription="Aprende a automatizar las reservas de tu negocio por WhatsApp. Sin bots complejos: un link, confirmación automática y recordatorios. Así funciona AgendaYa."
    >
      <div style={S.breadcrumb}>
        <Link to="/" style={S.bcLink}>Inicio</Link>
        <span style={S.bcSep}>/</span>
        <Link to="/blog" style={S.bcLink}>Blog</Link>
        <span style={S.bcSep}>/</span>
        <span style={{ color: '#9ca3af' }}>Automatización</span>
      </div>

      <span style={S.tag}>Automatización</span>
      <h1 style={S.h1}>Reservas automáticas por WhatsApp para tu negocio</h1>
      <div style={S.meta}>
        <span>📅 25 de marzo, 2026</span>
        <span>⏱ 5 min de lectura</span>
        <span>✍️ Equipo AgendaYa</span>
      </div>

      <article style={S.body}>
        <p style={S.p}>
          Si tienes un negocio de servicio en Perú, ya sabes que WhatsApp es el canal donde viven tus clientes.
          Ahí te buscan para preguntar disponibilidad, ahí te mandan fotos de referencia, ahí cancelan cuando
          algo les surge. El problema es que tú también tienes que estar ahí, respondiendo manualmente, todo
          el tiempo, para no perder una reserva.
        </p>
        <p style={S.p}>
          La buena noticia es que ese proceso puede automatizarse casi por completo. No hablamos de chatbots
          complicados ni de pagar costosas integraciones con la API oficial de WhatsApp Business. Hablamos
          de un sistema inteligente que usa WhatsApp como canal de comunicación para confirmaciones y
          recordatorios, mientras el proceso de reserva ocurre de forma automática en segundo plano.
        </p>

        <h2 style={S.h2}>Por qué WhatsApp es el canal de reservas en Latinoamérica</h2>
        <p style={S.p}>
          WhatsApp tiene más de 2,000 millones de usuarios en el mundo, y en Latinoamérica es la aplicación
          de mensajería dominante por un margen enorme. En Perú, la mayoría de la población adulta lo usa
          a diario, en muchos casos como herramienta principal de comunicación laboral y personal.
        </p>
        <div style={S.stat}>
          {[
            { n: '95%', l: 'de peruanos usa WhatsApp regularmente' },
            { n: '3x', l: 'más apertura que emails de recordatorio' },
            { n: '< 5 min', l: 'tiempo promedio de respuesta a mensajes WA' },
          ].map(s => (
            <div key={s.n} style={S.statItem}>
              <div style={S.statNum}>{s.n}</div>
              <div style={S.statLabel}>{s.l}</div>
            </div>
          ))}
        </div>
        <p style={S.p}>
          Esto tiene una implicancia directa para los negocios: un recordatorio enviado por WhatsApp tiene
          una tasa de lectura mucho más alta que uno enviado por email. Los clientes abren el mensaje,
          leen los detalles de su cita y, si necesitan cancelar, pueden hacerlo desde el mismo link que
          incluye el mensaje. Es el canal perfecto para cerrar el ciclo de las reservas.
        </p>

        <h2 style={S.h2}>¿Qué son las reservas automáticas por WhatsApp?</h2>
        <p style={S.p}>
          Las reservas automáticas por WhatsApp funcionan así: el cliente hace su reserva a través de
          una página web (tu link personalizado), y el sistema le envía automáticamente una confirmación
          por WhatsApp con todos los detalles: fecha, hora, servicio y dirección. Sin que tú tengas que
          hacer nada.
        </p>
        <p style={S.p}>
          Después, el sistema también envía recordatorios automáticos antes de la cita —generalmente
          el día anterior y pocas horas antes— con un link que permite al cliente confirmar o cancelar.
          Si cancela, el turno queda libre en tu agenda de inmediato, disponible para otro cliente.
        </p>
        <p style={S.p}>
          El resultado: tú nunca tienes que mandar mensajes de recordatorio manualmente, nunca tienes
          que preguntar "¿vienes mañana?", y cuando un cliente cancela, ya lo sabes automáticamente
          y puedes llenar ese espacio.
        </p>

        <h2 style={S.h2}>Cómo funciona el proceso completo de reserva automática</h2>
        <div style={S.flow}>
          {[
            { n: '1', t: 'El cliente accede a tu link', d: 'Compartes tu link de reservas en WhatsApp, Instagram o donde quieras. El cliente lo abre desde su teléfono.' },
            { n: '2', t: 'Elige servicio, fecha y hora', d: 'Ve los servicios disponibles, selecciona la fecha y hora que le conviene y rellena sus datos de contacto.' },
            { n: '3', t: 'Confirma su reserva', d: 'El sistema registra la cita en tu agenda en tiempo real y la bloquea para que nadie más pueda reservar ese horario.' },
            { n: '4', t: 'Recibe confirmación por WhatsApp', d: 'El cliente recibe un mensaje automático con el resumen de su reserva. Tú también recibes una notificación.' },
            { n: '5', t: 'Recordatorio automático antes de la cita', d: 'El sistema envía un recordatorio 24 horas antes. El cliente puede confirmar o cancelar desde el mismo mensaje.' },
            { n: '6', t: 'Tú solo atiendes', d: 'No respondiste ningún mensaje, no anotaste nada manualmente. La cita llegó sola a tu agenda.' },
          ].map((s, i, arr) => (
            <div key={s.n} style={S.flowItem}>
              <div style={S.flowLeft}>
                <div style={S.flowDot}>{s.n}</div>
                {i < arr.length - 1 && <div style={S.flowLine} />}
              </div>
              <div style={S.flowContent}>
                <div style={S.flowTitle}>{s.t}</div>
                <div style={S.flowDesc}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={S.h2}>Ventajas concretas de automatizar tus reservas</h2>
        <ul style={S.ul}>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Ahorro de tiempo diario:</strong> Dejas de responder mensajes de "¿hay turno para mañana?" a las 10 de la noche.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Menos ausencias:</strong> Los recordatorios automáticos reducen los no-shows entre un 30 y 50%.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Disponible 24/7:</strong> Un cliente puede reservar a las 2 de la mañana para el día siguiente. Tú no tienes que estar despierto.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Agenda siempre actualizada:</strong> Cuando alguien cancela, el turno queda libre automáticamente para otro cliente.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Mejor experiencia para el cliente:</strong> Reservar en 60 segundos sin esperar respuesta es infinitamente más cómodo que mandar un mensaje y esperar.</li>
        </ul>

        <div style={S.highlight}>
          <div style={S.highlightTitle}>Caso real</div>
          <p style={{ ...S.p, marginBottom: 0 }}>
            Una barbería con 3 barberos en Arequipa solía recibir más de 40 mensajes de WhatsApp al día
            solo para coordinar citas. Tras implementar reservas automáticas, ese número cayó a menos de 5.
            Sus barberos ahora usan ese tiempo en atender más clientes.
          </p>
        </div>

        <h2 style={S.h2}>Integración con tu calendario y equipo de trabajo</h2>
        <p style={S.p}>
          Si tienes un equipo, la automatización de reservas también funciona a nivel de staff. Cada
          miembro de tu equipo puede tener su propia agenda, y el sistema distribuye las reservas
          automáticamente según la disponibilidad de cada uno. El cliente elige con quién quiere su
          cita y el sistema gestiona el resto.
        </p>
        <p style={S.p}>
          Todos en tu equipo pueden ver la agenda desde su teléfono, en tiempo real, sin tener que
          preguntarle a nadie. Esto elimina los conflictos de horario y mejora la coordinación
          general del negocio.
        </p>

        <h2 style={S.h2}>AgendaYa y WhatsApp: la combinación perfecta para tu negocio</h2>
        <p style={S.p}>
          <strong style={{ color: '#C0392B' }}>AgendaYa</strong> integra WhatsApp como canal principal
          de comunicación con tus clientes. Cuando alguien reserva, cancela o necesita reprogramar,
          toda la comunicación fluye por WhatsApp de forma automática. Tú no tienes que hacer nada
          manualmente.
        </p>
        <p style={S.p}>
          El sistema es tan simple de configurar que en 15 minutos puedes tenerlo listo para empezar
          a recibir reservas. No necesitas conocimientos técnicos, no necesitas un desarrollador,
          no necesitas una app. Solo tu teléfono, tu horario y las ganas de dejar de responder
          mensajes todo el día.
        </p>
        <p style={S.p}>
          AgendaYa funciona para barberías, salones de belleza, consultorios, centros de estética,
          academias y cualquier negocio que trabaje con citas. Si tienes clientes y tienes WhatsApp,
          puedes automatizar tus reservas desde hoy.
        </p>

        <div style={S.cta}>
          <h2 style={S.ctaTitle}>Automatiza tus reservas con WhatsApp hoy</h2>
          <p style={S.ctaSub}>Configuración en 15 minutos. Sin técnicos. Sin complicaciones.</p>
          <a href="https://agendaya.online/register" style={S.ctaBtn}>
            Prueba AgendaYa gratis 7 días →
          </a>
        </div>
      </article>

      <Link to="/blog" style={S.backLink}>← Volver al blog</Link>
    </BlogLayout>
  )
}
