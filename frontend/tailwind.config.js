/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#0ea5e9',
        secondary: '#9333ea',
        success: '#10b981',
        danger: '#ef4444',
        dark: '#111827',
        accent: '#14b8a6',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'fade-out': 'fadeOut 0.4s ease-in forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: 0,
            transform: 'translateY(10px) scale(0.98)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0) scale(1)',
          },
        },
        fadeOut: {
          '0%': {
            opacity: 1,
            transform: 'translateY(0) scale(1)',
          },
          '100%': {
            opacity: 0,
            transform: 'translateY(10px) scale(0.98)',
          },
        },
        slideUp: {
          '0%': {
            transform: 'translateY(20px)',
            opacity: 0,
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: 1,
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
      },
    },
  },
  plugins: [],
};
