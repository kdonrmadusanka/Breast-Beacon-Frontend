module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'breast-pink': {
          500: '#EC4899',
          600: '#DB2777',
          700: '#BE185D',
        },
        'dark-bg': '#1A1A1A',
        'dark-accent': '#2D2D2D',
      },
      animation: {
        'border-cycle': 'borderCycle 3s linear infinite',
      },
      keyframes: {
        borderCycle: {
          '0%': { borderColor: '#EC4899' },
          '33%': { borderColor: '#3B82F6' },
          '66%': { borderColor: '#10B981' },
          '100%': { borderColor: '#EC4899' },
        },
      },
    },
  },
  plugins: [],
};