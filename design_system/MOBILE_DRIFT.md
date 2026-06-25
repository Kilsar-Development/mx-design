# Mobile drift notes

What I built (from `home_screen.dart` + Figma) vs what the real app shows in screenshots. Use this when rebuilding the mobile kit in a feature project.

> **Promotions from the Data Sets project (2026-05-28):** items #1 (`PageHeader`)
> and #3 (`FilterChipRow`) below are now canonical preview cards —
> `preview/page-header.html` and `preview/filter-chip.html`. The Data Sets
> work also added new cards for `status-badges`, `empty-state`, `checkbox`,
> `spinner`, and `active-indicator`. See those cards for the canonical spec
> and use them instead of the notes here.

---

## New components needed

### 1. `PageHeader` (large title) — ✅ promoted → `preview/page-header.html`
Not the iOS-centered-title `TopBar` I built. Most mobile screens use:
- Just a big page title in `h2` (28 / 700) on the left
- Optional right-side icon button(s): search circle, profile avatar, etc.
- No background fill, no border-bottom, no `surface-variant` bar
- Sits above the scaffold content, gets the same scaffold bg

### 2. `DestinationCard`
Used at the top of the Workspace screen for top-level destinations (Library / Oral Exam / Chat).
- Square-ish, ~150×150
- `surface-container-low` background
- Radius `med` (12)
- Large icon (~28px) top-left, label bottom-left in `subtitleSmall` (16/600)
- Horizontal scroller of these
- Tap → navigate

### 3. `FilterChipRow` — ✅ promoted → `preview/filter-chip.html`
Top-level entity filter on Workspace. *Distinct from CompoundSwitch.*
- Individual pill chips (no shared track)
- Selected = filled dark in light mode, filled light in dark
- Unselected = outline only
- Padding `small`/`xsmall`, radius `pill`
- Trailing **`FilterButton`** circle (funnel icon) at end of row, right-aligned
- Use when: filtering a heterogeneous list at the screen level
- Vs CompoundSwitch: use that when picking between sub-views of the same entity

### 4. `BlockCard` (canonical card pattern, used in multiple places)
Same component on Home "Active blocks" and Workspace list:
- Surface bg, radius `med` (12)
- Padding `med` (20) all sides
- Optional **status pill** at top (`In Progress` green, `Needs Assistance` orange, etc.)
- Title in `subtitleLargeBold` (18 / 700)
- Subtitle in `bodySmall` (14 / 500) `on-surface-variant` — can be ACS codes, comma-separated, or "No associated ACS codes"
- Bottom: **`StatChipRow`** — 3 outlined chips with leading icons (`8 Tasks` / `1 Module` / `1 Student`)
- Tap → detail

### 5. `StatChip` (outlined)
- Pill shape, outlined (`outline-variant` 1px), transparent bg
- Padding `tiny` / `xsmall`
- Leading 16px icon + label in `labelMediumMedium` (12 / 500)
- Color: `on-surface-variant` for both icon and label
- *Different from* the existing solid status pill (`Pill` component)

### 6. `PendingReviewCard` (variant of BlockCard)
On Home, in horizontal scroller:
- Status pill at top
- Multi-line body text (large body) describing the request
- **Inline horizontal divider** between body and metadata
- Metadata: calendar icon + datetime, then a "person pill" (avatar + name)
- Horizontal scroller; partial 2nd card visible at edge

### 7. `TaskRow` with `BookmarkCircleButton`
On Home "Next tasks":
- Plain list row: title (subtitleSmall) + subtitle (bodySmall variant)
- Trailing: **bookmark circle button** — `CircleButton` size=40 with bookmark+plus icon
- Use instead of chevron when the action is "save/bookmark", not "drill in"

---

## Existing components to update

### `HomeScreen` (populated state)
My version has wrong section structure. The real shape is:
- Section 1: **Pending Review** — horizontal scroller of `PendingReviewCard`
- Section 2: **Active blocks** — horizontal scroller of `BlockCard`
- Section 3: **Next tasks** — vertical list of `TaskRow`

Each section has:
- Big title in `subtitleLargeBold` or `h3` (need to verify against `home_screen.dart` Continue/Pending widgets) on the LEFT
- "see all" link on the right — underlined, `labelMediumSemiBold`, `on-surface` color, no chevron

### `HomeScreen` header
- Workspace logo (full-color, native asset — not tinted) on the left, ~38px tall
- Profile avatar circle (~48px) with photo on the right
- **No greeting text**
- **No bell** (lives in bottom nav with badge)

### `BottomNav`
- Active state: **filled icon variant** + label, both `on-surface`
- Inactive: outline icon, label `on-surface-variant`
- Need filled+outline pairs for: home, workspace, orion, notifications
- Notification icon shows a red unread badge with count

### `Workspace` screen layout
- `PageHeader` "Workspace" + search circle button
- `DestinationCard` horizontal scroller (Library / Oral Exam / Chat)
- `FilterChipRow` (Blocks / Modules / Tasks + funnel)
- Vertical list of `BlockCard`

---

## Tokens used / verified

- Status pills in dark = `*-container` tokens (orange-700/orange-100 etc.) ✓
- Workspace logos render full-color in BOTH schemes (not tinted to `primary`)
- `subtitleLargeBold` (18 / 700) for card titles — heavier than my body-large guess
- `bodySmall` (14 / 500) for subtitles
- `on-surface-variant` for all secondary text (subtitles, "see all", inactive nav)

---

## Tokens still uncertain

- Exact size/weight for **section titles** ("Pending Review", "Active blocks") — looks like `h3` (20/600) or `subtitleLargeBold` (18/700). Need code or a screenshot with rulers.
- **Card horizontal scroller** gap — looks like `small` (12)
- **DestinationCard** dimensions — guessed 150×150; could be 140 or 160
- **Pending review divider** color — looks `outline-variant`
- Whether the **filter chip row** uses chip variant `outline` for unselected or just lighter fill

---

## Web side — already canonical
- Data table from screenshot is fully captured in `preview/data-table.html` (with corrected canonical spacing)
- CompoundSwitch + Refresh works as built
- Sidebar tabs render workspace logos full-color (AIM example)

---

## TODO next session
1. Get `home_screen.dart` to verify section-title style + exact card structure
2. Get the bottom-nav `BottomNavigationBarItem` icon assets (filled + outline)
3. Get the destination-cards screen Dart (likely in `WorkspaceScreen`) for exact dimensions
4. Get whatever defines `BlockCard` + `StatChip` (probably a `block_card.dart`)
5. Then rebuild `HomeScreenPopulated`, `WorkspaceScreen`, and `BottomNav` in the mobile kit

---

## Promotion log

### 2026-06-24 · from `Team Workspace` (mobile + web Control Tower)

**Card fixes (cards were inaccurate vs shipping Flutter):**
- `page-header.html` — title corrected **h1 28/700 → h2 24/600** (mobile/tablet screen titles, per live `WorkspaceScreen` / `TextStyle get h2`). Note added: the desktop *content-pane* page header uses h1 (32/700) — see `content-pane.html`.
- `filter-chip.html` — funnel icon stroke bumped **1.8 → 2.4** to match the bolder live outline.
- `circle-button.html` — **36** added to the size scale (header/toolbar size used by page-header back / new-group / toolbar buttons). Scale is now 32 web · 36 header · 40 · 48 mobile · 64.

**Promoted as new preview cards (built from supplied Flutter source — drift notes #2/#4/#5 below are now superseded):**
- `destination-card.html` — `_buildFeaturePill`. Gradient surface→surface-container-low 135° · radius med · pad small · icon 28 top-left · label bodyLarge (16/500) bottom · ~150×104 · Coming Soon (tertiary) / Beta (accent5 bg + accent4) badges r8. **Corrects drift #2** (was 150² square, flat surface-container-low, subtitleSmall label — all wrong).
- `block-card.html` — `_buildBlockCard`. Surface · radius med · pad small. Status pill = accent2 bg + accent3 text, radius small, labelMediumSemiBold, pad small×tiny (NOT a full pill, NOT success-container, NOT KLS.Pill). Title bodyLarge (16/500) maxLines 2 · subtitle labelLarge on-surface-variant. **Corrects drift #4** (was pad 20, subtitleLargeBold 18/700 title, canonical status pill — all wrong).
- `stat-chip.html` — `_buildInfoPill`. **Filled tertiary** (NOT outlined/transparent) · radius small · 16px icon + label · on-surface-variant. **Corrects drift #5** (was outlined / outline-variant 1px / transparent — wrong).
- `switch.html` — custom Switch/Toggle (no canonical Flutter Switch). Track 44×26 · knob 22 · 2px inset · on = primary, off = outline-variant, knob = surface · 18px travel. Proposed spec; promote alongside Slider.
- `row-action-menu.html` (G1) — per-row ⋯ trigger (32×32 r8, dots 16 on-surface-variant, hover/open tertiary-container) + overflow menu (bg on-primary, r8, drop-shadow, items pad 10×12 r6 labelLarge, hover tertiary-container, selected tertiary, destructive error + divider).
- `content-pane.html` (G2) — desktop **page-on-scaffold** standard: page header (h1 32/700 + subtitle 15/500) on the scaffold, optional KPI strip, then table-only surface card. Replaces the wrapped-in-card page-title pattern.
- `swipe-action.html` (D6) — swipe-to-reveal Slidable. Action panel bg error · icon+label on-error · 88px panel · 40% snap · fade-animation/ease-standard. Closest-token build; promote a canonical Slidable spec.

**Still open (no DS card — needs assets/spec):**
- **BottomNav filled/outline icon pairs** (drift D4) — kit `BottomNav` still lacks filled-vs-outline tab icon assets (home / workspace / orion / notifications); only a color swap is applied. Need the icon assets + active-state spec.

**G4 — global header drops the page title.** The desktop `Header` no longer renders a per-route title (it now lives in the content-pane page header, G2). The header's left zone is reserved for **system messages / status** via a `systemMessage` prop (subtitleSmall 16/600 desktop · on-surface-variant · single-line ellipsis · empty by default). Right zone (search / bell / avatar) unchanged. Documented in README; the `ui_kits/web` demo header is the reference to update when rebuilt.

**Token additions:** none. All work used existing tokens. The `switch` 2px inset / 18px knob travel and the `content-pane` 15/500 subtitle & 30/700 KPI value are component internals / documented off-scale values, not new tokens.

### 2026-06-06 · from `Module Summary`

**DS change (approved deviation, not a correction):** section labels / eyebrow titles are now **ALL CAPS**.
- Affects small section headers (`PROCEDURE STEPS`, `REFERENCE DOCUMENTS`, `APPLICABLE COURSES`/`APPLICABLE SYSTEMS`) and metadata field labels (`MODULE ID`, `VERSION`).
- New role `sectionLabel`: base `labelMediumSemiBold` (12/16/600) · tracking `0.08em` · `text-transform: uppercase` · color `on-surface-variant`.
- Added to `colors_and_type.css` as `--kls-section-label-*` tokens + `.kls-text-section-label` class.
- Preview card: `preview/overline-label.html` (group "Type").
- The old DS did **not** specify all-caps here — apply globally, do not strip uppercase to match legacy mixed-case labels.

**Token additions:** `--kls-section-label-size/line/weight/tracking/transform`. No color or spacing additions (reuses `labelMediumSemiBold` + `on-surface-variant`).

### 2026-05-28 · from `Data Sets Prototype`

**Promoted as new preview cards:**
- `status-badges.html` — 6 statuses × 3 styles. Token bindings: Building → info, Available → success, Failed → error, Deprecated → progress (warning), Active → inverted on-surface, Pending → tertiary. Resolves the previously-undocumented "what color does each status get?" gap.
- `page-header.html` — resolves drift #1.
- `filter-chip.html` — resolves drift #3 (verbatim port of `_buildTabPill`: pad 6×20, radius 24, active tertiary-container + primary, inactive tertiary + on-tertiary).
- `empty-state.html` — formerly inline-copied across screens.
- `checkbox.html` — promotes the selection-row inverted variant alongside the M3 green-check default.
- `spinner.html` — was implicit in Building badge + LoadingOverlay; now a first-class component card.
- `active-indicator.html` — three presence levels (subtle / card / hero) for the "currently-selected resource" banner pattern. Data Sets uses it for the active dataset; generalizes to active workspace / active persona / active workflow.

**Deliberately NOT promoted** (kept app-specific in `Data Sets Prototype`):
- `DatasetRow` — composite of FileTypeIcon-style tile + StatusBadge + metadata strip + overflow. Selected state uses `--kls-accent-1` at 8% alpha + 2px border, which IS a reusable "selected list item" pattern but better captured as a `list-rows.html` variant later, not its own card.
- `SelectionTopBar` (Cancel · count · Save header) — useful selection-mode pattern. If we see it land in another flow (e.g. multi-select in Library or Workspace), promote then.
- `NameSheet` / `ContentsSheet` — both follow the existing `sheet-overlay.html` spec exactly; no new pattern.
- `Toast` / `OverflowMenu` — already canonical (`snackbar-loading.html`, `context-menu.html`).
- `ActivePill` (subtle "ACTIVE" caps pill) — folded into Status badge "Active" variant.

**Token additions:** none. All Data Sets work used existing tokens — including `--kls-progress*` for the Deprecated/warning state and `--kls-info*` for the Building state, which clarifies the previously-ambiguous `progress` vs `info` semantic split (progress = warning orange, info = building blue).
