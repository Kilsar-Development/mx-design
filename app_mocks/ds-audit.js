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
//      off-scale layout one-offs (8/10/16/18/24/40 …) are intentionally NOT failed.
//   4. Component-spec conformance — a style object carrying a DS component's SIGNATURE
//      (e.g. tertiaryContainer bg + onTertiaryContainer fg ⇒ PrimaryActionButton) must
//      match that component's canonical dimensions from preview/*.html. Catches chrome
//      that looks bespoke but is really an off-spec DS primitive (e.g. a 44px-tall
//      PrimaryActionButton — checks 1–3 are value/token-level and are blind to this).
//      Only PRESENT-but-wrong values are failed (a missing prop may be spread/inherited),
//      so the check stays conservative. Add primitives to COMPONENT_SPECS as needed.
// Files: scans **/*.{jsx,html,css} EXCEPT device-frame scaffolds (ios/android-frame)
// and the _ds/ bundle itself, which are not DS surfaces. (.js like this file is NOT scanned.)

const DS = "_ds/mx-design-system-019df30f-a6e5-7a34-a806-20b51ae1ab4e/colors_and_type.css";
const css = await readFile(DS);
const defined = new Set([...css.matchAll(/(--kls-[a-z0-9-]+)\s*:/gi)].map(m => m[1].toLowerCase()));
const SCALE = new Set([4, 6, 12, 20, 32, 64]);
const SKIP = /(ios|android)-frame\.jsx$/;
const SKIP_DIR = /^(_ds|assets|fonts|uploads|screenshots)$/;

// ── Check 4: canonical component dimensions (from preview/*.html spec cards) ──
// sig:      a regex that, when matched, anchors a candidate style object.
// confirm:  must also be present in the SAME object to confirm the component
//           (disambiguates from other surfaces that share the sig token).
// rules:    [label, value-finder regex (group 1 = value), validate(value)->bool].
//           A rule fires ONLY when the property is present and validation fails.
const COMPONENT_SPECS = [
  {
    name: "PrimaryActionButton",          // preview/buttons-primary.html
    sig: /background:\s*var\(--kls-tertiary-container\)/,
    confirm: /color:\s*var\(--kls-on-tertiary-container\)/,
    rules: [
      ["height must be 40",                       /\bheight:\s*(\d+)\b/,                 v => v === "40"],
      ["padding-x must be var(--kls-space-med)",   /\bpadding:\s*["'`]([^"'`]+)["'`]/,    v => /--kls-space-med/.test(v)],
      ["gap must be var(--kls-space-xsmall)",      /\bgap:\s*([^,}\n]+)/,                 v => /--kls-space-xsmall/.test(v)],
      ["radius must be 8 (web) / 12 (mobile)",     /\bborderRadius:\s*([^,}\n]+)/,        v => /(^|[^0-9])(8|12)([^0-9]|$)/.test(v)],
    ],
  },
];
function enclosingObject(src, idx) {
  let depth = 0, start = -1;
  for (let i = idx; i >= 0; i--) {
    const c = src[i];
    if (c === '}') depth++;
    else if (c === '{') { if (depth === 0) { start = i; break; } depth--; }
  }
  if (start < 0) return null;
  let d = 0;
  for (let j = start; j < src.length; j++) {
    if (src[j] === '{') d++;
    else if (src[j] === '}') { d--; if (d === 0) return src.slice(start, j + 1); }
  }
  return null;
}
function specCheck(name, src) {
  const out = [];
  for (const spec of COMPONENT_SPECS) {
    const re = new RegExp(spec.sig, "g"); let m;
    while ((m = re.exec(src))) {
      const obj = enclosingObject(src, m.index);
      if (!obj || !spec.confirm.test(obj)) continue;
      for (const [label, find, ok] of spec.rules) {
        const fm = obj.match(find);
        if (fm && !ok(fm[1].trim())) out.push(`${name}: ${spec.name} — ${label} (found "${fm[1].trim()}")`);
      }
    }
  }
  return out;
}

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
    else warns.push(`${name}: off-scale layout px "${v}" (allowed as composition)`);
  }
  // 4. component-spec conformance
  for (const h of specCheck(name, src)) fails.push(h);
}

if (warns.length) log("ℹ︎ " + warns.length + " off-scale layout literal(s) (not blocking)");
if (!fails.length) { log("✅ DS audit clean — tokens resolve, no font aliases, no on-scale raw px, no component-spec drift."); }
else { for (const x of [...new Set(fails)]) log("❌ " + x); throw new Error(fails.length + " DS audit failure(s)"); }
