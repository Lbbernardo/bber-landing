import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// ─── Constants ────────────────────────────────────────────────────────────────

const SCRIPT_TYPES = [
  { value: 'agendamiento', label: 'Agendamiento', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
  { value: 'cierre',       label: 'Cierre',       color: 'text-green-400  bg-green-400/10  border-green-400/30' },
  { value: 'objeciones',   label: 'Objeciones',   color: 'text-red-400    bg-red-400/10    border-red-400/30'   },
  { value: 'seguimiento',  label: 'Seguimiento',  color: 'text-blue-400   bg-blue-400/10   border-blue-400/30'  },
  { value: 'otro',         label: 'Otro',         color: 'text-gray-400   bg-gray-400/10   border-gray-400/30'  },
]

const COMPANIES = ['Transamerica', 'North American', 'Nationwide', 'Athene', 'Pacific Life', 'Global Atlantic', 'Otro']
const PRODUCT_TYPES = ['IUL', 'Term Life', 'Whole Life', 'Annuity', 'Otro']

const KNOWLEDGE_CATEGORIES = [
  { value: 'regulacion',    label: 'Regulación',    color: 'text-orange-400 bg-orange-400/10 border-orange-400/30' },
  { value: 'compliance',    label: 'Compliance',    color: 'text-blue-400   bg-blue-400/10   border-blue-400/30'   },
  { value: 'entrenamiento', label: 'Entrenamiento', color: 'text-orange-400 bg-orange-400/10 border-orange-400/30' },
  { value: 'mercado',       label: 'Mercado',       color: 'text-green-400  bg-green-400/10  border-green-400/30'  },
  { value: 'objeciones',    label: 'Objeciones',    color: 'text-red-400    bg-red-400/10    border-red-400/30'    },
  { value: 'otro',          label: 'Otro',          color: 'text-gray-400   bg-gray-400/10   border-gray-400/30'   },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n ?? 0)

const scriptTypeInfo = (value) =>
  SCRIPT_TYPES.find((t) => t.value === value) ?? SCRIPT_TYPES[SCRIPT_TYPES.length - 1]

const knowledgeCategoryInfo = (value) =>
  KNOWLEDGE_CATEGORIES.find((c) => c.value === value) ?? KNOWLEDGE_CATEGORIES[KNOWLEDGE_CATEGORIES.length - 1]

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
)

const IconDownload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
)

const IconSend = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

const IconArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
)

const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

const IconDocument = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

// ─── Shared style strings ─────────────────────────────────────────────────────

const inputCls =
  'w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 text-[#2d2b28] placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-[#c96442] focus:border-transparent transition-all'

const selectCls =
  'w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 text-[#2d2b28] focus:outline-none focus:ring-2 focus:ring-[#c96442] focus:border-transparent transition-all appearance-none'

// ─── TabGuiones ───────────────────────────────────────────────────────────────

function TabGuiones() {
  const [scripts, setScripts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [form, setForm] = useState({ name: '', type: 'agendamiento', content: '' })
  const [saving, setSaving] = useState(false)

  const fetchScripts = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('scripts').select('*').order('created_at', { ascending: false })
    setScripts(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchScripts() }, [fetchScripts])

  const openNew = () => {
    setEditingId(null)
    setForm({ name: '', type: 'agendamiento', content: '' })
    setShowForm(true)
  }

  const openEdit = (s) => {
    setEditingId(s.id)
    setForm({ name: s.name, type: s.type, content: s.content })
    setShowForm(true)
  }

  const cancel = () => { setShowForm(false); setEditingId(null) }

  const save = async () => {
    if (!form.name.trim() || !form.content.trim()) return
    setSaving(true)
    if (editingId) {
      await supabase.from('scripts').update({ name: form.name, type: form.type, content: form.content }).eq('id', editingId)
    } else {
      await supabase.from('scripts').insert({ name: form.name, type: form.type, content: form.content })
    }
    setSaving(false)
    setShowForm(false)
    setEditingId(null)
    fetchScripts()
  }

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar este guión?')) return
    await supabase.from('scripts').delete().eq('id', id)
    fetchScripts()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-[#2d2b28]">Guiones de Venta</h2>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(0,0,0,0.45)' }}>
            {scripts.length} guión{scripts.length !== 1 ? 'es' : ''}
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#2d2b28] transition-all"
          style={{ background: '#c96442' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#a85030')}
          onMouseLeave={e => (e.currentTarget.style.background = '#c96442')}
        >
          <IconPlus /> Nuevo Guión
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="shrink-0 rounded-2xl border p-5 mb-5" style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.1)' }}>
          <h3 className="text-base font-semibold text-[#2d2b28] mb-4">{editingId ? 'Editar Guión' : 'Nuevo Guión'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(0,0,0,0.5)' }}>Nombre</label>
              <input
                className={inputCls}
                placeholder="Nombre del guión"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(0,0,0,0.5)' }}>Tipo</label>
              <select className={selectCls} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {SCRIPT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(0,0,0,0.5)' }}>Contenido del Guión</label>
            <textarea
              className={inputCls + ' resize-none'}
              rows={8}
              placeholder="Escribe el guión aquí..."
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#2d2b28] transition-all disabled:opacity-50"
              style={{ background: '#c96442' }}
              onMouseEnter={e => !saving && (e.currentTarget.style.background = '#a85030')}
              onMouseLeave={e => (e.currentTarget.style.background = '#c96442')}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              onClick={cancel}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ color: 'rgba(0,0,0,0.6)', background: 'rgba(255,255,255,0.05)' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#c96442] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : scripts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4" style={{ color: 'rgba(0,0,0,0.25)' }}>
            <IconDocument />
            <p className="text-sm">No hay guiones. Crea uno nuevo.</p>
          </div>
        ) : (
          scripts.map(s => {
            const typeInfo = scriptTypeInfo(s.type)
            return (
              <div
                key={s.id}
                className="relative rounded-2xl border p-5 transition-all cursor-default"
                style={{
                  background: '#ffffff',
                  borderColor: hoveredId === s.id ? 'rgba(234,88,12,0.4)' : 'rgba(255,255,255,0.08)',
                }}
                onMouseEnter={() => setHoveredId(s.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-semibold text-[#2d2b28] text-sm truncate">{s.name}</span>
                      <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'rgba(0,0,0,0.45)' }}>
                      {s.content}
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-2 transition-opacity shrink-0"
                    style={{ opacity: hoveredId === s.id ? 1 : 0 }}
                  >
                    <button
                      onClick={() => openEdit(s)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: 'rgba(0,0,0,0.5)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent' }}
                    >
                      <IconEdit />
                    </button>
                    <button
                      onClick={() => remove(s.id)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: 'rgba(0,0,0,0.5)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent' }}
                    >
                      <IconTrash />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// ─── TabProductos ─────────────────────────────────────────────────────────────

function TabProductos() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', company: COMPANIES[0], type: PRODUCT_TYPES[0], notes: '' })
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const cancel = () => {
    setShowForm(false)
    setForm({ name: '', company: COMPANIES[0], type: PRODUCT_TYPES[0], notes: '' })
    setFile(null)
  }

  const save = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    let file_url = null
    if (file) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}.${ext}`
      const { data: uploadData } = await supabase.storage.from('products').upload(path, file)
      if (uploadData) {
        const { data: urlData } = supabase.storage.from('products').getPublicUrl(path)
        file_url = urlData?.publicUrl ?? null
      }
    }
    await supabase.from('products').insert({ name: form.name, company: form.company, type: form.type, notes: form.notes, file_url })
    setSaving(false)
    cancel()
    fetchProducts()
  }

  const remove = async (p) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    await supabase.from('products').delete().eq('id', p.id)
    fetchProducts()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-[#2d2b28]">Productos</h2>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(0,0,0,0.45)' }}>
            {products.length} producto{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#2d2b28] transition-all"
          style={{ background: '#c96442' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#a85030')}
          onMouseLeave={e => (e.currentTarget.style.background = '#c96442')}
        >
          <IconPlus /> Agregar Producto
        </button>
      </div>

      {showForm && (
        <div className="shrink-0 rounded-2xl border p-5 mb-5" style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.1)' }}>
          <h3 className="text-base font-semibold text-[#2d2b28] mb-4">Nuevo Producto</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(0,0,0,0.5)' }}>Nombre</label>
              <input className={inputCls} placeholder="Nombre del producto" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(0,0,0,0.5)' }}>Compañía</label>
              <select className={selectCls} value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}>
                {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(0,0,0,0.5)' }}>Tipo</label>
              <select className={selectCls} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(0,0,0,0.5)' }}>Notas</label>
            <textarea
              className={inputCls + ' resize-none'}
              rows={4}
              placeholder="Descripción, beneficios, detalles..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>
          <div className="mb-5">
            <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(0,0,0,0.5)' }}>Archivo (PDF, Word, TXT)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={e => setFile(e.target.files[0])}
              className="w-full text-sm text-[#2d2b28]/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#c96442] file:text-[#2d2b28] hover:file:bg-[#a85030] file:cursor-pointer cursor-pointer"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#2d2b28] transition-all disabled:opacity-50"
              style={{ background: '#c96442' }}
              onMouseEnter={e => !saving && (e.currentTarget.style.background = '#a85030')}
              onMouseLeave={e => (e.currentTarget.style.background = '#c96442')}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              onClick={cancel}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ color: 'rgba(0,0,0,0.6)', background: 'rgba(255,255,255,0.05)' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#c96442] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4" style={{ color: 'rgba(0,0,0,0.25)' }}>
            <IconDocument />
            <p className="text-sm">No hay productos. Agrega uno.</p>
          </div>
        ) : (
          products.map(p => (
            <div
              key={p.id}
              className="group rounded-2xl border p-5 transition-all"
              style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.1)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(234,88,12,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-semibold text-[#2d2b28] text-sm">{p.name}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full border text-[#d4795a] bg-orange-400/10 border-orange-400/30">
                      {p.company}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full border text-gray-400 bg-gray-400/10 border-gray-400/30">
                      {p.type}
                    </span>
                  </div>
                  {p.notes && (
                    <p className="text-sm leading-relaxed line-clamp-2 mb-2" style={{ color: 'rgba(0,0,0,0.45)' }}>{p.notes}</p>
                  )}
                  {p.file_url && (
                    <a
                      href={p.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
                      style={{ color: '#d4795a' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#c96442')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#d4795a')}
                    >
                      <IconDownload /> Descargar archivo
                    </a>
                  )}
                </div>
                <button
                  onClick={() => remove(p)}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all"
                  style={{ color: 'rgba(0,0,0,0.5)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent' }}
                >
                  <IconTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ─── TabConocimiento ──────────────────────────────────────────────────────────

function TabConocimiento() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'regulacion', description: '', content: '' })
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('knowledge').select('*').order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const cancel = () => {
    setShowForm(false)
    setForm({ name: '', category: 'regulacion', description: '', content: '' })
    setFile(null)
  }

  const save = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    let file_url = null
    if (file) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}.${ext}`
      const { data: uploadData } = await supabase.storage.from('knowledge').upload(path, file)
      if (uploadData) {
        const { data: urlData } = supabase.storage.from('knowledge').getPublicUrl(path)
        file_url = urlData?.publicUrl ?? null
      }
    }
    await supabase.from('knowledge').insert({
      name: form.name,
      category: form.category,
      description: form.description,
      content: form.content,
      file_url,
    })
    setSaving(false)
    cancel()
    fetchItems()
  }

  const remove = async (item) => {
    if (!window.confirm('¿Eliminar este documento?')) return
    await supabase.from('knowledge').delete().eq('id', item.id)
    fetchItems()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-[#2d2b28]">Base de Conocimiento</h2>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(0,0,0,0.45)' }}>
            {items.length} documento{items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#2d2b28] transition-all"
          style={{ background: '#c96442' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#a85030')}
          onMouseLeave={e => (e.currentTarget.style.background = '#c96442')}
        >
          <IconPlus /> Agregar documento
        </button>
      </div>

      {showForm && (
        <div className="shrink-0 rounded-2xl border p-5 mb-5" style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.1)' }}>
          <h3 className="text-base font-semibold text-[#2d2b28] mb-4">Nuevo Documento</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(0,0,0,0.5)' }}>Nombre</label>
              <input className={inputCls} placeholder="Nombre del documento" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(0,0,0,0.5)' }}>Categoría</label>
              <select className={selectCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {KNOWLEDGE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(0,0,0,0.5)' }}>Descripción</label>
            <input
              className={inputCls}
              placeholder="Descripción breve..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(0,0,0,0.5)' }}>Contenido</label>
            <textarea
              className={inputCls + ' resize-none'}
              rows={6}
              placeholder="Contenido del documento..."
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            />
          </div>
          <div className="mb-5">
            <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(0,0,0,0.5)' }}>Archivo (PDF, Word, TXT)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={e => setFile(e.target.files[0])}
              className="w-full text-sm text-[#2d2b28]/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#c96442] file:text-[#2d2b28] hover:file:bg-[#a85030] file:cursor-pointer cursor-pointer"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#2d2b28] transition-all disabled:opacity-50"
              style={{ background: '#c96442' }}
              onMouseEnter={e => !saving && (e.currentTarget.style.background = '#a85030')}
              onMouseLeave={e => (e.currentTarget.style.background = '#c96442')}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              onClick={cancel}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ color: 'rgba(0,0,0,0.6)', background: 'rgba(255,255,255,0.05)' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#c96442] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4" style={{ color: 'rgba(0,0,0,0.25)' }}>
            <IconDocument />
            <p className="text-sm">No hay documentos. Agrega uno.</p>
          </div>
        ) : (
          items.map(item => {
            const catInfo = knowledgeCategoryInfo(item.category)
            return (
              <div
                key={item.id}
                className="group rounded-2xl border p-5 transition-all"
                style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.1)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(234,88,12,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-semibold text-[#2d2b28] text-sm">{item.name}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${catInfo.color}`}>
                        {catInfo.label}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs mb-2" style={{ color: 'rgba(0,0,0,0.5)' }}>{item.description}</p>
                    )}
                    {item.content && (
                      <p className="text-sm leading-relaxed line-clamp-2 mb-2" style={{ color: 'rgba(0,0,0,0.4)' }}>{item.content}</p>
                    )}
                    {item.file_url && (
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
                        style={{ color: '#d4795a' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#c96442')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#d4795a')}
                      >
                        <IconDownload /> Descargar archivo
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => remove(item)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all"
                    style={{ color: 'rgba(0,0,0,0.5)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent' }}
                  >
                    <IconTrash />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// ─── TabAgente ────────────────────────────────────────────────────────────────

function TabAgente() {
  const [leads, setLeads] = useState([])
  const [scripts, setScripts] = useState([])
  const [products, setProducts] = useState([])
  const [knowledge, setKnowledge] = useState([])
  const [sessions, setSessions] = useState([])

  const [selectedLeadId, setSelectedLeadId] = useState('')
  const [selectedScriptId, setSelectedScriptId] = useState('')
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [finishing, setFinishing] = useState(false)

  const messagesEndRef = useRef(null)
  const sessionIdRef = useRef(null)

  const selectedLead = leads.find(l => String(l.id) === selectedLeadId) ?? null
  const selectedScript = scripts.find(s => String(s.id) === selectedScriptId) ?? null

  // Keep ref in sync
  useEffect(() => { sessionIdRef.current = sessionId }, [sessionId])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Initial data load
  useEffect(() => {
    const fetchAll = async () => {
      const [leadsRes, retirementRes, scriptsRes, productsRes, knowledgeRes] = await Promise.all([
        supabase.from('leads').select('id, name, phone, email, age, projected_capital, gap').order('name'),
        supabase.from('retirement_leads').select('id, name, phone, email, age, projected_capital, gap').order('name'),
        supabase.from('scripts').select('*').order('name'),
        supabase.from('products').select('*'),
        supabase.from('knowledge').select('*'),
      ])
      const combined = [
        ...(leadsRes.data ?? []).map(l => ({ ...l, _source: 'leads' })),
        ...(retirementRes.data ?? []).map(l => ({ ...l, _source: 'retirement_leads', id: `r_${l.id}` })),
      ].sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
      setLeads(combined)
      setScripts(scriptsRes.data ?? [])
      setProducts(productsRes.data ?? [])
      setKnowledge(knowledgeRes.data ?? [])
    }
    fetchAll()
  }, [])

  // Fetch sessions when lead changes
  useEffect(() => {
    if (!selectedLeadId) { setSessions([]); return }
    const fetchSessions = async () => {
      const { data } = await supabase
        .from('agent_sessions')
        .select('*')
        .eq('lead_id', selectedLeadId)
        .order('created_at', { ascending: false })
      setSessions(data ?? [])
    }
    fetchSessions()
    setMessages([])
    setSessionId(null)
    sessionIdRef.current = null
  }, [selectedLeadId])

  const persistSession = useCallback(async (msgs, lastAgentMsg, leadId, scriptId) => {
    if (!leadId) return
    const summary = lastAgentMsg?.next_step || lastAgentMsg?.script_line || ''
    const payload = {
      lead_id: leadId,
      script_id: scriptId || null,
      messages: msgs,
      summary,
      updated_at: new Date().toISOString(),
    }
    const currentId = sessionIdRef.current
    if (currentId) {
      await supabase.from('agent_sessions').update(payload).eq('id', currentId)
    } else {
      const { data } = await supabase
        .from('agent_sessions')
        .insert({ ...payload, created_at: new Date().toISOString() })
        .select()
        .single()
      if (data?.id) {
        setSessionId(data.id)
        sessionIdRef.current = data.id
      }
    }
  }, [])

  const sendMessage = async () => {
    const text = inputText.trim()
    if (!text || isTyping) return
    setInputText('')

    const userMsg = { role: 'user', text, id: Date.now() }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setIsTyping(true)

    try {
      const { data, error } = await supabase.functions.invoke('sales-agent', {
        body: {
          clientData: selectedLead,
          activeScript: selectedScript,
          products,
          knowledge,
          messages: messages.map(m => ({ role: m.role, text: m.text })),
          userMessage: text,
        },
      })

      if (error) throw error

      const agentMsg = {
        role: 'agent',
        id: Date.now() + 1,
        script_line: data?.script_line ?? null,
        objection_handling: data?.objection_handling ?? null,
        product_recommendation: data?.product_recommendation ?? null,
        illustration: data?.illustration ?? null,
        next_step: data?.next_step ?? null,
      }

      const finalMessages = [...nextMessages, agentMsg]
      setMessages(finalMessages)
      await persistSession(finalMessages, agentMsg, selectedLeadId, selectedScriptId)
    } catch (err) {
      console.error('Agent error:', err)
      const errMsg = {
        role: 'agent',
        id: Date.now() + 1,
        script_line: 'Hubo un error al procesar tu mensaje. Por favor intenta de nuevo.',
      }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const finishSession = async () => {
    if (!messages.length) return
    setFinishing(true)
    const lastAgent = [...messages].reverse().find(m => m.role === 'agent')
    await persistSession(messages, lastAgent, selectedLeadId, selectedScriptId)
    setFinishing(false)
    setMessages([])
    setSessionId(null)
    sessionIdRef.current = null
    const { data } = await supabase
      .from('agent_sessions')
      .select('*')
      .eq('lead_id', selectedLeadId)
      .order('created_at', { ascending: false })
    setSessions(data ?? [])
    alert('Sesión finalizada y guardada correctamente.')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="flex h-full gap-0 min-h-0">
      {/* ── LEFT SIDEBAR ─────────────────────────────────────────── */}
      <div
        className="w-72 shrink-0 flex flex-col gap-5 pr-5 border-r overflow-y-auto"
        style={{ borderColor: 'rgba(0,0,0,0.1)' }}
      >
        {/* Client selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(0,0,0,0.45)' }}>
            Cliente
          </label>
          <select
            className={selectCls + ' text-sm'}
            value={selectedLeadId}
            onChange={e => setSelectedLeadId(e.target.value)}
          >
            <option value="">Seleccionar cliente...</option>
            {leads.map(l => (
              <option key={l.id} value={String(l.id)}>{l.name}</option>
            ))}
          </select>
        </div>

        {/* Client card */}
        {selectedLead && (
          <div className="rounded-xl border p-4" style={{ background: '#ffffff', borderColor: 'rgba(234,88,12,0.3)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#2d2b28] font-bold text-sm shrink-0"
                style={{ background: '#c96442' }}
              >
                {(selectedLead.name ?? 'C')[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[#2d2b28] text-sm truncate">{selectedLead.name}</p>
                {selectedLead.age && (
                  <p className="text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>{selectedLead.age} años</p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              {selectedLead.phone && (
                <p className="text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>📞 {selectedLead.phone}</p>
              )}
              {selectedLead.email && (
                <p className="text-xs truncate" style={{ color: 'rgba(0,0,0,0.5)' }}>✉️ {selectedLead.email}</p>
              )}
              {selectedLead.projected_capital != null && (
                <p className="text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>
                  💰 Capital: <span style={{ color: '#d4795a' }} className="font-medium">{fmt(selectedLead.projected_capital)}</span>
                </p>
              )}
              {selectedLead.gap != null && (
                <p className="text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>
                  ⚡ Gap: <span className="text-red-400 font-medium">{fmt(selectedLead.gap)}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Script selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(0,0,0,0.45)' }}>
            Guión activo
          </label>
          <select
            className={selectCls + ' text-sm'}
            value={selectedScriptId}
            onChange={e => setSelectedScriptId(e.target.value)}
          >
            <option value="">Sin guión</option>
            {scripts.map(s => (
              <option key={s.id} value={String(s.id)}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Script preview */}
        {selectedScript && (
          <div className="rounded-xl border p-4" style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.1)' }}>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-sm font-medium text-[#2d2b28]">{selectedScript.name}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${scriptTypeInfo(selectedScript.type).color}`}>
                {scriptTypeInfo(selectedScript.type).label}
              </span>
            </div>
            <p className="text-xs leading-relaxed line-clamp-3" style={{ color: 'rgba(0,0,0,0.45)' }}>
              {selectedScript.content}
            </p>
          </div>
        )}

        {/* Past sessions */}
        {sessions.length > 0 && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(0,0,0,0.45)' }}>
              Sesiones anteriores
            </label>
            <div className="space-y-2">
              {sessions.map(s => (
                <div key={s.id} className="rounded-lg border p-3" style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.08)' }}>
                  <p className="text-xs font-medium mb-1" style={{ color: 'rgba(0,0,0,0.7)' }}>{formatDate(s.created_at)}</p>
                  {s.summary && (
                    <p className="text-xs line-clamp-2" style={{ color: 'rgba(0,0,0,0.4)' }}>{s.summary}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT MAIN ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 pl-5">
        {/* Chat header */}
        <div className="shrink-0 flex items-center gap-3 mb-4 pb-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: 'rgba(234,88,12,0.15)', border: '1px solid rgba(234,88,12,0.3)' }}
          >
            🤖
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#2d2b28] text-sm">Agente de Ventas BBER</p>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedLead ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
                  <span className="text-xs text-green-400">En sesión</span>
                  <span className="text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>— {selectedLead.name}</span>
                </>
              ) : (
                <span className="text-xs" style={{ color: 'rgba(0,0,0,0.35)' }}>
                  Selecciona un cliente para comenzar
                </span>
              )}
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={finishSession}
              disabled={finishing}
              className="shrink-0 px-4 py-2 rounded-xl text-sm font-medium border transition-all disabled:opacity-50"
              style={{ borderColor: 'rgba(234,88,12,0.5)', color: '#d4795a', background: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(234,88,12,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {finishing ? 'Guardando...' : 'Finalizar sesión'}
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 min-h-0">
          {messages.length === 0 && !isTyping ? (
            <div className="flex flex-col items-center justify-center h-full gap-4" style={{ color: 'rgba(0,0,0,0.25)' }}>
              <div className="text-5xl">🤖</div>
              <p className="text-sm text-center max-w-xs">
                Selecciona un cliente y cuéntame lo que está diciendo
              </p>
            </div>
          ) : (
            <>
              {messages.map(msg => {
                if (msg.role === 'user') {
                  return (
                    <div key={msg.id} className="flex justify-end">
                      <div className="max-w-[75%]">
                        <p className="text-xs text-right mb-1 font-medium" style={{ color: 'rgba(0,0,0,0.45)' }}>Tú</p>
                        <div
                          className="rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-[#2d2b28] leading-relaxed"
                          style={{ background: '#c96442' }}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  )
                }

                // Agent message — structured sections
                const sections = [
                  {
                    key: 'script_line',
                    icon: '📜',
                    label: 'Di esto ahora',
                    borderColor: '#c96442',
                    bg: '#fff5f0',
                    labelColor: '#c96442',
                    text: msg.script_line,
                  },
                  {
                    key: 'objection_handling',
                    icon: '⚡',
                    label: 'Manejo la objeción',
                    borderColor: '#d97706',
                    bg: '#fffbeb',
                    labelColor: '#b45309',
                    text: msg.objection_handling,
                  },
                  {
                    key: 'product_recommendation',
                    icon: '🛡',
                    label: 'Producto recomendado',
                    borderColor: '#16a34a',
                    bg: '#f0fdf4',
                    labelColor: '#15803d',
                    text: msg.product_recommendation,
                  },
                  {
                    key: 'illustration',
                    icon: '📊',
                    label: 'Estructura de ilustración',
                    borderColor: '#2563eb',
                    bg: '#eff6ff',
                    labelColor: '#1d4ed8',
                    text: msg.illustration,
                  },
                  {
                    key: 'next_step',
                    icon: '➤',
                    label: 'Siguiente paso',
                    borderColor: '#7c3aed',
                    bg: '#faf5ff',
                    labelColor: '#6d28d9',
                    text: msg.next_step,
                  },
                ].filter(s => s.text)

                return (
                  <div key={msg.id} className="flex justify-start">
                    <div className="max-w-[85%]">
                      <p className="text-xs mb-1 font-medium" style={{ color: 'rgba(0,0,0,0.45)' }}>Agente BBER</p>
                      <div
                        className="rounded-2xl rounded-tl-sm border p-4 space-y-3"
                        style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.12)' }}
                      >
                        {sections.length === 0 ? (
                          <p className="text-sm" style={{ color: 'rgba(0,0,0,0.6)' }}>...</p>
                        ) : (
                          sections.map(sec => (
                            <div
                              key={sec.key}
                              className="pl-4 border-l-4 rounded-r-lg p-3"
                              style={{ borderColor: sec.borderColor, background: sec.bg }}
                            >
                              <p className="text-xs font-semibold mb-1" style={{ color: sec.borderColor }}>
                                {sec.icon} {sec.label}
                              </p>
                              <p className="text-sm leading-relaxed" style={{ color: '#2d2b28' }}>
                                {sec.text}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div
                    className="rounded-2xl rounded-tl-sm border px-5 py-4"
                    style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.12)' }}
                  >
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map(i => (
                        <span
                          key={i}
                          className="w-2 h-2 rounded-full inline-block animate-bounce"
                          style={{ background: '#c96442', animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input area */}
        <div className="shrink-0 border-t pt-4" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
          <div className="flex gap-3 items-end">
            <textarea
              className={inputCls + ' resize-none flex-1'}
              rows={3}
              placeholder="Describe lo que el cliente está diciendo... (Ctrl+Enter para enviar)"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!selectedLead}
            />
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || isTyping || !selectedLead}
              className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-[#2d2b28] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#c96442' }}
              onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.background = '#a85030')}
              onMouseLeave={e => (e.currentTarget.style.background = '#c96442')}
            >
              <IconSend />
            </button>
          </div>
          <p className="text-xs mt-2" style={{ color: 'rgba(0,0,0,0.25)' }}>
            Ctrl+Enter para enviar · El agente usará el guión y contexto del cliente seleccionado
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Sidebar tab config ───────────────────────────────────────────────────────

const TABS = [
  {
    key: 'guiones',
    label: 'Guiones',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    key: 'productos',
    label: 'Productos',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    key: 'conocimiento',
    label: 'Conocimiento',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    key: 'agente',
    label: 'Agente',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
]

// ─── Main export ──────────────────────────────────────────────────────────────

export default function Agente() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('agente')
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) navigate('/admin')
      else setAuthChecked(true)
    })
  }, [navigate])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0ede8' }}>
        <div className="w-10 h-10 border-2 border-[#c96442] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'guiones':      return <TabGuiones />
      case 'productos':    return <TabProductos />
      case 'conocimiento': return <TabConocimiento />
      case 'agente':       return <TabAgente />
      default:             return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f0ede8' }}>
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header
        className="shrink-0 border-b px-6 py-4 flex items-center justify-between"
        style={{ background: '#e8e4de', borderColor: 'rgba(0,0,0,0.1)' }}
      >
        <div className="flex items-center gap-4">
          {/* BBER logo */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-[#2d2b28] text-base shrink-0 select-none"
            style={{ background: '#c96442' }}
          >
            B
          </div>
          <div>
            <p className="font-bold text-[#2d2b28] text-sm leading-none">BBER</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.45)' }}>Agente de Ventas</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/crm')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all"
            style={{ borderColor: 'rgba(0,0,0,0.12)', color: 'rgba(0,0,0,0.6)', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
          >
            <IconArrowLeft /> CRM
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all"
            style={{ borderColor: 'rgba(0,0,0,0.12)', color: 'rgba(0,0,0,0.6)', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
          >
            <IconLogout /> Salir
          </button>
        </div>
      </header>

      {/* ── BODY ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">
        {/* Left sidebar navigation */}
        <nav
          className="w-16 sm:w-56 shrink-0 border-r flex flex-col py-4 gap-1 px-2"
          style={{ background: '#e8e4de', borderColor: 'rgba(0,0,0,0.1)' }}
        >
          {TABS.map(tab => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all text-left w-full"
                style={
                  isActive
                    ? { background: '#c96442', color: '#fff' }
                    : { background: 'transparent', color: 'rgba(0,0,0,0.5)' }
                }
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.color = '#fff'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                  }
                }}
              >
                <span className="shrink-0">{tab.icon}</span>
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-hidden">
          <div className="h-full p-6 flex flex-col overflow-hidden">
            {renderTab()}
          </div>
        </main>
      </div>
    </div>
  )
}
