# TextField

A labelled input. The label sits above in `onSurfaceVariant`; mark optional fields with "· optional" in the label.

- 48px in drawers, 40px in compact rows and inline add fields. A textarea starts at 96px.
- **Validation**: never flag an empty required field up front. Turn the border `error` only after a save attempt.
- The consumer provides the label, the value and, where it helps, a placeholder that shows the expected format.
