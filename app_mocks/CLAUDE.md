# Project: MX — working rules

This is the **consolidated MX project**: individual feature projects (Control Tower,
Team Workspace, etc.) are being migrated into this single project, one at a time, and
audited for consistency as they land. It is bound to the **MX / Kilsar Design System**
(`_ds/mx-design-system-019df30f-a6e5-7a34-a806-20b51ae1ab4e/`). Follow it exactly.

## Format: every design is a Design Component (.dc.html)
This project uses **Design Components** — single streaming `Name.dc.html` files (template +
logic class, no separate `type="text/babel"` jsx entrypoints). When migrating a feature in
from an older project that used the `.html` + `.jsx` pattern, **convert it to a `.dc.html`** —
don't copy the old format. Author/edit with `dc_write` / `dc_html_str_replace` /
`dc_js_str_replace` / `dc_set_props`. Load the DS bundle in every DC's `<helmet>`:
```
<link rel="stylesheet" href="../_ds/mx-design-system-019df30f-a6e5-7a34-a806-20b51ae1ab4e/colors_and_type.css">
<script src="../_ds/mx-design-system-019df30f-a6e5-7a34-a806-20b51ae1ab4e/_ds_bundle.js"></script>
```
Tweaks are **props on the root DC** (declared in the `data-props` JSON), not a hand-rolled
panel — the host renders the Tweaks overlay for every prop with a non-null editor.

## RULE −1 — LITERAL INSTRUCTIONS (read before doing anything)
When the user gives an exact value, do that exact thing. Do NOT paraphrase, "improve,"
shorten, or reword it. There is no gap to fill.
- **Quoted/labelled strings are verbatim.** If they say the text should be
  `Choose students / groups`, the string in the code is exactly `Choose students / groups`
  — same words, same casing, same punctuation. Never substitute your own copy. If a string
  appears between quotes, a colon, or "should be:", copy-paste it character-for-character.
- **"NOT X" is a hard constraint.** If they say "the GROUP, NOT the students," select the
  group as a single entity — do not expand, flatten, or reinterpret it into what seems
  easier to build.
- **Change only what was asked.** Don't redesign, rename, or re-scope adjacent things.
- **If genuinely ambiguous, ask — don't guess.** Guessing wrong wastes their turn and their
  patience. A one-line question is cheaper than a wrong build.
Before calling ready_for_verification, re-read the user's last message and confirm every
literal value they gave appears unchanged in the code. If even one is paraphrased, you failed
this rule.

## RULE −2 — UNDERSTAND, THEN BUILD, THEN VERIFY THE BEHAVIOR (not just the code)
Most errors here are not typos — they're me building the wrong thing fast and calling it done.
Slow the loop down:
1. **Restate the ask before touching code.** In one sentence, state what the user wants to
   happen and what should NOT change. If that sentence is fuzzy, ask — do not start.
2. **Find the real mechanism, don't assume it.** Read the actual component/data flow that the
   change touches (e.g. how a drawer receives its preset, how a picker resolves chips) before
   editing. Assumptions about how the code works are the #1 source of wrong builds.
3. **Smallest change that satisfies the ask.** No adjacent "while I'm here" edits, no
   re-scoping, no redesigns. Touch only what the request names.
4. **Verify the BEHAVIOR, not just that it compiles.** "No console errors" ≠ correct. Before
   saying done, trace (or actually exercise) the user's described flow end-to-end and confirm
   the outcome matches their words. If you can't confirm it, say so instead of claiming done.
5. **Don't pad the reply.** Report what changed and whether it does what they asked. No
   victory laps, no inventing extra behavior they didn't request.
A turn that compiles cleanly but does the wrong thing is a failed turn. Correctness against
the user's actual intent is the only bar that counts.

## RULE 1 — DS adherence is a BLOCKING gate, not advice (read this first, every time)
`ready_for_verification` returns a "Design-system adherence" list. **Those findings are
blocking.** Do not end a turn, and do not tell the user you're done, while a finding you
introduced is still open. "It matches the existing code" / "pre-existing house convention"
is NOT a valid reason to dismiss one — that exact rationalization is how the source projects
accreted their violations. The standard is the DS, never the surrounding code.

The bar is **zero NEW findings**. Before delivery, compare the finding count to before your
change: if it went up, you introduced a violation — fix it. For each finding you choose not
to fix, you owe ONE of:
  (a) a real fix, or
  (b) a real DS fix proposed in `DS-UPDATES.md` (when the right fix is a change to the DS
      itself, not the app code).
Silence is not an option. If you're unsure whether a finding is real, ask — do not assume noise.

### Don't manufacture the noise that trains you to ignore the signal
Two recurring findings are self-inflicted and must stop at the source:
- **`font-family 'tmFont' …not registered`** — `tmFont`/`wmFont` were JS consts holding
  `var(--kls-font-sans)`. The linter can't see through the alias, so every use re-fires.
  In NEW code, write `fontFamily: "var(--kls-font-sans)"` directly (or apply a `.kls-text-*`
  class). Do not add new `xxFont` aliases.
- **`raw px value … use a token`** — for any color/spacing/radius/type value the DS defines,
  use the token (`var(--kls-space-*)`, the radius scale, the named type scale). Raw px is for
  layout-only one-offs (a translateX, an icon viewBox) — never for spacing/padding/gap/radius
  that has a scale step.
Every new warning of these two kinds means you wrote it wrong, not that the linter is noisy.

## Rule 0 — Assemble, never recreate (the one that matters most)
Most DS violations come from hand-building a component that the DS already defines.
Do not do that. In priority order:
1. **If the DS bundle exports it, use it** — mount via
   `<x-import component-from-global-scope="MXDesignSystem_019df3.X" …>`.
2. **If it's only a `preview/*.html` card, copy that card's markup/spec verbatim.**
   Don't approximate from memory.
3. **Hand-written markup is allowed ONLY for layout/composition** (flex/grid/gaps/page
   structure) and for app-specific compositions the DS does not define (e.g. the web
   Header / NavSidebar chrome, which the source built from tokens) — never for a primitive
   the DS already defines.
If you catch yourself writing the visual styling of a named DS component by hand, stop
and pull the real one instead.

## Before delivery — run the DS audit (mechanical gate)
After changing ANY design, and before every `ready_for_verification`, run `ds-audit.js`
(paste its body into run_script). It scans every `.dc.html`/`.jsx`/`.html`/`.css` in the
project (excluding `_ds/`, `assets/`) and FAILS the gate on:
  1. **Token resolution** — every `var(--kls-*)` is defined in the DS stylesheet (catches
     typos like `--kls-easing-standard` → `--kls-ease-standard`).
  2. **No font aliases** — no `const xxFont = …`; write `fontFamily:"var(--kls-font-sans)"`.
  3. **No on-scale raw px** — a px-only spacing value containing a scale step {4,6,12,20,32,64}
     must be a `--kls-space-*` token.
  4. **Component-spec conformance** — a style object carrying a DS component's signature (e.g.
     `tertiary-container` bg + `on-tertiary-container` fg ⇒ PrimaryActionButton) must match that
     primitive's canonical dimensions from `preview/*.html` (h40 · padX `--kls-space-med` · gap
     `--kls-space-xsmall` · radius 8/12). This catches chrome that's really an off-spec DS
     primitive (e.g. a 44px-tall button) — checks 1–3 are token-level and blind to it. Extend
     `COMPONENT_SPECS` as more primitives need guarding; keep rules PRESENT-but-wrong only so it
     never cries wolf.
A non-empty FAIL list means you introduced drift — fix it, do not deliver. The "off-scale
layout literal(s)" line is informational; it does not block. If the audit can't classify
something and you believe the DS itself needs to change, log it in `DS-UPDATES.md`.

(Correct token names: easing is `--kls-ease-standard` (NOT `-easing-`); durations are
`--kls-dur-fade-animation` etc. (NOT `--kls-motion-fade`).)

## Before building ANY component, read its canonical spec
Do **not** eyeball dimensions, fonts, or colors. For every DS component you touch, first open
its preview card and copy the numbers verbatim:
- Preview cards: `/projects/019df30f-a6e5-7a34-a806-20b51ae1ab4e/preview/*.html`
  (e.g. CompoundSwitch → `preview/compound-switch.html`).
- The card's caption/comment block states the exact spec (height, padding, radius, font
  token, bg/fg tokens). Match it to the pixel. If a component isn't in `preview/`, check
  `MOBILE_DRIFT.md` and `colors_and_type.css` before improvising.

## Token rules
- Use `var(--kls-*)` tokens for every color, never hex.
- Use semantic M3 tokens (`--kls-surface`, `--kls-on-surface`, `--kls-outline`,
  `--kls-primary`, `--kls-tertiary`), not legacy aliases.
- Type: use the named scale (12/600 = labelMediumSemiBold, etc.). Don't invent sizes/weights.
- Spacing: only the scale (tiny 4 / xSmall 6 / small 12 / med 20 / large 32 / xLarge 64).

## Patterns already verified (reuse, don't re-derive)
- **Segmented tabs (CompoundSwitch)**: track h40 · pad 2 · gap 4 · radius 8 · bg `tertiary` ·
  border `outline-variant`; buttons h36 · pad 0 18px · radius 8 · **12px/600** · inactive
  `on-tertiary` · active bg `surface` + `on-surface` + `box-shadow 0 1px 2px rgba(0,0,0,.04)`.
- **Section label / metadata field label**: ALL CAPS, labelMediumSemiBold (12/600), tracking
  `0.08em`, `text-transform: uppercase`, color `on-surface-variant` (DS spec since 2026-06).

## Project structure
- Shared at root: `_ds/` (design system, do not edit), `assets/` (icons + images),
  `ds-audit.js`, `DS-UPDATES.md`, this file.
- One folder per migrated feature, e.g. `control-tower/Control Tower.dc.html`. Reference
  shared resources with `../` (`../_ds/…`, `../assets/…`).

## Migration status
### Two unified app shells (the entry points)
The mock is now **one navigable product per platform**, each authored once. Every screen lives
in exactly one place; navigation is real; unbuilt destinations show a "Not built yet" placeholder.

- ✅ **Web App** — `Web App.dc.html` → mounts `web-app.jsx`. One sidebar+header chrome with a
  router. Built screens: **Control Tower**, **Team Workspace** (members/groups + drawers + the
  Teammate Picker, reached inside Control Tower's Assign flow). **Help & Feedback** dialog +
  **Profile** drawer (folded in from 88549d6b `app.jsx`) open from the sidebar "Help & Feedback"
  item and the header avatar → Profile → Help row. **Written Exams** (Practice/Exam setup,
  question runner, results, history, progress, student picker) is the `writtenExams` sidebar
  route. Other sidebar tabs → placeholder. Tweaks (groupsSurface, showKpis, examRole) are DC
  props. Dark theme.
- ✅ **Mobile App** — `Mobile App.dc.html` → mounts `mobile-app.jsx`. One iOS frame + one bottom
  nav. Built tabs: **Home** (AIM home; the **Help & Feedback** + **Profile** sheets open from its
  header — no separate backdrop screen anymore), **Workspace → Team** drill-in (member/group
  sheets, swipe-to-delete) and **Workspace → Written Exams** (study/exam setup → pre-exam sheet
  → runner → results, plus History/Progress via an in-screen tab bar). Orion/Notifications →
  placeholder. Light theme.

Both shells are AUTO-ASSEMBLED bundles: the source projects' interlocking `.jsx` (chrome, screens,
drawers, picker, iOS frame, mobile primitives) are concatenated into one `*.jsx` per platform —
duplicate top-level decls (`useState`, `GroupRow`, `Avatar`, `BottomNav`) are de-duped/renamed,
and each screen's old standalone app-shell is stripped so the single router/chrome owns nav.
Mounted via `<x-import component-from-global-scope="WebApp"/"MobileApp">`. Faithful + clickable,
but bundle internals are NOT click-to-edit in the canvas (tweaks still work, as DC props).
If you regenerate a bundle, re-tokenize any on-scale raw-px paddings the audit flags (the original
mobile source used raw px; see the fix list in git history).

**Written Exams** (from project **019df76f**) was on a DIFFERENT design system (Geist + custom
`--bg/--ink/--accent` tokens). It was **re-themed onto MX** via `written-exams.css` — a stylesheet
that remaps those token names to `var(--kls-*)` and swaps fonts to Plus Jakarta Sans, so its
class-based components inherit the MX look with no per-component edits. Both Web App and Mobile App
helmets load `written-exams.css`. The web screens + mobile screens are concatenated into the
respective shell bundles (web-app.jsx / mobile-app.jsx); the mobile screens were wired from static
artboards into a real flow. `KILSAR_DATA` (the FAA question/roster seed) is inlined into both bundles.

Sources came from **c7b687b2** (Control Tower + Team Workspace web/mobile + Teammate Picker) and
**88549d6b** (mobile Help & Feedback → Mobile App Home sheets; web Help & Feedback → Web App
dialog + Profile drawer). Both source projects are now FULLY migrated. The standalone per-feature
DCs were removed once folded in (single source of truth).

## Filenames: no `&` (or other URL-special chars)
The DS audit / file tooling rejects paths containing `&`. Name migrated files plainly
(e.g. `Mobile Help and Feedback.dc.html`, not `… Help & Feedback …`).

## Voice
Education flavor: Courses / Modules / Assignments / Students. Keep status copy terse.
