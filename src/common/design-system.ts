// import type { InternetResourceType } from "@model/internetResource";

// type TwCategoryKey = "background" | "border" | "decoration" | "typography";

// interface BaseTwCategory {
//   color?: DsColorContext;
// }

// interface TwCategory extends BaseTwCategory {
//   [key: string]: any;
// }

// export type DsColorContext = {
//   primary: DsColorContextVariants;
//   secondary?: DsColorContextVariants;
//   neutral?: DsColorContextVariants;
//   resourceType?: Record<InternetResourceType, DsColorContextVariants>;
//   brand?: DsColorBrandContext;
// };

// type DsColorContextVariants = {
//   defaultLightest?: string;
//   defaultLighter?: string;
//   default: string;
//   defaultDarker?: string;
//   contrast?: string;
//   hover?: string;
//   contrastHover?: string;
// };

// type DsColorBrandContext = {
//   blue: string;
// };

// export type DsColorVariant =
//   | ["primary", keyof DsColorContextVariants]
//   | ["secondary", keyof DsColorContextVariants]
//   | ["neutral", keyof DsColorContextVariants]
//   | ["brand", keyof DsColorBrandContext]
//   | ["resourceType", InternetResourceType, keyof DsColorContextVariants];

// // type DesignSystem = Record<TwCategoryKey, TwCategory>;

// type DesignSystem = typeof wgmDesignSystem;
// type TypographyColorType = keyof DesignSystem['typography']['color'];
// type TypographyColorVariantType = {
//   [Key in TypographyColorType]: keyof DesignSystem['typography']['color'][Key];
// }[TypographyColorType];

export const wgmDesignSystem = {
  background: {
    color: {
      primary: {
        default: "bg-sky-900",
      },
      secondary: {
        default: "bg-yellow-200",
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
      resourceType: {
        app: {
          default: "border-blue-500",
          contrast: "",
          hover: "border-blue-800/30 hover:border-blue-900",
        },
        article: {
          default: "border-fuchsia-500",
          contrast: "",
          hover: "border-fuchsia-800/30 hover:border-fuchsia-900",
        },
        blog: {
          default: "border-red-500",
          contrast: "",
          hover: "border-red-800/30 hover:border-red-900",
        },
        book: {
          default: "border-orange-500",
          contrast: "",
          hover: "border-orange-800/30 hover:border-orange-900",
        },
        booklet: {
          default: "border-amber-500",
          contrast: "",
          hover: "border-amber-800/30 hover:border-amber-900",
        },
        brochure: {
          default: "border-yellow-400",
          contrast: "",
          hover: "border-yellow-800/30 hover:border-yellow-900",
        },
        course: {
          default: "border-sky-500",
          contrast: "",
          hover: "border-sky-800/30 hover:border-sky-900",
        },
        forum: {
          default: "border-fuchsia-500",
          contrast: "",
          hover: "border-fuchsia-800/30 hover:border-fuchsia-900",
        },
        memorial: {
          default: "border-indigo-500",
          contrast: "",
          hover: "border-indigo-800/30 hover:border-indigo-900",
        },
        peerSupport: {
          default: "border-rose-500",
          contrast: "",
          hover: "border-rose-800/30 hover:border-rose-900",
        },
        podcast: {
          default: "border-violet-500",
          contrast: "",
          hover: "border-violet-800/30 hover:border-violet-900",
        },
        podcastEpisode: {
          default: "border-violet-500",
          contrast: "",
          hover: "border-violet-800/30 hover:border-violet-900",
        },
        story: {
          default: "border-teal-500/70",
          contrast: "",
          hover: "border-teal-500/30 hover:border-teal-500/70",
        },
        supportGroup: {
          default: "border-purple-500",
          contrast: "",
          hover: "border-purple-800/30 hover:border-purple-900",
        },
        therapyResource: {
          default: "border-cyan-500",
          contrast: "",
          hover: "border-cyan-800/30 hover:border-cyan-900",
        },
        video: {
          default: "border-green-500",
          contrast: "",
          hover: "border-green-800/30 hover:border-green-900",
        },
        webinar: {
          default: "border-green-500",
          contrast: "",
          hover: "border-green-800/30 hover:border-green-900",
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

// export const getTypographyColorClass = (
//   color: `${TypographyColorScheme}.${TypographyColorSchemeVariant}`,
// ): string => {
//   const [type, variant] = color.split(".") as [
//     TypographyColorScheme,
//     TypographyColorSchemeVariant,
//   ];

//   return (wgmDesignSystem.typography.color[type] as any)[variant];
// };

// export function getTextColorClassListFromVariant(variant: DsColorVariant) {
//   const [ctx, x, y] = variant;

//   switch (ctx) {
//     case "resourceType":
//       return wgmDesignSystem.typography.color?.resourceType?.[x]?.[y];
//     case "brand":
//       return wgmDesignSystem.typography.color?.[ctx]?.[x];
//     case "neutral":
//       return wgmDesignSystem.typography.color?.[ctx]?.[x];
//     case "primary":
//     case "secondary":
//       return wgmDesignSystem.typography.color?.[ctx]?.[x];
//     default:
//       return wgmDesignSystem.typography.color?.neutral?.default;
//   }
// }

// export function getHoverDecorationClassFromTextColorVariant(
//   variant: DsColorVariant,
// ) {
//   const [ctx, x, y] = variant;

//   if (ctx === "resourceType" || ctx === "brand") {
//     // TODO - we don't care about these right now
//     return "";
//   }

//   return x === "contrast"
//     ? wgmDesignSystem.decoration.color?.[ctx]?.contrastHover
//     : wgmDesignSystem.decoration.color?.[ctx]?.hover;
// }
