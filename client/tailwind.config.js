
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FEF6F0',
        surface: '#FFFFFF',
        primary: '#E8A4B0',
        'primary-dark': '#C0607A',
        subtle: '#FEF0F4',
        border: '#F0E4E0',
        'text-primary': '#3D2F2F',
        'text-muted': '#B08090',
      },
      fontFamily: {
        borel: ['Borel', 'cursive'],
        nunito: ['Nunito', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 16px rgba(180,120,140,0.1)',
        'soft-hover': '0 8px 32px rgba(180,120,140,0.18)',
      },
      borderRadius: {
        'card': '24px',
        'pill': '50px',
        'button': '14px',
        'badge': '50px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
