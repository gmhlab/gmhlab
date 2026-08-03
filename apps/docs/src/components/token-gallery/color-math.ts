export type Rgba = [number, number, number, number];

/** Parse `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb()`/`rgba()` strings. */
export function parseColor(value: string): Rgba | null {
  const v = value.trim();
  if (v.startsWith("#")) {
    const hex = v.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      const [r, g, b, a] = hex.split("").map((c) => parseInt(c + c, 16));
      return [r, g, b, hex.length === 4 ? a / 255 : 1];
    }
    if (hex.length === 6 || hex.length === 8) {
      const n = (i: number) => parseInt(hex.slice(i, i + 2), 16);
      return [n(0), n(2), n(4), hex.length === 8 ? n(6) / 255 : 1];
    }
    return null;
  }
  const m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)$/.exec(v);
  if (m) {
    const alpha = m[4] ? (m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4])) : 1;
    return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]), alpha];
  }
  return null;
}

/** Composite a possibly-translucent color over an opaque base. */
export function flatten(color: Rgba, base: Rgba): Rgba {
  const a = color[3];
  if (a >= 1) return color;
  return [
    color[0] * a + base[0] * (1 - a),
    color[1] * a + base[1] * (1 - a),
    color[2] * a + base[2] * (1 - a),
    1,
  ];
}

function luminance([r, g, b]: Rgba): number {
  const chan = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
}

/** WCAG 2.x contrast ratio between two colors, translucency flattened over `base`. */
export function contrastRatio(fg: Rgba, bg: Rgba, base: Rgba): number {
  const solidBg = flatten(bg, base);
  const solidFg = flatten(fg, solidBg);
  const l1 = luminance(solidFg);
  const l2 = luminance(solidBg);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}
