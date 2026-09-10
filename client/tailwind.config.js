/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#0b0f19', muted: '#111827' },
        card: { DEFAULT: '#111827', border: '#1f2937' },
        accent: { DEFAULT: '#3b82f6', hover: '#2563eb' }
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
}