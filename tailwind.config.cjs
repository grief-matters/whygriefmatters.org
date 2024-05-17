/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Source Serif"', ...defaultTheme.fontFamily.serif],
      },
      letterSpacing: {
        superwide: ".35em",
      },
      typography: ({ theme }) => ({
        wgm: {
          css: {
            "--tw-prose-body": theme("colors.sky[900]"),
            "--tw-prose-headings": theme("colors.sky[900]"),
            "--tw-prose-lead": theme("colors.sky[700]"),
            "--tw-prose-links": theme("colors.sky[900]"),
            "--tw-prose-bold": theme("colors.sky[800]"),
            "--tw-prose-counters": theme("colors.sky[600]"),
            "--tw-prose-bullets": theme("colors.sky[400]"),
            "--tw-prose-hr": theme("colors.sky[300]"),
            "--tw-prose-quotes": theme("colors.sky[900]"),
            "--tw-prose-quote-borders": theme("colors.sky[300]"),
            "--tw-prose-captions": theme("colors.sky[700]"),
            "--tw-prose-code": theme("colors.sky[900]"),
            "--tw-prose-pre-code": theme("colors.sky[100]"),
            "--tw-prose-pre-bg": theme("colors.sky[900]"),
            "--tw-prose-th-borders": theme("colors.sky[300]"),
            "--tw-prose-td-borders": theme("colors.sky[200]"),
            "--tw-prose-invert-body": theme("colors.stone[50]"),
            "--tw-prose-invert-headings": theme("colors.white"),
            "--tw-prose-invert-lead": theme("colors.pink[300]"),
            "--tw-prose-invert-links": theme("colors.white"),
            "--tw-prose-invert-bold": theme("colors.white"),
            "--tw-prose-invert-counters": theme("colors.sky[400]"),
            "--tw-prose-invert-bullets": theme("colors.sky[600]"),
            "--tw-prose-invert-hr": theme("colors.sky[700]"),
            "--tw-prose-invert-quotes": theme("colors.sky[100]"),
            "--tw-prose-invert-quote-borders": theme("colors.sky[700]"),
            "--tw-prose-invert-captions": theme("colors.sky[400]"),
            "--tw-prose-invert-code": theme("colors.white"),
            "--tw-prose-invert-pre-code": theme("colors.sky[300]"),
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": theme("colors.sky[600]"),
            "--tw-prose-invert-td-borders": theme("colors.sky[700]"),
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
