/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6B5B95',
        secondary: '#88B0D3',
        accent: '#FFB6C1',
        surface: '#F5F3F7',
        success: '#7FB069',
        warning: '#F4A259',
        error: '#E07A5F',
        info: '#81B29A',
        purple: {
          50: '#f5f3f7',
          100: '#ebe6ef',
          200: '#d7cedf',
          300: '#bfb1cf',
          400: '#a394bf',
          500: '#6B5B95',
          600: '#5c4e82',
          700: '#4d416e',
          800: '#3e345a',
          900: '#2f2746'
        },
        blue: {
          50: '#f0f5fa',
          100: '#e1ebf5',
          200: '#c3d7eb',
          300: '#a5c3e1',
          400: '#88B0D3',
          500: '#6a9cc5',
          600: '#5c88b7',
          700: '#4e74a9',
          800: '#40609b',
          900: '#324c8d'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui']
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.25rem',
        'xl': '1.563rem',
        '2xl': '1.953rem',
        '3xl': '2.441rem',
        '4xl': '3.052rem'
      },
      borderRadius: {
        'DEFAULT': '12px',
        'sm': '8px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px'
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0,0,0,0.08)',
        'card': '0 4px 12px rgba(0,0,0,0.1)',
        'floating': '0 8px 20px rgba(0,0,0,0.12)'
      }
    },
  },
  plugins: [],
}