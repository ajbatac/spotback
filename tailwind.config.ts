import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        body: ['PT Sans', 'sans-serif'],
        headline: ['PT Sans', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      boxShadow: {
        'neumorphic': '8px 8px 16px hsl(var(--background) / 0.7), -8px -8px 16px hsl(0 0% 100% / 0.8)',
        'neumorphic-lg': '12px 12px 24px hsl(var(--background) / 0.7), -12px -12px 24px hsl(0 0% 100% / 0.8)',
        'neumorphic-sm': '4px 4px 8px hsl(var(--background) / 0.7), -4px -4px 8px hsl(0 0% 100% / 0.8)',
        'neumorphic-inset': 'inset 8px 8px 16px hsl(var(--background) / 0.7), inset -8px -8px 16px hsl(0 0% 100% / 0.8)',
        'neumorphic-inset-sm': 'inset 4px 4px 8px hsl(var(--background) / 0.7), inset -4px -4px 8px hsl(0 0% 100% / 0.8)',
        'dark-neumorphic': '8px 8px 16px hsl(0 0% 0% / 0.2), -8px -8px 16px hsl(var(--background) / 0.1)',
        'dark-neumorphic-inset': 'inset 8px 8px 16px hsl(0 0% 0% / 0.2), inset -8px -8px 16px hsl(var(--background) / 0.1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
