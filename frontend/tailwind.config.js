/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        campus: {
          teal: "#0AD1C8",
          mint: "#45DFB1",
          amber: "#F59E0B",
          gold: "#F7AD19",
          violet: "#7861FF",
          navy: "#051923",   /* Deepest Navy */
          slate: "#0A2533",  /* Dark Slate Accent */
          light: "#F8FAFC",  /* Light Mode Background */
        },
      },
      animation: {
        'slow-spin': 'spin 12s linear infinite',
        'float-delayed': 'float 8s ease-in-out infinite 2s',
        'float': 'float 6s ease-in-out infinite',
        'reveal': 'reveal 0.8s cubic-bezier(0, 0, 0.2, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-25px) rotate(2deg)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
    },
  },
  plugins: [],
}