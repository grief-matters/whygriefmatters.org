import type { InternetResourceType } from "@model/internetResource";

type TailwindCategoryKey =
  | "background"
  | "border"
  | "decoration"
  | "typography";

type DesignContextProperties = {
  default: string;
  contrast: string;
  hoverable?: string;
};

type DesignContext = {
  primary: DesignContextProperties;
  secondary?: DesignContextProperties;
  brand?: any;
  resourceType?: Record<InternetResourceType, DesignContextProperties>;
};

interface TailwindCategoryBase {
  [key: string]: any;
}

interface TailwindCategory extends TailwindCategoryBase {
  color?: DesignContext;
}

type DesignSystem = Record<TailwindCategoryKey, TailwindCategory>;

export const wgmDesignSystem: DesignSystem = {
  background: {
    color: {
      primary: {
        default: "bg-sky-900",
        contrast: "bg-stone-100",
      },
      brand: {
        blue: "bg-blue-900",
      },
    },
  },
  border: {
    color: {
      primary: {
        default: "border-sky-700/70",
        hoverable: "border-sky-700/30 hover:border-sky-700/70",
        contrast: "",
      },
      resourceType: {
        app: {
          default: "border-blue-500",
          contrast: "",
          hoverable: "border-blue-800/30 hover:border-blue-900",
        },
        article: {
          default: "border-fuchsia-500",
          contrast: "",
          hoverable: "border-fuchsia-800/30 hover:border-fuchsia-900",
        },
        blog: {
          default: "border-red-500",
          contrast: "",
          hoverable: "border-red-800/30 hover:border-red-900",
        },
        book: {
          default: "border-orange-500",
          contrast: "",
          hoverable: "border-orange-800/30 hover:border-orange-900",
        },
        booklet: {
          default: "border-amber-500",
          contrast: "",
          hoverable: "border-amber-800/30 hover:border-amber-900",
        },
        brochure: {
          default: "border-yellow-400",
          contrast: "",
          hoverable: "border-yellow-800/30 hover:border-yellow-900",
        },
        course: {
          default: "border-sky-500",
          contrast: "",
          hoverable: "border-sky-800/30 hover:border-sky-900",
        },
        forum: {
          default: "border-fuchsia-500",
          contrast: "",
          hoverable: "border-fuchsia-800/30 hover:border-fuchsia-900",
        },
        memorial: {
          default: "border-indigo-500",
          contrast: "",
          hoverable: "border-indigo-800/30 hover:border-indigo-900",
        },
        peerSupport: {
          default: "border-rose-500",
          contrast: "",
          hoverable: "border-rose-800/30 hover:border-rose-900",
        },
        podcast: {
          default: "border-violet-500",
          contrast: "",
          hoverable: "border-violet-800/30 hover:border-violet-900",
        },
        podcastEpisode: {
          default: "border-violet-500",
          contrast: "",
          hoverable: "border-violet-800/30 hover:border-violet-900",
        },
        story: {
          default: "border-teal-500/70",
          contrast: "",
          hoverable: "border-teal-500/30 hover:border-teal-500/70",
        },
        supportGroup: {
          default: "border-purple-500",
          contrast: "",
          hoverable: "border-purple-800/30 hover:border-purple-900",
        },
        therapyResource: {
          default: "border-cyan-500",
          contrast: "",
          hoverable: "border-cyan-800/30 hover:border-cyan-900",
        },
        video: {
          default: "border-green-500",
          contrast: "",
          hoverable: "border-green-800/30 hover:border-green-900",
        },
        webinar: {
          default: "border-green-500",
          contrast: "",
          hoverable: "border-green-800/30 hover:border-green-900",
        },
        website: {
          default: "border-red-500",
          contrast: "",
          hoverable: "border-red-500/30 hover:border-red-500/70",
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
        hoverable: "decoration-sky-800/30 hover:decoration-sky-900",
      },
    },
  },
  typography: {
    color: {
      primary: {
        default: "text-sky-800",
        contrast: "text-stone-50",
      },
    },
  },
};
