// GMH — Copy Variables. Reads every local variable collection in the open
// file and shows it as JSON (lossless) or CSS to copy and paste. Read-only:
// it never writes to the file.
//
// Plain ES2017 on purpose (no ?. ?? or object spread) and only the async
// variable APIs, which are the ones `documentAccess: "dynamic-page"` allows.

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
      error: "Could not read the variables.\n\n" + String((error && error.stack) || error),
    });
  }
}

async function build() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const resolver = makeResolver(await figma.variables.getLocalVariablesAsync(), collections);

  const json = {
    file: figma.root.name,
    exported: new Date().toISOString(),
    collections: [],
  };
  const css = ["/* " + figma.root.name + " — variables, " + json.exported + " */"];
  let total = 0;

  for (const collection of collections) {
    const modes = collection.modes;
    const defaultMode = modes.find((m) => m.modeId === collection.defaultModeId) || modes[0];
    const variables = [];
    for (const id of collection.variableIds) {
      const v = await resolver.variable(id);
      if (v) variables.push(v);
    }
    total += variables.length;

    // JSON: everything Figma knows that a person could have curated.
    json.collections.push({
      name: collection.name,
      id: collection.id,
      key: collection.key || null,
      hiddenFromPublishing: Boolean(collection.hiddenFromPublishing),
      modes: modes.map((m) => m.name),
      defaultMode: defaultMode ? defaultMode.name : null,
      variables: await Promise.all(variables.map(async (v) => {
        const values = {};
        for (const mode of modes) {
          values[mode.name] = await jsonValue(v.valuesByMode[mode.modeId], resolver);
        }
        return {
          name: v.name,
          css: resolver.cssName(v),
          type: v.resolvedType,
          values: values,
          description: v.description || "",
          // Verbatim: [] means hidden from every picker, not "all scopes"
          // (Figma writes ["ALL_SCOPES"] for that).
          scopes: v.scopes || [],
          codeSyntax: v.codeSyntax || {},
          hiddenFromPublishing: Boolean(v.hiddenFromPublishing),
          id: v.id,
          key: v.key || null,
        };
      })),
    });

    // CSS: the default mode on :root, every other mode on an attribute
    // selector named after the collection, so nothing silently overrides.
    for (const mode of modes) {
      const isDefault = mode === defaultMode;
      const selector = isDefault
        ? ":root"
        : ':root[data-' + slug(collection.name) + '="' + slug(mode.name) + '"]';
      css.push("", "/* " + collection.name + (modes.length > 1 ? " · " + mode.name : "") + " */", selector + " {");
      for (const v of variables) {
        const value = await cssValue(v, v.valuesByMode[mode.modeId], resolver);
        css.push("  " + resolver.cssName(v) + ": " + value + ";");
      }
      css.push("}");
    }
  }

  const missing = resolver.missing();
  return {
    outputs: { json: JSON.stringify(json, null, 2), css: css.join("\n") + "\n" },
    summary:
      plural(total, "variable") + " · " + plural(collections.length, "collection") +
      (missing ? " · " + plural(missing, "alias", "aliases") + " to a variable this file can't see" : ""),
  };
}

// ---------- values ----------

async function jsonValue(value, resolver) {
  if (value === undefined) return null;
  if (isAlias(value)) {
    const target = await resolver.variable(value.id);
    return target
      ? { alias: await resolver.path(target), css: resolver.cssName(target) }
      : { alias: null, missingId: value.id };
  }
  return isColor(value) ? hex(value) : value;
}

// Units come from the variable's scopes: Figma stores bare numbers, and only
// the scope says whether 16 is pixels, a weight or a 0–100 opacity. Anything
// unscoped (ALL_SCOPES) stays a bare number rather than a guess.
const PX_SCOPES = [
  "CORNER_RADIUS", "WIDTH_HEIGHT", "GAP", "STROKE_FLOAT", "EFFECT_FLOAT",
  "FONT_SIZE", "LINE_HEIGHT", "LETTER_SPACING", "PARAGRAPH_SPACING", "PARAGRAPH_INDENT",
];

async function cssValue(variable, value, resolver) {
  if (value === undefined) return "initial /* no value in this mode */";
  if (isAlias(value)) {
    const target = await resolver.variable(value.id);
    return target ? "var(" + resolver.cssName(target) + ")" : "initial /* alias to an unavailable variable */";
  }
  const scopes = variable.scopes || [];
  switch (variable.resolvedType) {
    case "COLOR":
      return hex(value);
    case "FLOAT":
      return num(value) + (scopes.some((s) => PX_SCOPES.indexOf(s) !== -1) ? "px" : "");
    case "STRING":
      return scopes.indexOf("FONT_FAMILY") !== -1 ? JSON.stringify(value) : String(value);
    default:
      return String(value);
  }
}

// ---------- lookup ----------

// Local variables are preloaded; anything else (a library variable an alias
// points at) is fetched once and cached. A lookup that fails is counted, not
// thrown, so one broken alias can't sink the whole export.
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
  async function path(v) {
    const c = await collection(v.variableCollectionId);
    return (c ? c.name : "?") + "/" + v.name;
  }
  // The WEB code syntax is the CSS name when it is set (GMH Foundations sets it
  // on every variable). Without one, collection + name keeps it unique.
  function cssName(v) {
    const web = v.codeSyntax && v.codeSyntax.WEB;
    if (web) {
      const m = /^\s*var\(\s*(--[^,\s)]+)/.exec(web) || /^\s*(--\S+)\s*$/.exec(web);
      if (m) return m[1];
    }
    const c = collections.get(v.variableCollectionId);
    return "--" + slug((c ? c.name + "-" : "") + v.name);
  }
  return { variable, path, cssName, missing: () => missing.size };
}

// ---------- helpers ----------

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
