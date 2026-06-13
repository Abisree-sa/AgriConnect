/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:        '#10d9a0',
        'primary-cyan': '#06b6d4',
        'primary-dark': '#0ea87a',
        background:     '#04080f',
        card:           '#0b1425',
        accent:         '#f5a623',
        danger:         '#f43f5e',
        muted:          '#3d6475',
        'muted-light':  '#5a8fa8',
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      boxShadow: {
        glow:    '0 0 32px rgba(16,217,160,0.18)',
        'glow-lg':'0 0 70px rgba(16,217,160,0.22)',
        danger:  '0 0 24px rgba(244,63,94,0.2)',
        cyan:    '0 0 28px rgba(6,182,212,0.18)',
      },
      backgroundImage: {
        'aurora': 'linear-gradient(120deg, #10d9a0 0%, #06b6d4 50%, #818cf8 100%)',
        'aurora-gold': 'linear-gradient(120deg, #f5a623 0%, #fbbf24 60%, #fde68a 100%)',
      },
      animation: {
        'pulse-slow':  'pulse 4s infinite',
        'bounce-slow': 'bounce 2s infinite',
        'aurora':      'aurora 8s ease-in-out infinite',
      },
      maxWidth: { '8xl': '88rem' },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
