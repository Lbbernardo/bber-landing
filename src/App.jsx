import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase'

/* ─────────────────────────────────────────
   ICONS (inline SVGs — zero dependencies)
───────────────────────────────────────── */
const Icon = {
  Check: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  ),
  Book: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  Video: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  Warning: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  Whatsapp: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
}

/* ─────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 }
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

/* ─────────────────────────────────────────
   NAVBAR
───────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center">
            <span className="text-white font-black text-sm tracking-tight">B</span>
          </div>
          <span className="font-black text-white tracking-tight text-lg">BBER</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-brand-muted">
          <a href="#beneficios" className="hover:text-white transition-colors">Beneficios</a>
          <a href="#oferta" className="hover:text-white transition-colors">Recursos</a>
          <a href="#registro" className="hover:text-white transition-colors">Regístrate</a>
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <a href="#registro" className="btn-primary text-sm py-2.5 px-5">
            Acceso gratuito
          </a>
        </div>

        {/* Mobile menu btn */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          {menuOpen ? <Icon.X /> : <Icon.Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/5 px-4 py-4 flex flex-col gap-4">
          <a href="#beneficios" onClick={() => setMenuOpen(false)} className="text-brand-muted hover:text-white py-2 transition-colors">Beneficios</a>
          <a href="#oferta"     onClick={() => setMenuOpen(false)} className="text-brand-muted hover:text-white py-2 transition-colors">Recursos</a>
          <a href="#registro"   onClick={() => setMenuOpen(false)} className="text-brand-muted hover:text-white py-2 transition-colors">Regístrate</a>
          <a href="#registro"   onClick={() => setMenuOpen(false)} className="btn-primary text-sm text-center">Acceso gratuito</a>
        </div>
      )}
    </header>
  )
}

/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern" />
      <div className="absolute inset-0 bg-purple-glow" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-32 w-full">
        <div className="max-w-3xl mx-auto text-center">
          {/* Tag */}
          <div className="flex justify-center mb-6 animate-fade-up" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
            <span className="section-tag">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
              Para la comunidad latina en EE.UU.
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6 animate-fade-up"
            style={{ animationDelay: '100ms', animationFillMode: 'both' }}
          >
            Tu futuro financiero{' '}
            <span className="gradient-text">empieza hoy.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-brand-muted text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto animate-fade-up"
            style={{ animationDelay: '200ms', animationFillMode: 'both' }}
          >
            Aprende a eliminar deudas, ahorrar inteligentemente e invertir tu dinero — sin importar cuánto ganas ahora mismo.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
            style={{ animationDelay: '300ms', animationFillMode: 'both' }}
          >
            <a href="#registro" className="btn-yellow text-base px-8 py-4 font-black">
              Obtener acceso gratis
              <Icon.ArrowRight />
            </a>
            <a href="#oferta" className="btn-primary text-base px-8 py-4">
              Ver recursos
              <Icon.ArrowRight />
            </a>
          </div>

          {/* Social proof bar */}
          <div
            className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-up"
            style={{ animationDelay: '420ms', animationFillMode: 'both' }}
          >
            <div className="flex -space-x-2.5">
              {['A','M','J','R','L'].map((l, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-black flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: ['#7C3AED','#A78BFA','#5B21B6','#8B5CF6','#6D28D9'][i] }}
                >
                  {l}
                </div>
              ))}
            </div>
            <div className="text-sm text-brand-muted">
              <span className="text-white font-semibold">+2,400 familias latinas</span> ya están transformando sus finanzas
            </div>
            <div className="flex items-center gap-1 text-brand-yellow">
              {[...Array(5)].map((_, i) => <Icon.Star key={i} />)}
              <span className="text-sm text-white font-semibold ml-1">4.9</span>
            </div>
          </div>
        </div>

        {/* Floating cards — decorative stats */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {[
            { num: '$0', label: 'Costo de acceso', accent: 'yellow' },
            { num: '8+', label: 'Módulos de contenido', accent: 'purple' },
            { num: '100%', label: 'En español', accent: 'yellow' },
            { num: 'En vivo', label: 'Clases interactivas', accent: 'purple' },
          ].map(({ num, label, accent }, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="border-gradient rounded-2xl p-4 text-center card-hover">
                <div className={`text-2xl font-black mb-1 ${accent === 'yellow' ? 'text-brand-yellow' : 'gradient-text-purple'}`}>
                  {num}
                </div>
                <div className="text-xs text-brand-muted leading-tight">{label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   PROBLEM
───────────────────────────────────────── */
const problems = [
  {
    icon: '💸',
    title: 'Vives de quincena en quincena',
    body: 'Trabajas duro pero el dinero nunca alcanza. Al final del mes sientes que algo falla, aunque no sabes exactamente qué.',
  },
  {
    icon: '📉',
    title: 'Las deudas no desaparecen',
    body: 'Pagas mínimos mes tras mes sin ver progreso real. Las tarjetas de crédito se sienten como una trampa sin salida.',
  },
  {
    icon: '🤷',
    title: 'Nadie te enseñó cómo invertir',
    body: 'En casa nunca se habló de inversiones, bolsa ni retiro. Sientes que ese mundo es para otras personas, no para ti.',
  },
  {
    icon: '😰',
    title: 'El idioma y el sistema te frenan',
    body: 'Navegar el sistema financiero estadounidense en otro idioma es abrumador. Te falta un guía que hable tu idioma.',
  },
]

function Problem() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#0F0F0F]" />
      <div className="absolute inset-0 bg-dot-pattern bg-dot-sm opacity-40" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-16">
          <span className="section-tag mb-5 inline-flex">El problema real</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mt-4">
            ¿Te identificas con{' '}
            <span className="gradient-text">alguna de estas situaciones?</span>
          </h2>
          <p className="text-brand-muted mt-4 text-lg max-w-xl mx-auto">
            No es tu culpa. El sistema no fue diseñado para enseñarte esto — pero eso está a punto de cambiar.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-4">
          {problems.map(({ icon, title, body }, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="group border border-white/5 bg-black rounded-2xl p-6 flex gap-5 hover:border-red-500/20 hover:bg-red-500/3 transition-all duration-300">
                <div className="text-3xl flex-shrink-0 mt-0.5">{icon}</div>
                <div>
                  <h3 className="font-bold text-white mb-2">{title}</h3>
                  <p className="text-brand-muted text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bridge */}
        <Reveal delay={400} className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-brand-purple/10 border border-brand-purple/20 rounded-2xl px-6 py-4 text-sm">
            <span className="text-2xl">✨</span>
            <span className="text-white">
              <strong>BBER existe exactamente para esto.</strong>{' '}
              <span className="text-brand-muted">Educación financiera en español, hecha para nuestra comunidad.</span>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   BENEFITS
───────────────────────────────────────── */
const benefits = [
  { icon: '🎯', title: 'Un presupuesto que realmente funciona', body: 'Aprende el método exacto para organizar tus ingresos y gastos sin sacrificar tu calidad de vida.' },
  { icon: '🏦', title: 'Fondo de emergencia en 90 días', body: 'Descubre cuánto necesitas y cómo construirlo paso a paso, aunque empieces desde cero.' },
  { icon: '💳', title: 'Estrategia para eliminar deudas', body: 'Dos métodos probados para salir de deudas más rápido y liberar dinero para invertir.' },
  { icon: '📈', title: 'Tus primeras inversiones', body: 'Guía simplificada para comenzar a invertir en EE.UU. aunque no tengas experiencia previa.' },
  { icon: '🏠', title: 'Cómo comprar tu primera casa', body: 'Entiende el proceso hipotecario, el crédito y los programas de ayuda para compradores latinos.' },
  { icon: '🛡️', title: 'Protege tu familia con seguros', body: 'Aprende qué coberturas realmente necesitas y cómo no pagar de más por ellas.' },
  { icon: '💰', title: 'Retiro sin depender de nadie', body: 'Conoce las cuentas 401(k), IRA y Roth IRA. Empieza ahora, aunque sea con poco.' },
  { icon: '🧠', title: 'Mentalidad de abundancia', body: 'Rompe los patrones mentales heredados sobre el dinero que te impiden crecer económicamente.' },
]

function Benefits() {
  return (
    <section id="beneficios" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-16">
          <span className="section-tag mb-5 inline-flex">Lo que aprenderás</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mt-4">
            Todo lo que{' '}
            <span className="gradient-text">nadie te enseñó</span>
          </h2>
          <p className="text-brand-muted mt-4 text-lg max-w-xl mx-auto">
            Contenido práctico, sin términos complicados, creado específicamente para la realidad de nuestra comunidad.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {benefits.map(({ icon, title, body }, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="border-gradient rounded-2xl p-5 h-full card-hover group">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-bold text-white text-sm mb-2 leading-snug group-hover:text-brand-lavender transition-colors">{title}</h3>
                <p className="text-brand-muted text-xs leading-relaxed">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   OFFER CARDS
───────────────────────────────────────── */
function OfferCards() {
  return (
    <section id="oferta" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0F0F0F]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-purple/6 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-16">
          <span className="section-tag mb-5 inline-flex">Recursos gratuitos</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mt-4">
            Dos regalos para{' '}
            <span className="gradient-text">empezar hoy</span>
          </h2>
          <p className="text-brand-muted mt-4 text-lg max-w-lg mx-auto">
            Sin costo. Sin tarjeta de crédito. Solo tus datos y acceso inmediato.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Card 1 — Ebook */}
          <Reveal delay={0}>
            <div className="relative rounded-3xl border border-brand-yellow/20 bg-black overflow-hidden card-hover group">
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-brand-yellow via-brand-lemon to-transparent" />

              <div className="p-8">
                {/* Badge */}
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/20 rounded-full px-3 py-1 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                  Descarga gratuita
                </span>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center text-brand-yellow mb-6 group-hover:bg-brand-yellow/15 transition-colors">
                  <Icon.Book />
                </div>

                <h3 className="text-2xl font-black text-white mb-2">
                  Ebook Gratuito
                </h3>
                <p className="text-brand-lavender font-semibold mb-4 text-sm">
                  "La Guía Financiera del Latino en EE.UU."
                </p>
                <p className="text-brand-muted text-sm leading-relaxed mb-6">
                  Una guía práctica de más de 60 páginas con todo lo que necesitas saber para tomar el control total de tu dinero desde hoy.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    'Cómo crear tu primer presupuesto real',
                    'Método para salir de deudas en 18 meses',
                    'Las 5 cuentas que todo latino debe tener',
                    'Primeros pasos para invertir en EE.UU.',
                    'Cómo construir crédito desde cero',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-brand-muted">
                      <span className="text-brand-yellow mt-0.5 flex-shrink-0"><Icon.Check /></span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-black text-white">$0</span>
                    <span className="text-brand-muted text-sm ml-2 line-through">$29</span>
                  </div>
                  <a href="#registro" className="btn-yellow text-sm px-5 py-2.5">
                    Descargar gratis
                    <Icon.ArrowRight />
                  </a>
                </div>
              </div>

              {/* Decorative corner */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-brand-yellow/5 rounded-full" />
            </div>
          </Reveal>

          {/* Card 2 — Live Class */}
          <Reveal delay={120}>
            <div className="relative rounded-3xl border border-brand-purple/30 bg-black overflow-hidden card-hover group">
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-brand-purple via-brand-lavender to-transparent" />

              <div className="p-8">
                {/* Badge */}
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-lavender bg-brand-purple/10 border border-brand-purple/20 rounded-full px-3 py-1 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-lavender animate-pulse" />
                  Próxima clase en vivo
                </span>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-lavender mb-6 group-hover:bg-brand-purple/15 transition-colors">
                  <Icon.Video />
                </div>

                <h3 className="text-2xl font-black text-white mb-2">
                  Clase en Vivo Gratis
                </h3>
                <p className="text-brand-lavender font-semibold mb-4 text-sm">
                  "Masterclass: Finanzas Personales para Latinos"
                </p>
                <p className="text-brand-muted text-sm leading-relaxed mb-6">
                  Una sesión de 90 minutos completamente en vivo e interactiva. Haz preguntas en tiempo real y obtén un plan de acción personalizado para los próximos 30 días.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    'Sesión en vivo de 90 minutos en español',
                    'Preguntas y respuestas en tiempo real',
                    'Acceso a la grabación después del evento',
                    'Plantillas y recursos descargables',
                    'Comunidad privada de apoyo financiero',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-brand-muted">
                      <span className="text-brand-lavender mt-0.5 flex-shrink-0"><Icon.Check /></span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-black text-white">$0</span>
                    <span className="text-brand-muted text-sm ml-2 line-through">$97</span>
                  </div>
                  <a href="#registro" className="btn-primary text-sm px-5 py-2.5">
                    Reservar lugar
                    <Icon.ArrowRight />
                  </a>
                </div>
              </div>

              {/* Decorative corner */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-brand-purple/5 rounded-full" />
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   LEAD CAPTURE FORM
───────────────────────────────────────── */
function LeadForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Tu nombre es requerido'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Ingresa un correo válido'
    if (!form.phone.trim()) e.phone = 'Tu teléfono es requerido'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await fetch(`${import.meta.env.VITE_CRM_URL || ''}/api/webhook?account=luis-bernardo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, source: 'bber-landing' }),
      })
      if (window.fbq) window.fbq('track', 'Lead', { content_name: 'bber-landing' })
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
      window.location.href = '/thankyou'
    }
  }

  const handleChange = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }))
  }

  return (
    <section id="registro" className="py-24 sm:py-32 relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-purple-glow" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-12">
          <span className="section-tag mb-5 inline-flex">Acceso gratuito</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mt-4">
            Empieza ahora.{' '}
            <span className="gradient-text">Es gratis.</span>
          </h2>
          <p className="text-brand-muted mt-4 text-lg">
            Registrate y recibe el ebook + confirmación de tu lugar en la próxima clase en vivo.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative rounded-3xl border border-white/8 bg-[#0F0F0F] overflow-hidden">
            {/* Top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-brand-purple via-brand-lavender to-brand-yellow" />

            <div className="p-8 sm:p-10">
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center mx-auto mb-5 text-brand-yellow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">¡Estás adentro! 🎉</h3>
                  <p className="text-brand-muted leading-relaxed mb-6">
                    Revisa tu correo — te enviamos el ebook y los detalles de la clase en vivo en los próximos minutos.
                  </p>
                  <a
                    href="https://wa.me/16304154252?text=Hola%2C%20acabo%20de%20registrarme%20en%20BBER%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex"
                  >
                    <Icon.Whatsapp />
                    Escríbenos por WhatsApp
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      className={`input-dark ${errors.name ? 'border-red-500/60 focus:border-red-500/80' : ''}`}
                      placeholder="Ej. María López"
                      value={form.name}
                      onChange={handleChange('name')}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className={`input-dark ${errors.email ? 'border-red-500/60 focus:border-red-500/80' : ''}`}
                      placeholder="tucorreo@gmail.com"
                      value={form.email}
                      onChange={handleChange('email')}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      className={`input-dark ${errors.phone ? 'border-red-500/60 focus:border-red-500/80' : ''}`}
                      placeholder="+1 (630) 000-0000"
                      value={form.phone}
                      onChange={handleChange('phone')}
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1.5">{errors.phone}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-yellow w-full text-base py-4 font-black mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <>
                        Quiero mi acceso gratuito
                        <Icon.ArrowRight />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-brand-muted pt-1">
                    🔒 Tu información está 100% segura. No compartimos tus datos ni enviamos spam.
                  </p>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   TRUST SECTION
───────────────────────────────────────── */
const testimonials = [
  {
    name: 'Rosa Martínez',
    location: 'Chicago, IL',
    avatar: 'RM',
    color: '#7C3AED',
    text: 'Gracias a BBER pagué $8,000 en deudas en menos de un año. Nunca pensé que sería posible con mi salario. El contenido es práctico y en español, sin rodeos.',
    stars: 5,
  },
  {
    name: 'Carlos Herrera',
    location: 'Houston, TX',
    avatar: 'CH',
    color: '#5B21B6',
    text: 'Empecé a invertir por primera vez en mi vida a los 34 años. La clase en vivo me dio la confianza que necesitaba. Hoy tengo mi Roth IRA activo y creciendo.',
    stars: 5,
  },
  {
    name: 'Juliana Torres',
    location: 'Miami, FL',
    avatar: 'JT',
    color: '#8B5CF6',
    text: 'El ebook de BBER me explicó el crédito de una forma que nunca entendí antes. En 6 meses subí mi score de 580 a 720. ¡No puedo creerlo!',
    stars: 5,
  },
]

function Trust() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0F0F0F]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20">
          {[
            { num: '2,400+', label: 'Familias latinas', sub: 'ya en nuestra comunidad' },
            { num: '$1.2M', label: 'En deudas eliminadas', sub: 'por nuestros estudiantes' },
            { num: '4.9★', label: 'Calificación promedio', sub: 'en todos los recursos' },
            { num: '100%', label: 'Contenido en español', sub: 'hecho para ti' },
          ].map(({ num, label, sub }, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="text-center border-gradient rounded-2xl p-5">
                <div className="text-3xl sm:text-4xl font-black gradient-text-purple mb-1">{num}</div>
                <div className="text-white text-sm font-semibold">{label}</div>
                <div className="text-brand-muted text-xs mt-0.5">{sub}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Testimonials */}
        <Reveal className="text-center mb-12">
          <span className="section-tag mb-5 inline-flex">Testimonios reales</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-4">
            Lo que dicen{' '}
            <span className="gradient-text">nuestros estudiantes</span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map(({ name, location, avatar, color, text, stars }, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="border border-white/5 bg-black rounded-2xl p-6 card-hover h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 text-brand-yellow mb-4">
                  {[...Array(stars)].map((_, j) => <Icon.Star key={j} />)}
                </div>

                {/* Text */}
                <p className="text-brand-muted text-sm leading-relaxed flex-1 mb-5">"{text}"</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                    style={{ background: color }}
                  >
                    {avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{name}</div>
                    <div className="text-brand-muted text-xs">{location}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Trust badges */}
        <Reveal delay={300} className="mt-14">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: <Icon.Shield />, label: 'Privacidad garantizada' },
              { icon: <Icon.Users />, label: 'Comunidad activa' },
              { icon: <span className="text-xl">🇺🇸</span>, label: 'Basado en EE.UU.' },
              { icon: <span className="text-xl">📱</span>, label: 'Soporte por WhatsApp' },
              { icon: <span className="text-xl">♾️</span>, label: 'Acceso de por vida' },
            ].map(({ icon, label }, i) => (
              <div key={i} className="flex items-center gap-2 text-brand-muted text-sm bg-white/3 border border-white/6 rounded-full px-4 py-2">
                <span className="text-brand-lavender">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   FINAL CTA
───────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-purple-glow" />
      <div className="absolute inset-0 bg-yellow-glow" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <Reveal>
          <span className="text-5xl mb-6 block">🚀</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            El mejor momento para<br />
            <span className="gradient-text">empezar fue ayer.</span><br />
            El segundo mejor es ahora.
          </h2>
          <p className="text-brand-muted text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            No esperes más. Miles de familias latinas ya están cambiando su relación con el dinero. Hoy es tu turno.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#registro" className="btn-yellow text-base px-10 py-4 font-black">
              Obtener acceso gratis ahora
              <Icon.ArrowRight />
            </a>
            <a
              href="https://wa.me/16304154252?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20educaci%C3%B3n%20financiera"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base px-8 py-4"
            >
              <Icon.Whatsapp />
              Hablar con un asesor
            </a>
          </div>

          <p className="mt-8 text-brand-muted text-sm">
            ✓ Gratis para siempre &nbsp;·&nbsp; ✓ Sin tarjeta de crédito &nbsp;·&nbsp; ✓ En español
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   FOOTER
───────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0F0F0F]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center">
                <span className="text-white font-black text-sm">B</span>
              </div>
              <span className="font-black text-white text-lg">BBER</span>
            </div>
            <p className="text-brand-muted text-sm leading-relaxed">
              Educación financiera en español para la comunidad latina en los Estados Unidos.
            </p>
            <a
              href="https://wa.me/16304154252"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm text-[#25D366] hover:text-green-400 transition-colors"
            >
              <Icon.Whatsapp />
              +1 (630) 415-4252
            </a>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Recursos</h4>
            <ul className="space-y-2.5 text-sm text-brand-muted">
              <li><a href="#oferta"     className="hover:text-white transition-colors">Ebook gratuito</a></li>
              <li><a href="#oferta"     className="hover:text-white transition-colors">Clase en vivo</a></li>
              <li><a href="#beneficios" className="hover:text-white transition-colors">Beneficios</a></li>
              <li><a href="#registro"   className="hover:text-white transition-colors">Regístrate</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5 text-sm text-brand-muted">
              <li><a href="#" className="hover:text-white transition-colors">Política de privacidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos de uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Aviso de cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col gap-3 text-xs text-brand-muted">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} BBER · Luis Bernardo, Asesor Financiero Autorizado · Todos los derechos reservados.</p>
          </div>
          <p className="text-[10px] text-white/20 leading-relaxed">
            Este sitio es de carácter educativo y no constituye asesoría fiscal, legal ni de inversión. Las estimaciones mostradas son ilustrativas y no garantizan rendimientos ni resultados futuros. La elegibilidad para cualquier producto financiero depende del caso individual. BBER no es un asesor de inversiones registrado. Se requiere consentimiento explícito para el envío de comunicaciones por correo electrónico, SMS o WhatsApp.
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────
   WHATSAPP FLOAT
───────────────────────────────────────── */
function WhatsAppFloat() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href="https://wa.me/16304154252?text=Hola%2C%20me%20interesa%20la%20educaci%C3%B3n%20financiera%20de%20BBER"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 bg-[#25D366] text-white text-sm font-semibold px-4 sm:px-5 py-3 rounded-full shadow-lg transition-all duration-300 hover:bg-[#22C55E] hover:-translate-y-0.5 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ boxShadow: '0 8px 32px rgba(37,211,102,0.35)' }}
      aria-label="Contactar por WhatsApp"
    >
      <Icon.Whatsapp />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  )
}

/* ─────────────────────────────────────────
   APP ROOT
───────────────────────────────────────── */
export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LeadForm />
        <Problem />
        <Benefits />
        <OfferCards />
        <Trust />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
