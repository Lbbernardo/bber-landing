/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black:    '#000000',
          surface:  '#0F0F0F',
          white:    '#FFFFFF',
          muted:    '#B3B3B3',
          purple:   '#7C3AED',
          lavender: '#A78BFA',
          yellow:   '#FACC15',
          lemon:    '#FDE047',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23ffffff08' stroke-width='1'/%3E%3C/svg%3E\")",
        'dot-pattern':
          "radial-gradient(circle, #ffffff0a 1px, transparent 1px)",
        'purple-glow':
          'radial-gradient(ellipse 80% 50% at 50% -20%, #7C3AED33 0%, transparent 60%)',
        'yellow-glow':
          'radial-gradient(ellipse 60% 40% at 50% 110%, #FACC1520 0%, transparent 60%)',
      },
      backgroundSize: {
        'dot-sm': '24px 24px',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.5s ease forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
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
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px #7C3AED44' },
          '50%':      { boxShadow: '0 0 40px #7C3AED88' },
        },
      },
    },
  },
  plugins: [],
}
