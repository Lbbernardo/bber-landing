import React, { useState, useEffect, useRef } from 'react'

/* ── Reveal on scroll ── */
function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
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

/* ── Book 3D mockup ── */
function BookMockup() {
  return (
    <div className="relative w-[220px] h-[290px] mx-auto" style={{ perspective: '800px' }}>
      {/* Shadow */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[160px] h-8 bg-brand-purple/30 blur-xl rounded-full" />

      {/* Book */}
      <div
        className="w-full h-full relative"
        style={{ transform: 'rotateY(-18deg) rotateX(4deg)', transformStyle: 'preserve-3d' }}
      >
        {/* Front cover */}
        <div className="absolute inset-0 rounded-r-lg rounded-l-sm overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #1a0a3a 0%, #0d0020 100%)', boxShadow: '8px 12px 40px rgba(124,58,237,0.4), -2px 0 8px rgba(0,0,0,0.8)' }}>

          {/* Cover content */}
          <div className="absolute inset-0 p-5 flex flex-col justify-between">
            {/* Top accent line */}
            <div className="h-0.5 w-full bg-gradient-to-r from-brand-yellow to-brand-purple rounded-full mb-3" />

            {/* Logo */}
            <div className="flex items-center gap-1.5 mb-4">
              <div className="w-5 h-5 rounded bg-brand-purple flex items-center justify-center">
                <span className="text-white font-black text-[9px]">B</span>
              </div>
              <span className="text-white font-black text-xs tracking-tight">BBER</span>
            </div>

            {/* Title */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-brand-yellow text-[10px] font-bold uppercase tracking-widest mb-2">Guía Completa</div>
              <h2 className="text-white font-black text-base leading-tight mb-1">
                La Guía Financiera del Latino en EE.UU.
              </h2>
              <div className="text-brand-lavender text-[10px] leading-relaxed mt-1">
                10 módulos · Educación financiera completa
              </div>
            </div>

            {/* Decoration */}
            <div className="mt-3">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full border border-brand-yellow/40"
                    style={{ background: i < 3 ? '#FACC15' : 'transparent' }} />
                ))}
              </div>
              <div className="text-white/40 text-[9px]">© BBER Financial Education</div>
            </div>
          </div>

          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30'%3E%3Cpath d='M 30 0 L 0 0 0 30' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E\")" }} />

          {/* Glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/20 rounded-full blur-2xl" />
        </div>

        {/* Spine */}
        <div className="absolute left-0 top-0 h-full w-3 rounded-l-sm"
          style={{ background: 'linear-gradient(180deg,#4C1D95,#2D1052)', transform: 'translateZ(-3px) translateX(-3px)', boxShadow: '-2px 0 6px rgba(0,0,0,0.6)' }} />
      </div>
    </div>
  )
}

/* ── Módulos ── */
const modules = [
  {
    num: '01',
    icon: '🧠',
    title: 'La Mentalidad del Dinero',
    desc: 'Antes de cambiar tus finanzas, debes cambiar tu mente. Aprende a identificar y romper las creencias limitantes que heredaste sobre el dinero.',
    topics: ['Por qué los ricos piensan diferente', 'Creencias heredadas que te frenan', 'Tu relación emocional con el dinero', 'Plan de transformación mental en 21 días'],
    color: 'purple',
  },
  {
    num: '02',
    icon: '📊',
    title: 'Entiende Tu Dinero Real',
    desc: 'Descubre exactamente a dónde va cada dólar que ganas. Muchos trabajan duro pero no saben por qué el dinero siempre se acaba.',
    topics: ['Ingresos vs gastos reales', 'Tu flujo de caja personal', 'Los 4 errores financieros más comunes', 'Cómo hacer tu fotografía financiera'],
    color: 'yellow',
  },
  {
    num: '03',
    icon: '📋',
    title: 'El Presupuesto que Sí Funciona',
    desc: 'Olvida los presupuestos aburridos. Te enseñamos un método adaptado a la realidad latina que te permite vivir bien mientras ahorras.',
    topics: ['Método 50/30/20 adaptado para latinos', 'Cómo eliminar gastos sin sacrificar calidad de vida', 'Apps y herramientas en español', 'Crea tu primer presupuesto en 30 minutos'],
    color: 'purple',
  },
  {
    num: '04',
    icon: '🛡️',
    title: 'Fondo de Emergencia',
    desc: 'El colchón financiero que protege a tu familia cuando algo inesperado ocurre. Sin esto, cualquier imprevisto puede destruir tu progreso.',
    topics: ['Cuánto necesitas realmente', 'Dónde guardar tu fondo (High-Yield Savings)', 'Cómo construirlo en 90 días', 'Qué ES y qué NO ES una emergencia'],
    color: 'yellow',
  },
  {
    num: '05',
    icon: '💳',
    title: 'Conquista tus Deudas',
    desc: 'Las deudas son el enemigo número uno de la riqueza. Te damos las estrategias exactas usadas por miles de familias para liberarse.',
    topics: ['Método Avalanche vs Método Snowball', 'Cómo negociar con acreedores', 'Salir de deudas en 18 a 36 meses', 'Usar tarjetas de crédito a tu favor'],
    color: 'purple',
  },
  {
    num: '06',
    icon: '⭐',
    title: 'Crédito en EE.UU.',
    desc: 'El crédito es la llave que abre puertas en Estados Unidos. Aprende a construirlo desde cero o repararlo si está dañado.',
    topics: ['Cómo funciona el score crediticio', 'Los 5 factores que afectan tu crédito', 'Construir crédito sin historial previo', 'De 500 a 750+ puntos en 12 meses'],
    color: 'yellow',
  },
  {
    num: '07',
    icon: '📈',
    title: 'Inversiones Para Principiantes',
    desc: 'Invertir no es solo para ricos. Con $50 al mes puedes empezar a construir riqueza real. Te enseñamos cómo hacerlo de forma segura.',
    topics: ['Bolsa de valores sin complicaciones', 'ETFs de índice: la estrategia del 90%', 'Cómo empezar con $50 al mes', 'Plataformas recomendadas y cómo usarlas'],
    color: 'purple',
  },
  {
    num: '08',
    icon: '🏦',
    title: 'Retiro Sin Depender de Nadie',
    desc: 'No dependas del gobierno ni de tus hijos para retirarte. Las cuentas de retiro en EE.UU. son las herramientas más poderosas para tu futuro.',
    topics: ['401(k), IRA y Roth IRA explicados en español', 'El poder del interés compuesto', 'Cuánto necesitas para retirarte tranquilo', 'La regla del 4% para vivir de tus inversiones'],
    color: 'yellow',
  },
  {
    num: '09',
    icon: '🏠',
    title: 'Tu Primera Casa en EE.UU.',
    desc: 'El sueño americano hecho realidad. Te guiamos a través del proceso hipotecario completo, en español y sin letra pequeña.',
    topics: ['El proceso hipotecario paso a paso', 'Programas de ayuda para compradores latinos', 'Cómo preparar tu crédito y down payment', 'Errores que cuestan miles de dólares'],
    color: 'purple',
  },
  {
    num: '10',
    icon: '👑',
    title: 'Legado y Libertad Financiera',
    desc: 'El módulo final que lo une todo. Aprende a crear un legado duradero para tu familia y alcanzar la verdadera libertad financiera.',
    topics: ['Qué es realmente la libertad financiera', 'Cómo proteger tu patrimonio con seguros', 'Testamento y planificación patrimonial', 'Enseña a tus hijos sobre el dinero desde jóvenes'],
    color: 'yellow',
  },
]

function ModuleCard({ mod, index }) {
  const [open, setOpen] = useState(false)
  const isYellow = mod.color === 'yellow'

  return (
    <Reveal delay={index * 60}>
      <div
        className={`rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
          open
            ? isYellow
              ? 'border-brand-yellow/30 bg-brand-yellow/5'
              : 'border-brand-purple/30 bg-brand-purple/5'
            : 'border-white/6 bg-[#0F0F0F] hover:border-white/12'
        }`}
        onClick={() => setOpen(o => !o)}
      >
        <div className="p-5 flex items-start gap-4">
          {/* Number */}
          <div className={`text-xs font-black tracking-widest flex-shrink-0 mt-1 ${isYellow ? 'text-brand-yellow' : 'gradient-text-purple'}`}>
            {mod.num}
          </div>

          {/* Icon + title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-xl">{mod.icon}</span>
              <h3 className="font-black text-white text-sm leading-tight">{mod.title}</h3>
            </div>
            <p className="text-brand-muted text-xs leading-relaxed">{mod.desc}</p>

            {/* Topics */}
            {open && (
              <ul className="mt-4 space-y-2">
                {mod.topics.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-brand-muted">
                    <span className={`flex-shrink-0 mt-0.5 ${isYellow ? 'text-brand-yellow' : 'text-brand-lavender'}`}>→</span>
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Chevron */}
          <div className={`text-brand-muted flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

/* ── Main Page ── */
export default function Ebook() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-sans">

      {/* ── Navbar ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center">
              <span className="text-white font-black text-sm">B</span>
            </div>
            <span className="font-black text-white tracking-tight text-lg">BBER</span>
          </a>
          <a
            href="https://wa.me/16304154252?text=Hola%2C%20quiero%20mi%20asesor%C3%ADa%20financiera%20gratuita"
            target="_blank" rel="noopener noreferrer"
            className="btn-yellow text-sm py-2 px-5 font-black"
          >
            Asesoría gratuita
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-purple-glow" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-brand-yellow/4 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <div>
              <div className="flex items-center gap-2 mb-6 animate-fade-up" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
                <span className="section-tag">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
                  Ebook gratuito · 10 módulos
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6 animate-fade-up"
                style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                La Guía Financiera<br />
                del <span className="gradient-text">Latino en EE.UU.</span>
              </h1>

              <p className="text-brand-muted text-lg leading-relaxed mb-8 max-w-lg animate-fade-up"
                style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                Todo lo que el sistema no te enseñó sobre el dinero — en un solo libro, completamente en español, diseñado para nuestra comunidad.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-5 mb-8 animate-fade-up" style={{ animationDelay: '280ms', animationFillMode: 'both' }}>
                {[
                  { val: '10', label: 'Módulos completos' },
                  { val: '60+', label: 'Páginas de contenido' },
                  { val: '100%', label: 'En español' },
                  { val: '$0', label: 'Costo total' },
                ].map(({ val, label }) => (
                  <div key={label} className="text-center">
                    <div className="text-2xl font-black gradient-text-purple">{val}</div>
                    <div className="text-xs text-brand-muted">{label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 animate-fade-up" style={{ animationDelay: '360ms', animationFillMode: 'both' }}>
                <a href="/#registro" className="btn-yellow text-base px-8 py-4 font-black">
                  Descargar gratis
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#modulos" className="btn-primary text-base px-8 py-4">
                  Ver los módulos
                </a>
              </div>
            </div>

            {/* Right — book */}
            <div className="flex flex-col items-center gap-8 animate-fade-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
              <BookMockup />

              {/* Social proof */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex -space-x-2">
                  {['A','M','J','R','L','C'].map((l, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: ['#7C3AED','#A78BFA','#5B21B6','#8B5CF6','#6D28D9','#FACC15'][i], color: i === 5 ? '#000' : '#fff' }}>
                      {l}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-brand-muted text-center">
                  <span className="text-white font-semibold">+2,400 familias latinas</span> ya lo tienen
                </div>
                <div className="flex gap-0.5 text-brand-yellow">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-white text-xs font-bold ml-1">4.9</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARA QUIÉN ES ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0A0A0A]" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-12">
            <span className="section-tag mb-5 inline-flex">¿Es para ti?</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-4">
              Esta guía es para ti si...
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: '💸', text: 'Trabajas duro pero nunca te sobra dinero al final del mes' },
              { icon: '📉', text: 'Tienes deudas que parecen no reducirse sin importar lo que pagues' },
              { icon: '🏠', text: 'Quieres comprar una casa pero no sabes por dónde empezar' },
              { icon: '🤷', text: 'Nunca nadie te enseñó sobre inversiones o retiro' },
              { icon: '😰', text: 'El sistema financiero de EE.UU. te parece confuso y complicado' },
              { icon: '🌟', text: 'Quieres construir un futuro mejor para ti y tu familia' },
            ].map(({ icon, text }, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-black">
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <p className="text-brand-muted text-sm leading-relaxed">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÓDULOS ── */}
      <section id="modulos" className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-dot-pattern bg-dot-sm opacity-30" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-16">
            <span className="section-tag mb-5 inline-flex">Contenido completo</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mt-4">
              Los 10 módulos que{' '}
              <span className="gradient-text">transformarán tu vida</span>
            </h2>
            <p className="text-brand-muted mt-4 text-lg max-w-xl mx-auto">
              Cada módulo fue diseñado con la realidad latina en mente. Contenido práctico, aplicable desde el día uno.
            </p>
          </Reveal>

          {/* Progress bar decorative */}
          <Reveal className="mb-10">
            <div className="flex items-center gap-2 bg-[#0F0F0F] border border-white/8 rounded-2xl p-4">
              <div className="flex gap-1.5 flex-1">
                {modules.map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 10 ? (i % 2 === 0 ? 'bg-brand-purple' : 'bg-brand-yellow') : 'bg-white/10'}`} />
                ))}
              </div>
              <span className="text-brand-yellow text-xs font-bold flex-shrink-0 ml-2">10/10</span>
            </div>
          </Reveal>

          <div className="space-y-2">
            {modules.map((mod, i) => (
              <ModuleCard key={i} mod={mod} index={i} />
            ))}
          </div>

          <Reveal delay={200} className="mt-10 text-center">
            <a href="/#registro" className="btn-yellow text-base px-10 py-4 font-black inline-flex">
              Quiero el ebook gratis
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── TRANSFORMACIÓN ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0A0A0A]" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-16">
            <span className="section-tag mb-5 inline-flex">Tu transformación</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-4">
              Antes y después de BBER
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Antes */}
            <Reveal>
              <div className="rounded-2xl border border-red-500/15 bg-red-500/3 p-6 h-full">
                <div className="text-red-400 font-black text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border border-red-400/40 flex items-center justify-center">
                    <span className="text-[10px]">✕</span>
                  </div>
                  Sin educación financiera
                </div>
                <ul className="space-y-3">
                  {[
                    'Vives de quincena en quincena sin entender por qué',
                    'Las deudas se acumulan y el estrés no para',
                    'No tienes ningún ahorro ni fondo de emergencia',
                    'No sabes cómo funciona el crédito en EE.UU.',
                    'El retiro y las inversiones te parecen imposibles',
                    'Sientes que el sistema está diseñado para excluirte',
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-brand-muted">
                      <span className="text-red-400/60 flex-shrink-0 mt-0.5">•</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Después */}
            <Reveal delay={120}>
              <div className="rounded-2xl border border-brand-purple/25 bg-brand-purple/5 p-6 h-full">
                <div className="gradient-text-purple font-black text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border border-brand-purple/40 flex items-center justify-center">
                    <span className="text-[10px] text-brand-lavender">✓</span>
                  </div>
                  Con la Guía BBER
                </div>
                <ul className="space-y-3">
                  {[
                    'Tienes un presupuesto claro y dinero sobrante cada mes',
                    'Estás eliminando deudas con un plan estructurado',
                    'Tu fondo de emergencia crece semana a semana',
                    'Tu crédito mejora y eso te abre puertas',
                    'Ya tienes tu primera inversión activa creciendo',
                    'Sientes control, claridad y tranquilidad financiera',
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-brand-muted">
                      <span className="text-brand-lavender flex-shrink-0 mt-0.5">✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── ASESORÍA PERSONALIZADA — CTA FINAL ── */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-purple-glow" />
        <div className="absolute inset-0 bg-yellow-glow" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="rounded-3xl overflow-hidden border border-brand-yellow/20 bg-black">
              {/* Top bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-brand-yellow via-brand-lemon to-brand-purple" />

              <div className="p-8 sm:p-12">
                <div className="grid md:grid-cols-2 gap-10 items-center">

                  {/* Left */}
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/20 rounded-full px-3 py-1.5 mb-6 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
                      Paso siguiente
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
                      Asesoría Financiera<br />
                      <span className="gradient-text">Personalizada y Gratuita</span>
                    </h2>

                    <p className="text-brand-muted text-base leading-relaxed mb-6">
                      El ebook te da el conocimiento. La asesoría personalizada te da el <strong className="text-white">plan exacto para tu situación</strong>. Una sesión de 60 minutos con un Licenciado Financiero certificado, dedicada 100% a ti.
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-4 mb-6">
                      <div>
                        <div className="text-4xl font-black text-white">$0</div>
                        <div className="text-brand-muted text-sm">Para clientes BBER</div>
                      </div>
                      <div className="h-10 w-px bg-white/10" />
                      <div>
                        <div className="text-brand-muted text-sm line-through">Valor real</div>
                        <div className="text-2xl font-black text-white/30">$497</div>
                      </div>
                    </div>

                    {/* CTA */}
                    <a
                      href="https://wa.me/16304154252?text=Hola%2C%20leí%20el%20ebook%20de%20BBER%20y%20quiero%20mi%20asesoría%20financiera%20personalizada%20gratuita"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-yellow text-base px-8 py-4 font-black w-full sm:w-auto justify-center"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Quiero mi asesoría gratuita
                    </a>

                    <p className="text-brand-muted text-xs mt-3">
                      Solo para clientes BBER · Cupos limitados · Sin compromiso
                    </p>
                  </div>

                  {/* Right — what's included */}
                  <div className="border border-white/8 rounded-2xl p-6 bg-[#0F0F0F]">
                    <div className="text-white font-bold text-sm mb-5 flex items-center gap-2">
                      <span className="text-xl">🎯</span>
                      ¿Qué incluye tu asesoría?
                    </div>

                    <ul className="space-y-4">
                      {[
                        { icon: '⏱️', title: 'Sesión de 60 minutos', desc: 'Una hora dedicada 100% a analizar tu situación financiera actual' },
                        { icon: '📋', title: 'Plan financiero personalizado', desc: 'Un roadmap paso a paso adaptado a tus ingresos, deudas y metas' },
                        { icon: '🎓', title: 'Licenciado financiero certificado', desc: 'Profesional con experiencia trabajando con la comunidad latina en EE.UU.' },
                        { icon: '📱', title: 'Seguimiento por WhatsApp', desc: 'Acceso directo para resolver dudas después de la sesión' },
                        { icon: '📁', title: 'Recursos y plantillas', desc: 'Herramientas personalizadas para implementar tu plan desde el día uno' },
                      ].map(({ icon, title, desc }, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-lg flex-shrink-0">{icon}</span>
                          <div>
                            <div className="text-white font-semibold text-xs mb-0.5">{title}</div>
                            <div className="text-brand-muted text-xs leading-relaxed">{desc}</div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 pt-4 border-t border-white/6 flex items-center justify-between">
                      <div className="text-brand-muted text-xs">Valor real de la asesoría</div>
                      <div className="text-white font-black line-through opacity-40">$497</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-brand-yellow text-xs font-bold">Para clientes BBER</div>
                      <div className="text-brand-yellow font-black text-xl">GRATIS</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 bg-[#0F0F0F] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-purple flex items-center justify-center">
              <span className="text-white font-black text-xs">B</span>
            </div>
            <span className="font-black text-white">BBER</span>
          </div>
          <p className="text-brand-muted text-xs text-center">
            © {new Date().getFullYear()} BBER · BBER no es un asesor de inversiones registrado. El contenido es educativo.
          </p>
          <a href="/" className="text-brand-muted text-xs hover:text-white transition-colors">
            ← Volver al inicio
          </a>
        </div>
      </footer>

    </div>
  )
}
