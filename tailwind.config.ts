import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#D4AF37', light: '#F4D78B', dark: '#A8842C' },
        ghana: {
          black: '#101010',
          green: '#006B3F',
          red: '#CE1126',
          gold: '#FCD116',
          white: '#FAFAFA',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FCD116 0%, #D4AF37 50%, #A8842C 100%)',
        'hero-overlay': 'linear-gradient(180deg, rgba(16,16,16,0.2) 0%, rgba(16,16,16,0.85) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};

export default config;
