# Kilsar Design System

The canonical visual + interaction system for the Kilsar Flutter app, mirrored as HTML/CSS for design exploration and agent-driven prototyping. Every token in this system traces back to the live Flutter source (`app_theme.dart`, `color_palette.dart`, `text_styles.dart`, `accent_colors.dart`, `Sizing`, `durations.dart`, `shadows.dart`).

The same theme ships on **mobile, tablet, desktop web, and desktop XL** through a `SizeClass` enum. Type sizes step up at desktop breakpoints; everything else (colors, components, motion, behavior) is identical across platforms.

---

## What's in the box

| Path | What's there |
|---|---|
| `colors_and_type.css` | Single source of truth. Color primitives + Material 3 ColorScheme (light + dark) + AccentColors + type scale + spacing + radii + motion + shadow + component-level theme tokens. |
| `assets/icons/` | 60+ canonical PNG icons used by the app (image-mask compatible). |
| `assets/images/` | Brand logos, splash, onboarding heroes, illustrations. |
| `fonts/` | Plus Jakarta Sans (200–800 + italics) bundled locally. |
| `tokens/color.tokens.json` | Figma-exported color tokens (Mode 1 = light). |
| `preview/*.html` | Component library — each component in isolation, light + dark side-by-side. |
| `ui_kits/mobile/` | Example assembly: 4-tab mobile shell (Home / Workspace / Orion / Notifications). Demonstration only. |
| `ui_kits/web/` | Example assembly: desktop shell (Header + NavSidebar + Home Dashboard). Demonstration only. |
| `SKILL.md` | Quick-start for agents using this system. |
| `MOBILE_DRIFT.md` | Notes on patterns observed in real app screens that aren't yet built as isolated components. |

The `ui_kits/` folder is **demonstration**, not deliverable — it shows how the tokens and components assemble into screens. The design system itself is the tokens (`colors_and_type.css`) + the component library (`preview/`) + this documentation.

---

## Using the system

### 1. Import the CSS

```html
<link rel="stylesheet" href="path/to/colors_and_type.css">
```

Then add the Plus Jakarta Sans Google Fonts import (or rely on the local @font-face block — the CSS resolves both).

### 2. Theme switching

The system supports three modes:

- **Auto (default)** — respects `prefers-color-scheme` from the OS.
- **Manual light** — set `data-theme="light"` on `<html>`.
- **Manual dark** — set `data-theme="dark"` on `<html>`.

```html
<html data-theme="dark">
```

The Flutter app supports the same three modes via `AppTheme.themeMode` (system / light / dark). Match that behavior in any web surface that ships alongside.

### 3. Build with tokens, not hex

Every styled surface should reference a CSS variable. Never write `background: #FFFFFF` — write `background: var(--kls-surface)`. The token will adapt to dark mode automatically.

The single most important rule: **use semantic Material 3 tokens, not the legacy aliases.**

| Use | Not |
|---|---|
| `--kls-surface` | `--kls-surface-page` |
| `--kls-on-surface` | `--kls-content-primary` |
| `--kls-outline` | `--kls-stroke-default` |
| `--kls-primary` | `--kls-action-primary` |
| `--kls-surface-variant` (or `--kls-scaffold-bg`) | `#F8F8F8` |

Legacy aliases are kept for back-compat with older preview cards but new code should use the M3 names.

### 4. Build with components, not from scratch

Every common surface has a canonical preview card in `preview/`. When you need a button, a pill, an input, a sheet — open the matching card and copy its structure. The cards encode behavior the Dart enforces (e.g., disabled state dims foreground but not background; sheets always include a Close button; sidebar tabs use `surface-container-lowest` for active state).

---

## Token reference

### Colors

**Primitives** (`--kls-color-*-NNN`):
- `base/black`, `base/white`
- `neutral/50` … `neutral/950` (13 steps including `650`)
- `blue/50–700`, `green/50–700`, `red/50–700`, `orange/50–700`, `purple/50–700`
- `transparent/20`, `40`, `60`, `80` (black @ alpha)

**Material 3 ColorScheme** (light + dark):
- Primary, Secondary, Tertiary, Error — each with `*`, `on-*`, `*-container`, `on-*-container`
- Surface — `surface`, `on-surface`, `surface-variant`, `on-surface-variant`
- Outline — `outline`, `outline-variant`
- Inverse — `inverse-surface`, `on-inverse-surface`
- `scrim` (black @ alpha), `shadow`
- Surface container ladder: `lowest`, `low`, `default`, `high`, `highest`

**App-specific extension roles** (not in standard M3):
- `success`, `progress`, `info` — each with `*`, `on-*`, `*-container`, `on-*-container`. Use these for semantic status; the M3 `error` covers destructive.

**AccentColors** (`--kls-accent-1` through `-16`):
Numbered tokens from `AccentColors` ThemeExtension. Grouped:
- 1/2/3 → green family (base / container / on-container)
- 4/5/6 → orange family
- 7/8/9 → blue family
- 10/11 → reserved (water / mistyRose, not currently bound)
- 12/13 → purple family
- 14/15/16 → red family (note: 14 = lightest container)

**Legacy aliases** (kept for back-compat; prefer M3 names): `secondary-fixed`, `tertiary-fixed`, `surface-page`, `content-*`, `stroke-*`, `action-*`, `surface-soft/sunken/muted`.

### Type

Plus Jakarta Sans, no other family. 21 named styles mirroring `TextThemeExt`:

| Token | Mobile | Desktop | Weight |
|---|---|---|---|
| `h1` | 28 | 32 | 700 mobile / 400 desktop |
| `h2` | 24 | 28 | 600 mobile / 400 desktop |
| `h3` | 20 | 25 | 600 |
| `h4` | 18 | 22 | 600 |
| `h5` | 16 | 20 | 600 mobile / 400 desktop |
| `subtitleLarge` | 18 | 18 | 600 mobile / 400 desktop |
| `subtitleLargeBold` | 18 | 18 | 700 |
| `subtitleSmall` | 16 | 16 | 500 mobile / 600 desktop |
| `navigation` | 10 | 14 | 500 mobile / 600 desktop |
| `bodyLarge` | 16 | 16 | 500 |
| `bodyLargeSemiBold` | 16 | 16 | 600 |
| `bodyLargeBold` | 16 | 16 | 700 |
| `bodySmall` | 14 | 16 | 500 |
| `labelLarge` | 14 | 14 | 500 |
| `labelLargeBold` | 14 | 14 | 700 |
| `labelLargeRegular` | 14 | 14 | 400 mobile / 500 desktop |
| `labelLargeSemiBold` | 14 | 14 | 600 mobile / 500 desktop |
| `labelMediumRegular` | 12 | 12 | 400 mobile / 600 desktop |
| `labelMediumMedium` | 12 | 12 | 500 mobile / 600 desktop |
| `labelMediumSemiBold` | 12 | 12 | 600 |
| `labelSmall` | 10 | 10 | 600 |
| `labelTiny` | 8 | 8 | 500 |
| `filters` | 14 | 14 | 600 |
| `sectionLabel` | 12 | 12 | 600 |

CSS classes: `.kls-text-h1` … `.kls-text-label-tiny` — apply directly to elements.

**Section label / eyebrow** (`.kls-text-section-label`, tokens `--kls-section-label-*`): small section headers (above step/reference lists) and metadata field labels (`MODULE ID`, `VERSION`, `APPLICABLE SYSTEMS`) render **ALL CAPS** — base `labelMediumSemiBold` (12/600), tracking `0.08em`, `text-transform: uppercase`, color `on-surface-variant`. App equivalent: `textTheme.labelMediumSemiBold.copyWith(color: onSurfaceVariant)` + uppercase. *(DS change approved 2026-06, from the Module Summary project — uppercase is now the spec for this role; don't revert to mixed-case.)* Card: `preview/overline-label.html`.

Default text color: `--kls-text-default` (= `on-surface` in current mapping; `neutral-900` light / `neutral-50` dark).

### Spacing

```
tiny   = 4
xSmall = 6
small  = 12
med    = 20
large  = 32
xLarge = 64
```

Use `var(--kls-space-tiny)` etc. Never invent off-scale values. The Dart `Sizing` class has no other steps.

### Radii

```
xsmall = 4
small  = 8
med    = 12
large  = 24
pill   = 999
bottom-modal = 24px 24px 0 0
```

Use cases: `xsmall` for chips, `small` for cards and buttons, `med` for primary action buttons (mobile only — web uses `small`), `large` for hero surfaces, `pill` for tags, `bottom-modal` for bottom sheets.

### Motion

```
fast-animation        =  80ms
split-fade-animation  = 125ms
fade-animation        = 250ms  (default)
slow-animation        = 500ms
snack-bar             = 2000ms
splash-screen         = 2000ms
```

Easing: `--kls-ease-standard` = `ease-in-out` (default — the app uses ease-in-out almost everywhere). Specific in/out curves available as `--kls-ease-in` / `--kls-ease-out`.

### Shadows

One canonical drop shadow, used on cards / sheets / menus / dropdowns:

```css
box-shadow: var(--kls-drop-shadow);
```

Resolves to `0 0 10px 2px rgba(onSecondary, 0.2)` — a near-black drop in light mode, a near-white outer glow in dark mode.

---

## Components

Every component has a preview card under `preview/` showing both light and dark variants. Notable specs:

| Component | Card | Spec highlights |
|---|---|---|
| PrimaryActionButton | `buttons-primary.html` | h40 · radius `med` (mobile) / `small` (web) · bg `tertiary-container` · text `labelLargeBold` |
| SecondaryActionButton | `buttons-variants.html` | Outlined; `outline-variant` border |
| CircleButton | `circle-button.html` | size 48 mobile / 32 web (default) · radius = size/2 |
| IconTextField | `inputs.html` | h48 · radius `small` (8) · `outline-variant` border (error → `error`) · no focus accent |
| SheetOverlay | `sheet-overlay.html` | bg `primary-container` · radius `bottom-modal` · close `CircleButton(size: 40)` always present |
| Pill | `pill.html` | Padding `tiny`/`small` · radius `small` · `labelMediumMedium` · caller supplies bg + fg |
| CompoundSwitch | `compound-switch.html` | h40 · track `tertiary` + `outline-variant` · active tile `surface` |
| Dropdown | `dropdown.html` | h40 · `outline-variant` border · open menu bg `on-primary` |
| AlertPrompt + DialogOverlay | `dialogs.html` | Centered card · radius `small` · `dropShadow` · scrim = blur(4) + 80% surface |
| ProfileWidget | `profile-widget.html` | Circle · radius prop · bg `secondary-container` · initials in `h5` |
| Snackbar | `snackbar-loading.html` | Info-only (no action button) · floating · 540 web / 90% mobile · bg `tertiary-container` |
| LoadingOverlay | `snackbar-loading.html` | Blur(4) + 80% `primary-container` · spinner in `secondary-container` |
| DrawerOverlay | `drawer-overlay.html` | Right (default) or Left · 426 collapsed / 50% expanded · 12px inset · over scrim |
| Context Menu | `context-menu.html` | bg `on-primary` (light variant) or `on-secondary` (dark variant) · item h52 · `labelMediumSemiBold` |
| Data Table | `data-table.html` | Sortable columns · participant stack · per-row chevron action |
| Status badge | `status-badges.html` | 6 statuses (Pending / Building / Available / Active / Failed / Deprecated) × 3 styles (plain / icon / dot). Building uses Spinner; Active is inverted on-surface. |
| Page header | `page-header.html` | Large title (h1 28/700 mobile · 32/700 tablet) · optional leading + trailing CircleButton(36) · no fill, no border |
| Filter chip | `filter-chip.html` | Pill chip — pad 6×20 · radius 24 · 14/600 · active tertiary-container + primary · inactive tertiary + on-tertiary · trailing funnel button |
| Empty state | `empty-state.html` | Medallion 56 + h-stack title / body / optional CTA · centered, max-w 320 |
| Checkbox | `checkbox.html` | 22×22 · radius 6 · 1.5px border · inverted (selection rows) + M3 green (form) variants |
| Spinner | `spinner.html` | Indeterminate · 900ms linear · 12/16/24/40 with scaled stroke-width |
| Active indicator | `active-indicator.html` | "Currently-selected-resource" banner — subtle pill · card · hero variants, each with empty + filled state |
| Section label | `overline-label.html` | ALL-CAPS section header + metadata field label — labelMediumSemiBold · tracking 0.08em · uppercase · on-surface-variant. `.kls-text-section-label` |

### Theme defaults

Per-widget defaults from `app_theme.dart`:

- **Scaffold background**: `surface-variant` (NOT `surface`)
- **App bar background**: `surface-variant` · foreground `on-surface` · title `h5` · elevation 0
- **Bottom sheet**: bg `primary-container` · radius `bottom-modal` · drag handle off by default
- **Slider**: track 3px · active `primary` · inactive `tertiary` · thumb r=4
- **Checkbox**: side `on-surface-variant` · check `green-200` (light) / `green-300` (dark) · transparent fill
- **Menu** (dropdown): padding 12/6 · surface tint `surface`
- **Splash / ripple**: disabled app-wide. Don't draw Material ink. Tap states are opacity/bg swaps.

---

## Voice & tone

The system uses **two product flavors** driven by `WorkspaceSettings`:

- **Education** — Courses / Modules / Assignments / Students. Used by AIM (Aviation Institute of Maintenance), training programs.
- **Commercial** — Cases / Workflows / Tasks / Operators. Used by ops companies.

Workspace overrides keys: `termsKey`, `termKey`, `viewerKey`, `coursesKey`, `assignmentsKey`, `ticketsKey`.

When writing copy:
- Match the active flavor's vocabulary throughout.
- Status pills: keep terse and clear (`In Progress`, `Needs Assistance`, `Rejected`).
- Empty states: explain what would normally be here.
- Snackbars are info-only — don't write copy that suggests an undo action.
- Don't reference "Kilsar" in user-facing copy unless in a brand position (logo, app store).

---

## Iconography

60+ canonical PNGs in `assets/icons/`. Naming convention: lowercase camelCase, no extension (`chevronRight`, `tabs/library`, `filetypes/pdf`). Use `KlsIcon` shared component (`ui_kits/shared/kls-icon.jsx`) which applies CSS masks so any icon can be tinted with a color token.

Subset under `assets/icons/tabs/` is reserved for bottom-nav / sidebar destinations and ships in filled + outline variants where the app uses them.

Brand and hero imagery in `assets/images/` (workspace logos, onboarding heroes, splash). Workspace logos render **full-color in both themes** — they're not tinted.

---

## Accessibility

The Material 3 token mapping is designed for WCAG AA contrast on the canonical pairs (`primary` / `on-primary`, `surface` / `on-surface`, etc.). When composing custom surfaces, verify contrast holds — especially for accent pairs (`accent-N` over `accent-N+1`).

The Flutter app disables splash/ripple feedback. For web/HTML surfaces, provide alternative feedback: opacity change, border color shift, or background swap on hover/focus.

Min hit target: 40px (matches `PrimaryActionButton` and `CircleButton` web default). Mobile circle buttons default to 48px.

---

## Caveats

- `secondaryFixed` and `tertiaryFixed` are legacy tokens still referenced in some Dart widgets (ProfileWidget bg, Snackbar bg, LoadingOverlay spinner). They are kept defined in CSS but new code should use `secondary-container` / `tertiary-container` instead.
- `accent10` and `accent11` are declared but commented out in `app_theme.dart` (planned `water` / `mistyRose` values not yet bound). Don't use until the bindings land.
- The "Aeonik" display font referenced in older Figma assets has been folded into Plus Jakarta Sans Bold — the system is single-family.
- Several composed patterns observed in the real app (`BlockCard`, `StatChip`, `DestinationCard`, `FilterChipRow`, `PageHeader`) are not yet built as isolated preview cards. See `MOBILE_DRIFT.md`.
- The `ui_kits/` folder is demonstration only. Production code should consume `colors_and_type.css` and reference the `preview/` cards as component specs, not the kit assemblies.
