// scripts/build.js
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const src = path.join(root, "src");
const pagesDir = path.join(src, "pages");
const partialsDir = path.join(src, "partials");
const assetsDir = path.join(src, "assets");
const out = path.join(root, "public");

function rm(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}
function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}
function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  mkdirp(to);
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, entry.name);
    const b = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(a, b);
    else fs.copyFileSync(a, b);
  }
}
function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, files);
    else files.push(p);
  }
  return files;
}

function readPartial(name) {
  const p = path.join(partialsDir, name);
  if (!fs.existsSync(p)) throw new Error(`Missing partial: ${p}`);
  return fs.readFileSync(p, "utf8");
}

function injectPartials(html, header, footer) {
  // Replace placeholder DIVs
  html = html.replace(/<div\s+id=["']site-header["']\s*><\/div>/i, header);
  html = html.replace(/<div\s+id=["']site-footer["']\s*><\/div>/i, footer);
  return html;
}

function writeOutPage(srcFile) {
  const rel = path.relative(pagesDir, srcFile); // e.g. fellowship/index.html
  const outFile = path.join(out, rel);
  mkdirp(path.dirname(outFile));

  const header = readPartial("header.html");
  const footer = readPartial("footer.html");

  let html = fs.readFileSync(srcFile, "utf8");
  html = injectPartials(html, header, footer);

  fs.writeFileSync(outFile, html, "utf8");
}

function main() {
  rm(out);
  mkdirp(out);

  // Copy assets to /public/assets
  copyDir(assetsDir, path.join(out, "assets"));

  // Copy any root static files if you add later (favicon, robots.txt, etc.)
  // Example: src/static -> public/
  const staticDir = path.join(src, "static");
  copyDir(staticDir, out);

  // Process HTML pages
  const htmlFiles = walk(pagesDir).filter((f) => f.endsWith(".html"));
  htmlFiles.forEach(writeOutPage);

  console.log(`Build complete. Output: ${out}`);
}

main();

