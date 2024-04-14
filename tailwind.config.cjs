/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      letterSpacing: {
        superwide: ".35em",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
