# Button

The action on a surface. Use one primary button per view or drawer footer; everything else is secondary.

- **Primary** (`primary` / `onPrimary`): the main action. Two heights: 40px for main buttons (page headers, drawer and dialog footers) and 32px for small buttons in table rows.
- **Secondary**: transparent with a 1.5px `outline` border; the border turns `primary` on hover.
- **Tonal** (`primaryContainer` / `onPrimaryContainer`): a supporting action that still belongs to the main flow, such as "Quiz from these misses".
- **Attention** (`accent1` / `accent2`): only where the action resolves something flagged, such as "Fix".
- **Danger** (`error` / `onError`): destructive confirmation only.

Labels are short verbs: "Preview", "Import", "Save". The consumer provides the label and, optionally, a 14px leading icon.
