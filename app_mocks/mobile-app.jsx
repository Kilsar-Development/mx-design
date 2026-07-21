// AUTO-ASSEMBLED unified mobile app (iOS frame + bottom nav + Home/Help + Workspace/Team).
// Mounted by "Mobile App.dc.html" via <x-import component-from-global-scope="MobileApp">.
const { useState, useEffect, useRef } = React;
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports (to window): IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard
//
// Usage — wrap your screen content in <IOSDevice> to get the bezel, status bar
// and home indicator (props: title, dark, keyboard):
//
//   <IOSDevice title="Settings">
//     ...your screen content...
//   </IOSDevice>
//   <IOSDevice dark title="Search" keyboard>…</IOSDevice>
/* END USAGE */

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({ dark = false, time = '9:41' }) {
  const c = dark ? '#fff' : '#000';
  return (
    <div style={{
      display: 'flex', gap: 154, alignItems: 'center', justifyContent: 'center',
      padding: '21px 24px 19px', boxSizing: 'border-box',
      position: 'relative', zIndex: 20, width: '100%',
    }}>
      <div style={{ flex: 1, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 1.5 }}>
        <span style={{
          fontFamily: '-apple-system, "SF Pro", system-ui', fontWeight: 590,
          fontSize: 17, lineHeight: '22px', color: c,
        }}>{time}</span>
      </div>
      <div style={{ flex: 1, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, paddingTop: 1, paddingRight: 1 }}>
        <svg width="19" height="12" viewBox="0 0 19 12">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={c}/>
          <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={c}/>
          <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={c}/>
          <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={c}/>
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12">
          <path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill={c}/>
          <path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill={c}/>
          <circle cx="8.5" cy="10.5" r="1.5" fill={c}/>
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={c} strokeOpacity="0.35" fill="none"/>
          <rect x="2" y="2" width="20" height="9" rx="2" fill={c}/>
          <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill={c} fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({ children, dark = false, style = {} }) {
  return (
    <div style={{
      height: 44, minWidth: 44, borderRadius: 9999,
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: dark
        ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)'
        : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style,
    }}>
      {/* blur + tint */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 9999,
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)',
      }} />
      {/* shine */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 9999,
        boxShadow: dark
          ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)'
          : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
        border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', padding: '0 4px' }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({ title = 'Title', dark = false, trailingIcon = true }) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = (content) => (
    <IOSGlassPill dark={dark}>
      <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {content}
      </div>
    </IOSGlassPill>
  );
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 10,
      paddingTop: 62, paddingBottom: 10, position: 'relative', zIndex: 5,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px',
      }}>
        {/* back chevron */}
        {pillIcon(
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none" style={{ marginLeft: -1 }}>
            <path d="M10 2L2 10l8 8" stroke={muted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {/* trailing ellipsis */}
        {trailingIcon && pillIcon(
          <svg width="22" height="6" viewBox="0 0 22 6">
            <circle cx="3" cy="3" r="2.5" fill={muted}/>
            <circle cx="11" cy="3" r="2.5" fill={muted}/>
            <circle cx="19" cy="3" r="2.5" fill={muted}/>
          </svg>
        )}
      </div>
      {/* large title */}
      <div style={{
        padding: '0 16px',
        fontFamily: '-apple-system, system-ui',
        fontSize: 34, fontWeight: 700, lineHeight: '41px',
        color: text, letterSpacing: 0.4,
      }}>{title}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({ title, detail, icon, chevron = true, isLast = false, dark = false }) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', minHeight: 52,
      padding: '0 16px', position: 'relative',
      fontFamily: '-apple-system, system-ui', fontSize: 17,
      letterSpacing: -0.43,
    }}>
      {icon && (
        <div style={{
          width: 30, height: 30, borderRadius: 7, background: icon,
          marginRight: 12, flexShrink: 0,
        }} />
      )}
      <div style={{ flex: 1, color: text }}>{title}</div>
      {detail && <span style={{ color: sec, marginRight: 6 }}>{detail}</span>}
      {chevron && (
        <svg width="8" height="14" viewBox="0 0 8 14" style={{ flexShrink: 0 }}>
          <path d="M1 1l6 6-6 6" stroke={ter} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {!isLast && (
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          left: icon ? 58 : 16, height: 0.5, background: sep,
        }} />
      )}
    </div>
  );
}

function IOSList({ header, children, dark = false }) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return (
    <div>
      {header && (
        <div style={{
          fontFamily: '-apple-system, system-ui', fontSize: 13,
          color: hc, textTransform: 'uppercase',
          padding: '8px 36px 6px', letterSpacing: -0.08,
        }}>{header}</div>
      )}
      <div style={{
        background: bg, borderRadius: 26,
        margin: '0 16px', overflow: 'hidden',
      }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children, width = 402, height = 874, dark = false,
  title, keyboard = false,
}) {
  return (
    <div style={{
      width, height, borderRadius: 48, overflow: 'hidden',
      position: 'relative', background: dark ? '#000' : 'var(--kls-surface-variant)',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: '-apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased',
    }}>
      {/* dynamic island */}
      <div style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50,
      }} />
      {/* status bar (absolute) */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <IOSStatusBar dark={dark} />
      </div>
      {/* nav + content */}
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {title !== undefined && <IOSNavBar title={title} dark={dark} />}
        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
        {keyboard && <IOSKeyboard dark={dark} />}
      </div>
      {/* home indicator — always on top */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
        height: 34, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
        paddingBottom: 8, pointerEvents: 'none',
      }}>
        <div style={{
          width: 139, height: 5, borderRadius: 100,
          background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)',
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({ dark = false }) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: <svg width="19" height="17" viewBox="0 0 19 17"><path d="M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z" fill={glyph}/></svg>,
    del: <svg width="23" height="17" viewBox="0 0 23 17"><path d="M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z" fill="none" stroke={glyph} strokeWidth="1.6" strokeLinejoin="round"/><path d="M10 5l7 7M17 5l-7 7" stroke={glyph} strokeWidth="1.6" strokeLinecap="round"/></svg>,
    ret: <svg width="20" height="14" viewBox="0 0 20 14"><path d="M18 1v6H4m0 0l4-4M4 7l4 4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  };

  const key = (content, { w, flex, ret, fs = 25, k } = {}) => (
    <div key={k} style={{
      height: 42, borderRadius: 8.5,
      flex: flex ? 1 : undefined, width: w, minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs, fontWeight: 458, color: ret ? '#fff' : glyph,
    }}>{content}</div>
  );

  const row = (keys, pad = 0) => (
    <div style={{ display: 'flex', gap: 6.5, justifyContent: 'center', padding: `0 ${pad}px` }}>
      {keys.map(l => key(l, { flex: true, k: l }))}
    </div>
  );

  return (
    <div style={{
      position: 'relative', zIndex: 15, borderRadius: 27, overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      boxShadow: dark
        ? '0 -2px 20px rgba(0,0,0,0.09)'
        : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)',
    }}>
      {/* liquid glass bg — same recipe as nav pills */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 27,
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 27,
        boxShadow: dark
          ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)'
          : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
        border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
        pointerEvents: 'none',
      }} />

      {/* autocorrect bar */}
      <div style={{
        display: 'flex', gap: 20, alignItems: 'center',
        padding: '8px 22px 13px', width: '100%', boxSizing: 'border-box',
        position: 'relative',
      }}>
        {['"The"', 'the', 'to'].map((w, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ width: 1, height: 25, background: '#ccc', opacity: 0.3 }} />}
            <div style={{
              flex: 1, textAlign: 'center',
              fontFamily: '-apple-system, system-ui', fontSize: 17,
              color: sugg, letterSpacing: -0.43, lineHeight: '22px',
            }}>{w}</div>
          </React.Fragment>
        ))}
      </div>

      {/* key layout */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 13,
        padding: '0 6.5px', width: '100%', boxSizing: 'border-box',
        position: 'relative',
      }}>
        {row(['q','w','e','r','t','y','u','i','o','p'])}
        {row(['a','s','d','f','g','h','j','k','l'], 20)}
        <div style={{ display: 'flex', gap: 14.25, alignItems: 'center' }}>
          {key(icons.shift, { w: 45, k: 'shift' })}
          <div style={{ display: 'flex', gap: 6.5, flex: 1 }}>
            {['z','x','c','v','b','n','m'].map(l => key(l, { flex: true, k: l }))}
          </div>
          {key(icons.del, { w: 45, k: 'del' })}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {key('ABC', { w: 92.25, fs: 18, k: 'abc' })}
          {key('', { flex: true, k: 'space' })}
          {key(icons.ret, { w: 92.25, ret: true, k: 'ret' })}
        </div>
      </div>

      {/* bottom spacer (emoji+mic area, icons omitted) */}
      <div style={{ height: 56, width: '100%', position: 'relative' }} />
    </div>
  );
}

Object.assign(window, {
  IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard,
});

// kls-icon.jsx — Single shared icon component for all Kilsar PNG icons.
// Uses CSS mask trick so token-color recoloring works on any glyph.
//
// Usage:
//   <KlsIcon name="bell" size={24} color="var(--kls-on-surface)" />
//   <KlsIcon name="tabs/home" size={32} color="var(--kls-on-surface)" />
//   <KlsIcon path="../../assets/icons/tabs/home.png" size={32} />     // explicit path
//
// `name` resolves to the project root: assets/icons/<name>.png
// `path` overrides with a literal URL (for nested calls / overrides)
//
// `rotate` accepts 0/90/180/270 — handy because we only ship chevronDown
// and chevronRight in the asset set.

const KLS_ICON_BASE = (typeof window !== "undefined" && window.KLS_ICON_BASE) || "/assets/icons";

function KlsIcon({ name, path, size = 24, color = "currentColor", rotate = 0, style = {} }) {
  const url = path || `${KLS_ICON_BASE}/${name}.png`;
  const transform = rotate ? `rotate(${rotate}deg)` : undefined;
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMask: `url("${url}") center/contain no-repeat`,
        mask: `url("${url}") center/contain no-repeat`,
        transform,
        flex: "none",
        ...style,
      }}
    />
  );
}

// also expose plain-image variant (when you need the original colored PNG, not a mask)
function KlsImage({ name, path, size, width, height, alt = "", style = {} }) {
  const url = path || `${KLS_ICON_BASE}/${name}.png`;
  return (
    <img
      src={url}
      alt={alt}
      style={{
        width: width || size,
        height: height || size,
        flex: "none",
        ...style,
      }}
    />
  );
}

// components.jsx — shared mobile UI primitives, scoped under window.KLS
// All colors flow through token vars so light/dark switching is automatic.


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
    { id: "home",          label: "Home" },
    { id: "workspace",     label: "Workspace" },
    { id: "orion",         label: "Orion" },
    { id: "notifications", label: "Notifications", badge: unread },
  ];
  // Inline SVG for every nav icon — no external PNG / mask / KlsIcon dependency, so it can never fall back to a blank dot.
  const renderIcon = (id, color) => {
    const svg = (children) => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ flex: "none", display: "block" }} aria-hidden="true">{children}</svg>
    );
    if (id === "home") {
      return svg(<>
        <path d="M4.2 10.6 L11.1 4.5a1.4 1.4 0 0 1 1.8 0L19.8 10.6a1.4 1.4 0 0 1 .5 1.05V18.6a2 2 0 0 1-2 2H5.7a2 2 0 0 1-2-2v-6.95a1.4 1.4 0 0 1 .5-1.05Z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
        <circle cx="9" cy="14.2" r="1.05" fill={color} />
        <circle cx="12" cy="14.2" r="1.05" fill={color} />
        <circle cx="15" cy="14.2" r="1.05" fill={color} />
      </>);
    }
    if (id === "workspace") {
      return svg(<>
        <rect x="9.25" y="3" width="5.5" height="4.5" rx="1.3" fill={color} />
        <rect x="2" y="16.5" width="5.5" height="4.5" rx="1.3" fill={color} />
        <rect x="9.25" y="16.5" width="5.5" height="4.5" rx="1.3" fill={color} />
        <rect x="16.5" y="16.5" width="5.5" height="4.5" rx="1.3" fill={color} />
        <path d="M12 7.5v3.25M4.75 16.5v-3.25h14.5v3.25M12 12.75v3.75" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </>);
    }
    if (id === "orion") {
      return svg(<>
        <path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M12 8a4 4 0 1 0 4 4" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M12 3.5v4.5M16 12h4.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      </>);
    }
    // notifications — bell
    return svg(<>
      <path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.1 1.5a.6 .6 0 0 1-.5 .95H5.9a.6 .6 0 0 1-.5-.95Z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9.8 19.4a2.4 2.4 0 0 0 4.4 0" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 3.2v1.6" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </>);
  };
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
                {renderIcon(it.id, iconColor)}
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

/* mobile-app.jsx — AIM mobile (light), exploring where Help & Feedback lives.
   Two candidate entry points wired to one shared Feedback bottom sheet:
     • a help (?) button next to the top profile avatar
     • a "Help & Feedback" row inside the Your Profile sheet
   Use the Tweaks panel to compare placements. */




const FEEDBACK_FORM_URL = "https://forms.kilsar.io/aim-feedback";



/* ── brand + glyphs ───────────────────────────────────────────────────────── */
function AimLogoMobile({ scale = 1 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 * scale }}>
      <svg width={64 * scale} height={42 * scale} viewBox="0 0 64 42" fill="none" aria-label="AIM">
        <text x="0" y="30" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="27" fontWeight="800" letterSpacing="-1" fill="#2E5CC7">AIM</text>
        <path d="M2 37 C 20 30, 46 30, 62 35" stroke="#F5A623" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        <path d="M40 33 l18 1.5 -16 4 z" fill="#F5A623" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        {["Aviation", "Institute of", "Maintenance"].map((l) => (
          <span key={l} style={{ fontFamily: "var(--kls-font-sans)", fontSize: 9 * scale, fontWeight: 600, color: "#2E5CC7" }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function HelpGlyph({ size = 24, color = "currentColor", strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flex: "none", display: "block" }} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
      <path d="M9.3 9.2a2.7 2.7 0 1 1 3.6 2.55c-.62.25-1.05.82-1.05 1.5v.55" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
      <circle cx="11.85" cy="16.5" r="1.05" fill={color} />
    </svg>
  );
}

const AVATAR = "assets/images/placeholderImage.jpg";
function HFAvatar({ size = 52 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flex: "none",
      background: "var(--kls-tertiary-container)" }}>
      <img src={AVATAR} alt="Joel Frank" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}

/* ── home screen ──────────────────────────────────────────────────────────── */
// Pill — DS spec: pad tiny/small · radius small · labelMediumMedium (12/500) · caller supplies bg+fg
function StatusPill({ label, color, bg }) {
  return (
    <span style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", padding: "var(--kls-space-tiny) var(--kls-space-small)",
      borderRadius: "var(--kls-radius-small)", background: bg, color,
      fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500 }}>{label}</span>
  );
}

// StatChip — DS spec: filled tertiary · radius small · 16px icon + label · on-surface-variant
function MetaChip({ icon, children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--kls-space-xsmall)", height: 28, padding: "0 var(--kls-space-small)",
      borderRadius: "var(--kls-radius-small)", background: "var(--kls-tertiary)",
      fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)" }}>
      {icon}{children}
    </span>
  );
}

function SectionHead({ title, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <h2 style={{ margin: 0, display: "flex", alignItems: "baseline", gap: "var(--kls-space-xsmall)", fontFamily: "var(--kls-font-sans)", fontSize: 20, fontWeight: 600, color: "var(--kls-on-surface)" }}>
        {title}
        {count != null && <span style={{ fontSize: 14, fontWeight: 600, color: "var(--kls-on-surface-variant)" }}>{count}</span>}
      </h2>
      <button style={{ border: "none", background: "transparent", cursor: "pointer", padding: "var(--kls-space-tiny) 0",
        fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600, color: "var(--kls-primary)" }}>See all</button>
    </div>
  );
}

function HomeProgress({ pct }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--kls-space-xsmall)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, color: "var(--kls-on-surface-variant)" }}>
        <span>Progress</span><span>{pct}%</span>
      </div>
      <div style={{ height: 6, borderRadius: "var(--kls-radius-pill)", background: "var(--kls-tertiary)", overflow: "hidden" }}>
        <div style={{ width: pct + "%", height: "100%", background: "var(--kls-primary)", borderRadius: "var(--kls-radius-pill)" }} />
      </div>
    </div>
  );
}

const HOME_REVIEWS = [
  { id: "r1", kind: "Check-in", tone: "amber", student: "Melodie Stone", title: "Submitted 3 photos for review", sub: "Rivet Inspection Log · Airframe Structures", when: "Today, 09:22 AM" },
  { id: "r2", kind: "Oral exam", tone: "violet", student: "Joel Bishop", title: "Requested an oral exam", sub: "Engine Run-Up · Powerplant Systems", when: "Yesterday, 04:10 PM" },
];
const HOME_BLOCKS = [
  { id: "b1", title: "Airframe Structures", code: "AM.I.A", pct: 62, tasks: 8, modules: 4, instructors: 2 },
  { id: "b2", title: "Avionics Fundamentals", code: "AV.II.B", pct: 45, tasks: 6, modules: 3, instructors: 1 },
];
const HOME_TASKS = [
  { id: "t1", title: "Torque Sequence Worksheet", code: "AM.I.A.K10", due: "Due Nov 14" },
  { id: "t2", title: "Wiring Diagram Reading", code: "AV.II.B.K4", due: "Due Nov 21" },
  { id: "t3", title: "Magneto Timing Worksheet", code: "PP.I.C.K2", due: "Due Dec 03" },
];
const HOME_TONES = {
  amber:  { fg: "var(--kls-accent-4)",  bg: "var(--kls-accent-5)" },
  violet: { fg: "var(--kls-accent-12)", bg: "var(--kls-accent-13)" },
  green:  { fg: "var(--kls-success)",   bg: "var(--kls-success-container)" },
};

function HomeScreen({ showHelpButton, onHelp, onProfile }) {
  const carousel = { display: "flex", gap: "var(--kls-space-small)", overflowX: "auto", scrollSnapType: "x mandatory",
    margin: "0 calc(-1 * var(--kls-space-med))", padding: "var(--kls-space-tiny) var(--kls-space-med)" };
  const card = { flex: "0 0 84%", scrollSnapAlign: "start", boxSizing: "border-box", background: "var(--kls-surface)",
    borderRadius: "var(--kls-radius-med)", padding: "var(--kls-space-med)", display: "flex", flexDirection: "column", gap: "var(--kls-space-small)" };
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--kls-surface-variant)" }}>
      {/* header (clears the status bar) */}
      <div style={{ padding: "60px var(--kls-space-med) var(--kls-space-small)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--kls-surface-variant)", flex: "none" }}>
        <AimLogoMobile />
        <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-small)" }}>
          {showHelpButton && (
            <button onClick={onHelp} aria-label="Help & Feedback" style={{
              width: 44, height: 44, borderRadius: "var(--kls-radius-pill)", flex: "none",
              border: "1px solid var(--kls-outline-variant)", background: "var(--kls-surface)",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0,
            }}>
              <HelpGlyph size={24} color="var(--kls-on-surface)" />
            </button>
          )}
          <button onClick={onProfile} aria-label="Your profile" style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer" }}>
            <HFAvatar size={48} />
          </button>
        </div>
      </div>

      {/* scroll body */}
      <div style={{ flex: 1, overflow: "auto", padding: "var(--kls-space-tiny) var(--kls-space-med) 90px", display: "flex", flexDirection: "column", gap: "var(--kls-space-large)" }}>
        {/* Pending review */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--kls-space-small)" }}>
          <SectionHead title="Pending review" count={HOME_REVIEWS.length} />
          <div style={carousel}>
            {HOME_REVIEWS.map((r) => {
              const tone = HOME_TONES[r.tone];
              return (
                <div key={r.id} style={card}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--kls-space-small)" }}>
                    <StatusPill label={r.kind} color={tone.fg} bg={tone.bg} />
                    <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)" }}>{r.when}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-small)" }}>
                    <MCTAvatar name={r.student} size={36} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 16, fontWeight: 600, color: "var(--kls-on-surface)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.student}</div>
                      <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 500, color: "var(--kls-on-surface-variant)" }}>{r.title}</div>
                    </div>
                  </div>
                  <div style={{ height: 1, background: "var(--kls-outline-variant)" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-xsmall)", fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 500, color: "var(--kls-on-surface-variant)" }}>
                    <KlsIcon name="worklog" size={16} color="var(--kls-on-surface-variant)" />{r.sub}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active blocks */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--kls-space-small)" }}>
          <SectionHead title="Active blocks" count={HOME_BLOCKS.length} />
          <div style={carousel}>
            {HOME_BLOCKS.map((b) => (
              <div key={b.id} style={card}>
                <StatusPill label="In progress" color="var(--kls-success)" bg="var(--kls-success-container)" />
                <div>
                  <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 18, fontWeight: 600, color: "var(--kls-on-surface)" }}>{b.title}</div>
                  <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 500, color: "var(--kls-on-surface-variant)", marginTop: "var(--kls-space-tiny)" }}>{b.code}</div>
                </div>
                <HomeProgress pct={b.pct} />
                <div style={{ display: "flex", gap: "var(--kls-space-xsmall)", flexWrap: "wrap" }}>
                  <MetaChip icon={<KlsIcon name="worklog" size={16} color="var(--kls-on-surface-variant)" />}>{b.tasks} Tasks</MetaChip>
                  <MetaChip icon={<KlsIcon name="checkpoint" size={16} color="var(--kls-on-surface-variant)" />}>{b.modules} Modules</MetaChip>
                  <MetaChip icon={<KlsIcon name="person" size={16} color="var(--kls-on-surface-variant)" />}>{b.instructors} Instructor{b.instructors === 1 ? "" : "s"}</MetaChip>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next tasks */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--kls-space-small)" }}>
          <SectionHead title="Next tasks" count={HOME_TASKS.length} />
          <div style={{ background: "var(--kls-surface)", borderRadius: "var(--kls-radius-med)", padding: "0 var(--kls-space-med)" }}>
            {HOME_TASKS.map((t, i) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-small)", padding: "var(--kls-space-small) 0", borderTop: i ? "1px solid var(--kls-outline-variant)" : "none" }}>
                <span style={{ width: 38, height: 38, borderRadius: "var(--kls-radius-small)", background: "var(--kls-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                  <KlsIcon name="worklog" size={18} color="var(--kls-on-surface-variant)" />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 16, fontWeight: 500, color: "var(--kls-on-surface)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
                  <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 500, color: "var(--kls-on-surface-variant)", marginTop: 2 }}>{t.code} · {t.due}</div>
                </div>
                <KlsIcon name="chevronRight" size={18} color="var(--kls-on-surface-variant)" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

function HFBottomNav() {
  const items = [
    { id: "home", label: "Home", node: <KlsIcon name="tabs/home" size={30} color="var(--kls-on-surface)" /> },
    { id: "workspace", label: "Workspace", node: <Sitemap color="var(--kls-on-surface-variant)" /> },
    { id: "orion", label: "Orion", node: <KlsIcon name="orionOutline" size={30} color="var(--kls-on-surface-variant)" /> },
    { id: "notifications", label: "Notifications", node: <KlsIcon name="bell" size={30} color="var(--kls-on-surface-variant)" />, badge: 40 },
  ];
  return (
    <div style={{ flex: "none", background: "var(--kls-surface)", borderTop: "1px solid var(--kls-outline-variant)", paddingBottom: 28 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", padding: "10px 0 var(--kls-space-tiny)" }}>
        {items.map((it) => {
          const active = it.id === "home";
          const color = active ? "var(--kls-on-surface)" : "var(--kls-on-surface-variant)";
          return (
            <div key={it.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <span style={{ position: "relative", display: "inline-flex" }}>
                {it.node}
                {it.badge ? (
                  <span style={{ position: "absolute", top: -4, right: -10, minWidth: 20, height: 20, padding: "0 5px",
                    background: "var(--kls-error)", color: "var(--kls-on-error)", borderRadius: 10,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--kls-font-sans)", fontSize: 11, fontWeight: 700 }}>{it.badge}</span>
                ) : null}
              </span>
              <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: active ? 600 : 500, color }}>{it.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Sitemap({ color }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="3" width="6" height="5" rx="1.3" stroke={color} strokeWidth="1.7" />
      <rect x="2.5" y="16" width="6" height="5" rx="1.3" stroke={color} strokeWidth="1.7" />
      <rect x="15.5" y="16" width="6" height="5" rx="1.3" stroke={color} strokeWidth="1.7" />
      <path d="M12 8v3.5M5.5 16v-2.5h13V16" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── shared bottom-sheet shell ────────────────────────────────────────────── */
function Sheet({ open, onClose, children, label }) {
  return (
    <div aria-hidden={!open} style={{ position: "absolute", inset: 0, zIndex: 80, pointerEvents: open ? "auto" : "none" }}>
      {/* scrim */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)",
        opacity: open ? 1 : 0, transition: "opacity 250ms var(--kls-ease-standard)" }} />
      {/* sheet */}
      <div role="dialog" aria-modal="true" aria-label={label} style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        background: "var(--kls-surface)", borderRadius: "26px 26px 0 0",
        transform: open ? "translateY(0)" : "translateY(100%)",
        transition: "transform 300ms var(--kls-ease-standard)",
        maxHeight: "90%", display: "flex", flexDirection: "column",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
      }}>
        {children}
      </div>
    </div>
  );
}

function SheetCloseBtn({ onClose }) {
  return (
    <button onClick={onClose} aria-label="Close" style={{
      width: 44, height: 44, borderRadius: "50%", flex: "none", cursor: "pointer",
      border: "1px solid var(--kls-outline-variant)", background: "var(--kls-surface)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="var(--kls-on-surface)" strokeWidth="2" strokeLinecap="round" /></svg>
    </button>
  );
}

/* ── Your Profile sheet ───────────────────────────────────────────────────── */
function Toggle({ on }) {
  return (
    <span style={{ width: 52, height: 31, borderRadius: 999, background: on ? "var(--kls-primary)" : "var(--kls-surface-container-low)",
      position: "relative", flex: "none", transition: "background 200ms" }}>
      <span style={{ position: "absolute", top: 3, left: on ? 24 : 3, width: 25, height: 25, borderRadius: "50%",
        background: "var(--kls-surface)", boxShadow: "0 1px 3px rgba(0,0,0,0.3)", transition: "left 200ms" }} />
    </span>
  );
}

function ProfileSheet({ open, onClose, showHelpRow, newBadge, onHelp }) {
  return (
    <Sheet open={open} onClose={onClose} label="Your Profile">
      <div style={{ padding: "28px 24px 8px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--kls-font-sans)", fontSize: 22, fontWeight: 700, color: "var(--kls-on-surface)" }}>Your Profile</h1>
        <SheetCloseBtn onClose={onClose} />
      </div>

      <div style={{ overflow: "auto", padding: "8px 24px 0" }}>
        {/* identity */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 18 }}>
          <div style={{ position: "relative" }}>
            <HFAvatar size={64} />
            <span style={{ position: "absolute", right: -2, bottom: -2 }}><KlsIcon name="pencil" size={16} color="var(--kls-on-surface)" /></span>
          </div>
          <div>
            <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 18, fontWeight: 600, color: "var(--kls-on-surface)" }}>Joel Frank</div>
            <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500, color: "var(--kls-on-surface)", marginTop: 4 }}>Admin</div>
          </div>
        </div>
        <div style={{ height: 1, background: "var(--kls-outline-variant)" }} />

        {/* email */}
        <div style={{ padding: "var(--kls-space-med) 0", fontFamily: "var(--kls-font-sans)", fontSize: 15, color: "var(--kls-on-surface)" }}>
          <b style={{ fontWeight: 700 }}>Email:</b> joel@kilsar.com
        </div>

        {/* toggles */}
        {[["Allow Push notifications", false, "Coming Soon"], ["Enable dark mode", false], ["Student Mode", false]].map(([label, on, tag]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--kls-space-small) 0" }}>
            <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 16, fontWeight: 600, color: tag ? "var(--kls-on-surface-variant)" : "var(--kls-on-surface)" }}>{label}</span>
            {tag && <span style={{ padding: "3px 10px", borderRadius: 999, background: "var(--kls-surface-container-low)", fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, color: "var(--kls-on-surface-variant)" }}>{tag}</span>}
            <span style={{ flex: 1 }} />
            <Toggle on={on} />
          </div>
        ))}
      </div>

      {/* bottom buttons */}
      <div style={{ padding: "16px 24px 28px", display: "flex", flexDirection: "column", gap: 12 }}>
        {showHelpRow && (
          <button onClick={onHelp} style={{ ...sheetBtnStyle, gap: 10 }}>
            <HelpGlyph size={20} color="var(--kls-on-surface)" />
            <span>Help &amp; Feedback</span>
            {newBadge && <span style={{ padding: "2px 9px", borderRadius: 999, background: "var(--kls-primary)", color: "var(--kls-on-primary)", fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 700 }}>New</span>}
          </button>
        )}
        <button style={sheetBtnStyle}>Privacy Policy</button>
        <button style={sheetBtnStyle}>Logout</button>
        <div style={{ textAlign: "center", fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 600, color: "var(--kls-on-surface-variant)", marginTop: 2 }}>Version: 2.16.3</div>
      </div>
    </Sheet>
  );
}
const sheetBtnStyle = {
  height: 56, width: "100%", borderRadius: 14, cursor: "pointer",
  border: "1px solid var(--kls-outline-variant)", background: "var(--kls-surface)",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontFamily: "var(--kls-font-sans)", fontSize: 15, fontWeight: 600, color: "var(--kls-on-surface)",
};

/* ── Help & Feedback sheet ────────────────────────────────────────────────── */
function FeedbackSheet({ open, onClose }) {
  const openForm = () => window.open(FEEDBACK_FORM_URL, "_blank", "noopener,noreferrer");
  return (
    <Sheet open={open} onClose={onClose} label="Help & Feedback">
      <div style={{ padding: "28px 24px var(--kls-space-small)", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: "var(--kls-primary)", display: "inline-flex" }}><HelpGlyph size={24} color="var(--kls-primary)" /></span>
        <h1 style={{ flex: 1, margin: 0, fontFamily: "var(--kls-font-sans)", fontSize: 20, fontWeight: 700, color: "var(--kls-on-surface)" }}>Help &amp; Feedback</h1>
        <SheetCloseBtn onClose={onClose} />
      </div>
      <div style={{ height: 1, background: "var(--kls-outline-variant)" }} />

      <div style={{ overflow: "auto", padding: "var(--kls-space-med) 24px var(--kls-space-tiny)", display: "flex", flexDirection: "column", gap: 20 }}>
        <p style={{ margin: 0, fontFamily: "var(--kls-font-sans)", fontSize: 16, lineHeight: "24px", color: "var(--kls-on-surface)" }}>
          We're building this app with you in mind, and your input shapes what comes next. This is your direct line to the team behind it.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--kls-on-surface-variant)" }}>You can use it to</div>
          {["Suggest a new feature you'd like to see", "Report a bug or something that isn't working", "Ask a general question about the platform"].map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--kls-on-surface)", marginTop: 8, flex: "none" }} />
              <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 16, lineHeight: "24px", color: "var(--kls-on-surface)" }}>{t}</span>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontFamily: "var(--kls-font-sans)", fontSize: 14, lineHeight: "21px", color: "var(--kls-on-surface-variant)" }}>
          A real person reads every submission — we typically follow up within two business days.
        </p>
      </div>

      <div style={{ padding: "16px 24px 28px", display: "flex", flexDirection: "column", gap: 12 }}>
        <button onClick={openForm} style={{
          height: 52, width: "100%", borderRadius: 12, border: "1px solid transparent", cursor: "pointer",
          background: "var(--kls-tertiary-container)", color: "var(--kls-on-tertiary-container)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          fontFamily: "var(--kls-font-sans)", fontSize: 15, fontWeight: 700,
        }}>
          Open form
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M14 5h5v5M19 5l-8 8M11 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ textAlign: "center", fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 500, color: "var(--kls-on-surface-variant)" }}>Opens in a new tab</div>
      </div>
    </Sheet>
  );
}


// team-mobile.jsx — Mobile Team Workspace: see all members + manage groups.
// Built on the MX/Kilsar mobile DS. Canonical specs followed:
//   • Segmented tabs (CompoundSwitch): track h40·pad2·gap4·radius8·tertiary·outline-variant;
//     buttons h36·pad 0 18px·radius8·12/600·active surface+on-surface·inactive on-tertiary
//   • Create/Edit group = SheetOverlay (bottom sheet): bg primary-container·radius 24 top·
//     pad 20·title h2·close CircleButton(40)·trailing Save pill
//   • Delete = AlertPrompt centered dialog (radius small·dropShadow·blurred scrim)
//   • Member multi-select = inverted checkbox selection rows (22·radius6·1.5px)
//   • FilterChip pill for role/status pills · status dot
const { useState: useTM, useEffect: useTMEffect, useRef: useTMRef } = React;

// ── Shared data ──────────────────────────────────────────────
const TM_MEMBERS = [
  { id: "m1",  name: "Brendan Lawlor",   email: "brendan@kilsar.com",         role: "Admin",      status: "active",    title: "Lead Instructor",      joined: "Feb 03, 2024", lastActive: "3 hours ago" },
  { id: "m2",  name: "Joel Frank",       email: "joel@kilsar.com",            role: "Admin",      status: "active",    title: "Curriculum Admin",     joined: "Feb 20, 2024", lastActive: "Just now" },
  { id: "m3",  name: "Joel Instructor",  email: "joel+test@kilsar.com",       role: "Instructor", status: "active",    title: "A&P Instructor",       joined: "Mar 11, 2024", lastActive: "Yesterday" },
  { id: "m4",  name: "Joel Student",     email: "joel+student@kilsar.com",    role: "Student",    status: "active",    title: "Student — Airframe",   joined: "Sep 02, 2024", lastActive: "5 days ago" },
  { id: "m5",  name: "Justin Carpenter", email: "justin@kilsar.com",          role: "Admin",      status: "active",    title: "Workspace Owner",      joined: "Jan 14, 2024", lastActive: "Just now" },
  { id: "m6",  name: "Melodie Harris",   email: "melodie@kilsar.com",         role: "Instructor", status: "active",    title: "Instructor",           joined: "Apr 08, 2024", lastActive: "4 hours ago" },
  { id: "m7",  name: "Melodie Student",  email: "melodie+student@kilsar.com", role: "Student",    status: "invited",   title: "Student — Avionics",   joined: "Sep 02, 2024", lastActive: "Invitation pending" },
  { id: "m8",  name: "Spencer Carr",     email: "scarr@kilsar.com",           role: "Admin",      status: "active",    title: "Facilities Admin",     joined: "May 19, 2024", lastActive: "6 days ago" },
  { id: "m9",  name: "Aysha Ramos",      email: "aysha@kilsar.com",           role: "Student",    status: "active",    title: "Student — Powerplant", joined: "Sep 02, 2024", lastActive: "2 days ago" },
  { id: "m10", name: "Tomás Fonseca",    email: "tomas@kilsar.com",           role: "Student",    status: "suspended", title: "Student — Airframe",   joined: "Sep 02, 2024", lastActive: "3 weeks ago" },
];

// Per-field edit permissions (mirrors the web flags — granted by workspace role).
// "view" mode ignores these; in "edit" mode a field is editable only if its flag is true.
const TM_FLAGS = { name: true, email: false, title: true, role: true, status: false, avatar: true };
const tmAnyEditable = ["name", "email", "title", "role", "status", "avatar"].some((f) => TM_FLAGS[f]);
// Group management permission (granted by workspace role). Gates the view→edit switch.
const tmCanEditGroups = true;

// Recent-activity feed, shaped by role (representative sample for the profile view).
function tmActivityFor(member) {
  const byRole = {
    Admin: [
      { icon: "worklog",     text: "Updated workspace permissions",     when: "2h ago" },
      { icon: "group",       text: "Invited 3 members to the workspace", when: "Yesterday" },
      { icon: "checkpoint",  text: "Archived Block 124498.3938",         when: "4d ago" },
    ],
    Instructor: [
      { icon: "checkpoint",  text: "Graded Engine Run-Up oral exam",     when: "3h ago" },
      { icon: "worklog",     text: "Published Module: Turbine Basics",   when: "2d ago" },
      { icon: "chatBubbles", text: "Left feedback on Assignment 4",      when: "6d ago" },
    ],
    Student: [
      { icon: "checkpoint",  text: "Completed Written Exam: FAA Regs",   when: "5h ago" },
      { icon: "worklog",     text: "Submitted Assignment 4",             when: "Yesterday" },
      { icon: "chatBubbles", text: "Started Block: Engine Teardown",     when: "1w ago" },
    ],
  };
  return byRole[member.role] || byRole.Admin;
}

const TM_STATUS_PALETTE = {
  active:    { bg: "var(--kls-success-container)", fg: "var(--kls-on-success-container)", label: "Active",    dot: "var(--kls-success)" },
  invited:   { bg: "var(--kls-info-container)",    fg: "var(--kls-on-info-container)",    label: "Invited",   dot: "var(--kls-info)" },
  suspended: { bg: "var(--kls-error-container)",   fg: "var(--kls-on-error-container)",   label: "Suspended", dot: "var(--kls-error)" },
};

// group_role is PER-GROUP: exactly one immutable `creatorId`; everyone else is an
// Editor (in `editorIds`) or a Member (default). Distinct from the system RoleLevel.
const TM_SEED_GROUPS = [
  { id: "g1", name: "Workspace Admins", color: "blue",   icon: "tower",      description: "Owners with full access.",       memberIds: ["m1", "m2", "m5", "m8"], creatorId: "m5", editorIds: ["m1"] },
  { id: "g2", name: "Instructors",      color: "green",  icon: "person",     description: "Teaching staff.",                memberIds: ["m3", "m6"], creatorId: "m3", editorIds: [] },
  { id: "g3", name: "Airframe Cohort",  color: "orange", icon: "cube",       description: "Fall 2024 students.",            memberIds: ["m4", "m7", "m9"], creatorId: "m4", editorIds: ["m9"] },
  { id: "g4", name: "Avionics Lab",     color: "purple", icon: "checkpoint", description: "Avionics bench students & TAs.", memberIds: ["m9", "m10"], creatorId: "m9", editorIds: [] },
];

const TM_CURRENT_USER_ID = "m5"; // signed-in user — becomes Creator of groups they create
const TM_GROUP_ROLE_RANK = { creator: 0, editor: 1, member: 2 };
function tmGroupRoleOf(g, id) {
  if (!g) return "member";
  if (id === g.creatorId) return "creator";
  return (g.editorIds || []).includes(id) ? "editor" : "member";
}
const TM_GROUP_ROLE_PALETTE = {
  creator: { bg: "var(--kls-primary-container)", fg: "var(--kls-on-primary-container)", label: "Creator" },
  editor:  { bg: "var(--kls-info-container)",     fg: "var(--kls-on-info-container)",     label: "Editor" },
  member:  { bg: "var(--kls-tertiary)",           fg: "var(--kls-on-surface-variant)",    label: "Member" },
};

const TM_ROLES = ["Admin", "Instructor", "Student"];
const TM_COLORS = [
  { key: "blue",    bg: "var(--kls-info-container)",    fg: "var(--kls-info)" },
  { key: "green",   bg: "var(--kls-success-container)", fg: "var(--kls-success)" },
  { key: "orange",  bg: "var(--kls-accent-5)",          fg: "var(--kls-accent-4)" },
  { key: "purple",  bg: "var(--kls-accent-13)",         fg: "var(--kls-accent-12)" },
  { key: "red",     bg: "var(--kls-error-container)",   fg: "var(--kls-error)" },
  { key: "neutral", bg: "var(--kls-tertiary)",          fg: "var(--kls-on-surface-variant)" },
];
const TM_ICONS = ["group", "person", "cube", "tower", "checkpoint", "worklog", "chatBubbles", "orionOutline"];
const tmColor = (k) => TM_COLORS.find((c) => c.key === k) || TM_COLORS[0];
const tmInitials = (m) => {
  const p = (m.name || "").trim().split(/\s+/);
  return p[0] ? (p[0][0] + (p[1] ? p[1][0] : "")).toUpperCase() : (m.email[0] || "?").toUpperCase();
};

const TM_STATUS = {
  active:    { dot: "var(--kls-success)", label: "Active" },
  invited:   { dot: "var(--kls-info)",    label: "Invited" },
  suspended: { dot: "var(--kls-error)",   label: "Suspended" },
};


// ── Bits ─────────────────────────────────────────────────────
function TMAvatar({ m, size = 40 }) {
  return (
    <div style={{ flexShrink: 0, width: size, height: size, borderRadius: 999, background: "var(--kls-tertiary-container)",
      color: "var(--kls-on-surface-variant)", display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: Math.round(size * 0.36), fontFamily: "var(--kls-font-sans)" }}>{tmInitials(m)}</div>
  );
}

function TMMedallion({ color, icon, size = 44 }) {
  const c = tmColor(color);
  return (
    <div style={{ flexShrink: 0, width: size, height: size, borderRadius: 12, background: c.bg, color: c.fg,
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      <KlsIcon name={icon || "group"} size={Math.round(size * 0.5)} color={c.fg} />
    </div>
  );
}

function TMStack({ members, max = 4 }) {
  const shown = members.slice(0, max);
  const extra = members.length - shown.length;
  if (members.length === 0) return <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 13, color: "var(--kls-on-surface-variant)" }}>No members</span>;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {shown.map((m, i) => (
        <div key={m.id} style={{ marginLeft: i === 0 ? 0 : -10, border: "2px solid var(--kls-surface)", borderRadius: 999 }}>
          <TMAvatar m={m} size={26} />
        </div>
      ))}
      {extra > 0 && (
        <div style={{ marginLeft: -10, width: 26, height: 26, borderRadius: 999, border: "2px solid var(--kls-surface)",
          background: "var(--kls-tertiary)", color: "var(--kls-on-surface-variant)", display: "flex", alignItems: "center",
          justifyContent: "center", fontFamily: "var(--kls-font-sans)", fontSize: 10, fontWeight: 700 }}>+{extra}</div>
      )}
    </div>
  );
}

// FilterChip-style role pill (small, tertiary)
function TMRolePill({ role }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 var(--kls-space-small)", borderRadius: 999,
      background: "var(--kls-tertiary)", color: "var(--kls-on-tertiary)", fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600 }}>{role}</span>
  );
}

// ── Group role: read pill + edit control (Member/Editor segmented) ──
function TMGroupRolePill({ role }) {
  const p = TM_GROUP_ROLE_PALETTE[role] || TM_GROUP_ROLE_PALETTE.member;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 var(--kls-space-small)", borderRadius: 999,
      background: p.bg, color: p.fg, fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>{p.label}</span>
  );
}

// Creator is immutable and never offered here — only Member ⇄ Editor.
// Compact tappable chip (space-efficient for mobile rows): tap flips the role.
function TMGroupRoleControl({ role, onChange }) {
  const p = TM_GROUP_ROLE_PALETTE[role] || TM_GROUP_ROLE_PALETTE.member;
  const next = role === "editor" ? "member" : "editor";
  const switchPath = next === "editor"
    ? "M15.5 15.38V8.62L18.88 12 15.5 15.38M14 19l7-7-7-7v14z"   // switch_right → promote
    : "M8.5 8.62v6.76L5.12 12 8.5 8.62M10 5l-7 7 7 7V5z";         // switch_left → demote
  return (
    <button onClick={(e) => { e.stopPropagation(); onChange(next); }}
      aria-label={`Group role: ${p.label}. Tap to make ${TM_GROUP_ROLE_PALETTE[next].label}.`}
      style={{ display: "inline-flex", alignItems: "center", gap: "var(--kls-space-tiny)", height: 24, padding: "0 var(--kls-space-tiny) 0 var(--kls-space-small)",
        borderRadius: 999, border: 0, cursor: "pointer", flexShrink: 0,
        background: p.bg, color: p.fg, fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      {p.label}
      <svg width={14} height={14} viewBox="0 0 24 24" fill={p.fg} aria-hidden="true"><path d={switchPath} /></svg>
    </button>
  );
}

// ── Segmented tabs (canonical CompoundSwitch) ────────────────
function TMTabs({ tabs, value, onChange }) {
  return (
    <div style={{ display: "inline-flex", height: 40, padding: 2, gap: 4, borderRadius: 8,
      background: "var(--kls-tertiary)", border: "1px solid var(--kls-outline-variant)" }}>
      {tabs.map((t) => {
        const active = t.key === value;
        const fg = active ? "var(--kls-on-surface)" : "var(--kls-on-tertiary)";
        return (
          <button key={t.key} onClick={() => onChange(t.key)}
            style={{ height: 36, padding: "0 18px", borderRadius: 8, border: 0, cursor: "pointer", flex: 1,
              background: active ? "var(--kls-surface)" : "transparent",
              boxShadow: active ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
              color: fg, fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600,
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <KlsIcon name={t.icon} size={16} color={fg} />{t.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Members list ─────────────────────────────────────────────
function TMMembersList({ members, onOpen }) {
  return (
    <div style={{ background: "var(--kls-surface)", borderRadius: 16, overflow: "hidden" }}>
      {members.map((m, i) => {
        const st = TM_STATUS[m.status] || TM_STATUS.active;
        return (
          <div key={m.id} onClick={() => onOpen(m.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--kls-space-small)", cursor: "pointer",
            borderBottom: i < members.length - 1 ? "1px solid var(--kls-outline-variant)" : "none" }}>
            <span style={{ position: "relative" }}>
              <TMAvatar m={m} />
              <span style={{ position: "absolute", right: -1, bottom: -1, width: 12, height: 12, borderRadius: 999,
                background: st.dot, border: "2px solid var(--kls-surface)" }} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 15, fontWeight: 600, color: "var(--kls-on-surface)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</div>
              <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 1 }}>{m.email}</div>
            </div>
            <TMRolePill role={m.role} />
            <KlsIcon name="chevronRight" size={18} color="var(--kls-on-surface-variant)" />
          </div>
        );
      })}
    </div>
  );
}

// ── Swipe-to-reveal row (DS GAP — no canonical Slidable card; see DS-GAPS.md) ──
// Drag the row left to expose a destructive action panel on the trailing edge.
// Visuals follow DS tokens: action panel bg `error` · icon/label `on-error` · radius matches list.
// Snaps open/closed past 40% of the action width; tap-while-open closes; tap-while-closed fires onTap.
const TM_SWIPE_W = 88;
function TMSwipeRow({ children, onDelete, onTap, isLast }) {
  const [tx, setTx] = useTM(0);
  const drag = useTMRef({ active: false, startX: 0, base: 0, moved: false });
  const down = (e) => { drag.current = { active: true, startX: e.clientX, base: tx, moved: false }; };
  const move = (e) => {
    const d = drag.current; if (!d.active) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) { d.moved = true; if (!e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.setPointerCapture(e.pointerId); }
    if (d.moved) setTx(Math.max(-TM_SWIPE_W, Math.min(0, d.base + dx)));
  };
  const up = () => {
    const d = drag.current; if (!d.active) return;
    d.active = false;
    setTx((cur) => (cur < -TM_SWIPE_W * 0.4 ? -TM_SWIPE_W : 0));
  };
  const onClick = (e) => {
    if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); return; }
    if (tx !== 0) { setTx(0); return; }
    onTap && onTap();
  };
  return (
    <div style={{ position: "relative", borderBottom: isLast ? "none" : "1px solid var(--kls-outline-variant)" }}>
      {/* Trailing destructive action */}
      <button aria-label="Delete group" onClick={() => { setTx(0); onDelete(); }}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: TM_SWIPE_W, border: "none", cursor: "pointer",
          background: "var(--kls-error)", color: "var(--kls-on-error)", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 4 }}>
        <KlsIcon name="trash" size={20} color="var(--kls-on-error)" />
        <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600 }}>Delete</span>
      </button>
      {/* Foreground row */}
      <div onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onClick={onClick}
        style={{ position: "relative", background: "var(--kls-surface)", cursor: "pointer", touchAction: "pan-y",
          transform: `translateX(${tx}px)`, transition: drag.current.active ? "none" : "transform 220ms var(--kls-ease-standard)" }}>
        {children}
      </div>
    </div>
  );
}

// ── Groups list ──────────────────────────────────────────────
function TMGroupsList({ groups, members, expanded, onToggle, onEdit, onDelete, onCreate, onMemberRole }) {
  const membersOf = (g) => g.memberIds.map((id) => members.find((m) => m.id === id)).filter(Boolean)
    .sort((a, b) => (TM_GROUP_ROLE_RANK[tmGroupRoleOf(g, a.id)] - TM_GROUP_ROLE_RANK[tmGroupRoleOf(g, b.id)]) || a.name.localeCompare(b.name));
  if (groups.length === 0) {
    return (
      <div style={{ background: "var(--kls-surface)", borderRadius: 16, padding: "var(--kls-space-large) var(--kls-space-med)", textAlign: "center", fontFamily: "var(--kls-font-sans)" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--kls-tertiary)", display: "inline-flex",
          alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <KlsIcon name="group" size={26} color="var(--kls-on-surface-variant)" />
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--kls-on-surface)" }}>No groups yet</div>
        <div style={{ fontSize: 13, color: "var(--kls-on-surface-variant)", marginTop: 4 }}>Organize members into cohorts, teams, or labs.</div>
        <button onClick={onCreate} style={{ ...tmPrimaryBtn, marginTop: 16, marginInline: "auto" }}>
          <span style={{ fontSize: 18, lineHeight: 1, marginTop: -1 }}>+</span> New group
        </button>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--kls-space-small)" }}>
      {groups.map((g) => {
        const gm = membersOf(g);
        const isOpen = !!expanded[g.id];
        return (
          <div key={g.id} style={{ background: "var(--kls-surface)", borderRadius: 16, overflow: "hidden" }}>
            <TMSwipeRow onTap={() => onToggle(g.id)} onDelete={() => onDelete(g.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--kls-space-small)" }}>
                <TMMedallion color={g.color} icon={g.icon} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 15, fontWeight: 600, color: "var(--kls-on-surface)" }}>{g.name}</div>
                  <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)", marginTop: 1,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.description || `${gm.length} member${gm.length === 1 ? "" : "s"}`}</div>
                  {!isOpen && <div style={{ marginTop: 8 }}><TMStack members={gm} /></div>}
                </div>
                <KlsIcon name={isOpen ? "chevronDown" : "chevronRight"} size={18} color="var(--kls-on-surface-variant)" />
              </div>
            </TMSwipeRow>
            {isOpen && (
              <div style={{ background: "var(--kls-surface-variant)", borderTop: "1px solid var(--kls-outline-variant)" }}>
                {gm.map((m) => {
                  const isCreator = m.id === g.creatorId;
                  return (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "var(--kls-space-xsmall) var(--kls-space-small)",
                      borderBottom: "1px solid var(--kls-outline-variant)" }}>
                      <TMAvatar m={m} size={32} />
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: "block", fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600, color: "var(--kls-on-surface)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</span>
                        <span style={{ display: "block", fontFamily: "var(--kls-font-sans)", fontSize: 12, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.email}</span>
                      </span>
                      {isCreator
                        ? <TMGroupRolePill role="creator" />
                        : <TMGroupRoleControl role={tmGroupRoleOf(g, m.id)} onChange={(r) => onMemberRole(g.id, m.id, r)} />}
                    </div>
                  );
                })}
                <button onClick={() => onEdit(g.id)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--kls-space-xsmall)",
                    height: 44, border: "none", background: "transparent", cursor: "pointer",
                    fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 700, color: "var(--kls-on-surface-variant)" }}>
                  <KlsIcon name="pencil" size={16} color="var(--kls-on-surface-variant)" />Edit group
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Member multi-select (inside the sheet) ───────────────────
function TMCheck({ checked }) {
  return (
    <span style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0,
      border: checked ? "none" : "1.5px solid var(--kls-on-surface-variant)",
      background: checked ? "var(--kls-on-surface)" : "transparent",
      display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      {checked && (
        <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "var(--kls-surface)", fill: "none", strokeWidth: 3 }}>
          <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

function TMMemberPicker({ members, selectedIds, onToggle, roleOf, onRole, creatorId }) {
  const [q, setQ] = useTM("");
  const term = q.trim().toLowerCase();
  const list = members.filter((m) => !term || m.name.toLowerCase().includes(term) || m.email.toLowerCase().includes(term));
  return (
    <div style={{ border: "1px solid var(--kls-outline-variant)", borderRadius: 8, overflow: "hidden", background: "var(--kls-surface)" }}>
      <div style={{ height: 44, display: "flex", alignItems: "center", gap: 8, padding: "0 var(--kls-space-small)", borderBottom: "1px solid var(--kls-outline-variant)" }}>
        <KlsIcon name="search" size={16} color="var(--kls-on-surface-variant)" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search people"
          style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", fontFamily: "var(--kls-font-sans)",
            fontSize: 14, fontWeight: 500, color: "var(--kls-on-surface)" }} />
      </div>
      <div style={{ maxHeight: 240, overflowY: "auto" }}>
        {list.map((m) => {
          const checked = selectedIds.includes(m.id);
          const isCreator = m.id === creatorId;
          const role = roleOf ? roleOf(m.id) : "member";
          return (
            <div key={m.id}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "var(--kls-space-xsmall) var(--kls-space-small)",
                background: checked ? "var(--kls-tertiary)" : "transparent" }}>
              <button onClick={() => !isCreator && onToggle(m.id)} disabled={isCreator}
                style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 10, border: "none", background: "transparent",
                  padding: 0, textAlign: "left", cursor: isCreator ? "default" : "pointer" }}>
                {isCreator
                  ? <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, flexShrink: 0, stroke: "var(--kls-on-surface-variant)", fill: "none", strokeWidth: 1.8 }}><rect x="5" y="11" width="14" height="9" rx="2" strokeLinejoin="round" /><path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" /></svg>
                  : <TMCheck checked={checked} />}
                <TMAvatar m={m} size={30} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600, color: "var(--kls-on-surface)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</span>
                  <span style={{ display: "block", fontFamily: "var(--kls-font-sans)", fontSize: 12, color: "var(--kls-on-surface-variant)",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.email}</span>
                </span>
              </button>
              {checked && (isCreator
                ? <TMGroupRolePill role="creator" />
                : <TMGroupRoleControl role={role} onChange={(r) => onRole && onRole(m.id, r)} />)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TMFieldLabel({ children, trailing }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
      <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--kls-on-surface-variant)" }}>{children}</span>
      <span style={{ flex: 1 }} />
      {trailing}
    </div>
  );
}

// ── Group create / edit bottom sheet (SheetOverlay) ───
function TMGroupSheet({ group, mode, members, onClose, onSave }) {
  const blank = { id: null, name: "", description: "", color: "blue", icon: "group", memberIds: [TM_CURRENT_USER_ID], creatorId: TM_CURRENT_USER_ID, editorIds: [] };
  const [draft, setDraft] = useTM(group || blank);
  const [shown, setShown] = useTM(false);
  useTMEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(id); document.removeEventListener("keydown", onKey); };
  }, []);
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  const toggle = (id) => setDraft((d) => {
    if (id === d.creatorId) return d; // the Creator can't be removed
    const has = d.memberIds.includes(id);
    return {
      ...d,
      memberIds: has ? d.memberIds.filter((x) => x !== id) : [...d.memberIds, id],
      editorIds: has ? (d.editorIds || []).filter((x) => x !== id) : (d.editorIds || []),
    };
  });
  const setMemberRole = (id, role) => setDraft((d) => {
    if (id === d.creatorId) return d; // Creator is immutable — no transfer
    const editors = new Set(d.editorIds || []);
    if (role === "editor") editors.add(id); else editors.delete(id);
    return { ...d, editorIds: [...editors] };
  });
  const roleOf = (id) => tmGroupRoleOf(draft, id);
  const canSave = draft.name.trim().length > 0;
  const isCreate = mode === "create";

  const inputBox = { width: "100%", boxSizing: "border-box", padding: "0 var(--kls-space-small)", height: 48, background: "var(--kls-surface)",
    borderRadius: 8, border: "1px solid var(--kls-outline-variant)", fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500,
    color: "var(--kls-on-surface)", outline: "none" };

  const shell = (children) => (
    <div style={{ position: "absolute", inset: 0, zIndex: 1500, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "var(--kls-scrim)", opacity: shown ? 1 : 0, transition: "opacity 250ms var(--kls-ease-standard)" }} />
      <div style={{ position: "relative", height: "90%", display: "flex", flexDirection: "column", background: "var(--kls-primary-container)",
        borderRadius: "var(--kls-radius-bottom-modal)", boxShadow: "var(--kls-drop-shadow)",
        transform: shown ? "translateY(0)" : "translateY(100%)", transition: "transform 280ms var(--kls-ease-standard)" }}>
        {children}
      </div>
    </div>
  );

  // ── Create / edit mode (form) ──
  return shell(
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--kls-space-med) var(--kls-space-med) var(--kls-space-small)" }}>
          <TMMedallion color={draft.color} icon={draft.icon} size={36} />
          <h2 style={{ flex: 1, margin: 0, fontFamily: "var(--kls-font-sans)", fontSize: 22, fontWeight: 600, color: "var(--kls-on-surface)" }}>{isCreate ? "New group" : "Edit group"}</h2>
          <button onClick={onClose} aria-label="Close"
            style={{ width: 40, height: 40, borderRadius: 999, background: "transparent", border: "1px solid var(--kls-outline)", flexShrink: 0,
              display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--kls-on-surface)" }}>
            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: "currentColor", fill: "none", strokeWidth: 1.6 }}><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "0 var(--kls-space-med)", display: "flex", flexDirection: "column", gap: 16, paddingBottom: 8 }}>
          <div>
            <TMFieldLabel>Group name</TMFieldLabel>
            <input value={draft.name} placeholder="e.g. Airframe Cohort" autoFocus onChange={(e) => set("name", e.target.value)} style={inputBox} />
          </div>
          <div>
            <TMFieldLabel>Description</TMFieldLabel>
            <textarea value={draft.description} placeholder="What is this group for?" rows={2} onChange={(e) => set("description", e.target.value)}
              style={{ ...inputBox, height: "auto", padding: "var(--kls-space-xsmall) var(--kls-space-small)", resize: "none", lineHeight: 1.45 }} />
          </div>
          <div>
            <TMFieldLabel>Color</TMFieldLabel>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {TM_COLORS.map((c) => {
                const active = draft.color === c.key;
                return (
                  <button key={c.key} onClick={() => set("color", c.key)} aria-label={c.key}
                    style={{ width: 32, height: 32, borderRadius: 999, cursor: "pointer", background: c.bg,
                      border: active ? "2px solid var(--kls-on-surface)" : "2px solid transparent",
                      display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ width: 12, height: 12, borderRadius: 999, background: c.fg }} />
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <TMFieldLabel>Icon</TMFieldLabel>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TM_ICONS.map((ic) => {
                const active = draft.icon === ic;
                return (
                  <button key={ic} onClick={() => set("icon", ic)} aria-label={ic}
                    style={{ width: 40, height: 40, borderRadius: 8, cursor: "pointer",
                      background: active ? "var(--kls-tertiary-container)" : "transparent",
                      border: active ? "1px solid var(--kls-on-surface-variant)" : "1px solid var(--kls-outline-variant)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <KlsIcon name={ic} size={20} color="var(--kls-on-surface)" />
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <TMFieldLabel trailing={<span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 700, color: "var(--kls-on-surface-variant)" }}>{draft.memberIds.length} selected</span>}>Members</TMFieldLabel>
            <TMMemberPicker members={members} selectedIds={draft.memberIds} onToggle={toggle}
              roleOf={roleOf} onRole={setMemberRole} creatorId={draft.creatorId} />
          </div>
        </div>

        {/* Footer — PrimaryActionButton */}
        <div style={{ padding: "var(--kls-space-small) var(--kls-space-med)", borderTop: "1px solid var(--kls-outline-variant)" }}>
          <button onClick={() => canSave && onSave(draft)} disabled={!canSave}
            style={{ ...tmPrimaryBtn, width: "100%", justifyContent: "center", cursor: canSave ? "pointer" : "not-allowed", opacity: canSave ? 1 : 0.5 }}>
            {isCreate ? "Create group" : "Save"}
          </button>
        </div>
      </div>
  );
}

// ── Delete confirm (AlertPrompt) ─────────────────────────────
function TMDeleteDialog({ group, onCancel, onConfirm }) {
  const [shown, setShown] = useTM(false);
  useTMEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    function onKey(e) { if (e.key === "Escape") onCancel(); }
    document.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(id); document.removeEventListener("keydown", onKey); };
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1600, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={onCancel} style={{ position: "absolute", inset: 0, background: "var(--kls-scrim)", backdropFilter: "blur(4px)", opacity: shown ? 1 : 0, transition: "opacity 200ms var(--kls-ease-standard)" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 320, background: "var(--kls-surface)", borderRadius: 8,
        boxShadow: "var(--kls-drop-shadow)", padding: 22, transform: shown ? "scale(1)" : "scale(0.96)", opacity: shown ? 1 : 0,
        transition: "transform 200ms var(--kls-ease-standard), opacity 200ms var(--kls-ease-standard)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ width: 40, height: 40, borderRadius: 999, background: "var(--kls-error-container)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <KlsIcon name="trash" size={18} color="var(--kls-error)" />
          </span>
          <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 18, fontWeight: 600, color: "var(--kls-on-surface)" }}>Delete group?</span>
        </div>
        <p style={{ margin: "0 0 var(--kls-space-med)", fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500, lineHeight: 1.5, color: "var(--kls-on-surface-variant)" }}>
          “{group.name}” will be deleted. Its {group.memberIds.length} member{group.memberIds.length === 1 ? "" : "s"} stay in the workspace. This can’t be undone.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={onConfirm} style={{ height: 44, borderRadius: 8, border: "none", cursor: "pointer", background: "var(--kls-error)",
            color: "var(--kls-on-error)", fontFamily: "var(--kls-font-sans)", fontSize: 15, fontWeight: 700 }}>Delete group</button>
          <button onClick={onCancel} style={{ height: 44, borderRadius: 8, cursor: "pointer", background: "transparent",
            color: "var(--kls-on-surface)", border: "1px solid var(--kls-outline-variant)", fontFamily: "var(--kls-font-sans)", fontSize: 15, fontWeight: 700 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const tmPrimaryBtn = {
  height: 40, padding: "0 var(--kls-space-med)", borderRadius: "var(--kls-radius-med)", border: "none", cursor: "pointer",
  background: "var(--kls-tertiary-container)", color: "var(--kls-on-tertiary-container)",
  fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "var(--kls-space-xsmall)",
};

// ── Member detail sheet (SheetOverlay) — view + edit one member ───────────────
//   • Bottom sheet (matches TMGroupSheet): bg primary-container · radius 24 top · slide up
//   • Read-only by default (mode="view"); editable only when permitted (mode="edit" + TM_FLAGS[field])
//   • View footer surfaces "Edit member" when the viewer has any edit permission
function TMStatusPill({ status }) {
  const p = TM_STATUS_PALETTE[status] || TM_STATUS_PALETTE.active;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "var(--kls-space-tiny) var(--kls-space-small) var(--kls-space-tiny) var(--kls-space-xsmall)", borderRadius: 999,
      background: p.bg, color: p.fg, fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      <span style={{ width: 7, height: 7, borderRadius: 999, background: p.dot, flexShrink: 0 }} />{p.label}
    </span>
  );
}

const tmFieldBox = { width: "100%", boxSizing: "border-box", minHeight: 48, display: "flex", alignItems: "center",
  padding: "0 var(--kls-space-small)", background: "var(--kls-surface)", borderRadius: 8, border: "1px solid var(--kls-outline-variant)",
  fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500 };

// Editable text input (IconTextField spec) or a static, identical-looking box.
function TMSheetText({ value, onChange, type = "text", editable, placeholder }) {
  const [focus, setFocus] = useTM(false);
  if (editable) {
    return (
      <div style={{ ...tmFieldBox, height: 48, borderColor: focus ? "var(--kls-on-surface-variant)" : "var(--kls-outline-variant)", transition: "border-color 120ms" }}>
        <input type={type} value={value || ""} placeholder={placeholder}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", fontFamily: "var(--kls-font-sans)",
            fontSize: 14, fontWeight: 500, color: "var(--kls-on-surface)" }} />
      </div>
    );
  }
  return (
    <div style={{ ...tmFieldBox, height: 48, color: value ? "var(--kls-on-surface)" : "var(--kls-on-surface-variant)" }}>
      {value || placeholder || "—"}
    </div>
  );
}

// Editable inline dropdown or static value box. pillOnly → render only the value (status pill).
function TMSheetSelect({ value, options, editable, renderValue, pillOnly, onChange }) {
  const [open, setOpen] = useTM(false);
  const display = renderValue ? renderValue(value) : value;
  if (!editable) {
    if (pillOnly) return <div style={{ minHeight: 48, display: "flex", alignItems: "center" }}>{display}</div>;
    return <div style={{ ...tmFieldBox, height: 48, color: "var(--kls-on-surface)" }}>{display}</div>;
  }
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)}
        style={{ ...tmFieldBox, height: 48, cursor: "pointer", color: "var(--kls-on-surface)", justifyContent: "flex-start", gap: 8 }}>
        {display}
        <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, marginLeft: "auto", stroke: "currentColor", fill: "none", strokeWidth: 1.6, transform: open ? "rotate(180deg)" : "none", transition: "transform 125ms var(--kls-ease-standard)" }}><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && (
        <div style={{ marginTop: 6, background: "var(--kls-surface)", border: "1px solid var(--kls-outline-variant)",
          borderRadius: 8, overflow: "hidden", boxShadow: "var(--kls-drop-shadow)" }}>
          {options.map((opt) => {
            const key = opt.key || opt;
            const sel = key === value;
            return (
              <button key={key} onClick={() => { onChange(key); setOpen(false); }}
                style={{ width: "100%", height: 44, padding: "0 var(--kls-space-small)", border: "none", cursor: "pointer", textAlign: "left",
                  background: sel ? "var(--kls-tertiary)" : "transparent", display: "flex", alignItems: "center", gap: 8,
                  fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: sel ? 600 : 500, color: "var(--kls-on-surface)" }}>
                {opt.render ? opt.render() : (opt.label || opt)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TMMetaCell({ icon, label, value }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <KlsIcon name={icon} size={14} color="var(--kls-on-surface-variant)" />
        <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--kls-on-surface-variant)" }}>{label}</span>
      </div>
      <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600, color: "var(--kls-on-surface)" }}>{value}</div>
    </div>
  );
}

function TMMemberSheet({ member, mode, flags, onClose, onSwitchToEdit, onSave }) {
  const isEdit = mode === "edit";
  const [draft, setDraft] = useTM(member);
  const [shown, setShown] = useTM(false);
  useTMEffect(() => { setDraft(member); }, [member, mode]);
  useTMEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(id); document.removeEventListener("keydown", onKey); };
  }, []);
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  const canEdit = (field) => isEdit && flags[field];
  const v = isEdit ? draft : member;
  const statusOpts = Object.keys(TM_STATUS_PALETTE).map((k) => ({ key: k, render: () => <TMStatusPill status={k} /> }));

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1500, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "var(--kls-scrim)", opacity: shown ? 1 : 0, transition: "opacity 250ms var(--kls-ease-standard)" }} />
      <div style={{ position: "relative", maxHeight: "92%", display: "flex", flexDirection: "column", background: "var(--kls-primary-container)",
        borderRadius: "var(--kls-radius-bottom-modal)", boxShadow: "var(--kls-drop-shadow)",
        transform: shown ? "translateY(0)" : "translateY(100%)", transition: "transform 280ms var(--kls-ease-standard)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--kls-space-med) var(--kls-space-med) var(--kls-space-small)" }}>
          <h2 style={{ flex: 1, margin: 0, fontFamily: "var(--kls-font-sans)", fontSize: 22, fontWeight: 600, color: "var(--kls-on-surface)" }}>{isEdit ? "Edit member" : "Member profile"}</h2>
          <button onClick={onClose} aria-label="Close"
            style={{ width: 40, height: 40, borderRadius: 999, background: "transparent", border: "1px solid var(--kls-outline)",
              display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--kls-on-surface)" }}>
            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: "currentColor", fill: "none", strokeWidth: 1.6 }}><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", padding: "0 var(--kls-space-med)", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Identity */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <TMAvatar m={member} size={64} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 18, fontWeight: 600, color: v.name ? "var(--kls-on-surface)" : "var(--kls-on-surface-variant)" }}>{v.name || "No name set"}</div>
              <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 500, color: "var(--kls-on-surface-variant)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.email}</div>
            </div>
          </div>

          {/* Fields */}
          <div>
            <TMFieldLabel>Name</TMFieldLabel>
            <TMSheetText value={v.name} onChange={(x) => set("name", x)} editable={canEdit("name")} placeholder="No name set" />
          </div>
          <div>
            <TMFieldLabel>Email</TMFieldLabel>
            <TMSheetText value={v.email} type="email" onChange={(x) => set("email", x)} editable={canEdit("email")} />
          </div>
          <div>
            <TMFieldLabel>Title</TMFieldLabel>
            <TMSheetText value={v.title} onChange={(x) => set("title", x)} editable={canEdit("title")} placeholder="No title" />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <TMFieldLabel>Role</TMFieldLabel>
              <TMSheetSelect value={v.role} options={TM_ROLES} editable={canEdit("role")} onChange={(x) => set("role", x)} />
            </div>
            <div style={{ flex: 1 }}>
              <TMFieldLabel>Status</TMFieldLabel>
              <TMSheetSelect value={v.status} options={statusOpts} editable={canEdit("status")} pillOnly renderValue={(s) => <TMStatusPill status={s} />} onChange={(x) => set("status", x)} />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "var(--kls-space-small) var(--kls-space-med)", borderTop: "1px solid var(--kls-outline-variant)" }}>
          {isEdit ? (
            <>
              <button onClick={onClose} style={{ ...tmSecondaryBtn, flex: 1 }}>Cancel</button>
              <button onClick={() => onSave(draft)} style={{ ...tmPrimaryBtn, flex: 1, justifyContent: "center" }}>Save changes</button>
            </>
          ) : (
            <>
              <button onClick={onClose} style={{ ...tmSecondaryBtn, flex: 1 }}>Close</button>
              {tmAnyEditable && <button onClick={onSwitchToEdit} style={{ ...tmPrimaryBtn, flex: 1, justifyContent: "center" }}>Edit member</button>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const tmSecondaryBtn = {
  height: 40, padding: "0 var(--kls-space-med)", borderRadius: "var(--kls-radius-med)", cursor: "pointer", background: "transparent",
  color: "var(--kls-on-surface)", border: "1px solid var(--kls-outline-variant)",
  fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center",
};

// ── Team screen ──────────────────────────────────────────────
function TeamScreen({ go }) {
  const [members, setMembers] = useTM(TM_MEMBERS);
  const [groups, setGroups] = useTM(TM_SEED_GROUPS);
  const [tab, setTab] = useTM("members");
  const [editor, setEditor] = useTM(null);   // { mode, id? }
  const [deleteId, setDeleteId] = useTM(null);
  const [memberView, setMemberView] = useTM(null);   // { id, mode }
  const [expandedG, setExpandedG] = useTM({});       // group id → bool (inline member expansion)
  const toggleGroup = (id) => setExpandedG((e) => ({ ...e, [id]: !e[id] }));
  const setMemberGroupRole = (groupId, memberId, role) => setGroups((gs) => gs.map((g) => {
    if (g.id !== groupId || memberId === g.creatorId) return g; // Creator is immutable
    const editors = new Set(g.editorIds || []);
    if (role === "editor") editors.add(memberId); else editors.delete(memberId);
    return { ...g, editorIds: [...editors] };
  }));

  function saveMember(draft) {
    setMembers((ms) => ms.map((m) => (m.id === draft.id ? { ...m, ...draft } : m)));
    setMemberView(null);
  }
  const activeMember = memberView ? members.find((m) => m.id === memberView.id) : null;

  const tabDefs = [
    { key: "members", label: "Members", icon: "person" },
    { key: "groups",  label: "Groups",  icon: "group" },
  ];

  function saveGroup(draft) {
    if (draft.id) setGroups((gs) => gs.map((g) => (g.id === draft.id ? { ...g, ...draft } : g)));
    else setGroups((gs) => [...gs, { ...draft, id: "g" + Date.now().toString(36) }]);
    setEditor(null);
  }
  const editing = editor && editor.id ? groups.find((g) => g.id === editor.id) : null;
  const deleteTarget = deleteId ? groups.find((g) => g.id === deleteId) : null;

  return (
    <div data-screen-label="team" style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%", background: "var(--kls-scaffold-bg)" }}>
      {/* PageHeader: back + title */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--kls-space-xsmall) var(--kls-space-med) var(--kls-space-xsmall) var(--kls-space-small)", flex: "none" }}>
        <button onClick={() => go("workspace")} aria-label="Back"
          style={{ width: 36, height: 36, borderRadius: 18, background: "var(--kls-tertiary)", border: "1px solid var(--kls-outline-variant)",
            display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--kls-on-surface)", flexShrink: 0 }}>
          <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: "currentColor", fill: "none", strokeWidth: 1.8 }}><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ flex: 1, fontFamily: "var(--kls-font-sans)", fontSize: 24, fontWeight: 600, color: "var(--kls-on-surface)" }}>Team</div>
      </div>

      {/* Tabs + action */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--kls-space-tiny) var(--kls-space-med) var(--kls-space-small)", flex: "none" }}>
        <div style={{ flex: 1 }}><TMTabs tabs={tabDefs} value={tab} onChange={setTab} /></div>
        {tab === "groups" && (
          <button onClick={() => setEditor({ mode: "create" })} aria-label="New group"
            style={{ width: 36, height: 36, borderRadius: 999, border: "1px solid var(--kls-outline)", cursor: "pointer",
              background: "var(--kls-surface)", color: "var(--kls-on-surface)", display: "inline-flex", alignItems: "center",
              justifyContent: "center", flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: "currentColor", fill: "none", strokeWidth: 1.6 }}><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 var(--kls-space-med) var(--kls-space-large)" }}>
        <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
          color: "var(--kls-on-surface-variant)", margin: "var(--kls-space-tiny) var(--kls-space-tiny) var(--kls-space-small)" }}>
          {tab === "members" ? `${members.length} members` : `${groups.length} groups`}
        </div>
        {tab === "members"
          ? <TMMembersList members={members} onOpen={(id) => setMemberView({ id, mode: "view" })} />
          : <TMGroupsList groups={groups} members={members} expanded={expandedG} onToggle={toggleGroup}
              onEdit={(id) => setEditor({ mode: "edit", id })} onDelete={(id) => setDeleteId(id)}
              onCreate={() => setEditor({ mode: "create" })} onMemberRole={setMemberGroupRole} />}
      </div>

      {activeMember && <TMMemberSheet member={activeMember} mode={memberView.mode} flags={TM_FLAGS} onClose={() => setMemberView(null)} onSwitchToEdit={() => setMemberView({ id: memberView.id, mode: "edit" })} onSave={saveMember} />}
      {editor && <TMGroupSheet group={editing} mode={editor.mode} members={members} onClose={() => setEditor(null)} onSave={saveGroup} />}
      {deleteTarget && <TMDeleteDialog group={deleteTarget} onCancel={() => setDeleteId(null)} onConfirm={() => { setGroups((gs) => gs.filter((g) => g.id !== deleteId)); setDeleteId(null); }} />}
    </div>
  );
}

window.TeamScreen = TeamScreen;

// workspace-mobile.jsx — Mobile Workspace screen + app shell.
//
// Each element is grounded in its canonical DS source. Where the DS has NO
// canonical component, that is recorded as a gap in app/mobile/DS-GAPS.md and the
// element is built to the closest available spec (MOBILE_DRIFT.md). "Approximate"
// here means "the DS itself is silent", not "eyeballed".
//
//   • PageHeader   → preview/page-header.html  (h1 28/700 · gap 12 · pad 12×20 · no fill · trailing CircleButton 36)
//   • FilterChip   → preview/filter-chip.html  (pad 6×20 · radius 24 · 14/600 · active tertiary-container+primary · inactive tertiary+on-tertiary · funnel CircleButton 32)
//   • Status pill  → window.KLS.Pill (canonical primitive) variant green → success-container
//   • DestinationCard → MOBILE_DRIFT #2  (NO canonical card — DS GAP)
//   • BlockCard       → MOBILE_DRIFT #4  (NO canonical card — DS GAP)
//   • StatChip        → MOBILE_DRIFT #5  (NO canonical card — DS GAP)
const { useState: useWM } = React;

// ── DestinationCard ("feature pill") — from WorkspaceScreen._buildFeaturePill ──
// gradient surface→surface-container-low (135°) · radius med(12) · padding small(12) ·
// icon 28 onSurface top-left · label bodyLarge (16/500) bottom · column space-between.
// Only _featurePillWidth/_featurePillHeight aren't in the source snippet — estimated
// from the screenshot (~150×104, wider than tall). See DS-GAPS.md.
function DestinationCard({ icon, label, onClick }) {
  return (
    <button onClick={onClick}
      style={{ flex: "none", width: 150, height: 104, padding: "var(--kls-space-small)",
        background: "linear-gradient(135deg, var(--kls-surface), var(--kls-surface-container-low))",
        border: "none", borderRadius: 12, cursor: "pointer", display: "flex", flexDirection: "column",
        justifyContent: "space-between", alignItems: "flex-start", textAlign: "left" }}>
      <KlsIcon name={icon} size={28} color="var(--kls-on-surface)" />
      <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 16, fontWeight: 500, color: "var(--kls-on-surface)", lineHeight: 1.2 }}>{label}</span>
    </button>
  );
}

// ── FilterChip — canonical (preview/filter-chip.html) ────────
function FilterChip({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      style={{ flex: "none", padding: "var(--kls-space-xsmall) var(--kls-space-med)", borderRadius: 24, border: 0, cursor: "pointer", whiteSpace: "nowrap",
        background: active ? "var(--kls-tertiary-container)" : "var(--kls-tertiary)",
        color: active ? "var(--kls-primary)" : "var(--kls-on-tertiary)",
        fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600, lineHeight: "var(--kls-space-med)" }}>{label}</button>
  );
}

// ── StatChip — DS GAP (MOBILE_DRIFT #5) ──────────────────────
// outlined (outline-variant 1px) · transparent · pad tiny/xsmall · 16px icon + labelMediumMedium (12/500) · on-surface-variant.
function StatChip({ icon, label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "var(--kls-space-tiny) var(--kls-space-small)", borderRadius: 8,
      background: "var(--kls-tertiary)" }}>
      <KlsIcon name={icon} size={16} color="var(--kls-on-surface-variant)" />
      <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)" }}>{label}</span>
    </span>
  );
}

// ── BlockCard — DS GAP (MOBILE_DRIFT #4) ─────────────────────
// surface · radius med(12) · pad med(20) · canonical status Pill · title subtitleLargeBold (18/700) ·
// subtitle bodySmall (14/500) on-surface-variant · StatChip row.
function BlockCard({ status, title, subtitle, stats }) {
  return (
    <div style={{ background: "var(--kls-surface)", borderRadius: 12, padding: "var(--kls-space-small)", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      {status && (
        <span style={{ padding: "var(--kls-space-tiny) var(--kls-space-small)", borderRadius: 8, background: "var(--kls-accent-2)",
          color: "var(--kls-accent-3)", fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{status}</span>
      )}
      <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 16, fontWeight: 500, color: "var(--kls-on-surface)" }}>{title}</div>
      <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500, color: "var(--kls-on-surface-variant)", marginTop: 6 }}>{subtitle}</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
        {stats.map((s) => <StatChip key={s.label} icon={s.icon} label={s.label} />)}
      </div>
    </div>
  );
}

const WM_DESTINATIONS = [
  { key: "controlTower", icon: "tower",   label: "Control Tower" },
  { key: "library",  icon: "date",        label: "Library" },
  { key: "written",  icon: "pencil",      label: "Written Exams" },
  { key: "oral",     icon: "chatBubbles", label: "Oral Exams" },
  { key: "team",     icon: "group",       label: "Team" },
];
const WM_BLOCKS = [
  { status: "In Progress", title: "124498.3938", subtitle: "AM.I.A.K10", stats: [{ icon: "worklog", label: "8 Tasks" }, { icon: "date", label: "1 Module" }, { icon: "person", label: "1 Student" }] },
  { status: null, title: "edit test", subtitle: "No associated ACS codes", stats: [{ icon: "worklog", label: "5 Tasks" }, { icon: "date", label: "1 Module" }, { icon: "person", label: "0 Students" }] },
  { status: null, title: "sfsef", subtitle: "AM.I.A.K1, AM.I.A.K11b, AM.I.A.K11d", stats: [{ icon: "worklog", label: "12 Tasks" }, { icon: "date", label: "1 Module" }, { icon: "person", label: "1 Student" }] },
];

function WorkspaceScreen({ go }) {
  const [filter, setFilter] = useWM("Blocks");
  const filters = ["Blocks", "Modules", "Tasks"];
  return (
    <div data-screen-label="workspace" style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--kls-scaffold-bg)" }}>
      {/* PageHeader — title is h2 (mobile 24/600) per WorkspaceScreen Dart, NOT h1 28/700 as the preview card claims · trailing CircleButton(36) */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--kls-space-small) var(--kls-space-med) var(--kls-space-xsmall)", flex: "none" }}>
        <div style={{ flex: 1, fontFamily: "var(--kls-font-sans)", fontSize: 24, fontWeight: 600, color: "var(--kls-on-surface)" }}>Workspace</div>
        <button aria-label="Search" style={{ width: 36, height: 36, borderRadius: 18, background: "var(--kls-tertiary)",
          border: "1px solid var(--kls-outline-variant)", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--kls-on-surface)" }}>
          <KlsIcon name="search" size={18} color="var(--kls-on-surface)" />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }}>
        {/* DestinationCard scroller — drag-to-scroll (pointer) + wheel mapping so it works with touch and mouse */}
        <div
          onWheel={(e) => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) e.currentTarget.scrollLeft += e.deltaY; }}
          onPointerDown={(e) => { const el = e.currentTarget; el.dataset.down = "1"; el.dataset.x = e.clientX; el.dataset.sl = el.scrollLeft; el.dataset.moved = "0"; }}
          onPointerMove={(e) => { const el = e.currentTarget; if (el.dataset.down !== "1") return; const dx = e.clientX - Number(el.dataset.x); if (Math.abs(dx) > 4 && el.dataset.moved !== "1") { el.dataset.moved = "1"; el.setPointerCapture(e.pointerId); } if (el.dataset.moved === "1") el.scrollLeft = Number(el.dataset.sl) - dx; }}
          onPointerUp={(e) => { e.currentTarget.dataset.down = ""; }}
          onClickCapture={(e) => { if (e.currentTarget.dataset.moved === "1") { e.stopPropagation(); e.preventDefault(); } }}
          style={{ display: "flex", gap: 12, overflowX: "auto", padding: "var(--kls-space-xsmall) var(--kls-space-med) var(--kls-space-med)", touchAction: "pan-x", cursor: "grab", userSelect: "none" }}>
          {WM_DESTINATIONS.map((d) => (
            <DestinationCard key={d.key} icon={d.icon} label={d.label} onClick={() => { if (d.key === "team") go("team"); else if (d.key === "written") go("writtenExams"); else if (d.key === "controlTower") go("controlTower"); }} />
          ))}
        </div>

        {/* FilterChipRow */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 var(--kls-space-med) var(--kls-space-med)", overflowX: "auto" }}>
          {filters.map((f) => <FilterChip key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />)}
          <button aria-label="Filter" style={{ marginLeft: "auto", width: 32, height: 32, borderRadius: 16, background: "var(--kls-tertiary)",
            border: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--kls-on-tertiary)", flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" style={{ width: 17, height: 17, stroke: "currentColor", fill: "none", strokeWidth: 2.4 }}>
              <path d="M4 5h16l-6 8v6l-4-2v-4L4 5z" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* BlockCard list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 var(--kls-space-med)" }}>
          {WM_BLOCKS.map((b) => <BlockCard key={b.title} {...b} />)}
        </div>
      </div>
    </div>
  );
}



// ── control-tower-mobile.jsx — Mobile Control Tower (Workspace drill-in) ──────
// Faithful mobile port of the web Control Tower (web-app.jsx). Education flavor:
// the instructor assigns Tasks / Oral / Written exams and tracks per-student status.
// Chrome follows TeamScreen (back header · scrollable body · nav hidden). Student
// detail + Assign are SheetOverlay bottom sheets (bg primary-container · radius 24
// top · slide up). The assignee picker mirrors the web Teammate Picker (people +
// groups, multi). DS tokens only; CompoundSwitch + FilterChip + Pill specs reused.

// Status + type meta — `bar` is the rollup-bar segment color.
const MCT_STATUS = {
  not_started: { label: "Not started", bg: "var(--kls-tertiary)",         fg: "var(--kls-on-surface-variant)", bar: "var(--kls-outline-variant)" },
  in_progress: { label: "In progress", bg: "var(--kls-info-container)",    fg: "var(--kls-info)",     bar: "var(--kls-info)" },
  overdue:     { label: "Overdue",     bg: "var(--kls-accent-5)",          fg: "var(--kls-accent-4)", bar: "var(--kls-accent-4)" },
  completed:   { label: "Completed",   bg: "var(--kls-success-container)", fg: "var(--kls-success)",  bar: "var(--kls-success)" },
  passed:      { label: "Passed",      bg: "var(--kls-success-container)", fg: "var(--kls-success)",  bar: "var(--kls-success)" },
  failed:      { label: "Failed",      bg: "var(--kls-error-container)",   fg: "var(--kls-error)",    bar: "var(--kls-error)" },
};
const MCT_TYPES = {
  task:    { label: "Task",         icon: "worklog",     long: "Task" },
  oral:    { label: "Oral exam",    icon: "chatBubbles", long: "Oral Exam" },
  written: { label: "Written exam", icon: "checkpoint",  long: "Written Exam" },
};
const MCT_STUDENTS = [
  { id: "s1", name: "Joel Bishop",    email: "joel.b@kilsar.com",  lastActive: "2h ago" },
  { id: "s2", name: "Melodie Stone",  email: "melodie@kilsar.com", lastActive: "40m ago" },
  { id: "s3", name: "Dana Whitfield", email: "dana@kilsar.com",    lastActive: "Yesterday" },
  { id: "s4", name: "Marcus Reyes",   email: "marcus@kilsar.com",  lastActive: "5d ago" },
  { id: "s5", name: "Priya Nair",     email: "priya@kilsar.com",   lastActive: "3h ago" },
  { id: "s6", name: "Caleb Turner",   email: "caleb@kilsar.com",   lastActive: "1w ago" },
  { id: "s7", name: "Sofia Alvarez",  email: "sofia@kilsar.com",   lastActive: "Yesterday" },
  { id: "s8", name: "Liam O'Connor",  email: "liam@kilsar.com",    lastActive: "4d ago" },
];
const MCT_GROUP_COLORS = {
  blue:   { bg: "var(--kls-info-container)",    fg: "var(--kls-info)" },
  green:  { bg: "var(--kls-success-container)", fg: "var(--kls-success)" },
  orange: { bg: "var(--kls-accent-5)",          fg: "var(--kls-accent-4)" },
  purple: { bg: "var(--kls-accent-13)",         fg: "var(--kls-accent-12)" },
};
const MCT_GROUPS = [
  { id: "g1", name: "Airframe Team",    color: "orange", icon: "cube",       memberIds: ["s1", "s3"] },
  { id: "g2", name: "Avionics Lab",     color: "purple", icon: "checkpoint", memberIds: ["s2", "s5"] },
  { id: "g3", name: "Powerplant Group", color: "green",  icon: "tower",      memberIds: ["s4", "s6"] },
];
const MCT_TERMS = ["Fall 2024", "Spring 2025"];
const MCT_COURSES = {
  "Fall 2024":   ["Airframe Structures", "Avionics Fundamentals", "Powerplant Systems"],
  "Spring 2025": ["Airframe Systems", "Advanced Avionics", "Turbine Theory"],
};
const MCT_TASK_LIBRARY = {
  "Airframe Structures":   ["Torque Sequence Worksheet", "Rivet Inspection Log"],
  "Avionics Fundamentals": ["Wiring Diagram Reading", "Bus Architecture Quiz Prep"],
  "Powerplant Systems":    ["Fuel System Schematic", "Magneto Timing Worksheet"],
  "Airframe Systems":      ["Hydraulics Troubleshooting", "Landing Gear Rigging"],
  "Advanced Avionics":     ["Autopilot Config Lab", "Transponder Setup"],
  "Turbine Theory":        ["Compressor Stage Worksheet", "EGT Analysis"],
};
const MCT_EXAM_TITLES = {
  oral:    ["Engine Run-Up Oral", "Landing Gear Inspection Oral", "Sheet Metal Repair Oral"],
  written: ["FAA Regulations Written", "Turbine Theory Written", "Electrical Systems Written"],
};
const MCT_ORAL_TOPICS = ["Engine Run-Up", "Landing Gear Inspection", "Sheet Metal Repair", "Hydraulic Systems", "Electrical Troubleshooting"];
const MCT_DUE_PAST = ["Sep 28", "Oct 02", "Oct 09"];
const MCT_DUE_FUTURE = ["Nov 14", "Nov 21", "Dec 03", "Dec 12"];
const MCT_STATUS_CYCLE = ["completed", "in_progress", "not_started", "overdue", "passed", "failed", "in_progress", "completed"];
const MCT_DONE = ["completed", "passed"];

function mctBuildAssignments() {
  const out = [];
  let id = 0;
  MCT_STUDENTS.forEach((s, si) => {
    const n = 4 + (si % 3);
    for (let k = 0; k < n; k++) {
      const type = ["task", "oral", "written"][(si + k) % 3];
      let status = MCT_STATUS_CYCLE[(si * 2 + k) % MCT_STATUS_CYCLE.length];
      if (type === "task" && (status === "passed" || status === "failed")) status = "completed";
      if (type !== "task" && status === "completed") status = "passed";
      let title, course, term;
      if (type === "task") {
        term = MCT_TERMS[(si + k) % MCT_TERMS.length];
        const courses = MCT_COURSES[term];
        course = courses[(si + k) % courses.length];
        const lib = MCT_TASK_LIBRARY[course];
        title = lib[k % lib.length];
      } else {
        term = MCT_TERMS[k % MCT_TERMS.length];
        course = "Open-ended";
        const pool = MCT_EXAM_TITLES[type];
        title = pool[(si + k) % pool.length];
      }
      const due = status === "overdue" ? MCT_DUE_PAST[(si + k) % MCT_DUE_PAST.length] : MCT_DUE_FUTURE[(si + k) % MCT_DUE_FUTURE.length];
      const score = status === "passed" ? 80 + ((si + k * 3) % 18) : status === "failed" ? 52 + ((si + k) % 14) : null;
      out.push({ id: "a" + (id++), studentId: s.id, type, title, course, term, due, status, score });
    }
  });
  return out;
}
function mctInitials(name) {
  const p = (name || "").trim().split(/\s+/);
  return ((p[0] && p[0][0] || "?") + (p[1] && p[1][0] || "")).toUpperCase();
}
function mctRollup(items) {
  const by = { not_started: 0, in_progress: 0, overdue: 0, completed: 0, passed: 0, failed: 0 };
  items.forEach((a) => { by[a.status] = (by[a.status] || 0) + 1; });
  const done = by.completed + by.passed;
  return { by, total: items.length, done, overdue: by.overdue, inProgress: by.in_progress, failed: by.failed };
}
const mctGroupMembers = (g) => g.memberIds.map((id) => MCT_STUDENTS.find((s) => s.id === id)).filter(Boolean);
function mctUngrouped() {
  const inGroup = new Set(MCT_GROUPS.flatMap((g) => g.memberIds));
  return MCT_STUDENTS.filter((s) => !inGroup.has(s.id));
}

// ── Shared bits ───────────────────────────────────────────────
function MCTAvatar({ name, size = 40 }) {
  return (
    <div style={{ flexShrink: 0, width: size, height: size, borderRadius: "var(--kls-radius-pill)",
      background: "var(--kls-tertiary-container)", color: "var(--kls-on-surface-variant)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--kls-font-sans)", fontWeight: 700, fontSize: Math.round(size * 0.36) }}>{mctInitials(name)}</div>
  );
}
function MCTMedallion({ color, icon, size = 40 }) {
  const c = MCT_GROUP_COLORS[color] || MCT_GROUP_COLORS.blue;
  return (
    <div style={{ flexShrink: 0, width: size, height: size, borderRadius: "var(--kls-radius-med)", background: c.bg, color: c.fg,
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      <KlsIcon name={icon || "group"} size={Math.round(size * 0.5)} color={c.fg} />
    </div>
  );
}
function MCTStatusPill({ status }) {
  const m = MCT_STATUS[status] || MCT_STATUS.not_started;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "var(--kls-space-tiny) var(--kls-space-small)", borderRadius: "var(--kls-radius-small)",
      background: m.bg, color: m.fg, fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "var(--kls-radius-pill)", background: m.fg }} />{m.label}
    </span>
  );
}
function MCTRollupBar({ items, height = 8 }) {
  const order = ["overdue", "failed", "in_progress", "not_started", "completed", "passed"];
  const total = items.length || 1;
  const counts = {};
  items.forEach((a) => { counts[a.status] = (counts[a.status] || 0) + 1; });
  return (
    <div style={{ display: "flex", width: "100%", height, borderRadius: "var(--kls-radius-pill)", overflow: "hidden", background: "var(--kls-outline-variant)" }}>
      {order.map((st) => {
        const n = counts[st] || 0;
        if (!n) return null;
        return <div key={st} style={{ width: ((n / total) * 100) + "%", background: MCT_STATUS[st].bar }} />;
      })}
    </div>
  );
}
function MCTOverdueBadge({ n }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "var(--kls-space-tiny) var(--kls-space-small)", borderRadius: "var(--kls-radius-small)",
      background: "var(--kls-accent-5)", color: "var(--kls-accent-4)", fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
      {n} overdue
    </span>
  );
}

// ── KPI strip (2×2) ───────────────────────────────────────────
function MCTKpiCard({ label, value, icon, tone }) {
  return (
    <div style={{ flex: "1 1 0", minWidth: 0, background: "var(--kls-surface)", border: "1px solid var(--kls-outline-variant)",
      borderRadius: "var(--kls-radius-med)", padding: "var(--kls-space-small)", display: "flex", flexDirection: "column", gap: "var(--kls-space-small)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--kls-on-surface-variant)" }}>{label}</span>
        <span style={{ width: 26, height: 26, borderRadius: "var(--kls-radius-small)", background: "var(--kls-tertiary)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <KlsIcon name={icon} size={14} color="var(--kls-on-surface-variant)" />
        </span>
      </div>
      <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 26, fontWeight: 700, lineHeight: 1, color: tone || "var(--kls-on-surface)" }}>{value}</span>
    </div>
  );
}

// ── Quick filter chip (FilterChip spec + count badge) ─────────
function MCTFilterChip({ active, label, count, onClick }) {
  return (
    <button onClick={onClick} style={{ flex: "none", display: "inline-flex", alignItems: "center", gap: "var(--kls-space-xsmall)",
      padding: "var(--kls-space-xsmall) var(--kls-space-med)", borderRadius: "var(--kls-radius-large)", border: 0, cursor: "pointer", whiteSpace: "nowrap",
      background: active ? "var(--kls-tertiary-container)" : "var(--kls-tertiary)",
      color: active ? "var(--kls-primary)" : "var(--kls-on-tertiary)",
      fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600, lineHeight: "var(--kls-space-med)" }}>
      {label}
      {count != null && (
        <span style={{ minWidth: 18, height: 18, padding: "0 var(--kls-space-xsmall)", boxSizing: "border-box", borderRadius: "var(--kls-radius-pill)",
          background: active ? "var(--kls-surface)" : "var(--kls-tertiary-container)", color: "var(--kls-on-surface-variant)", fontSize: 11, fontWeight: 700,
          display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{count}</span>
      )}
    </button>
  );
}

// ── Member row inside an expanded group ───────────────────────
function MCTMemberRow({ student, items, onOpen, isLast }) {
  const r = mctRollup(items);
  return (
    <button onClick={onOpen} style={{ width: "100%", display: "flex", alignItems: "center", gap: "var(--kls-space-small)", textAlign: "left",
      padding: "var(--kls-space-small)", border: "none", cursor: "pointer", background: "transparent",
      borderTop: "1px solid var(--kls-outline-variant)" }}>
      <MCTAvatar name={student.name} size={32} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: "var(--kls-font-sans)", fontSize: 16, fontWeight: 500, color: "var(--kls-on-surface)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{student.name}</span>
        <span style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-small)", marginTop: "var(--kls-space-tiny)" }}>
          <span style={{ flex: 1, minWidth: 0 }}><MCTRollupBar items={items} height={6} /></span>
          <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap" }}>{r.done}/{r.total}</span>
        </span>
      </span>
      {r.overdue > 0 && <span style={{ width: 8, height: 8, borderRadius: "var(--kls-radius-pill)", background: "var(--kls-accent-4)", flexShrink: 0 }} />}
      <KlsIcon name="chevronRight" size={16} color="var(--kls-on-surface-variant)" />
    </button>
  );
}

// ── Student card (ungrouped, top-level) ───────────────────────
function MCTStudentCard({ student, items, onOpen }) {
  const r = mctRollup(items);
  return (
    <button onClick={onOpen} style={{ width: "100%", textAlign: "left", border: "none", cursor: "pointer",
      background: "var(--kls-surface)", borderRadius: "var(--kls-radius-med)", padding: "var(--kls-space-small)",
      display: "flex", flexDirection: "column", gap: "var(--kls-space-small)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-small)" }}>
        <MCTAvatar name={student.name} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 16, fontWeight: 500, color: "var(--kls-on-surface)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{student.name}</div>
          <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)" }}>Last active {student.lastActive}</div>
        </div>
        <KlsIcon name="chevronRight" size={18} color="var(--kls-on-surface-variant)" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-small)" }}>
        <span style={{ flex: 1, minWidth: 0 }}><MCTRollupBar items={items} /></span>
        <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 600, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap" }}>{r.done}/{r.total}</span>
      </div>
      {r.overdue > 0 && <div><MCTOverdueBadge n={r.overdue} /></div>}
    </button>
  );
}

// ── Group card (expandable) ───────────────────────────────────
function MCTGroupCard({ group, itemsByStudent, expanded, onToggle, onOpenStudent }) {
  const members = mctGroupMembers(group);
  const items = members.flatMap((m) => itemsByStudent[m.id] || []);
  const r = mctRollup(items);
  return (
    <div style={{ background: "var(--kls-surface)", borderRadius: "var(--kls-radius-med)", overflow: "hidden" }}>
      <button onClick={onToggle} style={{ width: "100%", textAlign: "left", border: "none", cursor: "pointer", background: "transparent",
        padding: "var(--kls-space-small)", display: "flex", flexDirection: "column", gap: "var(--kls-space-small)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-small)" }}>
          <MCTMedallion color={group.color} icon={group.icon} size={40} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 16, fontWeight: 500, color: "var(--kls-on-surface)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{group.name}</div>
            <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)" }}>{members.length} student{members.length === 1 ? "" : "s"}</div>
          </div>
          {r.overdue > 0 && <MCTOverdueBadge n={r.overdue} />}
          <KlsIcon name={expanded ? "chevronDown" : "chevronRight"} size={18} color="var(--kls-on-surface-variant)" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-small)" }}>
          <span style={{ flex: 1, minWidth: 0 }}><MCTRollupBar items={items} /></span>
          <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 600, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap" }}>{r.done}/{r.total}</span>
        </div>
      </button>
      {expanded && (
        <div style={{ background: "var(--kls-surface-variant)" }}>
          {members.map((m, i) => (
            <MCTMemberRow key={m.id} student={m} items={itemsByStudent[m.id] || []} onOpen={() => onOpenStudent(m.id)} isLast={i === members.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Bottom-sheet shell (SheetOverlay: bg primary-container · radius 24 top) ────
function MCTSheetShell({ onClose, maxHeight = "92%", z = 1500, children }) {
  const [shown, setShown] = useTM(false);
  useTMEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(id); document.removeEventListener("keydown", onKey); };
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: z, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "var(--kls-scrim)", opacity: shown ? 1 : 0, transition: "opacity 250ms var(--kls-ease-standard)" }} />
      <div style={{ position: "relative", maxHeight, display: "flex", flexDirection: "column", background: "var(--kls-primary-container)",
        borderRadius: "var(--kls-radius-bottom-modal)", boxShadow: "var(--kls-drop-shadow)",
        transform: shown ? "translateY(0)" : "translateY(100%)", transition: "transform 280ms var(--kls-ease-standard)" }}>
        {children}
      </div>
    </div>
  );
}
function MCTSheetClose({ onClose }) {
  return (
    <button onClick={onClose} aria-label="Close"
      style={{ width: 40, height: 40, borderRadius: "var(--kls-radius-pill)", background: "transparent", border: "1px solid var(--kls-outline)", flexShrink: 0,
        display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--kls-on-surface)" }}>
      <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: "currentColor", fill: "none", strokeWidth: 1.6 }}><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
    </button>
  );
}
const mctPrimaryBtn = {
  height: 48, padding: "0 var(--kls-space-med)", borderRadius: "var(--kls-radius-small)", border: "none", cursor: "pointer",
  background: "var(--kls-tertiary-container)", color: "var(--kls-on-tertiary-container)",
  fontFamily: "var(--kls-font-sans)", fontSize: 15, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "var(--kls-space-xsmall)",
};
const mctSecondaryBtn = {
  height: 48, padding: "0 var(--kls-space-med)", borderRadius: "var(--kls-radius-small)", cursor: "pointer", background: "transparent",
  color: "var(--kls-on-surface)", border: "1px solid var(--kls-outline-variant)",
  fontFamily: "var(--kls-font-sans)", fontSize: 15, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center",
};

// ── Student detail sheet ──────────────────────────────────────
function MCTAssignmentRow({ a, last }) {
  const T = MCT_TYPES[a.type];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-small)", padding: "var(--kls-space-small) 0",
      borderBottom: last ? "none" : "1px solid var(--kls-outline-variant)" }}>
      <span style={{ width: 38, height: 38, borderRadius: "var(--kls-radius-med)", flexShrink: 0, background: "var(--kls-tertiary)",
        display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <KlsIcon name={T.icon} size={18} color="var(--kls-on-surface-variant)" />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600, color: "var(--kls-on-surface)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-xsmall)", marginTop: 2, fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)" }}>
          <span>{T.long}</span><span>·</span><span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.type === "task" ? a.course : a.term}</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "var(--kls-space-tiny)", flexShrink: 0 }}>
        <MCTStatusPill status={a.status} />
        <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)" }}>
          {a.score != null ? "Score " + a.score + "%" : (a.due ? "Due " + a.due : "No due date")}
        </span>
      </div>
    </div>
  );
}
function MCTStudentSheet({ student, assignments, onClose, onAssign }) {
  const [typeFilter, setTypeFilter] = useTM("all");
  const mine = assignments.filter((a) => a.studentId === student.id);
  const r = mctRollup(mine);
  const list = mine.filter((a) => typeFilter === "all" || a.type === typeFilter);
  const typeTabs = [{ key: "all", label: "All" }, { key: "task", label: "Tasks" }, { key: "oral", label: "Oral" }, { key: "written", label: "Written" }];
  const stat = (label, value, tone) => (
    <div style={{ flex: 1, minWidth: 0, background: "var(--kls-surface-variant)", borderRadius: "var(--kls-radius-med)", padding: "var(--kls-space-small)" }}>
      <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 22, fontWeight: 700, color: tone || "var(--kls-on-surface)" }}>{value}</div>
      <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, color: "var(--kls-on-surface-variant)", marginTop: 2 }}>{label}</div>
    </div>
  );
  return (
    <MCTSheetShell onClose={onClose}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-small)", padding: "var(--kls-space-med) var(--kls-space-med) var(--kls-space-small)" }}>
        <MCTAvatar name={student.name} size={48} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 18, fontWeight: 700, color: "var(--kls-on-surface)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{student.name}</div>
          <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 500, color: "var(--kls-on-surface-variant)" }}>Last active {student.lastActive}</div>
        </div>
        <MCTSheetClose onClose={onClose} />
      </div>
      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "0 var(--kls-space-med)", display: "flex", flexDirection: "column", gap: "var(--kls-space-small)" }}>
        <div style={{ display: "flex", gap: "var(--kls-space-small)" }}>
          {stat("Completed", r.done + "/" + r.total)}
          {stat("In progress", r.inProgress, r.inProgress ? "var(--kls-info)" : null)}
          {stat("Overdue", r.overdue, r.overdue ? "var(--kls-accent-4)" : null)}
        </div>
        <MCTRollupBar items={mine} />
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--kls-space-xsmall)" }}>
          {typeTabs.map((t) => (
            <MCTFilterChip key={t.key} active={typeFilter === t.key} label={t.label} onClick={() => setTypeFilter(t.key)} />
          ))}
        </div>
        <div style={{ paddingBottom: "var(--kls-space-small)" }}>
          {list.length === 0
            ? <div style={{ padding: "var(--kls-space-large) var(--kls-space-small)", textAlign: "center", fontFamily: "var(--kls-font-sans)", fontSize: 14, color: "var(--kls-on-surface-variant)" }}>No assignments of this type.</div>
            : list.map((a, i) => <MCTAssignmentRow key={a.id} a={a} last={i === list.length - 1} />)}
        </div>
      </div>
      {/* Footer */}
      <div style={{ display: "flex", gap: "var(--kls-space-small)", padding: "var(--kls-space-small) var(--kls-space-med)", borderTop: "1px solid var(--kls-outline-variant)" }}>
        <button onClick={() => onAssign(student)} style={{ ...mctPrimaryBtn, flex: 1 }}>
          <span style={{ fontSize: 18, lineHeight: 1, marginTop: -1 }}>+</span> Assign
        </button>
      </div>
    </MCTSheetShell>
  );
}

// ── Assign sheet ──────────────────────────────────────────────
const mctInput = {
  width: "100%", boxSizing: "border-box", height: 48, padding: "0 var(--kls-space-small)", borderRadius: "var(--kls-radius-small)",
  background: "var(--kls-surface)", border: "1px solid var(--kls-outline-variant)",
  fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500, color: "var(--kls-on-surface)", outline: "none",
};
function MCTLabel({ children, trailing }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "var(--kls-space-xsmall)" }}>
      <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--kls-on-surface-variant)" }}>{children}</span>
      <span style={{ flex: 1 }} />{trailing}
    </div>
  );
}
function MCTSelect({ value, options, placeholder, disabled, onChange }) {
  return (
    <div style={{ position: "relative", opacity: disabled ? 0.5 : 1 }}>
      <select value={value || ""} disabled={disabled} onChange={(e) => onChange(e.target.value)}
        style={{ ...mctInput, appearance: "none", WebkitAppearance: "none", cursor: disabled ? "not-allowed" : "pointer",
          color: value ? "var(--kls-on-surface)" : "var(--kls-on-surface-variant)", paddingRight: 40 }}>
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg viewBox="0 0 24 24" style={{ position: "absolute", right: 12, top: 15, width: 18, height: 18, pointerEvents: "none", stroke: "var(--kls-on-surface-variant)", fill: "none", strokeWidth: 1.6 }}>
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
function MCTToggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} aria-pressed={checked} style={{
      width: 44, height: 26, borderRadius: "var(--kls-radius-pill)", border: "none", cursor: "pointer", padding: 2, flexShrink: 0,
      background: checked ? "var(--kls-primary)" : "var(--kls-outline-variant)", display: "inline-flex", alignItems: "center",
      transition: "background 120ms var(--kls-ease-standard)" }}>
      <span style={{ width: 22, height: 22, borderRadius: "var(--kls-radius-pill)", background: "var(--kls-surface)",
        transform: checked ? "translateX(18px)" : "translateX(0)", transition: "transform 120ms var(--kls-ease-standard)", boxShadow: "0 1px 2px rgba(0,0,0,.2)" }} />
    </button>
  );
}
function MCTToggleRow({ label, hint, checked, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-small)" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600, color: "var(--kls-on-surface)" }}>{label}</div>
        {hint && <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)", marginTop: 1 }}>{hint}</div>}
      </div>
      <MCTToggle checked={checked} onChange={onChange} />
    </div>
  );
}
function MCTTypeCard({ active, icon, label, accent, onClick }) {
  return (
    <button onClick={onClick} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--kls-space-xsmall)", cursor: "pointer",
      padding: "var(--kls-space-small) var(--kls-space-tiny)", borderRadius: "var(--kls-radius-small)",
      border: active ? ("2px solid " + accent) : "1.5px solid var(--kls-outline-variant)",
      background: active ? ("color-mix(in srgb, " + accent + " 8%, transparent)") : "var(--kls-surface)",
      transition: "all var(--kls-dur-fast-animation) var(--kls-ease-standard)" }}>
      <KlsIcon name={icon} size={20} color={active ? accent : "var(--kls-on-surface)"} />
      <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 600, color: "var(--kls-on-surface)", textAlign: "center", whiteSpace: "nowrap" }}>{label}</span>
    </button>
  );
}
// Assignee picker — people + groups, multi-select. Mirrors the web Teammate Picker.
// Teammate picker — opens as its own bottom sheet from the Assign sheet. People + groups, multi-select.
function MCTAssigneePickerSheet({ roster, selected, onToggle, onClose }) {
  const [q, setQ] = useTM("");
  const term = q.trim().toLowerCase();
  const has = (type, id) => selected.some((s) => s.type === type && s.id === id);
  const groups = roster.groups.filter((g) => !term || g.name.toLowerCase().includes(term));
  const people = roster.people.filter((p) => !term || p.name.toLowerCase().includes(term) || p.email.toLowerCase().includes(term));
  const empty = groups.length === 0 && people.length === 0;
  const sectionLabel = (t) => (
    <div style={{ padding: "var(--kls-space-small) var(--kls-space-small) var(--kls-space-tiny)", fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600,
      letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--kls-on-surface-variant)" }}>{t}</div>
  );
  const check = (on) => (
    <span style={{ width: 22, height: 22, borderRadius: "var(--kls-radius-xsmall)", flexShrink: 0,
      border: on ? "none" : "1.5px solid var(--kls-on-surface-variant)", background: on ? "var(--kls-primary)" : "transparent",
      display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      {on && <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "var(--kls-on-primary)", fill: "none", strokeWidth: 3 }}><path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" /></svg>}
    </span>
  );
  const row = (key, on, onClick, medallion, title, sub) => (
    <button key={key} onClick={onClick}
      style={{ width: "100%", display: "flex", alignItems: "center", gap: "var(--kls-space-small)", padding: "var(--kls-space-small)", border: "none", cursor: "pointer", textAlign: "left", background: on ? "var(--kls-tertiary)" : "transparent" }}>
      {check(on)}
      {medallion}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600, color: "var(--kls-on-surface)" }}>{title}</span>
        <span style={{ display: "block", fontFamily: "var(--kls-font-sans)", fontSize: 12, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</span>
      </span>
    </button>
  );
  return (
    <MCTSheetShell onClose={onClose} maxHeight="86%" z={1600}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-small)", padding: "var(--kls-space-med) var(--kls-space-med) var(--kls-space-small)" }}>
        <h2 style={{ flex: 1, margin: 0, fontFamily: "var(--kls-font-sans)", fontSize: 20, fontWeight: 600, color: "var(--kls-on-surface)" }}>Choose students / groups</h2>
        <MCTSheetClose onClose={onClose} />
      </div>
      {/* Search */}
      <div style={{ padding: "0 var(--kls-space-med)", flex: "none" }}>
        <div style={{ height: 44, display: "flex", alignItems: "center", gap: "var(--kls-space-xsmall)", padding: "0 var(--kls-space-small)", borderRadius: "var(--kls-radius-small)", background: "var(--kls-surface)", border: "1px solid var(--kls-outline-variant)" }}>
          <KlsIcon name="search" size={16} color="var(--kls-on-surface-variant)" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search students or groups"
            style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500, color: "var(--kls-on-surface)" }} />
        </div>
      </div>
      {/* List */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "var(--kls-space-xsmall) var(--kls-space-med)" }}>
        {empty && <div style={{ padding: "var(--kls-space-large) var(--kls-space-small)", textAlign: "center", fontFamily: "var(--kls-font-sans)", fontSize: 14, color: "var(--kls-on-surface-variant)" }}>No matches.</div>}
        {groups.length > 0 && sectionLabel("Groups")}
        {groups.map((g) => row("g" + g.id, has("group", g.id), () => onToggle({ type: "group", id: g.id }),
          <MCTMedallion color={g.color} icon={g.icon} size={32} />, g.name, g.count + " student" + (g.count === 1 ? "" : "s")))}
        {people.length > 0 && sectionLabel("Students")}
        {people.map((p) => row("p" + p.id, has("person", p.id), () => onToggle({ type: "person", id: p.id }),
          <MCTAvatar name={p.name} size={32} />, p.name, p.email))}
      </div>
      {/* Footer */}
      <div style={{ padding: "var(--kls-space-small) var(--kls-space-med)", borderTop: "1px solid var(--kls-outline-variant)" }}>
        <button onClick={onClose} style={{ ...mctPrimaryBtn, width: "100%" }}>Done{selected.length ? " · " + selected.length + " selected" : ""}</button>
      </div>
    </MCTSheetShell>
  );
}
function MCTAssignSheet({ roster, presetAssignees, onClose, onAssign }) {
  const [type, setType] = useTM("task");
  const [term, setTerm] = useTM("");
  const [course, setCourse] = useTM("");
  const [task, setTask] = useTM("");
  const [studentDefined, setStudentDefined] = useTM(false);
  const [topic, setTopic] = useTM("");
  const [qCount, setQCount] = useTM(20);
  const [assignees, setAssignees] = useTM(presetAssignees || []);
  const [due, setDue] = useTM("");
  const [allowLate, setAllowLate] = useTM(true);
  const [notify, setNotify] = useTM(true);
  const [pickerOpen, setPickerOpen] = useTM(false);

  const isExam = type !== "task";
  const courses = term ? (MCT_COURSES[term] || []) : [];
  const tasks = course ? (MCT_TASK_LIBRARY[course] || []) : [];
  const toggleAssignee = (a) => setAssignees((cur) => cur.some((x) => x.type === a.type && x.id === a.id) ? cur.filter((x) => !(x.type === a.type && x.id === a.id)) : [...cur, a]);
  const chips = assignees.map((s) => {
    if (s.type === "group") { const g = roster.groups.find((x) => x.id === s.id); return g && { ...s, label: g.name, color: g.color }; }
    const p = roster.people.find((x) => x.id === s.id); return p && { ...s, label: p.name };
  }).filter(Boolean);
  const valid = assignees.length > 0 && (type === "task" ? !!task : type === "oral" ? (studentDefined || !!topic) : true);

  function buildAndAssign() {
    if (!valid) return;
    const expanded = assignees.flatMap((a) => {
      if (a.type === "group") { const g = roster.groups.find((x) => x.id === a.id); return g ? g.memberIds : []; }
      return [a.id];
    });
    const studentIds = [...new Set(expanded)];
    const title = type === "task" ? task : type === "written" ? "Written Exam" : (studentDefined ? "Oral Exam" : (topic || "Oral Exam"));
    const dueLabel = due ? new Date(due + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "2-digit" }) : null;
    const created = studentIds.map((sid, i) => ({
      id: "n" + Date.now() + "_" + i, studentId: sid, type, title,
      course: type === "task" ? course : "Open-ended", term: type === "task" ? term : (term || MCT_TERMS[0]),
      due: dueLabel, status: "not_started", score: null,
    }));
    onAssign(created, title);
  }

  return (
    <>
    <MCTSheetShell onClose={onClose} maxHeight="94%">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-small)", padding: "var(--kls-space-med) var(--kls-space-med) var(--kls-space-small)" }}>
        <span style={{ width: 36, height: 36, borderRadius: "var(--kls-radius-med)", background: "var(--kls-tertiary-container)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <KlsIcon name="worklog" size={18} color="var(--kls-on-tertiary-container)" />
        </span>
        <h2 style={{ flex: 1, margin: 0, fontFamily: "var(--kls-font-sans)", fontSize: 20, fontWeight: 600, color: "var(--kls-on-surface)" }}>New assignment</h2>
        <MCTSheetClose onClose={onClose} />
      </div>
      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "0 var(--kls-space-med)", display: "flex", flexDirection: "column", gap: "var(--kls-space-med)" }}>
        {/* Type */}
        <div>
          <MCTLabel>Type</MCTLabel>
          <div style={{ display: "flex", gap: "var(--kls-space-xsmall)" }}>
            <MCTTypeCard active={type === "task"} icon="worklog" label="Task" accent="var(--kls-success)" onClick={() => setType("task")} />
            <MCTTypeCard active={type === "oral"} icon="chatBubbles" label="Oral Exam" accent="var(--kls-accent-4)" onClick={() => setType("oral")} />
            <MCTTypeCard active={type === "written"} icon="checkpoint" label="Written Exam" accent="var(--kls-info)" onClick={() => setType("written")} />
          </div>
        </div>
        {/* Work picker */}
        {type === "task" ? (
          <>
            <div><MCTLabel>Term</MCTLabel><MCTSelect value={term} options={MCT_TERMS} placeholder="Select a term" onChange={(v) => { setTerm(v); setCourse(""); setTask(""); }} /></div>
            <div><MCTLabel>Course</MCTLabel><MCTSelect value={course} options={courses} placeholder={term ? "Select a course" : "Choose a term first"} disabled={!term} onChange={(v) => { setCourse(v); setTask(""); }} /></div>
            <div><MCTLabel>Task</MCTLabel><MCTSelect value={task} options={tasks} placeholder={course ? "Select a task" : "Choose a course first"} disabled={!course} onChange={setTask} /></div>
          </>
        ) : type === "oral" ? (
          <>
            <div style={{ background: "var(--kls-surface-variant)", borderRadius: "var(--kls-radius-med)", padding: "var(--kls-space-small)", marginTop: "calc(-1 * var(--kls-space-small))" }}>
              <MCTToggleRow label="Let the student choose the topic" hint="Student picks the topic when they begin." checked={studentDefined} onChange={setStudentDefined} />
            </div>
            {!studentDefined && <div><MCTLabel>Topic</MCTLabel><MCTSelect value={topic} options={MCT_ORAL_TOPICS} placeholder="Select a topic" onChange={setTopic} /></div>}
          </>
        ) : (
          <>
            <div style={{ background: "var(--kls-surface-variant)", borderRadius: "var(--kls-radius-med)", padding: "var(--kls-space-small)", marginTop: "calc(-1 * var(--kls-space-small))" }}>
              <MCTToggleRow label="Let the student choose parameters" hint="Student sets topic, length, and scope." checked={studentDefined} onChange={setStudentDefined} />
            </div>
            {!studentDefined && (
              <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-small)", background: "var(--kls-surface-variant)", borderRadius: "var(--kls-radius-med)", padding: "var(--kls-space-small)" }}>
                <span style={{ flex: 1, fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600, color: "var(--kls-on-surface)" }}>Question count</span>
                <button onClick={() => setQCount((n) => Math.max(1, n - 1))} style={{ width: 36, height: 32, borderRadius: "var(--kls-radius-small)", border: "1px solid var(--kls-outline-variant)", background: "var(--kls-surface)", cursor: "pointer", fontSize: 20, lineHeight: 1, color: "var(--kls-on-surface-variant)" }}>−</button>
                <span style={{ width: 36, textAlign: "center", fontFamily: "var(--kls-font-sans)", fontSize: 16, fontWeight: 600, color: "var(--kls-on-surface)" }}>{qCount}</span>
                <button onClick={() => setQCount((n) => n + 1)} style={{ width: 36, height: 32, borderRadius: "var(--kls-radius-small)", border: "1px solid var(--kls-outline-variant)", background: "var(--kls-surface)", cursor: "pointer", fontSize: 20, lineHeight: 1, color: "var(--kls-on-surface-variant)" }}>+</button>
              </div>
            )}
          </>
        )}
        {/* Assignees */}
        <div>
          <MCTLabel trailing={chips.length > 0 ? <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 700, color: "var(--kls-on-surface-variant)", textTransform: "none", letterSpacing: 0 }}>{chips.length} selected</span> : null}>Assign to</MCTLabel>
          {chips.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--kls-space-xsmall)", marginBottom: "var(--kls-space-small)" }}>
              {chips.map((c) => {
                const dot = c.type === "group" ? (MCT_GROUP_COLORS[c.color] || MCT_GROUP_COLORS.blue).fg : "var(--kls-primary)";
                return (
                  <span key={c.type + c.id} style={{ display: "inline-flex", alignItems: "center", gap: "var(--kls-space-xsmall)", height: 32, paddingLeft: 10, paddingRight: 6, borderRadius: "var(--kls-radius-pill)", background: "var(--kls-tertiary)", border: "1px solid var(--kls-outline-variant)", fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 600, color: "var(--kls-on-surface)" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "var(--kls-radius-pill)", background: dot }} />{c.label}
                    <button onClick={() => toggleAssignee({ type: c.type, id: c.id })} aria-label={"Remove " + c.label} style={{ width: 20, height: 20, borderRadius: "var(--kls-radius-pill)", border: "none", cursor: "pointer", background: "transparent", color: "var(--kls-on-surface-variant)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: "currentColor", fill: "none", strokeWidth: 2 }}><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
                    </button>
                  </span>
                );
              })}
            </div>
          )}
          <button onClick={() => setPickerOpen(true)} style={{ width: "100%", height: 48, borderRadius: "var(--kls-radius-small)", cursor: "pointer", background: "transparent", border: "1px dashed var(--kls-outline)", color: "var(--kls-on-surface)", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "var(--kls-space-xsmall)", fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600 }}>
            <KlsIcon name="group" size={16} color="var(--kls-on-surface)" />{chips.length ? "Edit selection" : "Choose students / groups"}
          </button>
        </div>
        {/* Due + options */}
        <div><MCTLabel>Due date (optional)</MCTLabel><input type="date" value={due} onChange={(e) => setDue(e.target.value)} style={mctInput} /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--kls-space-small)", background: "var(--kls-surface-variant)", borderRadius: "var(--kls-radius-med)", padding: "var(--kls-space-small)", marginBottom: "var(--kls-space-small)" }}>
          <MCTToggleRow label="Allow late submissions" checked={allowLate} onChange={setAllowLate} />
          <div style={{ height: 1, background: "var(--kls-outline-variant)" }} />
          <MCTToggleRow label="Notify students" hint="Send an in-app notification now." checked={notify} onChange={setNotify} />
        </div>
      </div>
      {/* Footer */}
      <div style={{ display: "flex", gap: "var(--kls-space-small)", padding: "var(--kls-space-small) var(--kls-space-med)", borderTop: "1px solid var(--kls-outline-variant)" }}>
        <button onClick={onClose} style={{ ...mctSecondaryBtn, flex: "none", padding: "0 var(--kls-space-med)" }}>Cancel</button>
        <button onClick={buildAndAssign} disabled={!valid} style={{ ...mctPrimaryBtn, flex: 1, cursor: valid ? "pointer" : "not-allowed", opacity: valid ? 1 : 0.45 }}>
          Assign{chips.length ? " to " + chips.length : ""}
        </button>
      </div>
    </MCTSheetShell>
    {pickerOpen && (
      <MCTAssigneePickerSheet roster={roster} selected={assignees} onToggle={toggleAssignee} onClose={() => setPickerOpen(false)} />
    )}
    </>
  );
}

// ── Control Tower screen ──────────────────────────────────────
function ControlTowerScreen({ go }) {
  const [assignments, setAssignments] = useTM(() => mctBuildAssignments());
  const [quick, setQuick] = useTM("all");
  const [expanded, setExpanded] = useTM({});
  const [openStudent, setOpenStudent] = useTM(null);
  const [assignOpen, setAssignOpen] = useTM(false);
  const [assignPreset, setAssignPreset] = useTM([]);
  const [toast, setToast] = useTM(null);

  const roster = React.useMemo(() => ({
    people: MCT_STUDENTS.map((s) => ({ id: s.id, name: s.name, email: s.email })),
    groups: MCT_GROUPS.map((g) => ({ id: g.id, name: g.name, color: g.color, icon: g.icon, count: mctGroupMembers(g).length, memberIds: g.memberIds })),
  }), []);
  const itemsByStudent = React.useMemo(() => {
    const m = {};
    MCT_STUDENTS.forEach((s) => { m[s.id] = []; });
    assignments.forEach((a) => { (m[a.studentId] = m[a.studentId] || []).push(a); });
    return m;
  }, [assignments]);
  const totals = React.useMemo(() => {
    let overdue = 0, inProgress = 0, done = 0;
    assignments.forEach((a) => { if (a.status === "overdue") overdue++; if (a.status === "in_progress") inProgress++; if (MCT_DONE.includes(a.status)) done++; });
    return { overdue, inProgress, pct: assignments.length ? Math.round((done / assignments.length) * 100) : 0 };
  }, [assignments]);

  const sHasOverdue = (s) => (itemsByStudent[s.id] || []).some((a) => a.status === "overdue");
  const gHasOverdue = (g) => mctGroupMembers(g).some(sHasOverdue);
  const sInProgress = (s) => (itemsByStudent[s.id] || []).some((a) => a.status === "in_progress");
  const gInProgress = (g) => mctGroupMembers(g).some(sInProgress);

  const overdueCount = MCT_GROUPS.filter(gHasOverdue).length + mctUngrouped().filter(sHasOverdue).length;
  const inProgressCount = MCT_GROUPS.filter(gInProgress).length + mctUngrouped().filter(sInProgress).length;

  const groups = MCT_GROUPS.filter((g) => {
    if (quick === "overdue" && !gHasOverdue(g)) return false;
    if (quick === "in_progress" && !gInProgress(g)) return false;
    return true;
  });
  const looseStudents = mctUngrouped().filter((s) => {
    if (quick === "overdue" && !sHasOverdue(s)) return false;
    if (quick === "in_progress" && !sInProgress(s)) return false;
    return true;
  });
  const rowCount = groups.length + looseStudents.length;

  function doAssign(created, what) {
    setAssignments((cur) => [...created, ...cur]);
    setAssignOpen(false);
    setAssignPreset([]);
    const n = new Set(created.map((c) => c.studentId)).size;
    setToast("Assigned “" + (what || "assignment") + "” to " + n + " student" + (n === 1 ? "" : "s") + ".");
    setTimeout(() => setToast(null), 3200);
  }
  function openAssignFor(student) {
    setOpenStudent(null);
    setAssignPreset([{ type: "person", id: student.id }]);
    setAssignOpen(true);
  }

  const openStudentObj = openStudent ? MCT_STUDENTS.find((s) => s.id === openStudent) : null;

  return (
    <div data-screen-label="controlTower" style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%", background: "var(--kls-scaffold-bg)" }}>
      {/* PageHeader: back + title + Assign */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-small)", padding: "var(--kls-space-xsmall) var(--kls-space-med) var(--kls-space-xsmall) var(--kls-space-small)", flex: "none" }}>
        <button onClick={() => go("workspace")} aria-label="Back"
          style={{ width: 36, height: 36, borderRadius: "var(--kls-radius-pill)", background: "var(--kls-tertiary)", border: "1px solid var(--kls-outline-variant)",
            display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--kls-on-surface)", flexShrink: 0 }}>
          <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: "currentColor", fill: "none", strokeWidth: 1.8 }}><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ flex: 1, minWidth: 0, fontFamily: "var(--kls-font-sans)", fontSize: 24, fontWeight: 600, color: "var(--kls-on-surface)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Control Tower</div>
        <button onClick={() => { setAssignPreset([]); setAssignOpen(true); }}
          style={{ height: 36, padding: "0 var(--kls-space-small)", borderRadius: "var(--kls-radius-small)", border: "none", cursor: "pointer", background: "var(--kls-tertiary-container)", color: "var(--kls-on-tertiary-container)", display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
          <span style={{ fontSize: 18, lineHeight: 1, marginTop: -1 }}>+</span> Assign
        </button>
      </div>

      {/* Stationary header zone: KPI strip + quick filters */}
      <div style={{ flex: "none", padding: "var(--kls-space-xsmall) var(--kls-space-med) var(--kls-space-small)", display: "flex", flexDirection: "column", gap: "var(--kls-space-med)" }}>
        {/* KPI strip */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--kls-space-small)" }}>
          <div style={{ display: "flex", gap: "var(--kls-space-small)" }}>
            <MCTKpiCard label="Students" value={MCT_STUDENTS.length} icon="group" />
            <MCTKpiCard label="In progress" value={totals.inProgress} icon="worklog" tone={totals.inProgress ? "var(--kls-info)" : null} />
          </div>
          <div style={{ display: "flex", gap: "var(--kls-space-small)" }}>
            <MCTKpiCard label="Overdue" value={totals.overdue} icon="clock" tone={totals.overdue ? "var(--kls-accent-4)" : null} />
            <MCTKpiCard label="Completion" value={totals.pct + "%"} icon="checkpoint" />
          </div>
        </div>

        {/* Quick filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-xsmall)", overflowX: "auto", paddingBottom: "var(--kls-space-tiny)" }}>
          <MCTFilterChip active={quick === "all"} label="All" onClick={() => setQuick("all")} />
          <MCTFilterChip active={quick === "in_progress"} label="In progress" count={inProgressCount} onClick={() => setQuick("in_progress")} />
          <MCTFilterChip active={quick === "overdue"} label="Has overdue" count={overdueCount} onClick={() => setQuick("overdue")} />
        </div>
      </div>

      {/* Scrollable list */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "0 var(--kls-space-med) var(--kls-space-large)", display: "flex", flexDirection: "column", gap: "var(--kls-space-med)" }}>
        {rowCount === 0 ? (
          <div style={{ padding: "var(--kls-space-xlarge) var(--kls-space-med)", textAlign: "center", fontFamily: "var(--kls-font-sans)" }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--kls-on-surface)" }}>Nothing matches</div>
            <div style={{ fontSize: 14, color: "var(--kls-on-surface-variant)", marginTop: "var(--kls-space-tiny)" }}>Try clearing the filters.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--kls-space-small)" }}>
            {groups.map((g) => (
              <MCTGroupCard key={g.id} group={g} itemsByStudent={itemsByStudent}
                expanded={!!expanded[g.id]} onToggle={() => setExpanded((e) => ({ ...e, [g.id]: !e[g.id] }))}
                onOpenStudent={(id) => setOpenStudent(id)} />
            ))}
            {looseStudents.map((s) => (
              <MCTStudentCard key={s.id} student={s} items={itemsByStudent[s.id] || []} onOpen={() => setOpenStudent(s.id)} />
            ))}
          </div>
        )}
      </div>

      {/* Sheets */}
      {openStudentObj && (
        <MCTStudentSheet student={openStudentObj} assignments={assignments} onClose={() => setOpenStudent(null)} onAssign={openAssignFor} />
      )}
      {assignOpen && (
        <MCTAssignSheet roster={roster} presetAssignees={assignPreset} onClose={() => { setAssignOpen(false); setAssignPreset([]); }} onAssign={doAssign} />
      )}

      {/* Snackbar (info-only) */}
      {toast && (
        <div style={{ position: "absolute", bottom: 20, left: "var(--kls-space-med)", right: "var(--kls-space-med)", zIndex: 1700,
          background: "var(--kls-tertiary-container)", color: "var(--kls-on-tertiary-container)", borderRadius: "var(--kls-radius-med)",
          boxShadow: "var(--kls-drop-shadow)", padding: "var(--kls-space-small) var(--kls-space-med)", fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600, textAlign: "center" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
window.ControlTowerScreen = ControlTowerScreen;

// ── Unified mobile shell: one iOS frame + one bottom nav, routes between tabs ──
function MobilePlaceholder({ label, icon }) {
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--kls-scaffold-bg)", padding: "60px 24px 24px", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center", maxWidth: 300 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--kls-tertiary)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <KlsIcon name={icon} size={26} color="var(--kls-on-surface-variant)" />
        </div>
        <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 18, fontWeight: 600, color: "var(--kls-on-surface)" }}>{label}</div>
        <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500, color: "var(--kls-on-surface-variant)", marginTop: 6, lineHeight: 1.5 }}>Not built in this mock yet.</div>
      </div>
    </div>
  );
}
function MobileApp() {
  const { BottomNav } = window.KLS;
  const [tab, setTab] = useState("home");
  const [wsScreen, setWsScreen] = useState("workspace");
  const [profileOpen, setProfileOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const openFeedback = () => { setProfileOpen(false); setFeedbackOpen(true); };
  const inTeam = (tab === "workspace" && wsScreen === "team");
  const inWritten = (tab === "workspace" && wsScreen === "writtenExams");
  const inControlTower = (tab === "workspace" && wsScreen === "controlTower");
  let body;
  if (tab === "home") body = <HomeScreen showHelpButton={true} onHelp={openFeedback} onProfile={() => setProfileOpen(true)} />;
  else if (tab === "workspace") {
    if (inWritten) body = <MWrittenExams onBack={() => setWsScreen("workspace")} />;
    else body = (
      <div style={{ height: "100%", paddingTop: 54, boxSizing: "border-box", background: "var(--kls-surface-variant)" }}>
        {inTeam ? <TeamScreen go={(s) => setWsScreen(s)} />
          : inControlTower ? <ControlTowerScreen go={(s) => setWsScreen(s)} />
          : <WorkspaceScreen go={(s) => setWsScreen(s)} />}
      </div>
    );
  }
  else body = <MobilePlaceholder label={tab === "orion" ? "Orion" : "Notifications"} icon={tab === "orion" ? "orionOutline" : "bell"} />;
  const showNav = !inTeam && !inWritten && !inControlTower;
  return (
    <IOSDevice width={402} height={874}>
      <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>{body}</div>
          {showNav && (
            <div style={{ flex: "none", paddingBottom: 18 }}>
              <BottomNav active={tab} unread={40} onChange={(id) => { setTab(id); setWsScreen("workspace"); setProfileOpen(false); setFeedbackOpen(false); }} />
            </div>
          )}
        </div>
        <ProfileSheet open={profileOpen} onClose={() => setProfileOpen(false)} showHelpRow={true} newBadge={true} onHelp={openFeedback} />
        <FeedbackSheet open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      </div>
    </IOSDevice>
  );
}
window.MobileApp = MobileApp;


// ════════════════════════════════════════════════════════════════════
// WRITTEN EXAMS — mobile (folded in from 019df76f, re-themed via written-exams.css)
// ════════════════════════════════════════════════════════════════════
// Realistic A&P (Powerplant + Airframe + General) content
// Tagged with ACS codes per FAA Airman Certification Standards.

window.KILSAR_DATA = (() => {
  const blocks = [
    {
      id: 'pp-recip',
      title: 'Reciprocating Engines',
      subject: 'Powerplant',
      acs: 'PA.I',
      modules: [
        { id: 'm-intro', title: 'Introduction', acs: 'PA.I.A', count: 18, mastery: 0.74 },
        { id: 'm-valves', title: 'Valves', acs: 'PA.I.B', count: 22, mastery: 0.81 },
        { id: 'm-cyl', title: 'Cylinders', acs: 'PA.I.C', count: 26, mastery: 0.62 },
        { id: 'm-pist', title: 'Pistons', acs: 'PA.I.D', count: 24, mastery: 0.55 },
        { id: 'm-comp', title: 'Components', acs: 'PA.I.E', count: 31, mastery: 0.68 },
        { id: 'm-theory', title: 'Theory of Operation', acs: 'PA.I.F', count: 19, mastery: 0.49 },
      ],
    },
    {
      id: 'pp-induct',
      title: 'Induction & Exhaust',
      subject: 'Powerplant',
      acs: 'PA.II',
      modules: [
        { id: 'm-carb', title: 'Carburetion', acs: 'PA.II.A', count: 28, mastery: 0.71 },
        { id: 'm-fi', title: 'Fuel Injection', acs: 'PA.II.B', count: 21, mastery: 0.66 },
        { id: 'm-turbo', title: 'Turbochargers', acs: 'PA.II.C', count: 17, mastery: 0.58 },
        { id: 'm-exh', title: 'Exhaust Systems', acs: 'PA.II.D', count: 14, mastery: 0.77 },
      ],
    },
    {
      id: 'pp-ignit',
      title: 'Ignition & Starting',
      subject: 'Powerplant',
      acs: 'PA.III',
      modules: [
        { id: 'm-mag', title: 'Magnetos', acs: 'PA.III.A', count: 26, mastery: 0.84 },
        { id: 'm-wiring', title: 'Wiring Harness', acs: 'PA.III.B', count: 12, mastery: 0.70 },
        { id: 'm-plugs', title: 'Spark Plugs', acs: 'PA.III.C', count: 15, mastery: 0.78 },
        { id: 'm-start', title: 'Starting Systems', acs: 'PA.III.D', count: 18, mastery: 0.65 },
      ],
    },
    {
      id: 'af-struct',
      title: 'Airframe Structures',
      subject: 'Airframe',
      acs: 'AF.I',
      modules: [
        { id: 'm-metal', title: 'Sheet Metal', acs: 'AF.I.A', count: 34, mastery: 0.72 },
        { id: 'm-wood', title: 'Wood & Fabric', acs: 'AF.I.B', count: 16, mastery: 0.59 },
        { id: 'm-comp-mat', title: 'Composites', acs: 'AF.I.C', count: 22, mastery: 0.51 },
        { id: 'm-corr', title: 'Corrosion', acs: 'AF.I.D', count: 19, mastery: 0.83 },
        { id: 'm-paint', title: 'Finishes', acs: 'AF.I.E', count: 13, mastery: 0.69 },
      ],
    },
    {
      id: 'af-sys',
      title: 'Airframe Systems',
      subject: 'Airframe',
      acs: 'AF.II',
      modules: [
        { id: 'm-hyd', title: 'Hydraulics & Pneumatics', acs: 'AF.II.A', count: 28, mastery: 0.64 },
        { id: 'm-lg', title: 'Landing Gear', acs: 'AF.II.B', count: 24, mastery: 0.71 },
        { id: 'm-fuel', title: 'Fuel Systems', acs: 'AF.II.C', count: 19, mastery: 0.60 },
        { id: 'm-ice', title: 'Ice & Rain Control', acs: 'AF.II.D', count: 11, mastery: 0.74 },
        { id: 'm-fire', title: 'Fire Protection', acs: 'AF.II.E', count: 14, mastery: 0.79 },
      ],
    },
    {
      id: 'gen-reg',
      title: 'Regulations & Forms',
      subject: 'General',
      acs: 'GE.I',
      modules: [
        { id: 'm-far', title: 'FAR Part 43', acs: 'GE.I.A', count: 22, mastery: 0.86 },
        { id: 'm-far65', title: 'FAR Part 65', acs: 'GE.I.B', count: 18, mastery: 0.81 },
        { id: 'm-forms', title: 'Maintenance Records', acs: 'GE.I.C', count: 20, mastery: 0.77 },
      ],
    },
    {
      id: 'gen-physics',
      title: 'Physics & Math',
      subject: 'General',
      acs: 'GE.II',
      modules: [
        { id: 'm-math', title: 'Math for Aviation', acs: 'GE.II.A', count: 16, mastery: 0.72 },
        { id: 'm-phys', title: 'Physics Principles', acs: 'GE.II.B', count: 19, mastery: 0.68 },
        { id: 'm-weight', title: 'Weight & Balance', acs: 'GE.II.C', count: 14, mastery: 0.83 },
      ],
    },
  ];

  // Detailed Reciprocating Engines question pool (used during exam)
  const sampleQuestions = [
    {
      id: 'q-1',
      block: 'Reciprocating Engines',
      module: 'Theory of Operation',
      acs: 'PA.I.F',
      stem: 'On a four-stroke-cycle reciprocating engine, the valve overlap period occurs at the end of which two strokes?',
      figure: null,
      choices: [
        { id: 'A', text: 'Compression and power.' },
        { id: 'B', text: 'Exhaust and intake.' },
        { id: 'C', text: 'Power and exhaust.' },
      ],
      correct: 'B',
      explanation: 'Valve overlap is the brief period at the end of the exhaust stroke and the beginning of the intake stroke when both valves are open simultaneously. It improves volumetric efficiency by using the inertia of the exiting exhaust gas to help draw the fresh charge into the cylinder.',
      reference: 'FAA-H-8083-32B, Ch. 1 — Reciprocating Engine Theory',
    },
    {
      id: 'q-2',
      block: 'Reciprocating Engines',
      module: 'Cylinders',
      acs: 'PA.I.C',
      stem: 'A reciprocating engine cylinder bore that has been ground oversize requires which of the following?',
      figure: null,
      choices: [
        { id: 'A', text: 'A new piston of the corresponding oversize.' },
        { id: 'B', text: 'A standard piston with oversize rings.' },
        { id: 'C', text: 'No piston change — only ring replacement.' },
      ],
      correct: 'A',
      explanation: 'When a cylinder is ground oversize, the manufacturer specifies a matching oversize piston so clearances remain within tolerance. Standard pistons would have excessive clearance and cause blow-by, oil consumption, and scuffing.',
      reference: 'AC 43.13-1B, Ch. 8',
    },
    {
      id: 'q-3',
      block: 'Reciprocating Engines',
      module: 'Pistons',
      acs: 'PA.I.D',
      stem: 'The function of the oil control ring on a reciprocating engine piston is to:',
      figure: null,
      choices: [
        { id: 'A', text: 'Seal combustion pressure into the cylinder.' },
        { id: 'B', text: 'Maintain piston-to-cylinder wall lubrication and meter oil to the cylinder wall.' },
        { id: 'C', text: 'Conduct heat from the piston to the cylinder wall.' },
      ],
      correct: 'B',
      explanation: 'The oil control ring (typically the lowest ring on the piston) regulates the film of oil on the cylinder wall — wiping excess oil and returning it to the sump while leaving enough for lubrication. Compression rings handle pressure sealing; the top ring assists with heat transfer.',
      reference: 'FAA-H-8083-32B, Ch. 1',
    },
    {
      id: 'q-4',
      block: 'Reciprocating Engines',
      module: 'Valves',
      acs: 'PA.I.B',
      stem: 'Sodium-cooled exhaust valves transfer heat from the valve head to the stem by:',
      figure: null,
      choices: [
        { id: 'A', text: 'Conduction through the solid steel valve material only.' },
        { id: 'B', text: 'Liquid sodium that melts in operation and sloshes inside the hollow stem.' },
        { id: 'C', text: 'Pressurized coolant circulated from the engine cooling system.' },
      ],
      correct: 'B',
      explanation: 'The valve stem is partially filled with metallic sodium, which melts at operating temperature (~208°F) and is thrown back and forth by valve motion. This carries heat from the hot valve head up to the cooler stem and guide.',
      reference: 'FAA-H-8083-32B',
    },
    {
      id: 'q-5',
      block: 'Reciprocating Engines',
      module: 'Components',
      acs: 'PA.I.E',
      stem: 'Crankshaft dynamic dampers are designed to reduce:',
      figure: null,
      choices: [
        { id: 'A', text: 'Torsional vibration at specific engine RPM ranges.' },
        { id: 'B', text: 'Oil pressure pulsations in the lubrication system.' },
        { id: 'C', text: 'Bearing loads during the power stroke.' },
      ],
      correct: 'A',
      explanation: 'Dynamic dampers (pendulum weights mounted on crankshaft cheeks) counteract torsional vibrations that would otherwise resonate with crankshaft natural frequencies, particularly in radial and inline engines.',
      reference: 'FAA-H-8083-32B, Ch. 1',
    },
    {
      id: 'q-6',
      block: 'Reciprocating Engines',
      module: 'Theory of Operation',
      acs: 'PA.I.F',
      stem: 'Detonation in a reciprocating engine is best described as:',
      figure: null,
      choices: [
        { id: 'A', text: 'Ignition occurring before the spark plug fires due to a hot spot.' },
        { id: 'B', text: 'A controlled, progressive burn of the fuel-air mixture across the cylinder.' },
        { id: 'C', text: 'An uncontrolled, explosive combustion of the unburned charge after normal ignition.' },
      ],
      correct: 'C',
      explanation: 'Detonation is the spontaneous, near-instantaneous explosion of the end-gas (unburned mixture) after the spark has fired. It produces sharp pressure spikes that can damage pistons, valves, and bearings. Pre-ignition (A) is a related but distinct phenomenon.',
      reference: 'FAA-H-8083-32B, Ch. 1',
    },
    {
      id: 'q-7',
      block: 'Reciprocating Engines',
      module: 'Introduction',
      acs: 'PA.I.A',
      stem: 'In a typical horizontally-opposed aircraft engine, the firing order is designed primarily to:',
      figure: null,
      choices: [
        { id: 'A', text: 'Maximize power output per stroke.' },
        { id: 'B', text: 'Distribute power impulses evenly and minimize vibration.' },
        { id: 'C', text: 'Allow each cylinder to cool fully between firings.' },
      ],
      correct: 'B',
      explanation: 'Firing orders (e.g. 1-3-2-4 on a four-cylinder opposed engine) are chosen to balance loads on the crankshaft and distribute power impulses smoothly, minimizing vibration and bearing stress.',
      reference: 'FAA-H-8083-32B, Ch. 1',
    },
    {
      id: 'q-8',
      block: 'Reciprocating Engines',
      module: 'Cylinders',
      acs: 'PA.I.C',
      stem: 'The purpose of cylinder choke (taper) at the upper end of the cylinder barrel is to:',
      figure: null,
      choices: [
        { id: 'A', text: 'Provide easier piston installation during overhaul.' },
        { id: 'B', text: 'Compensate for thermal expansion so the bore is uniform at operating temperature.' },
        { id: 'C', text: 'Reduce friction during the compression stroke.' },
      ],
      correct: 'B',
      explanation: 'The upper cylinder runs hotter than the lower portion. Manufacturers grind the upper bore slightly smaller (choked) so that thermal expansion brings it to a uniform diameter at operating temperature, maintaining proper ring-to-wall contact.',
      reference: 'FAA-H-8083-32B, Ch. 1',
    },
  ];

  // Historical exam attempts
  const history = [
    { id: 'h-1', date: '2026-04-30', mode: 'Exam', title: 'Reciprocating Engines — Full Section', count: 60, score: 0.83, duration: '52:14', acs: ['PA.I'] },
    { id: 'h-2', date: '2026-04-28', mode: 'Study', title: 'Pistons + Cylinders mix', count: 25, score: 0.68, duration: '34:02', acs: ['PA.I.C', 'PA.I.D'] },
    { id: 'h-3', date: '2026-04-25', mode: 'Exam', title: 'Powerplant — Random across all', count: 60, score: 0.71, duration: '58:41', acs: ['PA.I', 'PA.II', 'PA.III'] },
    { id: 'h-4', date: '2026-04-22', mode: 'Study', title: 'Valves deep dive', count: 22, score: 0.91, duration: '21:08', acs: ['PA.I.B'] },
    { id: 'h-5', date: '2026-04-19', mode: 'Exam', title: 'Reciprocating Engines — Full Section', count: 60, score: 0.78, duration: '54:33', acs: ['PA.I'] },
    { id: 'h-6', date: '2026-04-16', mode: 'Exam', title: 'Custom: Theory + Components', count: 40, score: 0.65, duration: '38:55', acs: ['PA.I.E', 'PA.I.F'] },
    { id: 'h-7', date: '2026-04-12', mode: 'Study', title: 'Magnetos refresher', count: 18, score: 0.88, duration: '15:21', acs: ['PA.III.A'] },
    { id: 'h-8', date: '2026-04-08', mode: 'Exam', title: 'Powerplant — Random', count: 60, score: 0.66, duration: '59:02', acs: ['PA.I', 'PA.II', 'PA.III'] },
    { id: 'h-9', date: '2026-04-04', mode: 'Study', title: 'Pistons — focused', count: 15, score: 0.53, duration: '18:44', acs: ['PA.I.D'] },
    { id: 'h-10', date: '2026-03-30', mode: 'Exam', title: 'Reciprocating Engines — Full Section', count: 60, score: 0.72, duration: '56:18', acs: ['PA.I'] },
  ];

  // Student roster (instructor view)
  const students = [
    { id: 'u-1',  name: 'Marcus Reyes',     avatar: 'MR', lastActive: '2 hours ago',   avg: 0.78, attempts: 23, trend: 5,  status: 'on-track' },
    { id: 'u-2',  name: 'Jordan Pak',       avatar: 'JP', lastActive: '5 minutes ago', avg: 0.84, attempts: 31, trend: 8,  status: 'on-track' },
    { id: 'u-3',  name: 'Avery Chen',       avatar: 'AC', lastActive: 'yesterday',     avg: 0.62, attempts: 18, trend: -2, status: 'at-risk' },
    { id: 'u-4',  name: 'Sasha Bell',       avatar: 'SB', lastActive: '3 days ago',    avg: 0.71, attempts: 14, trend: 3,  status: 'on-track' },
    { id: 'u-5',  name: 'Diego Castillo',   avatar: 'DC', lastActive: '1 hour ago',    avg: 0.89, attempts: 27, trend: 6,  status: 'excellent' },
    { id: 'u-6',  name: 'Riley Tomlinson',  avatar: 'RT', lastActive: '6 hours ago',   avg: 0.74, attempts: 19, trend: 4,  status: 'on-track' },
    { id: 'u-7',  name: 'Priya Kapoor',     avatar: 'PK', lastActive: '20 minutes ago',avg: 0.81, attempts: 22, trend: 7,  status: 'on-track' },
    { id: 'u-8',  name: 'Tomas Lindberg',   avatar: 'TL', lastActive: '4 hours ago',   avg: 0.58, attempts: 12, trend: -4, status: 'at-risk' },
    { id: 'u-9',  name: 'Naomi Okafor',     avatar: 'NO', lastActive: '11 minutes ago',avg: 0.86, attempts: 29, trend: 5,  status: 'excellent' },
    { id: 'u-10', name: 'Wes Holloway',     avatar: 'WH', lastActive: '2 days ago',    avg: 0.66, attempts: 15, trend: 1,  status: 'on-track' },
    { id: 'u-11', name: 'Mei Tanaka',       avatar: 'MT', lastActive: 'yesterday',     avg: 0.79, attempts: 24, trend: 6,  status: 'on-track' },
    { id: 'u-12', name: 'Caleb Ortiz',      avatar: 'CO', lastActive: '5 hours ago',   avg: 0.52, attempts: 9,  trend: -6, status: 'at-risk' },
    { id: 'u-13', name: 'Hana Saito',       avatar: 'HS', lastActive: '30 minutes ago',avg: 0.83, attempts: 26, trend: 4,  status: 'on-track' },
    { id: 'u-14', name: 'Bryce Lockwood',   avatar: 'BL', lastActive: '4 days ago',    avg: 0.69, attempts: 17, trend: 2,  status: 'on-track' },
    { id: 'u-15', name: 'Emiliano Vargas',  avatar: 'EV', lastActive: '1 hour ago',    avg: 0.77, attempts: 21, trend: 5,  status: 'on-track' },
    { id: 'u-16', name: 'Zara Hassan',      avatar: 'ZH', lastActive: '3 hours ago',   avg: 0.91, attempts: 33, trend: 9,  status: 'excellent' },
    { id: 'u-17', name: 'Owen Petrosky',    avatar: 'OP', lastActive: '6 days ago',    avg: 0.49, attempts: 7,  trend: -8, status: 'at-risk' },
    { id: 'u-18', name: 'Lila Aronson',     avatar: 'LA', lastActive: '45 minutes ago',avg: 0.74, attempts: 20, trend: 3,  status: 'on-track' },
    { id: 'u-19', name: 'Kenji Park',       avatar: 'KP', lastActive: '2 hours ago',   avg: 0.80, attempts: 25, trend: 5,  status: 'on-track' },
    { id: 'u-20', name: 'Imani Brooks',     avatar: 'IB', lastActive: '12 hours ago',  avg: 0.68, attempts: 16, trend: 1,  status: 'on-track' },
    { id: 'u-21', name: 'Rafael Moreno',    avatar: 'RM', lastActive: '8 days ago',    avg: 0.55, attempts: 11, trend: -3, status: 'at-risk' },
    { id: 'u-22', name: 'Aoife Sullivan',   avatar: 'AS', lastActive: '15 minutes ago',avg: 0.85, attempts: 28, trend: 7,  status: 'excellent' },
    { id: 'u-23', name: 'Hudson Brae',      avatar: 'HB', lastActive: 'yesterday',     avg: 0.72, attempts: 19, trend: 3,  status: 'on-track' },
    { id: 'u-24', name: 'Yuki Watanabe',    avatar: 'YW', lastActive: '7 hours ago',   avg: 0.76, attempts: 22, trend: 4,  status: 'on-track' },
    { id: 'u-25', name: 'Nadia Petrov',     avatar: 'NP', lastActive: '3 hours ago',   avg: 0.63, attempts: 13, trend: 0,  status: 'on-track' },
  ];

  // Recent score series (10 attempts) per ACS for trend graph
  const acsTrends = {
    'PA.I.A': [0.62, 0.68, 0.71, 0.74, 0.69, 0.78, 0.81, 0.76, 0.83, 0.79],
    'PA.I.B': [0.71, 0.74, 0.79, 0.81, 0.83, 0.78, 0.86, 0.84, 0.87, 0.91],
    'PA.I.C': [0.55, 0.51, 0.58, 0.61, 0.59, 0.64, 0.62, 0.66, 0.63, 0.68],
    'PA.I.D': [0.42, 0.47, 0.45, 0.51, 0.49, 0.53, 0.55, 0.58, 0.54, 0.55],
    'PA.I.E': [0.61, 0.64, 0.66, 0.69, 0.72, 0.68, 0.71, 0.74, 0.69, 0.73],
    'PA.I.F': [0.39, 0.44, 0.41, 0.47, 0.49, 0.45, 0.51, 0.49, 0.52, 0.49],
  };

  const overallTrend = [0.61, 0.66, 0.64, 0.71, 0.68, 0.73, 0.78, 0.74, 0.81, 0.83];

  // Per-student data shaping. We project the canonical history/trend onto each
  // student deterministically so instructors see plausible variation.
  const studentDataFor = (studentId) => {
    const s = students.find(x => x.id === studentId);
    if (!s) return null;
    const skew = (s.avg - 0.74);              // how much to shift scores from the canonical "Marcus" baseline
    const clamp01 = v => Math.max(0.05, Math.min(0.99, v));
    const drift = (i) => skew + Math.sin((s.id.charCodeAt(s.id.length-1) + i) * 1.7) * 0.04;

    return {
      student: s,
      history: history.map((h, i) => ({
        ...h,
        id: `${s.id}-${h.id}`,
        score: clamp01(h.score + drift(i)),
      })).slice(0, Math.max(4, Math.min(12, s.attempts))),
      overallTrend: overallTrend.map((v, i) => clamp01(v + drift(i))),
      acsTrends: Object.fromEntries(
        Object.entries(acsTrends).map(([k, vals]) => [k, vals.map((v, i) => clamp01(v + drift(i)))])
      ),
    };
  };

  return { blocks, sampleQuestions, history, students, roster: students, studentDataFor, acsTrends, overallTrend };

})();

/* Icon set — minimal stroke icons */
const WEIcon = ({ name, size = 16, ...rest }) => {
  const s = size;
  const common = { width: s, height: s, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round', ...rest };
  switch (name) {
    case 'home': return <svg {...common}><path d="M2.5 7L8 2.5L13.5 7v6.5h-4v-4h-3v4h-4z"/></svg>;
    case 'book': return <svg {...common}><path d="M3 2.5h4.5A1.5 1.5 0 0 1 9 4v9.5"/><path d="M13 2.5H8.5A1.5 1.5 0 0 0 7 4v9.5"/><path d="M3 13.5h10"/></svg>;
    case 'exam': return <svg {...common}><rect x="3" y="2.5" width="10" height="11" rx="1.5"/><path d="M5.5 6h5M5.5 8.5h5M5.5 11h3"/></svg>;
    case 'history': return <svg {...common}><path d="M2 8a6 6 0 1 0 1.8-4.3"/><path d="M2 2v3.5h3.5"/><path d="M8 5v3l2 1.5"/></svg>;
    case 'chart': return <svg {...common}><path d="M2.5 13.5V2.5"/><path d="M2.5 13.5h11"/><path d="M5 11l2.5-3 2 2L13 5"/></svg>;
    case 'people': return <svg {...common}><circle cx="6" cy="6" r="2.2"/><path d="M2 13.5c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5"/><path d="M10.5 4.2A2 2 0 1 1 12 8"/><path d="M11 13.5c0-1.6 1.2-3 2.5-3"/></svg>;
    case 'spark': return <svg {...common}><path d="M8 1.5L9.5 6l4.5 1.5L9.5 9 8 13.5 6.5 9 2 7.5 6.5 6z"/></svg>;
    case 'lock': return <svg {...common}><rect x="3" y="7" width="10" height="6.5" rx="1.2"/><path d="M5 7V5a3 3 0 0 1 6 0v2"/></svg>;
    case 'unlock': return <svg {...common}><rect x="3" y="7" width="10" height="6.5" rx="1.2"/><path d="M5 7V5a3 3 0 0 1 5.5-1.6"/></svg>;
    case 'check': return <svg {...common}><path d="M3 8.5L6.5 12L13 4"/></svg>;
    case 'x': return <svg {...common}><path d="M4 4l8 8M12 4l-8 8"/></svg>;
    case 'flag': return <svg {...common}><path d="M3.5 13.5V2.5"/><path d="M3.5 3h7l-1.5 2.5L11 8H3.5"/></svg>;
    case 'chev-r': return <svg {...common}><path d="M6 3l4 5l-4 5"/></svg>;
    case 'chev-l': return <svg {...common}><path d="M10 3l-4 5l4 5"/></svg>;
    case 'chev-d': return <svg {...common}><path d="M3 6l5 4l5-4"/></svg>;
    case 'plus': return <svg {...common}><path d="M8 3v10M3 8h10"/></svg>;
    case 'search': return <svg {...common}><circle cx="7" cy="7" r="4.2"/><path d="M10.2 10.2L13.5 13.5"/></svg>;
    case 'settings': return <svg {...common}><circle cx="8" cy="8" r="2"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4"/></svg>;
    case 'orion': return <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" fill="currentColor"/><circle cx="3.5" cy="4" r="0.7" fill="currentColor"/><circle cx="12.5" cy="11" r="0.7" fill="currentColor"/><circle cx="13" cy="4.5" r="0.5" fill="currentColor"/></svg>;
    case 'sparkles': return <svg {...common}><path d="M3.5 3v3M2 4.5h3"/><path d="M11 11v2.5M9.7 12.2h2.5"/><path d="M8 2L9 6l4 1L9 8l-1 4l-1-4l-4-1l4-1z"/></svg>;
    case 'send': return <svg {...common}><path d="M2 8L13.5 2.5L9 13.5L7 9z"/></svg>;
    case 'random': return <svg {...common}><path d="M2 4h2.5l7 8H14"/><path d="M11.5 4H14l-2.5 2.5"/><path d="M14 12l-2.5 2.5"/><path d="M2 12h2.5l1.5-1.7"/></svg>;
    case 'image': return <svg {...common}><rect x="2" y="3" width="12" height="10" rx="1.2"/><circle cx="6" cy="6.5" r="1"/><path d="M2.5 11.5l3.5-3l3 2.5l3-2l3.5 3"/></svg>;
    case 'arrow-r': return <svg {...common}><path d="M3 8h10M9 4l4 4l-4 4"/></svg>;
    case 'logo': return <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M2 14L8 2L14 14L8 10L2 14Z" fill="currentColor"/>
    </svg>;
    case 'trend-up': return <svg {...common}><path d="M2 11l4-4l3 3l5-6"/><path d="M10 4h4v4"/></svg>;
    case 'circle': return <svg {...common}><circle cx="8" cy="8" r="5.5"/></svg>;
    case 'dot': return <svg {...common}><circle cx="8" cy="8" r="1.6" fill="currentColor"/></svg>;
    case 'filter': return <svg {...common}><path d="M2 3h12l-4.5 5.5v4l-3 1.5v-5.5z"/></svg>;
    case 'download': return <svg {...common}><path d="M8 2v8M4.5 7L8 10.5L11.5 7"/><path d="M2.5 13.5h11"/></svg>;
    case 'pause': return <svg {...common}><rect x="4" y="3" width="2.5" height="10" rx="0.5" fill="currentColor"/><rect x="9.5" y="3" width="2.5" height="10" rx="0.5" fill="currentColor"/></svg>;
    default: return null;
  }
};

window.WEIcon = WEIcon;

/* Kilsar Written Exams — Mobile (iOS paradigms, unified for iOS+Android)
   All screens share the Kilsar design tokens (styles.css). One file, many screens. */

const FAA_EXAMS_M = [
  { id: 'general',    subject: 'General',    short: 'GEN', count: 60,  acs: ['GE.I', 'GE.II'],          blurb: 'Regulations, records, basic electricity, materials, weight & balance.' },
  { id: 'airframe',   subject: 'Airframe',   short: 'AF',  count: 100, acs: ['AF.I', 'AF.II'],          blurb: 'Structures, hydraulics, landing gear, fuel, ice, fire protection.' },
  { id: 'powerplant', subject: 'Powerplant', short: 'PP',  count: 100, acs: ['PA.I', 'PA.II', 'PA.III'], blurb: 'Recip & turbine engines, induction, ignition, fuel, propellers.' },
];

/* ---------- Shared mobile shell ---------- */

const MobileShell = ({ tab = null, onTab, children, theme = 'light' }) => (
  <div data-theme={theme} style={{
    height: '100%', display: 'flex', flexDirection: 'column',
    background: 'var(--bg)', color: 'var(--ink)',
    fontFamily: 'var(--font-ui)',
  }}>
    <div className="scroll-y" style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingTop: 54 }}>
      {children}
    </div>
    {tab && <MobileTabBar active={tab} onTab={onTab} />}
  </div>
);

const MobileTabBar = ({ active, onTab }) => {
  const items = [
    { id: 'practice', label: 'Practice', icon: 'exam' },
    { id: 'history',  label: 'History',  icon: 'history' },
    { id: 'progress', label: 'Progress', icon: 'chart' },
    { id: 'profile',  label: 'You',      icon: 'people' },
  ];
  return (
    <div style={{
      flexShrink: 0, padding: '6px 0 28px',
      background: 'var(--bg-elev)',
      borderTop: '0.5px solid var(--line)',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    }}>
      {items.map(i => {
        const on = active === i.id;
        return (
          <div key={i.id} onClick={() => onTab && onTab(i.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '6px 0', cursor: 'pointer',
            color: on ? 'var(--ink)' : 'var(--ink-4)',
          }}>
            <WEIcon name={i.icon} size={22} />
            <span style={{ fontSize: 10.5, fontWeight: on ? 600 : 500, letterSpacing: 0.05 }}>{i.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const NavIconButton = ({ icon, label, onClick }) => (
  <button
    aria-label={label}
    onClick={onClick}
    style={{
      width: 32, height: 32, borderRadius: '50%',
      background: 'var(--bg-sunken)', color: 'var(--accent)',
      border: 0, display: 'grid', placeItems: 'center', cursor: 'pointer',
    }}
  >
    <WEIcon name={icon} size={15} />
  </button>
);

const MobileNav = ({ title, large = true, back = false, onBack, trailing = null, subtitle = null }) => (
  <div style={{ padding: '8px 16px 12px' }}>
    {back && (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 32, marginBottom: 6 }}>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 2,
          background: 'transparent', border: 0, color: 'var(--accent)',
          fontSize: 16, fontWeight: 400, padding: 0,
        }} onClick={onBack}>
          <WEIcon name="chev-l" size={16} />
          {typeof back === 'string' ? back : 'Back'}
        </button>
        {trailing}
      </div>
    )}
    {large && (
      <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: subtitle ? 4 : 0 }}>{title}</h1>
    )}
    {subtitle && <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>{subtitle}</div>}
  </div>
);

const Segment = ({ value, onChange, options }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`,
    gap: 2, padding: 2,
    background: 'var(--bg-sunken)', borderRadius: 9,
    margin: '0 16px',
  }}>
    {options.map(o => {
      const active = value === o.v;
      return (
        <div key={o.v} onClick={() => onChange && onChange(o.v)} style={{ cursor: 'pointer',
          padding: '7px 10px', borderRadius: 7, textAlign: 'center',
          background: active ? 'var(--bg-elev)' : 'transparent',
          boxShadow: active ? '0 1px 2px rgba(11,15,20,0.08)' : 'none',
          fontSize: 13.5, fontWeight: active ? 600 : 500,
          color: active ? 'var(--ink)' : 'var(--ink-3)',
        }}>{o.l}</div>
      );
    })}
  </div>
);

const WECard = ({ children, style = {} }) => (
  <div style={{
    background: 'var(--bg-elev)', borderRadius: 14,
    border: '1px solid var(--line)',
    ...style,
  }}>{children}</div>
);

const WESectionHead = ({ title, action }) => (
  <div style={{
    display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
    padding: '20px 20px 8px',
  }}>
    <span style={{ fontSize: 12, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{title}</span>
    {action && <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>{action}</span>}
  </div>
);

/* Small inline sparkline — used on the Practice home to surface
   the historical trend without leaving the screen. */
const Sparkline = ({ data, width = 180, height = 44, color = 'var(--good)' }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = (max - min) || 1;
  const pad = 3;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return [x, y];
  });
  const line = pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${pad},${height} ${line} ${width - pad},${height}`;
  const [lx, ly] = pts[pts.length - 1];
  const gid = `spark-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gid})`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="2.6" fill={color} />
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   Screen 1 — Practice home (Study mode default)
   ───────────────────────────────────────────────────────────── */
const MSetupStudy = ({ tab, onTab, onModeChange, onBegin, onBack, onGoHistory, onGoProgress } = {}) => {
  const D = window.KILSAR_DATA;
  const blocks = D.blocks.slice(0, 4);
  return (
    <MobileShell tab={tab} onTab={onTab}>
      <MobileNav
        title="Written Exams"
        subtitle="Practice for your FAA written test."
        back="Home" onBack={onBack}
        trailing={
          <div style={{ display: 'flex', gap: 6 }}>
            <NavIconButton icon="history" label="History" onClick={onGoHistory} />
            <NavIconButton icon="chart" label="Progress" onClick={onGoProgress} />
          </div>
        }
      />

      <div style={{ padding: '8px 16px 0' }}>
        <Segment value="study" onChange={onModeChange} options={[{v:'study', l:'Study'}, {v:'exam', l:'Exam'}]} />
      </div>

      <WESectionHead title="Continue" />
      <div style={{ padding: '0 16px' }}>
        <WECard style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
              <WEIcon name="book" size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Pistons & Theory</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>2 modules · 43 questions</div>
            </div>
            <button style={{
              background: 'var(--ink)', color: 'var(--bg-elev)', border: 0,
              borderRadius: 999, padding: '7px 14px', fontSize: 13, fontWeight: 600,
            }}>Resume</button>
          </div>
        </WECard>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ fontSize: 12, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 8 }}>Configuration</div>
        <WECard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
            <span style={{ fontSize: 15 }}>Question count</span>
            <span className="mono" style={{ fontSize: 15, fontWeight: 600 }}>25</span>
          </div>
          <div style={{ height: 0.5, background: 'var(--line)', marginLeft: 16 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
            <span style={{ fontSize: 15 }}>Orion AI</span>
            <div style={{
              width: 42, height: 26, background: 'var(--good)', borderRadius: 999, padding: 2,
              display: 'flex', justifyContent: 'flex-end',
            }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff' }} />
            </div>
          </div>
        </WECard>
      </div>

      <WESectionHead title="Subjects" action="Customize" />
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        <WECard>
          {blocks.map((b, i) => {
            const avg = b.modules.reduce((s, m) => s + m.mastery, 0) / b.modules.length;
            const barColor = avg >= 0.85 ? 'var(--good)' : avg >= 0.7 ? 'var(--accent)' : 'var(--warn)';
            return (
              <React.Fragment key={b.id}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', gap: 12 }}>
                  <div style={{ width: 6, height: 36, borderRadius: 3, background: barColor }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>{b.title}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-3)', display: 'flex', gap: 8, alignItems: 'center', marginTop: 2 }}>
                      <span>{b.subject}</span>
                      <span style={{ color: 'var(--ink-5)' }}>·</span>
                      <span className="mono">{b.modules.reduce((s, m) => s + m.count, 0)} Q</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {b.modules.slice(0, 3).map((m) => (
                      <span key={m.id} style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: m.mastery >= 0.85 ? 'var(--good)' : m.mastery >= 0.7 ? 'var(--accent)' : 'var(--warn)',
                      }} />
                    ))}
                  </div>
                  <WEIcon name="chev-r" size={14} style={{ color: 'var(--ink-5)' }} />
                </div>
                {i < blocks.length - 1 && <div style={{ height: 0.5, background: 'var(--line)', marginLeft: 36 }} />}
              </React.Fragment>
            );
          })}
        </WECard>
      </div>

      <div style={{ padding: '20px 16px 24px' }}>
        <button style={{
          width: '100%', height: 50, borderRadius: 14, border: 0,
          background: 'var(--ink)', color: 'var(--bg-elev)',
          fontSize: 16, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }} onClick={onBegin}>Begin practice <WEIcon name="arrow-r" size={15} /></button>
      </div>
    </MobileShell>
  );
};

/* ─────────────────────────────────────────────────────────────
   Screen 2 — Exam mode (3-subject picker)
   ───────────────────────────────────────────────────────────── */
const MSetupExam = ({ selected = 'airframe', tab, onTab, onModeChange, onBegin, onBack } = {}) => (
  <MobileShell tab={tab} onTab={onTab}>
    <MobileNav title="Written Exams" subtitle="Choose your FAA written exam." back="Home" onBack={onBack} />

    <div style={{ padding: '8px 16px 0' }}>
      <Segment value="exam" onChange={onModeChange} options={[{v:'study', l:'Study'}, {v:'exam', l:'Exam'}]} />
    </div>

    <div style={{ padding: '20px 16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {FAA_EXAMS_M.map(e => {
        const active = selected === e.id;
        return (
          <div key={e.id} style={{
            border: `2px solid ${active ? 'var(--lock)' : 'var(--line)'}`,
            background: active ? 'var(--lock-soft)' : 'var(--bg-elev)',
            borderRadius: 14, padding: 16,
            position: 'relative',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', marginTop: 2,
                border: `2px solid ${active ? 'var(--lock)' : 'var(--line-2)'}`,
                background: 'var(--bg-elev)',
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                {active && <div style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--lock)' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em' }}>{e.subject}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--ink-4)', fontFamily: 'var(--font-mono)' }}>{e.short}</span>
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.5 }}>{e.blurb}</div>
              </div>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14,
              paddingTop: 12, borderTop: `0.5px solid ${active ? 'rgba(110,64,201,0.18)' : 'var(--line)'}`,
            }}>
              <div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Questions</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{e.count}</div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Time</div>
                <div className="mono" style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>2:00:00</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    <div style={{ padding: '0 16px 16px' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: 12, background: 'var(--lock-soft)', borderRadius: 12, color: 'var(--lock)' }}>
        <WEIcon name="lock" size={14} />
        <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>Orion AI is locked for the duration. Exam must be completed in one sitting.</div>
      </div>
    </div>

    <div style={{ padding: '0 16px 24px' }}>
      <button style={{
        width: '100%', height: 50, borderRadius: 14, border: 0,
        background: 'var(--lock)', color: '#fff',
        fontSize: 16, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }} onClick={onBegin}>Begin Airframe Exam <WEIcon name="arrow-r" size={15} /></button>
    </div>
  </MobileShell>
);

/* ─────────────────────────────────────────────────────────────
   Screen 3 — Pre-exam warning sheet
   ───────────────────────────────────────────────────────────── */
const MPreExamSheet = ({ onProceed, onClose } = {}) => (
  <div style={{ position: 'relative', height: '100%', background: 'var(--bg)' }}>
    {/* Dimmed background: a faint version of the exam picker */}
    <div style={{ position: 'absolute', inset: 0, opacity: 0.32, pointerEvents: 'none', filter: 'blur(1.5px)' }}>
      <MSetupExam />
    </div>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(11,15,20,0.4)' }} />

    {/* Sheet */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'var(--bg-elev)',
      borderTopLeftRadius: 24, borderTopRightRadius: 24,
      padding: '12px 20px 36px',
      boxShadow: '0 -8px 32px rgba(11,15,20,0.18)',
    }}>
      <div style={{ width: 36, height: 5, borderRadius: 999, background: 'var(--line-2)', margin: '0 auto 16px' }} />
      <button style={{
        position: 'absolute', top: 16, right: 16,
        width: 30, height: 30, borderRadius: '50%', border: 0,
        background: 'var(--bg-sunken)', color: 'var(--ink-3)',
        display: 'grid', placeItems: 'center', cursor: 'pointer',
      }} onClick={onClose} aria-label="Close"><WEIcon name="x" size={14} /></button>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: 'var(--lock-soft)', color: 'var(--lock)', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 14 }}>
        <WEIcon name="lock" size={11} />
        Exam Mode · FAA Simulation
      </div>
      <h2 style={{ fontSize: 22, lineHeight: 1.25, marginBottom: 10, letterSpacing: '-0.02em' }}>Airframe written exam — FAA conditions.</h2>
      <p style={{ color: 'var(--ink-3)', fontSize: 14, lineHeight: 1.55, marginBottom: 18 }}>
        Orion AI assistance is disabled. You won't see whether questions are correct until you submit. Complete in one sitting.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
        <SheetStat label="Questions" value="100" />
        <SheetStat label="Time limit" value="2:00:00" mono />
        <SheetStat label="Orion" value="Locked" icon="lock" />
        <SheetStat label="Feedback" value="Disabled" icon="x" />
      </div>

      <button style={{
        width: '100%', height: 50, borderRadius: 14, border: 0,
        background: 'var(--ink)', color: 'var(--bg-elev)',
        fontSize: 16, fontWeight: 600, marginBottom: 8,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }} onClick={onProceed}>Begin · I understand <WEIcon name="arrow-r" size={15} /></button>
    </div>
  </div>
);
const SheetStat = ({ label, value, mono, icon }) => (
  <div style={{ padding: '10px 12px', background: 'var(--bg-inset)', borderRadius: 10, border: '1px solid var(--line)' }}>
    <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 3 }}>{label}</div>
    <div className={mono ? 'mono' : ''} style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
      {icon && <WEIcon name={icon} size={13} />}
      {value}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   Screen 4 — Exam runner (mid-exam)
   ───────────────────────────────────────────────────────────── */
const MRunnerExam = ({ onNext, onExit } = {}) => {
  const D = window.KILSAR_DATA;
  const q = D.sampleQuestions[2];
  const chosen = 'B';
  const total = 100;
  const idx = 23;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)', fontFamily: 'var(--font-ui)', color: 'var(--ink)' }}>
      {/* Exam top bar — dark */}
      <div style={{
        flexShrink: 0, padding: '50px 16px 12px',
        background: 'var(--ink)', color: 'var(--bg-elev)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.25)', color: 'inherit', borderRadius: 8, padding: '5px 10px', fontSize: 12.5, fontWeight: 500 }} onClick={onExit}>Save & Exit</button>
          <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, opacity: 0.7 }}>
              <WEIcon name="lock" size={11} />
              <span>Exam · Airframe</span>
            </div>
            <div className="mono" style={{ fontSize: 18, fontWeight: 600, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>1:42:18</div>
          </div>
          <div style={{ width: 64, textAlign: 'right', fontSize: 12.5, opacity: 0.8 }} className="mono">{idx + 1}/{total}</div>
        </div>
        <div style={{ marginTop: 10, height: 3, background: 'rgba(255,255,255,0.12)', borderRadius: 999 }}>
          <div style={{ width: `${((idx + 1) / total) * 100}%`, height: '100%', background: '#fff', borderRadius: 999 }} />
        </div>
      </div>

      {/* Question content */}
      <div className="scroll-y" style={{ flex: 1, overflowY: 'auto', padding: '20px 18px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span className="chip">{q.acs}</span>
          <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>{q.module}</span>
        </div>
        <div style={{ fontSize: 21, lineHeight: 1.4, marginBottom: 22, fontWeight: 500, letterSpacing: '-0.005em' }}>{q.stem}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {q.choices.map(c => {
            const selected = chosen === c.id;
            return (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '13px 14px',
                background: selected ? 'var(--bg-elev)' : 'var(--bg-elev)',
                border: `1px solid ${selected ? 'var(--ink)' : 'var(--line)'}`,
                borderRadius: 12,
                boxShadow: selected ? '0 0 0 3px rgba(11,15,20,0.06)' : 'none',
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  border: selected ? 0 : '1px solid var(--line-2)',
                  background: selected ? 'var(--ink)' : 'transparent',
                  color: selected ? 'var(--bg-elev)' : 'var(--ink-3)',
                  display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600,
                  flexShrink: 0,
                }}>{c.id}</div>
                <div style={{ fontSize: 14.5, lineHeight: 1.45, flex: 1 }}>{c.text}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{
        flexShrink: 0, padding: '12px 16px 28px',
        background: 'var(--bg-elev)', borderTop: '0.5px solid var(--line)',
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <button style={{
          width: 50, height: 44, borderRadius: 12, border: '1px solid var(--line-2)',
          background: 'var(--bg-elev)', color: 'var(--ink-3)',
          display: 'grid', placeItems: 'center',
        }}><WEIcon name="chev-l" size={16} /></button>
        <button style={{
          flex: 1, height: 44, borderRadius: 12, border: 0,
          background: 'var(--ink)', color: 'var(--bg-elev)',
          fontSize: 15, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }} onClick={onNext}>Next question <WEIcon name="arrow-r" size={15} /></button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Screen 5 — Results
   ───────────────────────────────────────────────────────────── */
const MResults = ({ onDone, onDrill, onRetake, tab, onTab } = {}) => {
  const correct = 78, total = 100;
  const score = correct / total;
  const passed = score >= 0.7;
  return (
    <MobileShell tab={tab} onTab={onTab}>
      <div style={{ padding: '8px 16px 0' }}>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 2,
          background: 'transparent', border: 0, color: 'var(--accent)',
          fontSize: 16, fontWeight: 400, padding: 0, marginBottom: 6,
        }} onClick={onDone}>
          <WEIcon name="chev-l" size={16} />Done
        </button>
      </div>

      {/* Hero score */}
      <div style={{ padding: '12px 16px 18px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 999,
          background: passed ? 'var(--good-soft)' : 'var(--bad-soft)',
          color: passed ? 'var(--good)' : 'var(--bad)',
          fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
          marginBottom: 14,
        }}>
          <WEIcon name={passed ? 'check' : 'x'} size={11} />
          {passed ? 'Passed' : 'Did not pass'} · Airframe
        </div>
        <div style={{ fontSize: 96, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.04em', color: passed ? 'var(--good)' : 'var(--bad)', fontVariantNumeric: 'tabular-nums' }}>
          {Math.round(score * 100)}<span style={{ fontSize: 36, color: 'var(--ink-3)' }}>%</span>
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 6 }}>
          {correct} of {total} correct · 70% to pass
        </div>
      </div>

      {/* Stat row */}
      <div style={{ padding: '0 16px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <WECard style={{ padding: '12px 12px' }}>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Correct</div>
          <div className="mono" style={{ fontSize: 17, fontWeight: 700, marginTop: 3 }}>78</div>
        </WECard>
        <WECard style={{ padding: '12px 12px' }}>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Time</div>
          <div className="mono" style={{ fontSize: 17, fontWeight: 700, marginTop: 3 }}>1:48:32</div>
        </WECard>
        <WECard style={{ padding: '12px 12px' }}>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Pace</div>
          <div className="mono" style={{ fontSize: 17, fontWeight: 700, marginTop: 3 }}>65s/q</div>
        </WECard>
      </div>

      <WESectionHead title="Where you lost points" />
      <div style={{ padding: '0 16px' }}>
        <WECard>
          {[
            { topic: 'Hydraulics & Pneumatics', acs: 'AF.II.A', missed: 6, total: 14 },
            { topic: 'Composites', acs: 'AF.I.C', missed: 5, total: 10 },
            { topic: 'Landing Gear', acs: 'AF.II.B', missed: 4, total: 12 },
            { topic: 'Ice & Rain Control', acs: 'AF.II.D', missed: 3, total: 6 },
          ].map((r, i, arr) => (
            <React.Fragment key={r.topic}>
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 500 }}>{r.topic}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span className="mono">{r.acs}</span>
                    <span>·</span>
                    <span>{r.missed} of {r.total} missed</span>
                  </div>
                </div>
                <div style={{ width: 60, height: 6, background: 'var(--bg-sunken)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${(r.missed / r.total) * 100}%`, height: '100%', background: 'var(--bad)' }} />
                </div>
              </div>
              {i < arr.length - 1 && <div style={{ height: 0.5, background: 'var(--line)', marginLeft: 16 }} />}
            </React.Fragment>
          ))}
        </WECard>
      </div>

      <div style={{ padding: '20px 16px 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button style={{
          width: '100%', height: 50, borderRadius: 14, border: 0,
          background: 'var(--ink)', color: 'var(--bg-elev)',
          fontSize: 16, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }} onClick={onDrill}>Drill 22 missed questions <WEIcon name="arrow-r" size={15} /></button>
        <button style={{
          width: '100%', height: 44, borderRadius: 14, border: '1px solid var(--line-2)',
          background: 'var(--bg-elev)', color: 'var(--ink)',
          fontSize: 15, fontWeight: 500,
        }} onClick={onRetake}>Retake same setup</button>
      </div>
    </MobileShell>
  );
};

/* ─────────────────────────────────────────────────────────────
   Screen 6 — History list
   ───────────────────────────────────────────────────────────── */
const MHistory = ({ tab, onTab, onBack } = {}) => {
  const items = (window.KILSAR_DATA.history || []).slice(0, 8);
  const fallback = items.length ? items : Array.from({ length: 6 }, (_, i) => ({
    id: `h-${i}`,
    date: ['May 10', 'May 8', 'May 5', 'May 2', 'Apr 28', 'Apr 24'][i],
    mode: i % 3 === 0 ? 'study' : 'exam',
    subject: ['Airframe', 'Powerplant', 'General', 'Airframe', 'Powerplant', 'General'][i],
    score: [0.78, 0.72, 0.81, 0.66, 0.74, 0.88][i],
    count: [100, 100, 60, 100, 100, 60][i],
    duration: ['1:48', '1:55', '52m', '2:00', '1:38', '41m'][i],
  }));
  return (
    <MobileShell tab={tab} onTab={onTab}>
      <MobileNav title="History" subtitle="Past attempts and progress over time." back="Exams" onBack={onBack} />

      <div style={{ padding: '0 16px 4px' }}>
        <Segment value="all" options={[{v:'all', l:'All'}, {v:'exam', l:'Exam'}, {v:'study', l:'Study'}]} />
      </div>

      <WESectionHead title="Recent attempts" />
      <div style={{ padding: '0 16px 28px' }}>
        <WECard>
          {fallback.map((h, i, arr) => {
            const isExam = h.mode === 'exam';
            const pass = (h.score || 0.7) >= 0.7;
            return (
              <React.Fragment key={h.id}>
                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: isExam ? 'var(--lock-soft)' : 'var(--accent-soft)',
                    color: isExam ? 'var(--lock)' : 'var(--accent)',
                    display: 'grid', placeItems: 'center',
                  }}>
                    <WEIcon name={isExam ? 'lock' : 'book'} size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{h.subject}</span>
                      {isExam && <span style={{ fontSize: 11, color: 'var(--lock)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Exam</span>}
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-3)', display: 'flex', gap: 8, marginTop: 2 }}>
                      <span>{h.date || ''}</span>
                      <span style={{ color: 'var(--ink-5)' }}>·</span>
                      <span className="mono">{h.count} Q</span>
                      <span style={{ color: 'var(--ink-5)' }}>·</span>
                      <span className="mono">{typeof h.duration === 'string' ? h.duration : ''}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="mono" style={{ fontSize: 17, fontWeight: 700, color: pass ? 'var(--good)' : 'var(--bad)' }}>{Math.round((h.score || 0.7) * 100)}%</div>
                  </div>
                  <WEIcon name="chev-r" size={14} style={{ color: 'var(--ink-5)' }} />
                </div>
                {i < arr.length - 1 && <div style={{ height: 0.5, background: 'var(--line)', marginLeft: 66 }} />}
              </React.Fragment>
            );
          })}
        </WECard>
      </div>
    </MobileShell>
  );
};

/* ─────────────────────────────────────────────────────────────
   Screen 7 — Progress dashboard
   ───────────────────────────────────────────────────────────── */
const MProgress = ({ tab, onTab, onBack } = {}) => {
  const subjects = [
    { name: 'Powerplant', mastery: 0.68, attempts: 14, color: 'var(--accent)' },
    { name: 'Airframe',   mastery: 0.72, attempts: 11, color: 'var(--good)' },
    { name: 'General',    mastery: 0.81, attempts: 8,  color: 'var(--warn)' },
  ];
  return (
    <MobileShell tab={tab} onTab={onTab}>
      <MobileNav title="Progress" subtitle="Your readiness across the three exams." back="Exams" onBack={onBack} />

      {/* Streak / overall */}
      <div style={{ padding: '4px 16px 0' }}>
        <WECard style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative', width: 70, height: 70 }}>
              <svg width="70" height="70" viewBox="0 0 70 70" style={{ position: 'absolute' }}>
                <circle cx="35" cy="35" r="30" stroke="var(--bg-sunken)" strokeWidth="6" fill="none" />
                <circle cx="35" cy="35" r="30" stroke="var(--good)" strokeWidth="6" fill="none"
                  strokeDasharray={`${0.74 * 188.5} 188.5`} strokeLinecap="round"
                  transform="rotate(-90 35 35)" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 17, fontWeight: 700 }}>74%</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Overall readiness</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>Up 6% this week · 12-day streak 🔥</div>
            </div>
          </div>
        </WECard>
      </div>

      <WESectionHead title="By exam" />
      <div style={{ padding: '0 16px' }}>
        <WECard>
          {subjects.map((s, i, arr) => (
            <React.Fragment key={s.name}>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{s.name}</span>
                  <span className="mono" style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 600 }}>{Math.round(s.mastery * 100)}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-sunken)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${s.mastery * 100}%`, height: '100%', background: s.color, borderRadius: 999 }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>{s.attempts} attempts · {s.mastery >= 0.75 ? 'ready for exam' : 'keep practicing'}</div>
              </div>
              {i < arr.length - 1 && <div style={{ height: 0.5, background: 'var(--line)', marginLeft: 16 }} />}
            </React.Fragment>
          ))}
        </WECard>
      </div>

      <WESectionHead title="Weakest areas" action="Drill all" />
      <div style={{ padding: '0 16px 28px' }}>
        <WECard>
          {[
            { topic: 'Theory of Operation', acs: 'PA.I.F', m: 0.49 },
            { topic: 'Composites', acs: 'AF.I.C', m: 0.51 },
            { topic: 'Pistons', acs: 'PA.I.D', m: 0.55 },
          ].map((r, i, arr) => (
            <React.Fragment key={r.topic}>
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warn)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 500 }}>{r.topic}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}><span className="mono">{r.acs}</span> · {Math.round(r.m * 100)}% mastery</div>
                </div>
                <WEIcon name="arrow-r" size={14} style={{ color: 'var(--ink-5)' }} />
              </div>
              {i < arr.length - 1 && <div style={{ height: 0.5, background: 'var(--line)', marginLeft: 36 }} />}
            </React.Fragment>
          ))}
        </WECard>
      </div>
    </MobileShell>
  );
};

Object.assign(window, {
  MSetupStudy, MSetupExam, MPreExamSheet, MRunnerExam, MResults, MHistory, MProgress,
});


// ── Written Exams mobile flow (folded in from 019df76f, re-themed) ──
function MWrittenExams({ onBack }) {
  const [tab, setTab] = React.useState('practice');
  const [mode, setMode] = React.useState('study');
  const [phase, setPhase] = React.useState('setup');
  if (phase === 'warning') return <MPreExamSheet onProceed={() => setPhase('runner')} onClose={() => setPhase('setup')} />;
  if (phase === 'runner') return <MRunnerExam onNext={() => setPhase('results')} onExit={() => setPhase('setup')} />;
  if (phase === 'results') return <MResults onDone={() => setPhase('setup')} onDrill={() => setPhase('runner')} onRetake={() => setPhase('setup')} />;
  const tp = { tab, onTab: setTab };
  if (tab === 'history') return <MHistory {...tp} onBack={onBack} />;
  if (tab === 'progress') return <MProgress {...tp} onBack={onBack} />;
  return mode === 'exam'
    ? <MSetupExam {...tp} onModeChange={setMode} onBegin={() => setPhase('warning')} onBack={onBack} />
    : <MSetupStudy {...tp} onModeChange={setMode} onBegin={() => setPhase('runner')} onBack={onBack} onGoHistory={() => setTab('history')} onGoProgress={() => setTab('progress')} />;
}
window.MWrittenExams = MWrittenExams;
