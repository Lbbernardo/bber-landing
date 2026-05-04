import React, { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import CalculadoraFinanciera from './CalculadoraFinanciera'

const GHL_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/vtWSv9kV9PHekvK5VirT/webhook-trigger/851ca584-29ff-469a-bbcb-15f48b8867d4'
const CRM_WEBHOOK = 'https://crmagencia-production.up.railway.app/api/webhook?account=bber'
const WA_LINK     = 'https://wa.me/16304154252?text=Hola%20Luis%2C%20quiero%20agendar%20una%20consulta%20gratuita'

async function submitLead(payload) {
  await Promise.allSettled([
    fetch(GHL_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
    fetch(CRM_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  ])
}

function useFadeIn(delay = 0) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)' }, delay)
        obs.disconnect()
      }
    }, { threshold: 0.08 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return ref
}

const M = { fontFamily: 'Montserrat, sans-serif' }

/* ══════════════════════════════════════════
   HERO — Asesor personal
═══════════════════════════════════════════ */
function HeroSection() {
  return (
    <section id="inicio" className="pt-20 pb-16 px-4 sm:px-6" style={{ background: '#EEF4FF' }}>
      <div className="max-w-page mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Texto */}
          <div>
            <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
              style={{ ...M, background: '#0D1A3A', color: '#fff' }}>
              Asesor Financiero · Latino First
            </span>

            <h1 style={{ ...M, fontWeight: 900, fontSize: 'clamp(2.4rem,5vw,3.8rem)', lineHeight: 1.05, color: '#0D1A3A', marginBottom: '16px' }}>
              Construye tu<br />
              <span style={{ color: '#22C55E' }}>futuro financiero</span><br />
              con confianza
            </h1>

            <p className="text-base font-semibold mb-3" style={{ color: '#334155' }}>
              Asesoría financiera en español para latinos en USA
            </p>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#64748B', maxWidth: '480px' }}>
              Soy Luis Bernardo — broker de seguros licenciado, ingeniero en sistemas y
              especialista en planificación de retiro. Ayudo a familias latinas a proteger
              su patrimonio, eliminar deudas y construir riqueza generacional.
            </p>

            {/* Credenciales */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                { icon: '🛡️', text: 'Broker Licenciado' },
                { icon: '💻', text: 'Ing. en Sistemas' },
                { icon: '🤖', text: 'Master en IA' },
              ].map(({ icon, text }) => (
                <span key={text} className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg"
                  style={{ background: '#fff', border: '1px solid #E2E8F0', color: '#334155' }}>
                  {icon} {text}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#cita" onClick={e => { e.preventDefault(); document.getElementById('cita')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="btn-primary">
                Agenda tu consulta gratis
              </a>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Tarjeta de perfil */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm rounded-2xl overflow-hidden"
              style={{ background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 8px 32px rgba(13,26,58,0.10)' }}>
              <div style={{ height: '4px', background: 'linear-gradient(90deg,#22C55E,#16A34A)' }} />
              <div className="p-7">
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center rounded-full flex-shrink-0 font-black text-white text-xl"
                    style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg,#0D1A3A,#1B3A6B)', border: '3px solid #EEF4FF', fontFamily: 'Montserrat,sans-serif' }}>
                    LB
                  </div>
                  <div>
                    <p className="font-black text-base" style={{ ...M, color: '#0D1A3A' }}>Luis Bernardo</p>
                    <p className="text-sm font-semibold" style={{ color: '#22C55E' }}>Asesor Financiero</p>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>Bernardo Solution Financial</p>
                  </div>
                </div>

                {/* Especialidades */}
                <div className="space-y-2.5 mb-6">
                  {[
                    { color: '#3B82F6', bg: '#DBEAFE', text: 'Seguros de Vida · IUL' },
                    { color: '#22C55E', bg: '#DCFCE7', text: 'Planificación de Retiro' },
                    { color: '#F97316', bg: '#FED7AA', text: 'Manejo de Deudas' },
                    { color: '#6366F1', bg: '#E0E7FF', text: 'Protección de Patrimonio' },
                  ].map(({ color, bg, text }) => (
                    <div key={text} className="flex items-center gap-3 text-sm rounded-lg px-3 py-2"
                      style={{ background: bg }}>
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color, display: 'block' }} />
                      <span style={{ color: '#334155', fontWeight: 600 }}>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-5" style={{ borderTop: '1px solid #F1F5F9' }}>
                  {[
                    { value: '100%', label: 'En español' },
                    { value: 'Gratis', label: 'Consulta' },
                    { value: 'USA', label: 'Latino First' },
                  ].map(({ value, label }) => (
                    <div key={label} className="text-center">
                      <p className="font-black text-base" style={{ ...M, color: '#22C55E' }}>{value}</p>
                      <p className="text-xs" style={{ color: '#94A3B8' }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   SERVICIOS
═══════════════════════════════════════════ */
const SERVICES = [
  {
    color: '#3B82F6', bg: '#DBEAFE',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '26px', height: '26px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    title: 'Seguros de Vida IUL',
    desc:  'Pólizas de vida indexadas que protegen a tu familia y crecen libres de impuestos. La herramienta más poderosa para el retiro latino.',
  },
  {
    color: '#22C55E', bg: '#DCFCE7',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '26px', height: '26px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
    title: 'Planificación de Retiro',
    desc:  'Estrategia personalizada combinando IUL, Roth IRA y 401k para que puedas retirarte con dignidad, sin depender solo del Seguro Social.',
  },
  {
    color: '#F97316', bg: '#FED7AA',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '26px', height: '26px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75" /></svg>,
    title: 'Manejo de Deudas',
    desc:  'Plan estructurado para eliminar deudas de tarjetas, préstamos y médicos — liberando capital para invertir en tu futuro.',
  },
  {
    color: '#6366F1', bg: '#E0E7FF',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '26px', height: '26px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
    title: 'Protección de Patrimonio',
    desc:  'Estrategias para proteger los activos que construiste — para ti, tu familia y las próximas generaciones.',
  },
]

function ServicesSection() {
  const ref = useFadeIn()
  return (
    <section id="servicios" ref={ref} className="py-16 px-4 sm:px-6"
      style={{ background: '#fff', opacity: 0, transform: 'translateY(24px)', transition: 'opacity .6s ease, transform .6s ease' }}>
      <div className="max-w-page mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
            style={{ ...M, background: '#DCFCE7', color: '#15803D', border: '1px solid rgba(34,197,94,0.25)' }}>
            Servicios
          </span>
          <h2 style={{ ...M, fontWeight: 900, fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#0D1A3A', marginBottom: '12px' }}>
            ¿En qué puedo ayudarte?
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#64748B' }}>
            Asesoría financiera integral — en español, sin costo inicial, diseñada para la realidad de los latinos en USA.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s, i) => (
            <div key={i} className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-1"
              style={{ background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(13,26,58,0.06)' }}>
              <div className="flex items-center justify-center rounded-2xl"
                style={{ width: '56px', height: '56px', background: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <h3 style={{ ...M, fontWeight: 800, fontSize: '0.95rem', color: '#0D1A3A' }}>{s.title}</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.6 }}>{s.desc}</p>
              <a href="#cita"
                onClick={e => { e.preventDefault(); document.getElementById('cita')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="mt-auto text-xs font-bold flex items-center gap-1 transition-colors hover:opacity-70"
                style={{ color: s.color }}>
                Consultar gratis →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   HERRAMIENTAS
═══════════════════════════════════════════ */
function EbookCard() {
  const [form, setForm]       = useState({ name: '', email: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name  = 'Requerido'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo inválido'
    return e
  }

  const handleSubmit = async ev => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try { await submitLead({ ...form, phone: '', source: 'ebook-retiro-200', guia: 'Guía retiro $200/mes' }) }
    catch { /* continúa */ }
    finally { setLoading(false); setDone(true) }
  }

  return (
    <div className="rounded-2xl overflow-hidden h-full"
      style={{ background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(13,26,58,0.08)' }}>
      {/* Header */}
      <div className="p-6" style={{ background: '#0D1A3A' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center rounded-lg"
            style={{ width: '40px', height: '40px', background: '#22C55E' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <div>
            <p style={{ ...M, fontWeight: 800, color: '#fff', fontSize: '0.85rem' }}>GUÍA GRATUITA</p>
            <p style={{ color: '#94A3B8', fontSize: '0.75rem' }}>PDF · 8 páginas</p>
          </div>
        </div>
        <h3 style={{ ...M, fontWeight: 900, color: '#fff', fontSize: '1.1rem', lineHeight: 1.2 }}>
          Cómo crear un fondo de retiro con solo $200 al mes
        </h3>
        <span className="inline-block mt-2 font-black text-black text-xs px-3 py-1 rounded-full"
          style={{ background: '#22C55E', fontFamily: 'Montserrat,sans-serif' }}>
          CON SOLO $200 AL MES
        </span>
      </div>

      {/* Form */}
      <div className="p-6">
        {done ? (
          <div className="text-center py-3">
            <div className="flex items-center justify-center rounded-full mx-auto mb-3"
              style={{ width: '48px', height: '48px', background: '#DCFCE7', border: '2px solid #22C55E' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" style={{ width: '24px', height: '24px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p style={{ ...M, fontWeight: 800, color: '#0D1A3A', marginBottom: '8px' }}>¡Listo!</p>
            <a href="/guias/retiro-200.pdf" download className="btn-primary w-full text-sm">
              Descargar guía gratis
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-3">
            <div>
              <input type="text" className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                placeholder="Tu nombre" value={form.name}
                onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: undefined })) }} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <input type="email" className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                placeholder="Tu correo electrónico" value={form.email}
                onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: undefined })) }} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full text-sm py-3.5 disabled:opacity-60">
              {loading ? '...' : 'DESCARGAR GRATIS →'}
            </button>
            <p className="text-center text-xs" style={{ color: '#94A3B8' }}>🔒 Sin spam · Acceso inmediato</p>
          </form>
        )}
      </div>
    </div>
  )
}

function ToolsSection() {
  const ref = useFadeIn()
  return (
    <section id="herramientas" ref={ref} className="py-16 px-4 sm:px-6"
      style={{ background: '#EEF4FF', opacity: 0, transform: 'translateY(24px)', transition: 'opacity .6s ease, transform .6s ease' }}>
      <div className="max-w-page mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
            style={{ ...M, background: '#DBEAFE', color: '#1D4ED8', border: '1px solid #BFDBFE' }}>
            Herramientas Gratuitas
          </span>
          <h2 style={{ ...M, fontWeight: 900, fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#0D1A3A', marginBottom: '12px' }}>
            Recursos para tu futuro financiero
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#64748B' }}>
            Guías, calculadoras y apps diseñadas para la comunidad latina en USA. Todo gratis.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Ebook */}
          <EbookCard />

          {/* Calculadora */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(13,26,58,0.08)' }}>
            <div className="p-6" style={{ background: '#0D1A3A' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center rounded-lg"
                  style={{ width: '40px', height: '40px', background: '#3B82F6' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.598 4.5 4.698V18a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0019.5 18V4.698c0-1.1-.807-1.998-1.907-2.126A48.507 48.507 0 0012 2.25z" />
                  </svg>
                </div>
                <div>
                  <p style={{ ...M, fontWeight: 800, color: '#fff', fontSize: '0.85rem' }}>CALCULADORA GRATIS</p>
                  <p style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Interactiva · En tiempo real</p>
                </div>
              </div>
              <h3 style={{ ...M, fontWeight: 900, color: '#fff', fontSize: '1.1rem', lineHeight: 1.2 }}>
                Calculadora de retiro interactiva
              </h3>
            </div>
            <div className="p-4">
              <CalculadoraFinanciera embedded />
            </div>
          </div>
        </div>

        {/* Apps próximas */}
        <div className="mt-10">
          <p className="text-center text-sm font-bold mb-5" style={{ ...M, color: '#94A3B8', letterSpacing: '0.08em' }}>
            PRÓXIMAMENTE
          </p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: '📊', name: 'BBER Pro', tag: 'Calculadora avanzada IUL', color: '#3B82F6', bg: '#DBEAFE' },
              { icon: '🛡️', name: 'PlanIUL',  tag: 'Planificador de póliza',   color: '#22C55E', bg: '#DCFCE7' },
              { icon: '💳', name: 'DeudaCero',tag: 'Elimina deudas rápido',    color: '#F97316', bg: '#FED7AA' },
            ].map(app => (
              <div key={app.name} className="flex items-center gap-4 rounded-xl p-4"
                style={{ background: '#fff', border: '1px solid #E2E8F0', opacity: 0.8 }}>
                <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: '44px', height: '44px', background: app.bg }}>
                  <span style={{ fontSize: '20px' }}>{app.icon}</span>
                </div>
                <div>
                  <p style={{ ...M, fontWeight: 800, fontSize: '0.85rem', color: '#0D1A3A' }}>{app.name}</p>
                  <p style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{app.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   AGENDA TU CITA
═══════════════════════════════════════════ */
function AppointmentForm() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', day: '', message: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name  = 'Requerido'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo inválido'
    if (!form.phone.trim()) e.phone = 'Requerido'
    return e
  }

  const handleSubmit = async ev => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await submitLead({
        ...form,
        source:  'cita-bber',
        guia:    '',
        notes:   `CITA SOLICITADA. Día preferido: ${form.day || 'No indicado'}. Mensaje: ${form.message || 'Sin mensaje'}`,
      })
    } catch { /* continúa */ }
    finally { setLoading(false); setDone(true) }
  }

  const change = field => ev => {
    setForm(p => ({ ...p, [field]: ev.target.value }))
    if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }))
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center rounded-full mx-auto mb-5"
          style={{ width: '64px', height: '64px', background: '#DCFCE7', border: '2px solid #22C55E' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" style={{ width: '30px', height: '30px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 style={{ ...M, fontWeight: 900, fontSize: '1.4rem', color: '#0D1A3A', marginBottom: '8px' }}>
          ¡Solicitud recibida!
        </h3>
        <p className="text-sm mb-6" style={{ color: '#64748B' }}>
          Luis se pondrá en contacto contigo en las próximas horas para confirmar tu cita.
        </p>
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Confirmar por WhatsApp
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#64748B' }}>Nombre completo *</label>
          <input type="text" className={`input-field ${errors.name ? 'border-red-400' : ''}`}
            placeholder="Tu nombre" value={form.name} onChange={change('name')} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#64748B' }}>WhatsApp / Teléfono *</label>
          <input type="tel" className={`input-field ${errors.phone ? 'border-red-400' : ''}`}
            placeholder="+1 (630) 000-0000" value={form.phone} onChange={change('phone')} />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#64748B' }}>Correo electrónico *</label>
        <input type="email" className={`input-field ${errors.email ? 'border-red-400' : ''}`}
          placeholder="tucorreo@gmail.com" value={form.email} onChange={change('email')} />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#64748B' }}>¿Cuándo prefieres la cita?</label>
        <select className="input-field" value={form.day} onChange={change('day')}>
          <option value="">Selecciona un día preferido</option>
          <option value="lunes">Lunes</option>
          <option value="martes">Martes</option>
          <option value="miercoles">Miércoles</option>
          <option value="jueves">Jueves</option>
          <option value="viernes">Viernes</option>
          <option value="sabado">Sábado</option>
          <option value="flexible">Soy flexible</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#64748B' }}>¿Sobre qué tema quieres hablar? (opcional)</label>
        <textarea className="input-field" rows={3} placeholder="Ej: quiero saber sobre seguros de vida, retiro, eliminar deudas..."
          value={form.message} onChange={change('message')}
          style={{ resize: 'none' }} />
      </div>

      <button type="submit" disabled={loading}
        className="btn-primary w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed">
        {loading
          ? <svg className="animate-spin" style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          : 'AGENDAR MI CONSULTA GRATIS'
        }
      </button>
      <p className="text-center text-xs" style={{ color: '#94A3B8' }}>
        Consulta 100% gratuita · Sin compromiso · En español
      </p>
    </form>
  )
}

function CitaSection() {
  const ref = useFadeIn()
  return (
    <section id="cita" ref={ref} className="py-16 px-4 sm:px-6"
      style={{ background: '#fff', opacity: 0, transform: 'translateY(24px)', transition: 'opacity .6s ease, transform .6s ease' }}>
      <div className="max-w-page mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Info izquierda */}
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
              style={{ ...M, background: '#DCFCE7', color: '#15803D', border: '1px solid rgba(34,197,94,0.25)' }}>
              Consulta Gratuita
            </span>
            <h2 style={{ ...M, fontWeight: 900, fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#0D1A3A', marginBottom: '16px', lineHeight: 1.1 }}>
              Agenda una cita<br />conmigo
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: '#64748B' }}>
              En 30 minutos analizamos tu situación financiera actual y te doy un plan claro
              y accionable. Sin costo, sin compromiso, en español.
            </p>

            {/* Qué esperar */}
            <div className="space-y-4 mb-8">
              {[
                { color: '#22C55E', bg: '#DCFCE7', title: 'Análisis de tu situación', desc: 'Revisamos ingresos, gastos, deudas y objetivos de retiro.' },
                { color: '#3B82F6', bg: '#DBEAFE', title: 'Plan personalizado', desc: 'Te explico las mejores opciones para tu caso específico.' },
                { color: '#F97316', bg: '#FED7AA', title: 'Siguiente paso claro', desc: 'Sales con un plan de acción concreto, sin confusiones.' },
              ].map(({ color, bg, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{ width: '40px', height: '40px', background: bg }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" style={{ width: '18px', height: '18px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ ...M, fontWeight: 700, fontSize: '0.9rem', color: '#0D1A3A' }}>{title}</p>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '2px' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp directo */}
            <div className="rounded-2xl p-5" style={{ background: '#EEF4FF', border: '1px solid #BFDBFE' }}>
              <p className="text-sm font-semibold mb-3" style={{ color: '#1D4ED8' }}>
                ¿Prefieres hablar ahora mismo?
              </p>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex text-sm">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Escríbeme por WhatsApp
              </a>
            </div>
          </div>

          {/* Formulario derecha */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: '#fff', border: '1.5px solid #E2E8F0', boxShadow: '0 8px 32px rgba(13,26,58,0.08)' }}>
            <div style={{ height: '4px', background: 'linear-gradient(90deg,#22C55E,#16A34A)' }} />
            <div className="p-7">
              <h3 style={{ ...M, fontWeight: 900, fontSize: '1.2rem', color: '#0D1A3A', marginBottom: '4px' }}>
                Solicita tu consulta
              </h3>
              <p className="text-sm mb-6" style={{ color: '#64748B' }}>
                Luis te contactará en menos de 24 horas.
              </p>
              <AppointmentForm />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════ */
function Footer() {
  const scroll = href => e => { e.preventDefault(); document.getElementById(href)?.scrollIntoView({ behavior: 'smooth' }) }
  return (
    <footer style={{ background: '#0D1A3A' }}>
      <div className="max-w-page mx-auto px-4 sm:px-6 py-10">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex items-center justify-center font-black text-black rounded-lg text-sm"
                style={{ width: '30px', height: '30px', background: '#22C55E', fontFamily: 'Montserrat,sans-serif' }}>B</div>
              <span style={{ ...M, fontWeight: 900, color: '#fff', fontSize: '1.1rem' }}>BBER</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
              Bernardo Solution Financial<br />
              Educación financiera para transformar<br />tu dinero y tu futuro.
            </p>
          </div>

          <div>
            <p style={{ ...M, fontWeight: 700, fontSize: '0.7rem', color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Navegación</p>
            <div className="space-y-2">
              {[
                { label: 'Inicio', id: 'inicio' },
                { label: 'Servicios', id: 'servicios' },
                { label: 'Herramientas', id: 'herramientas' },
                { label: 'Agendar cita', id: 'cita' },
              ].map(({ label, id }) => (
                <a key={id} href={`#${id}`} onClick={scroll(id)}
                  className="block text-sm transition-colors hover:text-white" style={{ color: '#64748B' }}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p style={{ ...M, fontWeight: 700, fontSize: '0.7rem', color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Contacto</p>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm mb-2 hover:text-white transition-colors" style={{ color: '#22C55E' }}>
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '15px', height: '15px' }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp directo
            </a>
            <p className="text-sm" style={{ color: '#64748B' }}>bber.space</p>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '24px' }} />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color: '#475569' }}>
          <p>© {new Date().getFullYear()} BBER · Bernardo Solution Financial</p>
          <p>Contenido educativo. No constituye asesoría fiscal ni de inversión.</p>
        </div>
      </div>
    </footer>
  )
}

/* ── WhatsApp flotante ── */
function WhatsAppFloat() {
  return (
    <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
      className="fixed bottom-6 right-5 z-50 flex items-center gap-2 text-white text-sm font-bold px-4 py-3 rounded-full transition-all duration-200 hover:-translate-y-1"
      style={{ background: '#22C55E', boxShadow: '0 6px 20px rgba(34,197,94,0.45)', fontFamily: 'Montserrat,sans-serif' }}>
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      <span className="hidden sm:inline">Habla con Luis</span>
    </a>
  )
}

/* ══════════════════════════════════════════
   PÁGINA PRINCIPAL
═══════════════════════════════════════════ */
export default function Hub() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <ToolsSection />
        <CitaSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
