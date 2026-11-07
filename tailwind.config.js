/** @type {import('tailwindcss').Config} */
// Clarity theme: the app's primary accent ("indigo" utilities) is remapped to
// the calm enterprise green from the approved Clarity design proposal, so
// existing components pick up the palette without per-class churn.
const clarityGreen = {
  50: '#eef8f5',
  100: '#e3f3ee',
  200: '#c3e6dc',
  300: '#93cfbf',
  400: '#4fae98',
  500: '#1f8b78',
  600: '#096b61',
  700: '#075c50',
  800: '#0a4a42',
  900: '#0b3d37',
  950: '#062521',
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: clarityGreen,
        clarity: {
          ...clarityGreen,
          ink: '#182b37',
          muted: '#536971',
          canvas: '#f3f6f7',
          line: '#dfe7eb',
          focus: '#f2963b',
        },
      },
    },
  },
  plugins: [],
}
