export const tokens = {
  colors: {
    // Brand
    primary: { 
      50: '#E6FFF5', 100: '#B3FFDD', 300: '#66FFB8', 
      500: '#00E88F', 700: '#00A867', 900: '#00553A' 
    },
    // Semantic
    success: '#00E88F',
    warning: '#F59E0B', 
    danger:  '#F43F5E',
    info:    '#06B6D4',
    // Feature colors
    foco:       '#00E88F',
    questoes:   '#06B6D4',
    redacao:    '#F43F5E',
    flashcards: '#8B5CF6',
    salas:      '#EC4899',
    elite:      '#F59E0B',
    // Surfaces
    bg:      { base: '#0A0A0B', raised: '#141416', overlay: '#1C1C20' },
    border:  { subtle: 'rgba(255,255,255,0.06)', default: 'rgba(255,255,255,0.1)', strong: 'rgba(255,255,255,0.18)' },
    text:    { primary: '#FFFFFF', secondary: 'rgba(255,255,255,0.7)', tertiary: 'rgba(255,255,255,0.45)', disabled: 'rgba(255,255,255,0.25)' },
  },
  radius: { xs: 6, sm: 10, md: 14, lg: 20, xl: 28, full: 9999 },
  spacing: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48 },
  typography: {
    display: { size: 32, weight: 800, lineHeight: 1.1, tracking: '-0.02em' },
    h1:      { size: 24, weight: 800, lineHeight: 1.2, tracking: '-0.01em' },
    h2:      { size: 20, weight: 700, lineHeight: 1.25 },
    h3:      { size: 17, weight: 700, lineHeight: 1.3 },
    body:    { size: 14, weight: 500, lineHeight: 1.5 },
    caption: { size: 12, weight: 500, lineHeight: 1.4 },
    micro:   { size: 10, weight: 600, lineHeight: 1.3, tracking: '0.05em' },
  },
  shadows: {
    glow: (color: string) => `0 0 20px ${color}40, 0 0 40px ${color}20`,
    card: '0 4px 12px -2px rgba(0,0,0,0.4), 0 2px 4px -1px rgba(0,0,0,0.3)',
    modal: '0 24px 48px -12px rgba(0,0,0,0.8), 0 8px 16px -4px rgba(0,0,0,0.5)',
    inset: 'inset 0 1px 0 rgba(255,255,255,0.08)',
  },
  motion: {
    spring: { gentle: { type: 'spring', stiffness: 200, damping: 25 }, snappy: { type: 'spring', stiffness: 400, damping: 30 }, bouncy: { type: 'spring', stiffness: 500, damping: 20 } },
    ease: { out: [0.16, 1, 0.3, 1], inOut: [0.65, 0, 0.35, 1] },
    duration: { fast: 0.15, normal: 0.25, slow: 0.4, lazy: 0.6 },
  },
  blur: { sm: 'blur(8px)', md: 'blur(20px)', lg: 'blur(40px) saturate(180%)', xl: 'blur(60px) saturate(200%) brightness(1.1)' },
  z: { base: 0, raised: 10, nav: 50, modal: 100, toast: 200, max: 9999 },
};
