// ds-audit.js — DS conformance audit for this project.
// Paste the body into the run_script tool (uses helpers: readFile, ls, log).
// Run it AFTER proposing/changing any design and BEFORE ready_for_verification.
// It is the mechanical half of CLAUDE.md Rule 1: a prose rule can't catch drift,
// this can. THROWS on any FAIL so the gate is hard, not advisory.
//
// What it checks (high-precision — designed NOT to cry wolf):
//   1. var(--kls-*) resolution — every referenced token is defined in the DS CSS.
//   2. Font aliases — no `const xxFont = …` JS consts (write var(--kls-font-sans) directly).
//   3. On-scale raw-px spacing — a quoted px-only value (e.g. "12px", "0 20px",
//      "12px 20px") whose tokens include a scale step {4,6,12,20,32,64} must be a
//      `--kls-space-*` token. Border/shadow/blur strings (they contain letters) and
//      off-scale layout one-offs (8/10/16/18/24/40 …) are intentionally NOT failed —
//      see DS-GAPS.md §F for why those literals are the DS, not drift.
// Files: scans **/*.{dc.html,jsx,html,css} EXCEPT device-frame scaffolds (ios/android-frame)
// and the _ds/ bundle itself, which are not DS surfaces.

const DS = "_ds/mx-design-system-019df30f-a6e5-7a34-a806-20b51ae1ab4e/colors_and_type.css";
const css = await readFile(DS);
const defined = new Set([...css.matchAll(/(--kls-[a-z0-9-]+)\s*:/gi)].map(m => m[1].toLowerCase()));
const SCALE = new Set([4, 6, 12, 20, 32, 64]);
const SKIP = /(ios|android)-frame\.jsx$/;
const SKIP_DIR = /^(_ds|assets|fonts|uploads|screenshots)$/;

async function walk(dir) {
  let out = [];
  for (const f of await ls(dir)) {
    const p = dir ? dir + "/" + f : f;
    if (f.match(/\.(jsx|html|css)$/)) { if (!SKIP.test(f)) out.push(p); }
    else if (!f.includes(".") && !SKIP_DIR.test(f)) out = out.concat(await walk(p));
  }
  return out;
}

const fails = [];
const warns = [];
for (const f of await walk("")) {
  const name = f.split("/").pop();
  const src = await readFile(f);

  // 1. undefined tokens
  for (const m of src.matchAll(/var\((--kls-[a-z0-9-]+)/gi)) {
    const t = m[1].toLowerCase();
    if (!defined.has(t)) fails.push(`${name}: undefined token ${t}`);
  }
  // 2. font aliases
  for (const m of src.matchAll(/const\s+(\w*[Ff]ont)\s*=/g)) {
    fails.push(`${name}: font alias const ${m[1]} — use fontFamily:"var(--kls-font-sans)" directly`);
  }
  // 3. on-scale px in a px-only quoted value
  for (const m of src.matchAll(/"([0-9][0-9a-z\s]*?)"/gi)) {
    const v = m[1];
    if (!/^[\d\s]*(?:\d+px[\s\d]*)+$/.test(v)) continue;   // only 0 + Npx tuples
    const px = [...v.matchAll(/(\d+)px/g)].map(x => +x[1]);
    if (px.some(n => SCALE.has(n))) fails.push(`${name}: on-scale raw px "${v}" — use a --kls-space-* token`);
    else warns.push(`${name}: off-scale layout px "${v}" (allowed as composition — see DS-GAPS §F)`);
  }
}

if (warns.length) log("ℹ︎ " + warns.length + " off-scale layout literal(s) (not blocking)");
if (!fails.length) { log("✅ DS audit clean — tokens resolve, no font aliases, no on-scale raw px."); }
else { for (const x of [...new Set(fails)]) log("❌ " + x); throw new Error(fails.length + " DS audit failure(s)"); }
