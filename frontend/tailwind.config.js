/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: 'rgb(var(--charcoal) / <alpha-value>)',
          soft: 'rgb(var(--charcoal-soft) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          raised: 'rgb(var(--surface-raised) / <alpha-value>)',
          border: 'rgb(var(--surface-border) / <alpha-value>)',
          borderStrong: 'rgb(var(--surface-border-strong) / <alpha-value>)',
        },
        emerald: {
          light: '#FF8A45',
          DEFAULT: '#FF5A00',
          dark: '#D94800',
        },
        orange: {
          light: '#FF8A45',
          DEFAULT: '#FF5A00',
          dark: '#D94800',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted) / <alpha-value>)',
          faint: 'rgb(var(--ink-faint) / <alpha-value>)',
        },
        danger: '#F87171',
        warning: '#FBBF24',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(60% 60% at 50% 0%, rgba(255, 90, 0, 0.12) 0%, rgba(11, 15, 13, 0) 70%)',
        'emerald-glow': 'radial-gradient(circle, rgba(255,90,0,0.35) 0%, rgba(255,90,0,0) 70%)',
      },
      boxShadow: {
        emerald: '0 0 0 1px rgba(255,90,0,0.25), 0 8px 30px -8px rgba(255,90,0,0.35)',
        card: '0 1px 0 0 rgba(245,247,246,0.04) inset, 0 12px 30px -18px rgba(0,0,0,0.6)',
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '80%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.2s cubic-bezier(0.4,0,0.6,1) infinite',
        shimmer: 'shimmer 1.8s linear infinite',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        marquee: 'marquee 22s linear infinite',
      },
    },
  },
  plugins: [],
}
