export const wgmDesignSystem = {
  background: {
    color: {
      primary: {
        defaultLightest: "",
        defaultLighter: "",
        defaultDarker: "",
        contrast: "",
        default: "bg-sky-900",
      },
      secondary: {
        default: "bg-yellow-200",
        defaultLightest: "",
        defaultLighter: "",
        defaultDarker: "",
        contrast: "",
      },
      brand: {
        blue: "bg-blue-900",
      },
      neutral: {
        defaultLightest: "bg-stone-50",
        defaultLighter: "bg-stone-100",
        default: "bg-stone-200",
        defaultDarker: "bg-stone-300",
        contrast: "bg-stone-700",
      },
    },
  },
  border: {
    color: {
      primary: {
        default: "border-sky-700/70",
        hover: "border-sky-700/30 hover:border-sky-700/70",
      },
      neutral: {
        default: "border-stone-200",
      },
      resourceType: {
        app: {
          default: "border-blue-500",
          contrast: "",
          hover: "border-blue-800/30 hover:border-blue-500",
        },
        article: {
          default: "border-fuchsia-500",
          contrast: "",
          hover: "border-fuchsia-800/30 hover:border-fuchsia-500",
        },
        blog: {
          default: "border-red-500",
          contrast: "",
          hover: "border-red-800/30 hover:border-red-500",
        },
        book: {
          default: "border-orange-500",
          contrast: "",
          hover: "border-orange-800/30 hover:border-orange-500",
        },
        booklet: {
          default: "border-amber-500",
          contrast: "",
          hover: "border-amber-800/30 hover:border-amber-500",
        },
        brochure: {
          default: "border-yellow-400",
          contrast: "",
          hover: "border-yellow-800/30 hover:border-yellow-400",
        },
        course: {
          default: "border-sky-500",
          contrast: "",
          hover: "border-sky-800/30 hover:border-sky-500",
        },
        forum: {
          default: "border-fuchsia-500",
          contrast: "",
          hover: "border-fuchsia-800/30 hover:border-fuchsia-500",
        },
        memorial: {
          default: "border-indigo-500",
          contrast: "",
          hover: "border-indigo-800/30 hover:border-indigo-500",
        },
        peerSupport: {
          default: "border-rose-500",
          contrast: "",
          hover: "border-rose-800/30 hover:border-rose-500",
        },
        podcast: {
          default: "border-violet-500",
          contrast: "",
          hover: "border-violet-800/30 hover:border-violet-500",
        },
        podcastEpisode: {
          default: "border-violet-500",
          contrast: "",
          hover: "border-violet-800/30 hover:border-violet-500",
        },
        story: {
          default: "border-teal-500/70",
          contrast: "",
          hover: "border-teal-500/30 hover:border-teal-500/70",
        },
        supportGroup: {
          default: "border-purple-500",
          contrast: "",
          hover: "border-purple-800/30 hover:border-purple-500",
        },
        therapyResource: {
          default: "border-cyan-500",
          contrast: "",
          hover: "border-cyan-800/30 hover:border-cyan-500",
        },
        video: {
          default: "border-green-500",
          contrast: "",
          hover: "border-green-800/30 hover:border-green-500",
        },
        webinar: {
          default: "border-green-500",
          contrast: "",
          hover: "border-green-800/30 hover:border-green-500",
        },
        website: {
          default: "border-red-500",
          contrast: "",
          hover: "border-red-500/30 hover:border-red-500/70",
        },
      },
    },
  },
  decoration: {
    underline: "underline underline-offset-2",
    transition: "transition-decoration duration-300",
    color: {
      primary: {
        default: "",
        contrast: "",
        hover: "decoration-sky-800/30 hover:decoration-sky-900",
        contrastHover: "decoration-stone-50/30 hover:decoration-stone-50",
      },
      secondary: {
        default: "",
        contrast: "",
        hover: "decoration-sky-800/30 hover:decoration-sky-900",
        contrastHover: "decoration-sky-800/30 hover:decoration-sky-900",
      },
      neutral: {
        default: undefined,
        contrast: undefined,
        hover: undefined,
        contrastHover: undefined,
      },
    },
  },
  typography: {
    color: {
      primary: {
        default: "text-sky-800",
        contrast: "text-stone-50",
      },
      secondary: {
        default: "",
        contrast: "text-blue-900",
      },
      neutral: {
        default: "text-slate-500",
        contrast: "",
      },
      // brand: {
      //   default: "",
      //   blue: "text-blue-800",
      // },
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      xl2: "text-2xl",
      xl3: "text-3xl",
      xl4: "text-4xl",
      xl5: "text-5xl",
      xl6: "text-6xl",
      xl7: "text-7xl",
      xl8: "text-8xl",
      xl9: "text-9xl",
    },
  },
} as const;

export type DesignSystem = typeof wgmDesignSystem;

// Extract the typography color keys and their variants
export type TypographyColorScheme = keyof DesignSystem["typography"]["color"];
export type TypographyColorSchemeVariant = {
  [K in TypographyColorScheme]: keyof DesignSystem["typography"]["color"][K];
}[TypographyColorScheme];
export type TypographySize = keyof DesignSystem["typography"]["size"];

export type BgColorScheme = keyof DesignSystem["background"]["color"];
export type BgColorSchemeVariant = {
  [K in TypographyColorScheme]: keyof DesignSystem["background"]["color"][K];
}[TypographyColorScheme];
