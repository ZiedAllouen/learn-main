import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bsmk: {
          black: '#0A0A0A',
          white: '#F5F5F0',
          terracotta: '#C4622D',
          olive: '#5C6B3A',
          sand: '#D4C5A9',
          blue: '#1B3A5C',
        },
        // Sector vivid colors (top-level navigation / identification)
        sector: {
          'arts-de-scene': '#2D5F99',
          'evenements': '#C0392B',
          'medias': '#7A2E73',
          'sports-loisirs': '#5C8A3A',
          'consulting': '#147070',
          'partenaires': '#C99A2E',
          'showroom': '#8A8F7A',
        },
        // Discipline pastel/nude colors (content tags / card accents)
        discipline: {
          'musique': '#B8C8D8',
          'danse': '#D4B8A8',
          'arts-visuels': '#C8D4B0',
          'theatre': '#C8B8D4',
          'cinema': '#B8C8C8',
          'numerique': '#B8D4C8',
          'design': '#D4C8B0',
          'medias-disc': '#D4B8C8',
          'artisanat': '#D4C4B0',
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
