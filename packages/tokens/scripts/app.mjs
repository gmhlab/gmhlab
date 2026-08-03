// Transform only. Reads the two JSON files in this directory and writes CSS.
// No network — ingestion is a separate step:
//
//   tokens.json  <- the Figma plugin (scripts/plugins/figma-plugin-token-json)
//   styles.json  <- the same plugin's second pane
//
// The plugin is the only source: the Variables REST API needs the
// Enterprise-only `file_variables:read` scope, which this plan cannot grant.
// Both panes must come from the same plugin run — the two files are joined by
// Figma variable id, and mixing versions is checked for below.
import fs from "fs";

// Prefix the plugin puts on each collection's root key in tokens.json.
// Kept in sync with scripts/plugins/figma-plugin-token-json/code.js.
const KEY_PREFIX_COLLECTION = "@";

// Relative to scripts/, which is the cwd the package.json scripts run from.
const WRITE_DIR = "../src";

const CONVERT_TO_REM = true;
// Extension namespace for the w3c token file.
// Must match the namespace in tokens.json — see scripts/plugins/figma-plugin-token-json.
const NAMESPACE = "com.figma.monofly";
// Prefix for CSS custom properties
const TOKEN_PREFIX = "mfy-";

// The data object. Each item in here represents a collection.
// `[collection].definitions` will contain all the token data
// You should ensure these names match those in your Figma variables data.
// Collection names are lowercased and underscored and stripped of non alphanumeric characters.
const COLLECTION_DATA = {
  color_primitives: {
    settings: { prefix: "color" },
  },
  color: {
    settings: {
      prefix: "color",
      // Light mode names from Figma in lower underscore case. First is default light mode.
      colorSchemes: ["monofly_light"],
      // Dark mode names from Figma in lower underscore case. First is default dark mode.
      colorSchemesDark: ["monofly_dark"],
      // Strings to strip from mode names above when transforming to theme class names. (Only applicable when more than one per mode)
      colorSchemeLightRemove: "_light",
      colorSchemeDarkRemove: "_dark",
      // Strings to find and replace in CSS values
      replacements: {
        color_primitives: "color",
      },
    },
  },
  size: {
    settings: {
      prefix: "size",
      convertPixelToRem: true,
      replacements: {
        [`${KEY_PREFIX_COLLECTION}responsive`]: "responsive",
      },
    },
  },
  typography_primitives: {
    settings: {
      prefix: "typography",
      convertPixelToRem: true,
      replacements: {
        [`${KEY_PREFIX_COLLECTION}responsive`]: "responsive",
        "Extra Bold Italic": "800 italic",
        "Semi Bold Italic": "600 italic",
        "Medium Italic": "500 italic",
        "Regular Italic": "400 italic",
        "Extra Light Italic": "200 italic",
        "Light Italic": "300 italic",
        "Black Italic": "900 italic",
        "Bold Italic": "700 italic",
        "Thin Italic": "100 italic",
      },
    },
  },
  typography: {
    settings: {
      prefix: "typography",
      convertPixelToRem: true,
      replacements: {
        typography_primitives: "typography",
      },
    },
  },
};

initialize();

/**
 * Fail loudly when an input file is missing, rather than throwing ENOENT.
 * @param {string} path
 * @param {string} source - where the file is supposed to come from
 */
function requireInput(path, source) {
  if (fs.existsSync(path)) return;
  console.error(
    `Missing ${path}.\n` +
      `  Run the Figma plugin (scripts/plugins/figma-plugin-token-json) and paste ${source} into it.`,
  );
  process.exit(1);
}

/**
 * tokens.json and styles.json must come from the same Figma file version —
 * styles reference variables by figmaId. If they drift, the lookup silently
 * yields undefined and font tokens render as "undefined undefined …", so
 * surface it here instead.
 * @param {Array<any>} styles
 * @param {Object<string, any>} variableLookups
 */
function warnOnVersionSkew(styles, variableLookups) {
  const refs = new Set();
  const collect = (value) => {
    if (!value || typeof value !== "object") return;
    if (value.type === "VARIABLE_ALIAS" && value.id) refs.add(value.id);
    Object.values(value).forEach(collect);
  };
  styles.forEach(collect);

  const missing = [...refs].filter((id) => !variableLookups[id]);
  if (!missing.length) {
    console.log(`  ${refs.size}/${refs.size} style variable refs resolved`);
    return;
  }
  console.warn(
    `\n  WARNING: ${missing.length}/${refs.size} style variable refs are not in tokens.json.\n` +
      `  The two files are probably from different Figma file versions —\n` +
      `  re-export both from the plugin in one run.\n` +
      `  Unresolved: ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? ", …" : ""}\n`,
  );
}

/**
 * COLLECTION_DATA hardcodes Figma collection and mode names in their sanitized
 * form. Rename either in Figma and the matching CSS block silently emits empty
 * (`:root { ; }`) instead of failing. Check the config against what the export
 * actually contains, and report the real Figma names when the plugin supplied
 * them.
 * @param {Object<any>} data - parsed tokens.json
 */
function validateCollectionData(data) {
  const errors = [];
  const present = Object.keys(data);

  for (const key in COLLECTION_DATA) {
    const definitionsKey = `${KEY_PREFIX_COLLECTION}${key}`;
    const collection = data[definitionsKey];
    if (!collection) {
      errors.push(
        `COLLECTION_DATA lists "${key}", but tokens.json has no "${definitionsKey}".\n` +
          `    Collections in the export: ${present.join(", ")}`,
      );
      continue;
    }

    const extensions =
      (collection.$extensions && collection.$extensions[NAMESPACE]) || {};
    const modes = extensions.modes || [];
    const modeNames = extensions.modeNames || {};
    // modeNames only exists in exports from the current plugin; fall back
    // to the sanitized key alone for older tokens.json files.
    const label = (mode) =>
      modeNames[mode] ? `${mode} ("${modeNames[mode]}")` : mode;

    const { colorSchemes = [], colorSchemesDark = [] } =
      COLLECTION_DATA[key].settings;
    for (const scheme of [...colorSchemes, ...colorSchemesDark]) {
      if (modes.includes(scheme)) continue;
      errors.push(
        `${definitionsKey}: configured mode "${scheme}" is not in the export.\n` +
          `    Modes present: ${modes.map(label).join(", ") || "(none)"}` +
          (extensions.name ? `\n    Figma calls this collection "${extensions.name}"` : ""),
      );
    }
  }

  if (errors.length) {
    console.error(
      `\nCOLLECTION_DATA does not match tokens.json:\n\n  ${errors.join("\n  ")}\n\n` +
        `  Either the Figma names changed, or tokens.json is from a different file.\n` +
        `  Update COLLECTION_DATA in scripts/app.mjs to match.\n`,
    );
    process.exit(1);
  }

  const unconfigured = present.filter(
    (k) => !(k.slice(KEY_PREFIX_COLLECTION.length) in COLLECTION_DATA),
  );
  if (unconfigured.length) {
    console.log(
      `  exported but not processed: ${unconfigured.join(", ")} (no COLLECTION_DATA entry)`,
    );
  }
}

async function initialize() {
  requireInput("./tokens.json", "the plugin's first pane");
  requireInput("./styles.json", "the plugin's second pane");

  const tokensJSON = JSON.parse(fs.readFileSync("./tokens.json"));
  validateCollectionData(tokensJSON);

  // Process token JSON into CSS
  const { processed, themeCSS } = processTokenJSON(tokensJSON);
  // An object to lookup variables in when processing styles.
  const variableLookups = Object.keys(processed)
    .flatMap((key) => Object.values(processed[key].definitions)[0])
    .reduce((into, item) => {
      into[item.figmaId] = item;
      return into;
    }, {});

  // Process styles JSON into CSS
  const stylesJSON = JSON.parse(fs.readFileSync("./styles.json"));
  warnOnVersionSkew(stylesJSON, variableLookups);
  const stylesCSS = await processStyleJSON(stylesJSON, variableLookups);

  // Write our processed CSS
  fs.writeFileSync(
    `${WRITE_DIR}/theme.css`,
    [...themeCSS, ...stylesCSS].join("\n"),
  );
  console.log(`Wrote ${WRITE_DIR}/theme.css`);
}

/**
 * Massive operation to process Token JSON as parseable object for CSS conversion
 * @param {Object<any>} data - W3C Token Spec JSON with collections at the root.
 * @returns {{ processed: {[collection_key: string]: { definitions: { [mode_name: string]: Array<{ property: string, propertyName: string, figmaId: string, description: string, value: string, type: string }> } } } } }}
 */
function processTokenJSON(data) {
  const processed = { ...COLLECTION_DATA };
  for (let key in processed) {
    processCollection(
      data,
      COLLECTION_DATA[key],
      `${KEY_PREFIX_COLLECTION}${key}`,
    );
  }

  // Our theme.css file string.
  const fileStringCSSLines = [
    "/*",
    " * This file is automatically generated by scripts/app.mjs!",
    " */",
  ];
  for (let key in processed) {
    fileStringCSSLines.push(
      ...fileStringCSSFromProcessedObject(processed[key], key),
    );
  }

  // Turn variable collection data into a CSS file string
  function fileStringCSSFromProcessedObject({ definitions, settings }, key) {
    // Lines of CSS
    const lines = [];
    // This is how we know to do prefers-color scheme rather than plain :root
    if (settings.colorSchemes) {
      settings.colorSchemes.forEach((scheme, i) => {
        if (i === 0) {
          lines.push(...[`/* ${key}: ${scheme} (default) */`, ":root {"]);
        } else {
          lines.push(
            ...[
              `/* ${key}: ${scheme} */`,
              `.${TOKEN_PREFIX}scheme-${key}-${scheme.replace(settings.colorSchemeLightRemove, "")} {`,
            ],
          );
        }
        lines.push(drawCSSPropLines(definitions[scheme], "  "), "}");
      });
      if (settings.colorSchemesDark) {
        lines.push("@media (prefers-color-scheme: dark) {");
        settings.colorSchemesDark.forEach((scheme, i) => {
          if (i === 0) {
            lines.push(...[`  /* ${key}: ${scheme} (default) */`, "  :root {"]);
          } else {
            lines.push(
              ...[
                `  /* ${key}: ${scheme} */`,
                `  .${TOKEN_PREFIX}scheme-${key}-${scheme.replace(settings.colorSchemeDarkRemove, "")} {`,
              ],
            );
          }
          lines.push(drawCSSPropLines(definitions[scheme], "    "), "  }");
        });
        lines.push("}");
      }
    } else {
      let first;
      // For each mode in definitions
      for (let k in definitions) {
        if (!first) {
          first = true;
          lines.push(...[`/* ${key}: ${k} (default) */`, ":root {"]);
        } else {
          lines.push(
            ...[`/* ${key}: ${k} */`, `.${TOKEN_PREFIX}theme-${key}-${k} {`],
          );
        }
        lines.push(...[drawCSSPropLines(definitions[k], "  "), "}"]);
      }
    }
    return lines;
  }

  // A snippet to paste into the Figma console (or run as a plugin) that pushes
  // our generated CSS property names back onto the Figma variables as WEB code
  // syntax, so Dev Mode shows developers the name their CSS actually uses.
  // It does NOT rename variables — only codeSyntax and description.
  const variableSyntaxAndDescriptionString = `// Generated by scripts/app.mjs — do not edit.
// Sets each variable's WEB code syntax + description. It does NOT rename variables.
// Variable ids are file-specific: run this against the file the export came from,
// or every lookup misses and nothing is written.
const rows = [
${Object.keys(processed)
  .map((key) => drawVariableSyntaxAndDescription(processed[key].definitions))
  .sort()
  .join(",\n")},
];
let updated = 0;
const missing = [];
Promise.all(
  rows.map(async ([variableId, webSyntax, description]) => {
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    if (!variable) {
      missing.push(variableId);
      return;
    }
    updated++;
    variable.setVariableCodeSyntax("WEB", webSyntax);
    // Only write a description when the export actually has one, so a stale
    // export cannot erase descriptions added in Figma since it was taken.
    if (description) variable.description = description;
  }),
)
  .then(() => {
    console.log("Updated " + updated + " of " + rows.length + " variables.");
    if (missing.length) {
      console.warn(
        missing.length +
          " variable ids were not found in this file — wrong file, or the export is stale:",
        missing.slice(0, 10),
      );
    }
  })
  .catch(console.error);`;

  // Write the code syntax snippet
  fs.writeFileSync(
    "./tokenVariableSyntaxAndDescriptionSnippet.js",
    variableSyntaxAndDescriptionString,
  );

  // Return our data
  return { processed, themeCSS: fileStringCSSLines };

  /**
   * Transform an array of lines of CSS custom property definitions into indented CSS output.
   * @param {string[]} lines
   * @param {string} indent
   * @returns {string}
   */
  function drawCSSPropLines(lines = [], indent = "  ") {
    return (
      lines
        .sort((a, b) => (a.property > b.property ? 1 : -1))
        .map((l) => `${indent}${l.property}: ${l.value}`)
        .join(";\n") + ";"
    );
  }

  /**
   * Given an object of modes, return the Code Syntax snippet string
   * @param {{ [mode: string]: string[]}} linesObject
   * @returns {string}
   */
  function drawVariableSyntaxAndDescription(linesObject = { default: [] }) {
    const lines = linesObject[Object.keys(linesObject)[0]];
    return lines
      .map(
        (l) =>
          `  ["${l.figmaId}", "var(${l.property})", "${l.description || ""}"]`,
      )
      .sort()
      .join(",\n");
  }

  /**
   *
   * @param {Object<any>} data - All variable collection data (W3C token spec JSON)
   * @param {Object<any>} processed - The object to write collection data to
   * @param {string} definitionsKey - The key for the definitions
   */
  function processCollection(data, processed, definitionsKey) {
    const {
      replacements = {},
      convertPixelToRem = CONVERT_TO_REM,
      prefix,
    } = processed.settings;
    const fullPrefix = `${TOKEN_PREFIX}${prefix}`;
    processed.definitions = {};
    traverse(
      processed.definitions,
      data[definitionsKey],
      replacements,
      definitionsKey,
      fullPrefix,
      convertPixelToRem,
      "",
      fullPrefix ? [fullPrefix] : undefined,
    );
  }

  /**
   * Traverse W3C token file to build out tokens.
   * @param {Object<any>} definitions
   * @param {Object<any>} object - collection from W3C token JSON
   * @param {{[find: string]: string}} replacements - string replacement object, keyed by find.
   * @param {string} definitionsKey
   * @param {string} prefix - collection token prefix
   * @param {boolean} convertPixelToRem - whether or not to turn numbers into n/16 rem values.
   * @param {string} currentType - as we traverse token scope, we may need to track type from parent
   * @param {string[]} keys - history of token scopes to prefix name
   * @returns
   */
  function traverse(
    definitions,
    object,
    replacements,
    definitionsKey,
    prefix,
    convertPixelToRem = CONVERT_TO_REM,
    currentType = "",
    keys = [],
  ) {
    const property = `--${keys.join("-")}`;
    const propertyNameFull = keys
      .map((key) =>
        key
          .split(/[^\dA-Za-z]/)
          .map((k) => `${k.charAt(0).toUpperCase()}${k.slice(1)}`)
          .join(""),
      )
      .join("");
    // .replace(/^color/i, "");
    const valueWithReplacements = (value) => {
      if (typeof value !== "string") return value;
      for (let replacement in replacements) {
        value = value.replace(replacement, replacements[replacement]);
      }
      // Font family names carry meaningful casing ("Roboto Mono"); everything
      // else here is a var() reference or a keyword and is safe to normalize.
      return property.match(/family-(mono|sans|serif)/)
        ? value
        : value.toLowerCase();
    };
    const propertyName =
      propertyNameFull.charAt(0).toLowerCase() + propertyNameFull.slice(1);
    const type = object.$type || currentType;
    if ("$value" in object) {
      if ("$extensions" in object && NAMESPACE in object.$extensions) {
        const description = object.$description || "";
        const figmaId = object.$extensions[NAMESPACE].figmaId;
        for (let mode in object.$extensions[NAMESPACE].modes) {
          definitions[mode] = definitions[mode] || [];
          definitions[mode].push({
            property,
            propertyName,
            figmaId,
            description,
            value: valueWithReplacements(
              valueToCSS(
                property,
                object.$extensions[NAMESPACE].modes[mode],
                definitionsKey,
                convertPixelToRem,
                prefix,
              ),
            ),
            type,
          });
        }
      } else {
        const description = object.$description || "";
        const figmaId =
          "$extensions" in object && NAMESPACE in object.$extensions
            ? object.$extensions[NAMESPACE].figmaId
            : "UNDEFINED";
        const mode = "default";
        definitions[mode] = definitions[mode] || [];
        definitions[mode].push({
          property,
          propertyName,
          description,
          figmaId,
          value: valueWithReplacements(
            valueToCSS(
              property,
              object.$value,
              definitionsKey,
              convertPixelToRem,
              "",
            ),
          ),
          type,
        });
      }
    } else {
      Object.entries(object).forEach(([key, value]) => {
        if (key.charAt(0) !== "$") {
          traverse(
            definitions,
            value,
            replacements,
            definitionsKey,
            prefix,
            convertPixelToRem,
            type,
            [...keys, key],
          );
        }
      });
    }
  }

  /**
   * Converting W3C token JSON value to CSS value.
   * @param {string} property
   * @param {string} value
   * @param {string} definitionsKey
   * @param {boolean} convertPixelToRem
   * @param {string} prefix
   * @returns {string}
   */
  function valueToCSS(
    property,
    value,
    definitionsKey,
    convertPixelToRem,
    prefix = "",
  ) {
    if (value.toString().charAt(0) === "{")
      return `var(--${value
        .replace(`${definitionsKey}`, prefix)
        .replace(/[\. ]/g, "-")
        .replace(/^\{/, "")
        .replace(/\}$/, "")})`;
    const valueIsDigits = value.toString().match(/^-?\d+(\.\d+)?$/);
    const isRatio = property.match(/(ratio-)/);
    const isNumeric =
      valueIsDigits && !property.match(/(weight|ratio-)/) && !isRatio;
    if (isNumeric) {
      return convertPixelToRem ? `${parseInt(value) / 16}rem` : `${value}px`;
    } else if (isRatio) {
      return Math.round(value * 10000) / 10000;
    }
    if (property.match("family-mono")) {
      return `"${value}", monospace`;
    } else if (property.match("family-sans")) {
      return `"${value}", sans-serif`;
    } else if (property.match("family-serif")) {
      return `"${value}", serif`;
    }
    return value;
  }
}

/**
 * Turning style JSON into a box shadow, filter, or font property value
 * @param {Object<any>} data - Style JSON data from Figma
 * @param {Object<any>} variablesLookup - Object to find variable names
 * @returns
 */
async function processStyleJSON(data, variablesLookup) {
  const effectDefs = [];
  const text = [];
  data.forEach(({ type, ...style }) => {
    if (type === "TEXT") {
      const {
        name,
        fontSize,
        fontFamily,
        fontWeight,
        fontStyle = "normal",
      } = style;

      const css = [
        valueFromPossibleVariable(fontStyle),
        valueFromPossibleVariable(fontWeight),
        valueFromPossibleVariable(fontSize),
        valueFromPossibleVariable(fontFamily),
      ].join(" ");
      text.push(
        `--${TOKEN_PREFIX}font-${name
          .replace(/^[^a-zA-Z0-9]+/, "")
          .replace(/[^a-zA-Z0-9]+/g, "-")
          .toLowerCase()}: ${css};`,
      );
    } else if (type === "EFFECT") {
      const { name, effects } = style;
      const safeName = sanitizeName(name);
      const shadows = [];
      const filters = [];
      const backdropFilters = [];
      effects.forEach((effect) => {
        if (effect.visible) {
          if (effect.type.match("SHADOW")) {
            shadows.push(formatEffect(effect));
          }
          if (effect.type.match("LAYER_BLUR")) {
            filters.push(formatEffect(effect));
          }
          if (effect.type.match("BACKGROUND_BLUR")) {
            backdropFilters.push(formatEffect(effect));
          }
        }
      });
      if (shadows.length) {
        effectDefs.push(
          `--${TOKEN_PREFIX}effects-shadows-${safeName}: ${shadows.join(", ")};`,
        );
      }
      if (filters.length) {
        effectDefs.push(
          `--${TOKEN_PREFIX}effects-filter-${safeName}: ${filters[0]};`,
        );
      }
      if (backdropFilters.length) {
        effectDefs.push(
          `--${TOKEN_PREFIX}effects-backdrop-filter-${safeName}: ${backdropFilters[0]};`,
        );
      }
    }
  });

  // Sorted so output is independent of the order Figma happens to return
  // styles in — the variable blocks are already sorted by drawCSSPropLines,
  // and unsorted output here made source-to-source diffs unreadable.
  return [
    "/* styles */",
    ":root {",
    "  " + [...text.sort(), ...effectDefs.sort()].join("\n  "),
    "}",
  ];

  /**
   * Takes possible variable reference or value and returns an appropriate value
   * @param {string} item
   * @returns {string}
   */
  function valueFromPossibleVariable(item = "") {
    if (typeof item === "object") {
      // attempting to find bound variables
      const variable = variablesLookup[item.id];
      return variable ? `var(${variable.property})` : JSON.stringify(item);
    } else if (item.match(/^[1-9]00$/)) {
      // attempting to find variable for weights
      // the scenario where style is used so weight is int
      const variable = variablesLookup.find(({ value }) => value === item);
      return variable ? `var(${variable.property})` : item;
    }
    return item;
  }

  /**
   * Lowercase hyphenate string
   * @param {string} name
   * @returns {string}
   */
  function sanitizeName(name) {
    return name
      .replace(/[^a-zA-Z0-9 ]/g, " ")
      .trim()
      .replace(/ +/g, "-")
      .toLowerCase();
  }

  /**
   * Transforms Figma effect data into CSS string
   * @param {{type: EffectType, ...effect}} args[0] Figma effect
   * @returns {string}
   */
  function formatEffect({ type, ...effect }) {
    if (type === "DROP_SHADOW" || type === "INNER_SHADOW") {
      const {
        radius,
        offset: { x, y },
        spread,
        hex,
        boundVariables,
      } = effect;
      const numbers = [
        boundVariables.offsetX
          ? valueFromPossibleVariable(boundVariables.offsetX)
          : `${x}px`,
        boundVariables.offsetY
          ? valueFromPossibleVariable(boundVariables.offsetY)
          : `${y}px`,
        boundVariables.radius
          ? valueFromPossibleVariable(boundVariables.radius)
          : `${radius}px`,
        boundVariables.spread
          ? valueFromPossibleVariable(boundVariables.spread)
          : `${spread}px`,
        boundVariables.color
          ? valueFromPossibleVariable(boundVariables.color)
          : `${hex}px`,
      ];
      return `${type === "INNER_SHADOW" ? "inset " : ""}${numbers.join(" ")}`;
    } else if (type === "LAYER_BLUR" || type === "BACKGROUND_BLUR") {
      const { radius, boundVariables } = effect;
      return `blur(${boundVariables.radius ? valueFromPossibleVariable(boundVariables.radius) : `${radius}px`})`;
    }
  }
}
