import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sysserif: ['"Times New Roman"', 'Times', 'serif'],
        comic: ['"Comic Sans MS"', '"Comic Sans"', 'cursive'],
        mono: ['"Courier New"', 'Courier', 'monospace'],
        tahoma: ['Tahoma', 'Verdana', 'Arial', 'sans-serif'],
        manrope: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        vk: {
          DEFAULT: '#45688E',
          light: '#5B7FA6',
          bg: '#EDEEF0',
          panel: '#FFFFFF',
          link: '#2B587A',
        },
        eco: {
          bg: '#070708',
          ink: '#F5F5F7',
          violet: '#7C3AED',
          lime: '#C6FF00',
        },
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'blink': 'blink 1s steps(2, start) infinite',
        'flame': 'flame 0.4s steps(2) infinite',
      },
      keyframes: {
        blink: {
          'to': { visibility: 'hidden' },
        },
        flame: {
          '0%, 100%': { transform: 'translateY(0) scaleY(1)' },
          '50%': { transform: 'translateY(-2px) scaleY(1.05)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
