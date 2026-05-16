import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // BSMK brand palette — replace with actual values from design
        bsmk: {
          black: '#0A0A0A',
          white: '#F5F5F0',
          terracotta: '#C4622D',
          olive: '#5C6B3A',
          sand: '#D4C5A9',
          blue: '#1B3A5C',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
