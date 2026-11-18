MX DS V3 is the design system of the Mx web app: two hues and a neutral, named for Flutter. Every colour on a widget is a member of Flutter's `ColorScheme` or one of four amber accents, so the web app and the Flutter app share one vocabulary.

## Colour

Three families only: teal, amber and a warm neutral. Red exists for real failures. There is no green.

### The locked rule

A widget may be coloured only by a member of Flutter's `ColorScheme` from the list below, or by one of the four accents. No other role may be invented, renamed or aliased. Token names are the Flutter member names, spelled exactly.

`primary`, `onPrimary`, `primaryContainer`, `onPrimaryContainer`, `primaryFixed`, `primaryFixedDim`, `onPrimaryFixed`, `onPrimaryFixedVariant`, `secondary`, `onSecondary`, `secondaryContainer`, `onSecondaryContainer`, `secondaryFixed`, `secondaryFixedDim`, `onSecondaryFixed`, `onSecondaryFixedVariant`, `tertiary`, `onTertiary`, `tertiaryContainer`, `onTertiaryContainer`, `tertiaryFixed`, `tertiaryFixedDim`, `onTertiaryFixed`, `onTertiaryFixedVariant`, `error`, `onError`, `errorContainer`, `onErrorContainer`, `surface`, `onSurface`, `surfaceDim`, `surfaceBright`, `surfaceContainerLowest`, `surfaceContainerLow`, `surfaceContainer`, `surfaceContainerHigh`, `surfaceContainerHighest`, `onSurfaceVariant`, `outline`, `outlineVariant`, `shadow`, `scrim`, `inverseSurface`, `onInverseSurface`, `inversePrimary`, `surfaceTint`.

- Not every member has to be used. Twelve have no value yet and must be given one before a widget uses them: `primaryFixed`, `primaryFixedDim`, `onPrimaryFixed`, `onPrimaryFixedVariant`, `secondaryFixed`, `secondaryFixedDim`, `onSecondaryFixed`, `onSecondaryFixedVariant`, `tertiaryFixed`, `tertiaryFixedDim`, `onTertiaryFixed`, `onTertiaryFixedVariant`.
- **Accents** are an add-on to that list: `accent1` (attention), `accent2` (on attention), `accent3` (attention container), `accent4` (on attention container). In Flutter they are the `AccentColors` theme extension.
- **The palette** (`teal600`, `neutral50`, `amber500`, `red500` and the other steps) only defines hex values for the roles to point at. A widget never names a palette step.

### Using the roles

- **Keep pairs together.** A fill takes its own "on" colour: `onPrimary` on `primary`, `onPrimaryContainer` on `primaryContainer`, `accent2` on `accent1`, `accent4` on `accent3`, `onErrorContainer` on `errorContainer`.
- **Surfaces.** The page scaffold and the rail are `surfaceContainerLow`. Cards, tables, drawers and the header are `surface`. An expanded row is `surfaceContainerLowest`. Neutral chips and tracks are `tertiary`.
- **Lines.** `outline` for cards, inputs and secondary buttons; `outlineVariant` for table hairlines and quiet groupings.
- **The main colour never fills a whole card or pane.** It marks the action, the selection and the state.

### What the colours mean

| Meaning | Colour | Where |
|---|---|---|
| Done, passed, published, operational | `primary`, `primaryContainer` | Pills, ticks, progress fill |
| In progress | `inversePrimary` | Dots, the partial segment of a bar |
| Needs attention | `accent1` to `accent4` | Caution, needs fix, overdue, unread count |
| Failed, grounded, destructive | `error`, `errorContainer` | Only for real failures |
| Not started, draft, neutral | `tertiary` | Pills, chips |

Colour never carries a meaning alone: every state also has a word, and the Caution block always has its warning icon.

## Type

Plus Jakarta Sans for everything except codes, which are monospace.

### The rule

A text token fixes the font, the size and the weight. The only thing applied where it is used is colour.

- A heavier or lighter version of a text is a different token, never a token with a change applied on top. A selected item that gets bolder switches token.
- Line height comes from the font. Space around text is the widget's padding and spacing.
- Uppercase is applied by the widget, not the token.
- Letter spacing is normal, with two special cases baked into their tokens: the three large headings are tightened, and `overlineBold` is widened.
- A token may have a different size on smaller screens under the same name. Only desktop values are defined so far.

### The tokens

| Token | Size / weight | Used for |
|---|---|---|
| `displayBold` | 40 / 700, letter spacing -0.02em | Question in Present mode |
| `headingLargeBold` | 30 / 700, letter spacing -0.02em | Page title; number on a summary tile |
| `headingMediumBold` | 26 / 700, letter spacing -0.02em | Step title in guided work |
| `titleBold` | 18 / 700 | Drawer title, card title |
| `subtitleSemiBold` | 16 / 600 | Sub-headings inside a page or pane, empty-state titles |
| `bodyRegular` | 14 / 400 | Running text, text field value, before and after text, toast, rail item |
| `bodySemiBold` | 14 / 600 | Table row title, stepper step, secondary main button |
| `bodyBold` | 14 / 700 | Main button, selected rail item, current and done steps |
| `labelRegular` | 13 / 400 | Field labels, table cells, breadcrumb, notes |
| `labelSemiBold` | 13 / 600 | Filter chip, segmented control, tile label, secondary small button |
| `labelBold` | 13 / 700 | Small button, selected filter chip |
| `captionRegular` | 12 / 400 | Line under a table title, result counts |
| `captionSemiBold` | 12 / 600 | Status pills, count badges |
| `overlineBold` | 11 / 700, letter spacing 0.08em | Rail sections, table headers, Caution and callout titles |
| `microBold` | 10 / 700 | Initials in a stacked avatar |
| `codeRegular` | 12 / 400, monospace | ACS codes, procedure codes, job numbers |

14 is the reading size and 13 is the size for controls and table metadata. One `headingLargeBold` title per page; it hides when the user drills in and the breadcrumb takes over. Numbers that line up in columns use tabular figures.

## Spacing and shape

Spacing is the `Sizing` class: `sizingTiny` 4, `sizingXSmall` 6, `sizingSmall` 12, `sizingMed` 20, `sizingLarge` 32 and `sizingXLarge` 64. Each token is the Flutter constant of the same name (`sizingMed` is `Sizing.med`). Corner radius uses the Flutter constants of the same names: `xSmallBorderRadius` 4, `smallBorderRadius` 8, `medBorderRadius` 12 and `largeBorderRadius` 24.

- Controls (buttons, inputs, rail items, toasts) use `smallBorderRadius`. Cards, tables, drawers and callouts use `medBorderRadius`. Chips, pills, badges, steps, the switch and the pill form of the segmented control are fully rounded: see Heights. Checkboxes and code tags use `xSmallBorderRadius`.
- Pages pad `sizingMed` at the top and `sizingLarge` at the sides and bottom, with `sizingMed` between sections.
- Every gap, padding and corner in a component is one of these constants. Heights are fixed per kind of widget (see Heights) and icon sizes are sizes, not spacing; both are written in pixels.

## Heights

Every kind of widget has one height. Different kinds do not have to share a grid.

| Use | Height | Corners |
|---|---|---|
| Main button | 40 | `smallBorderRadius` |
| Small button (table rows) | 32 | `smallBorderRadius` |
| Icon button | 36 | `smallBorderRadius` |
| Small icon button, ghost icon button | 32 | `smallBorderRadius` |
| Close button | 32 | Circle |
| Filter chip | 30 | Fully rounded, 15 |
| Segmented control | Track 36, segment 30 | Pill form fully rounded, 18 and 15; block form `medBorderRadius` and `smallBorderRadius` |
| Stepper step | 36 | Fully rounded, 18 |
| Status pill | 24 | Fully rounded, 12 |
| Code tag | 24 | `xSmallBorderRadius` |
| Badge (counts) | 20 | Fully rounded, 10 |
| Switch | 22 | Fully rounded, 11 |
| Checkbox | 22 | `xSmallBorderRadius` |
| Text field | 48 | `smallBorderRadius` |
| Compact text field | 40 | `smallBorderRadius` |
| Avatar, stacked | 26 | Circle |
| Avatar, signed-in user | 36 | Circle |

**Fully rounded** means the corner radius is half the widget's height. There is no radius constant for it: the height sets it.

## Elevation and motion

Borders separate things; shadows are rare. `mx-drop-shadow` is used on what floats above the page: drawers, toasts, menus and the selected segment of a segmented control.

Motion is short and plain. One curve, `cubic-bezier(0.42, 0, 0.58, 1)`, and four durations: 80ms for presses, 125ms for hover and colour changes, 250ms for screens and drawers entering, 500ms for progress fills. These are not tokens; write the values. The drop shadow is the `mx-drop-shadow` constant; no other shadow or raw colour is used.

## Layout

- A 60px header on `surface` and a 200px rail on `surfaceContainerLow`. The rail groups destinations under section labels.
- The app is designed for desktop, with a minimum width of 1180px.
- Long lists scroll inside their own card. The page header, filters, timeline and anything above the list stay where they are.
- Page headers and their toggles hide once the user drills into a record.

## Component rules

- **Drawers** are the place to edit. 460px by default; 50vw (620 to 820px) for content-heavy editors. Cancel and one primary button, bottom right.
- **Validation** appears only after a save attempt. An empty required field is not an error until then.
- **Remove and delete** are the trash icon. Not the word "Remove", not a ✕.
- **Button labels** are short: "Preview", "Import", "Save".
- **One primary button** per view or drawer footer.
- **A change is always shown both ways**: what it was and what it becomes.

## Words

| Education | Commercial |
|---|---|
| Module | System |
| Task | Procedure |
| Block (a term) | |
| Class (a group of students) | |

- A module is a course. A class is a group.
- "Assign", "assignment", "assigned". Never "allocate".
- The assistant is Orion.
- Sentence case everywhere: titles, buttons, table headers (which the table then sets uppercase).

## Icons

Stroke icons on a 24px grid, 1.8px stroke, round caps and joins, no fill, coloured by the text colour around them. 18px in the rail, 14 to 16px in buttons. Orion has its own mark, used as a mask so it takes the same colour as a stroke icon would.

## Flutter

Token names here are the Flutter names: `primaryContainer` is `colorScheme.primaryContainer`, `accent1` is `AccentColors.accent1`, `teal600` is `ColorPalette.teal600`. The Dart source and the same values as JSON are in the Flutter asset group. Spacing, radius and the drop shadow are this product's own constants.
