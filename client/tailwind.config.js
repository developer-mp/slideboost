/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  prefix: "tw-",
  theme: {
    extend: {
      colors: {
        "custom-color-teal": "#0ecfde",
        "custom-color-blue": "#15426c",
      },
    },
  },
  plugins: [],
};
