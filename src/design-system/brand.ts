export const brand = {
  colors: {
    primary: '#00E88F',
    primaryDark: '#007A4A',
    primarySoft: 'rgba(0,232,143,0.12)',
    background: '#050505',
    surface: '#0A0A0A',
    text: '#FFFFFF',
    muted: '#A1A1AA',
  },
  radius: {
    icon: 22,
    card: 20,
    button: 16,
  },
  glow: {
    soft: '0 0 24px rgba(0,232,143,0.14)',
    medium: '0 0 36px rgba(0,232,143,0.22)',
  },
} as const;

export type AthenaTheme = 'dark' | 'light' | 'auto';
