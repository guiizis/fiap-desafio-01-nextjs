import type { Config } from "tailwindcss";

const config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./lib/**/*.{ts,tsx}",
    "./styles/**/*.{css,mdx}",
    "./.storybook/**/*.{ts,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-muted": "var(--color-surface-muted)",
        "surface-soft": "var(--color-surface-soft)",
        "surface-transaction": "var(--color-surface-transaction)",
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        secondary: "var(--color-secondary)",
        "secondary-hover": "var(--color-secondary-hover)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        heading: "var(--color-text-heading)",
        body: "var(--color-text-body)",
        subtle: "var(--color-text-subtle)",
        "transaction-text": "var(--color-text-transaction)",
        border: "var(--color-border)",
        error: "var(--color-error)",
        success: "var(--color-success)",
        menu: {
          active: "var(--menu-active)",
          hover: "var(--menu-hover)",
          disabled: "var(--menu-disabled)"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)"]
      },
      fontSize: {
        "title-xl": "var(--text-title-xl)",
        "title-lg": "var(--text-title-lg)",
        "body-md": "var(--text-body-md)",
        "body-sm": "var(--text-body-sm)"
      },
      spacing: {
        2: "var(--space-2)",
        4: "var(--space-4)",
        6: "var(--space-6)"
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)"
      }
    }
  }
} satisfies Config;

export default config;
