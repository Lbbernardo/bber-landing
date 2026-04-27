import React, { useState } from 'react'

export default function Descarga() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Tu nombre es requerido'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Ingresa un correo válido — ahí te enviamos el libro'
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

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center px-4 py-16">

      {/* Logo */}
      <a href="/bber/" className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center">
          <span className="text-white font-black text-sm">B</span>
        </div>
        <span className="font-black text-white text-lg tracking-tight">BBER</span>
      </a>

      <div className="w-full max-w-md">

        {submitted ? (
          /* ── Estado de éxito ── */
          <div className="rounded-3xl border border-white/8 bg-[#0F0F0F] overflow-hidden text-center">
            <div className="h-1 w-full bg-gradient-to-r from-brand-purple via-brand-lavender to-brand-yellow" />
            <div className="p-10">
              <div className="w-16 h-16 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center mx-auto mb-6 text-brand-yellow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>

              <h2 className="text-2xl font-black text-white mb-3">¡Listo! Revisa tu correo</h2>
              <p className="text-brand-muted text-sm leading-relaxed mb-2">
                Te enviamos <strong className="text-white">La Guía Financiera del Latino en EE.UU.</strong> a:
              </p>
              <p className="text-brand-yellow font-bold mb-6">{form.email}</p>
              <p className="text-brand-muted text-xs mb-8">
                Si no lo ves en tu bandeja de entrada, revisa tu carpeta de spam.
              </p>

              <a
                href="https://wa.me/16304154252?text=Hola%2C%20acabo%20de%20descargar%20el%20ebook%20de%20BBER%20y%20quiero%20más%20información"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex text-sm"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Hablar con un asesor
              </a>
            </div>
          </div>

        ) : (
          /* ── Formulario ── */
          <>
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/20 rounded-full px-3 py-1.5 mb-4 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
                Ebook gratuito
              </span>
              <h1 className="text-3xl font-black leading-tight mb-3">
                Descarga la Guía Financiera<br />
                <span className="text-brand-yellow">del Latino en EE.UU.</span>
              </h1>
              <p className="text-brand-muted text-sm">
                60+ páginas · 10 módulos · 100% en español · $0
              </p>
            </div>

            <div className="rounded-3xl border border-white/8 bg-[#0F0F0F] overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-brand-purple via-brand-lavender to-brand-yellow" />
              <form onSubmit={handleSubmit} noValidate className="p-8 space-y-5">

                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    className={`input-dark ${errors.name ? 'border-red-500/60' : ''}`}
                    placeholder="Ej. María López"
                    value={form.name}
                    onChange={handleChange('name')}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                    Correo electrónico <span className="text-brand-yellow">*</span>
                  </label>
                  <input
                    type="email"
                    className={`input-dark ${errors.email ? 'border-red-500/60' : ''}`}
                    placeholder="tucorreo@gmail.com"
                    value={form.email}
                    onChange={handleChange('email')}
                  />
                  {errors.email
                    ? <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
                    : <p className="text-brand-muted text-xs mt-1.5">Aquí te enviamos el ebook</p>
                  }
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                    Teléfono / WhatsApp <span className="text-brand-muted font-normal">(opcional)</span>
                  </label>
                  <input
                    type="tel"
                    className="input-dark"
                    placeholder="+1 (630) 000-0000"
                    value={form.phone}
                    onChange={handleChange('phone')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-yellow w-full text-base py-4 font-black mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <svg className="animate-spin w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <>
                      Enviarme el libro gratis
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-brand-muted pt-1">
                  🔒 Tu información está 100% segura. No spam, nunca.
                </p>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
