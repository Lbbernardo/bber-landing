import React, { useState, useEffect } from 'react'

const ZOOM_LINK = "https://us02web.zoom.us/j/8325553030?pwd=rbido7FxaZz0UUr18OCXqCkzDfKYTS.1"
const WA_LINK = "https://wa.me/16304154252?text=Hola%20Luis%2C%20me%20registré%20al%20curso%20de%20Educación%20Financiera%20y%20quiero%20más%20información"

/* ─── Libro 3D ─── */
function BookMockup() {
  return (
    <div className="relative w-[180px] h-[240px] mx-auto" style={{ perspective: '900px' }}>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-5 rounded-full blur-xl" style={{ background: '#FFD60025' }} />
      <div className="w-full h-full" style={{ transform: 'rotateY(-15deg) rotateX(3deg)', transformStyle: 'preserve-3d' }}>
        <div className="absolute inset-0 rounded-r-lg rounded-l-sm overflow-hidden"
          style={{ background: 'linear-gradient(145deg,#1a0800,#0d0500)', boxShadow: '8px 12px 40px rgba(255,214,0,0.25),-2px 0 8px rgba(0,0,0,0.9)' }}>
          <div className="absolute inset-0 p-4 flex flex-col justify-between">
            <div className="h-0.5 w-full rounded-full" style={{ background: 'linear-gradient(90deg,#FFD600,#FF6B00)' }} />
            <div className="flex items-center gap-1 mt-2">
              <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: '#FFD600' }}>
                <span className="font-black text-black" style={{ fontSize: '8px' }}>B</span>
              </div>
              <span className="text-white font-black" style={{ fontSize: '10px' }}>BBER</span>
            </div>
            <div className="flex-1 flex flex-col justify-center py-2">
              <div className="font-bold uppercase tracking-widest mb-1" style={{ fontSize: '8px', color: '#FFD600' }}>Curso de</div>
              <h2 className="font-black text-white leading-tight" style={{ fontSize: '14px' }}>
                EDUCACIÓN<br />FINANCIERA
              </h2>
              <div className="mt-1" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8px', lineHeight: 1.5 }}>
                Aprende a manejar tu dinero,<br />invierte y construye tu futuro.
              </div>
            </div>
            <div className="flex justify-end">
              <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-black text-sm" style={{ background: 'linear-gradient(135deg,#FFD600,#FF8C00)' }}>$</div>
            </div>
          </div>
          <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(135deg,#fff 0%,transparent 50%)' }} />
        </div>
        <div className="absolute left-0 top-0 h-full w-3 rounded-l-sm"
          style={{ background: 'linear-gradient(180deg,#FFD600,#CC8800)', transform: 'translateZ(-3px) translateX(-3px)', boxShadow: '-2px 0 6px rgba(0,0,0,0.8)' }} />
      </div>
    </div>
  )
}

/* ─── Formulario ─── */
function LeadForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Tu nombre es requerido'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Ingresa un correo válido'
    if (!form.phone.trim()) e.phone = 'Tu WhatsApp es requerido'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await fetch(`${import.meta.env.VITE_CRM_URL || 'https://crmagencia-production.up.railway.app'}/api/webhook?account=luis-bernardo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, source: 'bber-landing' }),
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  const handleChange = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }))
  }

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#22C55E15', border: '1px solid #22C55E40' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-xl font-black text-white mb-2">¡Ya estás registrado!</h3>
        <p className="text-sm mb-1" style={{ color: '#888' }}>Clases Lun–Vie · 8PM Central · 9PM Eastern</p>
        <p className="text-xs mb-4" style={{ color: '#555' }}>Entra a la clase con este link:</p>
        <a
          href={ZOOM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block', wordBreak: 'break-all',
            color: '#FFD600', fontSize: '12px', marginBottom: '20px',
            textDecoration: 'underline'
          }}
        >
          {ZOOM_LINK}
        </a>
        <a
          href="https://api.whatsapp.com/send?phone=16304154252&text=Hola%20Luis%2C%20me%20registré%20al%20curso%20de%20Educación%20Financiera%20y%20quiero%20más%20información"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-green"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Escríbeme por WhatsApp
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div>
        <input type="text" className={`input-dark ${errors.name ? 'border-red-500/60' : ''}`}
          placeholder="Tu nombre completo" value={form.name} onChange={handleChange('name')} />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <input type="email" className={`input-dark ${errors.email ? 'border-red-500/60' : ''}`}
          placeholder="Tu correo electrónico" value={form.email} onChange={handleChange('email')} />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <input type="tel" className={`input-dark ${errors.phone ? 'border-red-500/60' : ''}`}
          placeholder="Tu WhatsApp (+1 630 000 0000)" value={form.phone} onChange={handleChange('phone')} />
        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
      </div>
      <button type="submit" disabled={loading}
        className="btn-green w-full text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed">
        {loading
          ? <svg className="animate-spin w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
          : 'QUIERO ACCESO AL CURSO →'}
      </button>
      <p className="text-center text-xs" style={{ color: '#444' }}>
        🔒 Tu información está segura · Sin spam
      </p>
    </form>
  )
}

/* ─── CTA Banner móvil ─── */
function MobileCTABanner() {
  const scrollToForm = () => {
    const el = document.getElementById('form-registro')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <div className="fixed top-16 left-0 right-0 z-40 lg:hidden"
      style={{ background: 'linear-gradient(90deg,#22C55E,#16A34A)', boxShadow: '0 4px 20px rgba(34,197,94,0.35)' }}>
      <button
        onClick={scrollToForm}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 text-white font-black text-sm uppercase tracking-wide active:scale-[0.99] transition-transform"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 flex-shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Quiero obtener mis clases financieras
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 flex-shrink-0 animate-bounce">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  )
}

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom: scrolled ? '1px solid #ffffff0a' : 'none' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-sm" style={{ background: '#FFD600' }}>B</div>
          <span className="font-black text-white text-lg">BBER</span>
        </div>
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-green text-sm px-4 py-2.5 font-black">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </a>
      </div>
    </header>
  )
}

/* ─── PÁGINA PRINCIPAL ─── */
export default function App() {
  return (
    <>
      <Navbar />
      <MobileCTABanner />
      <main className="min-h-screen flex items-center pt-28 lg:pt-16 relative overflow-hidden">
        {/* Fondos */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #FFD60010 0%, transparent 60%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* ── Izquierda ── */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
                style={{ background: '#FFD60015', color: '#FFD600', border: '1px solid #FFD60030' }}>
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                ESTA OFERTA LLEGÓ A TI
              </div>

              {/* Headline */}
              <h1 className="font-black leading-tight tracking-tight mb-3" style={{ fontSize: 'clamp(2rem,5vw,3.2rem)' }}>
                Porque necesitas algo que<br />
                <span style={{ color: '#FFD600' }}>nunca te enseñaron:</span>
              </h1>
              <h2 className="font-black leading-none mb-5" style={{ fontSize: 'clamp(2.8rem,7vw,5rem)', color: '#FFD600', letterSpacing: '-0.02em' }}>
                EDUCACIÓN<br />FINANCIERA
              </h2>
              <p className="text-lg leading-relaxed mb-6" style={{ color: '#999' }}>
                Aprende a manejar tu dinero, invierte y construye el futuro que mereces — completamente en español.
              </p>

              {/* Precio */}
              <div className="flex items-center gap-4 mb-8">
                <div className="px-3 py-1 rounded-lg" style={{ background: '#1A0000' }}>
                  <span className="font-bold line-through" style={{ color: '#EF4444', fontSize: '20px' }}>$99.99</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>AHORA SOLO</span>
                    <span className="font-black" style={{ color: '#FFD600', fontSize: '44px', lineHeight: 1 }}>$1.99</span>
                  </div>
                  <p style={{ color: '#666', fontSize: '12px' }}>Pagas solo al finalizar el curso</p>
                </div>
              </div>

              {/* Libro + detalles */}
              <div className="flex items-end gap-8">
                <BookMockup />
                <div className="flex flex-col gap-2.5 pb-2">
                  {[
                    { icon: '📅', text: 'Lunes a Viernes en vivo' },
                    { icon: '🕗', text: '8PM Central · 9PM Eastern' },
                    { icon: '🎥', text: 'Por Zoom · Mismo link siempre' },
                    { icon: '💰', text: 'Pagas solo al finalizar' },
                  ].map(({ icon, text }, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm" style={{ color: '#999' }}>
                      <span>{icon}</span><span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Derecha: solo el formulario ── */}
            <div>
              <div id="form-registro" className="rounded-2xl overflow-hidden" style={{ background: '#111', border: '1px solid #ffffff12' }}>
                <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#FFD600,#FF8C00)' }} />
                <div className="p-7 sm:p-8">
                  <div className="text-center mb-6">
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#FFD600' }}>
                      APROVECHA NUESTRO CURSO
                    </p>
                    <h3 className="text-2xl font-black text-white mb-1">Ingresa tus datos</h3>
                    <p className="text-sm" style={{ color: '#888' }}>
                      Te enviamos el acceso y el link de Zoom ahora mismo
                    </p>
                  </div>

                  <LeadForm />

                  <div className="flex justify-center gap-6 mt-6 flex-wrap">
                    {[
                      { icon: '💳', text: 'Pagas al finalizar' },
                      { icon: '🤝', text: 'Sin compromiso' },
                      { icon: '🔥', text: 'Lun–Vie en vivo' },
                    ].map(({ icon, text }, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 text-center" style={{ maxWidth: '80px' }}>
                        <span className="text-xl">{icon}</span>
                        <span className="text-xs" style={{ color: '#444' }}>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social proof */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="flex -space-x-2">
                  {['A','M','J','R','L'].map((l, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-black flex items-center justify-center text-xs font-bold text-black"
                      style={{ background: ['#FFD600','#FFB800','#FF8C00','#FFD600','#FFE033'][i] }}>
                      {l}
                    </div>
                  ))}
                </div>
                <span className="text-sm" style={{ color: '#555' }}>
                  <span className="text-white font-semibold">+2,400 familias</span> ya tomaron el curso
                </span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* WhatsApp flotante */}
      <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-5 z-50 flex items-center gap-2 text-white text-sm font-bold px-4 py-3 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
        style={{ background: '#22C55E', boxShadow: '0 8px 32px rgba(34,197,94,0.4)' }}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="hidden sm:inline">Más información</span>
      </a>

      <footer style={{ borderTop: '1px solid #ffffff06', background: '#050505' }}>
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center font-black text-black text-xs" style={{ background: '#FFD600' }}>B</div>
            <span className="font-black text-white text-sm">BBER</span>
          </div>
          <p className="text-xs" style={{ color: '#333' }}>
            © {new Date().getFullYear()} BBER · Contenido educativo. No constituye asesoría fiscal ni de inversión.
          </p>
        </div>
      </footer>
    </>
  )
}
