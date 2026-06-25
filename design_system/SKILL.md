---
name: Kilsar Design System
purpose: Cross-platform (mobile + tablet + desktop web) design system for the Kilsar Flutter app, with token-aware light and dark themes.
---

# Quick start for agents

The Kilsar Design System mirrors the live Flutter app theme as token-driven CSS. Use it when designing, prototyping, or generating HTML/CSS that should look and feel like the real Kilsar product.

## The one rule

**Use CSS variables (`var(--kls-*)`), never hex literals.** Every visual surface — backgrounds, borders, text, icons, fills — should reference a token. The same token resolves to different values in light vs dark mode automatically.

```css
/* yes */
.card { background: var(--kls-surface); color: var(--kls-on-surface); border: 1px solid var(--kls-outline-variant); }

/* no */
.card { background: #ffffff; color: #18181a; border: 1px solid #e2e2e2; }
```

## The typography rule (no made-up type)

**Never hand-assemble a type style. Apply one of the predefined composite classes.** `font-family`, `font-size`, `line-height`, and `font-weight` are NOT yours to choose — each canonical style already bundles the correct four values per breakpoint. There is no valid reason to set those four properties directly, and no valid font besides Plus Jakarta Sans.

```html
<!-- yes — one class, the whole style comes with it -->
<h2 class="kls-text-h2">Section title</h2>
<p class="kls-text-body-large">Body copy</p>
```

```css
/* no — inventing a size/weight combo that isn't a defined style */
.title { font-family: Plus Jakarta Sans; font-size: 26px; font-weight: 650; }

/* also no — cherry-picking raw type tokens into a new combination */
.title { font-size: var(--kls-h2-size); font-weight: var(--kls-body-large-weight); }
```

The raw `--kls-h2-size` / `--kls-h2-weight` / `--kls-*-line` tokens exist ONLY to build the `.kls-text-*` classes inside this design system. In a consuming project, ignore them and use the class.

**The complete, closed set of type styles** (no others exist):
`.kls-text-h1` · `.kls-text-h2` · `.kls-text-h3` · `.kls-text-h4` · `.kls-text-h5` · `.kls-text-subtitle-large` / `-bold` / `-small` · `.kls-text-navigation` · `.kls-text-body-large` / `-semibold` / `-bold` · `.kls-text-body-small` · `.kls-text-label-large` / `-bold` / `-regular` / `-semibold` · `.kls-text-label-medium-regular` / `-medium` / `-semibold` · `.kls-text-label-small` · `.kls-text-label-tiny` · `.kls-text-filters`

If none of these fits, that's a signal the design needs a different existing style — not a new one. Ask before extending the type scale.

> Enforcement note: the adherence linter already rejects non-Plus-Jakarta `font-family` and raw `px` font sizes. Hand-set `font-weight` numbers are not auto-caught, so this rule is the contract — composing your own size/weight pairing is a violation even when it lints clean.

## The spacing rule (no made-up spacing)

**Every gap, padding, margin, and offset must be a spacing token — never a raw number.** The scale is a closed set of six steps; there are no in-between values.

| Token | Value | Dart |
|---|---|---|
| `var(--kls-space-tiny)`   | 4px  | `Sizing.tiny` |
| `var(--kls-space-xsmall)` | 6px  | `Sizing.xSmall` |
| `var(--kls-space-small)`  | 12px | `Sizing.small` |
| `var(--kls-space-med)`    | 20px | `Sizing.med` |
| `var(--kls-space-large)`  | 32px | `Sizing.large` |
| `var(--kls-space-xlarge)` | 64px | `Sizing.xLarge` |

```css
/* yes */
.row { gap: var(--kls-space-small); padding: var(--kls-space-med) var(--kls-space-large); }

/* no — raw values off the scale */
.row { gap: 10px; padding: 18px 30px; }
```

If a layout seems to need a value that isn't on the scale, first reach for the nearest step — the scale is intentionally coarse. **In genuinely extreme cases**, compose from tokens with `calc()` rather than inventing a number, e.g. `calc(var(--kls-space-med) + var(--kls-space-tiny))` (24px). Treat composition as the rare exception, not a habit; if you find yourself doing it often, the design is fighting the grid.

> Enforcement note: the linter rejects raw `px` literals, so off-scale spacing is auto-caught. The `calc()` escape hatch exists precisely so you never have to type a raw number to bridge a gap.

## Import

```html
<link rel="stylesheet" href="colors_and_type.css">
```

Then either let `prefers-color-scheme` decide (default), or pin a theme:

```html
<html data-theme="dark">  <!-- or "light" -->
```

## Token vocabulary

**Surfaces & content** (use first):
- `--kls-surface` / `--kls-on-surface` — the canonical canvas + text on it
- `--kls-surface-variant` — page scaffold background (used by Scaffold, AppBar)
- `--kls-on-surface-variant` — secondary text, dim icons
- `--kls-outline` — default border
- `--kls-outline-variant` — subtle divider
- `--kls-primary` / `--kls-on-primary` — emphasized actions

**M3 role pairs** for status:
- `--kls-error` / `--kls-on-error` / `--kls-error-container` / `--kls-on-error-container`
- `--kls-success` / `--kls-on-success` / `--kls-success-container` / `--kls-on-success-container`
- `--kls-progress` / `--kls-on-progress` / `--kls-progress-container` / `--kls-on-progress-container` (warning / in-progress)
- `--kls-info` / `--kls-on-info` / `--kls-info-container` / `--kls-on-info-container`

**Numbered accents** (`--kls-accent-1` through `-16`): for non-status decorative surfaces.

**Spacing** (canonical scale — no other values exist): `tiny` (4), `xsmall` (6), `small` (12), `med` (20), `large` (32), `xlarge` (64).

**Radii**: `xsmall` (4), `small` (8), `med` (12), `large` (24), `pill` (999), `bottom-modal` (24px top corners only).

**Type styles** (CSS classes mirroring Flutter `TextThemeExt`):
`.kls-text-h1` … `.kls-text-h5` · `.kls-text-subtitle-large` / `-bold` / `-small` · `.kls-text-navigation` · `.kls-text-body-large` / `-semibold` / `-bold` / `body-small` · `.kls-text-label-large` / `-bold` / `-regular` / `-semibold` · `.kls-text-label-medium-regular` / `-medium` / `-semibold` · `.kls-text-label-small` · `.kls-text-label-tiny` · `.kls-text-filters`.

**Motion**: `--kls-dur-fast-animation` (80ms), `--kls-dur-fade-animation` (250ms, default), `--kls-dur-slow-animation` (500ms). Easing default: `--kls-ease-standard` (= ease-in-out).

**Shadow**: `var(--kls-drop-shadow)` — the only canonical shadow recipe.

## Component vocabulary

When you need a component, open the matching preview card in `preview/` and copy its structure:

| Need | Card | Notes |
|---|---|---|
| Primary action | `preview/buttons-primary.html` | h40, `tertiary-container` bg |
| Secondary action | `preview/buttons-variants.html` | Outlined |
| Icon button (back/close/more) | `preview/circle-button.html` | Round, 48 mobile / 32 web |
| Text input | `preview/inputs.html` | h48, no focus accent |
| Tags / status | `preview/pill.html` | Bg + fg picked by caller |
| Segmented control | `preview/compound-switch.html` | Active tile slides |
| Dropdown / select | `preview/dropdown.html` | Menu bg = `on-primary` |
| Confirmation dialog | `preview/dialogs.html` | AlertPrompt |
| Side panel / drawer | `preview/dialogs.html` | DialogOverlay |
| Bottom sheet | `preview/sheet-overlay.html` | Always shows Close button |
| Avatar / profile | `preview/profile-widget.html` | Initials or photo, system / assistant variants |
| Info toast | `preview/snackbar-loading.html` | Info-only, no actions |
| Loading state | `preview/snackbar-loading.html` | Blur + spinner |
| Side drawer | `preview/drawer-overlay.html` | Left or right, 426 collapsed |
| Right-click / kebab menu | `preview/context-menu.html` | h52 items, destructive in error |
| Data table (web) | `preview/data-table.html` | Sortable, participant stack, row chevron |
| Status badge | `preview/status-badges.html` | 6 statuses × 3 styles (plain / icon / dot) |
| Page header (mobile) | `preview/page-header.html` | Screen title h2 (24/600) — replaces iOS-centered TopBar |
| Content pane (web) | `preview/content-pane.html` | Page-on-scaffold: h1 header + KPI strip + table card |
| Destination card | `preview/destination-card.html` | Workspace top-row entry, gradient + icon + label |
| Block card | `preview/block-card.html` | Term card: status pill + title + StatChip row |
| Stat chip / info pill | `preview/stat-chip.html` | Filled tertiary, 16px icon + label |
| Switch / toggle | `preview/switch.html` | 44×26 track, on primary / off outline-variant |
| Row action menu | `preview/row-action-menu.html` | ⋯ trigger + overflow menu, destructive in error |
| Swipe action | `preview/swipe-action.html` | Swipe-to-reveal Slidable, error panel |
| Filter chip | `preview/filter-chip.html` | Individual pill chips — NOT CompoundSwitch |
| Empty state | `preview/empty-state.html` | Medallion + title + body + optional CTA |
| Checkbox | `preview/checkbox.html` | Inverted + M3 green variants |
| Spinner | `preview/spinner.html` | Indeterminate, 12 / 16 / 24 / 40 |
| Active indicator | `preview/active-indicator.html` | Subtle / card / hero — picker affordance for active resource |
| App header (web) | `ui_kits/web/chrome.jsx` | 64h, search + bell + avatar · NO page title (left zone = system messages) |
| Side nav (web) | `ui_kits/web/chrome.jsx` | 224 / 90 collapsed |
| Bottom nav (mobile) | `ui_kits/mobile/components.jsx` | 4 tabs · filled active icon |

## Cross-platform behavior

Same theme ships on mobile, tablet, desktop web (≥1184), desktop XL (≥1921). Type sizes step up at desktop breakpoints. Component anatomy is identical. A few platform branches in real code:

- Button radius: `med` (12) on mobile, `small` (8) on web
- CircleButton default size: 48 on mobile, 32 on web
- Snackbar width: 540 fixed on web, 90% of screen on mobile
- Snackbar radius: `small` (8) on web, `med` (12) on mobile

## Splash policy

The Flutter app disables Material ink (`NoSplash.splashFactory`, transparent splash/highlight/hover). Don't draw ripples in prototypes. Tap states are background swaps or opacity changes only.

## When in doubt

1. Find the closest preview card; mimic its anatomy.
2. Look up the actual token in `colors_and_type.css` rather than guessing a hex.
3. Check `MOBILE_DRIFT.md` for known patterns observed in screens but not yet built as isolated cards.
4. Use `data-theme="dark"` on `<html>` to verify your output in both themes before shipping.
