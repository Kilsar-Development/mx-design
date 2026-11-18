# Table

The main way lists are shown: Jobs, Procedures, Systems, Triage, Course Catalog.

- A `surface` card with an `medBorderRadius` corner and `outlineVariant` hairlines.
- Header cells are `overlineBold`, set uppercase; the sorted column is `onSurface` with an arrow.
- A row has a title (`bodySemiBold`), an optional caption under it (`captionRegular`), and its actions at the right. Rows highlight with `surfaceContainerLow` on hover.
- A row may expand in place: the open row keeps the hover fill and its panel is `surfaceContainerLowest`.
- Long lists scroll inside the card; the page header, filters and anything above stay put.

The consumer provides the columns, the rows and, optionally, the expanded content.
