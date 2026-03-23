import { Link } from 'react-router-dom'
import { LogoFull } from '../components/ui/Logo'

const LAST_UPDATED = '23 de marzo de 2026'
const COMPANY      = 'AgendaYa'
const EMAIL        = 'contacto@agendaya.pe'
const CITY         = 'Arequipa, Perú'

function Section({ title, children }) {
  return (
    <section className='mb-8'>
      <h2 className='text-lg font-black text-gray-900 mb-3 pb-2 border-b border-gray-100'>{title}</h2>
      <div className='text-sm text-gray-600 leading-relaxed space-y-3'>{children}</div>
    </section>
  )
}

export default function TermsAndConditions() {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white border-b border-gray-200'>
        <div className='max-w-4xl mx-auto px-5 py-4 flex items-center justify-between'>
          <Link to='/'><LogoFull height={36} /></Link>
          <Link to='/register'
            className='text-sm font-bold px-4 py-2 rounded-lg text-white transition-all'
            style={{ backgroundColor: '#C0392B' }}>
            Crear cuenta gratis
          </Link>
        </div>
      </header>

      <main className='max-w-4xl mx-auto px-5 py-12'>
        {/* Título */}
        <div className='mb-10'>
          <span className='inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4'
            style={{ backgroundColor: 'rgba(192,57,43,0.08)', color: '#C0392B' }}>
            Legal
          </span>
          <h1 className='text-3xl font-black text-gray-900 mb-2'>Términos y Condiciones</h1>
          <p className='text-sm text-gray-400'>
            Última actualización: {LAST_UPDATED} · Vigentes desde el 1 de enero de 2026
          </p>
        </div>

        <div className='bg-white rounded-2xl p-8 shadow-sm border border-gray-100'>

          <Section title='1. Aceptación de los Términos'>
            <p>
              Al acceder y utilizar la plataforma <strong>{COMPANY}</strong> (en adelante "el Servicio"),
              disponible en agendaya.pe, usted acepta quedar vinculado por estos Términos y Condiciones,
              nuestra Política de Privacidad y todas las leyes y regulaciones aplicables.
            </p>
            <p>
              Si no está de acuerdo con alguno de estos términos, no podrá utilizar el Servicio.
              El uso continuado del Servicio implica la aceptación de cualquier modificación a estos términos.
            </p>
            <p>
              Estos términos se rigen por la legislación peruana, incluyendo la Ley N° 29733 de Protección
              de Datos Personales y la Ley N° 27291 sobre contratos electrónicos.
            </p>
          </Section>

          <Section title='2. Descripción del Servicio'>
            <p>
              {COMPANY} es una plataforma SaaS (Software como Servicio) de gestión de reservas y citas
              online, diseñada para negocios en Perú. El Servicio permite a los negocios registrados:
            </p>
            <ul className='list-disc pl-5 space-y-1'>
              <li>Crear y gestionar una página pública de reservas online</li>
              <li>Recibir reservas de sus clientes de forma automatizada 24/7</li>
              <li>Enviar notificaciones automáticas vía WhatsApp a clientes y al negocio</li>
              <li>Gestionar horarios, servicios, personal y estadísticas desde un panel de control</li>
              <li>Recibir valoraciones y reseñas de sus clientes</li>
            </ul>
            <p>
              {COMPANY} actúa como intermediario tecnológico entre los negocios y sus clientes.
              No es parte en la relación comercial entre el negocio y el cliente final.
            </p>
          </Section>

          <Section title='3. Registro y Cuentas de Usuario'>
            <p>
              Para acceder a las funciones del panel de control, deberá crear una cuenta proporcionando
              información veraz, precisa y completa. Usted es responsable de:
            </p>
            <ul className='list-disc pl-5 space-y-1'>
              <li>Mantener la confidencialidad de sus credenciales de acceso</li>
              <li>Todas las actividades que ocurran bajo su cuenta</li>
              <li>Notificar a {COMPANY} inmediatamente ante cualquier uso no autorizado</li>
              <li>Proporcionar y mantener actualizada información verídica de su negocio</li>
            </ul>
            <p>
              Cada cuenta corresponde a un único negocio. No se permite compartir cuentas entre distintos
              negocios ni ceder el acceso a terceros sin autorización de {COMPANY}.
            </p>
            <p>
              Nos reservamos el derecho de suspender o cancelar cuentas que violen estos términos,
              contengan información falsa o sean utilizadas con fines fraudulentos.
            </p>
          </Section>

          <Section title='4. Planes, Precios y Facturación'>
            <p>
              {COMPANY} ofrece planes de suscripción mensual. Los precios vigentes son:
            </p>
            <ul className='list-disc pl-5 space-y-1'>
              <li><strong>Plan Básico:</strong> S/. 69 / mes (precio de lanzamiento)</li>
              <li><strong>Plan Pro:</strong> S/. 120 / mes</li>
            </ul>
            <p>
              Los nuevos registros incluyen un período de prueba gratuito de <strong>7 días</strong>.
              Vencido el período de prueba, el Servicio se suspenderá automáticamente hasta la
              confirmación del pago.
            </p>
            <p>
              Los pagos se realizan mensualmente mediante Yape, Plin, transferencia bancaria o
              pago en efectivo coordinado con el equipo de {COMPANY}. La integración con Izipay
              para pagos en línea con tarjeta estará disponible próximamente.
            </p>
            <p>
              <strong>Política de reembolso:</strong> No se realizan reembolsos por meses ya iniciados.
              Si cancela su suscripción, continuará teniendo acceso hasta el fin del período pagado.
              Los primeros 7 días de prueba son completamente gratuitos y no requieren tarjeta de crédito.
            </p>
            <p>
              {COMPANY} se reserva el derecho de modificar los precios con un aviso previo de
              30 días mediante correo electrónico a la dirección registrada.
            </p>
          </Section>

          <Section title='5. Uso Aceptable y Conducta Prohibida'>
            <p>Al utilizar {COMPANY}, usted se compromete a NO:</p>
            <ul className='list-disc pl-5 space-y-1'>
              <li>Utilizar el Servicio para actividades ilegales o fraudulentas</li>
              <li>Publicar información falsa, engañosa o que perjudique a terceros</li>
              <li>Enviar comunicaciones no solicitadas (spam) a través de las funciones de WhatsApp</li>
              <li>Intentar acceder a cuentas de otros usuarios sin autorización</li>
              <li>Interferir con el funcionamiento del Servicio o sus servidores</li>
              <li>Recolectar datos de otros usuarios del Servicio sin autorización</li>
              <li>Revender, sublicenciar o transferir el acceso al Servicio sin permiso escrito</li>
              <li>Utilizar el Servicio para negocios de contenido adulto, armas, sustancias controladas
                u otras actividades restringidas por la ley peruana</li>
            </ul>
            <p>
              El incumplimiento de estas normas resultará en la suspensión inmediata de la cuenta,
              sin derecho a reembolso, y podrá ser reportado a las autoridades competentes.
            </p>
          </Section>

          <Section title='6. Protección de Datos Personales'>
            <p>
              {COMPANY} cumple con la Ley N° 29733 — Ley de Protección de Datos Personales del Perú
              y su Reglamento (D.S. N° 003-2013-JUS).
            </p>
            <p><strong>Datos que recopilamos:</strong></p>
            <ul className='list-disc pl-5 space-y-1'>
              <li><strong>De los negocios:</strong> nombre, email, teléfono, dirección, tipo de negocio</li>
              <li><strong>De los clientes finales:</strong> nombre y número de WhatsApp (ingresados al reservar)</li>
              <li><strong>De uso:</strong> reservas, valoraciones, historial de citas</li>
            </ul>
            <p><strong>Uso de los datos:</strong></p>
            <ul className='list-disc pl-5 space-y-1'>
              <li>Gestionar el Servicio y las reservas</li>
              <li>Enviar notificaciones de confirmación, recordatorios y solicitudes de valoración por WhatsApp</li>
              <li>Mejorar el Servicio mediante análisis de uso agregado y anonimizado</li>
              <li>Comunicaciones sobre actualizaciones del Servicio y facturación</li>
            </ul>
            <p>
              Los negocios registrados en {COMPANY} son responsables del tratamiento de los datos
              personales de sus clientes y deben cumplir con la legislación de protección de datos.
              {COMPANY} actúa como encargado del tratamiento en nombre de los negocios.
            </p>
            <p>
              <strong>Derechos ARCO:</strong> Los usuarios pueden ejercer sus derechos de Acceso,
              Rectificación, Cancelación y Oposición escribiendo a {EMAIL}.
            </p>
            <p>
              Los datos no son vendidos ni cedidos a terceros, salvo requerimiento de autoridad competente.
              Las notificaciones WhatsApp se envían únicamente para la gestión de las reservas del servicio
              contratado con el negocio.
            </p>
          </Section>

          <Section title='7. Propiedad Intelectual'>
            <p>
              La plataforma {COMPANY}, incluyendo su código, diseño, logotipos, textos y funcionalidades,
              es propiedad exclusiva de {COMPANY} y está protegida por las leyes de propiedad intelectual
              de Perú y tratados internacionales.
            </p>
            <p>
              Los negocios registrados conservan la propiedad de sus datos (nombre del negocio, servicios,
              horarios, clientes). {COMPANY} obtiene una licencia limitada para procesar y mostrar
              estos datos únicamente con el fin de prestar el Servicio.
            </p>
            <p>
              Al subir imágenes o contenido a {COMPANY}, usted garantiza tener los derechos necesarios
              y otorga a {COMPANY} una licencia no exclusiva para mostrar dicho contenido en el Servicio.
            </p>
          </Section>

          <Section title='8. Disponibilidad y Mantenimiento'>
            <p>
              {COMPANY} se compromete a mantener el Servicio disponible el mayor tiempo posible.
              Sin embargo, no garantiza una disponibilidad del 100% y no se responsabiliza por:
            </p>
            <ul className='list-disc pl-5 space-y-1'>
              <li>Interrupciones temporales por mantenimiento programado (notificado con 24h de anticipación)</li>
              <li>Fallos en servicios de terceros (Railway, WhatsApp, CallMeBot)</li>
              <li>Interrupciones causadas por fuerza mayor, ataques informáticos o desastres naturales</li>
              <li>Pérdida de notificaciones WhatsApp por limitaciones del proveedor</li>
            </ul>
            <p>
              En caso de interrupción prolongada imputable a {COMPANY}, se ofrecerá compensación
              proporcional al tiempo afectado como crédito en la próxima factura.
            </p>
          </Section>

          <Section title='9. Limitación de Responsabilidad'>
            <p>
              En la máxima medida permitida por la ley peruana, {COMPANY} no será responsable por:
            </p>
            <ul className='list-disc pl-5 space-y-1'>
              <li>Daños indirectos, incidentales o consecuentes derivados del uso del Servicio</li>
              <li>Pérdida de ingresos, datos o clientes debido a interrupciones del Servicio</li>
              <li>Disputas entre negocios y sus clientes finales</li>
              <li>El incumplimiento por parte de los negocios de sus obligaciones con los clientes</li>
              <li>Inexactitudes en la información proporcionada por los negocios registrados</li>
            </ul>
            <p>
              La responsabilidad máxima de {COMPANY} ante cualquier reclamación no excederá el monto
              pagado por el usuario en los últimos 3 meses de servicio.
            </p>
          </Section>

          <Section title='10. Terminación del Servicio'>
            <p>
              <strong>Por el usuario:</strong> Puede cancelar su suscripción en cualquier momento desde
              los Ajustes del panel de control o enviando un correo a {EMAIL}. El acceso continuará
              hasta el fin del período pagado.
            </p>
            <p>
              <strong>Por {COMPANY}:</strong> Nos reservamos el derecho de suspender o cancelar cuentas
              que violen estos términos, con previo aviso de 7 días salvo en casos de fraude o actividad
              ilegal donde la suspensión será inmediata.
            </p>
            <p>
              <strong>Tras la cancelación:</strong> Los datos del negocio y sus reservas se conservarán
              durante 30 días, período en el que el usuario podrá solicitar una exportación de sus datos.
              Pasado ese período, los datos serán eliminados permanentemente.
            </p>
          </Section>

          <Section title='11. Aplicación Móvil'>
            <p>
              {COMPANY} está actualmente disponible como aplicación web progresiva (PWA) instalable
              en dispositivos móviles y de escritorio. La aplicación móvil nativa para Android e iOS
              está en desarrollo y será anunciada oportunamente.
            </p>
            <p>
              Las notificaciones push y funcionalidades específicas de la app móvil estarán sujetas
              a los términos adicionales que se publiquen en el momento de su lanzamiento.
            </p>
          </Section>

          <Section title='12. Modificaciones a los Términos'>
            <p>
              {COMPANY} se reserva el derecho de modificar estos Términos y Condiciones en cualquier
              momento. Los cambios se notificarán mediante:
            </p>
            <ul className='list-disc pl-5 space-y-1'>
              <li>Correo electrónico a la dirección registrada, con al menos 15 días de anticipación</li>
              <li>Aviso prominente al ingresar al panel de control</li>
              <li>Actualización de la fecha "Última actualización" en esta página</li>
            </ul>
            <p>
              El uso continuado del Servicio tras la fecha de vigencia de los cambios implica
              la aceptación de los nuevos términos.
            </p>
          </Section>

          <Section title='13. Ley Aplicable y Resolución de Disputas'>
            <p>
              Estos Términos y Condiciones se rigen por las leyes de la República del Perú.
              Cualquier disputa será sometida a los tribunales competentes de la ciudad de {CITY},
              renunciando las partes a cualquier otro fuero que pudiera corresponderles.
            </p>
            <p>
              Antes de iniciar cualquier acción legal, las partes se comprometen a intentar resolver
              la disputa de forma amistosa mediante comunicación directa a {EMAIL}, con un plazo
              de 30 días para alcanzar un acuerdo.
            </p>
          </Section>

          <Section title='14. Contacto'>
            <p>
              Para cualquier consulta sobre estos Términos y Condiciones, puede contactarnos en:
            </p>
            <ul className='list-none space-y-1'>
              <li><strong>Email:</strong> {EMAIL}</li>
              <li><strong>Ubicación:</strong> {CITY}</li>
              <li><strong>Web:</strong> agendaya.pe</li>
            </ul>
            <p className='text-xs text-gray-400 mt-4'>
              Propietario y desarrollador: Jerson Ernesto Chura Pacci · {CITY}
            </p>
          </Section>

        </div>
      </main>

      {/* Footer */}
      <footer className='py-8 text-center text-xs text-gray-400'>
        <div className='flex items-center justify-center gap-6'>
          <Link to='/' className='hover:text-gray-600'>Inicio</Link>
          <Link to='/privacidad' className='hover:text-gray-600'>Privacidad</Link>
          <Link to='/register' className='hover:text-gray-600'>Crear cuenta</Link>
        </div>
        <p className='mt-3'>© {new Date().getFullYear()} {COMPANY} · {CITY}</p>
      </footer>
    </div>
  )
}
