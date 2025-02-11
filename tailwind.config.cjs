/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: {
          DEFAULT: '#E5E7EB',
        },
        primary: {
          DEFAULT: '#F3BD50',
          hover: '#E1AD40',
          light: '#FEF9EE',
        },
        secondary: {
          DEFAULT: '#00B074',
          hover: '#009E68',
          light: '#E6F6F1',
        },
        accent: {
          DEFAULT: '#4267B2',
          hover: '#375593',
        },
        danger: {
          DEFAULT: '#DC3545',
          hover: '#C82333',
        },
      },
      fontSize: {
        xs: ['11px', { lineHeight: '16px' }],
        sm: ['13px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
      },
      fontFamily: {
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-out': {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        dots: {
          '0%, 20%': {
            opacity: 0,
            transform: 'translateY(0)',
          },
          '50%': {
            opacity: 1,
            transform: 'translateY(-2px)',
          },
          '80%, 100%': {
            opacity: 0,
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        dots: 'dots 1.4s infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
  ],
};
