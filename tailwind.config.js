/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Enterprise brand colors (toned-down from neon)
        brand: {
          50: "hsl(200 80% 95%)",
          100: "hsl(200 75% 85%)",
          200: "hsl(200 70% 75%)",
          300: "hsl(200 65% 65%)",
          400: "hsl(200 60% 55%)",
          500: "hsl(200 60% 50%)",
          600: "hsl(200 65% 42%)",
          700: "hsl(200 65% 35%)",
          800: "hsl(200 60% 25%)",
          900: "hsl(200 55% 18%)",
        },
        "accent-brand": {
          400: "hsl(160 55% 50%)",
          500: "hsl(160 50% 45%)",
          600: "hsl(160 55% 38%)",
        },
        // Keep neon aliases for backward compat (slightly toned down)
        neon: {
          cyan: "hsl(200 60% 50%)",
          green: "hsl(160 55% 50%)",
          purple: "hsl(265 50% 55%)",
          pink: "hsl(330 50% 55%)",
          blue: "hsl(210 60% 55%)",
        },
        dark: {
          bg: "hsl(220 20% 7%)",
          panel: "hsl(220 18% 10%)",
          card: "hsl(220 18% 12%)",
        },
      },
      fontFamily: {
        display: ['Orbitron', 'Inter', 'sans-serif'],
        body: ['Inter', 'Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'Share Tech Mono', 'monospace'],
        // Keep old aliases as fallbacks
        orbitron: ['Orbitron', 'Inter', 'sans-serif'],
        rajdhani: ['Inter', 'Rajdhani', 'sans-serif'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        // Toned-down glow effects (enterprise feel)
        'neon-cyan': '0 0 4px hsl(200 60% 50% / 0.4), 0 0 8px hsl(200 60% 50% / 0.2)',
        'neon-green': '0 0 4px hsl(160 55% 50% / 0.4), 0 0 8px hsl(160 55% 50% / 0.2)',
        'neon-purple': '0 0 4px hsl(265 50% 55% / 0.4), 0 0 8px hsl(265 50% 55% / 0.2)',
        'holo-panel': '0 0 0 1px hsl(200 60% 50% / 0.08), 0 4px 16px hsl(200 60% 50% / 0.06), inset 0 1px 0 hsl(200 60% 50% / 0.06)',
        'glow-cyan': '0 0 12px hsl(200 60% 50% / 0.25)',
        'glow-green': '0 0 12px hsl(160 55% 50% / 0.25)',
        'glow-purple': '0 0 12px hsl(265 50% 55% / 0.25)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 3px hsl(200 60% 50% / 0.3)" },
          "50%": { boxShadow: "0 0 10px hsl(200 60% 50% / 0.4)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "rotate-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "float": "float 4s ease-in-out infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
        "shimmer": "shimmer 3s linear infinite",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'holo-gradient': 'linear-gradient(135deg, hsl(220 18% 12% / 0.9) 0%, hsl(220 18% 10% / 0.95) 50%, hsl(220 18% 12% / 0.9) 100%)',
        'neon-line': 'linear-gradient(90deg, transparent 0%, hsl(200 60% 50% / 0.5) 50%, transparent 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
