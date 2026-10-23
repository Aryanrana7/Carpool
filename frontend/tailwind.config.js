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
        pine: {
          DEFAULT: '#315B45',
          dark: '#264936',
          light: '#E7F2EB',
        },
        forest: {
          DEFAULT: '#192A20',
          dark: '#0E1712',
          light: '#16231C',
        },
        sage: {
          DEFAULT: '#546B5D',
          subtle: '#E7F2EB',
          light: '#F7FAF8',
        },
        amber: {
          DEFAULT: '#DF8220',
          light: '#FEF3E6',
          dark: '#C77317',
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
        canvas: 'var(--color-bg-canvas)',
        'hero-bg': 'var(--color-hero-bg)',
        'hero-surface': 'var(--color-hero-surface)',
        'hero-border': 'var(--color-hero-border)',
        'card-surface': 'var(--color-card-surface)',
        'card-border': 'var(--color-card-border)',
        'pill-bg': 'var(--color-pill-bg)',
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
