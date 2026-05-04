/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#07111F',   /* fondo más profundo */
          900: '#0D1F3C',   /* fondo base — azul oscuro visible */
          800: '#132847',   /* surfaces */
          700: '#1B3A6B',   /* cards — azul rico como en la imagen */
          600: '#234A8A',   /* elementos elevados */
          500: '#2D5CA8',   /* borders activos */
          400: '#4472C4',   /* muted elements */
          border: '#1E3A6B',
        },
        green: {
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        orange: {
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
        },
        brand: {
          bg:        '#0D1F3C',
          surface:   '#132847',
          card:      '#1B3A6B',
          elevated:  '#234A8A',
          border:    '#1E3A6B',
          green:     '#22C55E',
          greenHover:'#16A34A',
          orange:    '#F97316',
          muted:     '#94A3B8',
          subtle:    '#64748B',
        },
      },
      fontFamily: {
        sans:     ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        heading:  ['Montserrat', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono:     ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs':   ['0.75rem',  { lineHeight: '1rem' }],
        'sm':   ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem',     { lineHeight: '1.5rem' }],
        'md':   ['1.125rem', { lineHeight: '1.75rem' }],
        'lg':   ['1.25rem',  { lineHeight: '1.75rem' }],
        'xl':   ['1.5rem',   { lineHeight: '2rem' }],
        '2xl':  ['1.875rem', { lineHeight: '2.25rem' }],
        '3xl':  ['2.25rem',  { lineHeight: '2.5rem' }],
        '4xl':  ['3rem',     { lineHeight: '1.1' }],
        '5xl':  ['3.75rem',  { lineHeight: '1' }],
        '6xl':  ['4.5rem',   { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem', '22': '5.5rem', '30': '7.5rem',
        '34': '8.5rem', '72': '18rem',  '84': '21rem',
        '96': '24rem',  '112': '28rem', '128': '32rem',
      },
      maxWidth: {
        'content': '68ch',
        'wide':    '960px',
        'page':    '1200px',
      },
      borderRadius: {
        'sm': '6px', 'md': '10px', 'lg': '14px',
        'xl': '18px', '2xl': '24px', 'full': '9999px',
      },
      boxShadow: {
        'sm':      '0 1px 4px rgba(7,17,31,0.5)',
        'md':      '0 4px 20px rgba(7,17,31,0.6)',
        'lg':      '0 8px 40px rgba(7,17,31,0.7)',
        'xl':      '0 16px 64px rgba(7,17,31,0.8)',
        'green':   '0 8px 32px rgba(34,197,94,0.35)',
        'green-lg':'0 16px 56px rgba(34,197,94,0.4)',
        'blue':    '0 8px 32px rgba(27,58,107,0.6)',
        'focus':   '0 0 0 3px rgba(34,197,94,0.35)',
        'inset':   'inset 0 1px 0 rgba(255,255,255,0.08)',
      },
      backgroundImage: {
        'grid-navy':       "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%231B3A6B30' stroke-width='1'/%3E%3C/svg%3E\")",
        'dot-navy':        "radial-gradient(circle, #1B3A6B28 1px, transparent 1px)",
        'hero-glow':       'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(34,197,94,0.10) 0%, transparent 55%)',
        'blue-glow':       'radial-gradient(ellipse 70% 50% at 70% 30%, rgba(27,58,107,0.5) 0%, transparent 60%)',
        'navy-gradient':   'linear-gradient(180deg, #07111F 0%, #0D1F3C 100%)',
        'surface-gradient':'linear-gradient(135deg, #1B3A6B 0%, #132847 100%)',
        'green-gradient':  'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
        'orange-gradient': 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
        'card-gradient':   'linear-gradient(145deg, #1B3A6B 0%, #132847 100%)',
      },
      backgroundSize: {
        'dot-sm': '24px 24px',
        'dot-md': '40px 40px',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.5s ease forwards',
        'slide-up':   'slideUp 0.4s cubic-bezier(0,0,0.2,1) forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float':      'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:  { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
