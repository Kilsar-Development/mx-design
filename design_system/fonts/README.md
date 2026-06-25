# Fonts

**Plus Jakarta Sans** is the only family in the system. All weights (200, 300, 400, 500, 600, 700, 800 — normal and italic) ship as brand-uploaded TTFs in this directory and are wired into `colors_and_type.css` via `@font-face` rules pointing at `fonts/PlusJakartaSans-*.ttf`.

Consumers only need:

```html
<link rel="stylesheet" href="colors_and_type.css">
```

No external font CDN, no preconnect, no `@import` — the local files are authoritative. Don't re-add a Google Fonts `<link>` (or any third-party font CDN) in preview cards or kit shells; the design-system review will flag it as "Missing brand fonts" because the scanner reads any external font reference as a sign the brand TTF wasn't wired.

## Files

| Weight | File |
|---|---|
| 200 ExtraLight       | `PlusJakartaSans-ExtraLight.ttf`       |
| 200 ExtraLight Italic| `PlusJakartaSans-ExtraLightItalic.ttf` |
| 300 Light            | `PlusJakartaSans-Light.ttf`            |
| 300 Light Italic     | `PlusJakartaSans-LightItalic.ttf`      |
| 400 Regular          | `PlusJakartaSans-Regular.ttf`          |
| 400 Italic           | `PlusJakartaSans-Italic.ttf`           |
| 500 Medium           | `PlusJakartaSans-Medium.ttf`           |
| 500 Medium Italic    | `PlusJakartaSans-MediumItalic.ttf`     |
| 600 SemiBold         | `PlusJakartaSans-SemiBold.ttf`         |
| 600 SemiBold Italic  | `PlusJakartaSans-SemiBoldItalic.ttf`   |
| 700 Bold             | `PlusJakartaSans-Bold.ttf`             |
| 700 Bold Italic      | `PlusJakartaSans-BoldItalic.ttf`       |
| 800 ExtraBold        | `PlusJakartaSans-ExtraBold.ttf`        |
| 800 ExtraBold Italic | `PlusJakartaSans-ExtraBoldItalic.ttf`  |

## History

Earlier revisions of the system referenced an **Aeonik** (TypeMates) display family for headings and **Inter** / **IBM Plex Mono** as UI fallback and mono — all loaded via Google Fonts. Both have since been retired: headings collapsed into Plus Jakarta Sans Bold/ExtraBold, and the mono token (`--kls-font-mono`) resolves to system mono (`ui-monospace, "SF Mono", Menlo, Consolas, monospace`) so no second download is needed.

If a heading slot ever needs a distinct display face again, drop the TTFs/WOFF2s here, add a `@font-face` block to `colors_and_type.css` matching the pattern already in use, and point `--kls-font-display` at the new family.
