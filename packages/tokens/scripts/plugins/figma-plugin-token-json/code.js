const KEY_PREFIX_COLLECTION = `@`;
// Must match NAMESPACE in scripts/app.mjs, or every token collapses to a
// single "default" mode and all light/dark data is silently dropped.
const NAMESPACE = "com.figma.monofly";

exportToJSON();

function recurseVariables(variable, list) {
  const variables = Array.isArray(variable) ? variable : [variable];
  variables.forEach((variable) => {
    if (!variable || !variable.id) return;
    const { name, variableCollectionId, resolvedType, valuesByMode } =
      figma.variables.getVariableById(variable.id);
    const collection =
      figma.variables.getVariableCollectionById(variableCollectionId);
    const modes = collection.modes;
    const isSingleMode = modes.length === 1;
    const item = {
      token: [
        `${KEY_PREFIX_COLLECTION}${sanitizeName(collection.name)}`,
        name,
      ].join("/"),
      collection: collection.name,
      name,
      type: resolvedType,
    };
    if (!isSingleMode) {
      item.modes = {};
    }
    const modeIds = Object.keys(valuesByMode);
    modeIds.forEach((modeId) => {
      const mode = isSingleMode
        ? "Default"
        : modes.find((mode) => mode.modeId === modeId).name;
      let value = valuesByMode[modeId];
      if (value.type === "VARIABLE_ALIAS") {
        const variable = figma.variables.getVariableById(value.id);
        const v = {};
        recurseVariables(variable, v);
        if (isSingleMode) {
          item.value = v;
        } else {
          item.modes[mode] = v;
        }
      } else {
        if (resolvedType === "COLOR") {
          value = rgbToHex(value);
        }
        if (isSingleMode) {
          item.value = value;
        } else {
          item.modes[mode] = value;
        }
      }
    });
    if (Array.isArray(list)) {
      list.push(item);
    } else {
      for (let key in item) {
        list[key] = item[key];
      }
    }
  });
}

async function exportToJSON() {
  const collections = figma.variables.getLocalVariableCollections();
  const object = {};
  const { idToKey } = uniqueKeyIdMaps(collections, "id", KEY_PREFIX_COLLECTION);

  collections.forEach(
    (collection) =>
      (object[idToKey[collection.id]] = collectionAsJSON(idToKey, collection)),
  );

  const styles = await getStyles();

  // Two panes, each the exact contents of one file in scripts/.
  // Select-all inside a pane and paste over the corresponding file.
  const pane = (heading, body) =>
    `<h2>${heading}</h2><textarea spellcheck="false" onclick="this.select()">${escapeForHTML(
      body,
    )}</textarea>`;

  figma.showUI(
    [
      "<style>",
      "  body { margin: 0; font: 12px/1.4 ui-monospace, monospace; padding: 8px; }",
      "  h2 { font-size: 12px; margin: 8px 0 4px; }",
      "  textarea { width: 100%; height: 38vh; overflow-y: auto; white-space: pre; }",
      "</style>",
      pane("scripts/tokens.json", JSON.stringify(object, null, 2)),
      pane("scripts/styles.json", JSON.stringify(styles, null, 2)),
    ].join("\n"),
    { width: 700, height: 700 },
  );
}

function escapeForHTML(string) {
  return string.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function collectionAsJSON(
  collectionIdToKeyMap,
  {
    name,
    modes,
    variableIds,
    id: figmaId,
    key,
    remote,
    defaultModeId,
    hiddenFromPublishing,
  },
) {
  const collection = {};
  const { idToKey, keyToId } = uniqueKeyIdMaps(modes, "modeId");
  const modeKeys = Object.values(idToKey);
  collection.$extensions = {
    [NAMESPACE]: {
      figmaId,
      // Raw Figma name. `modes` below and this collection's root key are both
      // run through sanitizeName(), which lowercases and underscores — the
      // original string cannot be reconstructed from them, so keep it.
      name,
      key: key || null,
      remote: Boolean(remote),
      hiddenFromPublishing: Boolean(hiddenFromPublishing),
      // Sanitized mode keys — app.mjs indexes by these, do not change.
      modes: modeKeys,
      // Raw mode identity, keyed by the sanitized name.
      modeIds: modeKeys.reduce((into, modeKey) => {
        into[modeKey] = keyToId[modeKey];
        return into;
      }, {}),
      modeNames: modes.reduce((into, mode) => {
        into[idToKey[mode.modeId]] = mode.name;
        return into;
      }, {}),
      // Which mode Figma treats as the default. app.mjs currently assumes
      // modeKeys[0]; exporting this makes that assumption checkable.
      defaultMode: idToKey[defaultModeId],
      defaultModeId: defaultModeId || null,
    },
  };
  variableIds.forEach((variableId) => {
    const {
      name,
      resolvedType,
      valuesByMode,
      description,
      // Authoring metadata with no CSS equivalent, but needed to round-trip
      // into Figma without resetting curation. `scopes` controls which fields
      // a variable is offered for in the UI; `codeSyntax` is what Dev Mode
      // shows developers.
      scopes,
      codeSyntax,
      hiddenFromPublishing: variableHidden,
      key: variableKey,
      remote: variableRemote,
      variableCollectionId,
    } = figma.variables.getVariableById(variableId);
    const value = valuesByMode[keyToId[modeKeys[0]]];
    const fontWeight =
      resolvedType === "FLOAT" &&
      Boolean(name.match(/\/?weight/i)) &&
      "fontWeight";
    const fontFamily =
      resolvedType === "STRING" &&
      Boolean(name.match(/\/?family/i)) &&
      "fontFamily";
    if (
      (value !== undefined &&
        ["COLOR", "FLOAT", "STRING"].includes(resolvedType)) ||
      fontFamily
    ) {
      let obj = collection;
      name.split("/").forEach((groupName) => {
        const safeName = groupName
          .split(/[^\da-zA-Z]+/)
          .join("-")
          .toLowerCase();
        obj[safeName] = obj[safeName] || {};
        obj = obj[safeName];
      });
      obj.$type =
        resolvedType === "COLOR"
          ? "color"
          : resolvedType === "FLOAT"
            ? fontWeight || "number"
            : fontFamily || "unknown";
      obj.$value = valueToJSON(value, resolvedType, collectionIdToKeyMap);
      obj.$description = description || "";
      obj.$extensions = {
        [NAMESPACE]: {
          figmaId: variableId,
          // Raw slash-delimited Figma name ("Color/Brand/500"). The nesting
          // above is built from a lowercased, hyphenated version of this, so
          // the original casing is otherwise unrecoverable.
          name,
          key: variableKey || null,
          remote: Boolean(variableRemote),
          variableCollectionId,
          // Raw Figma type. $type above is the W3C mapping of it, and the
          // fontWeight/fontFamily special cases make that lossy.
          resolvedType,
          // ["ALL_SCOPES"] is Figma's default; anything narrower is curation
          // that a re-import would otherwise wipe.
          scopes: scopes && scopes.length ? scopes : ["ALL_SCOPES"],
          codeSyntax: codeSyntax || {},
          hiddenFromPublishing: Boolean(variableHidden),
          modes: modeKeys.reduce((into, modeKey) => {
            into[modeKey] = valueToJSON(
              valuesByMode[keyToId[modeKey]],
              resolvedType,
              collectionIdToKeyMap,
            );
            return into;
          }, {}),
        },
      };
    }
  });
  return collection;
}

function valueToJSON(value, resolvedType, collectionIdToKeyMap) {
  if (value.type === "VARIABLE_ALIAS") {
    const variable = figma.variables.getVariableById(value.id);
    const prefix = collectionIdToKeyMap[variable.variableCollectionId];
    return `{${prefix}.${variable.name.replace(/\//g, ".")}}`;
  }
  return resolvedType === "COLOR" ? rgbToHex(value) : value;
}

function uniqueKeyIdMaps(nodesWithNames, idKey, prefix = "") {
  const idToKey = {};
  const keyToId = {};
  nodesWithNames.forEach((node) => {
    const key = sanitizeName(node.name);
    let int = 2;
    let uniqueKey = `${prefix}${key}`;
    while (keyToId[uniqueKey]) {
      uniqueKey = `${prefix}${key}_${int}`;
      int++;
    }
    keyToId[uniqueKey] = node[idKey];
    idToKey[node[idKey]] = uniqueKey;
  });
  return { idToKey, keyToId };
}

function sanitizeName(name) {
  return name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/^ +/, "")
    .replace(/ +$/, "")
    .replace(/ +/g, "_")
    .toLowerCase();
}

function rgbToHex({ r, g, b, a }) {
  const toHex = (value) => {
    const hex = Math.round(value * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const hex = [toHex(r), toHex(g), toHex(b)];
  if (a !== 1) {
    hex.push(toHex(a));
  }
  return `#${hex.join("")}`;
}

function RGBAToHexA(rgba, forceRemoveAlpha = false) {
  return (
    "#" +
    rgba
      .replace(/^rgba?\(|\s+|\)$/g, "") // Get's rgba / rgb string values
      .split(",") // splits them at ","
      .filter((string, index) => !forceRemoveAlpha || index !== 3)
      .map((string) => parseFloat(string)) // Converts them to numbers
      .map((number, index) => (index === 3 ? Math.round(number * 255) : number)) // Converts alpha to 255 number
      .map((number) => number.toString(16)) // Converts numbers to hex
      .map((string) => (string.length === 1 ? "0" + string : string)) // Adds 0 when length of one number is 1
      .join("")
  ); // Puts the array to togehter to a string
}

function colorToHex({ r, g, b, a }) {
  return RGBAToHexA(
    `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)}, ${a})`,
  );
}

async function getStyles() {
  const payload = [];

  // Each entry has two halves:
  //   top level  - the flattened fields scripts/app.mjs reads
  //   .figma     - the complete raw style, for recreating it in another file
  // Nesting the raw data keeps it from colliding with the flattened fields
  // (e.g. `fontSize` is an alias object up top, a number in .figma).

  (await figma.getLocalTextStylesAsync()).forEach((style) => {
    const {
      id,
      key,
      name,
      description,
      remote,
      fontSize,
      fontName,
      textDecoration,
      textCase,
      letterSpacing,
      lineHeight,
      leadingTrim,
      paragraphIndent,
      paragraphSpacing,
      listSpacing,
      hangingPunctuation,
      hangingList,
      boundVariables = {},
    } = style;
    payload.push({
      type: "TEXT",
      name,
      fontSize: boundVariables.fontSize || fontSize,
      fontFamily: boundVariables.fontFamily || fontName.family,
      // When fontStyle is bound, that variable already carries the weight
      // ("400 italic"), so emitting a weight too would produce an invalid
      // font shorthand. Leave it undefined, as the REST path did.
      fontWeight:
        boundVariables.fontWeight ||
        (boundVariables.fontStyle
          ? undefined
          : weightFromFontStyle(fontName.style)),
      fontStyle:
        boundVariables.fontStyle ||
        (/italic/i.test(fontName.style) ? "italic" : "normal"),
      figma: {
        id,
        key: key || null,
        description: description || "",
        remote: Boolean(remote),
        // Everything below is required to recreate the style faithfully.
        // Omitting lineHeight/letterSpacing yields styles that look subtly
        // wrong everywhere and are tedious to correct by hand.
        fontSize,
        fontName,
        textDecoration,
        textCase,
        letterSpacing,
        lineHeight,
        leadingTrim,
        paragraphIndent,
        paragraphSpacing,
        listSpacing,
        hangingPunctuation,
        hangingList,
        boundVariables,
      },
    });
  });

  // Effect styles pass through nearly as-is: the plugin API's Effect objects
  // already carry type/visible/color/offset/radius/spread/boundVariables with
  // the same keys the REST response used.
  (await figma.getLocalEffectStylesAsync()).forEach((style) => {
    const { id, key, name, description, remote, effects } = style;
    payload.push({
      key: key || null,
      name,
      styleType: "EFFECT",
      remote: Boolean(remote),
      description: description || "",
      type: "EFFECT",
      effects: effects.map((effect) => ({
        ...effect,
        // formatEffect() falls back to `hex` when the color isn't bound to a
        // variable; REST never supplied it, so provide it here.
        hex: effect.color ? colorToHex(effect.color) : undefined,
        boundVariables: effect.boundVariables || {},
      })),
      figma: { id, key: key || null, description: description || "", remote: Boolean(remote) },
    });
  });

  // Paint styles have no CSS output — processStyleJSON handles only TEXT and
  // EFFECT — but they are part of the file and needed to recreate it.
  (await figma.getLocalPaintStylesAsync()).forEach((style) => {
    const { id, key, name, description, remote, paints } = style;
    payload.push({
      type: "PAINT",
      name,
      figma: {
        id,
        key: key || null,
        description: description || "",
        remote: Boolean(remote),
        paints: paints.map((paint) => ({
          ...paint,
          boundVariables: paint.boundVariables || {},
        })),
      },
    });
  });

  return payload;
}

// Figma expresses weight as a style name ("Bold", "Semi Bold Italic").
// Only used when the style does not bind a fontWeight variable.
const FONT_WEIGHTS = {
  thin: 100,
  extralight: 200,
  ultralight: 200,
  light: 300,
  regular: 400,
  normal: 400,
  book: 400,
  medium: 500,
  semibold: 600,
  demibold: 600,
  bold: 700,
  extrabold: 800,
  ultrabold: 800,
  black: 900,
  heavy: 900,
};

function weightFromFontStyle(styleName = "") {
  const key = styleName.replace(/italic/i, "").replace(/[^a-z]/gi, "").toLowerCase();
  return FONT_WEIGHTS[key] || 400;
}