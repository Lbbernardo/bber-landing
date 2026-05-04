import React from 'react'

function BookMockupNavy({ title, subtitle }) {
  return (
    <div className="relative w-[140px] h-[185px] flex-shrink-0" style={{ perspective: '800px' }}>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[60%] h-4 rounded-full blur-lg"
        style={{ background: 'rgba(34,197,94,0.2)' }} />
      <div className="w-full h-full" style={{ transform: 'rotateY(-12deg) rotateX(2deg)', transformStyle: 'preserve-3d' }}>
        {/* Tapa */}
        <div
          className="absolute inset-0 rounded-r-lg rounded-l-sm overflow-hidden flex flex-col"
          style={{
            background:  'linear-gradient(160deg, #0F2E4A 0%, #0A1628 100%)',
            boxShadow:   '6px 10px 32px rgba(34,197,94,0.2), -2px 0 6px rgba(0,0,0,0.8)',
            border:      '1px solid rgba(34,197,94,0.15)',
          }}
        >
          {/* Barra de acento top */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#22C55E,#16A34A)' }} />

          {/* Contenido interior */}
          <div className="flex-1 p-3 flex flex-col justify-between">
            {/* Logo */}
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded flex items-center justify-center font-black text-black"
                style={{ background: '#22C55E', fontSize: '7px' }}>B</div>
              <span className="font-black text-white" style={{ fontSize: '9px' }}>BBER</span>
            </div>

            {/* Ícono central */}
            <div className="flex-1 flex items-center justify-center py-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.5" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  <circle cx="12" cy="12" r="10" stroke="#22C55E" strokeWidth="1" />
                </svg>
              </div>
            </div>

            {/* Título */}
            <div>
              <p className="font-black leading-tight text-white mb-0.5" style={{ fontSize: '9px' }}>
                {title}
              </p>
              {subtitle && (
                <p style={{ fontSize: '7px', color: '#4ADE80', letterSpacing: '0.05em' }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Lomo */}
        <div className="absolute left-0 top-0 h-full w-2.5 rounded-l-sm"
          style={{
            background:  'linear-gradient(180deg,#22C55E,#0F7B3A)',
            transform:   'translateZ(-3px) translateX(-2.5px)',
            boxShadow:   '-2px 0 6px rgba(0,0,0,0.8)',
          }} />
      </div>
    </div>
  )
}

export default function GuideCard({ guide, onDownload }) {
  return (
    <div
      className="card card-hover flex flex-col sm:flex-row gap-6 p-6 cursor-pointer group"
      onClick={onDownload}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onDownload() }}
      aria-label={`Descargar guía: ${guide.title}`}
    >
      {/* Mockup del libro */}
      <div className="flex justify-center sm:justify-start">
        <BookMockupNavy title={guide.title} subtitle={guide.subtitle} />
      </div>

      {/* Contenido */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="badge-green">Gratis</span>
            {guide.pages && (
              <span className="badge-navy">{guide.pages} páginas</span>
            )}
          </div>

          <h3 className="text-lg font-black text-white leading-tight mb-2 group-hover:text-green-400 transition-colors">
            {guide.title}
          </h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#94A3B8' }}>
            {guide.description}
          </p>

          {/* Topics */}
          {guide.topics && (
            <ul className="space-y-1 mb-4">
              {guide.topics.map((t, i) => (
                <li key={i} className="flex items-center gap-2 text-xs" style={{ color: '#CBD5E1' }}>
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#22C55E' }} />
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className="btn-primary text-sm self-start"
          onClick={e => { e.stopPropagation(); onDownload() }}
          aria-label={`Descargar ${guide.title}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Descargar gratis
        </button>
      </div>
    </div>
  )
}
