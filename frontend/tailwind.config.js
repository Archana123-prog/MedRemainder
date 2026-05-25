/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        medremind: {
          "primary": "#6366f1",
          "primary-content": "#ffffff",
          "secondary": "#10b981",
          "secondary-content": "#ffffff",
          "accent": "#f59e0b",
          "neutral": "#1e293b",
          "base-100": "#0f172a",
          "base-200": "#1e293b",
          "base-300": "#334155",
          "base-content": "#e2e8f0",
          "info": "#38bdf8",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        }
      }
    ],
    darkTheme: "medremind",
  }
}
