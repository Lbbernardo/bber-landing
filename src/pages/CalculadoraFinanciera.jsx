import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/* ─────────────────────────────────────────
   LÓGICA FINANCIERA (funciones puras)
───────────────────────────────────────── */
const RATES = { low: 0.05, medium: 0.07, high: 0.09 }
const SWR   = 0.04

function futureValue(pmt, annualRate, years) {
  if (years <= 0) return 0
  const r = annualRate / 12
  const n = years * 12
  return pmt * ((Math.pow(1 + r, n) - 1) / r)
}

function monthlyIncome(capital) {
  return (capital * SWR) / 12
}

function calcRetirement({ age, retirementAge, monthlySavings, discipline }) {
  const years   = retirementAge - age
  const rate    = RATES[discipline]
  const capital = futureValue(monthlySavings, rate, years)
  const income  = monthlyIncome(capital)
  return { years, capital, income, rate, scenario: { low: 'conservador', medium: 'moderado', high: 'optimista' }[discipline] }
}

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

/* ─────────────────────────────────────────
   HERRAMIENTAS FINANCIERAS
───────────────────────────────────────── */
const FINANCIAL_TOOLS = {
  iul: {
    name: 'Indexed Universal Life (IUL)',
    icon: '📊',
    tagline: 'Crecimiento ligado al mercado, sin riesgo de pérdida',
    why: 'Tu dinero crece con el índice del mercado pero con un piso de 0% — nunca pierdes lo acumulado. Combina protección de vida con ventajas fiscales que ningún banco puede ofrecer.',
  },
  termLife: {
    name: 'Term Life Insurance Strategy',
    icon: '🛡️',
    tagline: 'Protección máxima al menor costo mientras acumulas',
    why: 'Libera capital para invertir ahora mientras proteges a tu familia. Es la base más eficiente para quienes están en fase de crecimiento patrimonial.',
  },
  wholeLife: {
    name: 'Whole Life Insurance',
    icon: '🏦',
    tagline: 'Valor en efectivo garantizado de por vida',
    why: 'Acumula valor en efectivo garantizado que crece sin importar lo que pase en los mercados. Seguridad absoluta como base de tu plan financiero.',
  },
  fixedAnnuity: {
    name: 'Fixed Annuity',
    icon: '🔒',
    tagline: 'Ingreso mensual garantizado sin depender del mercado',
    why: 'Convierte tu capital en un ingreso fijo mensual de por vida. Ideal para eliminar el riesgo de quedarte sin dinero en el retiro.',
  },
  indexedAnnuity: {
    name: 'Indexed Annuity',
    icon: '📈',
    tagline: 'Crecimiento con capital protegido',
    why: 'Participas del crecimiento del mercado con un piso que protege tu capital invertido. El equilibrio perfecto entre crecimiento e ingreso futuro seguro.',
  },
  universalLife: {
    name: 'Universal Life Insurance',
    icon: '⚙️',
    tagline: 'Flexibilidad total para ajustar tu plan',
    why: 'Permite ajustar primas e inversión conforme cambian tus ingresos. Ideal para personas con ingresos variables que quieren mantener protección activa.',
  },
  retirementIncome: {
    name: 'Retirement Income Strategy with Annuities',
    icon: '💰',
    tagline: 'Estrategia de ingresos garantizados para el retiro',
    why: 'Convierte tu capital acumulado en un flujo de ingresos mensual garantizado. Diseñada específicamente para cerrar la brecha entre tu proyección y tu meta.',
  },
  ltcRider: {
    name: 'Long-Term Care Rider',
    icon: '🏥',
    tagline: 'Protección médica para cuando más lo necesites',
    why: 'Cubre gastos de cuidado a largo plazo que pueden agotar tu patrimonio. Un gasto médico mayor sin cobertura puede destruir décadas de ahorro.',
  },
  disability: {
    name: 'Disability Income Protection',
    icon: '🦺',
    tagline: 'Tu ingreso protegido si no puedes trabajar',
    why: 'Si algo te impide trabajar, esta estrategia reemplaza tu ingreso y mantiene activo tu plan de retiro. Es la base que protege todo lo demás.',
  },
  estatePlanning: {
    name: 'Estate Planning Strategies',
    icon: '🏛️',
    tagline: 'Protege y transfiere tu patrimonio con inteligencia fiscal',
    why: 'Maximiza lo que dejas a tu familia y minimiza los impuestos. Para quienes ya construyeron patrimonio y quieren protegerlo y transferirlo eficientemente.',
  },
}

function recommendTool({ discipline, age, years, income, desiredIncome }) {
  const hasGap = desiredIncome > income
  const T = FINANCIAL_TOOLS

  if (age < 35) {
    if (discipline === 'low')    return T.disability
    if (discipline === 'medium') return T.iul
    return T.iul
  }
  if (age >= 35 && age < 45) {
    if (discipline === 'low')    return T.termLife
    if (discipline === 'medium') return T.indexedAnnuity
    return hasGap ? T.iul : T.universalLife
  }
  if (age >= 45 && age < 55) {
    if (discipline === 'low')    return T.wholeLife
    if (discipline === 'medium') return T.indexedAnnuity
    return hasGap ? T.retirementIncome : T.universalLife
  }
  // 55+
  if (discipline === 'high')   return T.estatePlanning
  if (hasGap)                  return T.retirementIncome
  return T.fixedAnnuity
}

/* ─────────────────────────────────────────
   NARRATIVA ESTÁTICA (fallback / sin IA)
───────────────────────────────────────── */
function buildNarrative(name, years, capital, income, scenario, savings, desiredIncome, age) {
  const gap = desiredIncome - income
  const savingsNeeded = Math.round(savings * (desiredIncome / income))
  const increase = savingsNeeded - savings

  const scenarioDesc = {
    low: 'con un rendimiento conservador',
    medium: 'con un rendimiento moderado',
    high: 'con un rendimiento optimista',
  }[scenario] || 'con disciplina constante'

  const p1 = `${name}, si mantienes un ahorro de ${fmt(savings)} al mes durante ${years} años, ${scenarioDesc}, lograrás acumular un patrimonio de ${fmt(capital)}. Eso equivale a un ingreso mensual de ${fmt(income)} en tu retiro — sin tocar el capital, solo viviendo de los rendimientos.`

  const p2 = gap > 0
    ? `Para alcanzar tu meta de ${fmt(desiredIncome)} al mes, hay una brecha de ${fmt(gap)}. Una forma concreta de cerrarla: aumentar tu aporte mensual a ${fmt(savingsNeeded)} (${fmt(increase)} más al mes). Con ${years} años por delante, ese ajuste puede marcar una diferencia significativa en tu calidad de vida al retirarte.`
    : `Tu plan actual ya supera tu meta: proyectas ${fmt(income)} al mes cuando deseas ${fmt(desiredIncome)}. Eso te da un colchón de ${fmt(-gap)} al mes. Mantener la constancia ahora asegura ese margen para imprevistos o un retiro anticipado.`

  const p3 = `A los ${age} años tienes una ventaja real: el tiempo. Cada mes que actúas hoy multiplica silenciosamente tu esfuerzo. Un asesor de World Financial Group puede ayudarte a elegir la herramienta correcta — como una IUL o un plan indexado — para que ese capital crezca con protección y ventajas fiscales. Agenda tu sesión gratuita y convierte esta proyección en un plan real.`

  const steps = gap > 0
    ? [
        `Aumenta tu aporte mensual de ${fmt(savings)} a ${fmt(savingsNeeded)} — incluso un aumento gradual de ${fmt(Math.round(increase / 3))} cada 4 meses llega al mismo resultado.`,
        `Automatiza el ahorro desde tu cuenta bancaria el mismo día que recibes tu sueldo, antes de cualquier gasto.`,
        `Agenda una sesión con un asesor para abrir una cuenta de inversión indexada y proteger tu capital con beneficios fiscales.`,
      ]
    : [
        `Mantén tu aporte de ${fmt(savings)} al mes sin interrupciones — la consistencia es lo que convierte proyecciones en realidad.`,
        `Evalúa con un asesor si parte de ese ahorro puede ir a un instrumento con protección (como una IUL) para blindar tu capital.`,
        `Revisa tu meta de retiro cada año: si tus ingresos crecen, aumenta el aporte y acelera tu libertad financiera.`,
      ]

  return { text: `${p1}\n\n${p2}\n\n${p3}`, steps }
}

/* ─────────────────────────────────────────
   AGENDADOR DE CITAS
───────────────────────────────────────── */
const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
const DAY_NAMES   = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTH_NAMES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function getNext4Days() {
  const days = []
  const d = new Date()
  d.setDate(d.getDate() + 1)
  while (days.length < 4) {
    if (d.getDay() !== 0) days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

function AppointmentScheduler({ contactInfo }) {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [saving, setSaving]             = useState(false)
  const [confirmed, setConfirmed]       = useState(false)
  const days = getNext4Days()

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return
    setSaving(true)
    try {
      await supabase.from('appointments').insert({
        name:             contactInfo.name,
        email:            contactInfo.email || null,
        phone:            contactInfo.phone || null,
        appointment_date: selectedDate.toISOString().slice(0, 10),
        appointment_time: selectedTime,
        status:           'pendiente',
      })
    } catch (e) {
      console.error('Supabase appointments error:', JSON.stringify(e))
    }

    // Notificar al admin por email
    supabase.functions.invoke('notify-new-appointment', {
      body: {
        name:            contactInfo.name,
        email:           contactInfo.email || null,
        phone:           contactInfo.phone || null,
        appointmentDate: selectedDate.toISOString().slice(0, 10),
        appointmentTime: selectedTime,
      },
    }).catch(() => {}) // silencioso si falla

    setConfirmed(true)
    setSaving(false)
  }

  if (confirmed) {
    return (
      <div className="text-center py-6">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-white mb-2">¡Cita agendada!</h3>
        <p className="text-brand-muted">
          Te esperamos el{' '}
          <span className="text-white font-medium">
            {DAY_NAMES[selectedDate.getDay()]} {selectedDate.getDate()} {MONTH_NAMES[selectedDate.getMonth()]}
          </span>{' '}
          a las <span className="text-white font-medium">{selectedTime}</span>.
        </p>
        <p className="text-brand-muted text-sm mt-2">Te contactaremos pronto para confirmar.</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-brand-muted text-sm mb-4 text-center">Elige un día y hora para tu sesión gratuita</p>

      {/* Días */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {days.map((d, i) => (
          <button
            key={i}
            onClick={() => { setSelectedDate(d); setSelectedTime(null) }}
            className={`p-3 rounded-xl border text-center transition-all ${
              selectedDate?.toDateString() === d.toDateString()
                ? 'border-brand-purple bg-brand-purple/20 text-white'
                : 'border-white/10 bg-white/5 text-brand-muted hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="text-xs font-medium uppercase">{DAY_NAMES[d.getDay()]}</div>
            <div className="text-xl font-bold">{d.getDate()}</div>
            <div className="text-xs">{MONTH_NAMES[d.getMonth()]}</div>
          </button>
        ))}
      </div>

      {/* Horarios */}
      {selectedDate && (
        <div className="grid grid-cols-3 gap-2 mb-5">
          {TIME_SLOTS.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTime(t)}
              className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                selectedTime === t
                  ? 'border-brand-yellow bg-brand-yellow/20 text-brand-yellow'
                  : 'border-white/10 bg-white/5 text-brand-muted hover:bg-white/10 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={handleConfirm}
        disabled={!selectedDate || !selectedTime || saving}
        className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {saving ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Guardando…
          </>
        ) : (
          <>
            Confirmar cita
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </>
        )}
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────
   COMPONENTES UI
───────────────────────────────────────── */

// Pantalla 1: Hero
function Hero({ onStart }) {
  return (
    <div className="min-h-screen bg-brand-black bg-purple-glow flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto animate-fade-up">
        <div className="inline-flex items-center gap-2 border border-brand-purple/40 bg-brand-purple/10 rounded-full px-4 py-2 text-brand-lavender text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-brand-yellow animate-glow-pulse" />
          Proyección personalizada en 2 minutos
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-brand-white leading-tight mb-6">
          Imagina tu
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-brand-lemon">
            retiro soñado
          </span>
        </h1>

        <p className="text-xl text-brand-muted mb-12 max-w-lg mx-auto">
          Responde 6 preguntas y descubre cómo podría verse tu independencia financiera si empiezas hoy.
        </p>

        <button
          onClick={onStart}
          className="group inline-flex items-center gap-3 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 animate-glow-pulse"
        >
          Calcular mi retiro
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-brand-muted text-sm">
          {['Datos privados y seguros', 'Sin compromisos', 'Resultados inmediatos'].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-purple" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Pantalla 2: Formulario multi-paso
const DISCIPLINE_OPTIONS = [
  {
    value: 'low',
    label: 'Apenas estoy empezando',
    desc: 'Todavía no tengo el hábito del ahorro pero quiero comenzar con algo seguro y sin complicaciones.',
    icon: '🌱',
    tag: 'Perfecto para arrancar',
  },
  {
    value: 'medium',
    label: 'Ya ahorro pero no tengo un plan',
    desc: 'Guardo dinero de vez en cuando, pero siento que podría hacerlo crecer mejor si tuviera la estrategia correcta.',
    icon: '📈',
    tag: 'El más común',
  },
  {
    value: 'high',
    label: 'Estoy listo para comprometerte',
    desc: 'Entiendo que ser constante hace la diferencia y quiero una herramienta que maximice cada peso que ahorro.',
    icon: '🎯',
    tag: 'Mayor potencial',
  },
]

function Form({ onSubmit }) {
  const [step, setStep] = useState(1)
  const [fields, setFields] = useState({ age: '', retirementAge: '', desiredIncome: '', savings: '', discipline: '', name: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})

  const set = (k, v) => { setFields(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  const validate = (s) => {
    const e = {}
    if (s === 1) {
      const a = parseInt(fields.age), r = parseInt(fields.retirementAge)
      if (!a || a < 18 || a > 79) e.age = 'Edad entre 18 y 79'
      if (!r || r < 30 || r > 80) e.retirementAge = 'Edad de retiro entre 30 y 80'
      if (a && r && r <= a) e.retirementAge = 'Debe ser mayor a tu edad actual'
    }
    if (s === 2) {
      if (!fields.desiredIncome || parseFloat(fields.desiredIncome) <= 0) e.desiredIncome = 'Ingresa un monto válido'
      if (!fields.savings || parseFloat(fields.savings) <= 0) e.savings = 'Ingresa un monto válido'
    }
    if (s === 3) { if (!fields.discipline) e.discipline = 'Selecciona una opción' }
    if (s === 4) {
      if (!fields.name || fields.name.trim().length < 2) e.name = 'Ingresa tu nombre'
      if (!fields.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) e.email = 'Ingresa un email válido'
      if (!fields.phone || fields.phone.trim().length < 7) e.phone = 'Ingresa tu teléfono'
    }
    return e
  }

  const next = () => {
    const e = validate(step)
    if (Object.keys(e).length) { setErrors(e); return }
    setStep(s => s + 1)
  }

  const submit = (ev) => {
    ev.preventDefault()
    const e = validate(4)
    if (Object.keys(e).length) { setErrors(e); return }
    onSubmit({
      age: parseInt(fields.age),
      retirementAge: parseInt(fields.retirementAge),
      desiredIncome: parseFloat(fields.desiredIncome),
      savings: parseFloat(fields.savings),
      discipline: fields.discipline,
      name: fields.name.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
    })
  }

  const inp = `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all`
  const err = `mt-1 text-red-400 text-sm`

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Progreso */}
        <div className="mb-8">
          <div className="flex justify-between text-brand-muted text-sm mb-2">
            <span>Paso {step} de 4</span><span>{step * 25}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-purple to-brand-yellow rounded-full transition-all duration-500" style={{ width: `${step * 25}%` }} />
          </div>
        </div>

        <form onSubmit={submit}>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm animate-fade-up">

            {/* Step 1 */}
            {step === 1 && <>
              <h2 className="text-2xl font-bold text-white mb-2">¿Cuándo quieres retirarte?</h2>
              <p className="text-brand-muted mb-8">Tu horizonte de tiempo determina el poder de tu plan.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-brand-muted text-sm mb-2">Tu edad actual</label>
                  <input type="number" placeholder="32" value={fields.age} onChange={e => set('age', e.target.value)} className={inp} min={18} max={79} />
                  {errors.age && <p className={err}>{errors.age}</p>}
                </div>
                <div>
                  <label className="block text-brand-muted text-sm mb-2">Edad deseada de retiro</label>
                  <input type="number" placeholder="60" value={fields.retirementAge} onChange={e => set('retirementAge', e.target.value)} className={inp} min={30} max={80} />
                  {errors.retirementAge && <p className={err}>{errors.retirementAge}</p>}
                </div>
              </div>
            </>}

            {/* Step 2 */}
            {step === 2 && <>
              <h2 className="text-2xl font-bold text-white mb-2">Háblame de tu dinero</h2>
              <p className="text-brand-muted mb-8">Sin juicios. Solo necesitamos números para proyectar tu futuro.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-brand-muted text-sm mb-2">¿Cuánto quieres ganar al mes después de retirarte? (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">$</span>
                    <input type="number" placeholder="2000" value={fields.desiredIncome} onChange={e => set('desiredIncome', e.target.value)} className={`${inp} pl-8`} min={1} />
                  </div>
                  {errors.desiredIncome && <p className={err}>{errors.desiredIncome}</p>}
                </div>
                <div>
                  <label className="block text-brand-muted text-sm mb-2">¿Cuánto puedes ahorrar al mes hoy? (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">$</span>
                    <input type="number" placeholder="300" value={fields.savings} onChange={e => set('savings', e.target.value)} className={`${inp} pl-8`} min={1} />
                  </div>
                  {errors.savings && <p className={err}>{errors.savings}</p>}
                </div>
              </div>
            </>}

            {/* Step 3 */}
            {step === 3 && <>
              <h2 className="text-2xl font-bold text-white mb-2">¿Cómo te describes hoy?</h2>
              <p className="text-brand-muted mb-8">No necesitas saber de inversiones — solo elige lo que más se parece a ti.</p>
              <div className="space-y-3">
                {DISCIPLINE_OPTIONS.map(o => (
                  <button key={o.value} type="button" onClick={() => set('discipline', o.value)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${fields.discipline === o.value ? 'border-brand-purple bg-brand-purple/20 ring-1 ring-brand-purple' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">{o.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold">{o.label}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            o.value === 'medium'
                              ? 'bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30'
                              : 'bg-white/10 text-brand-muted border border-white/10'
                          }`}>{o.tag}</span>
                        </div>
                        <div className="text-brand-muted text-sm leading-relaxed">{o.desc}</div>
                      </div>
                      {fields.discipline === o.value && (
                        <svg className="w-5 h-5 text-brand-purple shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {errors.discipline && <p className={err}>{errors.discipline}</p>}
              <p className="text-white/30 text-xs mt-4 text-center">Tu respuesta nos ayuda a mostrarte el escenario más realista para ti</p>
            </>}

            {/* Step 4 */}
            {step === 4 && <>
              <h2 className="text-2xl font-bold text-white mb-2">¿A quién le mostramos los resultados?</h2>
              <p className="text-brand-muted mb-8">Tu información está protegida. Solo la usamos para personalizar tu proyección.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-brand-muted text-sm mb-2">Tu nombre *</label>
                  <input type="text" placeholder="Ana García" value={fields.name} onChange={e => set('name', e.target.value)} className={inp} />
                  {errors.name && <p className={err}>{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-brand-muted text-sm mb-2">Email *</label>
                  <input type="email" placeholder="ana@ejemplo.com" value={fields.email} onChange={e => set('email', e.target.value)} className={inp} />
                  {errors.email && <p className={err}>{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-brand-muted text-sm mb-2">Teléfono *</label>
                  <input type="tel" placeholder="+1 555 123 4567" value={fields.phone} onChange={e => set('phone', e.target.value)} className={inp} />
                  {errors.phone && <p className={err}>{errors.phone}</p>}
                </div>
              </div>
            </>}

            {/* Navegación */}
            <div className="mt-8 flex gap-3">
              {step > 1 && (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  className="flex-1 border border-white/20 text-white py-4 rounded-xl font-semibold hover:bg-white/10 transition-all">
                  Atrás
                </button>
              )}
              {step < 4
                ? <button type="button" onClick={next}
                    className="flex-1 bg-brand-purple hover:bg-brand-purple/90 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95">
                    Continuar
                  </button>
                : <button type="submit"
                    className="flex-1 bg-gradient-to-r from-brand-purple to-brand-lavender text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg">
                    Ver mi proyección ✨
                  </button>
              }
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// Pantalla 3: Loading
const LOADING_MSGS = [
  'Calculando tu capital proyectado…',
  'Analizando tu escenario de retiro…',
  'Generando tu narrativa personalizada…',
  'Preparando tus próximos pasos…',
  'Casi listo…',
]

function Loading() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI(p => (p + 1) % LOADING_MSGS.length), 1800)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-sm animate-fade-in">
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-purple border-r-brand-purple animate-spin" />
          <div className="absolute inset-3 rounded-full border-4 border-transparent border-t-brand-yellow animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
          <div className="absolute inset-0 flex items-center justify-center text-3xl">💰</div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Construyendo tu futuro</h2>
        <p className="text-brand-muted text-sm min-h-[1.5rem] transition-all duration-500">{LOADING_MSGS[i]}</p>
        <div className="flex justify-center gap-2 mt-6">
          {LOADING_MSGS.map((_, idx) => (
            <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === i ? 'bg-brand-purple w-6' : 'bg-white/20 w-1.5'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Pantalla 4: Resultado
function StatBox({ label, value, sub, accent }) {
  return (
    <div className={`rounded-2xl p-5 border ${accent ? 'border-brand-purple/40 bg-brand-purple/10' : 'border-white/10 bg-white/5'}`}>
      <p className="text-brand-muted text-sm mb-1">{label}</p>
      <p className={`font-bold ${accent ? 'text-2xl text-white' : 'text-xl text-white'}`}>{value}</p>
      {sub && <p className="text-brand-muted text-xs mt-1">{sub}</p>}
    </div>
  )
}

function Result({ data, name, desiredIncome, contactInfo, onReset }) {
  const gap = desiredIncome - data.income
  return (
    <div className="min-h-screen bg-brand-black bg-purple-glow py-12 px-4">
      <div className="max-w-2xl mx-auto animate-fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 border border-brand-yellow/30 bg-brand-yellow/10 rounded-full px-4 py-2 text-brand-yellow text-sm font-medium mb-6">
            ✨ Tu proyección personalizada
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{name}, aquí está tu futuro</h1>
          <p className="text-brand-muted">
            Escenario <span className="text-brand-lavender font-semibold capitalize">{data.scenario}</span>
            {' '}• Tasa {(data.rate * 100).toFixed(0)}% anual • SWR 4%
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatBox label="Años hasta tu retiro"   value={`${data.years} años`}        sub="Tiempo de crecimiento" />
          <StatBox label="Capital proyectado"      value={fmt(data.capital)}           sub="Valor futuro de tus aportes" accent />
          <StatBox label="Ingreso mensual estimado" value={fmt(data.income)}           sub="Con tasa de retiro del 4%" />
          <StatBox
            label={gap <= 0 ? '¡Vas por buen camino!' : 'Brecha mensual'}
            value={gap <= 0 ? 'Meta alcanzada ✓' : fmt(gap)}
            sub={gap <= 0 ? `Superas tu meta en ${fmt(-gap)}` : 'Para alcanzar tu meta deseada'}
          />
        </div>

        {/* Herramienta recomendada */}
        {data.tool && (
          <div className="bg-gradient-to-r from-brand-purple/20 to-brand-lavender/10 border border-brand-purple/40 rounded-3xl p-7 mb-6">
            <p className="text-brand-lavender text-xs font-semibold uppercase tracking-widest mb-4">
              La herramienta que te recomendamos para ahorrar tu dinero
            </p>
            <div className="flex items-start gap-4">
              <span className="text-5xl">{data.tool.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{data.tool.name}</h2>
                <p className="text-brand-yellow text-sm font-semibold mb-3">{data.tool.tagline}</p>
                <p className="text-brand-muted text-sm leading-relaxed">{data.tool.why}</p>
              </div>
            </div>
          </div>
        )}

        {/* Narrativa */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>💬</span> Tu historia de retiro
          </h2>
          <div className="text-brand-muted leading-relaxed whitespace-pre-line">{data.narrative}</div>
        </div>

        {/* Pasos */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <span>🎯</span> Tus próximos pasos
          </h2>
          <div className="space-y-4">
            {data.steps.map((s, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center text-brand-lavender text-sm font-bold">
                  {idx + 1}
                </div>
                <p className="text-brand-muted pt-1">{s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mensaje de cierre */}
        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 mb-6">
          <p className="text-brand-muted text-sm leading-relaxed text-center">
            Existen distintas herramientas financieras diseñadas para ayudar a construir un retiro a largo plazo, combinando{' '}
            <span className="text-white font-medium">acumulación, protección y ventajas fiscales</span>{' '}
            según cada caso. Un asesor puede ayudarte a elegir la combinación correcta para tu situación específica.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-brand-purple/20 to-brand-lavender/10 border border-brand-purple/30 rounded-3xl p-8 text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">¿Listo para hacerlo realidad?</h2>
          <p className="text-brand-muted mb-5 max-w-md mx-auto">
            Convierte esta proyección en un plan concreto con las herramientas correctas de World Financial Group.
          </p>

          {/* Precio tachado */}
          <div className="inline-flex flex-col items-center gap-1 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-brand-muted line-through text-lg">$50 USD</span>
              <span className="bg-brand-yellow/20 border border-brand-yellow/40 text-brand-yellow text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Ahora gratis
              </span>
            </div>
            <p className="text-white font-semibold text-base">
              Sesión de 30 min con un asesor de finanzas
            </p>
            <p className="text-brand-muted text-xs">Para nuestros clientes — sin costo, sin compromiso</p>
          </div>

          <AppointmentScheduler contactInfo={contactInfo} />
        </div>

        <div className="text-center">
          <button onClick={onReset} className="text-brand-muted hover:text-white transition-colors text-sm underline underline-offset-4">
            Calcular con datos diferentes
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   PÁGINA PRINCIPAL
───────────────────────────────────────── */
export default function CalculadoraFinanciera() {
  const [screen, setScreen]   = useState('hero')   // hero | form | loading | result
  const [result, setResult]   = useState(null)
  const [formData, setFormData] = useState(null)

  const handleFormSubmit = async (data) => {
    setFormData(data)
    setScreen('loading')

    // Cálculos financieros
    const calc = calcRetirement({
      age: data.age,
      retirementAge: data.retirementAge,
      monthlySavings: data.savings,
      discipline: data.discipline,
    })

    // Narrativa — Edge Function de Supabase (OpenAI), con fallback estático
    let narrativeText, steps
    try {
      const { data: fnData, error: fnError } = await supabase.functions.invoke('retirement-narrative', {
        body: {
          name:          data.name,
          age:           data.age,
          retirementAge: data.retirementAge,
          desiredIncome: data.desiredIncome,
          savings:       data.savings,
          discipline:    data.discipline,
          years:         calc.years,
          capital:       calc.capital,
          income:        calc.income,
          scenario:      calc.scenario,
        },
      })
      if (fnError) throw fnError
      narrativeText = fnData.narrative
      steps         = fnData.steps
    } catch (aiErr) {
      console.warn('Edge function fallback:', aiErr)
      const fallback = buildNarrative(data.name, calc.years, calc.capital, calc.income, calc.scenario, data.savings, data.desiredIncome, data.age)
      narrativeText  = fallback.text
      steps          = fallback.steps
    }

    const tool = recommendTool({
      discipline: data.discipline,
      age:         data.age,
      years:       calc.years,
      income:      calc.income,
      desiredIncome: data.desiredIncome,
    })

    const finalResult = { ...calc, narrative: narrativeText, steps, tool }

    // Guardar en Supabase (silencioso si falla)
    try {
      await supabase.from('retirement_leads').insert({
        name:                    data.name,
        email:                   data.email || null,
        phone:                   data.phone || null,
        age:                     data.age,
        retirement_age:          data.retirementAge,
        monthly_desired_income:  data.desiredIncome,
        monthly_savings:         data.savings,
        discipline:              data.discipline,
        years_to_retirement:     calc.years,
        projected_capital:       calc.capital,
        monthly_retirement_income: calc.income,
        annual_rate:             calc.rate,
        scenario:                calc.scenario,
        status:                  'nuevo',
        ai_result:               finalResult,
      })
    } catch (e) {
      console.error('Supabase retirement_leads error:', JSON.stringify(e))
    }

    // Notificar al admin por email
    supabase.functions.invoke('notify-new-lead', {
      body: {
        name:          data.name,
        email:         data.email,
        phone:         data.phone,
        age:           data.age,
        retirementAge: data.retirementAge,
        savings:       data.savings,
        desiredIncome: data.desiredIncome,
        capital:       calc.capital,
        income:        calc.income,
        scenario:      calc.scenario,
      },
    }).catch(() => {}) // silencioso si falla

    // Pequeño delay para que el loading se sienta real
    await new Promise(r => setTimeout(r, 3000))

    setResult(finalResult)
    setScreen('result')
  }

  const reset = () => { setScreen('hero'); setResult(null); setFormData(null) }

  return (
    <>
      {screen === 'hero'    && <Hero onStart={() => setScreen('form')} />}
      {screen === 'form'    && <Form onSubmit={handleFormSubmit} />}
      {screen === 'loading' && <Loading />}
      {screen === 'result'  && result && formData && (
        <Result
          data={result}
          name={formData.name}
          desiredIncome={formData.desiredIncome}
          contactInfo={{ name: formData.name, email: formData.email, phone: formData.phone }}
          onReset={reset}
        />
      )}
    </>
  )
}
