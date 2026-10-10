/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        heading: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: 'var(--color-ink)',
        forest: {
          DEFAULT: '#18241F',
          dark: '#0F1714',
          light: '#21322B',
        },
        ivory: {
          DEFAULT: '#F6F4EC',
          light: '#FAFAF5',
          dark: '#EBE7D8',
        },
        sage: {
          DEFAULT: '#D9EEE4',
          subtle: '#EBF6F0',
          dark: '#B8DBC9',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          subtle: 'var(--color-primary-subtle)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          subtle: 'var(--color-accent-subtle)',
          text: 'var(--color-accent-text)',
        },
        background: 'var(--color-background)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          raised: 'var(--color-surface-raised)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          subtle: 'var(--color-border-subtle)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          subtle: 'var(--color-success-subtle)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          subtle: 'var(--color-warning-subtle)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          subtle: 'var(--color-danger-subtle)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          subtle: 'var(--color-info-subtle)',
        },
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(11, 18, 32, 0.04), 0 1px 2px -1px rgba(11, 18, 32, 0.03)',
        'card': '0 4px 12px -2px rgba(11, 18, 32, 0.06), 0 2px 4px -2px rgba(11, 18, 32, 0.03)',
        'overlay': '0 12px 32px -4px rgba(11, 18, 32, 0.16), 0 4px 12px -2px rgba(11, 18, 32, 0.08)',
        'modal': '0 24px 48px -12px rgba(11, 18, 32, 0.24)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
}
