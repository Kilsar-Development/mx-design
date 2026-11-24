// Design Studio for Mx Web. Brought over from the original MX mock (web-app.jsx, "Design Studio (web only)")
// and rewritten onto MX DS V3. Mounted by Mx Web.dc.html in the Design Studio tab for instructor and admin.
// The assistant, its replies and the generation timings are simulated in the browser; nothing calls a server.
// Checked by tools/check-ds.js: every colour is a ColorScheme role or an accent, every text style is one of
// the 16 tokens (through tx()), spacing is the Sizing constants, radius is a constant or half the height.
const { useState, useRef, useEffect, useLayoutEffect } = React;
const EASE = "cubic-bezier(0.42, 0, 0.58, 1)";

// ds-check:text-tokens-start  (the only place a font size, weight or letter spacing may be written)
const TX = {
  headingLargeBold: { fontFamily: "inherit", fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em" },
  headingMediumBold: { fontFamily: "inherit", fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" },
  titleBold: { fontFamily: "inherit", fontSize: 18, fontWeight: 700 },
  subtitleSemiBold: { fontFamily: "inherit", fontSize: 16, fontWeight: 600 },
  bodyRegular: { fontFamily: "inherit", fontSize: 14, fontWeight: 400 },
  bodySemiBold: { fontFamily: "inherit", fontSize: 14, fontWeight: 600 },
  bodyBold: { fontFamily: "inherit", fontSize: 14, fontWeight: 700 },
  labelRegular: { fontFamily: "inherit", fontSize: 13, fontWeight: 400 },
  labelSemiBold: { fontFamily: "inherit", fontSize: 13, fontWeight: 600 },
  labelBold: { fontFamily: "inherit", fontSize: 13, fontWeight: 700 },
  captionRegular: { fontFamily: "inherit", fontSize: 12, fontWeight: 400 },
  captionSemiBold: { fontFamily: "inherit", fontSize: 12, fontWeight: 600 },
  overlineBold: { fontFamily: "inherit", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" },
  microBold: { fontFamily: "inherit", fontSize: 10, fontWeight: 700 },
};
// ds-check:text-tokens-end
const tx = (token, color, extra) => ({ ...TX[token], ...(color ? { color } : null), ...extra });
const ELLIPSIS = { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };

// Keyframes this screen needs (Mx Web itself only defines mx-in and mx-slide), and form controls take the page font.
function DsKeyframes() {
  return <style>{"@keyframes ds-spin{to{transform:rotate(360deg)}}@keyframes ds-pulse{0%,60%,100%{opacity:.3}30%{opacity:1}}.ds-root button,.ds-root input,.ds-root textarea,.ds-root select{font-family:inherit}"}</style>;
}

// ── Icons: stroke icons in the Mx Web style (24 grid, 1.8 stroke) ──
const DS_ICON = {
  refresh: "M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6",
  itemList: "M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2",
  stack: "M3 5h18v4H3zM5 9v10h14V9M10 13h4",
  pencil: "M4 20h4L19 9l-4-4L4 16zM13 7l4 4",
  cube: "M12 2l9 5-9 5-9-5zM3 7v10l9 5 9-5V7M12 12v10",
  chevronRight: "M9 6l6 6-6 6",
  chevronDown: "M6 9l6 6 6-6",
  scene: "M3 7h13v10H3zM16 10l5-3v10l-5-3",
  animation: "M4 6h16v12H4zM8 6v12M16 6v12M4 10h4M4 14h4M16 10h4M16 14h4",
  warning: "M12 3l10 18H2zM12 10v5M12 18h.01",
  search: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM20 20l-4-4",
  play: "M8 5v14l11-7z",
  pause: "M8 5v14M16 5v14",
  image: "M4 5h16v14H4zM4 15l5-5 4 4 3-3 4 4M9 9h.01",
  file: "M6 3h9l4 4v14H6zM15 3v4h4M9 12h6M9 16h6",
  folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  movie: "M4 5h16v14H4zM10 9l5 3-5 3z",
  dots: "M5 12h.01M12 12h.01M19 12h.01",
  back: "M15 18l-6-6 6-6",
  close: "M6 6l12 12M18 6L6 18",
  check: "M5 12l4.5 4.5L20 6",
  plus: "M12 5v14M5 12h14",
  up: "M12 19V5M5.5 11.5L12 5l6.5 6.5",
  down: "M12 5v14M5.5 12.5L12 19l6.5-6.5",
  stop: "M7 7h10v10H7z",
  sparkle: "M10 3.5l1.6 4.4a3 3 0 0 0 1.8 1.8l4.4 1.6-4.4 1.6a3 3 0 0 0-1.8 1.8L10 19.1l-1.6-4.4a3 3 0 0 0-1.8-1.8l-4.4-1.6 4.4-1.6a3 3 0 0 0 1.8-1.8zM18.5 3v4M16.5 5h4M18.5 16v4M16.5 18h4",
};
const DS_ICON_ALIAS = { "filetypes/pdf": "file", "filetypes/doc": "file", "filetypes/txt": "file", "filetypes/folder": "folder", "filetypes/playMovie": "movie" };
function KlsIcon({ name, size = 18, color = "currentColor", rotate = 0, spin, style }) {
  const key = DS_ICON_ALIAS[name] || name;
  const solid = key === "play" || key === "stop";
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill={solid ? color : "none"} stroke={color} strokeWidth={key === "dots" ? 2.6 : 1.8}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ flex: "none", display: "inline-block", transform: rotate ? `rotate(${rotate}deg)` : undefined, animation: spin ? "ds-spin 1.2s linear infinite" : undefined, ...style }}>
      <path d={DS_ICON[key] || DS_ICON.file} />
    </svg>
  );
}
const SparkleGlyph = ({ size = 18, color = "currentColor" }) => <KlsIcon name="sparkle" size={size} color={color} />;
const PlusGlyph = ({ size = 16 }) => <KlsIcon name="plus" size={size} />;
const LIB_KINDS = {
  folder: { icon: "folder" }, pdf: { icon: "file" }, doc: { icon: "file" }, txt: { icon: "file" }, video: { icon: "movie" }, image: { icon: "image" },
  model: { icon: "cube" }, scene: { icon: "scene", label: "Scene" }, animation: { icon: "animation", label: "Animation" },
};

// ── Shared widgets, at the MX DS V3 heights ──
// Button: main 40, small 32. Primary = primary/onPrimary; default = secondary (outline); danger = error.
function MeButton({ children, onClick, tone, small, full, disabled, surface, ...rest }) {
  const [hover, setHover] = useState(false);
  const filled = tone === "primary" || tone === "danger";
  const text = small ? (filled ? "labelBold" : "labelSemiBold") : (filled ? "bodyBold" : "bodySemiBold");
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} {...rest}
      style={{ ...tx(text, tone === "primary" ? "var(--onPrimary)" : tone === "danger" ? "var(--onError)" : "var(--onSurface)"),
        height: small ? 32 : 40, padding: small ? "0 var(--sizingSmall)" : "0 var(--sizingMed)", borderRadius: "var(--smallBorderRadius)", boxSizing: "border-box",
        width: full ? "100%" : undefined, flex: "none", cursor: disabled ? "default" : "pointer",
        border: filled ? "none" : "1.5px solid " + (hover && !disabled ? "var(--primary)" : "var(--outline)"),
        background: tone === "primary" ? "var(--primary)" : tone === "danger" ? "var(--error)" : surface ? "var(--surface)" : "transparent",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "var(--sizingXSmall)", whiteSpace: "nowrap",
        opacity: disabled ? 0.4 : filled && hover ? 0.88 : 1, transition: `opacity 125ms ${EASE}, border-color 125ms ${EASE}` }}>{children}</button>
  );
}

// Icon button: 36 with an outline; ghost and small are 32.
function DsIconBtn({ label, onClick, disabled, icon, ghost, danger, spin, innerRef, active }) {
  const [hover, setHover] = useState(false);
  const on = (hover || active) && !disabled;
  const size = ghost ? 32 : 36;
  const color = danger ? "var(--error)" : on && !ghost ? "var(--primary)" : "var(--onSurfaceVariant)";
  return (
    <button ref={innerRef} aria-label={label} title={label} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width: size, height: size, flex: "none", boxSizing: "border-box", padding: 0, borderRadius: "var(--smallBorderRadius)", cursor: disabled ? "default" : "pointer",
        border: ghost ? "none" : "1.5px solid " + (on ? "var(--primary)" : "var(--outline)"),
        background: ghost && on ? (danger ? "var(--errorContainer)" : "var(--tertiary)") : "transparent", color,
        opacity: disabled ? 0.4 : 1, display: "inline-flex", alignItems: "center", justifyContent: "center",
        transition: `border-color 125ms ${EASE}, background 125ms ${EASE}` }}>
      <KlsIcon name={icon} size={ghost ? 16 : 18} spin={spin} />
    </button>
  );
}

// Segmented control: track 36, segment 30.
function SegmentedTabs({ tabs, value, onChange }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", flex: "none", height: 36, padding: "0 var(--sizingTiny)", borderRadius: 18, background: "var(--tertiary)" }}>
      {tabs.map((t) => {
        const on = t.key === value;
        return (
          <button key={t.key} onClick={() => onChange(t.key)} aria-pressed={on}
            style={{ ...tx(on ? "labelBold" : "labelSemiBold", on ? "var(--onSurface)" : "var(--onSurfaceVariant)"), height: 30, padding: "0 var(--sizingMed)", borderRadius: 15, border: "none",
              cursor: "pointer", whiteSpace: "nowrap", background: on ? "var(--surface)" : "transparent", boxShadow: on ? "var(--mx-drop-shadow)" : "none",
              transition: `background 125ms ${EASE}` }}>{t.label}</button>
        );
      })}
    </div>
  );
}

// Menu: opens below its anchor, or above it with up.
function FloatingMenu({ anchorRef, align = "left", width = 200, up, onClose, children }) {
  const [pos, setPos] = useState(null);
  const menuRef = useRef(null);
  useLayoutEffect(() => {
    const a = anchorRef.current;
    if (!a) return;
    const r = a.getBoundingClientRect();
    const left = Math.max(8, align === "right" ? r.right - width : r.left);
    setPos(up ? { bottom: window.innerHeight - r.top + 6, left } : { top: r.bottom + 6, left });
  }, [anchorRef, align, width, up]);
  useEffect(() => {
    const onDoc = (e) => { if (menuRef.current && !menuRef.current.contains(e.target) && !(anchorRef.current && anchorRef.current.contains(e.target))) onClose(); };
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    const onScroll = (e) => { if (!(menuRef.current && menuRef.current.contains(e.target))) onClose(); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); window.removeEventListener("scroll", onScroll, true); };
  }, [anchorRef, onClose]);
  if (!pos) return null;
  return (
    <div ref={menuRef} data-theme={DS_THEME} style={{ position: "fixed", ...pos, width, zIndex: 1000, boxSizing: "border-box", background: "var(--surface)", color: "var(--onSurface)",
      border: "1px solid var(--outline)", borderRadius: "var(--medBorderRadius)", boxShadow: "var(--mx-drop-shadow)",
      padding: "var(--sizingXSmall)", display: "flex", flexDirection: "column", gap: 2, animation: `mx-in 150ms ${EASE}` }}>{children}</div>
  );
}
function MenuItem({ children, selected, danger, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onClick} role="option" aria-selected={!!selected}
      style={{ ...tx(selected ? "bodySemiBold" : "bodyRegular", danger ? "var(--error)" : selected ? "var(--onPrimaryContainer)" : "var(--onSurface)"),
        textAlign: "left", border: "none", cursor: "pointer", width: "100%", minHeight: 36, boxSizing: "border-box",
        padding: "var(--sizingXSmall) var(--sizingSmall)", borderRadius: "var(--smallBorderRadius)",
        background: selected ? "var(--primaryContainer)" : hover ? "var(--surfaceContainerLow)" : "transparent",
        display: "flex", alignItems: "center", gap: "var(--sizingSmall)" }}>{children}</button>
  );
}
function DsMenuButton({ items, label = "Session actions" }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  return (
    <>
      <span onClick={(e) => e.stopPropagation()} style={{ display: "inline-flex", flex: "none" }}>
        <DsIconBtn innerRef={btnRef} ghost icon="dots" label={label} active={open} onClick={() => setOpen((o) => !o)} />
      </span>
      {open && (
        <span onClick={(e) => e.stopPropagation()}><FloatingMenu anchorRef={btnRef} align="right" width={184} onClose={() => setOpen(false)}>
          {items.filter(Boolean).map((it, i) => it === "divider"
            ? <div key={i} style={{ height: 1, background: "var(--outlineVariant)", margin: "var(--sizingTiny) var(--sizingXSmall)" }} />
            : <MenuItem key={it.label} danger={it.danger} onClick={() => { setOpen(false); it.onClick(); }}>
                <KlsIcon name={it.icon} size={16} color={it.danger ? "var(--error)" : "var(--onSurfaceVariant)"} />{it.label}
              </MenuItem>)}
        </FloatingMenu></span>
      )}
    </>
  );
}

// Checkbox: 22.
function DsCheckbox({ checked, label }) {
  return (
    <span aria-hidden="true" title={label} style={{ width: 22, height: 22, flex: "none", boxSizing: "border-box", borderRadius: "var(--xSmallBorderRadius)",
      border: "1.5px solid " + (checked ? "var(--primary)" : "var(--outline)"), background: checked ? "var(--primary)" : "transparent",
      display: "inline-flex", alignItems: "center", justifyContent: "center", transition: `background 125ms ${EASE}` }}>
      {checked && <KlsIcon name="check" size={14} color="var(--onPrimary)" />}
    </span>
  );
}

// Status pill: 24. Tones: neutral, primary (done or saved), attention (needs you), error.
const DS_TONE = {
  neutral: ["var(--tertiary)", "var(--onSurface)"],
  info: ["var(--tertiary)", "var(--onSurface)"],
  success: ["var(--primaryContainer)", "var(--onPrimaryContainer)"],
  warn: ["var(--accent3)", "var(--accent4)"],
  error: ["var(--errorContainer)", "var(--onErrorContainer)"],
};
function DsPill({ tone = "neutral", spin, children }) {
  const [bg, fg] = DS_TONE[tone];
  return (
    <span style={{ ...tx("captionSemiBold", fg), height: 24, padding: "0 var(--sizingSmall)", borderRadius: 12, background: bg, boxSizing: "border-box",
      display: "inline-flex", alignItems: "center", gap: "var(--sizingXSmall)", flex: "none", whiteSpace: "nowrap" }}>
      {spin && <KlsIcon name="refresh" size={12} color={fg} spin />}
      {children}
    </span>
  );
}
function DsStatusPill({ status }) {
  return status === "archived" ? <DsPill>Archived</DsPill> : null;
}
function DsStatusTag({ status }) {
  const a = DS_ACT[status];
  return <DsPill tone={a.tone} spin={a.active}>{a.label}</DsPill>;
}

// Shared surfaces and fields.
const DS_SECTION_LABEL = { ...TX.overlineBold, textTransform: "uppercase", color: "var(--onSurfaceVariant)" };
const DS_CARD = {
  background: "var(--surface)", border: "1px solid var(--outlineVariant)", borderRadius: "var(--medBorderRadius)",
  padding: "var(--sizingMed)", display: "flex", flexDirection: "column", gap: "var(--sizingSmall)",
};
// Both workspace panels share one header height (fits the 40 content picker and buttons).
const DS_PANEL_HEAD = { display: "flex", alignItems: "center", minHeight: 64, boxSizing: "border-box",
  padding: "var(--sizingSmall) var(--sizingMed)", borderBottom: "1px solid var(--outlineVariant)", flex: "none" };
// Text field 48 (compact 40). Multi-line fields take the same border and padding.
const DS_FIELD = {
  ...TX.bodyRegular, width: "100%", boxSizing: "border-box", borderRadius: "var(--smallBorderRadius)", outline: "none",
  background: "var(--surface)", border: "1px solid var(--outline)", padding: "var(--sizingXSmall) var(--sizingSmall)", color: "var(--onSurface)",
};
const DS_INPUT = { ...DS_FIELD, height: 48, padding: "0 var(--sizingSmall)" };
const DS_EMPTY_DISC = { width: 56, height: 56, borderRadius: "50%", background: "var(--tertiary)", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" };

// Dialog: the Mx Web pattern (head with title and close, body, foot with the actions).
function DsDialog({ title, titleId, icon, iconColor = "var(--primary)", width = 480, onClose, footer, children, bodyStyle }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div data-theme={DS_THEME} style={{ position: "fixed", inset: 0, zIndex: 1600, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--sizingMed)", color: "var(--onSurface)" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "var(--scrim)" }} />
      <div role="dialog" aria-modal="true" aria-labelledby={titleId}
        style={{ position: "relative", width: `min(${width}px, 100%)`, maxHeight: "calc(100vh - 64px)", background: "var(--surface)", border: "1px solid var(--outline)",
          borderRadius: "var(--medBorderRadius)", boxShadow: "var(--mx-drop-shadow)", display: "flex", flexDirection: "column", animation: `mx-in 200ms ${EASE}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sizingSmall)", padding: "var(--sizingMed)", borderBottom: "1px solid var(--outline)" }}>
          {icon && <KlsIcon name={icon} size={20} color={iconColor} />}
          <span id={titleId} style={{ ...tx("titleBold"), flex: 1, minWidth: 0 }}>{title}</span>
          <button onClick={onClose} aria-label="Close" title="Close"
            style={{ width: 32, height: 32, flex: "none", padding: 0, border: "none", borderRadius: "50%", background: "var(--tertiary)", color: "var(--onSurface)", cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center" }}><KlsIcon name="close" size={14} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sizingSmall)", padding: "var(--sizingMed)", flex: 1, minHeight: 0, overflowY: "auto", ...bodyStyle }}>{children}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "var(--sizingXSmall)", padding: "var(--sizingMed)", borderTop: "1px solid var(--outline)" }}>{footer}</div>
      </div>
    </div>
  );
}

// The thing a session writes is a Task (Joel, 20 Nov 2026). The original called it an Assignment.
let DS_THEME = "light";
const DS_KIND = "task";
const DS_KIND_LABEL = { task: "Task" };
const dsKindName = () => "Task";
const dsKindA = () => "a Task";
const dsKindPlural = () => "Tasks";

// Stand-in parts for the 3D preview. Each part names the ColorScheme role its material takes, read from the page at render time.
const ME_PART_SETS = {
  t1: [
    { id: "p1", name: "Inlet Cone",     geom: "cone",   role: "onSurfaceVariant", pos: [0, 0, 2.6],  dir: [0, 0, 1],  group: "Static structure" },
    { id: "p2", name: "Housing",        geom: "shell",  role: "outline",          pos: [0, 0, 0],    dir: [0, 1, 0],  group: "Static structure" },
    { id: "p3", name: "Rotor Shaft",    geom: "shaft",  role: "surfaceContainerHighest", pos: [0, 0, 0], dir: [0, 0, -1], group: "Rotating assembly" },
    { id: "p4", name: "Stage 1 Blades", geom: "blades", role: "inversePrimary",   pos: [0, 0, 1.1],  dir: [0, 0, 1],  group: "Rotating assembly" },
    { id: "p5", name: "Stage 2 Blades", geom: "blades", role: "inversePrimary",   pos: [0, 0, 0],    dir: [0, 0, 1],  group: "Rotating assembly" },
    { id: "p6", name: "Stage 3 Blades", geom: "blades", role: "primary",          pos: [0, 0, -1.1], dir: [0, 0, -1], group: "Rotating assembly" },
  ],
  t2: [
    { id: "p1", name: "Strut",         geom: "shaft", role: "onSurfaceVariant", pos: [0, 1.1, 0],    dir: [0, 1, 0],    group: "Strut assembly" },
    { id: "p2", name: "Wheel Hub",     geom: "hub",   role: "surfaceContainerHighest", pos: [0, -0.6, 0], dir: [1, 0, 0], group: "Wheel assembly" },
    { id: "p3", name: "Tire",          geom: "tire",  role: "inverseSurface",   pos: [0, -0.6, 0],   dir: [-1, 0, 0],   group: "Wheel assembly" },
    { id: "p4", name: "Brake Caliper", geom: "box",   role: "accent1",          pos: [0.9, -0.2, 0], dir: [1, 0.4, 0],  group: "Wheel assembly" },
    { id: "p5", name: "Actuator Arm",  geom: "arm",   role: "primary",          pos: [-0.8, 0.6, 0], dir: [-1, 0.6, 0], group: "Strut assembly" },
  ],
  default: [
    { id: "p1", name: "Body",         geom: "shell",  role: "outline",          pos: [0, 0, 0],    dir: [0, 1, 0],  group: "Housing" },
    { id: "p2", name: "Cover",        geom: "hub",    role: "onSurfaceVariant", pos: [0, 1.0, 0],  dir: [0, 1, 0],  group: "Housing" },
    { id: "p3", name: "Mount",        geom: "box",    role: "surfaceContainerHighest", pos: [0, -1.0, 0], dir: [0, -1, 0], group: "Mounting" },
    { id: "p4", name: "Fastener Set", geom: "blades", role: "accent1",          pos: [0, 0, 1.0],  dir: [0, 0, 1],  group: "Mounting" },
  ],
};

const LIB_ITEMS = [
  { id: "f1", kind: "folder", name: "domjan",                      bytes: 0,         type: "",    added: "2025-07-25",
    children: [
      { id: "f1a", kind: "pdf", name: "Torque Sequence Worksheet.pdf", bytes: 486400, type: "PDF", added: "2025-07-25" },
      { id: "f1b", kind: "pdf", name: "Shop Safety Briefing.pdf",      bytes: 1258291, type: "PDF", added: "2025-07-26" },
    ] },
  { id: "f2", kind: "folder", name: "joel",                        bytes: 0,         type: "",    added: "2025-06-23",
    children: [
      { id: "f2a", kind: "pdf", name: "Rivet Inspection Log.pdf",      bytes: 204800, type: "PDF", added: "2025-06-23" },
    ] },
  { id: "f3", kind: "folder", name: "test_pagination",             bytes: 0,         type: "",    added: "2025-09-12",
    children: [
      { id: "f3a", kind: "pdf", name: "Page Set 001.pdf",              bytes: 1048576, type: "PDF", added: "2025-09-12" },
      { id: "f3b", kind: "pdf", name: "Page Set 002.pdf",              bytes: 1153434, type: "PDF", added: "2025-09-12" },
      { id: "f3c", kind: "pdf", name: "Page Set 003.pdf",              bytes: 999424,  type: "PDF", added: "2025-09-13" },
    ] },
  { id: "f4", kind: "folder", name: "testfolder",                  bytes: 0,         type: "",    added: "2026-05-11",
    children: [
      { id: "f4a", kind: "doc", name: "Module Outline.docx",           bytes: 65536,   type: "DOCX", added: "2026-05-11" },
      { id: "f4b", kind: "txt", name: "notes.txt",                     bytes: 2048,    type: "TXT",  added: "2026-05-12" },
    ] },
  { id: "d1", kind: "pdf",    name: "8083-30A-AIM (General).pdf",  bytes: 128278528, type: "PDF", added: "2026-04-08" },
  { id: "d2", kind: "pdf",    name: "ACS_Code_Descriptions_Mapped.pdf", bytes: 22538, type: "PDF", added: "2026-04-08" },
  { id: "d3", kind: "pdf",    name: "AMA-23-EKIT Airframe.pdf",    bytes: 11053384,  type: "PDF", added: "2026-04-08" },
  { id: "d4", kind: "pdf",    name: "AMG-23-EKIT General.pdf",     bytes: 10370416,  type: "PDF", added: "2026-04-08" },
  { id: "d5", kind: "pdf",    name: "AMP-23-EKIT Powerplant.pdf",  bytes: 12897484,  type: "PDF", added: "2026-04-08" },
  { id: "d6", kind: "pdf",    name: "FAA-H-8083-31B Vol 2.pdf",    bytes: 74973184,  type: "PDF", added: "2026-03-19" },
];

const LIB_MODEL_CFM56 = { id: "t1", kind: "model", name: "CFM56 Compressor Section.glb", bytes: 62914560, type: "GLB", added: "2026-05-04",
    children: [
      { id: "t1s1", kind: "scene",     name: "Full Assembly",        added: "2026-05-04" },
      { id: "t1s2", kind: "scene",     name: "Stage 3 Cutaway",      added: "2026-05-04" },
      { id: "t1a1", kind: "animation", name: "Exploded View",        added: "2026-05-06", duration: "0:12", steps: 6 },
      { id: "t1a2", kind: "animation", name: "Rotor Spin Cycle",     added: "2026-05-06", duration: "0:08", steps: 3 },
    ] };
const LIB_MODEL_CESSNA = { id: "t2", kind: "model", name: "Cessna 172 Landing Gear.glb",  bytes: 18874368, type: "GLB", added: "2026-04-21",
    children: [
      { id: "t2s1", kind: "scene",     name: "Gear Down",            added: "2026-04-21" },
      { id: "t2s2", kind: "scene",     name: "Gear Retracted",       added: "2026-04-21" },
      { id: "t2a1", kind: "animation", name: "Retraction Sequence",  added: "2026-04-22", duration: "0:06", steps: 4 },
    ] };

const LIB_MODELS = [
  { id: "tf1", kind: "folder", name: "engines", bytes: 0, type: "", added: "2026-05-04",
    children: [
      LIB_MODEL_CFM56,
      { id: "t5", kind: "model", name: "PT6A Turboprop.glb", bytes: 41943040, type: "GLB", added: "2026-04-30" },
    ] },
  { id: "tf2", kind: "folder", name: "airframe", bytes: 0, type: "", added: "2026-04-21",
    children: [LIB_MODEL_CESSNA] },
  { id: "t3", kind: "model", name: "Hydraulic Actuator.obj",       bytes: 8912896,  type: "OBJ", added: "2026-03-15" },
  { id: "t4", kind: "model", name: "Fuel Pump Assembly.glb",       bytes: 24117248, type: "GLB", added: "2026-02-08",
    children: [
      { id: "t4a1", kind: "animation", name: "Flow Cycle",           added: "2026-02-10", duration: "0:15", steps: 8 },
    ] },
];

function libSize(b) {
  if (b === 0) return "0 B";
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(2) + " KB";
  if (b < 1024 * 1024 * 1024) return (b / 1048576).toFixed(2) + " MB";
  return (b / 1073741824).toFixed(2) + " GB";
}
const DS_OUT = {
  task: { label: "Task", icon: "itemList" },
  model: { label: "3D model", icon: "cube" },
  scene: { label: "Scene", icon: "scene" },
  animation: { label: "Animation", icon: "animation" },
};

const DS_SUGGESTIONS = [
  { kind: "task", get text() { return `Write ${dsKindA()} to remove and install the nose gear torque link from the maintenance manual`; } },
  { kind: "model", text: "Generate a 3D model of a main landing gear wheel and brake assembly" },
  { kind: "animation", text: "Animate the nose gear retracting into the wheel well" },
  { kind: "scene", text: "Create a scene showing the torque link inspection points" },
];

// Ready Library models (GET library/?category=three_d_model&normalization_status=ready)
const DS_MODELS = [
  { id: "lm-nlg", name: "Nose landing gear assembly" },
  { id: "lm-mwb", name: "Main wheel and brake assembly" },
  { id: "lm-tl", name: "Torque link" },
];

// Action / model-generation statuses → UI. "active" ones keep the feed polling.
const DS_ACT = {
  queued: { label: "Queued", tone: "neutral", active: true },
  waiting_for_model: { label: "Waiting for model", tone: "neutral", active: true },
  generating: { label: "Generating", tone: "info", active: true },
  finalizing: { label: "Finalizing", tone: "info", active: true },
  ready: { label: "Saved to Library", tone: "success" },
  awaiting_review: { label: "Ready for review", tone: "warn" },
  approved: { label: "Saved to Library", tone: "success" },
  rejected: { label: "Discarded", tone: "neutral" },
  failed: { label: "Failed", tone: "error" },
  timed_out: { label: "Timed out", tone: "error" },
  canceled: { label: "Canceled", tone: "neutral" },
};
const DS_TIMELINE = {
  model: [[1500, "generating", "Building geometry"], [3500, "generating", "Adding materials"], [3500, "finalizing", "Preparing the preview"], [2500, "awaiting_review", null]],
  scene: [[1500, "generating", "Placing the camera and lights"], [4000, "awaiting_review", null]],
  animation: [[1500, "generating", "Keyframing the motion"], [3500, "generating", "Rendering a preview"], [3000, "awaiting_review", null]],
};
function dsAbs(rel, t0) { let t = t0; return rel.map(([ms, status, stage]) => { t += ms; return { at: t, status, stage }; }); }
function dsNewOutput(spec, waitFor) {
  const now = Date.now();
  return { id: dsUid(), kind: spec.kind, name: spec.name, prompt: spec.prompt, model: spec.model || null, revision: 1, approved_revision: null,
    status: waitFor ? "waiting_for_model" : "queued", stage: null, waitFor: waitFor || null,
    queue: waitFor ? [] : dsAbs(DS_TIMELINE[spec.kind], now), attached: null, error: null, created_at: now };
}
function dsRestart(o, patch) { return { ...o, ...patch, status: "queued", stage: null, error: null, queue: dsAbs(DS_TIMELINE[o.kind], Date.now()) }; }

// Library documents the assistant can cite / link to steps (document_ids).
const DS_DOCS = {
  "amm-29": { name: "AMM 29-00-00 · Hydraulic Power", icon: "filetypes/pdf" },
  "amm-32-21": { name: "AMM 32-21-00 · Nose Landing Gear", icon: "filetypes/pdf" },
  "amm-32-51": { name: "AMM 32-51-00 · Nose Wheel Steering", icon: "filetypes/pdf" },
  "amm-32-41": { name: "AMM 32-41-00 · Wheels and Brakes", icon: "filetypes/pdf" },
  "cmm-32-30": { name: "CMM 32-30-11 · Gear Actuator", icon: "filetypes/pdf" },
  "sop-ramp": { name: "Ramp Safety SOP", icon: "filetypes/doc" },
};

function dsUid() {
  try { return crypto.randomUUID(); } catch (e) { return "id-" + Math.random().toString(16).slice(2) + Date.now().toString(16); }
}
function dsAgo(ts) {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return m + "m ago";
  const h = Math.round(m / 60);
  if (h < 24) return h + "h ago";
  const d = Math.round(h / 24);
  return d === 1 ? "Yesterday" : d + "d ago";
}
const dsStep = (title, instructions, document_ids = [], notes = null) => ({ id: dsUid(), title, instructions, notes, document_ids });

// ── Draft templates the mock assistant "writes" ──
function dsDraftFor(text) {
  const t = text.toLowerCase();
  if (t.includes("torque link")) return {
    sources: ["amm-32-21", "amm-32-51", "amm-29"],
    draft: { title: "Nose gear torque link removal and installation", description: "Remove, inspect and reinstall the nose landing gear torque link assembly.", steps: [
      dsStep("Prepare the aircraft", "Chock the main wheels, install the nose gear ground lock pin and tag the cockpit steering controls. Relieve hydraulic pressure.", ["amm-29", "sop-ramp"]),
      dsStep("Disconnect the steering", "Disconnect the nose wheel steering linkage from the upper torque link.", ["amm-32-51"]),
      dsStep("Remove the torque link pins", "Remove the cotter pins, nuts and washers. Support the links while you drive out the bolts and keep the hardware with each link.", ["amm-32-21"]),
      dsStep("Inspect the links and bushings", "Check for cracks, corrosion and bushing wear. Compare measurements with the wear limits in the manual.", ["amm-32-21"], "Record measurements on the task card."),
      dsStep("Install the torque link", "Install the links with new bushings as needed. Torque the bolts to the manual value and install new cotter pins.", ["amm-32-21"]),
      dsStep("Reconnect and check steering", "Reconnect the steering linkage, remove the ground lock pin and do the steering operational check.", ["amm-32-51"]),
    ] },
    reply: "I drafted a 6-step procedure from AMM 32-21-00 and the steering chapter. Wear limits and torque values point back to the manual instead of being copied in. Review the steps on the right, then save it as " + dsKindA() + " when it looks right.",
  };
  if (t.includes("actuator")) return {
    sources: ["cmm-32-30", "amm-29"],
    draft: { title: "Hydraulic actuator inspection", description: "Inspect a landing gear actuator for leaks, damage and rod condition against the manual limits.", steps: [
      dsStep("Depressurize the system", "Relieve hydraulic pressure and confirm zero pressure on the gauge before touching the actuator.", ["amm-29"]),
      dsStep("Inspect for leaks", "Wipe the actuator clean, then check the rod seal and fittings for leakage beyond the allowable limit.", ["cmm-32-30"]),
      dsStep("Inspect the rod", "Check the piston rod for scoring, pitting and chrome damage. Compare any damage with the limits table.", ["cmm-32-30"]),
      dsStep("Record findings", "Record the results and any out-of-limit findings on the task card."),
    ] },
    reply: "Here's a 4-step inspection drafted from CMM 32-30-11. Each check links to the limits table in the manual so students look up the values themselves.",
  };
  if (t.includes("wheel") || t.includes("brake")) return {
    sources: ["amm-32-41", "sop-ramp"],
    draft: { title: "Wheel and brake assembly replacement", description: "Replace a main wheel and brake assembly and return the aircraft to service.", steps: [
      dsStep("Jack the aircraft", "Position the jack at the axle jack point and raise the wheel clear of the ground.", ["amm-32-41", "sop-ramp"]),
      dsStep("Remove the wheel", "Deflate the tire, remove the axle nut and slide the wheel assembly off the axle.", ["amm-32-41"]),
      dsStep("Replace the brake assembly", "Disconnect the brake line, remove the brake assembly bolts and install the new assembly.", ["amm-32-41"]),
      dsStep("Install the wheel", "Install the wheel, torque the axle nut to the manual value and inflate the tire.", ["amm-32-41"]),
      dsStep("Bleed and test the brakes", "Bleed the brake line, lower the aircraft and do the brake operational check.", ["amm-32-41"]),
    ] },
    reply: "I drafted a 5-step replacement procedure from AMM 32-41-00. Check the steps on the right; you can reorder or edit any of them.",
  };
  return null;
}

function dsAssetKind(t) {
  if (/\banimat/.test(t)) return "animation";
  if (/\bscenes?\b/.test(t)) return "scene";
  if (/\bmodel\b/.test(t) && /(generate|create|build|make|new)/.test(t)) return "model";
  return null;
}
function dsAssetName(text, kind, model) {
  let n = text.replace(/\s+from the “.+?” model.*$/i, "")
    .replace(/^(please\s+)?(generate|create|build|make|animate|draft)\s+/i, "").replace(/^(a|an|the)\s+/i, "")
    .replace(/^(new\s+)?(3d\s+)?(model|scene|animation)\s+(of|showing|that shows|for)\s+/i, "").replace(/^(a|an|the)\s+/i, "").trim();
  if (!n || /^(new\s+)?(3d\s+)?(model|scene|animation)$/i.test(n)) n = (model || "New") + " " + DS_OUT[kind].label.toLowerCase();
  return (n.charAt(0).toUpperCase() + n.slice(1)).slice(0, 255);
}
function dsModelFor(session, text) {
  const q = text.match(/“(.+?)”/);
  const generated = (session.outputs || []).filter((o) => o.kind === "model" && o.status === "ready").map((o) => o.name);
  const all = [...DS_MODELS.map((m) => m.name), ...generated];
  if (q && all.includes(q[1])) return q[1];
  const t = text.toLowerCase();
  // Models made in this session win over Library look-alikes when the request names them
  const own = generated.find((n) => t.includes(n.toLowerCase()));
  if (own) return own;
  if (t.includes("nose gear") || t.includes("nose landing")) return "Nose landing gear assembly";
  if (t.includes("torque link")) return "Torque link";
  if (t.includes("wheel") || t.includes("brake")) return "Main wheel and brake assembly";
  return null;
}
function dsAssetReply(kind, name, model, withNewModel) {
  if (kind === "model") return `I started generating “${name}”. It runs in the background and usually takes a few minutes. When it's ready, look it over in the viewer, ask me for changes, and save it to the Library when it's right.`;
  const k = DS_OUT[kind].label.toLowerCase();
  if (withNewModel) return `I'll generate a new 3D model first, then build the ${k} “${name}” from it once you've saved the model to the Library.`;
  return `I'm building the ${k} “${name}” from the “${model}” model in the Library. It runs in the background; nothing is saved to the Library until you choose to.`;
}
function dsAssetPlan(kind, name, prompt, model, withNewModel) {
  const outputs = kind === "model" ? [{ kind, name, prompt }]
    : withNewModel ? [{ kind: "model", name: name + " model", prompt }, { kind, name, prompt, afterModel: true }]
    : [{ kind, name, prompt, model }];
  return { activities: kind === "model" ? ["Reading your request", "Starting model generation"] : ["Finding a model in the Library", "Starting the " + DS_OUT[kind].label.toLowerCase()],
    sources: [], outputs, reply: dsAssetReply(kind, name, model, withNewModel) };
}

function dsPlanTurn(session, text, docs = [], focusId = null) {
  const plan = dsPlanTurnBase(session, text, docs, focusId);
  if (docs.length) {
    plan.sources = [...docs, ...(plan.sources || []).filter((x) => !docs.includes(x))];
    plan.activities = ["Reading " + (docs.length === 1 ? dsDoc(docs[0]).name : docs.length + " documents from the Library"), ...plan.activities.filter((a) => a !== "Searching the Library")];
    if (!plan.activities.length) plan.activities = ["Reading your documents"];
  }
  return plan;
}

function dsPlanTurnBase(session, text, docs, focusId) {
  const hasSteps = session.draft.steps.length > 0;
  const outs = session.outputs || [];
  // Revision of a standalone output (revise_content action)
  const rv = text.match(/^Revise “(.+?)”: ([\s\S]+)$/);
  if (rv) {
    const o = outs.find((x) => x.name === rv[1]);
    if (o) return { activities: ["Updating the request"], sources: [], revise: { id: o.id, prompt: rv[2] },
      reply: `Working on version ${o.revision + 1} of “${o.name}”. ${o.approved_revision ? "The approved version stays in the Library until you approve the new one." : "I'll let you know when it's ready for review."}` };
  }
  // Free-text change to what's open in the viewer ("Make the tire larger") → revise_content
  const focus = focusId && outs.find((x) => x.id === focusId);
  if (focus && ["awaiting_review", "rejected", "approved", "ready"].includes(focus.status) && !dsAssetKind(text.toLowerCase()) && !/\b(task|procedure|step)\b/i.test(text)) {
    const saved = focus.approved_revision;
    return { activities: ["Updating the " + DS_OUT[focus.kind].label.toLowerCase()], sources: [], revise: { id: focus.id, prompt: text },
      reply: focus.kind === "model"
        ? `Working on version ${focus.revision + 1} of “${focus.name}”. ${saved ? `Version ${saved} stays in the Library until you save the new one.` : "It isn't in the Library until you save it."}`
        : `Working on version ${focus.revision + 1} of “${focus.name}”. ${saved ? `Version ${saved} stays in the Library until you save the new one.` : "It isn't in the Library until you save it."}` };
  }
  // Answer to "which model?" question
  const last = session.messages[session.messages.length - 1];
  const pending = last && last.question && last.question.pending;
  if (pending) {
    if (/generate a new model/i.test(text)) return dsAssetPlan(pending.kind, pending.name, pending.prompt, null, true);
    const m = dsModelFor(session, text);
    if (m) return dsAssetPlan(pending.kind, dsAssetName(pending.prompt, pending.kind, m), pending.prompt, m, false);
  }
  // Standalone asset request — no Task needed
  const kind = dsAssetKind(text.toLowerCase());
  if (kind) {
    if (kind === "model") return dsAssetPlan("model", dsAssetName(text, "model"), text);
    const m = dsModelFor(session, text);
    if (/new model/i.test(text)) return dsAssetPlan(kind, dsAssetName(text, kind), text, null, true);
    if (m) return dsAssetPlan(kind, dsAssetName(text, kind, m), text, m, false);
    const k = DS_OUT[kind].label.toLowerCase();
    const readyGenerated = outs.filter((o) => o.kind === "model" && o.status === "ready").map((o) => o.name);
    return { activities: ["Finding a model in the Library"], sources: [],
      reply: `Which 3D model should the ${k} use? I can use one that's ready in the Library or generate a new one first.`,
      question: { prompt: "Pick a model", pending: { kind, name: dsAssetName(text, kind), prompt: text },
        options: [...[...readyGenerated, ...DS_MODELS.map((x) => x.name)].slice(0, 3).map((n) => `Use “${n}”`), "Generate a new model first"] } };
  }
  const tpl = dsDraftFor(text);
  if (tpl && !hasSteps) return { activities: ["Searching the Library", "Reading " + DS_DOCS[tpl.sources[0]].name, "Drafting steps"], ...tpl };
  if (!hasSteps && !docs.length && text.trim().split(/\s+/).length < 6) return {
    activities: ["Searching the Library"],
    reply: "I can build that. Which source should I work from?",
    sources: [],
    question: { prompt: "Pick a source", options: ["Use the maintenance manual in the Library", "Use the Ramp Safety SOP", "Add documents from the Library…"] },
  };
  if (!hasSteps) {
    const firstAsk = (session.messages.find((m) => m.role === "user") || { content: text }).content;
    const title = firstAsk.replace(/^(write|draft|build|create|make)\s+(a|an)?\s*/i, "").replace(/\s+procedure.*$/i, "").slice(0, 80) || "New procedure";
    return {
      activities: ["Searching the Library", "Drafting steps"],
      sources: ["sop-ramp"],
      draft: { title: title.charAt(0).toUpperCase() + title.slice(1), description: "", steps: [
        dsStep("Prepare", "Make the aircraft and work area safe before starting.", docs.length ? [docs[0]] : ["sop-ramp"]),
        dsStep("Remove", "Remove the component and keep the hardware together.", docs.slice(0, 1)),
        dsStep("Inspect", "Inspect against the limits in the manual.", docs.slice(0, 1)),
        dsStep("Install", "Install the component and torque the hardware to the manual values.", docs.slice(0, 1)),
        dsStep("Test", "Do the operational check and record the result.", docs.slice(-1)),
      ] },
      reply: docs.length
        ? `I drafted a 5-step outline from ${docs.length === 1 ? "“" + dsDoc(docs[0]).name + "”" : "the " + docs.length + " documents you added"}. Each step links back to its source so you can check the details.`
        : "I started a 5-step outline. I couldn't match it to a specific manual chapter, so the steps are generic. Tell me the aircraft or add the manual from the Library and I'll make them specific.",
    };
  }
  const stepTitle = text.trim().replace(/^add (a )?step (to |that |for )?/i, "");
  return {
    activities: ["Updating the draft"],
    sources: [],
    draft: { ...session.draft, steps: [...session.draft.steps, dsStep(stepTitle.charAt(0).toUpperCase() + stepTitle.slice(1, 80), "Describe what the student does in this step.")] },
    reply: "I added that as step " + (session.draft.steps.length + 1) + ". Edit the instructions on the right if it needs more detail.",
  };
}

function dsAssetSeed(kind, name, ask, model, state, at) {
  const o = { ...dsNewOutput({ kind, name, prompt: ask, model }), ...state, created_at: at };
  const plan = dsAssetReply(kind, name, model, false);
  return { id: dsUid(), title: name, status: "draft", authoring_kind: DS_KIND, draft: { title: "", description: "", steps: [] }, draft_revision: 0, saved_revision: null,
    outputs: [o], updated_at: at, messages: [
      { id: dsUid(), role: "user", content: ask },
      { id: dsUid(), role: "assistant", content: plan, status: "done", sources: [], actions: [o.id] }] };
}

// ── Seed sessions (stand-ins for GET /design-studio/sessions/) ──
function dsSeedSessions() {
  const now = Date.now();
  const torque = dsDraftFor("torque link");
  const actuator = dsDraftFor("actuator");
  const wheel = dsDraftFor("wheel");
  const msgs = (q, a, sources) => [
    { id: dsUid(), role: "user", content: q },
    { id: dsUid(), role: "assistant", content: a, status: "done", sources, draftChanged: true },
  ];
  return [
    { id: dsUid(), title: torque.draft.title, status: "saved", authoring_kind: DS_KIND, draft: torque.draft, draft_revision: 3, saved_revision: 3, outputs: [],
      messages: msgs("Write a procedure to remove and install the nose gear torque link from the maintenance manual", torque.reply, torque.sources), updated_at: now - 2 * 3600e3 },
    { id: dsUid(), title: actuator.draft.title, status: "draft", authoring_kind: DS_KIND, draft: actuator.draft, draft_revision: 2, saved_revision: null, outputs: [],
      messages: msgs("Draft an inspection procedure for a hydraulic actuator, with the limits from the manual", actuator.reply, actuator.sources), updated_at: now - 26 * 3600e3 },
    { id: dsUid(), title: "Main wheel tire change (old)", status: "archived", authoring_kind: DS_KIND, draft: wheel.draft, draft_revision: 4, saved_revision: 4, outputs: [],
      messages: msgs("Build a wheel and brake assembly replacement procedure", wheel.reply, wheel.sources), updated_at: now - 4 * 24 * 3600e3 },
    dsAssetSeed("animation", "Nose gear retracting into the wheel well", "Animate the nose gear retracting into the wheel well", "Nose landing gear assembly",
      { status: "awaiting_review", queue: [] }, now - 40 * 60e3),
    dsAssetSeed("model", "Main landing gear wheel and brake assembly", "Generate a 3D model of a main landing gear wheel and brake assembly", null,
      { status: "generating", stage: "Adding materials", queue: [{ at: now + 5000, status: "finalizing", stage: "Preparing the preview" }, { at: now + 9000, status: "awaiting_review", stage: null }] }, now - 4 * 60e3),
  ];
}

const dsUnsaved = (s) => s.draft.steps.length > 0 && s.saved_revision !== s.draft_revision;
function DsSaveState({ session }) {
  if (session.status === "archived") return null;
  const label = session.saved_revision == null ? "Not saved as " + dsKindA(session.authoring_kind) + " yet"
    : dsUnsaved(session) ? "Unsaved changes" : "Up to date";
  const warn = session.saved_revision != null && dsUnsaved(session);
  return <span title={label} style={tx("labelRegular", warn ? "var(--accent4)" : "var(--onSurfaceVariant)", { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 })}>{label}</span>;
}

function DsSuggestion({ text, kind, onPick, disabled, compact }) {
  const [hover, setHover] = useState(false);
  const on = hover && !disabled;
  return (
    <button onClick={() => onPick(text)} disabled={disabled} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...tx("labelRegular", "var(--onSurface)"), flex: compact ? "0 1 auto" : "1 1 0", minWidth: 0, textAlign: "left", cursor: disabled ? "default" : "pointer",
        border: "1px solid " + (on ? "var(--primary)" : "var(--outlineVariant)"), borderRadius: "var(--smallBorderRadius)", padding: "var(--sizingXSmall) var(--sizingSmall)",
        opacity: disabled && compact ? 0.6 : 1, background: "var(--surface)", transition: `border-color 125ms ${EASE}`,
        display: "flex", flexDirection: "column", gap: "var(--sizingTiny)" }}>
      {kind && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--sizingTiny)", ...tx("overlineBold", "var(--onSurfaceVariant)", { textTransform: "uppercase" }) }}>
          <KlsIcon name={DS_OUT[kind].icon} size={14} />{DS_OUT[kind].label}
        </span>
      )}
      <span>{text}</span>
    </button>
  );
}

function DsDeleteDialog({ session, onCancel, onConfirm }) {
  return (
    <DsDialog title="Delete session?" titleId="ds-del-title" icon="trash" iconColor="var(--error)" width={440} onClose={onCancel}
      footer={<><MeButton onClick={onCancel}>Cancel</MeButton><MeButton tone="danger" onClick={onConfirm}>Delete session</MeButton></>}>
      <p style={{ margin: 0, ...tx("bodyRegular", "var(--onSurfaceVariant)") }}>
        “{session.title}” and its conversation will be deleted, and any work still running is canceled.
        {session.saved_revision != null ? " The Task you saved from it stays, along with any Library items." : " Library items it used stay in the Library."} This can’t be undone.
      </p>
    </DsDialog>
  );
}

function DsInlineTitle({ value, editing, onDone, style }) {
  const [v, setV] = useState(value);
  const ref = useRef(null);
  useEffect(() => { if (editing) { setV(value); setTimeout(() => ref.current && ref.current.select(), 0); } }, [editing]);
  if (!editing) return <span style={{ ...style, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>;
  const commit = () => onDone(v.trim() ? v.trim().slice(0, 255) : value);
  return (
    <input ref={ref} value={v} onChange={(e) => setV(e.target.value)} onClick={(e) => e.stopPropagation()}
      onBlur={commit} onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") onDone(value); }}
      style={{ ...DS_FIELD, ...style, padding: "var(--sizingTiny) var(--sizingXSmall)", minWidth: 0, flex: 1 }} />
  );
}

// ── Sessions list row ──
function dsOutputSummary(outs) {
  if (!outs.length) return null;
  if (outs.length === 1) return DS_OUT[outs[0].kind].label + " · " + DS_ACT[outs[0].status].label;
  const review = outs.filter((o) => o.status === "awaiting_review").length;
  const active = outs.filter((o) => DS_ACT[o.status].active).length;
  return outs.length + " outputs" + (review ? ` · ${review} ready for review` : active ? ` · ${active} in progress` : "");
}
function DsSessionRow({ s, first, renaming, onOpen, onRename, onRenameDone, onArchive, onDelete }) {
  const [hover, setHover] = useState(false);
  const steps = s.draft.steps.length;
  const outs = s.outputs || [];
  const assetOnly = outs.length > 0 && steps === 0;
  const anyActive = outs.some((o) => DS_ACT[o.status].active);
  return (
    <div onClick={() => !renaming && onOpen()} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "flex", alignItems: "center", gap: "var(--sizingSmall)", padding: "var(--sizingSmall)", margin: "0 calc(var(--sizingSmall) * -1)",
        borderTop: first ? "none" : "1px solid var(--outlineVariant)", borderRadius: "var(--smallBorderRadius)", cursor: "pointer",
        background: hover ? "var(--surfaceContainerLow)" : "transparent", transition: "background 125ms cubic-bezier(0.42, 0, 0.58, 1)" }}>
      <span style={{ width: 36, height: 36, borderRadius: "var(--smallBorderRadius)", background: "var(--tertiary)", flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
{assetOnly ? <KlsIcon name={DS_OUT[outs[outs.length - 1].kind].icon} size={18} color="var(--onSurfaceVariant)" />
          : <SparkleGlyph size={18} color={s.status === "archived" ? "var(--outline)" : "var(--onSurfaceVariant)"} />}
      </span>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <DsInlineTitle value={s.title} editing={renaming} onDone={onRenameDone}
          style={tx("bodySemiBold", s.status === "archived" ? "var(--onSurfaceVariant)" : "var(--onSurface)")} />
        <span style={tx("labelRegular", "var(--onSurfaceVariant)")}>
          {steps === 0 && !outs.length && "Nothing created yet"}
          {steps > 0 && <>{DS_KIND_LABEL[s.authoring_kind]} · {steps + (steps === 1 ? " step" : " steps")} · {s.saved_revision == null
            ? "Not saved" : dsUnsaved(s) ? <span style={{ color: "var(--accent4)" }}>Unsaved changes</span> : "Saved"}</>}
          {steps > 0 && outs.length > 0 && " · "}
          {outs.length > 0 && <span style={{ color: outs.some((o) => o.status === "awaiting_review") ? "var(--accent4)" : undefined }}>{dsOutputSummary(outs)}</span>}
          {anyActive && <KlsIcon name="refresh" size={11} color="var(--onSurfaceVariant)" spin style={{ marginLeft: "var(--sizingXSmall)", verticalAlign: "-2px" }} />}
        </span>
      </div>
      <DsStatusPill status={s.status} />
      <span style={{ ...tx("labelRegular", "var(--onSurfaceVariant)"), width: 84, textAlign: "right", flex: "none" }}>{dsAgo(s.updated_at)}</span>
      <DsMenuButton items={[
        { label: "Open", icon: "chevronRight", onClick: onOpen },
        s.status !== "archived" && { label: "Rename", icon: "pencil", onClick: onRename },
        s.status !== "archived" && { label: "Archive", icon: "stack", onClick: onArchive },
        "divider",
        { label: "Delete", icon: "trash", danger: true, onClick: onDelete },
      ]} />
    </div>
  );
}

// New session dialog → POST sessions/ { title? }
function DsNewSessionDialog({ onCancel, onCreate }) {
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const ref = useRef(null);
  useEffect(() => { setTimeout(() => ref.current && ref.current.focus(), 0); }, []);
  const create = () => {
    if (creating) return;
    setCreating(true);
    setTimeout(() => onCreate(name.trim().slice(0, 255)), 500);
  };
  return (
    <DsDialog title="New session" titleId="ds-new-title" icon="sparkle" onClose={onCancel}
      footer={<>
        <MeButton onClick={onCancel}>Cancel</MeButton>
        <MeButton tone="primary" onClick={create}>
          {creating && <KlsIcon name="refresh" size={16} spin />}
          {creating ? "Creating…" : "Create session"}
        </MeButton>
      </>}>
      <label style={{ display: "flex", flexDirection: "column", gap: "var(--sizingXSmall)" }}>
        <span style={tx("labelRegular", "var(--onSurfaceVariant)")}>Session name</span>
        <input ref={ref} value={name} maxLength={255} disabled={creating} onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") create(); }}
          placeholder="e.g. Nose gear torque link R&I" style={DS_INPUT} />
        <span style={tx("labelRegular", "var(--onSurfaceVariant)")}>Optional. Leave it blank and the session is named after the first thing you create. You can rename it later.</span>
      </label>
    </DsDialog>
  );
}

function DsLanding({ sessions, onStart, onOpen, onRename, onArchive, onDelete }) {
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState("all");
  const [renamingId, setRenamingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 900); };
  const start = () => setCreating(true);
  const count = (st) => sessions.filter((s) => st === "all" ? s.status !== "archived" : s.status === st).length;
  const tabs = [
    { key: "all", label: "Active · " + count("all") },
    { key: "archived", label: "Archived · " + count("archived") },
  ];
  const shown = sessions.filter((s) => filter === "all" ? s.status !== "archived" : s.status === filter).sort((a, b) => b.updated_at - a.updated_at);
  const noneAtAll = sessions.length === 0;
  const emptyCopy = { all: "No active sessions.", archived: "No archived sessions." }[filter];

  return (
    <div data-screen-label="Design Studio" style={{ display: "flex", flexDirection: "column", gap: "var(--sizingMed)", padding: "var(--sizingMed) var(--sizingLarge) var(--sizingXLarge)", animation: `mx-in 250ms ${EASE}` }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sizingTiny)" }}>
        <h1 style={{ margin: 0, ...tx("headingLargeBold") }}>Design Studio</h1>
        <span style={tx("labelRegular", "var(--onSurfaceVariant)")}>Create Tasks, 3D models, scenes and animations with the assistant from what’s in the Library. Review each result before it’s published or added to a Task.</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--sizingSmall)", flexWrap: "wrap" }}>
        <SegmentedTabs tabs={tabs} value={filter} onChange={setFilter} />
        <DsIconBtn icon="refresh" label="Refresh" onClick={refresh} spin={refreshing} />
        <div style={{ flex: 1 }} />
        <MeButton tone="primary" onClick={start}><PlusGlyph />New session</MeButton>
      </div>

      <div style={{ ...DS_CARD, gap: 0, padding: shown.length ? "var(--sizingXSmall) var(--sizingMed)" : "var(--sizingMed)" }}>
        {shown.length === 0 ? (
          <div style={{ padding: "var(--sizingXLarge) var(--sizingMed)", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sizingXSmall)" }}>
            <span style={DS_EMPTY_DISC}><SparkleGlyph size={26} color="var(--onSurfaceVariant)" /></span>
            <span style={tx("subtitleSemiBold")}>{noneAtAll ? "No sessions yet" : emptyCopy}</span>
            <span style={tx("labelRegular", "var(--onSurfaceVariant)", { maxWidth: 380 })}>
              {noneAtAll ? "Start a session to create a Task, a 3D model, a scene or an animation with the assistant." : "Try the other list, or start a new session."}
            </span>
            {noneAtAll && <MeButton tone="primary" onClick={start}><PlusGlyph />New session</MeButton>}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {shown.map((s, i) => (
              <DsSessionRow key={s.id} s={s} first={i === 0} renaming={renamingId === s.id}
                onOpen={() => onOpen(s.id)} onRename={() => setRenamingId(s.id)}
                onRenameDone={(t) => { setRenamingId(null); onRename(s.id, t); }}
                onArchive={() => onArchive(s.id)} onDelete={() => onDelete(s.id)} />
            ))}
          </div>
        )}
      </div>
      {creating && <DsNewSessionDialog onCancel={() => setCreating(false)} onCreate={(name) => { setCreating(false); onStart(name); }} />}
    </div>
  );
}

// Empty-session prompt: shown in the conversation until the first message is sent.
function DsSessionStart({ onPick }) {
  return (
    <div style={{ margin: "auto 0", display: "flex", flexDirection: "column", gap: "var(--sizingSmall)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sizingTiny)" }}>
        <span style={tx("titleBold", "var(--onSurface)", {  })}>What do you want to create?</span>
        <span style={tx("bodyRegular", "var(--onSurfaceVariant)", {  })}>Describe {dsKindA()}, a 3D model, a scene or an animation. The assistant works from what’s in the Library.</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "var(--sizingXSmall)" }}>
        {DS_SUGGESTIONS.map((t) => <DsSuggestion key={t.text} text={t.text} kind={t.kind} onPick={onPick} />)}
      </div>
    </div>
  );
}

// ── Workspace: conversation ──
// ── Library documents for a turn (mentioned_doc_ids) ──
// Files the assistant can read. Not uploads: these are existing Library items; chat uploads are a separate flow.
const DS_LIB_TREE = [
  { id: "dsf-manuals", kind: "folder", name: "Maintenance manuals", added: "2026-03-02",
    children: Object.entries(DS_DOCS).map(([id, d]) => ({ id, kind: d.icon === "filetypes/doc" ? "doc" : "pdf", name: d.name, bytes: 4200000 + id.length * 731000, type: d.icon === "filetypes/doc" ? "DOCX" : "PDF", added: "2026-03-02" })) },
  ...LIB_ITEMS,
];
const DS_LIB_FLAT = (() => {
  const out = {};
  const walk = (items) => items.forEach((i) => { if (i.kind === "folder") walk(i.children || []); else out[i.id] = i; });
  walk(DS_LIB_TREE);
  return out;
})();
function dsDoc(id) {
  if (DS_DOCS[id]) return DS_DOCS[id];
  const i = DS_LIB_FLAT[id];
  return i ? { name: i.name.replace(/\.(pdf|docx|txt)$/i, ""), icon: (LIB_KINDS[i.kind] || LIB_KINDS.pdf).icon } : null;
}

function DsPickRow({ item, depth, selected, open, onToggle, onOpen, hidden }) {
  const [hover, setHover] = useState(false);
  if (hidden) return null;
  const folder = item.kind === "folder";
  const kids = folder ? (item.children || []) : [];
  const allOn = folder && kids.length > 0 && kids.every((k) => selected.has(k.id));
  return (
    <div onClick={() => (folder ? onOpen(item.id) : onToggle(item.id))} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      role={folder ? "button" : "checkbox"} aria-checked={folder ? undefined : selected.has(item.id)} aria-label={item.name} tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); folder ? onOpen(item.id) : onToggle(item.id); } }}
      style={{ display: "flex", alignItems: "center", gap: "var(--sizingSmall)", minHeight: 44, padding: "0 var(--sizingSmall)", borderRadius: "var(--smallBorderRadius)", cursor: "pointer",
        background: hover ? "var(--surfaceContainerLow)" : "transparent" }}>
      {depth > 0 && <span style={{ width: 20, flex: "none" }} />}
      {folder
        ? <span style={{ width: 22, flex: "none", display: "inline-flex", justifyContent: "center" }}><KlsIcon name="chevronRight" size={14} color="var(--onSurfaceVariant)" rotate={open ? 90 : 0} style={{ transition: `transform 125ms ${EASE}` }} /></span>
        : <DsCheckbox checked={selected.has(item.id)} label={"Select " + item.name} />}
      <KlsIcon name={(LIB_KINDS[item.kind] || LIB_KINDS.pdf).icon} size={16} color="var(--onSurfaceVariant)" />
      <span style={{ flex: 1, minWidth: 0, ...tx(folder ? "bodySemiBold" : "bodyRegular", "var(--onSurface)", ELLIPSIS) }}>{item.name}</span>
      {folder && kids.length > 0 && (
        <button onClick={(e) => { e.stopPropagation(); kids.forEach((k) => (allOn ? selected.has(k.id) : !selected.has(k.id)) && onToggle(k.id)); }}
          style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, ...tx("captionSemiBold", "var(--primary)") }}>
          {allOn ? "Clear" : "Select all"}
        </button>
      )}
      <span style={{ width: 72, textAlign: "right", flex: "none", ...tx("captionRegular", "var(--onSurfaceVariant)") }}>
        {folder ? kids.length + (kids.length === 1 ? " file" : " files") : libSize(item.bytes || 0)}
      </span>
    </div>
  );
}

function DsLibraryPicker({ initial, onCancel, onAdd }) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(() => new Set(initial));
  const [open, setOpen] = useState(() => new Set(["dsf-manuals"]));
  const ref = useRef(null);
  useEffect(() => { setTimeout(() => ref.current && ref.current.focus(), 0); }, []);
  const toggle = (id) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleOpen = (id) => setOpen((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const term = q.trim().toLowerCase();
  const hit = (i) => !term || i.name.toLowerCase().includes(term);
  const rows = [];
  DS_LIB_TREE.forEach((item) => {
    if (item.kind === "folder") {
      const kids = (item.children || []).filter(hit);
      if (term && !kids.length) return;
      const isOpen = term ? true : open.has(item.id);
      rows.push(<DsPickRow key={item.id} item={item} depth={0} selected={selected} open={isOpen} onToggle={toggle} onOpen={toggleOpen} />);
      if (isOpen) kids.forEach((k) => rows.push(<DsPickRow key={k.id} item={k} depth={1} selected={selected} onToggle={toggle} />));
    } else if (hit(item)) rows.push(<DsPickRow key={item.id} item={item} depth={0} selected={selected} onToggle={toggle} />);
  });
  const n = selected.size;
  return (
    <DsDialog title="Add documents from the Library" titleId="ds-lib-title" icon="folder" width={640} onClose={onCancel}
      footer={<>
        <span style={{ flex: 1, ...tx("labelSemiBold", "var(--onSurfaceVariant)") }}>{n ? n + (n === 1 ? " document selected" : " documents selected") : "No documents selected"}</span>
        <MeButton onClick={onCancel}>Cancel</MeButton>
        <MeButton tone="primary" onClick={() => onAdd([...selected])}>{initial.length ? "Done" : "Add"}</MeButton>
      </>}>
      <span style={tx("labelRegular", "var(--onSurfaceVariant)")}>The assistant reads these when it writes steps and picks details. They stay in the Library; nothing is copied or changed.</span>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sizingSmall)", height: 40, flex: "none", boxSizing: "border-box", padding: "0 var(--sizingSmall)", borderRadius: "var(--smallBorderRadius)", border: "1px solid var(--outline)" }}>
        <KlsIcon name="search" size={16} color="var(--onSurfaceVariant)" />
        <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search files" aria-label="Search files"
          style={{ ...tx("bodyRegular", "var(--onSurface)"), flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent" }} />
      </div>
      <div style={{ minHeight: 160, maxHeight: 360, overflowY: "auto", border: "1px solid var(--outline)", borderRadius: "var(--smallBorderRadius)", padding: "var(--sizingTiny)" }}>
        {rows.length ? rows : <div style={{ padding: "var(--sizingLarge)", textAlign: "center", ...tx("labelRegular", "var(--onSurfaceVariant)") }}>No files match “{q}”.</div>}
      </div>
    </DsDialog>
  );
}

// File tags: 24 high, the same shape as a code tag.
const DS_DOC_TAG = { display: "inline-flex", alignItems: "center", gap: "var(--sizingTiny)", height: 24, maxWidth: 260, padding: "0 var(--sizingXSmall)",
  borderRadius: "var(--xSmallBorderRadius)", background: "var(--tertiary)", boxSizing: "border-box" };
function DsPendingDoc({ id, onRemove }) {
  const d = dsDoc(id);
  if (!d) return null;
  return (
    <span style={{ ...DS_DOC_TAG, ...tx("captionSemiBold", "var(--onSurface)") }}>
      <KlsIcon name={d.icon} size={14} color="var(--onSurfaceVariant)" />
      <span style={ELLIPSIS}>{d.name}</span>
      <button onClick={onRemove} aria-label={"Remove " + d.name} title="Remove"
        style={{ width: 20, height: 20, flex: "none", border: "none", background: "transparent", color: "var(--onSurfaceVariant)", cursor: "pointer", padding: 0,
          display: "inline-flex", alignItems: "center", justifyContent: "center" }}><KlsIcon name="close" size={12} /></button>
    </span>
  );
}

function DsDocChip({ id }) {
  const d = dsDoc(id);
  if (!d) return null;
  return (
    <span title={d.name} style={{ ...DS_DOC_TAG, ...tx("captionSemiBold", "var(--onSurface)") }}>
      <KlsIcon name={d.icon} size={14} color="var(--onSurfaceVariant)" />
      <span style={ELLIPSIS}>{d.name}</span>
    </span>
  );
}

function DsActionChip({ o, onClick }) {
  const [hover, setHover] = useState(false);
  if (!o) return null;
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "flex", alignItems: "center", gap: "var(--sizingSmall)", width: "100%", textAlign: "left", cursor: "pointer", color: "var(--onSurface)",
        padding: "var(--sizingXSmall) var(--sizingSmall)", borderRadius: "var(--smallBorderRadius)", border: "1px solid " + (hover ? "var(--primary)" : "var(--outlineVariant)"),
        background: "var(--surface)", transition: `border-color 125ms ${EASE}` }}>
      <KlsIcon name={DS_OUT[o.kind].icon} size={16} color="var(--onSurfaceVariant)" />
      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={tx("overlineBold", "var(--onSurfaceVariant)", { textTransform: "uppercase" })}>{DS_OUT[o.kind].label}{o.revision > 1 ? " · v" + o.revision : ""}</span>
        <span style={tx("labelSemiBold", "var(--onSurface)", ELLIPSIS)}>{o.name}</span>
      </span>
      <DsStatusTag status={o.status} />
      <KlsIcon name="chevronRight" size={14} color="var(--onSurfaceVariant)" />
    </button>
  );
}

function DsMessage({ m, readOnly, outputs = [], onShowOutput, onAnswer, onRetry }) {
  if (m.role === "user") {
    return (
      <div style={{ alignSelf: "flex-end", maxWidth: "85%", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "var(--sizingTiny)" }}>
        <div style={{ padding: "var(--sizingXSmall) var(--sizingSmall)", borderRadius: "var(--medBorderRadius)", borderBottomRightRadius: "var(--xSmallBorderRadius)",
          background: "var(--tertiary)", ...tx("bodyRegular", "var(--onSurface)", { whiteSpace: "pre-wrap" }) }}>{m.content}</div>
        {m.docs && m.docs.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: "var(--sizingTiny)" }}>{m.docs.map((id) => <DsDocChip key={id} id={id} />)}</div>
        )}
      </div>
    );
  }
  const streaming = m.status === "streaming";
  return (
    <div style={{ display: "flex", gap: "var(--sizingSmall)", alignItems: "flex-start", maxWidth: "92%" }}>
      <span style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--primaryContainer)", flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <SparkleGlyph size={14} color="var(--onPrimaryContainer)" />
      </span>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--sizingXSmall)", paddingTop: 2 }}>
        {streaming && m.activity && !m.content && (
          <span style={{ ...tx("labelRegular", "var(--onSurfaceVariant)"), display: "inline-flex", alignItems: "center", gap: "var(--sizingXSmall)" }}>
            {m.activity}
            <span style={{ display: "inline-flex", gap: 2 }}>{[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor", animation: `ds-pulse 1.2s ${i * 0.15}s infinite` }} />))}</span>
          </span>
        )}
        {m.content && <div style={tx("bodyRegular", "var(--onSurface)", { whiteSpace: "pre-wrap" })}>{m.content}{streaming && <span style={{ opacity: 0.5 }}>▍</span>}</div>}
        {m.status === "interrupted" && (
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sizingXSmall)", ...tx("labelRegular", "var(--onSurfaceVariant)") }}>
            <KlsIcon name="warning" size={14} color="var(--accent4)" />
            Stopped. This response wasn’t saved.
            {!readOnly && <button onClick={onRetry} style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", ...tx("labelSemiBold", "var(--primary)", { textDecoration: "underline" }) }}>Try again</button>}
          </div>
        )}
        {m.sources && m.sources.length > 0 && !streaming && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sizingTiny)" }}>{m.sources.map((id) => <DsDocChip key={id} id={id} />)}</div>
        )}
        {m.actions && !streaming && m.actions.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sizingTiny)" }}>
            {m.actions.map((id) => <DsActionChip key={id} o={outputs.find((o) => o.id === id)} onClick={() => onShowOutput(id)} />)}
          </div>
        )}
        {m.draftChanged && !streaming && (
          <span style={{ ...tx("captionSemiBold", "var(--onSurfaceVariant)"), display: "inline-flex", alignItems: "center", gap: "var(--sizingTiny)" }}>
            <KlsIcon name="pencil" size={12} />Draft updated
          </span>
        )}
        {m.question && m.status === "awaiting_user" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sizingXSmall)", padding: "var(--sizingSmall)", borderRadius: "var(--smallBorderRadius)", border: "1px solid var(--outlineVariant)" }}>
            <span style={DS_SECTION_LABEL}>{m.question.prompt}</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sizingXSmall)" }}>
              {m.question.options.map((o) => <DsSuggestion key={o} text={o} compact onPick={onAnswer} disabled={readOnly || !onAnswer} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DsComposer({ busy, disabled, onSend, onStop, seed, docs = [], onAddDocs, onRemoveDoc }) {
  const [text, setText] = useState("");
  const taRef = useRef(null);
  useEffect(() => { if (seed) { setText(seed.text); setTimeout(() => taRef.current && taRef.current.focus(), 0); } }, [seed]);
  const send = () => { if (!text.trim() || busy || disabled) return; onSend(text.trim()); setText(""); };
  const canSend = text.trim().length > 0 && !busy && !disabled;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sizingXSmall)", opacity: disabled ? 0.6 : 1 }}>
      {(onAddDocs || docs.length > 0) && (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--sizingTiny)" }}>
          {docs.map((id) => <DsPendingDoc key={id} id={id} onRemove={() => onRemoveDoc(id)} />)}
          {onAddDocs && <DsAddDocsBtn disabled={disabled || busy} onClick={onAddDocs} />}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--sizingXSmall)", padding: "var(--sizingXSmall)", borderRadius: "var(--medBorderRadius)",
        border: "1px solid var(--outline)", background: "var(--surface)" }}>
        <textarea ref={taRef} value={text} onChange={(e) => setText(e.target.value)} rows={1} disabled={disabled} aria-label="Message the assistant"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={disabled ? "This session is archived" : busy ? "Waiting for the assistant…" : "Ask for changes, or describe what to add"}
          style={{ flex: 1, resize: "none", minHeight: 36, maxHeight: 160, boxSizing: "border-box", border: "none", outline: "none", background: "transparent",
            padding: "var(--sizingXSmall)", ...tx("bodyRegular", "var(--onSurface)") }} />
        {busy ? (
          <DsIconBtn icon="stop" label="Stop response" onClick={onStop} />
        ) : (
          <button onClick={send} disabled={!canSend} aria-label="Send" title="Send"
            style={{ width: 36, height: 36, flex: "none", padding: 0, borderRadius: "var(--smallBorderRadius)", border: "none", cursor: canSend ? "pointer" : "default",
              background: canSend ? "var(--primary)" : "var(--tertiary)", color: canSend ? "var(--onPrimary)" : "var(--onSurfaceVariant)",
              display: "inline-flex", alignItems: "center", justifyContent: "center", transition: `background 125ms ${EASE}` }}>
            <KlsIcon name="up" size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

function DsAddDocsBtn({ disabled, onClick }) {
  return <MeButton small disabled={disabled} onClick={onClick} title="Add documents from the Library"><PlusGlyph size={14} />Add document</MeButton>;
}

// ── Workspace: draft editor ──
function DsAutoText({ value, style, minRows = 1, ...rest }) {
  const ref = useRef(null);
  useLayoutEffect(() => { const el = ref.current; if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + 2 + "px"; } }, [value]);
  return <textarea ref={ref} value={value} rows={minRows} {...rest} style={{ ...style, resize: "none", overflow: "hidden", flex: "none" }} />;
}

function DsStepCard({ step, index, total, readOnly, onChange, onMove, onRemove }) {
  const [showNotes, setShowNotes] = useState(!!step.notes);
  return (
    <div style={{ display: "flex", gap: "var(--sizingSmall)", padding: "var(--sizingSmall)", borderRadius: "var(--smallBorderRadius)",
      border: "1px solid var(--outlineVariant)", background: "var(--surface)" }}>
      <span style={{ width: 28, height: 28, borderRadius: "50%", flex: "none", background: "var(--tertiary)",
        display: "inline-flex", alignItems: "center", justifyContent: "center", ...tx("labelBold", "var(--onSurface)") }}>{index + 1}</span>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--sizingXSmall)" }}>
        <input value={step.title} readOnly={readOnly} onChange={(e) => onChange({ title: e.target.value })} placeholder="Step title" aria-label={"Step " + (index + 1) + " title"}
          style={{ ...DS_FIELD, ...TX.bodySemiBold, background: "transparent", border: "1px solid transparent", padding: "var(--sizingTiny) var(--sizingXSmall)" }}
          onFocus={(e) => { if (!readOnly) e.target.style.borderColor = "var(--outline)"; }} onBlur={(e) => { e.target.style.borderColor = "transparent"; }} />
        <DsAutoText value={step.instructions} readOnly={readOnly} minRows={2} aria-label={"Step " + (index + 1) + " instructions"}
          onChange={(e) => onChange({ instructions: e.target.value })} placeholder="Instructions"
          style={{ ...DS_FIELD, minHeight: 48, color: "var(--onSurfaceVariant)" }} />
        {showNotes && (
          <DsAutoText value={step.notes || ""} readOnly={readOnly} aria-label={"Step " + (index + 1) + " instructor note"}
            onChange={(e) => onChange({ notes: e.target.value || null })} placeholder="Instructor note"
            style={{ ...DS_FIELD, ...TX.labelRegular, minHeight: 36, background: "transparent", borderStyle: "dashed" }} />
        )}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--sizingTiny)" }}>
          {step.document_ids.map((id) => <DsDocChip key={id} id={id} />)}
          {!showNotes && !readOnly && (
            <button onClick={() => setShowNotes(true)} style={{ border: "none", background: "transparent", cursor: "pointer", padding: "0 var(--sizingTiny)", height: 24,
              ...tx("captionSemiBold", "var(--onSurfaceVariant)") }}>+ Add note</button>
          )}
        </div>
      </div>
      {!readOnly && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <DsIconBtn ghost icon="up" label="Move up" disabled={index === 0} onClick={() => onMove(-1)} />
          <DsIconBtn ghost icon="down" label="Move down" disabled={index === total - 1} onClick={() => onMove(1)} />
          <DsIconBtn ghost danger icon="trash" label="Remove step" onClick={onRemove} />
        </div>
      )}
    </div>
  );
}

function DsDraftEditor({ session, readOnly, busy, onDraft }) {
  const d = session.draft;
  const kind = DS_KIND_LABEL[session.authoring_kind];
  const setSteps = (steps) => onDraft({ ...d, steps });
  const update = (i, patch) => setSteps(d.steps.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const move = (i, dir) => { const s = d.steps.slice(); const [x] = s.splice(i, 1); s.splice(i + dir, 0, x); setSteps(s); };
  const addStep = () => setSteps([...d.steps, dsStep("", "")]);
  const empty = d.steps.length === 0 && !d.title;
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: 0, height: "100%" }}>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "var(--sizingMed)", display: "flex", flexDirection: "column", gap: "var(--sizingSmall)",
        opacity: busy ? 0.6 : 1, transition: "opacity 200ms cubic-bezier(0.42, 0, 0.58, 1)" }}>
        {empty ? (
          <div style={{ margin: "auto", textAlign: "center", maxWidth: 320, display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sizingXSmall)" }}>
            <span style={DS_EMPTY_DISC}>
              <KlsIcon name="itemList" size={24} color="var(--onSurfaceVariant)" />
            </span>
            <span style={tx("subtitleSemiBold", "var(--onSurface)")}>{busy ? "Working…" : "No " + kind + " draft"}</span>
            <span style={tx("bodyRegular", "var(--onSurfaceVariant)", {  })}>Ask the assistant for {dsKindA(session.authoring_kind)} and its steps fill in here, or write them yourself. Models, scenes and animations don’t need one.</span>
            {!readOnly && !busy && <div style={{ marginTop: "var(--sizingXSmall)" }}><MeButton onClick={addStep}><PlusGlyph />Add step</MeButton></div>}
          </div>
        ) : (
          <>
            <input value={d.title} readOnly={readOnly} onChange={(e) => onDraft({ ...d, title: e.target.value })} placeholder={kind + " title"}
              style={{ ...DS_FIELD, background: "transparent", border: "none", padding: 0, ...tx("titleBold", "var(--onSurface)", {  }) }} />
            <DsAutoText value={d.description} readOnly={readOnly} onChange={(e) => onDraft({ ...d, description: e.target.value })} placeholder="Description"
              style={{ ...DS_FIELD, background: "transparent", border: "none", padding: 0, resize: "none", color: "var(--onSurfaceVariant)" }} />
            <span style={{ ...DS_SECTION_LABEL, marginTop: "var(--sizingTiny)" }}>Steps · {d.steps.length}</span>
            {d.steps.map((s, i) => (
              <DsStepCard key={s.id} step={s} index={i} total={d.steps.length} readOnly={readOnly}
                onChange={(p) => update(i, p)} onMove={(dir) => move(i, dir)} onRemove={() => setSteps(d.steps.filter((_, j) => j !== i))} />
            ))}
            {!readOnly && (
              <button onClick={addStep} style={{ height: 40, borderRadius: "var(--smallBorderRadius)", border: "1px dashed var(--outlineVariant)", background: "transparent", cursor: "pointer",
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "var(--sizingXSmall)", ...tx("bodySemiBold", "var(--onSurfaceVariant)") }}>
                <PlusGlyph size={16} />Add step
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── 3D content tab: viewer + details ──
// Ready outputs render in the same three.js viewport the Library's Model Editor uses
// (real build: model / scene / animation version payloads from the Library endpoints).
// Nothing generated here is in the Library until the user saves it.
function dsPartsFor(o) {
  const t = ((o.model || "") + " " + o.name).toLowerCase();
  if (/gear|wheel|brake|torque|strut|tire|landing/.test(t)) return ME_PART_SETS.t2;
  if (/engine|compressor|propeller|turbine|fan|hub|blade/.test(t)) return ME_PART_SETS.t1;
  return ME_PART_SETS.default;
}
const DS_VIEWABLE = ["awaiting_review", "approved", "ready", "rejected"];
const dsBaseModel = (o) => (o.kind === "model" ? o.name : o.model);
const DS_ANIM_SECONDS = 6;

// Everything in the session built on the same model (plus the Library model itself when it wasn't generated here).
function dsConnected(o, outputs) {
  const base = dsBaseModel(o);
  if (!base) return [o];
  const list = outputs.filter((x) => dsBaseModel(x) === base);
  const hasModel = list.some((x) => x.kind === "model");
  const lib = hasModel ? [] : [{ id: "lib:" + base, kind: "model", name: base, status: "ready", revision: 1, libraryOnly: true, created_at: 0 }];
  const order = { model: 0, scene: 1, animation: 2 };
  return [...lib, ...list].sort((a, b) => order[a.kind] - order[b.kind] || a.created_at - b.created_at);
}

function DsViewer({ o, progress, onMetrics }) {
  const [resetKey, setResetKey] = useState(0);
  const viewable = DS_VIEWABLE.includes(o.status);
  const a = DS_ACT[o.status];
  const scene = React.useMemo(() => ({ ...meSeedScene({ id: o.id + ":" + o.revision, name: o.name }),
    camera: o.kind === "scene" ? { az: 0.55, el: 0.35, dist: 7.5 } : { az: 0.9, el: 0.5, dist: 9 } }), [o.id, o.revision, o.kind]);
  const sc = { ...scene, explode: o.kind === "animation" ? progress : o.kind === "scene" ? 0.25 : 0 };
  return (
    <div style={{ position: "relative", flex: 1, minHeight: 240, borderRadius: "var(--medBorderRadius)", overflow: "hidden", border: "1px solid var(--outlineVariant)",
      background: "var(--surfaceContainerLowest)" }}>
      {viewable ? (
        <div style={{ position: "absolute", inset: 0, opacity: o.status === "rejected" ? 0.45 : 1 }}>
          <MeViewport key={o.id + ":" + o.revision + ":" + DS_THEME} parts={dsPartsFor(o)} scene={sc} resetKey={resetKey} onMetrics={onMetrics}
            playing={o.kind === "model"} motion={o.kind === "model" ? "spin" : "explode"} />
        </div>
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "var(--sizingSmall)", padding: "var(--sizingLarge)", textAlign: "center" }}>
          <span style={DS_EMPTY_DISC}>
            <KlsIcon name={DS_OUT[o.kind].icon} size={28} color="var(--onSurfaceVariant)" />
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--sizingXSmall)", ...tx("bodySemiBold", a.tone === "error" ? "var(--error)" : "var(--onSurface)") }}>
            {a.active && <KlsIcon name="refresh" size={14} color="var(--onSurface)" spin />}
            {o.status === "waiting_for_model" ? "Waiting for the model" : a.active ? (o.stage || a.label) : a.label}
          </span>
          <span style={tx("labelRegular", "var(--onSurfaceVariant)", { maxWidth: 320,  })}>
            {a.active ? "The preview appears here when it’s ready. You can keep working or leave this page." : "There’s nothing to preview for this version."}
          </span>
        </div>
      )}
      <div style={{ position: "absolute", top: "var(--sizingSmall)", left: "var(--sizingSmall)", right: "var(--sizingSmall)", display: "flex", alignItems: "center", gap: "var(--sizingXSmall)" }}>
        <div style={{ flex: 1 }} />
        {!o.libraryOnly && <span style={{ ...tx("captionSemiBold", "var(--onSurfaceVariant)"), padding: "var(--sizingTiny) var(--sizingXSmall)", borderRadius: "var(--xSmallBorderRadius)", background: "var(--surface)" }}>v{o.revision}</span>}
      </div>
      {viewable && (
        <div style={{ position: "absolute", left: "var(--sizingSmall)", right: "var(--sizingSmall)", bottom: "var(--sizingSmall)", display: "flex", alignItems: "center", gap: "var(--sizingXSmall)" }}>
          <MeButton small surface onClick={() => setResetKey((k) => k + 1)}><KlsIcon name="refresh" size={14} />Reset view</MeButton>
          <div style={{ flex: 1 }} />
          <span style={{ ...tx("captionRegular", "var(--onSurfaceVariant)"), padding: "var(--sizingTiny) var(--sizingXSmall)", borderRadius: "var(--xSmallBorderRadius)", background: "var(--surface)" }}>Drag to orbit · scroll to zoom</span>
        </div>
      )}
    </div>
  );
}

// Animation playback (drives the viewer) — play/pause, scrub, time, speed, loop
// Same look as FloatingMenu, but opens upward (the playback bar sits at the bottom of the screen).
const DS_SPEEDS = [0.25, 0.5, 0.75, 1, 1.5, 2];
function DsSpeedSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  return (
    <>
      <span ref={ref} style={{ display: "inline-flex", flex: "none" }}>
        <MeButton small onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open} aria-label={"Playback speed " + value + "×"}>
          {value}×<KlsIcon name="chevronDown" size={12} color="var(--onSurfaceVariant)" rotate={open ? 180 : 0} />
        </MeButton>
      </span>
      {open && (
        <FloatingMenu anchorRef={ref} align="right" up width={148} onClose={() => setOpen(false)}>
          <span style={{ ...DS_SECTION_LABEL, padding: "var(--sizingXSmall) var(--sizingSmall) var(--sizingTiny)" }}>Speed</span>
          {DS_SPEEDS.map((s) => (
            <MenuItem key={s} selected={s === value} onClick={() => { setOpen(false); onChange(s); }}>{s === 1 ? "1× (normal)" : s + "×"}</MenuItem>
          ))}
        </FloatingMenu>
      )}
    </>
  );
}

function DsPlayback({ progress, setProgress, playing, setPlaying, disabled }) {
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  const raf = useRef(0);
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const step = (now) => {
      const dt = (now - last) / 1000; last = now;
      setProgress((p) => {
        let n = p + (dt * speed) / DS_ANIM_SECONDS;
        if (n >= 1) { if (loop) n = n % 1; else { n = 1; setPlaying(false); } }
        return n;
      });
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, speed, loop]);
  const fmt = (x) => "0:" + String(Math.floor(x * DS_ANIM_SECONDS)).padStart(2, "0");
  const toggle = () => { if (!playing && progress >= 1) setProgress(0); setPlaying(!playing); };
  const time = tx("captionSemiBold", "var(--onSurfaceVariant)", { fontVariantNumeric: "tabular-nums", width: 32 });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--sizingSmall)", opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? "none" : "auto" }}>
      <button onClick={toggle} aria-label={playing ? "Pause" : "Play"}
        style={{ width: 40, height: 40, flex: "none", padding: 0, borderRadius: "50%", border: "none", cursor: "pointer", background: "var(--primary)", color: "var(--onPrimary)",
          display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <KlsIcon name={playing ? "pause" : "play"} size={16} />
      </button>
      <span style={time}>{fmt(progress)}</span>
      <input type="range" min={0} max={1000} value={Math.round(progress * 1000)} aria-label="Scrub animation"
        onChange={(e) => { setPlaying(false); setProgress(+e.target.value / 1000); }}
        style={{ ...TX.bodyRegular, flex: 1, minWidth: 80, accentColor: "var(--primary)", cursor: "pointer" }} />
      <span style={{ ...time, textAlign: "right" }}>{fmt(1)}</span>
      <DsSpeedSelect value={speed} onChange={setSpeed} />
      <button onClick={() => setLoop((l) => !l)} aria-pressed={loop}
        style={{ ...tx(loop ? "labelBold" : "labelSemiBold", loop ? "var(--onPrimaryContainer)" : "var(--onSurface)"), height: 30, padding: "0 var(--sizingSmall)", borderRadius: 15, border: "none",
          cursor: "pointer", flex: "none", background: loop ? "var(--primaryContainer)" : "var(--tertiary)" }}>Loop</button>
    </div>
  );
}

function DsInfoGrid({ rows }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "var(--sizingSmall) var(--sizingMed)" }}>
      {rows.filter(Boolean).map(([k, v]) => (
        <div key={k} style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          <span style={tx("overlineBold", "var(--onSurfaceVariant)", { textTransform: "uppercase" })}>{k}</span>
          <span title={String(v)} style={tx("labelSemiBold", "var(--onSurface)", { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" })}>{v}</span>
        </div>
      ))}
    </div>
  );
}

// One place for every 3D item's actions: the 3D content tab header (right side).
function DsOutputActions({ o, readOnly, handlers }) {
  if (!o || o.libraryOnly || readOnly) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--sizingXSmall)", flex: "none" }}>
      {DS_ACT[o.status].active && o.status !== "finalizing" && <MeButton onClick={() => handlers.cancel(o.id)}>Cancel</MeButton>}
      {o.status === "awaiting_review" && <><MeButton onClick={() => handlers.discard(o.id)}>Discard</MeButton><MeButton tone="primary" onClick={() => handlers.save(o.id)}>Save to Library</MeButton></>}
      {o.status === "approved" && !o.attached && <MeButton tone="primary" onClick={() => handlers.place(o)}>Add to {dsKindA()}</MeButton>}
      {["failed", "timed_out", "canceled"].includes(o.status) && <MeButton onClick={() => handlers.retry(o.id)}>Try again</MeButton>}
    </div>
  );
}

function DsOutputDetails({ o, outputs, playback }) {
  const parts = dsPartsFor(o);
  const dep = o.waitFor && outputs.find((x) => x.id === o.waitFor);
  const muted = tx("labelRegular", "var(--onSurfaceVariant)", {  });
  const viewable = DS_VIEWABLE.includes(o.status);
  const lines = [
    o.kind === "animation" && viewable && <React.Fragment key="pb">{playback}</React.Fragment>,
    o.kind === "scene" && viewable && <DsInfoGrid key="info" rows={[["Camera", "Three-quarter view"], ["Parts shown", parts.length + " of " + parts.length], ["Lighting", "Studio"], ["Annotations", "None"]]} />,
    o.status === "waiting_for_model" && <span key="w" style={muted}>Starts when “{dep ? dep.name : "the model"}” is saved to the Library.</span>,
    o.attached && (
      <span key="at" style={{ display: "inline-flex", alignItems: "center", gap: "var(--sizingXSmall)", ...tx("labelSemiBold", "var(--onPrimaryContainer)") }}>
        <KlsIcon name="itemList" size={14} color="var(--onPrimaryContainer)" />Added to “{o.attached.target}”{o.attached.step ? " · " + o.attached.step : ""}
      </span>
    ),
    o.status === "rejected" && <span key="r" style={muted}>Discarded{o.approved_revision ? ` · v${o.approved_revision} is still in the Library` : ""}</span>,
    (o.status === "failed" || o.status === "timed_out") && <span key="f" style={tx("labelRegular", "var(--error)", {  })}>{o.error || "Generation didn’t finish. Nothing was saved."}</span>,
    o.status === "canceled" && <span key="c" style={muted}>{o.error || "Canceled. Nothing was saved."}</span>,
  ].filter(Boolean);
  if (!lines.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sizingSmall)", padding: "var(--sizingSmall) var(--sizingMed)", borderRadius: "var(--medBorderRadius)",
      border: "1px solid var(--outlineVariant)", background: "var(--surface)" }}>{lines}</div>
  );
}

function DsOutputsPanel({ outputs, readOnly, busy, selectedId, onSelect, handlers }) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const sorted = outputs.slice().sort((a, b) => b.created_at - a.created_at);
  const candidates = [...sorted, ...outputs.flatMap((x) => dsConnected(x, outputs)).filter((x) => x.libraryOnly)];
  const o = candidates.find((x) => x.id === selectedId) || sorted[0];
  useEffect(() => { setPlaying(false); setProgress(0); setMetrics(null); }, [o && o.id, o && o.revision]);
  if (!outputs.length) {
    return (
      <div style={{ margin: "auto", textAlign: "center", maxWidth: 340, display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sizingXSmall)" }}>
        <span style={DS_EMPTY_DISC}>
          <KlsIcon name="cube" size={24} color="var(--onSurfaceVariant)" />
        </span>
        <span style={tx("subtitleSemiBold", "var(--onSurface)")}>{busy ? "Working…" : "No 3D content yet"}</span>
        <span style={tx("bodyRegular", "var(--onSurfaceVariant)", {  })}>Ask the assistant to generate a 3D model, or to build a scene or animation from a model in the Library. Results open here in the viewer.</span>
      </div>
    );
  }
  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: "var(--sizingSmall)" }}>
      <DsViewer o={o} progress={progress} onMetrics={setMetrics} />
      <div style={{ flex: "none", maxHeight: "48%", overflowY: "auto" }}>
        <DsOutputDetails o={o} outputs={outputs}
          playback={<DsPlayback progress={progress} setProgress={setProgress} playing={playing} setPlaying={setPlaying} />} />
      </div>
    </div>
  );
}

// Saved output → Library › 3D Models › "Design Studio" (models; scenes/animations nest under their model)
function dsAddToLibrary(o) {
  const today = new Date().toISOString().slice(0, 10);
  let folder = LIB_MODELS.find((x) => x.id === "tf-ds");
  if (!folder) { folder = { id: "tf-ds", kind: "folder", name: "Design Studio", bytes: 0, type: "", added: today, children: [] }; LIB_MODELS.unshift(folder); }
  if (o.kind === "model") {
    const existing = folder.children.find((x) => x.id === "ds-" + o.id);
    if (existing) { existing.added = today; return; }
    folder.children.push({ id: "ds-" + o.id, kind: "model", name: o.name + ".glb", bytes: 14680064 + o.name.length * 262144, type: "GLB", added: today, children: [] });
    return;
  }
  const model = folder.children.find((x) => x.name === o.model + ".glb");
  if (!model) return; // built on a model that was already in the Library; the real API attaches it there
  model.children = model.children || [];
  if (!model.children.some((x) => x.id === "ds-" + o.id))
    model.children.push({ id: "ds-" + o.id, kind: o.kind, name: o.name, added: today, ...(o.kind === "animation" ? { duration: "0:06", steps: 4 } : {}) });
}

// Right-panel content picker (combo box): the Task draft, then every 3D item grouped by its model.
function dsAllGroups(outputs) {
  const sorted = outputs.slice().sort((a, b) => b.created_at - a.created_at);
  const keys = []; sorted.forEach((x) => { const k = dsBaseModel(x) || x.id; if (!keys.includes(k)) keys.push(k); });
  return keys.map((k) => {
    const first = sorted.find((x) => (dsBaseModel(x) || x.id) === k);
    return { key: k, label: dsBaseModel(first) || first.name, items: dsConnected(first, outputs) };
  });
}

function DsContentPicker({ session, outputs, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const kind = DS_KIND_LABEL[session.authoring_kind];
  const steps = session.draft.steps.length;
  const groups = dsAllGroups(outputs);
  const all = groups.flatMap((g) => g.items);
  const cur = value === "draft" ? null : all.find((x) => x.id === value);
  const icon = value === "draft" ? "itemList" : cur ? DS_OUT[cur.kind].icon : "cube";
  const small = value === "draft" ? kind : cur ? DS_OUT[cur.kind].label : "3D content";
  const name = value === "draft" ? (session.draft.title || kind + " draft") : cur ? cur.name : "Nothing yet";
  const pick = (v) => { setOpen(false); onChange(v); };
  const head = (t) => <span style={{ ...DS_SECTION_LABEL, padding: "var(--sizingXSmall) var(--sizingSmall) var(--sizingTiny)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t}</span>;
  return (
    <>
      <button ref={ref} onClick={() => setOpen((v) => !v)} aria-haspopup="listbox" aria-expanded={open} aria-label="Choose what to show"
        style={{ flex: "0 1 auto", minWidth: 0, maxWidth: 440, height: 40, display: "flex", alignItems: "center", gap: "var(--sizingXSmall)",
          padding: "0 var(--sizingSmall)", borderRadius: "var(--smallBorderRadius)", cursor: "pointer", boxSizing: "border-box",
          border: "1px solid var(--outline)", background: open ? "var(--surfaceContainerLow)" : "var(--surface)" }}>
        <KlsIcon name={icon} size={16} color="var(--onSurfaceVariant)" />
        <span style={tx("overlineBold", "var(--onSurfaceVariant)", { textTransform: "uppercase", whiteSpace: "nowrap" })}>{small}</span>
        <span style={tx("bodySemiBold", "var(--onSurface)", { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 })}>{name}</span>
        <KlsIcon name="chevronDown" size={12} color="var(--onSurfaceVariant)" rotate={open ? 180 : 0} />
      </button>
      {open && (
        <FloatingMenu anchorRef={ref} width={380} onClose={() => setOpen(false)}>
          <div role="listbox" style={{ maxHeight: 440, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {head(kind)}
            <MenuItem selected={value === "draft"} onClick={() => pick("draft")}>
              <KlsIcon name="itemList" size={16} color="var(--onSurfaceVariant)" />
              <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.draft.title || kind + " draft"}</span>
              <span style={tx("captionSemiBold", "var(--onSurfaceVariant)", { whiteSpace: "nowrap" })}>{steps ? steps + (steps === 1 ? " step" : " steps") : "Empty"}</span>
            </MenuItem>
            {groups.length === 0 && <>{head("3D content")}<span style={{ ...tx("labelRegular", "var(--onSurfaceVariant)"), padding: "var(--sizingXSmall) var(--sizingSmall)" }}>No models, scenes or animations yet</span></>}
            {groups.map((g) => (
              <React.Fragment key={g.key}>
                {head(g.label)}
                {g.items.map((x) => (
                  <MenuItem key={x.id} selected={x.id === value} onClick={() => pick(x.id)}>
                    <span style={{ width: x.kind === "model" ? 0 : 12, flex: "none" }} />
                    <KlsIcon name={DS_OUT[x.kind].icon} size={16} color="var(--onSurfaceVariant)" />
                    <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.name}</span>
                    {x.libraryOnly ? <span style={tx("captionSemiBold", "var(--onSurfaceVariant)")}>Library</span> : <DsStatusTag status={x.status} />}
                  </MenuItem>
                ))}
              </React.Fragment>
            ))}
          </div>
        </FloatingMenu>
      )}
    </>
  );
}

// Placement picker: a saved output → a Task you can edit (the whole Task, or one step)
function DsPlaceDialog({ output, targets, onCancel, onConfirm }) {
  const [ti, setTi] = useState(0);
  const [step, setStep] = useState("");
  const [saving, setSaving] = useState(false);
  const t = targets[ti];
  const confirm = () => { setSaving(true); setTimeout(() => onConfirm({ target: t.name, step: step || null }), 700); }; // attach_content
  const label = tx("labelRegular", "var(--onSurfaceVariant)");
  const select = { ...DS_INPUT, cursor: "pointer" };
  return (
    <DsDialog title="Add to a Task" titleId="ds-place-title" icon="itemList" onClose={onCancel}
      footer={<>
        <MeButton onClick={onCancel}>Cancel</MeButton>
        {targets.length > 0 && <MeButton tone="primary" onClick={confirm}>{saving ? "Adding…" : "Add"}</MeButton>}
      </>}>
      <span style={tx("labelRegular", "var(--onSurfaceVariant)")}>
        Adds v{output.approved_revision} of “{output.name}” to the Task you pick. Only Tasks you can edit are listed.
      </span>
      {targets.length === 0 ? (
        <span style={tx("bodyRegular", "var(--onSurface)")}>You don’t have any Tasks you can edit yet.</span>
      ) : <>
        <label style={{ display: "flex", flexDirection: "column", gap: "var(--sizingXSmall)" }}>
          <span style={label}>Task</span>
          <select value={ti} onChange={(e) => { setTi(+e.target.value); setStep(""); }} style={select}>
            {targets.map((x, i) => <option key={x.name} value={i}>{x.name}</option>)}
          </select>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: "var(--sizingXSmall)" }}>
          <span style={label}>Where</span>
          <select value={step} onChange={(e) => setStep(e.target.value)} style={select}>
            <option value="">Whole Task</option>
            {t.steps.map((st, i) => <option key={i} value={"Step " + (i + 1) + ": " + st}>Step {i + 1}: {st}</option>)}
          </select>
        </label>
      </>}
    </DsDialog>
  );
}

// ── Workspace ──
function DsWorkspace({ session, initialPrompt, targets, onBack, onUpdate, onRename, onArchive, onDelete }) {
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const outputs = session.outputs || [];
  const [panel, setPanel] = useState(outputs.length && !session.draft.steps.length ? "outputs" : "draft");
  const [highlight, setHighlight] = useState(null);
  const [selectedOut, setSelectedOut] = useState(null);
  const [placing, setPlacing] = useState(null);
  const [seed, setSeed] = useState(null);
  const [docs, setDocs] = useState([]);       // Library docs to send with the next message (mentioned_doc_ids)
  const [picking, setPicking] = useState(false);
  const timers = useRef([]);
  const live = useRef(null); // assistant message id currently streaming
  const scrollRef = useRef(null);
  const readOnly = session.status === "archived";
  const kind = DS_KIND_LABEL[session.authoring_kind];

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => () => clearTimers(), []);
  useEffect(() => { const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight; }, [session.messages.length, busy]);

  const patchMsg = (id, patch) => onUpdate((s) => ({ ...s, messages: s.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)) }));
  const patchOut = (id, fn) => onUpdate((s) => ({ ...s, updated_at: Date.now(), outputs: s.outputs.map((o) => (o.id === id ? fn(o) : o)) }));
  const showOutput = (id) => { setPanel("outputs"); setSelectedOut(id); setHighlight(id); setTimeout(() => setHighlight(null), 1600); };

  const runTurn = (text, withDocs = []) => {
    if (busy || readOnly) return;
    const latest = outputs.slice().sort((a, b) => b.created_at - a.created_at)[0];
    const plan = dsPlanTurn(session, text, withDocs, panel === "outputs" ? (selectedOut || (latest && latest.id)) : null);
    const aId = dsUid();
    live.current = aId;
    setBusy(true);
    onUpdate((s) => ({ ...s, updated_at: Date.now(), messages: [...s.messages,
      { id: dsUid(), role: "user", content: text, docs: withDocs.length ? withDocs : undefined },
      { id: aId, role: "assistant", content: "", status: "streaming", activity: plan.activities[0], sources: [] }] }));
    let t = 0;
    const at = (ms, fn) => { t += ms; timers.current.push(setTimeout(fn, t)); };
    plan.activities.slice(1).forEach((a) => at(800, () => patchMsg(aId, { activity: a })));
    const words = plan.reply.split(" ");
    at(800, () => {});
    words.forEach((_, i) => at(32, () => patchMsg(aId, { content: words.slice(0, i + 1).join(" ") })));
    at(150, () => {
      // Turn completed → POST sessions/{id}/messages/ with its typed actions (and draft + expected_revision when it changed).
      // Actions are proposals; status below comes from the action feed (GET actions/?after=…).
      const created = [];
      (plan.outputs || []).forEach((spec) => created.push(dsNewOutput(spec, spec.afterModel ? created[created.length - 1].id : null)));
      const actionIds = plan.revise ? [plan.revise.id] : created.map((o) => o.id);
      onUpdate((s) => ({
        ...s,
        updated_at: Date.now(),
        title: s.title === "New session" ? (plan.draft ? plan.draft.title : created.length ? created[created.length - 1].name : s.title) : s.title,
        ...(plan.draft ? { draft: plan.draft, draft_revision: s.draft_revision + 1 } : {}),
        outputs: plan.revise
          ? s.outputs.map((o) => (o.id === plan.revise.id ? dsRestart(o, { revision: o.revision + 1, prompt: plan.revise.prompt }) : o))
          : [...created, ...(s.outputs || [])],
        messages: s.messages.map((m) => m.id === aId ? { ...m, status: plan.question ? "awaiting_user" : "done", activity: null,
          sources: plan.sources, question: plan.question || null, draftChanged: !!plan.draft, actions: actionIds.length ? actionIds : undefined } : m),
      }));
      if (plan.draft) setPanel("draft");
      if (plan.question && plan.question.pending) setPanel("outputs");
      if (actionIds.length) showOutput(actionIds[actionIds.length - 1]);
      live.current = null; setBusy(false); timers.current = [];
    });
  };

  const stop = () => {
    // POST /design-studio/turn/cancel → the turn is not persisted
    clearTimers();
    if (live.current) patchMsg(live.current, { status: "interrupted", activity: null });
    live.current = null; setBusy(false);
  };

  const retry = (assistantId) => {
    const idx = session.messages.findIndex((m) => m.id === assistantId);
    const userMsg = session.messages[idx - 1];
    onUpdate((s) => ({ ...s, messages: s.messages.filter((_, i) => i !== idx && i !== idx - 1) }));
    setTimeout(() => runTurn(userMsg.content, userMsg.docs || []), 0);
  };

  useEffect(() => { if (initialPrompt) runTurn(initialPrompt); }, []);

  const outHandlers = {
    // Save to Library = review_content approve (publishes this version). Models also land in Library › 3D Models.
    save: (id) => patchOut(id, (o) => { const saved = { ...o, status: o.kind === "model" ? "ready" : "approved", approved_revision: o.revision }; dsAddToLibrary(saved); return saved; }),
    discard: (id) => patchOut(id, (o) => ({ ...o, status: "rejected" })),                                     // review_content: reject
    cancel: (id) => patchOut(id, (o) => ({ ...o, status: "canceled", stage: null, queue: [], error: null })),
    retry: (id) => patchOut(id, (o) => (o.waitFor ? { ...o, status: "waiting_for_model", error: null } : dsRestart(o, {}))),
    revise: (o, note) => runTurn(`Revise “${o.name}”: ${note}`),                                               // revise_content
    place: (o) => setPlacing(o),
    useModel: (o, k) => runTurn(`Create ${k === "scene" ? "a scene" : "an animation"} from the “${o.name}” model`),
  };

  const editDraft = (draft) => onUpdate((s) => ({ ...s, draft, draft_revision: s.draft_revision + 1, updated_at: Date.now() })); // PUT draft/ {expected_revision}
  const hasDraft = session.draft.steps.length > 0;
  const canSave = !readOnly && !busy && !saving && hasDraft && dsUnsaved(session);
  const save = () => {
    if (!canSave) return;
    setSaving(true);
    setTimeout(() => { // POST save/ {expected_revision}
      onUpdate((s) => ({ ...s, status: "saved", saved_revision: s.draft_revision, updated_at: Date.now() }));
      setSaving(false);
    }, 900);
  };
  const latestOut = outputs.slice().sort((a, b) => b.created_at - a.created_at)[0];
  const curOut = outputs.find((x) => x.id === selectedOut) || (selectedOut && selectedOut.startsWith("lib:") ? { libraryOnly: true } : latestOut);

  return (
    <div data-screen-label="Design Studio session" style={{ height: "calc(100vh - 60px)", minHeight: 560, minWidth: 0, display: "flex", flexDirection: "column", animation: `mx-in 250ms ${EASE}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sizingSmall)", padding: "var(--sizingSmall) var(--sizingLarge)", borderBottom: "1px solid var(--outlineVariant)" }}>
        <DsIconBtn icon="back" label="Back to Design Studio" onClick={onBack} />
        <div style={{ minWidth: 0, flex: 1, display: "flex", alignItems: "center", gap: "var(--sizingSmall)" }}>
          <DsInlineTitle value={session.title} editing={renaming} onDone={(t) => { setRenaming(false); onRename(t); }}
            style={tx("titleBold", "var(--onSurface)", {  maxWidth: 520 })} />
          <DsStatusPill status={session.status} />
        </div>
        {!readOnly && hasDraft && (
          <MeButton tone="primary" onClick={save} disabled={!canSave && !saving}>
            {saving && <KlsIcon name="refresh" size={16} spin />}
            {saving ? "Saving…" : session.saved_revision == null ? "Save Task" : "Update Task"}
          </MeButton>
        )}
        <DsMenuButton items={[
          !readOnly && { label: "Rename", icon: "pencil", onClick: () => setRenaming(true) },
          !readOnly && { label: "Archive", icon: "stack", onClick: onArchive },
          "divider",
          { label: "Delete", icon: "trash", danger: true, onClick: onDelete },
        ]} />
      </div>

      {readOnly && (
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sizingXSmall)", padding: "var(--sizingXSmall) var(--sizingLarge)",
          background: "var(--tertiary)", ...tx("labelRegular", "var(--onSurfaceVariant)") }}>
          <KlsIcon name="stack" size={14} color="var(--onSurfaceVariant)" />
          This session is archived and read-only. Anything saved or published from it stays in place.
        </div>
      )}

      <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "minmax(360px, 5fr) minmax(420px, 6fr)", gap: "var(--sizingMed)", padding: "var(--sizingMed) var(--sizingLarge)" }}>
        <div style={{ ...DS_CARD, padding: 0, gap: 0, minHeight: 0, overflow: "hidden" }}>
          <div style={DS_PANEL_HEAD}>
            <span style={DS_SECTION_LABEL}>Conversation</span>
          </div>
          <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "var(--sizingMed)", display: "flex", flexDirection: "column", gap: "var(--sizingMed)" }}>
            {session.messages.length === 0 && !readOnly && <DsSessionStart onPick={(t) => setSeed({ text: t })} />}
            {session.messages.map((m) => (
              <DsMessage key={m.id} m={m} readOnly={readOnly || busy} outputs={outputs} onShowOutput={showOutput}
                onAnswer={m === session.messages[session.messages.length - 1] ? (t) => (t.startsWith("Add documents from the Library") ? setPicking(true) : runTurn(t)) : null}
                onRetry={() => retry(m.id)} />
            ))}
          </div>
          <div style={{ padding: "var(--sizingSmall) var(--sizingMed) var(--sizingMed)" }}>
            <DsComposer busy={busy} disabled={readOnly} onStop={stop} seed={seed}
              onSend={(t) => { runTurn(t, docs); setDocs([]); }}
              docs={docs} onAddDocs={() => setPicking(true)} onRemoveDoc={(id) => setDocs((d) => d.filter((x) => x !== id))} />
          </div>
        </div>
        <div style={{ ...DS_CARD, padding: 0, gap: 0, minHeight: 0, overflow: "hidden" }}>
          <div style={{ ...DS_PANEL_HEAD, flexWrap: "wrap", gap: "var(--sizingXSmall) var(--sizingSmall)" }}>
            <DsContentPicker session={session} outputs={outputs}
              value={panel === "draft" ? "draft" : (selectedOut || (latestOut && latestOut.id) || "outputs")}
              onChange={(v) => { if (v === "draft") setPanel("draft"); else { setPanel("outputs"); setSelectedOut(v); } }} />
            <div style={{ flex: 1 }} />
            {panel === "draft" && hasDraft && <DsSaveState session={session} />}
            {panel === "outputs" && <DsOutputActions o={curOut} readOnly={readOnly || busy} handlers={outHandlers} />}
          </div>
          {panel === "draft" ? (
            <DsDraftEditor session={session} readOnly={readOnly || busy} busy={busy} onDraft={editDraft} />
          ) : (
            <div style={{ flex: 1, minHeight: 0, padding: "var(--sizingMed)", display: "flex", flexDirection: "column" }}>
              <DsOutputsPanel outputs={outputs} readOnly={readOnly} busy={busy} handlers={outHandlers}
                selectedId={selectedOut} onSelect={setSelectedOut} />
            </div>
          )}
        </div>
      </div>
      {picking && <DsLibraryPicker initial={docs} onCancel={() => setPicking(false)} onAdd={(ids) => { setDocs(ids); setPicking(false); }} />}
      {placing && (
        <DsPlaceDialog output={placing} targets={targets} onCancel={() => setPlacing(null)}
          onConfirm={(where) => { patchOut(placing.id, (o) => ({ ...o, attached: where })); setPlacing(null); }} />
      )}
    </div>
  );
}

// Background work: stands in for polling GET sessions/{id}/actions/?after=… (and model-generation runs).
function dsAdvanceOutputs(s, now) {
  if (!s.outputs || !s.outputs.length) return s;
  let changed = false;
  const outputs = s.outputs.map((o) => {
    let x = o;
    if (x.status === "waiting_for_model") {
      const dep = s.outputs.find((d) => d.id === x.waitFor);
      if (dep && dep.status === "ready") x = { ...x, model: dep.name, waitFor: null, status: "queued", queue: dsAbs(DS_TIMELINE[x.kind], now) };
      else if (dep && ["failed", "timed_out", "canceled", "rejected"].includes(dep.status)) x = { ...x, status: "canceled", error: "Canceled because the model it needed wasn’t saved." };
    }
    if (x.queue && x.queue.length && x.queue[0].at <= now) {
      const due = x.queue.filter((q) => q.at <= now); const last = due[due.length - 1];
      x = { ...x, status: last.status, stage: last.stage, queue: x.queue.filter((q) => q.at > now) };
    }
    if (x !== o) changed = true;
    return x;
  });
  return changed ? { ...s, outputs } : s;
}

// ── Router: landing ⇄ workspace ──
function DesignStudio({ theme }) {
  DS_THEME = theme || "light";
  const [sessions, setSessions] = useState(dsSeedSessions);
  const [openId, setOpenId] = useState(null);
  const [initialPrompt, setInitialPrompt] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const update = (id, fn) => setSessions((all) => all.map((s) => (s.id === id ? fn(s) : s)));
  const open = sessions.find((s) => s.id === openId);

  useEffect(() => {
    const iv = setInterval(() => {
      const now = Date.now();
      setSessions((all) => { let ch = false; const next = all.map((s) => { const n = dsAdvanceOutputs(s, now); if (n !== s) ch = true; return n; }); return ch ? next : all; });
    }, 500);
    return () => clearInterval(iv);
  }, []);

  // Editable Tasks for placement: saved ones from Studio plus existing ones in the workspace.
  const targets = [
    ...sessions.filter((s) => s.saved_revision != null && s.status !== "archived").map((s) => ({ name: s.draft.title, steps: s.draft.steps.map((x) => x.title) })),
    { name: "Landing gear servicing", steps: ["Prepare the aircraft", "Service the shock strut", "Check strut extension"] },
  ];

  const start = (name) => {
    const s = { id: dsUid(), title: name || "New session", status: "draft", authoring_kind: DS_KIND, draft: { title: "", description: "", steps: [] },
      draft_revision: 0, saved_revision: null, outputs: [], messages: [], updated_at: Date.now() };
    setSessions((all) => [s, ...all]);
    setInitialPrompt(null);
    setOpenId(s.id);
  };
  const rename = (id, title) => update(id, (s) => ({ ...s, title, updated_at: Date.now() }));
  const archive = (id) => update(id, (s) => ({ ...s, status: "archived", updated_at: Date.now(),
    outputs: (s.outputs || []).map((o) => (DS_ACT[o.status].active ? { ...o, status: "canceled", queue: [], error: "Canceled when the session was archived." } : o)) }));
  const confirmDelete = () => { setSessions((all) => all.filter((s) => s.id !== deleting.id)); if (openId === deleting.id) setOpenId(null); setDeleting(null); };

  return (
    <div className="ds-root" style={{ display: "contents" }}>
      <DsKeyframes />
      {open ? (
        <DsWorkspace key={open.id} session={open} initialPrompt={initialPrompt} targets={targets}
          onBack={() => {
            // A session nobody wrote in is discarded (DELETE sessions/{id}/) instead of cluttering the list.
            const untouched = open.title === "New session" && open.messages.length === 0 && open.draft.steps.length === 0 && !(open.outputs || []).length;
            if (untouched) setSessions((all) => all.filter((x) => x.id !== open.id));
            setOpenId(null); setInitialPrompt(null);
          }}
          onUpdate={(fn) => update(open.id, fn)} onRename={(t) => rename(open.id, t)}
          onArchive={() => archive(open.id)} onDelete={() => setDeleting(open)} />
      ) : (
        <DsLanding sessions={sessions} onStart={start} onOpen={(id) => { setInitialPrompt(null); setOpenId(id); }}
          onRename={rename} onArchive={archive} onDelete={(id) => setDeleting(sessions.find((s) => s.id === id))} />
      )}
      {deleting && <DsDeleteDialog session={deleting} onCancel={() => setDeleting(null)} onConfirm={confirmDelete} />}
    </div>
  );
}

const ME_SEED_EXTRAS = {
  t1s1: {
    annotations: [{ id: "a1", partId: "p4", text: "Stage 1 blades are the wear item — check leading edges." }],
  },
};

function meSeedScene(sc, modelId) {
  const extra = ME_SEED_EXTRAS[sc.id] || {};
  return {
    id: sc.id, name: sc.name,
    hidden: [], explode: 0, cutaway: false, wireframe: false,
    showAnnotations: true, isolate: false, isolateIds: [],
    bg: "var(--surfaceContainerLowest)", ambient: 0.5, directional: 0.75,
    camera: { az: 0.9, el: 0.5, dist: 9 },
    annotations: (extra.annotations || []).slice(),
  };
}
function MeViewport({ parts, scene: sc, playing, motion, onPickPart, selectedPart, selectedIds, onCamera, onMetrics, resetKey }) {
  const hostRef = useRef(null);
  // three.js is loaded by the page; wait for it if this mounts first.
  const [ready, setReady] = useState(() => !!window.THREE);
  useEffect(() => {
    if (ready) return;
    const iv = setInterval(() => { if (window.THREE) { setReady(true); clearInterval(iv); } }, 300);
    return () => clearInterval(iv);
  }, [ready]);
  const stateRef = useRef({});
  const scRef = useRef(sc);
  const playRef = useRef({ playing, motion });
  scRef.current = sc; playRef.current = { playing, motion };
  const partsRef = useRef(parts); partsRef.current = parts;
  const pickRef = useRef(onPickPart); pickRef.current = onPickPart;
  const selRef = useRef(selectedPart); selRef.current = selectedPart;
  const selIdsRef = useRef(selectedIds || []); selIdsRef.current = selectedIds || [];
  const camRef = useRef(onCamera); camRef.current = onCamera;
  const metricsRef = useRef(onMetrics); metricsRef.current = onMetrics;

  useEffect(() => {
    const THREE = window.THREE;
    const host = hostRef.current;
    if (!THREE || !host) return;
    // Every colour in the preview is a ColorScheme role or an accent, read from the page so it follows light and dark.
    const css = getComputedStyle(host);
    const role = (name) => new THREE.Color(css.getPropertyValue("--" + name).trim());
    const white = new THREE.Color(1, 1, 1), none = new THREE.Color(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.cursor = "grab";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const hemi = new THREE.HemisphereLight(white, role("outline"), 1.05); scene.add(hemi);
    const key = new THREE.DirectionalLight(white, 1.15); key.position.set(5, 8, 6); scene.add(key);
    const fill = new THREE.DirectionalLight(role("surfaceContainerHighest"), 0.45); fill.position.set(-6, -2, -4); scene.add(fill);
    const grid = new THREE.GridHelper(16, 16, role("outline"), role("outlineVariant"));
    grid.position.y = -2.4; scene.add(grid);

    const group = new THREE.Group(); scene.add(group);
    const meshes = {};
    const geomFor = (p) => {
      if (p.geom === "cone")   return new THREE.ConeGeometry(0.75, 1.4, 28);
      if (p.geom === "shell")  return new THREE.CylinderGeometry(1.5, 1.5, 3.4, 40, 1, true);
      if (p.geom === "shaft")  return new THREE.CylinderGeometry(0.28, 0.28, 4.4, 20);
      if (p.geom === "blades") return new THREE.TorusGeometry(1.05, 0.24, 12, 28);
      if (p.geom === "hub")    return new THREE.CylinderGeometry(0.7, 0.7, 0.5, 26);
      if (p.geom === "tire")   return new THREE.TorusGeometry(0.95, 0.34, 14, 30);
      if (p.geom === "arm")    return new THREE.BoxGeometry(1.6, 0.22, 0.22);
      return new THREE.BoxGeometry(0.9, 0.6, 0.9);
    };
    partsRef.current.forEach((p) => {
      const g = geomFor(p);
      const m = new THREE.MeshStandardMaterial({ color: role(p.role), roughness: 0.55, metalness: 0.35, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(g, m);
      if (p.geom === "cone") mesh.rotation.x = Math.PI / 2;
      if (p.geom === "shell" || p.geom === "shaft") mesh.rotation.x = Math.PI / 2;
      if (p.geom === "arm") mesh.rotation.z = Math.PI / 5;
      mesh.userData.part = p;
      mesh.userData.base = new THREE.Vector3(p.pos[0], p.pos[1], p.pos[2]);
      mesh.userData.dir = new THREE.Vector3(p.dir[0], p.dir[1], p.dir[2]).normalize();
      mesh.position.copy(mesh.userData.base);
      group.add(mesh); meshes[p.id] = mesh;
    });

    const pins = new THREE.Group(); scene.add(pins);

    // hand-rolled orbit (no OrbitControls in the UMD build)
    let drag = null;
    const cam = { ...scRef.current.camera };
    let fitDist = 9;
    const applyCam = () => {
      const d = cam.dist * (fitDist / 9);
      camera.position.set(
        d * Math.cos(cam.el) * Math.sin(cam.az),
        d * Math.sin(cam.el),
        d * Math.cos(cam.el) * Math.cos(cam.az));
      camera.lookAt(0, 0, 0);
    };
    const onDown = (e) => { drag = { x: e.clientX, y: e.clientY, moved: false }; renderer.domElement.style.cursor = "grabbing"; };
    const onMove = (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
      drag.x = e.clientX; drag.y = e.clientY;
      cam.az -= dx * 0.006;
      cam.el = Math.max(-1.35, Math.min(1.35, cam.el + dy * 0.006));
      applyCam();
    };
    const onUp = (e) => {
      if (!drag) return; // only respond to gestures that began on the canvas
      const wasDrag = drag.moved;
      drag = null; renderer.domElement.style.cursor = "grab";
      if (wasDrag) { camRef.current && camRef.current({ ...cam }); return; }
      const r = renderer.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      const ray = new THREE.Raycaster(); ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObjects(group.children.filter((m) => m.visible), false);
      pickRef.current && pickRef.current(hits.length ? hits[0].object.userData.part.id : null);
    };
    const onWheel = (e) => { e.preventDefault(); cam.dist = Math.max(4, Math.min(20, cam.dist + e.deltaY * 0.01)); applyCam(); camRef.current && camRef.current({ ...cam }); };
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight;
      renderer.setSize(w, h); camera.aspect = w / Math.max(1, h); camera.updateProjectionMatrix();
      fitDist = 9 * Math.max(1, 1.35 / Math.max(0.55, camera.aspect)); applyCam();
    };
    const ro = new ResizeObserver(resize); ro.observe(host); resize(); applyCam();

    let raf = 0, t0 = performance.now(), spin = 0, anim = 0, lastMetrics = "";
    const tick = () => {
      const now = performance.now(), dt = (now - t0) / 1000; t0 = now;
      const s = scRef.current, play = playRef.current;
      if (play.playing) {
        anim = Math.min(1, anim + dt / 3);
        if (play.motion === "spin") spin += dt * 1.6;
      } else { anim = 0; }
      hemi.intensity = 0.35 + (s.ambient == null ? 0.5 : s.ambient) * 1.6;
      key.intensity = 0.2 + (s.directional == null ? 0.75 : s.directional) * 1.8;
      const explodeAmt = play.playing && play.motion !== "spin" ? anim : s.explode;
      group.rotation.y = play.motion === "spin" ? spin : 0;
      Object.keys(meshes).forEach((id) => {
        const mesh = meshes[id];
        const iso = s.isolate ? (s.isolateIds && s.isolateIds.length ? s.isolateIds : (selRef.current ? [selRef.current] : null)) : null;
        const isolated = !!iso && iso.indexOf(id) < 0;
        const hidden = s.hidden.indexOf(id) >= 0 || isolated;
        mesh.visible = !hidden;
        mesh.position.copy(mesh.userData.base).addScaledVector(mesh.userData.dir, explodeAmt * 2.6);
        const isShell = mesh.userData.part.geom === "shell";
        mesh.material.wireframe = !!s.wireframe;
        mesh.material.transparent = s.cutaway && isShell;
        mesh.material.opacity = s.cutaway && isShell ? 0.18 : 1;
        const sel = selRef.current === id || selIdsRef.current.indexOf(id) >= 0;
        mesh.material.emissive = mesh.material.emissive || new THREE.Color(0, 0, 0);
        mesh.material.emissive.copy(sel ? role("primary") : none);
      });
      // measured dimensions of the current selection (or the whole model)
      const key2 = (selRef.current || selIdsRef.current.join("+") || "all") + "|" + s.hidden.join(",")
        + "|" + (s.isolate ? 1 : 0) + "|" + ((s.isolateIds || []).join(","));
      if (key2 !== lastMetrics) {
        lastMetrics = key2;
        const box = new THREE.Box3();
        const selIds = selRef.current ? [selRef.current] : selIdsRef.current;
        const picked = selIds.map((id) => meshes[id]).filter(Boolean);
        const target = picked.length ? picked : group.children.filter((m) => m.visible);
        target.forEach((m) => box.expandByObject(m));
        if (!box.isEmpty()) {
          const size = box.getSize(new THREE.Vector3());
          metricsRef.current && metricsRef.current({ w: size.x * 100, h: size.y * 100, d: size.z * 100 });
        }
      }
      // hotspot pins, anchored to their part
      while (pins.children.length) pins.remove(pins.children[0]);
      (s.showAnnotations === false ? [] : (s.annotations || [])).forEach((h) => {
        const anchor = meshes[h.partId];
        if (!anchor || !anchor.visible) return;
        const pin = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12),
          new THREE.MeshBasicMaterial({ color: role("accent1") }));
        pin.position.copy(anchor.position).add(new THREE.Vector3(0, 1.25, 0));
        pins.add(pin);
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    stateRef.current = { setCam: (c) => { cam.az = c.az; cam.el = c.el; cam.dist = c.dist; applyCam(); } };

    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [ready]);

  // external camera changes (loading a saved view / Reset View)
  useEffect(() => { stateRef.current.setCam && stateRef.current.setCam(sc.camera); }, [sc.id, sc.camera.az, sc.camera.el, sc.camera.dist, resetKey]);

  return (
    <div ref={hostRef} style={{ position: "absolute", inset: 0, background: sc.bg || "var(--surfaceContainerLowest)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {!ready && <span style={tx("labelRegular", "var(--onSurfaceVariant)")}>Loading the 3D preview…</span>}
    </div>
  );
}

window.DesignStudio = DesignStudio;
