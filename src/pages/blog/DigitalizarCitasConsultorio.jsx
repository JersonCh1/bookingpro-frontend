import { Link } from 'react-router-dom'
import BlogLayout from './BlogLayout'
import { useSEO } from '../../hooks/useSEO'

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo digitalizar las citas de tu consultorio en Perú',
  description: 'Aprende a digitalizar la gestión de citas en tu consultorio médico, dental o de salud en Perú. Beneficios, herramientas recomendadas y pasos concretos.',
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
    '@id': 'https://www.agendaya.online/blog/como-digitalizar-citas-consultorio-peru',
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
  cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', margin: '24px 0' },
  card: { background: '#151515', border: '1px solid #1f2937', borderRadius: '10px', padding: '16px 18px' },
  cardIcon: { fontSize: '1.4rem', marginBottom: '8px' },
  cardTitle: { color: '#f9fafb', fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' },
  cardDesc: { color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.5 },
  highlight: { background: '#1a0a0a', border: '1px solid #3b0d0d', borderRadius: '10px', padding: '20px 24px', margin: '28px 0' },
  highlightTitle: { color: '#C0392B', fontWeight: 700, marginBottom: '8px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
  cta: { background: 'linear-gradient(135deg, #1a0505 0%, #200808 100%)', border: '1px solid #3b0d0d', borderRadius: '14px', padding: '36px 28px', textAlign: 'center', marginTop: '48px' },
  ctaTitle: { color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '10px' },
  ctaSub: { color: '#9ca3af', marginBottom: '22px', fontSize: '0.95rem' },
  ctaBtn: { display: 'inline-block', background: '#C0392B', color: 'white', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' },
  backLink: { display: 'inline-block', marginTop: '32px', color: '#6b7280', fontSize: '0.9rem', textDecoration: 'none' },
}

export default function DigitalizarCitasConsultorio() {
  useSEO({
    title: 'Cómo digitalizar las citas de tu consultorio en Perú | AgendaYa',
    description: 'Guía para profesionales de salud en Perú que quieren digitalizar sus citas. Reduce el ausentismo, mejora la experiencia del paciente y optimiza tu tiempo.',
    canonical: 'https://www.agendaya.online/blog/como-digitalizar-citas-consultorio-peru',
    schema: JSON_LD,
  })

  return (
    <BlogLayout
      noscriptTitle="Cómo digitalizar las citas de tu consultorio en Perú"
      noscriptDescription="Guía para profesionales de salud en Perú que quieren digitalizar sus citas. Reduce el ausentismo, mejora la experiencia del paciente y optimiza tu tiempo."
    >
      <div style={S.breadcrumb}>
        <Link to="/" style={S.bcLink}>Inicio</Link>
        <span style={S.bcSep}>/</span>
        <Link to="/blog" style={S.bcLink}>Blog</Link>
        <span style={S.bcSep}>/</span>
        <span style={{ color: '#9ca3af' }}>Consultorios</span>
      </div>

      <span style={S.tag}>Consultorios</span>
      <h1 style={S.h1}>Cómo digitalizar las citas de tu consultorio en Perú</h1>
      <div style={S.meta}>
        <span>📅 25 de marzo, 2026</span>
        <span>⏱ 6 min de lectura</span>
        <span>✍️ Equipo AgendaYa</span>
      </div>

      <article style={S.body}>
        <p style={S.p}>
          Los profesionales de salud en Perú —médicos, dentistas, psicólogos, nutricionistas, fisioterapeutas—
          enfrentan un problema común: gestionar las citas de sus pacientes es un proceso manual, lento y
          propenso a errores. Una secretaria que anota en papel, un cuaderno que puede perderse, pacientes
          que olvidan su cita y llegan tarde o simplemente no llegan. El resultado: tiempo perdido, ingresos
          que no se recuperan y una experiencia frustrante para todos.
        </p>
        <p style={S.p}>
          Digitalizar las citas de tu consultorio no significa invertir en un sistema hospitalario complejo
          ni contratar un equipo de IT. Hoy existen herramientas accesibles y fáciles de usar que cualquier
          profesional puede implementar en menos de una hora. Este artículo te explica exactamente cómo hacerlo.
        </p>

        <h2 style={S.h2}>Los desafíos de gestionar citas manualmente en consultorios</h2>
        <p style={S.p}>
          Antes de hablar de soluciones, vale la pena nombrar los problemas concretos que genera la
          gestión manual de citas en un consultorio:
        </p>
        <ul style={S.ul}>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Ausentismo elevado:</strong> Los pacientes olvidan sus citas porque nadie les envía recordatorios. En consultorios sin sistema automático, el ausentismo puede superar el 20%.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Doble reserva:</strong> Dos pacientes programados a la misma hora por un error de coordinación.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Tiempo perdido en coordinación:</strong> Llamadas telefónicas y mensajes para confirmar, reprogramar o cancelar citas que podrían manejarse de forma automática.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Sin historial accesible:</strong> Saber cuándo fue la última cita de un paciente requiere buscar en papel o recordarlo.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Dependencia de una persona:</strong> Si la secretaria no está, nadie puede revisar la agenda.</li>
        </ul>

        <h2 style={S.h2}>Tipos de consultorios que pueden digitalizar sus citas</h2>
        <p style={S.p}>
          Prácticamente cualquier consultorio de salud puede beneficiarse de digitalizar sus citas.
          Estos son los más comunes en Perú:
        </p>
        <div style={S.cards}>
          {[
            { icon: '🦷', t: 'Dentistas', d: 'Consultas, limpiezas, blanqueamientos y tratamientos de largo plazo.' },
            { icon: '🧠', t: 'Psicólogos', d: 'Sesiones periódicas con pacientes fijos y nuevos, con alta sensibilidad en privacidad.' },
            { icon: '🥗', t: 'Nutricionistas', d: 'Control de evolución con citas regulares de seguimiento.' },
            { icon: '💪', t: 'Fisioterapeutas', d: 'Sesiones frecuentes con el mismo paciente durante semanas.' },
            { icon: '👁️', t: 'Oftalmólogos', d: 'Consultas con revisión de historial visual previo.' },
            { icon: '🌿', t: 'Medicina alternativa', d: 'Acupuntura, quiropráctica, homeopatía y terapias holísticas.' },
          ].map(c => (
            <div key={c.t} style={S.card}>
              <div style={S.cardIcon}>{c.icon}</div>
              <div style={S.cardTitle}>{c.t}</div>
              <div style={S.cardDesc}>{c.d}</div>
            </div>
          ))}
        </div>

        <h2 style={S.h2}>Beneficios de digitalizar las citas para profesionales de salud</h2>
        <p style={S.p}>
          La digitalización de citas no solo mejora la operación interna del consultorio. También impacta
          directamente en la experiencia del paciente y en los ingresos:
        </p>
        <ul style={S.ul}>
          <li style={S.li}>Los pacientes pueden reservar a cualquier hora, incluso cuando el consultorio está cerrado.</li>
          <li style={S.li}>Los recordatorios automáticos reducen el ausentismo sin que nadie tenga que llamar.</li>
          <li style={S.li}>El profesional llega a su consultorio sabiendo exactamente cuántos pacientes tiene y a qué horas.</li>
          <li style={S.li}>Se eliminan los errores de doble reserva y los conflictos de horario.</li>
          <li style={S.li}>El paciente percibe un servicio más organizado y profesional, lo que mejora la fidelización.</li>
        </ul>

        <div style={S.highlight}>
          <div style={S.highlightTitle}>Impacto real en ingresos</div>
          <p style={{ ...S.p, marginBottom: 0 }}>
            Si un médico tiene 4 citas diarias y el 15% de los pacientes no llega sin avisar, está perdiendo
            aproximadamente 3 citas por semana. Con un sistema de recordatorios automáticos, ese porcentaje
            puede bajar a menos del 5%. Eso representa recuperar más de 8 consultas extra al mes.
          </p>
        </div>

        <h2 style={S.h2}>Cómo implementar un sistema de citas digital en tu consultorio</h2>
        <p style={S.p}>El proceso es más sencillo de lo que parece. Estos son los pasos:</p>
        <ol style={S.ol}>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Elige una plataforma en español, fácil de usar y con soporte local.</strong> Evita herramientas en inglés o que requieran configuración técnica avanzada.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Crea tu perfil de consultorio</strong> con tu nombre, especialidad, horarios de atención y los tipos de consulta que ofreces.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Define la duración de cada tipo de consulta.</strong> Una primera consulta puede durar 45 minutos, un control de seguimiento 20 minutos.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Activa los recordatorios automáticos</strong> por WhatsApp para 24 horas antes de la cita.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Comparte tu link de reservas</strong> en tu número de WhatsApp profesional, en tu perfil de redes sociales y en tu tarjeta de presentación.</li>
          <li style={S.li}><strong style={{ color: '#f9fafb' }}>Informa a tus pacientes actuales</strong> del nuevo sistema y pídeles que la próxima vez reserven desde el link.</li>
        </ol>

        <h2 style={S.h2}>Privacidad y confianza en sistemas de reservas para consultorios</h2>
        <p style={S.p}>
          Es natural que los profesionales de salud se preocupen por la privacidad de los datos de sus
          pacientes. Un sistema de reservas bien diseñado solo recopila la información necesaria para
          la cita: nombre, teléfono y en algunos casos el tipo de consulta. No se almacenan datos médicos,
          diagnósticos ni información sensible de salud.
        </p>
        <p style={S.p}>
          Lo más importante es elegir una plataforma que almacene los datos de forma segura y que sea
          transparente sobre qué información recopila y cómo la usa. Un sistema de reservas serio
          nunca vende ni comparte los datos de tus pacientes con terceros.
        </p>

        <h2 style={S.h2}>AgendaYa: herramienta de citas para consultorios en Perú</h2>
        <p style={S.p}>
          <strong style={{ color: '#C0392B' }}>AgendaYa</strong> es una plataforma peruana de gestión de citas
          que muchos profesionales de salud ya usan en Lima, Arequipa y otras ciudades del país. Su diseño
          es limpio, intuitivo y no requiere entrenamiento para empezar a usarlo.
        </p>
        <p style={S.p}>
          Puedes configurar múltiples tipos de consulta con duraciones distintas, bloquear días de vacaciones
          o feriados, activar recordatorios automáticos por WhatsApp y ver en tiempo real cómo está tu
          agenda desde cualquier dispositivo. Tus pacientes reciben una experiencia de reserva clara y
          profesional que genera confianza desde el primer contacto.
        </p>
        <p style={S.p}>
          Si trabajas en un equipo de salud (varios médicos o especialistas en el mismo consultorio),
          AgendaYa también permite gestionar múltiples profesionales bajo la misma cuenta, cada uno
          con su propia agenda y disponibilidad.
        </p>

        <div style={S.cta}>
          <h2 style={S.ctaTitle}>Moderniza tu consultorio con reservas digitales</h2>
          <p style={S.ctaSub}>Reduce el ausentismo y mejora la experiencia de tus pacientes desde hoy.</p>
          <a href="https://agendaya.online/register" style={S.ctaBtn}>
            Prueba AgendaYa gratis 7 días →
          </a>
        </div>
      </article>

      <Link to="/blog" style={S.backLink}>← Volver al blog</Link>
    </BlogLayout>
  )
}
