#!/usr/bin/env node
/* MX DS V3 adherence check for mock pages.
 * Run before every save of a page or a component file:   node tools/check-ds.js "Mx Web.dc.html" design-studio.jsx
 * Exits 1 and lists every value that is not in MX DS V3. A page must print "0 violations" before it is saved.
 * It reads the token names from ds/mx/tokens.css (MX DS V3, installed from the design system artifact). */
const fs = require('fs'), path = require('path');
const here = __dirname;
const css = fs.readFileSync(path.join(here, '..', 'ds', 'mx', 'tokens.css'), 'utf8');
const defined = new Set([...css.matchAll(/--([A-Za-z0-9_-]+)\s*:/g)].map(m => m[1]));
const palette = new Set([...defined].filter(n => /^(teal|amber|neutral|red)\d+$/.test(n)));
const TOKENS = { displayBold: [40, 700], headingLargeBold: [30, 700], headingMediumBold: [26, 700], titleBold: [18, 700], subtitleSemiBold: [16, 600],
  bodyRegular: [14, 400], bodySemiBold: [14, 600], bodyBold: [14, 700], labelRegular: [13, 400], labelSemiBold: [13, 600], labelBold: [13, 700],
  captionRegular: [12, 400], captionSemiBold: [12, 600], overlineBold: [11, 700], microBold: [10, 700], codeRegular: [12, 400] };
const PAIRS = new Set(Object.values(TOKENS).map(([z, w]) => z + '|' + w));
const SIZES = new Set(Object.values(TOKENS).map(([z]) => z));
const TIGHT = new Set([26, 30, 40]);
const NAMED = /\b(white|black|red|green|blue|gray|grey|orange|yellow|purple|pink|teal|silver|navy)\b/;
const SPACING = new Set(['padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'gap', 'row-gap', 'column-gap']);
const COLOUR = new Set(['color', 'background', 'background-color', 'border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'border-color', 'outline', 'fill', 'stroke', 'box-shadow']);
function decls(st) { return st.split(/;(?![^{]*\}\})/).map(p => { const i = p.indexOf(':'); return i < 0 ? null : [p.slice(0, i).trim(), p.slice(i + 1).trim()]; }).filter(Boolean); }
const dyn = v => v.includes('{{');
function checkStyle(st, add) {
  const d = decls(st), get = k => (d.find(x => x[0] === k) || [])[1];
  for (const m of st.matchAll(/var\(--([A-Za-z0-9_-]+)/g)) {
    if (!defined.has(m[1])) add('unknown token', `--${m[1]}`);
    else if (palette.has(m[1])) add('palette step used directly', `--${m[1]}`);
  }
  for (const [k, v] of d) {
    if (COLOUR.has(k) && (/#[0-9a-fA-F]{3,8}\b/.test(v) || /\b(rgb|hsl|oklch)a?\(/.test(v) || NAMED.test(v.replace(/var\([^)]*\)/g, '')))) add('raw colour', `${k}:${v}`);
    if (k === 'line-height' && !dyn(v)) add('line height set (comes from the font)', `${k}:${v}`);
    if (k === 'font-family' && !dyn(v) && !/^(var\(--font-(sans|mono)\)|inherit)$/.test(v)) add('font family', v);
    if (k === 'font' && v !== 'inherit') add('font shorthand', v);
    if (SPACING.has(k) && !dyn(v.replace(/\{\{[^}]*\}\}/g, ''))) {
      for (const part of v.replace(/\{\{[^}]*\}\}/g, '').replace(/calc\(var\(--sizing[A-Za-z]+\) \* -1\)/g, 'OK').replace(/var\(--sizing[A-Za-z]+\)/g, 'OK').split(/\s+/).filter(Boolean)) {
        if (part === 'OK' || part === '0' || part === 'auto' || /%$/.test(part) || /^-?[0-2](\.\d+)?px$/.test(part)) continue;
        add('spacing off the Sizing scale', `${k}:${v}`); break;
      }
    }
  }
  const fz = get('font-size'), fw = get('font-weight'), ls = get('letter-spacing');
  const z = fz && !dyn(fz) ? parseFloat(fz) : null, w = fw && !dyn(fw) ? parseInt(fw, 10) : null;
  if (fz && !dyn(fz) && (!/px$/.test(fz) || !SIZES.has(z))) add('text size not a token', `font-size:${fz}`);
  if (fw && !dyn(fw) && ![400, 600, 700].includes(w)) add('text weight not a token', `font-weight:${fw}`);
  if (z !== null && w !== null && SIZES.has(z) && [400, 600, 700].includes(w) && !PAIRS.has(z + '|' + w)) add('size and weight are not a token together', `${z}/${w}`);
  if (ls && !dyn(ls) && ls !== 'normal') {
    const okWide = /^0?\.08em$/.test(ls) && z === 11, okTight = /^-0?\.02em$/.test(ls) && TIGHT.has(z);
    if (!okWide && !okTight) add('letter spacing not from a token', `letter-spacing:${ls}` + (z ? ` at ${z}px` : ''));
  }
  const br = get('border-radius'), h = get('height');
  if (br && !dyn(br)) {
    const hv = h && /^[0-9.]+px$/.test(h) ? parseFloat(h) : null;
    for (const part of br.split(/\s+/)) {
      if (/^var\(--(xSmall|small|med|large)BorderRadius\)$/.test(part) || part === '0' || part === '50%' || part === 'inherit') continue;
      if (/^[0-9.]+px$/.test(part) && hv !== null && Math.abs(parseFloat(part) - hv / 2) < 0.01) continue;
      add('corner radius not a constant or half the height', `border-radius:${br}` + (h ? ` (height ${h})` : ' (no fixed height)')); break;
    }
  }
}
// A component file (.jsx) loaded by a page. Styles there are objects, so the rules are checked line by line:
// font size, weight and letter spacing may only be written in the text token table between the two ds-check markers.
function checkJsx(file, add0) {
  const src = fs.readFileSync(file, 'utf8');
  const add = (rule, ex) => add0(rule, ex.trim());
  const a = src.indexOf('// ds-check:text-tokens-start'), b = src.indexOf('// ds-check:text-tokens-end');
  const body = a >= 0 && b > a ? src.slice(0, a) + src.slice(a, b).replace(/[^\n]/g, ' ') + src.slice(b) : src;
  if (a < 0 || b < 0) add('text token table markers missing', file);
  else for (const m of src.slice(a, b).matchAll(/^\s*([A-Za-z]+):\s*\{([^}]*)\}/gm)) {
    const t = TOKENS[m[1]], z = +(m[2].match(/fontSize:\s*([0-9.]+)/) || [])[1], w = +(m[2].match(/fontWeight:\s*([0-9]+)/) || [])[1];
    if (!t || t[0] !== z || t[1] !== w) add('text token table does not match MX DS V3', `${m[1]}: ${z}/${w}`);
  }
  const lines = body.split('\n');
  const SP = /\b(padding|paddingLeft|paddingRight|paddingTop|paddingBottom|margin|marginLeft|marginRight|marginTop|marginBottom|gap|rowGap|columnGap):\s*("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|-?[0-9.]+)/g;
  const okSpace = (v) => v.replace(/calc\(var\(--sizing[A-Za-z]+\) \* -1\)/g, 'OK').replace(/var\(--sizing[A-Za-z]+\)/g, 'OK').split(/\s+/).filter(Boolean)
    .every((p) => p === 'OK' || p === '0' || p === 'auto' || /^-?[0-2](\.\d+)?(px)?$/.test(p));
  lines.forEach((line, i) => {
    const at = (s) => `${i + 1}: ${s}`;
    const code = line.replace(/\/\/.*$/, '');
    for (const m of code.matchAll(/var\(--([A-Za-z0-9_-]+)/g)) {
      if (!defined.has(m[1])) add('unknown token', at(`--${m[1]}`));
      else if (palette.has(m[1])) add('palette step used directly', at(`--${m[1]}`));
    }
    for (const m of code.matchAll(/["'`][^"'`]*?(#[0-9a-fA-F]{3,8}\b|\b(?:rgb|hsl|oklch)a?\([^)]*\))/g)) add('raw colour', at(m[1]));
    for (const m of code.matchAll(/\b0x[0-9a-fA-F]{6}\b/g)) add('raw colour (numeric)', at(m[0]));
    if (/\b(fontSize|fontWeight)\s*:/.test(code)) add('font size or weight written outside the text token table', at(code));
    if (/\blineHeight\s*:/.test(code)) add('line height set (comes from the font)', at(code));
    if (/\bletterSpacing\s*:/.test(code)) add('letter spacing written outside the text token table', at(code));
    for (const m of code.matchAll(/\bfontFamily:\s*("[^"]*"|[A-Za-z_.]+)/g)) if (!/^"(var\(--font-(sans|mono)\)|inherit)"$/.test(m[1])) add('font family', at(m[0]));
    for (const m of code.matchAll(/\bfont:\s*"([^"]*)"/g)) if (m[1] !== 'inherit') add('font shorthand', at(m[0]));
    for (const m of code.matchAll(SP)) {
      let v = m[2];
      if (/^[`"]/.test(v)) { v = v.slice(1, -1); if (v.includes('${')) { add('spacing built from a computed value', at(m[0])); continue; } }
      if (!okSpace(v)) add('spacing off the Sizing scale', at(m[0]));
    }
    for (const m of code.matchAll(/\b(borderRadius|border(?:Top|Bottom)(?:Left|Right)Radius):\s*("[^"]*"|[0-9.]+)/g)) {
      const v = m[2];
      if (/^"(var\(--(xSmall|small|med|large)BorderRadius\)|50%|inherit|0)"$/.test(v) || v === '0') continue;
      const h = (code.match(/\bheight:\s*([0-9.]+)\b/) || [])[1];
      if (/^[0-9.]+$/.test(v) && h && Math.abs(parseFloat(v) - parseFloat(h) / 2) < 0.01) continue;
      add('corner radius not a constant or half the height', at(m[0] + (h ? ` (height ${h})` : ' (no fixed height on this line)')));
    }
    for (const m of code.matchAll(/\bboxShadow:\s*("[^"]*")/g)) if (!/^"(var\(--mx-drop-shadow\)|none)"$/.test(m[1])) add('shadow not the drop shadow constant', at(m[0]));
    for (const m of code.matchAll(/--mx-([a-z0-9-]+)/g)) if (m[1] !== 'drop-shadow') add('old --mx- name', at(m[0]));
    for (const m of code.matchAll(/--kls-[a-z0-9-]+/g)) add('old --kls- name', at(m[0]));
  });
}
let total = 0;
for (const file of process.argv.slice(2)) {
  const src = fs.readFileSync(file, 'utf8');
  const isJsx = /\.jsx$/.test(file);
  const cut = isJsx ? -1 : src.lastIndexOf('<script type="text/x-dc"');
  const markup = cut < 0 ? src : src.slice(0, cut), logic = cut < 0 ? '' : src.slice(cut);
  const found = {};
  const add = (rule, ex) => { (found[rule] = found[rule] || { n: 0, ex: new Set() }); found[rule].n++; if (found[rule].ex.size < 6) found[rule].ex.add(ex.slice(0, 110)); };
  if (isJsx) checkJsx(file, add); else {
  for (const m of markup.matchAll(/\bstyle(?:-hover)?="([^"]*)"/g)) checkStyle(m[1], add);
  for (const m of markup.matchAll(/<style>([\s\S]*?)<\/style>/g)) for (const r of m[1].matchAll(/\{([^{}]*)\}/g)) checkStyle(r[1], add);
  for (const m of src.matchAll(/--mx-([a-z0-9-]+)/g)) if (m[1] !== 'drop-shadow') add('old --mx- name', `--mx-${m[1]}`);
  for (const m of logic.matchAll(/var\(--([A-Za-z0-9_-]+)/g)) { if (!defined.has(m[1])) add('unknown token in logic', `--${m[1]}`); else if (palette.has(m[1])) add('palette step used directly in logic', `--${m[1]}`); }
  for (const m of logic.matchAll(/['"`][^'"`\n]*?(#[0-9a-fA-F]{6}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\))/g)) add('raw colour in logic', m[1]);
  if (!/href="ds\/mx\/tokens\.css"/.test(markup)) add('page does not load ds/mx/tokens.css', file);
  }
  const n = Object.values(found).reduce((a, b) => a + b.n, 0); total += n;
  console.log(`${path.basename(file)}: ${n} violation${n === 1 ? '' : 's'}`);
  for (const [rule, v] of Object.entries(found).sort((a, b) => b[1].n - a[1].n)) { console.log(`  ${v.n} × ${rule}`); for (const e of v.ex) console.log(`      ${e}`); }
}
process.exit(total ? 1 : 0);
