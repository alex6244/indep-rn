/** Rendered size of a Figma frame (or SVG viewBox). */
export type FigmaLayoutSize = {
  width: number;
  height: number;
};

/**
 * Scales a Figma spacing value when the rendered container differs from the design frame.
 */
export function scaleFigmaInset(
  value: number,
  layout: FigmaLayoutSize,
  design: FigmaLayoutSize,
  axis: keyof FigmaLayoutSize,
): number {
  const base = design[axis];
  if (base <= 0) return value;
  return (layout[axis] * value) / base;
}
