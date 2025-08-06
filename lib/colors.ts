/**
 * Color Utility Module
 * Provides dynamic color management and semantic color mappings
 */

export const colorPalette = {
  // Original Coolors palette
  mint: {
    light: 'hsl(var(--mint-light))',
    css: '--mint-light',
    hex: '#E5F4E3',
    description: 'Light mint green - Perfect for success states and nature themes'
  },
  sky: {
    light: 'hsl(var(--sky-blue))',
    css: '--sky-blue',
    hex: '#5DA9E9',
    description: 'Sky blue - Ideal for informational content and primary actions'
  },
  navy: {
    light: 'hsl(var(--navy-blue))',
    css: '--navy-blue',
    hex: '#003F91',
    description: 'Navy blue - Professional brand color for headers and important elements'
  },
  pure: {
    light: 'hsl(var(--pure-white))',
    css: '--pure-white',
    hex: '#FFFFFF',
    description: 'Pure white - Clean backgrounds and text contrast'
  },
  plum: {
    light: 'hsl(var(--plum-purple))',
    css: '--plum-purple',
    hex: '#6D326D',
    description: 'Plum purple - Accent color for highlights and special elements'
  }
} as const;

// Semantic color mappings for better UX
export const semanticColors = {
  success: 'hsl(var(--success))', // mint
  info: 'hsl(var(--info))',       // sky
  brand: 'hsl(var(--brand))',     // navy
  neutral: 'hsl(var(--neutral))', // pure
  highlight: 'hsl(var(--highlight))', // plum
} as const;

// Tailwind class generators
export const bgClasses = {
  mint: 'bg-mint',
  sky: 'bg-sky',
  navy: 'bg-navy',
  pure: 'bg-pure',
  plum: 'bg-plum',
  success: 'bg-success',
  info: 'bg-info',
  brand: 'bg-brand',
  neutral: 'bg-neutral',
  highlight: 'bg-highlight',
} as const;

export const textClasses = {
  mint: 'text-mint',
  sky: 'text-sky',
  navy: 'text-navy',
  pure: 'text-pure',
  plum: 'text-plum',
  success: 'text-success',
  info: 'text-info',
  brand: 'text-brand',
  neutral: 'text-neutral',
  highlight: 'text-highlight',
} as const;

export const borderClasses = {
  mint: 'border-mint',
  sky: 'border-sky',
  navy: 'border-navy',
  pure: 'border-pure',
  plum: 'border-plum',
  success: 'border-success',
  info: 'border-info',
  brand: 'border-brand',
  neutral: 'border-neutral',
  highlight: 'border-highlight',
} as const;

// Utility functions
export const getColorByContext = (context: 'success' | 'info' | 'brand' | 'neutral' | 'highlight') => {
  return semanticColors[context];
};

export const getContrastingText = (bgColor: keyof typeof bgClasses) => {
  // Return appropriate text color for each background
  const contrastMap = {
    mint: 'text-navy',
    sky: 'text-pure',
    navy: 'text-pure',
    pure: 'text-navy',
    plum: 'text-pure',
    success: 'text-navy',
    info: 'text-pure',
    brand: 'text-pure',
    neutral: 'text-navy',
    highlight: 'text-pure',
  };
  return contrastMap[bgColor];
};

// Color combinations for common UI patterns
export const colorCombinations = {
  primary: {
    bg: bgClasses.brand,
    text: textClasses.pure,
    border: borderClasses.brand,
  },
  secondary: {
    bg: bgClasses.sky,
    text: textClasses.pure,
    border: borderClasses.sky,
  },
  success: {
    bg: bgClasses.success,
    text: textClasses.navy,
    border: borderClasses.success,
  },
  info: {
    bg: bgClasses.info,
    text: textClasses.pure,
    border: borderClasses.info,
  },
  highlight: {
    bg: bgClasses.highlight,
    text: textClasses.pure,
    border: borderClasses.highlight,
  },
  neutral: {
    bg: bgClasses.neutral,
    text: textClasses.navy,
    border: borderClasses.navy,
  },
} as const;

export type ColorContext = keyof typeof colorCombinations;
export type ColorName = keyof typeof colorPalette;
