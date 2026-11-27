#!/usr/bin/env node
/**
 * Guard de contenido para el build:
 * Falla si quedan notas internas, marcadores o placeholders sin resolver.
 */

import fs from "node:fs";
import path from "node:path";

const ROOTS = ["app", "components", "data", "lib"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".mjs", ".json"]);

const RULES = [
  {
    name: "VERIFICAR",
    regex: /VERIFICAR/,
  },
  {
    name: "Placeholder literal {{...}}",
    regex: /['"`][^'"`]*\{\{|\{\{\s*(VERIFICAR|TODO|FIXME|PENDING|[A-ZÁÉÍÓÚÑ_]{3,})/,
  },
  {
    name: "Marcador TODO",
    regex: /\bTODO\b/,
  },
  {
    name: "Texto Lorem Ipsum",
    regex: /\blorem\b/i,
  },
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

const failures = [];

for (const root of ROOTS) {
  for (const filePath of walk(path.resolve(process.cwd(), root))) {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    lines.forEach((line, idx) => {
      for (const rule of RULES) {
        if (rule.regex.test(line)) {
          failures.push({
            file: path.relative(process.cwd(), filePath),
            line: idx + 1,
            rule: rule.name,
            snippet: line.trim().slice(0, 120),
          });
        }
      }
    });
  }
}

if (failures.length > 0) {
  console.error("\n✗ Fallo de validación de contenido (Bloque 1): se encontraron textos prohibidos:\n");
  for (const f of failures) {
    console.error(`  - [${f.rule}] ${f.file}:${f.line} → ${f.snippet}`);
  }
  console.error("");
  process.exit(1);
}

console.log("✓ Validación de contenido OK (sin placeholders VERIFICAR, {{, TODO ni lorem).");
