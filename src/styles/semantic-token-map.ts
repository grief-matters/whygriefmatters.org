/**
 * Mappings between our semantic design tokens and custom Tailwind utility classes.
 *
 * Can be used with the Astro `class:list` directive for better DX/more consistent design token application
 */
export default {
  typography: {
    size: {
      body: {
        default: "text-base",
        prominent: "text-lg",
      },
    },
  },
  color: {
    layoutSurface: {
      neutral: {
        prominent: "bg-stone-99",
        default: "bg-stone-98",
        muted: "bg-stone-97",
        mutedAlt: "bg-stone-96",
      },
      primary: {
        default: "bg-blue-97",
        contrastDefault: "bg-blue-30",
        contrastProminent: "bg-blue-30",
      },
      secondary: {
        default: "bg-green-98",
      },
      tertiary: {
        default: "bg-pink-97",
      },
    },
    contentSurface: {
      brand: {
        donate: {
          prominent: "bg-aqua-70",
          default: "bg-aqua-80",
          muted: "bg-aqua-90",
        },
      },
      neutral: {
        prominent: "bg-stone-99",
        default: "bg-stone-98",
        muted: "bg-stone-97",
      },
      primary: {
        prominent: "bg-blue-91",
        default: "bg-blue-95",
        muted: "bg-blue-97",
        contrastProminent: "bg-blue-30",
        contrastDefault: "bg-blue-42",
        contrastMuted: "bg-blue-52",
      },
      secondary: {
        prominent: "bg-green-90",
        default: "bg-green-95",
        muted: "bg-green-98",
      },
      tertiary: {
        prominent: "bg-pink-87",
        default: "bg-pink-95",
        muted: "bg-pink-97",
      },
    },
    text: {
      onLayoutSurface: {
        default: "blue-30",
        muted: "slate-62",
        contrastDefault: "stone-98",
      },
      onContentSurface: {
        neutral: {
          default: "brown-46",
          muted: "brown-58",
        },
        primary: {
          default: "blue-30",
          muted: "blue-55",
          contrastDefault: "stone-98",
        },
        secondary: {
          default: "blue-30",
        },
        tertiary: {
          default: "blue-30",
        },
      },
    },
    border: {
      brand: {
        accent: "outline-cornflower-yellow",
      },
      neutral: {
        prominent: "border-brown-70",
        default: "border-brown-80",
        muted: "border-brown-90",
      },
      primary: {
        prominent: "border-blue-79",
        default: "border-blue-89",
        muted: "border-blue-91",
        contrastDefault: "border-blue-30",
      },
      secondary: {
        prominent: "border-green-79",
        default: "border-green-87",
        muted: "border-green-90",
      },
      tertiary: {
        prominent: "border-pink-80",
        default: "border-pink-87",
        muted: "border-pink-80",
      },
    },
    outline: {
      brand: {
        accent: "outline-cornflower-yellow",
      },
      neutral: {
        prominent: "outline-brown-70",
        default: "outline-brown-80",
        muted: "outline-brown-90",
      },
      primary: {
        prominent: "outline-blue-79",
        default: "outline-blue-89",
        muted: "outline-blue-91",
        contrastDefault: "outline-blue-30",
      },
      secondary: {
        prominent: "outline-green-79",
        default: "outline-green-87",
        muted: "outline-green-90",
      },
      tertiary: {
        prominent: "outline-pink-80",
        default: "outline-pink-87",
        muted: "outline-pink-80",
      },
    },
    stroke: {
      primary: "stroke-blue-55",
    },
    fill: {
      resourceType: {
        default: "fill-blue-95",
      },
    },
  },
} as const;
