// Pre-compiles the JSX sources in js/ into one plain-JavaScript file (dist/app.js), so the
// browser no longer downloads Babel and compiles ~700 KB of JSX on every page load.
//   npm run build   — build once        npm run watch — rebuild on every save
import { transform } from "esbuild";
import { readFile, writeFile, mkdir, watch } from "node:fs/promises";
import { createHash } from "node:crypto";

// Same order the scripts used to load in — later files use names earlier ones define.
const FILES = [
  "js/core/theme.js", "js/data/master-data.js", "js/components/ui.js", "js/components/suite-bar.js",
  "js/data/seed-procedures.js", "js/app/shell.js", "js/pages/setup.js", "js/pages/phase2-deactivation.js",
  "js/pages/phase2-value-anomalies.js", "js/pages/dashboard.js", "js/pages/all-requests.js",
  "js/components/select.js", "js/pages/new-procedure.js", "js/pages/approved-notifications-tasks.js",
  "js/components/help-tours.js", "js/pages/in-approvals.js", "js/pages/procedure-detail.js",
  "js/pages/edit-procedure.js", "js/main.js",
];

async function build() {
  const t0 = Date.now();
  const parts = [];
  for (const f of FILES) {
    const src = await readFile(f, "utf8");
    const out = await transform(src, { loader: "jsx", jsxFactory: "React.createElement", jsxFragment: "React.Fragment", target: "es2019", minifyWhitespace: true, minifySyntax: true, sourcefile: f });
    parts.push(`/* ${f} */\n${out.code}`);
  }
  const code = parts.join("\n");
  await mkdir("dist", { recursive: true });
  await writeFile("dist/app.js", code);
  // cache-bust: index.html points at dist/app.js?v=<content hash>, so a refresh always gets the new build
  const hash = createHash("sha1").update(code).digest("hex").slice(0, 10);
  const html = await readFile("index.html", "utf8");
  await writeFile("index.html", html.replace(/dist\/app\.js\?v=[\w]*/, `dist/app.js?v=${hash}`));
  console.log(`built dist/app.js — ${(code.length / 1024).toFixed(0)} KB in ${Date.now() - t0} ms (v=${hash})`);
}

try { await build(); } catch (e) { console.error(e.message); process.exitCode = 1; }
if (process.argv.includes("--watch")) {
  console.log("watching js/ …");
  let timer;
  for await (const _ of watch("js", { recursive: true })) {
    clearTimeout(timer);
    timer = setTimeout(() => build().catch(e => console.error(e.message)), 150);
  }
}
