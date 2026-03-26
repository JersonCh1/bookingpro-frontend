import { Link } from 'react-router-dom'
import BlogLayout from './BlogLayout'
import { useSEO } from '../../hooks/useSEO'

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo recibir reservas online en tu barbería en Arequipa',
  description: 'Guía completa para implementar un sistema de reservas online en tu barbería en Arequipa. Reduce llamadas, elimina no-shows y llena tu agenda.',
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
    '@id': 'https://www.agendaya.online/blog/reservas-online-barberia-arequipa',
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
  highlight: { background: '#1a0a0a', border: '1px solid #3b0d0d', borderRadius: '10px', padding: '20px 24px', margin: '28px 0' },
  highlightTitle: { color: '#C0392B', fontWeight: 700, marginBottom: '8px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
  cta: { background: 'linear-gradient(135deg, #1a0505 0%, #200808 100%)', border: '1px solid #3b0d0d', borderRadius: '14px', padding: '36px 28px', textAlign: 'center', marginTop: '48px' },
  ctaTitle: { color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '10px' },
  ctaSub: { color: '#9ca3af', marginBottom: '22px', fontSize: '0.95rem' },
  ctaBtn: { display: 'inline-block', background: '#C0392B', color: 'white', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' },
  backLink: { display: 'inline-block', marginTop: '32px', color: '#6b7280', fontSize: '0.9rem', textDecoration: 'none' },
}

export default function ReservasOnlineBarberia() {
  useSEO({
    title: 'Cómo recibir reservas online en tu barbería en Arequipa | AgendaYa',
    description: 'Aprende a implementar un sistema de reservas online en tu barbería en Arequipa. Reduce llamadas, llena tu agenda y evita cancelaciones de última hora.',
    canonical: 'https://www.agendaya.online/blog/reservas-online-barberia-arequipa',
    schema: JSON_LD,
  })

  return (
    <BlogLayout
      noscriptTitle="Cómo recibir reservas online en tu barbería en Arequipa"
      noscriptDescription="Aprende a implementar un sistema de reservas online en tu barbería en Arequipa. Reduce llamadas, llena tu agenda y evita cancelaciones de última hora."
    >
      <div style={S.breadcrumb}>
        <Link to="/" style={S.bcLink}>Inicio</Link>
        <span style={S.bcSep}>/</span>
        <Link to="/blog" style={S.bcLink}>Blog</Link>
        <span style={S.bcSep}>/</span>
        <span style={{ color: '#9ca3af' }}>Barberías</span>
      </div>

      <span style={S.tag}>Barberías</span>
      <h1 style={S.h1}>Cómo recibir reservas online en tu barbería en Arequipa</h1>
      <div style={S.meta}>
        <span>📅 25 de marzo, 2026</span>
        <span>⏱ 5 min de lectura</span>
        <span>✍️ Equipo AgendaYa</span>
      </div>

      <article style={S.body}>
        <p style={S.p}>
          Si tienes una barbería en Arequipa, sabes exactamente cómo es el caos de los miércoles por la tarde:
          el teléfono no para de sonar, los clientes preguntan por WhatsApp si hay turno, y tú o tu equipo
          tienen que responder manualmente cada mensaje mientras intentan atender al cliente que tienen en la silla.
          ¿Te suena familiar? No tienes que seguir operando así.
        </p>
        <p style={S.p}>
          Las barberías que han adoptado un sistema de reservas online no solo ahorran tiempo: también aumentan
          sus ingresos, reducen las ausencias y proyectan una imagen mucho más profesional frente a la competencia.
          En este artículo te explicamos todo lo que necesitas saber para implementarlo en tu negocio.
        </p>

        <h2 style={S.h2}>¿Por qué tu barbería necesita un sistema de reservas online?</h2>
        <p style={S.p}>
          El mercado de las barberías en Arequipa ha crecido enormemente en los últimos años. Hoy hay más opciones
          que nunca, y los clientes —especialmente los más jóvenes— eligen a quién ir basándose en la facilidad para
          agendar. Si tu competencia permite reservar en 30 segundos desde el celular y tú todavía dependes de
          llamadas o mensajes manuales, estás perdiendo clientes sin siquiera darte cuenta.
        </p>
        <p style={S.p}>
          Además, gestionar las citas manualmente tiene costos ocultos: tiempo perdido respondiendo mensajes,
          errores al anotar nombres o horas, citas dobles por descuido, y barberos que quedan con tiempos
          muertos porque alguien canceló sin avisar.
        </p>

        <div style={S.highlight}>
          <div style={S.highlightTitle}>Dato clave</div>
          <p style={{ ...S.p, marginBottom: 0 }}>
            Los negocios que implementan reservas online reportan hasta un 40% menos de llamadas operativas
            y una reducción del 25% en cancelaciones de última hora gracias a los recordatorios automáticos.
          </p>
        </div>

        <h2 style={S.h2}>Ventajas concretas de recibir reservas online en tu barbería</h2>
        <p style={S.p}>Implementar un sistema de reservas digital le da a tu barbería ventajas reales y medibles:</p>
        <ul style={S.ul}>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Disponibilidad 24/7:</strong> Los clientes pueden reservar a las 11 de la noche para el día siguiente, sin que tú tengas que estar disponible.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Menos no-shows:</strong> El sistema envía recordatorios automáticos por WhatsApp o email, reduciendo las ausencias sin costo adicional.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Agenda visible en tiempo real:</strong> Tú y tus barberos ven exactamente qué turnos están ocupados y cuáles libres, sin confusiones.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Historial de clientes:</strong> Sabes cuántas veces ha venido cada cliente, qué servicio pide y cuánto tiempo promedio toma su corte.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Imagen profesional:</strong> Una página de reservas limpia y bien diseñada genera más confianza que un número de WhatsApp.</li>
        </ul>

        <h2 style={S.h2}>Cómo gestionar múltiples barberos con un solo sistema</h2>
        <p style={S.p}>
          Una de las mayores dificultades en barberías con más de un profesional es coordinar la agenda sin
          que se produzcan conflictos. El cliente que reserva con "el Sergio" no puede ocupar el turno de "el Marco",
          y manejar eso manualmente es una pesadilla.
        </p>
        <p style={S.p}>
          Con un sistema como <strong style={{ color: '#C0392B' }}>AgendaYa</strong>, puedes crear perfiles para
          cada barbero, asignarle sus horarios de trabajo, sus días de descanso y sus servicios específicos.
          Cuando un cliente reserve, elige directamente con qué barbero quiere su turno, y el sistema solo
          muestra las horas disponibles de ese profesional. Cero conflictos. Cero confusiones.
        </p>

        <h2 style={S.h2}>Reduce las cancelaciones de última hora con recordatorios automáticos</h2>
        <p style={S.p}>
          Una silla vacía en tu barbería es dinero perdido. Las cancelaciones de último momento son uno de los
          mayores dolores de cabeza para cualquier barbero, y la causa número uno es simple: el cliente se olvidó.
        </p>
        <p style={S.p}>
          Los recordatorios automáticos por WhatsApp cambian completamente esta dinámica. El sistema envía un
          mensaje al cliente el día anterior y otro pocas horas antes de su turno. Si necesita cancelar, puede
          hacerlo desde el link que viene en el mensaje, y ese turno queda liberado para otro cliente. Tú no
          tienes que hacer nada.
        </p>
        <p style={S.p}>
          Barberías en Arequipa que han implementado este sistema reportan que sus cancelaciones cayeron a
          menos de la mitad. El impacto en los ingresos es directo e inmediato.
        </p>

        <h2 style={S.h2}>Tu link de reservas: comparte en redes y WhatsApp</h2>
        <p style={S.p}>
          Una de las funciones más prácticas de un sistema de reservas online es el link personalizado. En lugar
          de decirle a los clientes "escríbeme y te busco un turno", les compartes un link como
          <em> agendaya.online/book/tu-barberia</em> y ellos reservan solos, cuando quieran, desde su teléfono.
        </p>
        <p style={S.p}>
          Ese link lo puedes poner en tu bio de Instagram, en tu perfil de TikTok, en tu estado de WhatsApp,
          en tu página de Google My Business. Cada vez que alguien lo ve, puede convertirse en cliente sin
          fricción. No necesita llamarte, no necesita esperar respuesta: reserva y listo.
        </p>

        <h2 style={S.h2}>AgendaYa: la solución para barberías en Arequipa</h2>
        <p style={S.p}>
          <strong style={{ color: '#C0392B' }}>AgendaYa</strong> es una plataforma de reservas online diseñada
          para negocios pequeños y medianos en Perú. Fue construida pensando en barberías, salones y consultorios
          que necesitan digitalizar su agenda sin invertir en tecnología compleja ni pagar caro.
        </p>
        <p style={S.p}>
          En menos de 15 minutos puedes tener tu barbería configurada: cargas tus servicios, defines los horarios
          de cada barbero y empiezas a recibir reservas ese mismo día. No necesitas conocimientos técnicos.
          Si tienes un teléfono y conexión a internet, puedes hacerlo.
        </p>
        <ul style={S.ul}>
          <li style={S.li}>Link de reservas personalizado para compartir donde quieras</li>
          <li style={S.li}>Gestión de múltiples barberos con horarios independientes</li>
          <li style={S.li}>Recordatorios automáticos por WhatsApp para reducir no-shows</li>
          <li style={S.li}>Confirmación y cancelación online para clientes</li>
          <li style={S.li}>Panel de control para ver tu agenda desde el celular</li>
          <li style={S.li}>Reportes de atenciones, servicios más populares y clientes frecuentes</li>
        </ul>
        <p style={S.p}>
          Decenas de barberías en Arequipa ya usan AgendaYa. Dar el paso es más fácil de lo que crees,
          y el impacto en tu operación diaria es inmediato.
        </p>

        <div style={S.cta}>
          <h2 style={S.ctaTitle}>Empieza a recibir reservas online hoy mismo</h2>
          <p style={S.ctaSub}>7 días gratis. Sin tarjeta de crédito. Configuración en minutos.</p>
          <a href="https://agendaya.online/register" style={S.ctaBtn}>
            Prueba AgendaYa gratis 7 días →
          </a>
        </div>
      </article>

      <Link to="/blog" style={S.backLink}>← Volver al blog</Link>
    </BlogLayout>
  )
}
