export const theme = {
  colors: {
    // Brand colors
    primary: {
      DEFAULT: '#F3BD50', // Updated yellow
      hover: '#E1AD40',
      light: '#FEF9EE',
    },
    secondary: {
      DEFAULT: '#00B074', // Updated green
      hover: '#009E68',
      light: '#E6F6F1',
    },
    accent: {
      DEFAULT: '#4267B2', // Facebook blue
      hover: '#375593',
    },
    danger: {
      DEFAULT: '#DC3545',
      hover: '#C82333',
    },

    // Text colors
    text: {
      primary: '#1F2937', // Dark text
      secondary: '#6B7280', // Gray text
      muted: '#9CA3AF', // Light gray text
      white: '#FFFFFF',
    },

    // Background colors
    background: {
      white: '#FFFFFF',
      gray: '#F9FAFB',
      light: '#F3F4F6',
    },

    // Border colors
    border: {
      DEFAULT: '#E5E7EB',
      focus: '#00B074', // Updated to match secondary
    },
  },

  // Font sizes match the design
  fontSize: {
    xs: ['11px', { lineHeight: '16px' }],
    sm: ['13px', { lineHeight: '20px' }],
    base: ['16px', { lineHeight: '24px' }],
  },

  // Font families
  fontFamily: {
    sans: ['Open Sans', 'system-ui', 'sans-serif'],
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    DEFAULT: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
  },

  // Spacing
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
  },

  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT:
      '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  },
} as const;
