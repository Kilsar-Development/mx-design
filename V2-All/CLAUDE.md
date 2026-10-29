# Project: Mx product vision & UX overhaul

## Reference: MX mocks (V1 product)
- Project `22570fd9-2e4e-40d4-beb2-270816805784` (https://claude.ai/design/p/22570fd9-2e4e-40d4-beb2-270816805784). Pull content/features from it into V2 as needed. Key files: `Web App.dc.html` → `web-app.jsx` (all screens), `Mobile App.dc.html`, `release-notes.js` (shared `window.MX_RELEASES`), `simulators/`. Local copies for grep live in `_ref/` (read-only reference, not part of V2).

## LOCKED (turn 8) — canonical shells and rails
Canonical frames in `Mx IA Explorations.dc.html`: 6a Student Home · 6d Student Tasks · 7a Instructor Home · 7b Admin Home · 6b/6c Milestones · 5b ⌘K.
- Student / Operator rail: Work = Home · Jobs · Tasks; Learn = Start here · Training · Assessments; Knowledge = Library · Assistant · Milestones; Help & Feedback · version. Commercial relabels: Tasks → Procedures.
- Instructor rail: Work = Home · Assignments · Tasks; Teach = Training · Assessments; Build = Design Studio; Knowledge = Library · Assistant · Milestones; Workspace · Help & Feedback · version.
- Admin rail: Work = Home · Triage · Jobs · Procedures; Teach = Course Catalog · Training · Assessments; Build = Design Studio; Knowledge = Library · Assistant · Milestones; Operations = Inventory Mgr · Records · Integrations; Workspace · Help & Feedback · version. Course Catalog (Education) or Procedures (Commercial), not both.
- Header right zone everywhere: ⌘K search · bell (review inbox) · avatar (settings, incl. Student Mode toggle).
- Control Tower = student Home + instructor Assignments. No Messages tab. Users & access assumed under Workspace.
- Open: definition of Triage; Start here content; Jobs for Education students.

## DS V2 (turn 9+)
### Color token paradigm (critical, applies to every mock and to the DS)
- WHY: the product is Flutter. Every widget is bound to exactly one `ColorScheme` member or one `AccentColors` member, and Flutter swaps the whole scheme between light and dark. A token that only exists in HTML, or a role that is not a `ColorScheme` member, cannot be expressed in the app, so a mock using it cannot be built as drawn. Token names are the contract between design and engineering; hex values are not.
- Allowed scheme roles are ONLY Flutter `ColorScheme` members: primary / onPrimary / primaryContainer / onPrimaryContainer / primaryFixed / primaryFixedDim / onPrimaryFixed / onPrimaryFixedVariant, the same eight for secondary and tertiary, error / onError / errorContainer / onErrorContainer, surface / onSurface / surfaceDim / surfaceBright / surfaceContainerLowest / surfaceContainerLow / surfaceContainer / surfaceContainerHigh / surfaceContainerHighest / onSurfaceVariant, outline / outlineVariant, shadow / scrim, inverseSurface / onInverseSurface / inversePrimary / surfaceTint. Nothing else: no `attention`, no `primaryTint`, no `success`/`info`, no legacy aliases, no `surface-variant` (deprecated; scaffold uses surfaceContainerLow).
- Anything the scheme cannot express goes in the `AccentColors` ThemeExtension (accent1, accent2, …). Each accentN carries its own light value and its own dark value under the same name. A widget binds ONE accentN; it must look right in both modes through that single binding. Never give a widget accentX in light and accentY in dark, and never use a raw primitive (teal-300, amber-500) in a widget.
- Pair discipline: foreground and background come from matched pairs (primary/onPrimary, accent1/accent2, accent3/accent4). Do not mix a scheme background with an accent foreground unless the pair is documented here.
- V2 accent map: accent1 = attention solid (amber) · accent2 = on-attention · accent3 = attention container · accent4 = on-attention container. Adding a new accent needs a reason, a light+dark value, and a line here.
- Web mirror: `ds-v2/colors.css` exposes the same names as `--mx-<role>` (kebab-case, `--mx-accent-1`). Mocks reference only these vars; primitives (`--mx-teal-600`) exist in the file for the spec page, never in a mock.
- Direction: 3a Teal & Amber. One main hue (teal, solid + container), one accent hue (amber, solid + container) for attention only, rest neutral. Light and dark map independently to different ladder steps.
- Look-and-feel direction: 3a Teal & Amber. Rule: one main hue (two shades: solid + tint), one accent hue (two shades) for attention only, rest neutral. Light and dark map independently to different ladder steps; no shared hex.
- No big color block hero; main color appears only on primary actions, active rail, path, progress fill.
- V2 tokens live in `ds-v2/` (colors.css, color_scheme.dart, scheme.json; spec page `DS V2 Colors.dc.html`). M3 role names kept; AccentColors 1–16, success/progress/info, legacy aliases, component tokens removed. New extension role: attention (amber). Primary button = primary (was tertiary-container). Prefix `--mx-`.
- V2 is built in this project under `ds-v2/`; extract to a separate design-system project only once stable (decision turn 10).

## History (decisions, in order)

- Turn 12: Master clickable mock is `Mx Web.dc.html` (V2 tokens, Role + Mode tweaks). Student task runtime done: breadcrumb · title · Guided / Quick checklist toggle · icon buttons for Worklog PDF (dialog) and Task history (drawer). Guided = Figures / 3D models tabs with thumbnail strip lower-right of the viewer + Evidence card left; step pane right (caution accent1/2 header + accent3/4 body, Why, You should see in primary-container, parts, Stuck link, Back / Flag / Done·Next); horizontally scrolling step strip. Checklist = step list left + sticky media viewer right. Tasks page: title "Tasks", no sort chips, sortable column headers, no Status column (button derived: Start / Resume / Review). Rail 196px; Help & Feedback icon square; version string centred, opens Release notes page (data from `release-notes.js`, copied from MX mocks; dots New=primary, Improved=primary-container, Fixed=accent1). Rejected: per-step media chip row replacing the tabs.
- Turn 11: `uploads/mxedu-roles-flows.pdf` (AIM campus-visit roles/flows/priorities) added as a WHAT input. Gap analysis in `Gap Analysis - Roles & Flows.dc.html`; design unchanged. Open from it: student stage as a dimension; FAA exam as first-class object; Program Coordinator persona; classroom presentation mode; question coverage / missed-question review; prebuilt activities.
- Source of truth for WHAT: `uploads/mx_product_vision_handoff-2102ba6d.md` (latest; supersedes `mx_product_vision_handoff.md`) (feature catalog with input/output edges) and `uploads/mx_product_vision.md` (overall vision, north star, boundaries). I own the HOW: IA, navigation, composition, patterns, visual language.
- Permission levels are Viewer / Editor / Admin. "Student" / "Instructor" are Education-workspace labels for the Viewer side and Editor/Admin side; radio pilot uses operator / maintainer / supervisor. Not separate product identities.
- Grades / class reporting are AIM's separate system, not Mx today. Show exam results, not a gradebook.
- Not yet wireframed: source change awareness; radio-pilot field runtime (offline, evidence under working conditions).
- Feature edges are dependencies, NOT required UI flows. Only surface cross-links where a person would want them.
- NOT based on the existing Kilsar DS under `_ds/`. Carry over ONLY Plus Jakarta Sans + the type scale (`fonts/`). Colors, components, spacing, radii, motion are all new. Logo/brand marks and dark-mode support must be retained.
- Web first; mobile later.
- IA decision: fully separate Student experience from Instructor/Admin experience. Instructors and Admins have a "Student Mode" toggle in settings (plain toggle, no extra options) to enter the Student experience. No header-level mode switch.
- Header right zone: search icon · notifications bell with count badge · profile avatar (opens settings). Student nav item for progress is "Milestones".
- Wireframes: low-fi boxes. Then look-and-feel on one real screen.
- Vocabulary: do not invent product terms. Use the handoff's capability names as working labels and flag anything I coin.
- Student milestones (user story, added turn 3): block completion → recommended exam → "Level N" milestone. Recommended path never blocks. Levels authored per term or derived.
- Role priorities (handoff "Current role priorities") decide what is primary per role. Assignments / tasks / procedures are one thing under workspace vocabulary.
- Vocabulary chain (confirmed turn 5). Engineering objects: Term → Course → Assignment. Presentation labels per domain: Education = Block → Module → Task (block = term; "course" is also used for the program as a whole). Commercial = Job → (no course level) → Module/Task, plus Systems as a first-class object. Milestones hang off blocks/terms.
- Radio pilot: learner receives a task/procedure generated at runtime from a 3D model + manuals, with 3D guidance. Reuses guided work.
- Hierarchy inverted (turn 6): students do not drill block → module → task. Home = flat list of allocated tasks/exams/sims; block, module, ACS code are filters. "My work" removed. Milestones carries path + block structure. Admins need a milestone setup surface. Problem being solved: students (and campus admins) do not manage blocks well.
- Staff Homes differ (turn 7): Instructor Home = their students (activity, progress, weak areas, quick allocation). Admin Home = workspace-level analytics; other admin surfaces manage content, exam content, tasks, 3D Studio, users.
- Review is not a destination: evidence / check-in / help-request / question-draft reviews arrive as notifications in the bell drawer (turn 7).
- Allocations surface is "Control Tower" (existing product name), a feature flag. Same surface for Instructors and Admins when enabled; absent from the rail when not.
- Staff Content rail: "Exam content" split into "Written Exams" and "Oral Exams".
- Admin Content rail: "Course Catalog" (was Courses & blocks). Milestone setup lives under it.
- Staff Content rail: "Library" and "3D Studio" are separate items (was Library & 3D).
- Student rail has no 3D item; 3D is reached through tasks and Library. Student rail: Home · Exams · Simulators · Library · Messages · Milestones.
- Admin Content rail shows either Course Catalog (Education) or Tasks (Commercial / radio pilot), never both.
- Viewer side is labelled "Student / Operator". Student rail has sections: Work (Home, Milestones) · Learn (Training, Simulators, Exams) · Knowledge (Library, Assistant); Messages at bottom. Commercial labels per user screenshot: Work → Home · Jobs · Procedures; Learn → Start here · Training · Assessments; Knowledge → Assistant.
- Student rail (turn 6 revised): Work = Home · Jobs · Tasks · Milestones; Learn = Start here · Training · Simulators · Exams; Knowledge = Library · Assistant; Messages bottom. Home = path strip + today (resume/fix/due); Tasks = full filtered allocation list (6d). Jobs = Commercial container; Education may hide it.
- Student rail (turn 6 revised again): Work = Home · Jobs · Tasks; Learn = Start here · Training · Simulators · Exams; Knowledge = Library · Assistant · Milestones; Messages marked Future.
- Simulators are part of Training (no separate student rail item). Student rail: Work = Home · Jobs · Tasks; Learn = Start here · Training · Exams; Knowledge = Library · Assistant · Milestones; Messages (Future).
- Student rail Learn item is "Assessments" (was Exams), both domains.
- Instructor rail (turn 8): Work = Home · Assignments · Tasks; Content = Written Exams · Oral Exams; Knowledge = Library · 3D Studio · Assistant; Messages (Future). No Students tab, no Control Tower on instructor rail; "Assignments" is the allocation surface.
- Control Tower = the allocation feature. For students it IS the Home page (what has been allocated to me). For instructors it IS the Assignments tab (allocate to students). Admin side: same, under a feature flag.
- Instructor rail section "Teach": Training · Assessments (same labels as student Learn; written/oral exams live inside Assessments).
- Instructor rail: new section "Build" = Design Studio (replaces 3D Studio). Knowledge = Library · Assistant.
- Instructor and Admin rails: "Workspace" tab sits at the bottom, directly above Messages (Future).
- All rails: "Help & Feedback" above Messages (Future), version string below. Staff rails: Workspace · Help & Feedback · Messages.
- Messages tab removed from all rails (not shown, even as Future). Rails end with Help & Feedback + version; staff rails have Workspace above it.
- Instructor rail Knowledge = Library · Assistant · Milestones (mirrors student).
- Admin rail (turn 8): Work = Home · Triage · Jobs · Procedures (no Control Tower); Teach = Course Catalog · Training · Assessments; Build = Design Studio; Knowledge = Library · Assistant · Milestones; Operations = Inventory Mgr · Records · Integrations (Users & access moved out; likely under Workspace); Workspace · Help & Feedback. Triage = admin work queue, not yet defined.
