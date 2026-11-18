# Open decisions

Items that still need a decision.

| Topic | Where it stands | The question |
|---|---|---|
| Text on smaller screens | Text tokens have desktop values only. | Define tablet and mobile values. |
| Fixed roles | The 12 Fixed members of `ColorScheme` are allowed but have no value. | Give them values when a widget first needs one. |
| Spacing and radius in components | Components were drawn in pixels and have been moved to the nearest constant (ties go up): 8 became 6, 10 and 14 became 12, 16 and 18 became 20; radius 6 became 4, 10 became 12. | Are the nearest-step choices right, or should the scale gain 8 and 16? |
| Card border | Some cards use `outline`, tables and others use `outlineVariant`. | Is the rule in Card (stand-alone versus quiet) the intended one? |
| Kilsar mark | The supplied file takes its colour from the surrounding text, and the mock does not place it anywhere. | Which colour is the mark, and where does it go? |
| Height names | Heights are fixed per kind of widget and listed in the brand book as numbers. They have no constant names. | Should they get constants in the Flutter code, and what are they called? |
| Shadow name | `mx-drop-shadow` is still the name from the mock's stylesheet. | What is it called in the Flutter code? |
| The mock | Mx Web still uses the old `--mx-` colour names, pixel spacing and five raw shadow colours. | Update it from this system. |
