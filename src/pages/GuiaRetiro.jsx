import React, { useState, useEffect, useRef } from 'react'

const WA_LINK = "https://wa.me/16304154252?text=Hola%20Luis%2C%20le%C3%AD%20la%20gu%C3%ADa%20de%20retiro%20y%20quiero%20una%20asesor%C3%ADa%20gratuita"

/* ── Reveal on scroll ── */
function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function Reveal({ children, delay = 0, className = '' }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ── Book 3D (estilo portada del libro) ── */
function BookMockup() {
  return (
    <div className="relative w-[200px] h-[270px] mx-auto select-none" style={{ perspective: '900px' }}>
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[150px] h-6 rounded-full blur-2xl" style={{ background: '#D4AF3740' }} />
      <div
        className="w-full h-full relative"
        style={{ transform: 'rotateY(-16deg) rotateX(3deg)', transformStyle: 'preserve-3d' }}
      >
        {/* Portada */}
        <div
          className="absolute inset-0 rounded-r-lg rounded-l-sm overflow-hidden"
          style={{
            background: 'linear-gradient(150deg, #0d1825 0%, #050d18 100%)',
            boxShadow: '8px 14px 44px rgba(212,175,55,0.3), -2px 0 8px rgba(0,0,0,0.9)',
          }}
        >
          <div className="absolute inset-0 p-5 flex flex-col">
            {/* Línea superior dorada */}
            <div className="h-0.5 w-full rounded-full mb-3" style={{ background: 'linear-gradient(90deg, #D4AF37, #F5E27A, #D4AF37)' }} />

            {/* "SI TIENES" */}
            <div className="text-center mb-1" style={{ color: '#D4AF37', fontSize: '9px', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase' }}>SI TIENES</div>

            {/* "30 a 45" grande */}
            <div className="text-center leading-none font-black" style={{ color: '#fff', fontSize: '46px', letterSpacing: '-2px' }}>
              30<span style={{ color: '#D4AF37', fontSize: '28px', margin: '0 2px' }}>a</span>45
            </div>

            {/* Subtítulo */}
            <div className="text-center mt-1 mb-2 leading-tight" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '8px', fontWeight: 700 }}>
              AÑOS, ESTÁS EN LA<br />
              <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: '9px' }}>MEJOR EDAD</span><br />
              PARA EMPEZAR UN<br />
              <span style={{ color: '#fff', fontWeight: 900 }}>FONDO DE RETIRO.</span>
            </div>

            {/* Divisor */}
            <div className="h-px w-2/3 mx-auto mb-2" style={{ background: '#D4AF3750' }} />

            {/* Puntos */}
            <div className="flex flex-col gap-1 mb-2">
              {['Interés compuesto', 'Haz crecer tu dinero', 'Tranquilidad futura'].map((t, i) => (
                <div key={i} className="flex items-center gap-1.5" style={{ fontSize: '7px', color: 'rgba(255,255,255,0.6)' }}>
                  <div className="w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: '1px solid #D4AF3770' }}>
                    <div className="w-1 h-1 rounded-full" style={{ background: '#D4AF37' }} />
                  </div>
                  {t}
                </div>
              ))}
            </div>

            <div className="mt-auto text-center" style={{ color: '#D4AF37', fontSize: '8px', fontWeight: 900, letterSpacing: '2px' }}>
              TU FUTURO COMIENZA HOY
            </div>
          </div>

          {/* Brillo sutil */}
          <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
        </div>

        {/* Lomo */}
        <div
          className="absolute left-0 top-0 h-full w-3 rounded-l-sm"
          style={{
            background: 'linear-gradient(180deg, #C9961F, #8B6914)',
            transform: 'translateZ(-3px) translateX(-3px)',
            boxShadow: '-2px 0 6px rgba(0,0,0,0.8)',
          }}
        />
      </div>
    </div>
  )
}

/* ── Calculadora simple ── */
function Calculadora() {
  const [edad, setEdad] = useState(35)
  const [aporte, setAporte] = useState(300)
  const [tasa, setTasa] = useState(7)

  const anos = 65 - edad
  const meses = anos * 12
  const tasaMensual = tasa / 100 / 12
  const futuro = aporte * ((Math.pow(1 + tasaMensual, meses) - 1) / tasaMensual)
  const totalAportado = aporte * meses

  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#0a1420', border: '1px solid #D4AF3730' }}>
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #D4AF37, #F5E27A, #D4AF37)' }} />
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#D4AF3720', border: '1px solid #D4AF3740' }}>
            <svg viewBox="0 0 20 20" fill="#D4AF37" className="w-4 h-4">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <div className="text-white font-black text-sm">Calculadora de Retiro</div>
            <div className="text-xs" style={{ color: '#888' }}>Ajusta los valores y ve tu potencial</div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-6">
          {[
            { label: 'Tu edad actual', value: edad, min: 30, max: 55, step: 1, set: setEdad, suffix: 'años' },
            { label: 'Aporte mensual', value: aporte, min: 100, max: 1000, step: 50, set: setAporte, suffix: '/mes' },
            { label: 'Rendimiento anual', value: tasa, min: 4, max: 12, step: 0.5, set: setTasa, suffix: '%' },
          ].map(({ label, value, min, max, step, set, suffix }) => (
            <div key={label}>
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-xs font-bold" style={{ color: '#aaa' }}>{label}</label>
                <span className="text-sm font-black" style={{ color: '#D4AF37' }}>
                  {suffix === '/mes' ? `$${value}${suffix}` : `${value} ${suffix}`}
                </span>
              </div>
              <input
                type="range" min={min} max={max} step={step} value={value}
                onChange={e => set(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#D4AF37', background: `linear-gradient(to right, #D4AF37 ${((value - min) / (max - min)) * 100}%, #1a2535 ${((value - min) / (max - min)) * 100}%)` }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: '#555' }}>
                <span>{suffix === '/mes' ? `$${min}` : `${min}${suffix === 'años' ? '' : suffix}`}</span>
                <span>{suffix === '/mes' ? `$${max}` : `${max}${suffix === 'años' ? '' : suffix}`}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Resultado */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl p-4 text-center" style={{ background: '#0d1a2a', border: '1px solid #D4AF3720' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#888' }}>Años hasta retiro</div>
            <div className="text-3xl font-black" style={{ color: '#D4AF37' }}>{anos}</div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: '#0d1a2a', border: '1px solid #D4AF3720' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#888' }}>Total aportado</div>
            <div className="text-2xl font-black text-white">{fmt(totalAportado)}</div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: 'linear-gradient(135deg, #0d2010, #051008)', border: '1px solid #22C55E30' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#888' }}>Tu fondo al retirarte</div>
            <div className="text-2xl font-black" style={{ color: '#22C55E' }}>{fmt(futuro)}</div>
          </div>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: '#444' }}>
          * Ejemplo educativo. Resultados reales varían según el instrumento elegido.
        </p>
      </div>
    </div>
  )
}

/* ── Capítulo ── */
function Capitulo({ num, titulo, subtitulo, icono, children, index = 0 }) {
  return (
    <Reveal delay={index * 60}>
      <div className="rounded-2xl overflow-hidden" style={{ background: '#080f1a', border: '1px solid #D4AF3718' }}>
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-5">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: '#D4AF3715', border: '1px solid #D4AF3730' }}>
              {icono}
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#D4AF37' }}>
                Capítulo {num}
              </div>
              <h3 className="text-white font-black text-lg leading-tight">{titulo}</h3>
              {subtitulo && <p className="text-sm mt-1" style={{ color: '#888' }}>{subtitulo}</p>}
            </div>
          </div>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#bbb' }}>
            {children}
          </div>
        </div>
      </div>
    </Reveal>
  )
}

function P({ children }) {
  return <p className="leading-relaxed">{children}</p>
}

function Highlight({ children }) {
  return <strong style={{ color: '#F5E27A' }}>{children}</strong>
}

function Lista({ items }) {
  return (
    <ul className="space-y-2 mt-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="flex-shrink-0 mt-0.5 font-black" style={{ color: '#D4AF37' }}>→</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Callout({ children, icon = '💡' }) {
  return (
    <div className="flex gap-3 p-4 rounded-xl mt-4" style={{ background: '#D4AF3710', border: '1px solid #D4AF3725' }}>
      <span className="text-lg flex-shrink-0">{icon}</span>
      <p className="text-sm leading-relaxed" style={{ color: '#D4AF37' }}>{children}</p>
    </div>
  )
}

/* ── Formulario de captura ── */
function FormCaptura() {
  const [form, setForm] = useState({ name: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Tu nombre es requerido'
    if (!form.phone.trim()) e.phone = 'Tu WhatsApp es requerido'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await fetch('https://services.leadconnectorhq.com/hooks/vtWSv9kV9PHekvK5VirT/webhook-trigger/851ca584-29ff-469a-bbcb-15f48b8867d4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, phone: form.phone, source: 'guia-retiro-30-45' }),
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#22C55E15', border: '1px solid #22C55E40' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-xl font-black text-white mb-2">¡Listo, {form.name.split(' ')[0]}!</h3>
        <p className="text-sm mb-4" style={{ color: '#888' }}>Luis te contactará en las próximas horas para tu asesoría gratuita.</p>
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white font-black px-6 py-3 rounded-xl text-sm"
          style={{ background: '#22C55E', boxShadow: '0 4px 20px rgba(34,197,94,0.35)' }}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Escribirle por WhatsApp ahora
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div>
        <input
          type="text"
          placeholder="Tu nombre completo"
          value={form.name}
          onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: undefined })) }}
          className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
          style={{ background: '#0a1420', border: `1px solid ${errors.name ? '#EF4444' : '#1e2f42'}`, }}
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <input
          type="tel"
          placeholder="Tu WhatsApp (+1 630 000 0000)"
          value={form.phone}
          onChange={e => { setForm(p => ({ ...p, phone: e.target.value })); setErrors(p => ({ ...p, phone: undefined })) }}
          className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
          style={{ background: '#0a1420', border: `1px solid ${errors.phone ? '#EF4444' : '#1e2f42'}` }}
        />
        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-base text-black transition-all active:scale-[0.98] disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg, #D4AF37, #F5E27A)', boxShadow: '0 6px 24px rgba(212,175,55,0.35)' }}
      >
        {loading
          ? <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
          : 'QUIERO MI ASESORÍA GRATUITA →'}
      </button>
      <p className="text-center text-xs" style={{ color: '#444' }}>🔒 Sin spam · Sin costo · Sin compromiso</p>
    </form>
  )
}

/* ── PÁGINA PRINCIPAL ── */
export default function GuiaRetiro() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div className="min-h-screen text-white font-sans" style={{ background: '#040c14' }}>

      {/* ── Navbar ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(4,12,20,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(212,175,55,0.1)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-sm" style={{ background: '#D4AF37' }}>B</div>
            <span className="font-black text-white text-lg">BBER</span>
          </a>
          <a
            href={WA_LINK}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-black font-black text-sm px-4 py-2.5 rounded-xl transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F5E27A)', boxShadow: '0 4px 16px rgba(212,175,55,0.3)' }}
          >
            Asesoría gratuita
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Fondos */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #D4AF3708 0%, transparent 60%)' }} />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23D4AF37' stroke-width='0.3'/%3E%3C/svg%3E\")" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Texto izquierda */}
            <div>
              <div
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
                style={{ background: '#D4AF3715', color: '#D4AF37', border: '1px solid #D4AF3730' }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#D4AF37' }} />
                Guía gratuita · 9 capítulos
              </div>

              <h1 className="font-black leading-[1.05] tracking-tight mb-4" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}>
                Si tienes{' '}
                <span style={{ color: '#D4AF37' }}>30 a 45 años</span>,<br />
                estás en la{' '}
                <span style={{ color: '#D4AF37' }}>mejor edad</span>{' '}
                para empezar un<br />
                fondo de retiro.
              </h1>

              <p className="text-lg leading-relaxed mb-8" style={{ color: '#aaa', maxWidth: '480px' }}>
                En esta guía te explico <strong className="text-white">exactamente cómo hacerlo</strong> — sin jerga financiera, en español, con números reales.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  { val: '9', label: 'Capítulos' },
                  { val: '100%', label: 'En español' },
                  { val: '$0', label: 'Costo' },
                  { val: '15', label: 'Min de lectura' },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <div className="text-2xl font-black" style={{ color: '#D4AF37' }}>{val}</div>
                    <div className="text-xs" style={{ color: '#666' }}>{label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#guia"
                  className="inline-flex items-center justify-center gap-2 font-black px-8 py-4 rounded-xl text-base text-black transition-all active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #F5E27A)', boxShadow: '0 6px 28px rgba(212,175,55,0.4)' }}
                >
                  Leer la guía ahora
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 112 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href={WA_LINK}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-xl text-base transition-all"
                  style={{ background: '#0d1a2a', border: '1px solid #D4AF3730', color: '#D4AF37' }}
                >
                  Hablar con Luis
                </a>
              </div>
            </div>

            {/* Libro derecha */}
            <div className="flex flex-col items-center gap-8">
              <BookMockup />
              <div className="text-center">
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#666' }}>Aprenderás</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Interés compuesto', 'Cuánto ahorrar', 'IUL vs 401k', 'Estrategias reales'].map(t => (
                    <span key={t} className="text-xs px-3 py-1 rounded-full" style={{ background: '#D4AF3715', color: '#D4AF37', border: '1px solid #D4AF3730' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ¿POR QUÉ 30-45? ── */}
      <section className="py-16 relative">
        <div className="absolute inset-0" style={{ background: '#060e18' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
              style={{ background: '#D4AF3715', color: '#D4AF37', border: '1px solid #D4AF3730' }}>
              ¿Por qué ahora?
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-4">
              Los 30–45 años son la{' '}
              <span style={{ color: '#D4AF37' }}>ventana de oro</span>
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: '⏳',
                titulo: 'Tiempo suficiente',
                desc: 'Tienes 20-35 años por delante para que el interés compuesto trabaje. Empezar a los 35 con $300/mes puede darte más de $400,000 al retirarte.'
              },
              {
                icon: '💰',
                titulo: 'Ingresos más estables',
                desc: 'A diferencia de los 20s, ya tienes ingresos más predecibles. Puedes comprometerte a un aporte mensual real sin que afecte tu vida.'
              },
              {
                icon: '🧠',
                titulo: 'Decisiones más sabias',
                desc: 'Ya sabes lo que quieres. Puedes elegir un instrumento de retiro con visión a largo plazo, no solo por moda o por lo que dice el vecino.'
              },
            ].map(({ icon, titulo, desc }, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="rounded-2xl p-5 h-full" style={{ background: '#080f1a', border: '1px solid #D4AF3720' }}>
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="font-black text-white text-base mb-2">{titulo}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#888' }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALCULADORA ── */}
      <section className="py-20 relative">
        <div className="absolute inset-0" style={{ background: '#040c14' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
              style={{ background: '#D4AF3715', color: '#D4AF37', border: '1px solid #D4AF3730' }}>
              Haz tus números
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-4">
              ¿Cuánto puedes acumular<br />si empiezas hoy?
            </h2>
          </Reveal>
          <Reveal>
            <Calculadora />
          </Reveal>
        </div>
      </section>

      {/* ── GUÍA COMPLETA ── */}
      <section id="guia" className="py-20 relative">
        <div className="absolute inset-0" style={{ background: '#060e18' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
              style={{ background: '#D4AF3715', color: '#D4AF37', border: '1px solid #D4AF3730' }}>
              Contenido completo
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-4">
              Tu guía, capítulo por capítulo
            </h2>
            <p className="mt-3 text-lg" style={{ color: '#888' }}>
              Lee completa o salta al capítulo que más te interese.
            </p>
          </Reveal>

          <div className="space-y-4">

            <Capitulo num={1} titulo="El Problema Real: Por Qué Muchos Latinos Se Jubilan Sin Dinero" icono="⚠️" index={0}>
              <P>
                Según datos del <Highlight>Pew Research Center</Highlight>, los latinos en EE.UU. son el grupo demográfico con <Highlight>menor tasa de participación en planes de retiro</Highlight>. Solo 1 de cada 3 trabajadores latinos tiene acceso a un plan 401(k) — y de esos, muchos no contribuyen suficiente.
              </P>
              <P>
                ¿Por qué? No es falta de trabajo duro. Es que nadie nos enseñó. La cultura latina valora <Highlight>"trabajar duro ahora para disfrutar después"</Highlight>, pero sin un sistema, ese después nunca llega.
              </P>
              <Lista items={[
                'Mandamos dinero a la familia y nos queda poco para ahorrar',
                'Pensamos que el Social Security será suficiente (spoiler: no lo será)',
                'Los planes de retiro nos parecen complicados y nos da miedo equivocarnos',
                'Priorizamos gastos inmediatos sobre el futuro que no vemos',
              ]} />
              <Callout icon="📌">
                El promedio de ahorros de retiro para latinos de 56-64 años es de solo $30,000. El promedio necesario para retirarse cómodamente: $750,000+.
              </Callout>
            </Capitulo>

            <Capitulo num={2} titulo="El Poder del Interés Compuesto: La Matemática del Tiempo" icono="📈" index={1}>
              <P>
                Albert Einstein llamó al interés compuesto <Highlight>"la octava maravilla del mundo"</Highlight>. No por nada. Es el único fenómeno matemático donde el tiempo trabaja para ti — no en tu contra.
              </P>
              <P>
                La fórmula es simple: tu dinero gana interés, y ese interés también gana interés. Mes tras mes. Año tras año. El resultado es crecimiento <Highlight>exponencial</Highlight>, no lineal.
              </P>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {[
                  { edad: 30, aporte: '$300/mes', resultado: '$567,000', anos: 35, color: '#22C55E' },
                  { edad: 40, aporte: '$300/mes', resultado: '$264,000', anos: 25, color: '#F59E0B' },
                  { edad: 45, aporte: '$300/mes', resultado: '$170,000', anos: 20, color: '#EF4444' },
                  { edad: 50, aporte: '$300/mes', resultado: '$103,000', anos: 15, color: '#EF4444' },
                ].map(({ edad, aporte, resultado, anos, color }, i) => (
                  <div key={i} className="p-4 rounded-xl" style={{ background: '#0a1420', border: `1px solid ${color}20` }}>
                    <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#888' }}>Empiezas a los {edad} años</div>
                    <div className="text-sm mb-1" style={{ color: '#aaa' }}>{aporte} · {anos} años · 7% anual</div>
                    <div className="text-2xl font-black" style={{ color }}>{resultado}</div>
                  </div>
                ))}
              </div>
              <Callout icon="⏰">
                Esperar 10 años no reduce tu fondo a la mitad — lo reduce a menos de la mitad. El costo de esperar es enorme. Cada mes que pasa es dinero que ya no puede crecer.
              </Callout>
            </Capitulo>

            <Capitulo num={3} titulo="¿Cuánto Necesitas Para Retirarte?" icono="🎯" index={2}>
              <P>
                La regla del 4% — usada por asesores financieros en todo el mundo — dice que puedes retirar el 4% de tu fondo cada año sin agotarlo en 30 años. Eso te da un número concreto.
              </P>

              <div className="p-5 rounded-xl mt-3" style={{ background: '#0a1420', border: '1px solid #D4AF3720' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#D4AF37' }}>Fórmula simple</div>
                <div className="text-white font-black text-base mb-3">
                  Gastos mensuales actuales × 12 × 25 = Tu meta de retiro
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { gasto: '$2,000/mes', meta: '$600,000' },
                    { gasto: '$3,000/mes', meta: '$900,000' },
                    { gasto: '$4,000/mes', meta: '$1,200,000' },
                  ].map(({ gasto, meta }, i) => (
                    <div key={i} className="text-center p-3 rounded-lg" style={{ background: '#06101a' }}>
                      <div className="text-xs mb-1" style={{ color: '#888' }}>Si gastas {gasto}</div>
                      <div className="font-black" style={{ color: '#D4AF37' }}>{meta}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Lista items={[
                'Toma tus gastos mensuales actuales como base',
                'Multiplica por 12 para obtener el gasto anual',
                'Multiplica por 25 (regla del 4% inversa)',
                'Ese es tu "número mágico" de retiro',
              ]} />
            </Capitulo>

            <Capitulo num={4} titulo="Opciones de Retiro: 401(k), IRA, Roth IRA y el IUL" icono="⚖️" index={3}>
              <P>
                No todas las cuentas de retiro son iguales. Cada una tiene ventajas y limitaciones. Aquí va la comparación honesta:
              </P>

              <div className="overflow-x-auto mt-4 rounded-xl" style={{ border: '1px solid #1e2f42' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#0a1420' }}>
                      <th className="text-left p-3 font-black text-white">Instrumento</th>
                      <th className="text-left p-3 font-black" style={{ color: '#D4AF37' }}>Ventajas</th>
                      <th className="text-left p-3 font-black text-red-400">Limitaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        nombre: '401(k)',
                        ventajas: 'Match del empleador, reduce impuestos hoy',
                        limites: 'Penalidad si retiras antes, mercado te puede bajar, límite $23k/año',
                      },
                      {
                        nombre: 'IRA Tradicional',
                        ventajas: 'Deducción fiscal, flexible',
                        limites: 'Límite $7k/año, penalidad antes de 59½, impuestos al retirar',
                      },
                      {
                        nombre: 'Roth IRA',
                        ventajas: 'Retiros libres de impuesto, sin mínimos obligatorios',
                        limites: 'No hay deducción hoy, límite de ingresos para calificar',
                      },
                      {
                        nombre: 'IUL',
                        ventajas: 'Crecimiento con piso 0%, retiros tax-free, protección de vida incluida, sin límite de contribución',
                        limites: 'Requiere asesor licenciado, no es para todos los casos',
                      },
                    ].map(({ nombre, ventajas, limites }, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #0d1a2a', background: i % 2 === 0 ? '#06101a' : '#080f1a' }}>
                        <td className="p-3 font-black text-white">{nombre}</td>
                        <td className="p-3" style={{ color: '#22C55E' }}>{ventajas}</td>
                        <td className="p-3 text-red-400">{limites}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Callout icon="💡">
                Muchos asesores recomiendan combinar opciones: aprovechar el match del empleador en el 401(k) y complementar con un IUL para retiros tax-free más adelante.
              </Callout>
            </Capitulo>

            <Capitulo num={5} titulo="¿Qué es un IUL y Por Qué Está Diseñado Para Ti?" icono="🏦" index={4}>
              <P>
                El <Highlight>IUL (Indexed Universal Life)</Highlight> es un tipo de seguro de vida permanente con una cuenta de ahorro que crece ligada a un índice bursátil (como el S&P 500), pero <Highlight>con un piso de 0%</Highlight> — es decir, si el mercado cae, tu dinero no baja.
              </P>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-xl" style={{ background: '#0a1420', border: '1px solid #22C55E30' }}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#22C55E' }}>Cómo funciona</div>
                  <Lista items={[
                    'Pagas una prima mensual',
                    'Una parte cubre el seguro de vida',
                    'El resto va a tu cuenta de valor en efectivo',
                    'Esa cuenta crece según un índice (ej. S&P 500)',
                    'Si el mercado sube: creces (hasta un cap)',
                    'Si el mercado baja: tu valor no baja',
                  ]} />
                </div>
                <div className="p-4 rounded-xl" style={{ background: '#0a1420', border: '1px solid #D4AF3730' }}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#D4AF37' }}>Beneficios clave</div>
                  <Lista items={[
                    'Crecimiento libre de impuestos',
                    'Retiros y préstamos tax-free en retiro',
                    'Beneficio de vida para tu familia',
                    'Sin penalidades por retiro anticipado',
                    'Sin límite de contribución anual',
                    'No aparece en FAFSA (ayuda universitaria)',
                  ]} />
                </div>
              </div>

              <Callout icon="⚠️">
                El IUL no es una inversión — es un contrato de seguro. No está garantizado por la FDIC. Su efectividad depende de que esté bien estructurado. Por eso necesitas un asesor licenciado que lo diseñe correctamente para tu caso.
              </Callout>
            </Capitulo>

            <Capitulo num={6} titulo="Ejemplo Real: $300 al Mes a los 35 Años" icono="💵" index={5}>
              <P>
                Vamos a los números concretos. Este es un ejemplo educativo basado en proyecciones reales de un IUL bien estructurado, asumiendo un promedio histórico del índice del 6% anual.
              </P>

              <div className="rounded-xl overflow-hidden mt-4" style={{ border: '1px solid #1e2f42' }}>
                <div className="p-4" style={{ background: '#0a1420' }}>
                  <div className="font-black text-white mb-1">Perfil del ejemplo</div>
                  <div className="text-sm" style={{ color: '#888' }}>Edad: 35 años · Aporte: $300/mes · Meta: retirarse a los 65</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: '#06101a' }}>
                        <th className="text-left p-3 font-bold" style={{ color: '#888' }}>Año</th>
                        <th className="text-left p-3 font-bold" style={{ color: '#888' }}>Edad</th>
                        <th className="text-left p-3 font-bold" style={{ color: '#888' }}>Total aportado</th>
                        <th className="text-left p-3 font-bold" style={{ color: '#D4AF37' }}>Valor estimado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { ano: 5, edad: 40, aportado: '$18,000', valor: '$22,500' },
                        { ano: 10, edad: 45, aportado: '$36,000', valor: '$53,000' },
                        { ano: 15, edad: 50, aportado: '$54,000', valor: '$98,000' },
                        { ano: 20, edad: 55, aportado: '$72,000', valor: '$165,000' },
                        { ano: 25, edad: 60, aportado: '$90,000', valor: '$265,000' },
                        { ano: 30, edad: 65, aportado: '$108,000', valor: '$410,000+' },
                      ].map(({ ano, edad, aportado, valor }, i) => (
                        <tr key={i} style={{ borderTop: '1px solid #0d1a2a', background: i % 2 === 0 ? '#080f1a' : '#06101a' }}>
                          <td className="p-3 text-white font-bold">Año {ano}</td>
                          <td className="p-3" style={{ color: '#888' }}>{edad}</td>
                          <td className="p-3" style={{ color: '#aaa' }}>{aportado}</td>
                          <td className="p-3 font-black" style={{ color: '#D4AF37' }}>{valor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Callout icon="💡">
                Con $300/mes durante 30 años, aportaste $108,000. El valor estimado supera $400,000. Eso es el poder del interés compuesto trabajando para ti. Y los retiros en el IUL serían libres de impuesto federal.
              </Callout>
            </Capitulo>

            <Capitulo num={7} titulo="Cuánto Ahorrar Según Tu Meta" icono="🎯" index={6}>
              <P>
                No hay una respuesta única. Depende de tu edad, ingresos, gastos y la vida que quieres tener en el retiro. Pero aquí tienes una guía de referencia:
              </P>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {[
                  { edad: '30-35 años', minimo: '$200/mes', recomendado: '$350/mes', ideal: '$500+/mes' },
                  { edad: '36-40 años', minimo: '$300/mes', recomendado: '$500/mes', ideal: '$700+/mes' },
                  { edad: '41-45 años', minimo: '$500/mes', recomendado: '$700/mes', ideal: '$1,000+/mes' },
                  { edad: '46-50 años', minimo: '$700/mes', recomendado: '$1,000/mes', ideal: '$1,500+/mes' },
                ].map(({ edad, minimo, recomendado, ideal }, i) => (
                  <div key={i} className="p-4 rounded-xl" style={{ background: '#0a1420', border: '1px solid #1e2f42' }}>
                    <div className="font-black text-white text-sm mb-3">{edad}</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span style={{ color: '#888' }}>Mínimo para empezar</span>
                        <span style={{ color: '#aaa' }}>{minimo}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span style={{ color: '#888' }}>Recomendado</span>
                        <span style={{ color: '#D4AF37' }} className="font-bold">{recomendado}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span style={{ color: '#888' }}>Para retiro cómodo</span>
                        <span style={{ color: '#22C55E' }} className="font-bold">{ideal}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <P>
                Recuerda: <Highlight>lo importante es empezar</Highlight>, aunque sea con el mínimo. Puedes aumentar tus aportaciones cuando mejoren tus ingresos. Un IUL bien estructurado es flexible — puedes pagar más o menos según el mes.
              </P>
            </Capitulo>

            <Capitulo num={8} titulo="Las 3 Estrategias Que Sí Funcionan" icono="⚡" index={7}>
              <P>
                Después de trabajar con cientos de familias latinas, estas son las tres estrategias que generan resultados reales:
              </P>

              <div className="space-y-4 mt-4">
                {[
                  {
                    num: '01',
                    titulo: 'Automatiza antes de que el dinero llegue a tu cuenta',
                    desc: 'No ahorres lo que sobra — aparta primero. Configura un débito automático el mismo día de tu depósito de nómina. Si no lo ves, no lo gastas.',
                  },
                  {
                    num: '02',
                    titulo: 'Empieza pequeño, sube rápido',
                    desc: 'Si $300/mes parece mucho, empieza con $150. Pero comprométete a subir $50 cada 6 meses. En un año estarás en $250. En dos, en $350. El hábito es lo que importa.',
                  },
                  {
                    num: '03',
                    titulo: 'Reinvierte cualquier aumento de salario',
                    desc: 'Cada vez que recibes un aumento, destina el 50% de ese aumento extra a tu fondo de retiro. Tú ya vivías con el salario anterior — no lo vas a extrañar.',
                  },
                ].map(({ num, titulo, desc }, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-xl" style={{ background: '#0a1420', border: '1px solid #D4AF3718' }}>
                    <div className="flex-shrink-0 text-2xl font-black" style={{ color: '#D4AF3750' }}>{num}</div>
                    <div>
                      <div className="font-black text-white text-sm mb-1">{titulo}</div>
                      <div className="text-sm leading-relaxed" style={{ color: '#888' }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Capitulo>

            <Capitulo num={9} titulo="Cómo Empezar Esta Semana (Plan de Acción)" icono="🚀" index={8}>
              <P>
                El conocimiento sin acción es solo entretenimiento. Aquí tu plan para los próximos 7 días:
              </P>

              <div className="space-y-3 mt-4">
                {[
                  { dia: 'Hoy', accion: 'Calcula cuánto gastas al mes. Ese es tu punto de partida.' },
                  { dia: 'Día 2', accion: 'Decide cuánto puedes apartar al mes. Aunque sea $100.' },
                  { dia: 'Día 3', accion: 'Separa ese dinero en una cuenta diferente — aunque sea temporalmente.' },
                  { dia: 'Día 4', accion: 'Agenda una llamada gratuita con Luis para revisar qué instrumento es mejor para tu caso.' },
                  { dia: 'Día 7', accion: 'Firma y activa tu plan. El día que empieces es el más importante de tu vida financiera.' },
                ].map(({ dia, accion }, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: '#080f1a', border: '1px solid #1e2f42' }}>
                    <div className="flex-shrink-0 px-2 py-0.5 rounded-lg text-xs font-black text-black" style={{ background: '#D4AF37', minWidth: '60px', textAlign: 'center' }}>
                      {dia}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#bbb' }}>{accion}</p>
                  </div>
                ))}
              </div>

              <Callout icon="🎯">
                El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es hoy. Tu futuro te lo agradecerá.
              </Callout>
            </Capitulo>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, #D4AF3708 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="rounded-3xl overflow-hidden" style={{ background: '#080f1a', border: '1px solid #D4AF3730' }}>
              <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #D4AF37, #F5E27A, #D4AF37)' }} />

              <div className="p-8 sm:p-12">
                <div className="grid md:grid-cols-2 gap-10 items-start">

                  {/* Izquierda */}
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
                      style={{ background: '#D4AF3715', color: '#D4AF37', border: '1px solid #D4AF3730' }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#D4AF37' }} />
                      Siguiente paso
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
                      Asesoría financiera<br />
                      <span style={{ color: '#D4AF37' }}>personalizada y gratuita</span>
                    </h2>

                    <p className="text-base leading-relaxed mb-6" style={{ color: '#aaa' }}>
                      La guía te da el conocimiento. La asesoría te da el <strong className="text-white">plan exacto para tu situación</strong>. Una sesión de 45 minutos con Luis, Licenciado Financiero certificado.
                    </p>

                    <div className="space-y-3">
                      {[
                        { icon: '⏱️', text: '45 minutos dedicados a tu caso específico' },
                        { icon: '📋', text: 'Plan personalizado: cuánto, cómo y cuándo' },
                        { icon: '🎓', text: 'Licenciado certificado con experiencia en la comunidad latina' },
                        { icon: '📱', text: 'Seguimiento por WhatsApp sin costo adicional' },
                        { icon: '💰', text: 'Sin presión ni compromiso de compra' },
                      ].map(({ icon, text }, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm" style={{ color: '#bbb' }}>
                          <span className="flex-shrink-0">{icon}</span>
                          {text}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 mt-6 pt-4" style={{ borderTop: '1px solid #1e2f42' }}>
                      <div>
                        <div className="text-sm line-through" style={{ color: '#444' }}>Valor: $297</div>
                        <div className="text-3xl font-black" style={{ color: '#D4AF37' }}>GRATIS</div>
                      </div>
                      <div className="text-xs leading-relaxed" style={{ color: '#666' }}>
                        Para personas que<br />leyeron esta guía
                      </div>
                    </div>
                  </div>

                  {/* Formulario derecha */}
                  <div>
                    <div className="rounded-2xl overflow-hidden" style={{ background: '#0a1420', border: '1px solid #1e2f42' }}>
                      <div className="p-6 text-center border-b" style={{ borderColor: '#1e2f42' }}>
                        <h3 className="text-xl font-black text-white mb-1">Agenda tu asesoría</h3>
                        <p className="text-sm" style={{ color: '#666' }}>Luis te contactará en menos de 24 horas</p>
                      </div>
                      <div className="p-6">
                        <FormCaptura />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 justify-center flex-wrap">
                      {['Sin costo', 'Sin presión', 'Licenciado certificado'].map(t => (
                        <span key={t} className="text-xs px-3 py-1 rounded-full" style={{ background: '#D4AF3710', color: '#D4AF37', border: '1px solid #D4AF3720' }}>
                          ✓ {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── WhatsApp flotante ── */}
      <a
        href={WA_LINK}
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-5 z-50 flex items-center gap-2 text-white text-sm font-black px-4 py-3 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
        style={{ background: '#22C55E', boxShadow: '0 8px 32px rgba(34,197,94,0.4)' }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="hidden sm:inline">Hablar con Luis</span>
      </a>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid #0d1a2a', background: '#030a10' }}>
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-black text-xs" style={{ background: '#D4AF37' }}>B</div>
            <span className="font-black text-white text-sm">BBER</span>
          </div>
          <p className="text-xs text-center" style={{ color: '#333' }}>
            © {new Date().getFullYear()} BBER · Contenido educativo. No garantiza resultados. Los seguros de vida son productos regulados y pueden no ser adecuados para todos.
          </p>
          <a href="/" className="text-xs transition-colors" style={{ color: '#444' }}>← Volver al inicio</a>
        </div>
      </footer>

    </div>
  )
}
