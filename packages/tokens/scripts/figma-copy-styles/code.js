// GMH — Copy Styles. Reads every local paint, text, effect and grid style in
// the open file and shows it as JSON (lossless) or CSS to copy and paste.
// Read-only: it never writes to the file.
//
// Plain ES2017 on purpose (no ?. ?? or object spread) and only the async
// style/variable APIs, which are the ones `documentAccess: "dynamic-page"`
// allows.

figma.showUI(__html__, { width: 560, height: 640, themeColors: true });
figma.ui.onmessage = function (msg) {
  if (msg && msg.type === "refresh") run();
};
run();

async function run() {
  try {
    figma.ui.postMessage(await build());
  } catch (error) {
    figma.ui.postMessage({
      error: "Could not read the styles.\n\n" + String((error && error.stack) || error),
    });
  }
}

// Style properties are getters, not enumerable keys, so each kind lists what
// to read. Each read is guarded: a property this Figma version lacks is
// skipped rather than fatal.
const PROPS = {
  paint: ["paints"],
  text: [
    "fontName", "fontSize", "lineHeight", "letterSpacing", "textCase",
    "textDecoration", "textDecorationStyle", "textDecorationOffset",
    "textDecorationThickness", "textDecorationColor", "textDecorationSkipInk",
    "paragraphSpacing", "paragraphIndent", "listSpacing", "leadingTrim",
    "hangingPunctuation", "hangingList",
  ],
  effect: ["effects"],
  grid: ["layoutGrids"],
};

async function build() {
  const resolver = makeResolver(
    await figma.variables.getLocalVariablesAsync(),
    await figma.variables.getLocalVariableCollectionsAsync(),
  );
  const styles = {
    paint: await figma.getLocalPaintStylesAsync(),
    text: await figma.getLocalTextStylesAsync(),
    effect: await figma.getLocalEffectStylesAsync(),
    grid: await figma.getLocalGridStylesAsync(),
  };

  const exported = new Date().toISOString();
  const json = { file: figma.root.name, exported: exported };
  for (const kind of Object.keys(PROPS)) {
    json[kind] = [];
    for (const style of styles[kind]) {
      const entry = { name: style.name };
      for (const prop of PROPS[kind].concat("boundVariables")) {
        let value;
        try { value = style[prop]; } catch (e) { continue; }
        if (value === undefined || value === figma.mixed) continue;
        if (prop === "boundVariables" && !Object.keys(value).length) continue;
        entry[prop] = await clean(value, resolver);
      }
      entry.description = style.description || "";
      entry.id = style.id;
      entry.key = style.key || null;
      json[kind].push(entry);
    }
  }

  const css = ["/* " + figma.root.name + " — styles, " + exported + " */"];
  await section(css, "Paint styles → custom properties", styles.paint, (s) => paintCss(s, resolver), true);
  await section(css, "Effect styles → custom properties", styles.effect, (s) => effectCss(s, resolver), true);
  await section(css, "Text styles → classes", styles.text, (s) => textCss(s, resolver));
  await section(css, "Grid styles (no CSS equivalent)", styles.grid, gridCss);

  const total = styles.paint.length + styles.text.length + styles.effect.length + styles.grid.length;
  const missing = resolver.missing();
  return {
    outputs: { json: JSON.stringify(json, null, 2), css: css.join("\n") + "\n" },
    summary:
      plural(total, "style") + " · " + styles.paint.length + " paint, " + styles.text.length +
      " text, " + styles.effect.length + " effect, " + styles.grid.length + " grid" +
      (missing ? " · " + plural(missing, "variable") + " this file can't see" : ""),
  };
}

// One style failing to render becomes a comment naming it; the rest still
// print. Custom properties are only valid inside a rule, hence `inRoot`.
async function section(lines, heading, list, render, inRoot) {
  if (!list.length) return;
  lines.push("", "/* " + heading + " */");
  if (inRoot) lines.push(":root {");
  for (const style of list) {
    let out;
    try { out = await render(style); } catch (e) { out = "/* " + style.name + ": " + e + " */"; }
    lines.push(inRoot ? out.replace(/^/gm, "  ") : out);
  }
  if (inRoot) lines.push("}");
}

// ---------- JSON ----------

// A generic deep copy: colours become hex, variable aliases become
// { alias, css } so the output reads by name. Unknown fields pass through,
// so a new Figma property shows up instead of vanishing.
async function clean(value, resolver) {
  if (Array.isArray(value)) {
    const out = [];
    for (const item of value) out.push(await clean(item, resolver));
    return out;
  }
  if (value === null || typeof value !== "object") return value;
  if (isAlias(value)) return resolver.ref(value.id);
  if (isColor(value)) return hex(value);
  const out = {};
  for (const key of Object.keys(value)) {
    if (value[key] === undefined) continue;
    out[key] = await clean(value[key], resolver);
  }
  return out;
}

// ---------- CSS ----------

async function paintCss(style, resolver) {
  const layers = [];
  for (const paint of style.paints) {
    if (paint.visible === false) continue;
    layers.push(await paintValue(paint, resolver));
  }
  const name = "--" + slug(style.name);
  if (!layers.length) return name + ": transparent;";
  if (layers.length === 1) return name + ": " + layers[0] + ";";
  // Figma lists paints bottom-up, CSS layers top-down; a solid only layers
  // as an image.
  return name + ": " + layers.reverse()
    .map((l) => (/gradient\(/.test(l) || /^\/\*/.test(l) ? l : "linear-gradient(" + l + ", " + l + ")"))
    .join(", ") + ";";
}

async function paintValue(paint, resolver) {
  const opacity = paint.opacity === undefined ? 1 : paint.opacity;
  if (paint.type === "SOLID") {
    return color(paint.color, opacity, paint.boundVariables && paint.boundVariables.color, resolver);
  }
  const fn = { GRADIENT_LINEAR: "linear", GRADIENT_RADIAL: "radial", GRADIENT_ANGULAR: "conic" }[paint.type];
  if (fn) {
    const stops = [];
    for (const stop of paint.gradientStops) {
      const c = await color(stop.color, opacity, stop.boundVariables && stop.boundVariables.color, resolver);
      stops.push(c + " " + num(stop.position * 100) + "%");
    }
    const lead = fn === "linear" ? linearAngle(paint.gradientTransform) + ", " : "";
    return fn + "-gradient(" + lead + stops.join(", ") + ")";
  }
  return "/* " + paint.type.toLowerCase().replace(/_/g, " ") + " paint */";
}

async function effectCss(style, resolver) {
  const shadows = [];
  const filters = [];
  for (const effect of style.effects) {
    if (effect.visible === false) continue;
    const bound = effect.boundVariables || {};
    const length = async (key, n) => (bound[key] ? await resolver.cssRef(bound[key].id, n + "px") : n + "px");
    if (effect.type === "DROP_SHADOW" || effect.type === "INNER_SHADOW") {
      shadows.push(
        (effect.type === "INNER_SHADOW" ? "inset " : "") +
        [
          await length("offsetX", num(effect.offset.x)),
          await length("offsetY", num(effect.offset.y)),
          await length("radius", num(effect.radius)),
          await length("spread", num(effect.spread || 0)),
          await color(effect.color, 1, bound.color, resolver),
        ].join(" "),
      );
    } else if (effect.type === "LAYER_BLUR" || effect.type === "BACKGROUND_BLUR") {
      // Figma's blur radius is twice CSS's standard deviation.
      const prop = effect.type === "LAYER_BLUR" ? "filter" : "backdrop-filter";
      filters.push(prop + ": blur(" + num(effect.radius / 2) + "px)");
    } else {
      filters.push(effect.type.toLowerCase().replace(/_/g, " ") + " effect");
    }
  }
  const name = "--" + slug(style.name);
  const lines = [];
  if (shadows.length) lines.push(name + ": " + shadows.join(", ") + ";");
  for (const f of filters) lines.push("/* " + style.name + ": " + f + " */");
  return lines.join("\n") || name + ": none;";
}

const TEXT_CASE = {
  UPPER: "text-transform: uppercase",
  LOWER: "text-transform: lowercase",
  TITLE: "text-transform: capitalize",
  SMALL_CAPS: "font-variant-caps: small-caps",
  SMALL_CAPS_FORCED: "font-variant-caps: all-small-caps",
};

async function textCss(style, resolver) {
  const bound = style.boundVariables || {};
  const ref = (key, literal) => (bound[key] ? resolver.cssRef(bound[key].id, literal) : literal);
  const fontStyle = style.fontName.style;
  const decls = [
    ["font-family", await ref("fontFamily", JSON.stringify(style.fontName.family))],
    ["font-weight", await ref("fontWeight", String(weightOf(fontStyle)))],
  ];
  if (/italic|oblique/i.test(fontStyle)) decls.push(["font-style", "italic"]);
  decls.push(["font-size", await ref("fontSize", num(style.fontSize) + "px")]);

  const lh = style.lineHeight;
  const lhLiteral = lh.unit === "AUTO" ? "normal"
    : lh.unit === "PERCENT" ? num(lh.value / 100)
    : num(lh.value) + "px";
  decls.push(["line-height", await ref("lineHeight", lhLiteral)]);

  const ls = style.letterSpacing;
  const lsLiteral = ls.unit === "PERCENT" ? num(ls.value / 100) + "em" : num(ls.value) + "px";
  if (ls.value !== 0 || bound.letterSpacing) decls.push(["letter-spacing", await ref("letterSpacing", lsLiteral)]);

  if (TEXT_CASE[style.textCase]) decls.push(TEXT_CASE[style.textCase].split(": "));
  if (style.textDecoration === "UNDERLINE") decls.push(["text-decoration-line", "underline"]);
  if (style.textDecoration === "STRIKETHROUGH") decls.push(["text-decoration-line", "line-through"]);
  if (style.paragraphSpacing || bound.paragraphSpacing) {
    decls.push(["margin-block-end", await ref("paragraphSpacing", num(style.paragraphSpacing) + "px")]);
  }
  if (style.paragraphIndent || bound.paragraphIndent) {
    decls.push(["text-indent", await ref("paragraphIndent", num(style.paragraphIndent) + "px")]);
  }

  return "." + slug(style.name) + " {\n" + decls.map((d) => "  " + d[0] + ": " + d[1] + ";").join("\n") + "\n}";
}

function gridCss(style) {
  const parts = style.layoutGrids.map((g) =>
    g.pattern === "GRID"
      ? "grid " + num(g.sectionSize) + "px"
      : g.pattern.toLowerCase() + " ×" + (g.count === Infinity ? "auto" : g.count) +
        ", gutter " + num(g.gutterSize) + "px" +
        (g.alignment === "STRETCH" ? ", margin " + num(g.offset) + "px" : ", " + g.alignment.toLowerCase()) +
        (g.alignment !== "STRETCH" && g.sectionSize ? ", size " + num(g.sectionSize) + "px" : ""),
  );
  return "/* " + style.name + ": " + (parts.join("; ") || "empty") + " */";
}

// A colour, through its variable when bound. A bound colour at reduced paint
// opacity becomes a transparent mix, in sRGB (packages/tokens/CLAUDE.md).
async function color(c, opacity, alias, resolver) {
  const literalAlpha = (c.a === undefined ? 1 : c.a) * opacity;
  const literal = hex({ r: c.r, g: c.g, b: c.b, a: literalAlpha });
  if (!alias) return literal;
  const ref = await resolver.cssRef(alias.id, literal);
  return opacity < 1
    ? "color-mix(in srgb, " + ref + " " + num(opacity * 100) + "%, transparent)"
    : ref;
}

// Figma's gradientTransform maps the layer's unit box into gradient space,
// where the handles sit at (0, .5) → (1, .5). Invert it to find the handles
// on the layer and turn that direction into a CSS angle. Exact for a square
// layer; on a non-square one CSS stretches the angle differently.
function linearAngle(t) {
  const a = t[0][0], b = t[0][1], c = t[0][2], d = t[1][0], e = t[1][1], f = t[1][2];
  const det = a * e - b * d;
  if (!det) return "180deg";
  const inv = (x, y) => [
    (e * (x - c) - b * (y - f)) / det,
    (-d * (x - c) + a * (y - f)) / det,
  ];
  const p0 = inv(0, 0.5);
  const p1 = inv(1, 0.5);
  const deg = (Math.atan2(p1[0] - p0[0], -(p1[1] - p0[1])) * 180) / Math.PI;
  return num((deg + 360) % 360) + "deg";
}

// ---------- lookup ----------

// Local variables are preloaded; a library variable is fetched once and
// cached. A failed lookup is counted, not thrown.
function makeResolver(localVariables, localCollections) {
  const variables = new Map(localVariables.map((v) => [v.id, v]));
  const collections = new Map(localCollections.map((c) => [c.id, c]));
  const missing = new Set();

  async function variable(id) {
    if (variables.has(id)) return variables.get(id);
    let v = null;
    try { v = await figma.variables.getVariableByIdAsync(id); } catch (e) {}
    variables.set(id, v);
    if (!v) missing.add(id);
    return v;
  }
  async function collection(id) {
    if (collections.has(id)) return collections.get(id);
    let c = null;
    try { c = await figma.variables.getVariableCollectionByIdAsync(id); } catch (e) {}
    collections.set(id, c);
    return c;
  }
  // Same naming rule as the variables plugin: WEB code syntax when set,
  // otherwise collection + name.
  function cssName(v, c) {
    const web = v.codeSyntax && v.codeSyntax.WEB;
    if (web) {
      const m = /^\s*var\(\s*(--[^,\s)]+)/.exec(web) || /^\s*(--\S+)\s*$/.exec(web);
      if (m) return m[1];
    }
    return "--" + slug((c ? c.name + "-" : "") + v.name);
  }
  async function ref(id) {
    const v = await variable(id);
    if (!v) return { alias: null, missingId: id };
    const c = await collection(v.variableCollectionId);
    return { alias: (c ? c.name : "?") + "/" + v.name, css: cssName(v, c) };
  }
  // var(--x) for a variable this file can see; otherwise the style's own
  // resolved value, flagged.
  async function cssRef(id, literal) {
    const r = await ref(id);
    return r.css ? "var(" + r.css + ")" : literal + " /* unavailable variable */";
  }
  return { ref, cssRef, missing: () => missing.size };
}

// ---------- helpers ----------

const WEIGHTS = {
  thin: 100, hairline: 100, extralight: 200, ultralight: 200, light: 300,
  regular: 400, normal: 400, book: 400, roman: 400, medium: 500,
  semibold: 600, demibold: 600, bold: 700, extrabold: 800, ultrabold: 800,
  black: 900, heavy: 900,
};
function weightOf(fontStyle) {
  const key = String(fontStyle).replace(/italic|oblique/gi, "").replace(/[^a-z]/gi, "").toLowerCase();
  return WEIGHTS[key] || 400;
}
function isAlias(value) {
  return value !== null && typeof value === "object" && value.type === "VARIABLE_ALIAS";
}
function isColor(value) {
  return value !== null && typeof value === "object" && "r" in value && "g" in value && "b" in value;
}
function hex(c) {
  const h = (x) => Math.round(Math.min(1, Math.max(0, x)) * 255).toString(16).padStart(2, "0");
  const a = c.a === undefined ? 1 : c.a;
  return ("#" + h(c.r) + h(c.g) + h(c.b) + (a < 1 ? h(a) : "")).toUpperCase();
}
function num(n) {
  return String(Math.round(n * 10000) / 10000);
}
function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function plural(n, one, many) {
  return n.toLocaleString() + " " + (n === 1 ? one : many || one + "s");
}
