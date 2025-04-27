/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4a6fa5',
          hover: '#3a5a8c',
          dark: '#6b8cb2'
        },
        secondary: '#f0f4f8',
        danger: '#e53e3e',
        success: '#38a169',
        warning: '#dd6b20',
        dark: {
          bg: '#1a202c',
          card: '#2d3748',
          border: '#4a5568'
        }
      },
      boxShadow: {
        card: '0 4px 6px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'card-dark': '0 4px 6px rgba(0, 0, 0, 0.3)'
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    },
  },
  plugins: [],
}
