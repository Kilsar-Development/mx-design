# DS-UPDATES — proposed changes to push back into the design system

Things discovered while building/migrating that should be **changed or added in the
bound MX / Kilsar Design System itself** (`_ds/…`), not just patched per-screen.

This is a backlog of *proposals for the DS owner*. It is distinct from `DS-GAPS.md`
(accepted gaps we are NOT chasing). An item here means: "the DS is currently silent,
inconsistent, or wrong on this, and app code had to make a local call — the DS should
be updated so the call is canonical."

Status legend: 🔵 proposed · 🟡 in review · ✅ landed in DS

---

## 1. 🔵 Web page header (content-pane title + subtitle) — reconcile the spec
**Found:** 2026-06 · Control Tower vs. Written Exams screens (web)

The DS guide's **Content pane (web)** entry specs the page header as `h1 32/700` + subtitle.
No screen actually follows it:
- **Control Tower** rendered `28px / 400` title + `15px / 500` subtitle (with a `translateY(-5px)`
  alignment hack).
- **Written Exams** rendered `24px / 600`, `letter-spacing -0.025em` title + `13.5px`
  `on-surface-variant` subtitle.

Per user direction, the app was standardized on the **Written Exams** treatment:

> **Page header title** — `24px / 600`, `letter-spacing: -0.025em`, color `on-surface`,
> `margin-bottom: var(--kls-space-tiny)` (4).
> **Page header subtitle** — `13.5px`, weight 400, color `on-surface-variant`.

**Ask of the DS:** update the `content-pane.html` / `page-header.html` cards (and the guide's
type-scale note) to make this the canonical web content-pane header, OR formally bless 32/700 and
have us revert. The two cannot both be "the standard." The `13.5px` subtitle is also off the named
type scale (no 13.5 step) — either add a step or map it to an existing one (`labelLarge` 14 is
closest) as part of the reconciliation.

---

## 2. 🔵 Web content-pane layout standard — page padding + "chrome outside the card"
**Found:** 2026-06 · Control Tower / Written Exams / Team Workspace (web)

The three web content panes each laid out their header differently. Standardized them on one
pattern (and Team Workspace was refactored to match). Propose making this **the** canonical
web content-pane spec in `content-pane.html`:

> **Scroll-pane padding** — `var(--kls-space-med)` top · `var(--kls-space-large)` left/right ·
> `var(--kls-space-xlarge)` bottom. The `.med` top + 1.45 title line-height reads as a balanced
> `.large` gap; a literal `.large` top looked like `.xlarge`.
> **Page header** lives **outside** the surface card: `h1` (24/600, `-0.025em`, `on-surface`) +
> subtitle (13.5, `on-surface-variant`) on the left, primary action button pinned right.
> **Segmented toggles** (CompoundSwitch) and **action buttons** also live **outside** the card —
> the card holds only the table/body. (Quick-filter chips that scope the table stay *inside* the
> card, as in Control Tower.)

**Ask of the DS:** bless this in `content-pane.html` + `page-header.html` (currently they imply
title-in-card / 32-top). Note this supersedes DS-UPDATES item 1's "raise everything to `.large`
top" — the resolved value is `.med` top, not `.large`. Also still owed: a named type step for the
13.5 subtitle (no 13.5 on the scale; `labelLarge` 14 is closest).

---

## 3. 🔵 Assignment editor drawer — section-to-label spacing is `small`, not `med`
**Found:** 2026-07 · Control Tower assign / edit drawers (web)

The assignment editor drawer body stacked its sections (Type pickers → Term/Course/Task,
Instructions, Assignees, Due date) with `gap: var(--kls-space-med)` (20). Per user direction
this is drift — the canonical spacing between a drawer section and the following field label is
`var(--kls-space-small)` (12). Fixed the create-assignment drawer's body column gap to `.small`.

**Ask of the DS:** bless `var(--kls-space-small)` as the standard vertical gap between form
sections/field groups inside a drawer or sheet body, and note it on the relevant
`drawer-overlay.html` / `sheet-overlay.html` cards so the same value is used everywhere (the
edit-allocation drawer and mobile sheets still use `.med` and should follow once confirmed).

---

<!-- Add new proposed DS changes below, numbered, newest at the bottom. -->

## 4. 🔵 Add a **teal** primitive scale — the palette has no cool-green/blue-green hue
**Found:** 2026-07 · Control Tower student view (web) — assignment type dots

The student Control Tower distinguishes assignment types (Task / Oral exam / Written exam) with
colored dots that must NOT collide with the status-pill hues (blue `info`, orange `accent-4`,
green `success`). That left only purple and red free — two exam types couldn't be told apart.

Added a **teal** primitive scale (`--kls-color-teal-50 … -700`, mirroring the other families'
50→700 steps) to `colors_and_type.css` and used `teal-200` (#2DD4BF) for the Oral-exam dot.
Final type-dot mapping: Task `purple-400`, Oral `teal-200`, Written `red-100` (#F87171).

**Ask of the DS:** bless teal as a first-class primitive family (it fills a real gap — no existing
hue reads as cyan/teal) and, if useful, map it onto a numbered `accent-*` slot (10/11 are reserved
but unbound) so it tracks light/dark like the others. Currently only the raw `--kls-color-teal-*`
primitives are defined.

---

## 5. 🔵 Add a **four-circles grid-view** icon — no asset exists for the list/grid toggle
**Found:** 2026-08 · Library screen (web) — list/grid view toggle

The Library toolbar needs a grid-view glyph: a **2×2 arrangement of hollow circles (rings)**.
The DS asset set has no such icon. The two near misses are both wrong:
- `assets/icons/circles.png` — a **single** ring, not four.
- `assets/icons/fourDots.png` — four **filled** dots, thinner/smaller than the intended mark.

Local call: the toggle draws an inline SVG (`LibGridGlyph` in `web-app.jsx`) — four 3.4r circles
at 6.5/13.5 on a 20×20 box, 1.6 stroke, `currentColor`. **It is an approximation, not the exact
icon** the user referenced (their reference has heavier rings and tighter spacing).

**Ask of the DS:** ship a canonical `fourCircles` (or `gridView`) PNG in `assets/icons/`, mask-
compatible like the rest, so the Library toggle can drop the inline SVG.

---

## 6. 🔵 Add **eye / hide (visibility)** and **grid-view** icons — DS has neither
**Found:** 2026-08 · Model editor (web) — part-visibility toggles in the left tree

The model editor's Parts tree needs a per-part **show/hide** control. The DS icon set ships no
eye / eye-off glyph, so `MeEyeBtn` (`web-app.jsx`) currently masks `camera.png` and dims it when
the part is hidden. That is **semantically misleading** — camera reads as "viewport" or "capture,"
not "visibility."

**Ask of the DS:** ship `eye` + `eyeOff` (or a single `visibility` glyph the app can dim) in
`assets/icons/`, mask-compatible. Related: item 5's four-circles grid-view icon is still owed;
both are the same class of gap (common editor/table chrome with no canonical asset).

---

## 7. 🔵 Add a **compact switch** size — 44×26 is too heavy for dense control lists
**Found:** 2026-08 · Model editor (web) — Object Groups / Annotations / Isolate toggles

`switch.html` specs one size: track 44×26 · knob 22 · 2 inset · travel 18. In the model editor's
inspector, switches sit on 32px-tall list rows (one per part, plus one per group), and at 26px tall
the control dominates the row and crowds the label.

Local call: the editor's `MeSwitch` renders a **compact** variant — track 36×20 · knob 16 ·
2 inset · travel 16 — same tokens (`primary` / `outline-variant` / `surface`), same
fade-animation + ease-standard transitions. Form-level toggles keep the canonical 44×26.

**Ask of the DS:** add a documented `sm` size to `switch.html` (proposed 36×20 / knob 16 / travel 16)
for dense list rows, so this isn't a per-app improvisation.

---

## 8. 🔵 Add an **isolate / bring-to-foreground** icon — no asset exists
**Found:** 2026-08 · Model editor (web) — per-part Isolate control in the Parts tree

Each part row now carries an **Isolate** button (hides every other part in the active scene) to the
left of its visibility toggle. The DS icon set has no glyph for it; the closest assets (`stack`,
`cube`) both read as "collection," not "bring this one forward."

Local call: `MeIsolateGlyph` (`web-app.jsx`) draws it inline — two overlapping rounded squares on a
20×20 box, the **front** one diagonally hatched, 1.5 stroke (1.1 for the hatch), `currentColor`.
Active state fills the 24px button with `tertiary-container` / `on-tertiary-container`.

**Ask of the DS:** ship a canonical `isolate` (or `foreground`) PNG in `assets/icons/`, mask-
compatible like the rest. Third glyph gap in this class after items 5 and 6.

---

## 9. 🔵 Add a **sparkle / generate** glyph — no asset exists
**Found:** 2026-08 · Model editor (web) — "Generate" action at the bottom of the Animations list

The Animations section's generate action needs the conventional AI/generate mark (a large
four-point star with two smaller ones). No DS icon comes close (`star`/`starFilled` are single
five-point stars, semantically "favorite").

Local call: `MeSparkleGlyph` (`web-app.jsx`) draws it inline — three filled four-point stars on a
20×20 box, `currentColor`, sized 16 inside a full-width PrimaryActionButton.

**Ask of the DS:** ship a canonical `sparkle` (or `generate`) PNG in `assets/icons/`, mask-
compatible like the rest. Fourth glyph gap in this class after items 5, 6 and 8.

---

## 10. 🔵 Canonical **"Add <thing>" action button** — leading plus GLYPH, not a "+" character
**Found:** 2026-08 · Blocks screen (web); applied across Control Tower / Library / Team Workspace

Every primary create action in the app was hand-writing its plus as a text character
(`<span style={{fontSize:18,lineHeight:1,marginTop:-1}}>+</span>`). As a glyph that is wrong: the
"+" of Plus Jakarta Sans sits on the math axis, so it renders visually small and low against a
14/700 label, and each site was nudging it with its own `marginTop` hack.

Local call: a single `PlusGlyph` component (`web-app.jsx`) draws it as an inline SVG — 18×18 box
(16 for dense/text buttons), cross at `M9 3.25v11.5 M3.25 9h11.5`, `stroke: currentColor`,
`stroke-width: 1.9`, round caps — placed as the **leading** child of the button, before the label,
with the button's `gap: var(--kls-space-xsmall)` doing the spacing. Copy pattern is
**"Add <thing>"** (`Add block`, `Add task`), not "New <thing>".

**Ask of the DS:** add this to `buttons-primary.html` as the canonical create-action variant —
leading 18px plus glyph (optically centered on the label, no baseline nudge) + `Add <thing>` copy —
and ship the mark as a mask-compatible `plus` PNG in `assets/icons/` so apps don't inline SVG.
Fifth glyph gap in this class after items 5, 6, 8 and 9.

---

## 11. 🟡 **CompoundSwitch: spec the iconless tile** (label must optically center)
**Found:** 2026-08 · Catalog screen segmented tabs (Blocks / Block Templates / Modules / Tasks)

`preview/compound-switch.html` only shows tiles WITH a leading icon, so the spec is silent on the
text-only case. Naive implementations keep the icon slot + its 8px gap in the flex row, which pushes
every label off-center by ~12px — it reads as a missing icon. Local fix: render the icon and its gap
only when the tab defines one, and `justify-content: center` the tile.

**Ask of the DS:** add a text-only row to the CompoundSwitch card and state it — tile is
`justify-content: center`; the 16px icon and `--kls-space-xsmall` gap exist only when an icon is
supplied. Also worth stating on the same card: tiles are `flex: none` + `white-space: nowrap` and
the TRACK doesn't shrink — labels should never wrap or squeeze; a tight toolbar scrolls the track
instead.

## 12. 🟢 **Labeled filter checkbox** (checkbox + text, inline filter bar)
**Found:** 2026-08 · Catalog → Tasks filter bar

The Tasks filter bar needs checkbox + label pairs inline (Task / Scenario / Subtask). The DS defines
the checkbox mark (`preview/checkbox.html`) but not the labeled, clickable pair, so each app invents
the hit target and label style. Local build: whole pair is one `<button aria-pressed>`, h40 (min hit
target), `gap: var(--kls-space-xsmall)`, label `labelLarge` (14/500) `on-surface`, 18px mark.

**Ask of the DS:** ship a `CheckboxField` (mark + label, h40 target, aria-pressed) on the checkbox
card. Note the size question it also resolves: the card's 22×22 mark is right for selection rows but
optically heavy next to a 14px filter label — 18×18 with a 14px check is the inline-filter size, so
the card should state both sizes rather than leaving apps to shrink it by feel.
