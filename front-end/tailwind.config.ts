import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1E3A5F',
          dark: '#152A45',
          soft: '#E7ECF2',
        },
        accent: {
          DEFAULT: '#D9A441',
          soft: '#FBF1DD',
          // Donkerdere variant voor TEKST: #D9A441 haalt op wit maar ~2,3:1
          // contrast (WCAG AA vraagt 4,5:1). Deze haalt ~5,9:1.
          text: '#8A5A00',
        },
        background: '#FAFAF8',
        ink: '#1F2430',
        muted: '#6B7280',
        success: {
          DEFAULT: '#3F7D58',
          soft: '#E3F1E7',
          // Tekstkleur op de zachte achtergrond (>= 6:1 contrast).
          dark: '#2F6244',
        },
      },
    },
  },
  plugins: [],
};
export default config;