/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aevion: {
          50: '#f0f5ff',
          100: '#e0edff',
          200: '#c7dcfe',
          300: '#9ec1fd',
          400: '#6d9bfb',
          500: '#4874f6',
          600: '#3256eb',
          700: '#2642d8',
          800: '#2337af',
          900: '#1d2a6a',
          950: '#0b1129'
        },
        dark: {
          base: '#090a0f',
          surface: '#12141d',
          card: '#191c28',
          border: '#25293d',
          subtle: '#2d334a'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Cabinet Grotesk', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' }
        }
      }
    },
  },
  plugins: [],
};
