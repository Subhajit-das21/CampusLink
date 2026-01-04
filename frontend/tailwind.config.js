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
          navy: "#051923",   /* Primary Dark Canvas */
          slate: "#0A2533",  /* Card/UI Accent */
          light: "#F8FAFC",  /* Primary Light Canvas */
        },
      },
      animation: {
        'slow-spin': 'spin 12s linear infinite',
        'float-delayed': 'float 8s ease-in-out infinite 2s',
        'float': 'float 6s ease-in-out infinite',
        'reveal': 'reveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards', // Synced with Nexus Easing
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-25px) rotate(2deg)' },
        },
        reveal: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(30px)',
            filter: 'blur(10px)' // Added blur for a more premium transition
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)',
            filter: 'blur(0px)'
          },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
      },
      backgroundImage: {
        // High-fidelity shimmer for Skeleton Cards
        'shimmer-gradient': 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0.1) 60%, rgba(255, 255, 255, 0) 100%)',
        // Triadic brand gradient for text and accents
        'brand-mesh': 'linear-gradient(135deg, #0AD1C8 0%, #7861FF 50%, #F59E0B 100%)',
      },
      transitionTimingFunction: {
        // The "Nexus" curve for smooth UI interactions
        'nexus': 'cubic-bezier(0.22, 1, 0.36, 1)',
      }
    },
  },
  plugins: [],
}