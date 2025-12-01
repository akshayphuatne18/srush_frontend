// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#e0e7ff",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
        },
        secondary: {
          100: "#e0f2fe",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
        },
      },
      backgroundImage: {
        "gradient-header": "linear-gradient(135deg, #4f46e5, #6366f1)",
        "gradient-card": "linear-gradient(135deg, #ffffff, #f7f7f7)",
        "gradient-primary": "linear-gradient(135deg, #6366f1, #4f46e5)",
      },
    },
  },
  plugins: [],
};
