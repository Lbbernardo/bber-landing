import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/* ── Configuración de estados ── */
const STATUS = {
  nuevo:         { label: 'Nuevo',          cls: 'text-brand-yellow   bg-brand-yellow/10   border-brand-yellow/30' },
  contactado:    { label: 'Contactado',     cls: 'text-blue-400       bg-blue-400/10       border-blue-400/30' },
  en_proceso:    { label: 'En proceso',     cls: 'text-orange-400     bg-orange-400/10     border-orange-400/30' },
  convertido:    { label: 'Convertido',     cls: 'text-green-400      bg-green-400/10      border-green-400/30' },
  no_interesado: { label: 'No interesado',  cls: 'text-gray-400       bg-gray-400/10       border-gray-400/30' },
}
const STATUS_KEYS = Object.keys(STATUS)
const PER_PAGE = 15

function Badge({ status }) {
  const cfg = STATUS[status] || STATUS.nuevo
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}

function SortIcon({ active, dir }) {
  return (
    <span className={`ml-1 transition-colors ${active ? 'text-brand-purple' : 'text-white/20'}`}>
      {active && dir === 'asc' ? '↑' : '↓'}
    </span>
  )
}

export default function CRM() {
  const navigate = useNavigate()
  const [user, setUser]               = useState(null)
  const [activeTab, setActiveTab]     = useState('leads')   // 'leads' | 'calculadora' | 'citas'
  const [leads, setLeads]             = useState([])
  const [retLeads, setRetLeads]       = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [sortCol, setSortCol]         = useState('created_at')
  const [sortDir, setSortDir]         = useState('desc')
  const [page, setPage]               = useState(1)
  const [deleting, setDeleting]       = useState(null)
  const [editStatus, setEditStatus]   = useState(null) // lead id with open dropdown

  /* ── Auth guard ── */
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) navigate('/admin')
      else setUser(user)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') navigate('/admin')
    })
    return () => subscription.unsubscribe()
  }, [navigate])

  /* ── Cargar leads ── */
  useEffect(() => {
    if (user) { fetchLeads(); fetchRetLeads(); fetchAppointments() }
  }, [user])

  async function fetchLeads() {
    setLoading(true)
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setLeads(data || [])
    setLoading(false)
  }

  async function fetchRetLeads() {
    const { data, error } = await supabase
      .from('retirement_leads')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setRetLeads(data || [])
  }

  async function fetchAppointments() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
    if (!error) setAppointments(data || [])
  }

  async function updateAppointmentStatus(id, status) {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    await supabase.from('appointments').update({ status }).eq('id', id)
  }

  async function deleteAppointment(id, name) {
    if (!window.confirm(`¿Eliminar la cita de "${name}"?`)) return
    setAppointments(prev => prev.filter(a => a.id !== id))
    await supabase.from('appointments').delete().eq('id', id)
  }

  async function updateStatus(id, status) {
    const table = activeTab === 'calculadora' ? 'retirement_leads' : 'leads'
    if (activeTab === 'calculadora') {
      setRetLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    } else {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    }
    setEditStatus(null)
    await supabase.from(table).update({ status }).eq('id', id)
  }

  async function deleteLead(id, name) {
    if (!window.confirm(`¿Eliminar a "${name}"? Esta acción no se puede deshacer.`)) return
    const table = activeTab === 'calculadora' ? 'retirement_leads' : 'leads'
    setDeleting(id)
    if (activeTab === 'calculadora') {
      setRetLeads(prev => prev.filter(l => l.id !== id))
    } else {
      setLeads(prev => prev.filter(l => l.id !== id))
    }
    await supabase.from(table).delete().eq('id', id)
    setDeleting(null)
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  function exportCSV() {
    const isCalc = activeTab === 'calculadora'
    const rows   = isCalc ? filteredRet : filtered
    const header = isCalc
      ? ['Nombre', 'Correo', 'Teléfono', 'Escenario', 'Capital Proyectado', 'Ingreso/Mes', 'Estado', 'Fecha'].join(',')
      : ['Nombre', 'Correo', 'Teléfono', 'Estado', 'Fecha'].join(',')
    const body = rows.map(r => {
      if (isCalc) return [
        `"${r.name}"`, `"${r.email || ''}"`, `"${r.phone || ''}"`,
        `"${r.scenario}"`, `"${r.projected_capital}"`, `"${r.monthly_retirement_income}"`,
        `"${STATUS[r.status]?.label || 'Nuevo'}"`, `"${fmt(r.created_at)}"`,
      ].join(',')
      return [
        `"${r.name}"`, `"${r.email}"`, `"${r.phone}"`,
        `"${STATUS[r.status]?.label || r.status}"`, `"${fmt(r.created_at)}"`,
      ].join(',')
    }).join('\n')
    const blob = new Blob([header + '\n' + body], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `leads-${isCalc ? 'calculadora' : 'bber'}-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function fmt(ts) {
    return new Date(ts).toLocaleDateString('es-MX', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  function toggleSort(col) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
    setPage(1)
  }

  /* ── Reset página al cambiar tab ── */
  useEffect(() => { setPage(1); setSearch(''); setStatusFilter('todos') }, [activeTab])

  /* ── Datos filtrados y ordenados ── */
  const applyFilters = (data) => {
    if (statusFilter !== 'todos') data = data.filter(l => (l.status || 'nuevo') === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(l =>
        l.name?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.phone?.includes(q)
      )
    }
    return [...data].sort((a, b) => {
      let va = a[sortCol] ?? '', vb = b[sortCol] ?? ''
      if (sortDir === 'desc') [va, vb] = [vb, va]
      return va < vb ? -1 : va > vb ? 1 : 0
    })
  }

  const filtered    = useMemo(() => applyFilters(leads),    [leads, statusFilter, search, sortCol, sortDir])
  const filteredRet = useMemo(() => applyFilters(retLeads), [retLeads, statusFilter, search, sortCol, sortDir])

  const activeFiltered = activeTab === 'calculadora' ? filteredRet : filtered
  const totalPages     = Math.max(1, Math.ceil(activeFiltered.length / PER_PAGE))
  const paginated      = activeFiltered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  /* ── Estadísticas ── */
  const stats = useMemo(() => {
    const src        = activeTab === 'calculadora' ? retLeads : leads
    const now        = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart  = new Date(todayStart); weekStart.setDate(weekStart.getDate() - 6)
    return {
      total:     src.length,
      today:     src.filter(l => new Date(l.created_at) >= todayStart).length,
      week:      src.filter(l => new Date(l.created_at) >= weekStart).length,
      converted: src.filter(l => l.status === 'convertido').length,
    }
  }, [leads, retLeads, activeTab])

  if (!user) return null

  const COLS_LEADS = [
    { key: 'name',       label: 'Nombre' },
    { key: 'email',      label: 'Correo' },
    { key: 'phone',      label: 'Teléfono' },
    { key: 'status',     label: 'Estado' },
    { key: 'created_at', label: 'Registro' },
  ]
  const COLS_CALC = [
    { key: 'name',                      label: 'Nombre' },
    { key: 'email',                     label: 'Correo' },
    { key: 'phone',                     label: 'Teléfono' },
    { key: 'scenario',                  label: 'Escenario' },
    { key: 'projected_capital',         label: 'Capital' },
    { key: 'monthly_retirement_income', label: 'Ingreso/Mes' },
    { key: 'status',                    label: 'Estado' },
    { key: 'created_at',                label: 'Registro' },
  ]
  const COLS = activeTab === 'calculadora' ? COLS_CALC : COLS_LEADS

  return (
    <div className="min-h-screen bg-black text-white font-sans" onClick={() => setEditStatus(null)}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-[#0F0F0F] border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-brand-purple flex items-center justify-center shrink-0">
              <span className="text-white font-black text-xs">B</span>
            </div>
            <span className="font-black text-white tracking-tight">BBER</span>
            <span className="text-white/20">·</span>
            <span className="text-brand-muted text-sm hidden sm:block">CRM</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-brand-muted text-xs hidden md:block truncate max-w-[200px]">{user.email}</span>
            <a href="/" className="text-brand-muted hover:text-white text-xs transition-colors hidden sm:block">
              Ver landing →
            </a>
            <button
              onClick={signOut}
              className="text-xs border border-white/10 hover:border-red-500/30 hover:text-red-400 text-brand-muted px-3 py-1.5 rounded-lg transition-all"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Título ── */}
        <div className="mb-7 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white">Panel de Leads</h1>
            <p className="text-brand-muted text-sm mt-1">Gestiona las personas que completaron el formulario</p>
          </div>
          <button
            onClick={() => navigate('/agente')}
            className="inline-flex items-center gap-2 bg-brand-purple hover:bg-[#6d28d9] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all shrink-0 shadow-lg shadow-brand-purple/20"
          >
            <span className="text-base">🤖</span>
            Abrir Agente de Ventas
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-7 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
          {[
            { key: 'leads',       label: 'Landing',      icon: '🏠', count: leads.length },
            { key: 'calculadora', label: 'Calculadora',  icon: '💰', count: retLeads.length },
            { key: 'citas',       label: 'Citas',        icon: '📅', count: appointments.length },
          ].map(({ key, label, icon, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === key
                  ? 'bg-brand-purple text-white shadow'
                  : 'text-brand-muted hover:text-white'
              }`}
            >
              {icon} {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === key ? 'bg-white/20' : 'bg-white/10'}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total leads',     value: stats.total,     accent: 'purple', icon: '👥' },
            { label: 'Registros hoy',   value: stats.today,     accent: 'yellow', icon: '📅' },
            { label: 'Últimos 7 días',  value: stats.week,      accent: 'purple', icon: '📊' },
            { label: 'Convertidos',     value: stats.converted, accent: 'green',  icon: '✅' },
          ].map(({ label, value, accent, icon }) => (
            <div key={label} className="border border-white/8 bg-[#0F0F0F] rounded-2xl p-4 hover:border-white/15 transition-colors">
              <div className="text-xl mb-1">{icon}</div>
              <div className={`text-3xl font-black mb-0.5 ${
                accent === 'yellow' ? 'text-brand-yellow'
                : accent === 'green'  ? 'text-green-400'
                : 'gradient-text-purple'
              }`}>
                {loading ? '—' : value}
              </div>
              <div className="text-brand-muted text-xs">{label}</div>
            </div>
          ))}
        </div>

        {/* ── Vista Citas ── */}
        {activeTab === 'citas' && (
          <div className="border border-white/8 bg-[#0F0F0F] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/8">
                    {['Nombre', 'Contacto', 'Fecha', 'Hora', 'Estado', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3.5 text-brand-muted text-xs font-semibold uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-20 text-brand-muted">
                        <div className="text-5xl mb-4">📅</div>
                        <div className="font-bold text-white mb-1 text-base">Sin citas aún</div>
                        <div className="text-sm">Las citas agendadas desde la calculadora aparecerán aquí</div>
                      </td>
                    </tr>
                  )}
                  {appointments.map(a => {
                    const apptDate = new Date(a.appointment_date + 'T12:00:00')
                    const dateStr  = apptDate.toLocaleDateString('es-MX', { weekday: 'short', day: '2-digit', month: 'short' })
                    const statusColors = {
                      pendiente:  'text-brand-yellow bg-brand-yellow/10 border-brand-yellow/30',
                      confirmada: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
                      completada: 'text-green-400 bg-green-400/10 border-green-400/30',
                      cancelada:  'text-gray-400 bg-gray-400/10 border-gray-400/30',
                    }
                    const statusLabels = { pendiente: 'Pendiente', confirmada: 'Confirmada', completada: 'Completada', cancelada: 'Cancelada' }
                    return (
                      <tr key={a.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <td className="px-4 py-3.5 font-semibold text-white">{a.name}</td>
                        <td className="px-4 py-3.5">
                          <div className="text-brand-muted text-xs space-y-0.5">
                            {a.email && <div>{a.email}</div>}
                            {a.phone && (
                              <div className="flex items-center gap-1.5">
                                {a.phone}
                                <a
                                  href={`https://wa.me/${a.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(a.name)}%2C%20te%20contactamos%20para%20confirmar%20tu%20cita`}
                                  target="_blank" rel="noopener noreferrer"
                                  className="text-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                  </svg>
                                </a>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-white font-medium whitespace-nowrap capitalize">{dateStr}</td>
                        <td className="px-4 py-3.5 text-brand-muted whitespace-nowrap">{a.appointment_time}</td>
                        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                          <select
                            value={a.status}
                            onChange={e => updateAppointmentStatus(a.id, e.target.value)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border bg-transparent cursor-pointer ${statusColors[a.status] || statusColors.pendiente}`}
                          >
                            {Object.entries(statusLabels).map(([v, l]) => (
                              <option key={v} value={v} className="bg-[#1A1A1A] text-white">{l}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => deleteAppointment(a.id, a.name)}
                            title="Eliminar"
                            className="p-1.5 rounded-lg text-brand-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Toolbar + tabla (solo para leads/calculadora) ── */}
        {activeTab !== 'citas' && <>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, correo o teléfono..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="input-dark pl-9 text-sm"
            />
          </div>

          {/* Refresh */}
          <button
            onClick={fetchLeads}
            title="Actualizar"
            className="border border-white/10 hover:border-white/20 text-brand-muted hover:text-white rounded-xl px-3 py-2.5 transition-all shrink-0"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Export */}
          <button
            onClick={exportCSV}
            className="btn-primary text-sm py-2.5 px-5 shrink-0"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Exportar CSV
          </button>
        </div>

        {/* ── Filtro por estado ── */}
        <div className="flex flex-wrap gap-2 mb-5">
          {['todos', ...STATUS_KEYS].map(s => {
            const count = s === 'todos' ? leads.length : leads.filter(l => l.status === s).length
            const active = statusFilter === s
            return (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1) }}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                  active
                    ? 'bg-brand-purple border-brand-purple text-white'
                    : 'border-white/10 text-brand-muted hover:text-white hover:border-white/20'
                }`}
              >
                {s === 'todos' ? 'Todos' : STATUS[s].label}
                <span className={`ml-1.5 ${active ? 'text-white/70' : 'text-white/30'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Tabla ── */}
        <div className="border border-white/8 bg-[#0F0F0F] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-white/8">
                  {COLS.map(({ key, label }) => (
                    <th
                      key={key}
                      onClick={() => toggleSort(key)}
                      className="text-left px-4 py-3.5 text-brand-muted text-xs font-semibold uppercase tracking-wider cursor-pointer select-none hover:text-white transition-colors whitespace-nowrap"
                    >
                      {label}
                      <SortIcon active={sortCol === key} dir={sortDir} />
                    </th>
                  ))}
                  <th className="px-4 py-3.5 w-24 text-brand-muted text-xs font-semibold uppercase tracking-wider text-right">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* ── Skeleton de carga ── */}
                {loading && Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div
                          className="h-3.5 bg-white/5 rounded-full animate-pulse"
                          style={{ width: `${50 + (j * 15 + i * 7) % 40}%` }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}

                {/* ── Sin resultados ── */}
                {!loading && paginated.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-brand-muted">
                      <div className="text-5xl mb-4">
                        {search || statusFilter !== 'todos' ? '🔍' : '📭'}
                      </div>
                      <div className="font-bold text-white mb-1 text-base">
                        {search || statusFilter !== 'todos' ? 'Sin resultados' : 'Aún no hay leads'}
                      </div>
                      <div className="text-sm">
                        {search || statusFilter !== 'todos'
                          ? 'Prueba ajustando la búsqueda o el filtro'
                          : 'Los contactos aparecerán aquí cuando alguien llene el formulario del landing'}
                      </div>
                    </td>
                  </tr>
                )}

                {/* ── Filas de leads ── */}
                {!loading && paginated.map(lead => (
                  <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">

                    {/* Nombre */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white leading-tight">{lead.name}</div>
                      {activeTab === 'calculadora' && (
                        <div className="text-brand-muted text-xs mt-0.5">
                          {lead.age} años → retiro a los {lead.retirement_age}
                        </div>
                      )}
                    </td>

                    {/* Correo */}
                    <td className="px-4 py-3.5">
                      {lead.email
                        ? <a href={`mailto:${lead.email}`} className="text-brand-lavender hover:text-white transition-colors" onClick={e => e.stopPropagation()}>{lead.email}</a>
                        : <span className="text-white/20 text-xs">—</span>
                      }
                    </td>

                    {/* Teléfono */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {lead.phone
                          ? <>
                              <a href={`tel:${lead.phone}`} className="text-brand-muted hover:text-white transition-colors" onClick={e => e.stopPropagation()}>{lead.phone}</a>
                              <a
                                href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(lead.name)}%2C%20te%20contactamos%20desde%20BBER`}
                                target="_blank" rel="noopener noreferrer" title="WhatsApp"
                                onClick={e => e.stopPropagation()}
                                className="text-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                              </a>
                            </>
                          : <span className="text-white/20 text-xs">—</span>
                        }
                      </div>
                    </td>

                    {/* Columnas extra: Calculadora */}
                    {activeTab === 'calculadora' && <>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          lead.discipline === 'high'   ? 'text-brand-yellow  bg-brand-yellow/10  border-brand-yellow/30'
                          : lead.discipline === 'medium' ? 'text-blue-400      bg-blue-400/10      border-blue-400/30'
                          :                               'text-brand-muted    bg-white/5          border-white/10'
                        }`}>
                          { lead.discipline === 'high'   ? '🎯 Comprometido'
                          : lead.discipline === 'medium' ? '📈 Con plan'
                          :                               '🌱 Empezando' }
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-white font-semibold text-sm whitespace-nowrap">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(lead.projected_capital)}
                      </td>
                      <td className="px-4 py-3.5 text-brand-muted text-sm whitespace-nowrap">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(lead.monthly_retirement_income)}
                      </td>
                    </>}

                    {/* Estado — dropdown custom */}
                    <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                      <div className="relative inline-block">
                        <button
                          onClick={() => setEditStatus(id => id === lead.id ? null : lead.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all hover:opacity-80 ${STATUS[lead.status || 'nuevo'].cls}`}
                        >
                          {STATUS[lead.status || 'nuevo'].label}
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 opacity-60">
                            <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z" />
                          </svg>
                        </button>

                        {editStatus === lead.id && (
                          <div className="absolute left-0 top-full mt-1 z-50 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl overflow-hidden min-w-[150px]">
                            {STATUS_KEYS.map(s => (
                              <button
                                key={s}
                                onClick={() => updateStatus(lead.id, s)}
                                className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors hover:bg-white/5 flex items-center gap-2 ${
                                  (lead.status || 'nuevo') === s ? 'text-white' : 'text-brand-muted'
                                }`}
                              >
                                <span className={`w-2 h-2 rounded-full ${
                                  s === 'nuevo'         ? 'bg-brand-yellow'
                                  : s === 'contactado'  ? 'bg-blue-400'
                                  : s === 'en_proceso'  ? 'bg-orange-400'
                                  : s === 'convertido'  ? 'bg-green-400'
                                  : 'bg-gray-400'
                                }`} />
                                {STATUS[s].label}
                                {(lead.status || 'nuevo') === s && (
                                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 ml-auto text-brand-purple">
                                    <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                                  </svg>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Fecha */}
                    <td className="px-4 py-3.5 text-brand-muted text-xs whitespace-nowrap">
                      {fmt(lead.created_at)}
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => deleteLead(lead.id, lead.name)}
                          disabled={deleting === lead.id}
                          title="Eliminar"
                          className="p-1.5 rounded-lg text-brand-muted hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-40"
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Paginación ── */}
          {totalPages > 1 && (
            <div className="border-t border-white/8 px-4 py-3 flex items-center justify-between gap-4">
              <span className="text-brand-muted text-xs">
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} · Página {page} de {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-xs px-3 py-1.5 border border-white/10 rounded-lg text-brand-muted hover:text-white hover:border-white/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ← Anterior
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="text-xs px-3 py-1.5 border border-white/10 rounded-lg text-brand-muted hover:text-white hover:border-white/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>
        </>}

        {/* ── Footer ── */}
        <p className="text-center text-brand-muted text-xs mt-8">
          BBER CRM · {new Date().getFullYear()}
        </p>

      </div>
    </div>
  )
}
