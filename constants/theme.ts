/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

/** Figma design tokens — Indep/Лизинг */
export const Theme = {
  colors: {
    primary: '#DB4431',
    primaryBadgeBg: '#FBDAD6',
    text: '#1E1E1E',
    textSecondary: '#777777',
    background: '#FFFFFF',
    cardBg: '#FFFFFF',
    cardBgMuted: '#F1F1F1',
    border: '#E8E8E8',
    btnGray: '#777777',
    white: '#FFFFFF',
    closeIcon: '#CFCFCF',
    overlay: 'rgba(0,0,0,0.35)',
  },
  radius: {
    card: 16,
    modal: 20,
    btn: 12,
    badge: 11,
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 22,
    xl: 28,
  },
  typography: {
    h1: { fontSize: 30, fontWeight: '700' as const },
    h2: { fontSize: 20, fontWeight: '700' as const },
    h3: { fontSize: 18, fontWeight: '500' as const },
    body: { fontSize: 14, fontWeight: '400' as const },
    bodySmall: { fontSize: 12, fontWeight: '400' as const },
    btn: { fontSize: 16, fontWeight: '500' as const },
    amount: { fontSize: 44, fontWeight: '700' as const },
    caption: { fontSize: 18, fontWeight: '500' as const },
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
