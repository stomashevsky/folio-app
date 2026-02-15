/**
 * Shared chart color tokens using CSS variables.
 * Colors respond to theme changes (light/dark mode).
 */
export const CHART_COLORS = {
  primary: "var(--color-chart-primary)",
  secondary: "var(--color-chart-secondary)",
  muted: "var(--color-chart-muted)",
  textMuted: "var(--color-chart-text-muted)",
  accent: "var(--color-chart-accent)",
  success: "var(--color-chart-success)",
  danger: "var(--color-chart-danger)",
  neutral: "var(--color-chart-neutral)",
} as const;
