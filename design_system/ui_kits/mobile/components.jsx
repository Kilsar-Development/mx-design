// components.jsx — shared mobile UI primitives, scoped under window.KLS
// All colors flow through token vars so light/dark switching is automatic.
const { useState } = React;

// ---- Icon ----
// Uses the shared KlsIcon component (imported via shared/kls-icon.jsx).
// Falls back to a small token-colored circle if the icon name is unknown.
function Icon({ name, size = 24, color = "currentColor", style = {} }) {
  // Map a few legacy heroicons-style names to the KLS icon names.
  const aliasMap = {
    "chevron-right": "chevronRight",
    "chevron-down": "chevronDown",
    "chevron-left": "chevronRight",   // we only have one chevron set; CSS rotates if needed
    "bars-3": "list",
    "funnel": "filter",
    "cog-6-tooth": "dots",
    "clipboard-document-list": "itemList",
    "archive-box": "archive",
    "lock-closed": "pin",
    "question-mark-circle": "info",
    "information-circle": "info",
    "microphone": "talk",
    "check-circle": "checkpoint",
    "squares-2x2": "modules",
    "sparkles": "orionOutline",
    "home": "modulesLarge",
  };
  const klsName = aliasMap[name] || name;
  if (typeof KlsIcon !== "undefined") {
    return <KlsIcon name={klsName} size={size} color={color === "currentColor" ? undefined : color} style={style} />;
  }
  // Fallback dot
  return <span style={{ display: "inline-block", width: size, height: size, borderRadius: 999, background: color === "currentColor" ? "var(--kls-on-surface)" : color, opacity: 0.4, ...style }} />;
}

// ---- Button ----
function Button({ children, variant = "primary", size = "lg", onClick, leadingIcon, trailingIcon, disabled }) {
  const sizes = {
    lg: { h: 48, fs: 16, px: "var(--kls-space-med)",   lh: 24 },
    md: { h: 40, fs: 14, px: "var(--kls-space-small)", lh: 20 },
    sm: { h: 32, fs: 13, px: "var(--kls-space-small)", lh: 18 },
  };
  const variants = {
    primary:     { bg: "var(--kls-primary)",            fg: "var(--kls-on-primary)" },
    secondary:   { bg: "var(--kls-secondary-container)", fg: "var(--kls-on-secondary-container)" },
    tertiary:    { bg: "var(--kls-surface)",             fg: "var(--kls-on-surface)", border: "1px solid var(--kls-outline)" },
    destructive: { bg: "var(--kls-error)",               fg: "var(--kls-on-error)" },
    link:        { bg: "transparent",                    fg: "var(--kls-on-surface)" },
  };
  const s = sizes[size]; const v = variants[variant];
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        height: s.h, padding: `0 ${s.px}`, fontSize: s.fs, lineHeight: `${s.lh}px`,
        fontWeight: 500, fontFamily: "Plus Jakarta Sans",
        background: disabled ? "var(--kls-surface-container-low)" : v.bg,
        color: disabled ? "var(--kls-content-disabled)" : v.fg,
        border: v.border || "none",
        borderRadius: 8,
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "var(--kls-space-xsmall)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 120ms",
      }}
    >
      {leadingIcon && <Icon name={leadingIcon} size={s.fs + 4} color={v.fg} />}
      {children}
      {trailingIcon && <Icon name={trailingIcon} size={s.fs + 4} color={v.fg} />}
    </button>
  );
}

// ---- Pill ----
function Pill({ children, variant = "grey", size = "md" }) {
  // All variants flow through accent / status containers so they re-tint in dark.
  const variants = {
    green:  { bg: "var(--kls-success-container)",  fg: "var(--kls-on-success-container)" },
    blue:   { bg: "var(--kls-info-container)",     fg: "var(--kls-on-info-container)" },
    red:    { bg: "var(--kls-error-container)",    fg: "var(--kls-on-error-container)" },
    amber:  { bg: "var(--kls-progress-container)", fg: "var(--kls-on-progress-container)" },
    violet: { bg: "var(--kls-accent-13)",          fg: "var(--kls-accent-12)" },
    grey:   { bg: "var(--kls-tertiary)",           fg: "var(--kls-on-surface-variant)" },
    dark:   { bg: "var(--kls-primary)",            fg: "var(--kls-on-primary)" },
  };
  const v = variants[variant];
  const sz = size === "sm"
    ? { h: 20, fs: 11, px: "var(--kls-space-xsmall)" }
    : { h: 24, fs: 12, px: "var(--kls-space-small)" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      height: sz.h, padding: `0 ${sz.px}`, borderRadius: 999,
      background: v.bg, color: v.fg, fontSize: sz.fs, fontWeight: 600,
      fontFamily: "Plus Jakarta Sans",
    }}>{children}</span>
  );
}

// ---- Avatar ----
function Avatar({ initials, size = 40, dark = false, dot = false }) {
  return (
    <div style={{
      position: "relative", flexShrink: 0,
      width: size, height: size, borderRadius: 999,
      background: dark ? "var(--kls-primary)" : "var(--kls-tertiary-container)",
      color: dark ? "var(--kls-on-primary)" : "var(--kls-on-surface-variant)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.36, fontFamily: "Plus Jakarta Sans",
    }}>
      {initials}
      {dot && <span style={{
        position: "absolute", right: -2, bottom: -2,
        width: size * 0.28, height: size * 0.28,
        borderRadius: 999, background: "var(--kls-success)",
        border: "2px solid var(--kls-surface)",
      }} />}
    </div>
  );
}

// ---- ListRow ----
function ListRow({ avatar, title, sub, badge, onClick, last }) {
  return (
    <div onClick={onClick} style={{
      display: "grid", gridTemplateColumns: "auto 1fr auto",
      gap: "var(--kls-space-small)", padding: "var(--kls-space-small) var(--kls-space-med)",
      borderBottom: last ? "none" : "1px solid var(--kls-outline-variant)",
      alignItems: "center", cursor: onClick ? "pointer" : "default",
    }}>
      {avatar}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--kls-space-tiny)", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-xsmall)"}}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--kls-on-surface)", fontFamily: "Plus Jakarta Sans" }}>{title}</span>
          {badge && <Pill variant="red" size="sm">{badge}</Pill>}
        </div>
        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)", fontFamily: "Plus Jakarta Sans", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub}</span>
      </div>
      <Icon name="chevron-right" size={18} color="var(--kls-content-quaternary)" />
    </div>
  );
}

// ---- Card ----
function Card({ children, padding = "var(--kls-space-med)", style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: "var(--kls-surface)", borderRadius: 16, overflow: "hidden",
      cursor: onClick ? "pointer" : "default", ...style,
    }}>{children}</div>
  );
}

// ---- ProgressBar ----
function ProgressBar({ value = 0.4 }) {
  return (
    <div style={{ height: 4, borderRadius: 2, background: "var(--kls-surface-container-low)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: `0 ${(1 - value) * 100}% 0 0`, background: "var(--kls-primary)" }} />
    </div>
  );
}

// ---- Input ----
function Input({ value, onChange, placeholder, label, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--kls-space-xsmall)"}}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: error ? "var(--kls-error)" : "var(--kls-on-surface)", fontFamily: "Plus Jakarta Sans" }}>{label}</label>}
      <input
        value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          background: focused || error ? "var(--kls-surface)" : "var(--kls-tertiary)",
          border: `1px solid ${error ? "var(--kls-error)" : focused ? "var(--kls-primary)" : "transparent"}`,
          borderRadius: 8, padding: "var(--kls-space-small) var(--kls-space-small)", outline: "none",
          fontSize: 14, fontWeight: 500, color: error ? "var(--kls-error)" : "var(--kls-on-surface)",
          fontFamily: "Plus Jakarta Sans",
        }}
      />
      {error && <span style={{ fontSize: 11, color: "var(--kls-error)" }}>{error}</span>}
    </div>
  );
}

// ---- TopBar ----
function TopBar({ title, leading, trailing }) {
  return (
    <div style={{
      height: 56, padding: "0 var(--kls-space-med)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "var(--kls-appbar-bg)",
      color: "var(--kls-appbar-fg)",
    }}>
      <div style={{ width: 40 }}>{leading}</div>
      <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "Plus Jakarta Sans" }}>{title}</div>
      <div style={{ width: 40, display: "flex", justifyContent: "flex-end" }}>{trailing}</div>
    </div>
  );
}

// ---- BottomNav ----
function BottomNav({ active, onChange, unread = 0 }) {
  const items = [
    { id: "home",          label: "Home",          icon: "home" },
    { id: "workspace",     label: "Workspace",     icon: "squares-2x2" },
    { id: "orion",         label: "Orion",         icon: "sparkles" },
    { id: "notifications", label: "Notifications", icon: "bell", badge: unread },
  ];
  return (
    <div style={{
      background: "var(--kls-surface)",
      borderTop: "1px solid var(--kls-tertiary)",
    }}>
      <div style={{ height: 4 }} />
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        padding: "0 0 var(--kls-space-xsmall)",
      }}>
        {items.map(it => {
          const isActive = active === it.id;
          const iconColor = isActive ? "var(--kls-on-surface)" : "var(--kls-on-surface-variant)";
          return (
            <button key={it.id} onClick={() => onChange(it.id)} style={{
              background: "transparent", border: "none", padding: "var(--kls-space-xsmall) 0",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--kls-space-tiny)", cursor: "pointer",
              fontFamily: "var(--kls-font-sans)",
            }}>
              <span style={{ position: "relative", display: "inline-flex" }}>
                <Icon name={it.icon} size={32} color={iconColor} />
                {it.badge > 0 && (
                  <span style={{
                    position: "absolute", top: -2, right: -6,
                    minWidth: 16, height: 16, padding: "0 var(--kls-space-tiny)",
                    background: "var(--kls-error)", color: "var(--kls-on-error)",
                    borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--kls-font-sans)", fontSize: 10, fontWeight: 600, lineHeight: 1,
                  }}>{it.badge}</span>
                )}
              </span>
              <span style={{
                fontSize: 12, fontWeight: 500, color: iconColor,
              }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

window.KLS = { Icon, Button, Pill, Avatar, ListRow, Card, ProgressBar, Input, TopBar, BottomNav };
