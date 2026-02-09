/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        te: {
          bg: 'var(--te-bg)',
          surface: 'var(--te-surface)',
          text: 'var(--te-text)',
          muted: 'var(--te-muted)',
          border: 'var(--te-border)',
          accent: 'var(--te-accent)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
