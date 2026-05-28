import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const clientDir = "dist/client";
const assetsDir = join(clientDir, "assets");

// Try manifest first (most reliable)
let cssFiles = [];
let jsEntry = null;

try {
  const manifest = JSON.parse(readFileSync(join(clientDir, ".vite/manifest.json"), "utf8"));
  for (const [, chunk] of Object.entries(manifest)) {
    if (chunk.isEntry && chunk.file) jsEntry = chunk.file;
    if (chunk.css) cssFiles.push(...chunk.css);
  }
} catch {
  // Fallback: scan assets directory
  const assets = readdirSync(assetsDir);
  cssFiles = assets.filter((f) => f.endsWith(".css")).map((f) => `assets/${f}`);
  // Pick the largest JS file as the entry (main bundle)
  const jsFiles = assets.filter((f) => f.endsWith(".js")).map((f) => {
    const { size } = { size: readFileSync(join(assetsDir, f)).length };
    return { name: f, size };
  });
  jsFiles.sort((a, b) => b.size - a.size);
  if (jsFiles[0]) jsEntry = `assets/${jsFiles[0].name}`;
}

const cssLinks = cssFiles
  .map((f) => `  <link rel="stylesheet" crossorigin href="/${f}" />`)
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
${cssLinks}
  </head>
  <body>
    <script type="module" crossorigin src="/${jsEntry}"></script>
  </body>
</html>
`;

writeFileSync(join(clientDir, "index.html"), html);
console.log(`Generated dist/client/index.html (entry: ${jsEntry})`);
