import values from "./primitive.tokens.json";

const baseTokens = {
  color: {
    brand: {
      "dark-blue": values.color.blue[30],
      "powder-blue": values.color.blue[91],
      "sky-blue": values.color.sky[57],
      "cornflower-yellow": values.color.yellow[82],
    },
    "layout-surface": {
      neutral: {
        prominent: values.color.stone[99],
        default: values.color.stone[98],
        muted: values.color.stone[97],
        "muted-alt": values.color.stone[96],
      },
      primary: {
        default: values.color.blue[97],
        "contrast-default": values.color.blue[25],
      },
      secondary: {
        default: values.color.green[98],
      },
      tertiary: {
        default: values.color.pink[97],
      },
    },
    "content-surface": {
      brand: {
        donate: {
          prominent: values.color.aqua[70],
          default: values.color.aqua[80],
          muted: values.color.aqua[90],
        },
      },
      neutral: {
        prominent: values.color.stone[99],
        default: values.color.stone[98],
        muted: values.color.stone[97],
      },
      primary: {
        prominent: values.color.blue[91],
        default: values.color.blue[95],
        muted: values.color.blue[97],
        "contrast-prominent": values.color.blue[30],
        "contrast-default": values.color.blue[42],
        "contrast-muted": values.color.blue[52],
      },
      secondary: {
        prominent: values.color.green[90],
        default: values.color.green[95],
        muted: values.color.green[98],
      },
      tertiary: {
        prominent: values.color.pink[87],
        default: values.color.pink[95],
        muted: values.color.pink[97],
      },
    },
    text: {
      "on-layout-surface": {
        default: values.color.blue[30],
        muted: values.color.slate[62],
        "contrast-default": values.color.stone[98],
      },
      "on-content-surface": {
        neutral: {
          default: values.color.brown[46],
          muted: values.color.brown[58],
        },
        primary: {
          default: values.color.blue[30],
          muted: values.color.blue[55],
          "contrast-default": values.color.stone[98],
        },
        secondary: {
          default: values.color.blue[30],
        },
        tertiary: {
          default: values.color.blue[30],
        },
      },
    },
    outline: {
      neutral: {
        prominent: values.color.brown[70],
        default: values.color.brown[80],
        muted: values.color.brown[90],
      },
      primary: {
        prominent: values.color.blue[79],
        default: values.color.blue[89],
        muted: values.color.blue[91],
        "contrast-default": values.color.blue[30],
      },
      secondary: {
        prominent: values.color.green[79],
        default: values.color.green[87],
        muted: values.color.green[90],
      },
      tertiary: {
        prominent: values.color.pink[80],
        default: values.color.pink[87],
        muted: values.color.pink[80],
      },
    },
    stroke: {
      primary: values.color.blue[55],
    },
    fill: {
      "resource-type": {
        default: values.color.blue[95],
      },
    },
  },
  typeface: {
    body: values.typeface["serif-stack"]
      .map((f) => (f.includes(" ") || f.includes("-") ? `"${f}"` : f))
      .join(", "),
  },
};

export default {
  // Extend our initial token set with those referencing sibling tokens
  ...baseTokens,
  color: {
    ...baseTokens.color,
    outline: {
      ...baseTokens.color.outline,
      brand: {
        accent: baseTokens.color.brand["cornflower-yellow"],
      },
    },
  },
} as const;
