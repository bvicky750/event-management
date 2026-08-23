/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        palette: {
          white: '#FFFFFF',
          bg: '#EAF6FF',
          border: '#C1E5FF',
          sky: '#9CD5FF',
          primary: '#6AB0E3',
          'primary-hover': '#559FD4',
          'primary-dark': '#3F88BF',
          dark: '#0F2238',
          text: '#1E3A5F',
          muted: '#5B7B9C',
          light: '#F3F9FF',
        },
        brand: {
          50: '#EAF6FF',
          100: '#C1E5FF',
          200: '#9CD5FF',
          300: '#7EC2F3',
          400: '#6AB0E3',
          500: '#539FD8',
          600: '#3F88BF',
          700: '#2D6B9C',
          800: '#1E4E75',
          900: '#0F2238',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        serif: ['Playfair Display', 'Georgia', 'ui-serif', 'serif'],
      },
      boxShadow: {
        'sky-subtle': '0 2px 10px -2px rgba(106, 176, 227, 0.15), 0 1px 3px -1px rgba(15, 34, 56, 0.05)',
        'sky-card': '0 6px 24px -4px rgba(106, 176, 227, 0.2), 0 2px 8px -2px rgba(15, 34, 56, 0.04)',
        'sky-hover': '0 16px 36px -6px rgba(106, 176, 227, 0.35), 0 4px 14px -2px rgba(15, 34, 56, 0.08)',
        'glow-primary': '0 0 24px -2px rgba(106, 176, 227, 0.45)',
      }
    },
  },
  plugins: [],
}
