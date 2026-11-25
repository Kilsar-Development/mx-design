# Project: Mx product vision & UX overhaul

This file holds the standing rules for this project: read it before changing anything. The dated record of what Joel asked for and what was built for each piece of work is in `DECISIONS.md`; read the section for the page you are about to touch, and add to that file, not this one, when something is decided.

## Reference: MX mocks (V1 product)
- Project `22570fd9-2e4e-40d4-beb2-270816805784` (https://claude.ai/design/p/22570fd9-2e4e-40d4-beb2-270816805784). Pull content/features from it into V2 as needed. Key files: `Web App.dc.html` → `web-app.jsx` (all screens), `Mobile App.dc.html`, `release-notes.js` (shared `window.MX_RELEASES`), `simulators/`. Local copies for grep live in `_ref/` (read-only reference, not part of V2).

## LOCKED (turn 8) — canonical shells and rails
`Mx Web.dc.html` is the one true mock (Joel, 16 Nov 2026). The earlier canonical frames lived in `Mx IA Explorations.dc.html` (6a Student Home · 6d Student Tasks · 7a Instructor Home · 7b Admin Home · 6b/6c Milestones · 5b ⌘K); that page has been deleted.
- Student / Operator rail: Work = Home · Jobs · Tasks; Learn = Start here · Training · Assessments; Knowledge = Library · Assistant · Milestones; Help & Feedback · version. Commercial relabels: Tasks → Procedures.
- Instructor rail: Work = Home · Assignments · Tasks; Teach = Training · Assessments; Build = Design Studio; Knowledge = Library · Assistant · Milestones; Workspace · Help & Feedback · version.
- Admin rail: Work = Home · Triage · Jobs · Procedures; Teach = Course Catalog · Training · Assessments; Build = Design Studio; Knowledge = Library · Assistant · Milestones; Operations = Inventory Mgr · Records · Integrations; Workspace · Help & Feedback · version. Course Catalog (Education) or Procedures (Commercial), not both.
- Header right zone everywhere: ⌘K search · bell (review inbox) · avatar (opens the Profile drawer, incl. the View as role dropdown).
- Control Tower = student Home + instructor Assignments. No Messages tab. Users & access assumed under Workspace.
- Open: definition of Triage; Start here content; Jobs for Education students.

## MX DS V3 — MANDATORY for every mock (locked 16 Nov 2026)
The design system is its own artifact: **MX DS V3**, https://claude.ai/artifact/CwiCQ424zfFMWNRieL9p3q. Read its `project/README.md` before designing or changing anything here. It replaces everything this file used to say under "DS V2": the old `--mx-<role>` names are retired, and the old `ds-v2/` and `_ds/` folders have been removed from this project.

### Review rule (no exceptions)
1. A page may use ONLY what MX DS V3 defines. If a design needs something the system does not have (a colour role, a text token, a height for a new kind of widget), STOP and ask Joel. Never invent, rename or approximate a token, and never add one to the system without his approval.
2. Before every save of a page or a component file, run `node tools/check-ds.js "<page>.dc.html"` (or `design-studio.jsx`) from `project/`. It must print `0 violations`. A page with violations is not saved.
3. The design system is installed in this project at `ds/mx/` (`tokens.css` and `fonts/`), copied by the server straight from the MX DS V3 artifact. Pages load it with `<link rel="stylesheet" href="ds/mx/tokens.css">`. The copy does not update by itself: when the design system changes, install it again from the artifact (same paths). Never edit anything under `ds/mx/` by hand.
4. Anything brought in from the V1 mocks (`_ref/`) is rewritten onto MX DS V3 before it lands.

### What the system fixes
- **Colour.** A widget is coloured only by a member of Flutter's `ColorScheme` (the 46-member list in the design system README) or by an accent (`accent1`–`accent4`), named exactly as in Flutter: `var(--primary)`, `var(--onPrimaryContainer)`, `var(--surfaceContainerLow)`, `var(--accent1)`. Palette steps (`teal600`…) only define hex values and are never used in a page. No hex, rgb() or named colours in a page. Keep pairs together (primary/onPrimary, accent1/accent2, accent3/accent4). No green: done = primary, in progress = inversePrimary, attention = accents, error only for real failures.
- **Text.** 16 tokens; each fixes font, size and weight: displayBold 40/700, headingLargeBold 30/700, headingMediumBold 26/700, titleBold 18/700, subtitleSemiBold 16/600, bodyRegular 14/400, bodySemiBold 14/600, bodyBold 14/700, labelRegular 13/400, labelSemiBold 13/600, labelBold 13/700, captionRegular 12/400, captionSemiBold 12/600, overlineBold 11/700 (+0.08em), microBold 10/700, codeRegular 12/400 monospace. The three large headings carry -0.02em. Nothing is applied on top of a token except colour: a bolder version is a different token (selected states switch token). No line-height (it comes from the font). Uppercase is applied by the widget. In a page a token is written as its `font-size` + `font-weight` (and its letter spacing or `var(--font-mono)` where it has one).
- **Spacing.** Padding, gap and margin use only the `Sizing` constants: `var(--sizingTiny)` 4, `var(--sizingXSmall)` 6, `var(--sizingSmall)` 12, `var(--sizingMed)` 20, `var(--sizingLarge)` 32, `var(--sizingXLarge)` 64 (0, 1px and 2px insets are allowed).
- **Radius.** `var(--xSmallBorderRadius)` 4, `var(--smallBorderRadius)` 8, `var(--medBorderRadius)` 12, `var(--largeBorderRadius)` 24, `50%` for circles. Fully rounded = half the widget's fixed height, written as that number.
- **Heights, one per kind of widget.** Main button 40; small button 32; icon button 36; small icon button and close 32; filter chip 30; segmented control track 36 / segment 30; stepper step 36; status pill and code tag 24; badge 20; switch 22; checkbox 22; text field 48; compact text field 40; avatar 26 (signed-in user 36). Text on them: buttons bodyBold / bodySemiBold (small: labelBold / labelSemiBold); chips and segments labelSemiBold, labelBold when selected; pills and badges captionSemiBold.
- **Shadow and motion.** Only `var(--mx-drop-shadow)`. Motion is written out: `cubic-bezier(0.42, 0, 0.58, 1)`; 80, 125, 250, 500ms.
- **Kinds of widget with no agreed height yet** (left as drawn; ask Joel before standardising): header search box, round icon buttons, large avatars, numbered and lettered circles, media thumbnails, path and step circles, small icon toggles, progress bars, menu rows, square tags.
- Direction is unchanged: teal and amber on a warm neutral; no big colour-block hero; the main colour only on primary actions, the active rail item, the path and progress fill.

### State of the pages
- `Mx Web.dc.html` is the true web mock. It, `Mx Web Login.dc.html`, `Mx Mobile.dc.html` and `Gap Analysis - Roles & Flows.dc.html` are on MX DS V3 and pass the check.
- `design-studio.jsx` is the Design Studio screen that Mx Web loads (see "Design Studio" in `DECISIONS.md`). It is under the same check: `node tools/check-ds.js design-studio.jsx`.
- Removed on 16 Nov 2026 (Joel's decision): the pages `DS V2 Colors`, `Mx Student Home - Look and Feel` and `Mx IA Explorations`; the `ds-v2/` folder; and `_ds/` (the older Kilsar design system that came across from Claude Design).

## How to work here
- Change only what Joel asks for. Opening a topic is a request to discuss it. A question he has not answered has not been seen: ask again, never pick an answer for him.
- Say plainly what was and was not checked. Open a page in the viewer only where he has allowed it (he has for Mx Web work and for the login page's animations).
- Product screens he supplies are old designs: redraw them on MX DS V3 and current patterns, and report every change from the original. Do not draw a screen he has not supplied or asked for.
- Client data shown in his screenshots (option names, workspace names, questions) is kept as written. Do not use Titan data.
- New values the design system lacks (a size, a curve, a blur, a gradient) are flagged to him as proposals when used, and recorded in `DECISIONS.md` until he approves or drops them.

## Notes that apply to particular files
- `design-studio.jsx` is a React component file loaded by `Mx Web.dc.html`, not page template: it cannot be edited by clicking in the canvas editor. Font size, weight and letter spacing may be written only in its `TX` table between the two `ds-check:text-tokens` markers; everything else uses `tx("tokenName", colour)`. Publish it with content type `text/javascript`.
- `Mx Web Login.dc.html` holds the whole web login flow in one file (screens are steps in state). `Mx Mobile Login.dc.html` is planned on the same model and does not exist yet.
- In SVG, gradient ids must not contain a colour word or hex-looking text, or the check reads them as raw colours.
- `_ref/` is an older read-only copy of the original mock. The current original is the artifact "MX" (https://claude.ai/artifact/WKd8JcnAwLqmngqdaG371F).
