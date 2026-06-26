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

<!-- Add new proposed DS changes below, numbered, newest at the bottom. -->
