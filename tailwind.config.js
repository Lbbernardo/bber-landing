/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black:    '#0A0A0A',
          surface:  '#111111',
          white:    '#FFFFFF',
          muted:    '#888888',
          purple:   '#7C3AED',
          lavender: '#A78BFA',
          yellow:   '#FFD600',
          lemon:    '#FFE033',
          gold:     '#FFD600',
          blue:     '#1D4ED8',
          green:    '#22C55E',
          greenDark:'#16A34A',
          gray:     '#1A1A1A',
          red:      '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23ffffff08' stroke-width='1'/%3E%3C/svg%3E\")",
        'dot-pattern':
          "radial-gradient(circle, #ffffff08 1px, transparent 1px)",
        'purple-glow':
          'radial-gradient(ellipse 80% 50% at 50% -20%, #FFD60018 0%, transparent 60%)',
        'yellow-glow':
          'radial-gradient(ellipse 60% 40% at 50% 110%, #FFD60014 0%, transparent 60%)',
      },
      backgroundSize: {
        'dot-sm': '24px 24px',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.5s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
