export type ThemeId = string;

export interface AppTheme {
  id: ThemeId;
  name: string;
  description: string;
  tokens: {
    background: {
      primary: string;
      secondary: string;
      card: string;
      cardHover: string;
      selected: string;
      control: string;
    };
    border: {
      divider: string;
    };
    text: {
      strong: string;
      regular: string;
      secondary: string;
      decorative: string;
      disabled: string;
      inverse: string;
    };
    brand: {
      primary: string;
      hover: string;
      active: string;
      foreground: string;
      light: string;
      rgb: string;
    };
    notification: {
      badge: string;
    };
    indicator: {
      up: string;
      down: string;
    };
    risk: {
      high: string;
      medium: string;
      low: string;
    };
    status: {
      success: string;
      warning: string;
      danger: string;
      info: string;
    };
    sentiment: {
      positive: string;
      neutral: string;
      negative: string;
    };
    chart: readonly string[];
    typography: {
      fontSans: string;
      fontDisplay: string;
      fontData: string;
      bodyFontSize: string;
      bodyLineHeight: string;
    };
    radius: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      full: string;
    };
    spacing: {
      xxs: string;
      xs: string;
      sm: string;
      md: string;
      base: string;
      lg: string;
      xl: string;
      xxl: string;
      section: string;
      pageX: string;
      cardPadding: string;
    };
    shadow: {
      none: string;
      card: string;
      cardHover: string;
      popover: string;
      modal: string;
    };
    overlay: {
      scrim: string;
    };
    link: {
      default: string;
      hover: string;
      muted: string;
      legal: string;
    };
    accent: {
      one: string;
      two: string;
      premium: string;
      standard: string;
    };
    component: {
      button: {
        radius: string;
        height: string;
        paddingX: string;
      };
      card: {
        radius: string;
        padding: string;
        shadow: string;
        hoverShadow: string;
      };
      input: {
        radius: string;
        height: string;
      };
      popover: {
        radius: string;
        padding: string;
        shadow: string;
      };
      modal: {
        radius: string;
        shadow: string;
      };
    };
    shadcn: {
      background: string;
      foreground: string;
      card: string;
      cardForeground: string;
      popover: string;
      popoverForeground: string;
      primary: string;
      primaryForeground: string;
      secondary: string;
      secondaryForeground: string;
      muted: string;
      mutedForeground: string;
      accent: string;
      accentForeground: string;
      destructive: string;
      destructiveForeground: string;
      border: string;
      input: string;
      ring: string;
    };
  };
}
