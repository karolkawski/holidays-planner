import type {Config} from 'tailwindcss';
import {nextui} from '@nextui-org/react';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: '#001731',
        secondary: '#002E62',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;
