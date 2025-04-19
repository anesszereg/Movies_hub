/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // StreamVibe themed color palette
        primary: "#121212",       // Dark background
        secondary: "#181818",     // Card background
        tertiary: "#232323",      // Slightly lighter background
        accent: "#E50914",        // Primary red accent
        "accent-hover": "#F40612", // Hover state for red accent
        "text-primary": "#FFFFFF", // White text
        "text-secondary": "#AAAAAA", // Light gray text
        "text-muted": "#777777",   // Muted text
        "card-hover": "#252525",   // Card hover background
        "overlay": "rgba(0,0,0,0.6)" // Overlay for images
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-overlay': 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.3) 100%)'
      }
    },
  },
  plugins: [],
}
