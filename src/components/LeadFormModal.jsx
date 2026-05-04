import React, { useState, useEffect } from 'react'

const GHL_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/vtWSv9kV9PHekvK5VirT/webhook-trigger/851ca584-29ff-469a-bbcb-15f48b8867d4'
const CRM_WEBHOOK = 'https://crmagencia-production.up.railway.app/api/webhook?account=bber'

async function submitLead(payload) {
  await Promise.allSettled([
    fetch(GHL_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
    fetch(CRM_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  ])
}

export default function LeadFormModal({ guide, onClose }) {
  const [form,      setForm]      = useState({ name: '', email: '', phone: '' })
  const [errors,    setErrors]    = useState({})
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name  = 'Tu nombre es requerido'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Ingresa un correo válido'
    if (!form.phone.trim()) e.phone = 'Tu WhatsApp es requerido'
    return e
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await submitLead({ ...form, source: guide?.slug || 'guia', guia: guide?.title || '' })
    } catch { /* continúa al estado de éxito de todas formas */ }
    finally { setLoading(false); setSubmitted(true) }
  }

  const handleChange = field => e => {
    setForm(p => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }))
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden relative"
        style={{ background: '#132847', border: '1px solid #1E3A5F', boxShadow: '0 24px 80px rgba(7,17,31,0.92)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Barra de acento */}
        <div className="accent-bar" />

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          style={{ background: '#234A8A' }}
          aria-label="Cerrar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-7 sm:p-8">
          {submitted ? (
            /* ── Estado de éxito ── */
            <div className="text-center py-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">¡Ya tienes acceso!</h3>
              <p className="text-sm mb-6" style={{ color: '#94A3B8' }}>
                Descarga tu guía ahora mismo. También te llegará por email.
              </p>
              <a
                href={guide?.pdf || '/guias/retiro-200.pdf'}
                download
                className="btn-primary w-full mb-3"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar guía gratis
              </a>
              <a
                href="https://wa.me/16304154252?text=Hola%20Luis%2C%20descargué%20la%20guía%20y%20quiero%20hablar%20sobre%20mi%20plan%20de%20retiro"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full text-sm"
              >
                Habla con Luis sobre tu plan
              </a>
            </div>
          ) : (
            /* ── Formulario ── */
            <>
              <div className="mb-6">
                <span className="badge-orange mb-3 inline-flex">Acceso gratuito</span>
                <h3 className="text-2xl font-black text-white mb-1">
                  {guide?.title || 'Descarga tu guía'}
                </h3>
                <p className="text-sm" style={{ color: '#94A3B8' }}>
                  Ingresa tus datos y descárgala al instante.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#94A3B8' }}>
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    className={`input-field ${errors.name ? 'border-red-500/60' : ''}`}
                    placeholder="Tu nombre completo"
                    value={form.name}
                    onChange={handleChange('name')}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#94A3B8' }}>
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className={`input-field ${errors.email ? 'border-red-500/60' : ''}`}
                    placeholder="tucorreo@gmail.com"
                    value={form.email}
                    onChange={handleChange('email')}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#94A3B8' }}>
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    className={`input-field ${errors.phone ? 'border-red-500/60' : ''}`}
                    placeholder="+1 (630) 000-0000"
                    value={form.phone}
                    onChange={handleChange('phone')}
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full text-base py-4 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading
                    ? <svg className="animate-spin w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    : 'Acceder a mi guía gratis →'
                  }
                </button>

                <p className="text-center text-xs" style={{ color: '#4A5568' }}>
                  🔒 Sin spam · Tu información está segura
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
