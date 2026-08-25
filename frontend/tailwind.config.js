/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#0B0F0D',
          soft: '#0E1310',
        },
        surface: {
          DEFAULT: '#151A17',
          raised: '#1B211D',
          border: 'rgba(245, 247, 246, 0.08)',
          borderStrong: 'rgba(245, 247, 246, 0.14)',
        },
        emerald: {
          light: '#34D399',
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        ink: {
          DEFAULT: '#F5F7F6',
          muted: '#94A3A0',
          faint: '#5C6663',
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
        'radial-fade': 'radial-gradient(60% 60% at 50% 0%, rgba(16, 185, 129, 0.12) 0%, rgba(11, 15, 13, 0) 70%)',
        'emerald-glow': 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(16,185,129,0) 70%)',
        'grid-lines': 'linear-gradient(rgba(245,247,246,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(245,247,246,0.035) 1px, transparent 1px)',
      },
      boxShadow: {
        emerald: '0 0 0 1px rgba(16,185,129,0.25), 0 8px 30px -8px rgba(16,185,129,0.35)',
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
