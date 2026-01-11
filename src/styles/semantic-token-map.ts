export const motion = {
  transition: {
    default: "duration-300",
  },
} as const;

export const shadow = {
  default: "shadow-md",
  interactive: `shadow-md hover:shadow-lg`,
} as const;

export const layoutSurfaceColor = {
  neutral: {
    prominent: "bg-stone-99",
    default: "bg-stone-98",
    muted: "bg-stone-97",
    mutedAlt: "bg-stone-96",
  },
  primary: {
    default: "bg-blue-97",
    contrastDefault: "bg-blue-30",
    contrastProminent: "bg-blue-25",
  },
  secondary: {
    default: "bg-green-98",
  },
  tertiary: {
    default: "bg-pink-97",
  },
} as const;

export type LayoutSurfaceColor = typeof layoutSurfaceColor;

export const decoration = {
  textUnderlineOffset: {
    default: "underline-offset-4",
  },
} as const;

export const borderColor = {
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
    muted: "border-pink-92",
    interactive: `border-pink-92 hover:border-pink-80`,
  },
} as const;

/**
 * Mappings between our semantic design tokens and custom Tailwind utility classes.
 *
 * Can be used with the Astro `class:list` directive for better DX/more consistent design token application
 */
export default {
  motion,
  shadow,
  decoration,
  typography: {
    size: {
      body: {
        default: "text-base",
        prominent: "text-lg",
      },
    },
  },
  color: {
    layoutSurface: layoutSurfaceColor,
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
    decoration: {
      onLayoutSurface: {
        default: "decoration-blue-30",
        interactive: "decoration-slate-62 hover:decoration-blue-30",
      },
    },
    text: {
      onDark: "text-stone-98",
      onLight: "text-blue-30",
      onLayoutSurface: {
        default: "text-blue-30",
        muted: "text-slate-62",
        contrastDefault: "text-stone-98",
      },
      onContentSurface: {
        neutral: {
          default: "text-brown-46",
          muted: "text-brown-58",
        },
        primary: {
          default: "text-blue-30",
          muted: "text-blue-55",
          contrastDefault: "text-stone-98",
        },
        secondary: {
          default: "text-blue-30",
        },
        tertiary: {
          default: "text-blue-30",
        },
      },
    },
    border: borderColor,
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
