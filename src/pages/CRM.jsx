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
  const [leads, setLeads]             = useState([])
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
    if (user) fetchLeads()
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

  async function updateStatus(id, status) {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    setEditStatus(null)
    await supabase.from('leads').update({ status }).eq('id', id)
  }

  async function deleteLead(id, name) {
    if (!window.confirm(`¿Eliminar a "${name}"? Esta acción no se puede deshacer.`)) return
    setDeleting(id)
    setLeads(prev => prev.filter(l => l.id !== id))
    await supabase.from('leads').delete().eq('id', id)
    setDeleting(null)
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  function exportCSV() {
    const header = ['Nombre', 'Correo', 'Teléfono', 'Estado', 'Fecha'].join(',')
    const body = filtered.map(r => [
      `"${r.name}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${STATUS[r.status]?.label || r.status}"`,
      `"${fmt(r.created_at)}"`,
    ].join(',')).join('\n')
    const blob = new Blob([header + '\n' + body], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-bber-${new Date().toISOString().slice(0,10)}.csv`
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

  /* ── Datos filtrados y ordenados ── */
  const filtered = useMemo(() => {
    let data = leads
    if (statusFilter !== 'todos') data = data.filter(l => l.status === statusFilter)
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
  }, [leads, statusFilter, search, sortCol, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  /* ── Estadísticas ── */
  const stats = useMemo(() => {
    const now       = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart  = new Date(todayStart); weekStart.setDate(weekStart.getDate() - 6)
    return {
      total:     leads.length,
      today:     leads.filter(l => new Date(l.created_at) >= todayStart).length,
      week:      leads.filter(l => new Date(l.created_at) >= weekStart).length,
      converted: leads.filter(l => l.status === 'convertido').length,
    }
  }, [leads])

  if (!user) return null

  const COLS = [
    { key: 'name',       label: 'Nombre' },
    { key: 'email',      label: 'Correo' },
    { key: 'phone',      label: 'Teléfono' },
    { key: 'status',     label: 'Estado' },
    { key: 'created_at', label: 'Registro' },
  ]

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
        <div className="mb-7">
          <h1 className="text-2xl font-black text-white">Panel de Leads</h1>
          <p className="text-brand-muted text-sm mt-1">Gestiona las personas que completaron el formulario</p>
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

        {/* ── Toolbar ── */}
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
                    </td>

                    {/* Correo */}
                    <td className="px-4 py-3.5">
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-brand-lavender hover:text-white transition-colors"
                        onClick={e => e.stopPropagation()}
                      >
                        {lead.email}
                      </a>
                    </td>

                    {/* Teléfono */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${lead.phone}`}
                          className="text-brand-muted hover:text-white transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          {lead.phone}
                        </a>
                        <a
                          href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(lead.name)}%2C%20te%20contactamos%20desde%20BBER`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp"
                          onClick={e => e.stopPropagation()}
                          className="text-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </a>
                      </div>
                    </td>

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
                                  lead.status === s ? 'text-white' : 'text-brand-muted'
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
                                {lead.status === s && (
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

        {/* ── Footer ── */}
        <p className="text-center text-brand-muted text-xs mt-8">
          BBER CRM · {new Date().getFullYear()}
        </p>

      </div>
    </div>
  )
}
