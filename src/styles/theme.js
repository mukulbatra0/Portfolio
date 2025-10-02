// Centralized theme configuration

export const theme = {
  // Color Palette
  colors: {
    primary: {
      dark: '#0F172A',
      light: '#1e293b',
      gradient: 'linear-gradient(135deg, #0F172A, #1e293b)'
    },
    accent: {
      cyan: '#22D3EE',
      cyanLight: '#67e8f9',
      cyanDark: '#0891b2',
      gradient: 'linear-gradient(135deg, #22D3EE, #0891b2)'
    },
    neutral: {
      slate: '#64748B',
      slateLight: '#94a3b8',
      slateDark: '#475569'
    },
    surface: {
      light: '#F4F4F4',
      glass: 'rgba(244, 244, 244, 0.1)',
      glassDark: 'rgba(15, 23, 42, 0.8)'
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },

  // Typography Scale
  typography: {
    fontFamily: {
      primary: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace']
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },
    lineHeight: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2
    }
  },

  // Spacing Scale
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem',
    '4xl': '8rem',
    '5xl': '12rem'
  },

  // Border Radius
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px'
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    glow: '0 0 20px rgba(34, 211, 238, 0.3)',
    glowLg: '0 0 30px rgba(34, 211, 238, 0.4)',
    glowXl: '0 0 40px rgba(34, 211, 238, 0.5)'
  },

  // Animation Durations
  animation: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.5s',
    slower: '0.8s',
    slowest: '1.2s'
  },

  // Easing Functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },

  // Breakpoints
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '3xl': '1600px'
  },

  // Z-Index Scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  },

  // Glass Morphism Presets
  glass: {
    light: {
      background: 'rgba(244, 244, 244, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(34, 211, 238, 0.2)',
      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.1)'
    },
    medium: {
      background: 'rgba(244, 244, 244, 0.15)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(34, 211, 238, 0.3)',
      boxShadow: '0 12px 40px rgba(15, 23, 42, 0.15)'
    },
    heavy: {
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(34, 211, 238, 0.4)',
      boxShadow: '0 16px 48px rgba(15, 23, 42, 0.2)'
    }
  },

  // Component Variants
  components: {
    button: {
      sizes: {
        sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
        md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
        lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
        xl: { padding: '1.25rem 2.5rem', fontSize: '1.25rem' }
      }
    },
    card: {
      variants: {
        glass: 'glass-card',
        solid: 'bg-primary-800 border border-neutral-slate/20',
        gradient: 'bg-gradient-card'
      }
    }
  }
}

// CSS Custom Properties Generator
export const generateCSSVariables = () => {
  return `
    :root {
      /* Colors */
      --color-primary-dark: ${theme.colors.primary.dark};
      --color-accent-cyan: ${theme.colors.accent.cyan};
      --color-neutral-slate: ${theme.colors.neutral.slate};
      --color-surface-light: ${theme.colors.surface.light};
      
      /* Spacing */
      --spacing-xs: ${theme.spacing.xs};
      --spacing-sm: ${theme.spacing.sm};
      --spacing-md: ${theme.spacing.md};
      --spacing-lg: ${theme.spacing.lg};
      --spacing-xl: ${theme.spacing.xl};
      
      /* Animation */
      --duration-fast: ${theme.animation.fast};
      --duration-normal: ${theme.animation.normal};
      --duration-slow: ${theme.animation.slow};
      
      /* Easing */
      --ease-out: ${theme.easing.easeOut};
      --ease-bounce: ${theme.easing.bounce};
    }
  `
}

export default theme