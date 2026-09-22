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
        },
        background: '#FAFAF8',
        ink: '#1F2430',
        muted: '#6B7280',
        success: {
          DEFAULT: '#3F7D58',
          soft: '#E3F1E7',
        },
      },
    },
  },
  plugins: [],
};
export default config;