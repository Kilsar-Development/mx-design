/* @ds-bundle: {"format":3,"namespace":"MXDesignSystem_019df3","components":[],"sourceHashes":{"ui_kits/mobile/components.jsx":"f432385b95c9","ui_kits/mobile/home-screens.jsx":"d124bf0de063","ui_kits/mobile/ios-frame.jsx":"d67eb3ffe562","ui_kits/mobile/screens.jsx":"d7e4d0cbe02d","ui_kits/shared/kls-icon.jsx":"c2bbf4d1af19","ui_kits/web/browser-window.jsx":"810a9c80aba0","ui_kits/web/chrome.jsx":"3f748096f4ae","ui_kits/web/home-dashboard.jsx":"77f79fcabf13","ui_kits/web/screens.jsx":"175088d5c71b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MXDesignSystem_019df3 = window.MXDesignSystem_019df3 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/mobile/components.jsx
try { (() => {
// components.jsx — shared mobile UI primitives, scoped under window.KLS
// All colors flow through token vars so light/dark switching is automatic.
const {
  useState
} = React;

// ---- Icon ----
// Uses the shared KlsIcon component (imported via shared/kls-icon.jsx).
// Falls back to a small token-colored circle if the icon name is unknown.
function Icon({
  name,
  size = 24,
  color = "currentColor",
  style = {}
}) {
  // Map a few legacy heroicons-style names to the KLS icon names.
  const aliasMap = {
    "chevron-right": "chevronRight",
    "chevron-down": "chevronDown",
    "chevron-left": "chevronRight",
    // we only have one chevron set; CSS rotates if needed
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
    "home": "modulesLarge"
  };
  const klsName = aliasMap[name] || name;
  if (typeof KlsIcon !== "undefined") {
    return /*#__PURE__*/React.createElement(KlsIcon, {
      name: klsName,
      size: size,
      color: color === "currentColor" ? undefined : color,
      style: style
    });
  }
  // Fallback dot
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: size,
      height: size,
      borderRadius: 999,
      background: color === "currentColor" ? "var(--kls-on-surface)" : color,
      opacity: 0.4,
      ...style
    }
  });
}

// ---- Button ----
function Button({
  children,
  variant = "primary",
  size = "lg",
  onClick,
  leadingIcon,
  trailingIcon,
  disabled
}) {
  const sizes = {
    lg: {
      h: 48,
      fs: 16,
      px: "var(--kls-space-med)",
      lh: 24
    },
    md: {
      h: 40,
      fs: 14,
      px: "var(--kls-space-small)",
      lh: 20
    },
    sm: {
      h: 32,
      fs: 13,
      px: "var(--kls-space-small)",
      lh: 18
    }
  };
  const variants = {
    primary: {
      bg: "var(--kls-primary)",
      fg: "var(--kls-on-primary)"
    },
    secondary: {
      bg: "var(--kls-secondary-container)",
      fg: "var(--kls-on-secondary-container)"
    },
    tertiary: {
      bg: "var(--kls-surface)",
      fg: "var(--kls-on-surface)",
      border: "1px solid var(--kls-outline)"
    },
    destructive: {
      bg: "var(--kls-error)",
      fg: "var(--kls-on-error)"
    },
    link: {
      bg: "transparent",
      fg: "var(--kls-on-surface)"
    }
  };
  const s = sizes[size];
  const v = variants[variant];
  return /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: onClick,
    style: {
      height: s.h,
      padding: `0 ${s.px}`,
      fontSize: s.fs,
      lineHeight: `${s.lh}px`,
      fontWeight: 500,
      fontFamily: "Plus Jakarta Sans",
      background: disabled ? "var(--kls-surface-container-low)" : v.bg,
      color: disabled ? "var(--kls-content-disabled)" : v.fg,
      border: v.border || "none",
      borderRadius: 8,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--kls-space-xsmall)",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "background 120ms"
    }
  }, leadingIcon && /*#__PURE__*/React.createElement(Icon, {
    name: leadingIcon,
    size: s.fs + 4,
    color: v.fg
  }), children, trailingIcon && /*#__PURE__*/React.createElement(Icon, {
    name: trailingIcon,
    size: s.fs + 4,
    color: v.fg
  }));
}

// ---- Pill ----
function Pill({
  children,
  variant = "grey",
  size = "md"
}) {
  // All variants flow through accent / status containers so they re-tint in dark.
  const variants = {
    green: {
      bg: "var(--kls-success-container)",
      fg: "var(--kls-on-success-container)"
    },
    blue: {
      bg: "var(--kls-info-container)",
      fg: "var(--kls-on-info-container)"
    },
    red: {
      bg: "var(--kls-error-container)",
      fg: "var(--kls-on-error-container)"
    },
    amber: {
      bg: "var(--kls-progress-container)",
      fg: "var(--kls-on-progress-container)"
    },
    violet: {
      bg: "var(--kls-accent-13)",
      fg: "var(--kls-accent-12)"
    },
    grey: {
      bg: "var(--kls-tertiary)",
      fg: "var(--kls-on-surface-variant)"
    },
    dark: {
      bg: "var(--kls-primary)",
      fg: "var(--kls-on-primary)"
    }
  };
  const v = variants[variant];
  const sz = size === "sm" ? {
    h: 20,
    fs: 11,
    px: "var(--kls-space-xsmall)"
  } : {
    h: 24,
    fs: 12,
    px: "var(--kls-space-small)"
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      height: sz.h,
      padding: `0 ${sz.px}`,
      borderRadius: 999,
      background: v.bg,
      color: v.fg,
      fontSize: sz.fs,
      fontWeight: 600,
      fontFamily: "Plus Jakarta Sans"
    }
  }, children);
}

// ---- Avatar ----
function Avatar({
  initials,
  size = 40,
  dark = false,
  dot = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flexShrink: 0,
      width: size,
      height: size,
      borderRadius: 999,
      background: dark ? "var(--kls-primary)" : "var(--kls-tertiary-container)",
      color: dark ? "var(--kls-on-primary)" : "var(--kls-on-surface-variant)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: size * 0.36,
      fontFamily: "Plus Jakarta Sans"
    }
  }, initials, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: -2,
      bottom: -2,
      width: size * 0.28,
      height: size * 0.28,
      borderRadius: 999,
      background: "var(--kls-success)",
      border: "2px solid var(--kls-surface)"
    }
  }));
}

// ---- ListRow ----
function ListRow({
  avatar,
  title,
  sub,
  badge,
  onClick,
  last
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      gap: "var(--kls-space-small)",
      padding: "var(--kls-space-small) var(--kls-space-med)",
      borderBottom: last ? "none" : "1px solid var(--kls-outline-variant)",
      alignItems: "center",
      cursor: onClick ? "pointer" : "default"
    }
  }, avatar, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--kls-space-tiny)",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--kls-space-xsmall)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: "var(--kls-on-surface)",
      fontFamily: "Plus Jakarta Sans"
    }
  }, title), badge && /*#__PURE__*/React.createElement(Pill, {
    variant: "red",
    size: "sm"
  }, badge)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: "var(--kls-on-surface-variant)",
      fontFamily: "Plus Jakarta Sans",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, sub)), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 18,
    color: "var(--kls-content-quaternary)"
  }));
}

// ---- Card ----
function Card({
  children,
  padding = "var(--kls-space-med)",
  style = {},
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      background: "var(--kls-surface)",
      borderRadius: 16,
      overflow: "hidden",
      cursor: onClick ? "pointer" : "default",
      ...style
    }
  }, children);
}

// ---- ProgressBar ----
function ProgressBar({
  value = 0.4
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      borderRadius: 2,
      background: "var(--kls-surface-container-low)",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: `0 ${(1 - value) * 100}% 0 0`,
      background: "var(--kls-primary)"
    }
  }));
}

// ---- Input ----
function Input({
  value,
  onChange,
  placeholder,
  label,
  error
}) {
  const [focused, setFocused] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--kls-space-xsmall)"
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: error ? "var(--kls-error)" : "var(--kls-on-surface)",
      fontFamily: "Plus Jakarta Sans"
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      background: focused || error ? "var(--kls-surface)" : "var(--kls-tertiary)",
      border: `1px solid ${error ? "var(--kls-error)" : focused ? "var(--kls-primary)" : "transparent"}`,
      borderRadius: 8,
      padding: "var(--kls-space-small) var(--kls-space-small)",
      outline: "none",
      fontSize: 14,
      fontWeight: 500,
      color: error ? "var(--kls-error)" : "var(--kls-on-surface)",
      fontFamily: "Plus Jakarta Sans"
    }
  }), error && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--kls-error)"
    }
  }, error));
}

// ---- TopBar ----
function TopBar({
  title,
  leading,
  trailing
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      padding: "0 var(--kls-space-med)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "var(--kls-appbar-bg)",
      color: "var(--kls-appbar-fg)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40
    }
  }, leading), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      fontFamily: "Plus Jakarta Sans"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      display: "flex",
      justifyContent: "flex-end"
    }
  }, trailing));
}

// ---- BottomNav ----
function BottomNav({
  active,
  onChange,
  unread = 0
}) {
  const items = [{
    id: "home",
    label: "Home",
    icon: "home"
  }, {
    id: "workspace",
    label: "Workspace",
    icon: "squares-2x2"
  }, {
    id: "orion",
    label: "Orion",
    icon: "sparkles"
  }, {
    id: "notifications",
    label: "Notifications",
    icon: "bell",
    badge: unread
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--kls-surface)",
      borderTop: "1px solid var(--kls-tertiary)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      padding: "0 0 var(--kls-space-xsmall)"
    }
  }, items.map(it => {
    const isActive = active === it.id;
    const iconColor = isActive ? "var(--kls-on-surface)" : "var(--kls-on-surface-variant)";
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      onClick: () => onChange(it.id),
      style: {
        background: "transparent",
        border: "none",
        padding: "var(--kls-space-xsmall) 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--kls-space-tiny)",
        cursor: "pointer",
        fontFamily: "var(--kls-font-sans)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "relative",
        display: "inline-flex"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: it.icon,
      size: 32,
      color: iconColor
    }), it.badge > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        top: -2,
        right: -6,
        minWidth: 16,
        height: 16,
        padding: "0 var(--kls-space-tiny)",
        background: "var(--kls-error)",
        color: "var(--kls-on-error)",
        borderRadius: 8,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--kls-font-sans)",
        fontSize: 10,
        fontWeight: 600,
        lineHeight: 1
      }
    }, it.badge)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 500,
        color: iconColor
      }
    }, it.label));
  })));
}
window.KLS = {
  Icon,
  Button,
  Pill,
  Avatar,
  ListRow,
  Card,
  ProgressBar,
  Input,
  TopBar,
  BottomNav
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/home-screens.jsx
try { (() => {
// home-screens.jsx — Authentic mobile screens from the Kilsar Flutter app.
//
// Implements three real screens:
//   • SplashScreen        — boot screen with splash.png bg + white wordmark
//   • HomeScreenEmpty     — first-run state shown when user has no terms
//   • HomeScreenPopulated — populated dashboard with sections
//
// All copy that depends on workspace flavor (Education vs Commercial) is
// drawn from a `flavor` prop, mirroring how `WorkspaceSettings.getString(...)`
// works in production. Pass `flavor="education"` or `flavor="commercial"`.
//
// Dependencies: components.jsx (TopBar, Icon, Card, Pill, Avatar, ListRow,
// Button, ProgressBar) and shared/kls-icon.jsx (KlsIcon).

const {
  useState: useStateHome
} = React;

// ── Flavor copy table ────────────────────────────────────────────
// Mirrors WorkspaceSettings keys used in home_screen.dart:
//   termsKey, termKey, viewerKey, coursesKey, assignmentsKey, ticketsKey
const FLAVORS = {
  education: {
    workspaceName: "Acme Aviation Co.",
    termsKey: "Courses",
    termKey: "Course",
    viewerKey: "Student",
    coursesKey: "Modules",
    assignmentsKey: "Assignments",
    ticketsKey: "Tickets"
  },
  commercial: {
    workspaceName: "Acme Operations",
    termsKey: "Cases",
    termKey: "Case",
    viewerKey: "Operator",
    coursesKey: "Workflows",
    assignmentsKey: "Tasks",
    ticketsKey: "Tickets"
  }
};
function getFlavor(name) {
  return FLAVORS[name] || FLAVORS.education;
}

// ── Splash ───────────────────────────────────────────────────────
// Matches splash_screen.dart: full-bleed splash.png + centered white wordmark.
function SplashScreen() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      height: "100%",
      background: `url("../../assets/images/splash.png") center/cover no-repeat var(--kls-on-surface)`,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(KlsIcon, {
    path: "../../assets/images/splashLogo.png",
    size: undefined,
    color: "var(--kls-color-neutral-50)",
    style: {
      width: 180,
      height: 44,
      backgroundColor: "var(--kls-color-neutral-50)",
      WebkitMask: 'url("../../assets/images/splashLogo.png") center/contain no-repeat',
      mask: 'url("../../assets/images/splashLogo.png") center/contain no-repeat'
    }
  })));
}

// ── Home: Empty state ────────────────────────────────────────────
// Matches _buildEmptyStatePage in home_screen.dart:
//   • Header row (workspace logo + spoof banner + profile avatar)
//   • Big circular hero (180×180) with airplane icon + accent4 glow
//   • Welcome heading
//   • Flavor-specific subtitle ("not enrolled in any <termsKey>")
//   • Two action cards: "Get Started" + "Explore"
function HomeScreenEmpty({
  flavor = "education",
  showSpoofBanner = false,
  userName = "Claire"
}) {
  const f = getFlavor(flavor);
  const isStudent = true;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--kls-scaffold-bg)",
      padding: "0 var(--kls-space-xsmall)"
    }
  }, /*#__PURE__*/React.createElement(HomeHeader, {
    flavor: flavor,
    showSpoofBanner: showSpoofBanner
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 var(--kls-space-med)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 180,
      height: 180,
      borderRadius: "50%",
      background: "linear-gradient(135deg, color-mix(in oklab, var(--kls-accent-4) 15%, transparent), color-mix(in oklab, var(--kls-accent-2) 10%, transparent))",
      border: "2px solid color-mix(in oklab, var(--kls-accent-4) 30%, transparent)",
      boxShadow: "0 0 30px 5px color-mix(in oklab, var(--kls-accent-4) 20%, transparent)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(KlsIcon, {
    name: "kilsar",
    size: 90,
    color: "var(--kls-accent-4)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: "var(--kls-h2-size, 24px)",
      fontWeight: "var(--kls-h2-weight, 700)",
      color: "var(--kls-on-surface)",
      textAlign: "center",
      lineHeight: 1.2
    }
  }, "Welcome, ", userName, "!"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: "var(--kls-body-large-size, 16px)",
      fontWeight: 400,
      color: "var(--kls-on-surface-variant)",
      textAlign: "center",
      padding: "0 var(--kls-space-med)",
      lineHeight: 1.4
    }
  }, isStudent ? `You're not enrolled in any ${f.termsKey.toLowerCase()} yet` : `You don't have any ${f.viewerKey.toLowerCase()}s enrolled yet`), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 32
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--kls-space-xsmall)",
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(ActionCard, {
    iconName: "modulesLarge",
    title: "Get Started",
    subtitle: isStudent ? "View your home screen" : "View your dashboard",
    accent: "var(--kls-accent-1)"
  }), /*#__PURE__*/React.createElement(ActionCard, {
    iconName: "circles",
    title: "Explore",
    subtitle: "Browse the workspace",
    accent: "var(--kls-accent-4)"
  }))));
}
function ActionCard({
  iconName,
  title,
  subtitle,
  accent
}) {
  return /*#__PURE__*/React.createElement("button", {
    style: {
      flex: 1,
      height: 140,
      padding: "var(--kls-space-xsmall)",
      background: "linear-gradient(135deg, var(--kls-surface), var(--kls-surface-container-low))",
      border: "none",
      borderRadius: 16,
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      textAlign: "left",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 8,
      background: accent,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(KlsIcon, {
    name: iconName,
    size: 24,
    color: "var(--kls-on-primary)"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: 14,
      fontWeight: 700,
      color: "var(--kls-on-surface)"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: 12,
      fontWeight: 400,
      color: "var(--kls-on-surface-variant)",
      lineHeight: 1.3
    }
  }, subtitle)));
}

// ── Home: Populated state ────────────────────────────────────────
// Matches _buildHomePage in home_screen.dart:
//   header → PendingReview/ContinueWorking → ActiveTerms → Todo
function HomeScreenPopulated({
  flavor = "education",
  showSpoofBanner = false,
  isStudent = true
}) {
  const f = getFlavor(flavor);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--kls-scaffold-bg)",
      padding: "0 var(--kls-space-xsmall)"
    }
  }, /*#__PURE__*/React.createElement(HomeHeader, {
    flavor: flavor,
    showSpoofBanner: showSpoofBanner
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto",
      padding: "var(--kls-space-med) var(--kls-space-xsmall)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--kls-space-med)"
    }
  }, isStudent ? /*#__PURE__*/React.createElement(ContinueWorkingSection, {
    flavor: flavor
  }) : /*#__PURE__*/React.createElement(PendingReviewSection, {
    flavor: flavor
  }), /*#__PURE__*/React.createElement(ActiveTermsSection, {
    flavor: flavor
  }), /*#__PURE__*/React.createElement(TodoListSection, {
    flavor: flavor
  })));
}

// ── Sections ─────────────────────────────────────────────────────
function SectionHeader({
  title,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 var(--kls-space-xsmall)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: "var(--kls-subtitle-medium-size, 18px)",
      fontWeight: "var(--kls-subtitle-medium-weight, 600)",
      color: "var(--kls-on-surface)"
    }
  }, title), action && /*#__PURE__*/React.createElement("button", {
    style: {
      background: "transparent",
      border: "none",
      padding: 0,
      cursor: "pointer",
      fontFamily: "var(--kls-font-sans)",
      fontSize: 13,
      fontWeight: 600,
      color: "var(--kls-primary)"
    }
  }, action));
}
function ContinueWorkingSection({
  flavor
}) {
  const f = getFlavor(flavor);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--kls-space-xsmall)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    title: "Continue working",
    action: "View all"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--kls-surface)",
      borderRadius: 12,
      padding: "var(--kls-space-med)",
      border: "1px solid var(--kls-outline-variant)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--kls-space-small)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 8,
      background: "var(--kls-accent-1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(KlsIcon, {
    name: "modulesLarge",
    size: 22,
    color: "var(--kls-on-primary)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--kls-on-surface)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, flavor === "education" ? "Multi-engine systems" : "Pre-flight ground checks"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: 12,
      color: "var(--kls-on-surface-variant)",
      marginTop: "var(--kls-space-tiny)"
    }
  }, flavor === "education" ? "Module 4 of 7 · 64% complete" : "Step 2 of 5 · in progress"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      background: "var(--kls-tertiary)",
      borderRadius: 2,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: flavor === "education" ? "64%" : "40%",
      height: "100%",
      background: "var(--kls-primary)"
    }
  }))))));
}
function PendingReviewSection({
  flavor
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--kls-space-xsmall)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    title: "Pending review",
    action: "View all"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--kls-surface)",
      borderRadius: 12,
      padding: "var(--kls-space-xsmall) 0",
      border: "1px solid var(--kls-outline-variant)"
    }
  }, [{
    initials: "JM",
    name: "Jamal Morris",
    sub: "Awaiting review · 12:08",
    flag: "amber"
  }, {
    initials: "SK",
    name: "Sana Kapoor",
    sub: "Submitted · 11:42",
    flag: "amber"
  }].map((r, i, arr) => /*#__PURE__*/React.createElement("div", {
    key: r.initials,
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--kls-space-small)",
      padding: "var(--kls-space-small) var(--kls-space-med)",
      borderBottom: i < arr.length - 1 ? "1px solid var(--kls-tertiary)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: "var(--kls-on-surface)",
      color: "var(--kls-color-neutral-50)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--kls-font-sans)",
      fontSize: 11,
      fontWeight: 700
    }
  }, r.initials), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: 14,
      fontWeight: 500,
      color: "var(--kls-on-surface)"
    }
  }, r.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: 12,
      color: "var(--kls-on-surface-variant)",
      marginTop: "var(--kls-space-tiny)"
    }
  }, r.sub)), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: "var(--kls-space-tiny) var(--kls-space-xsmall)",
      borderRadius: 999,
      background: "var(--kls-progress-container)",
      color: "var(--kls-on-progress-container)",
      fontFamily: "var(--kls-font-sans)",
      fontSize: 11,
      fontWeight: 600
    }
  }, "Review")))));
}
function ActiveTermsSection({
  flavor
}) {
  const f = getFlavor(flavor);
  const items = flavor === "education" ? [{
    title: "Spring 2025 — Private Pilot",
    sub: "12 students · 6 modules",
    state: "Active"
  }, {
    title: "Multi-Engine Bridge",
    sub: "5 students · 4 modules",
    state: "Active"
  }] : [{
    title: "Q1 Inspection — N42KL",
    sub: "8 tasks · 3 open",
    state: "Active"
  }, {
    title: "Engine Overhaul — N115DB",
    sub: "12 tasks · 7 open",
    state: "Active"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--kls-space-xsmall)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    title: `Active ${f.termsKey.toLowerCase()}`,
    action: "View all"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--kls-space-xsmall)",
      overflowX: "auto",
      padding: "0 var(--kls-space-xsmall) var(--kls-space-tiny)",
      margin: "0 -8px"
    }
  }, items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.title,
    style: {
      flex: "none",
      width: 240,
      background: "var(--kls-surface)",
      borderRadius: 12,
      padding: "var(--kls-space-small)",
      border: "1px solid var(--kls-outline-variant)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--kls-space-xsmall)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: "flex-start",
      padding: "var(--kls-space-tiny) var(--kls-space-xsmall)",
      borderRadius: 999,
      background: "var(--kls-success-container)",
      color: "var(--kls-on-success-container)",
      fontFamily: "var(--kls-font-sans)",
      fontSize: 11,
      fontWeight: 600
    }
  }, it.state), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--kls-on-surface)"
    }
  }, it.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: 12,
      color: "var(--kls-on-surface-variant)"
    }
  }, it.sub)))));
}
function TodoListSection({
  flavor
}) {
  const f = getFlavor(flavor);
  const items = flavor === "education" ? [{
    label: "Grade Aysha's flight log",
    due: "Today"
  }, {
    label: "Approve module 4 quiz",
    due: "Tomorrow"
  }, {
    label: "Schedule check-ride for Mateo",
    due: "Fri"
  }] : [{
    label: "Sign off on N42KL inspection",
    due: "Today"
  }, {
    label: "Order replacement gasket",
    due: "Tomorrow"
  }, {
    label: "Review Tomás's incident report",
    due: "Fri"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--kls-space-xsmall)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    title: "To-do"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--kls-surface)",
      borderRadius: 12,
      padding: "var(--kls-space-tiny) 0",
      border: "1px solid var(--kls-outline-variant)"
    }
  }, items.map((it, i, arr) => /*#__PURE__*/React.createElement("div", {
    key: it.label,
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--kls-space-small)",
      padding: "var(--kls-space-small) var(--kls-space-med)",
      borderBottom: i < arr.length - 1 ? "1px solid var(--kls-tertiary)" : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: 4,
      border: "2px solid var(--kls-outline)",
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontFamily: "var(--kls-font-sans)",
      fontSize: 14,
      color: "var(--kls-on-surface)"
    }
  }, it.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: 11,
      fontWeight: 600,
      color: "var(--kls-on-surface-variant)"
    }
  }, it.due)))));
}

// ── Header (used by both empty + populated) ──────────────────────
function HomeHeader({
  flavor,
  showSpoofBanner = false
}) {
  const f = getFlavor(flavor);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "var(--kls-space-small) var(--kls-space-xsmall) var(--kls-space-tiny)",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 40,
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/images/splashLogo.png",
    alt: "Kilsar",
    style: {
      height: 26,
      width: "auto",
      display: "block"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--kls-space-xsmall)"
    }
  }, showSpoofBanner && /*#__PURE__*/React.createElement("span", {
    style: {
      padding: "var(--kls-space-tiny) var(--kls-space-small)",
      borderRadius: 6,
      background: "var(--kls-accent-5)",
      color: "var(--kls-accent-4)",
      fontFamily: "var(--kls-font-sans)",
      fontSize: 11,
      fontWeight: 600
    }
  }, f.viewerKey, " Mode"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: "var(--kls-tertiary-container)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--kls-font-sans)",
      fontSize: 12,
      fontWeight: 600,
      color: "var(--kls-on-surface)",
      border: "1px solid var(--kls-outline-variant)"
    }
  }, "CR")));
}

// Export
window.KLS_HOME = {
  SplashScreen,
  HomeScreenEmpty,
  HomeScreenPopulated,
  FLAVORS
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/home-screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/ios-frame.jsx
try { (() => {
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports: IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      borderRadius: 48,
      overflow: 'hidden',
      position: 'relative',
      background: dark ? '#000' : '#F2F2F7',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: '-apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 11,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 126,
      height: 37,
      borderRadius: 24,
      background: '#000',
      zIndex: 50
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(IOSStatusBar, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
    title: title,
    dark: dark
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto'
    }
  }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      height: 34,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: 8,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 139,
      height: 5,
      borderRadius: 100,
      background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
    }
  })));
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/ios-frame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/screens.jsx
try { (() => {
// screens.jsx — Kilsar mobile screens
const {
  useState: useStateScreens
} = React;
function HomeScreen({
  go
}) {
  const {
    TopBar,
    Icon,
    Card,
    Pill,
    Avatar,
    ListRow,
    ProgressBar,
    Button
  } = window.KLS;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--kls-scaffold-bg)"
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    title: "Today",
    leading: /*#__PURE__*/React.createElement("button", {
      style: {
        background: "transparent",
        border: "none",
        padding: 0
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      initials: "CR",
      dark: true,
      size: 32
    })),
    trailing: /*#__PURE__*/React.createElement(Icon, {
      name: "bell",
      size: 22,
      color: "var(--kls-on-surface)"
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto",
      padding: "var(--kls-space-med)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--kls-space-med)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: ".06em",
      textTransform: "uppercase",
      color: "var(--kls-on-surface-variant)",
      fontFamily: "Plus Jakarta Sans",
      marginBottom: "var(--kls-space-xsmall)"
    }
  }, "Good morning, Claire"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 600,
      color: "var(--kls-on-surface)",
      fontFamily: "Plus Jakarta Sans",
      lineHeight: "32px"
    }
  }, "3 calibrations", /*#__PURE__*/React.createElement("br", null), "scheduled today")), /*#__PURE__*/React.createElement(Card, {
    onClick: () => go("calibration")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--kls-space-med)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--kls-space-xsmall)"
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    variant: "green"
  }, "Active"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 500,
      color: "var(--kls-on-surface)",
      fontFamily: "Plus Jakarta Sans"
    }
  }, "Calibration sequence A2"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--kls-space-small)",
      fontSize: 12,
      color: "var(--kls-on-surface-variant)",
      fontFamily: "Plus Jakarta Sans"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--kls-space-tiny)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 14,
    color: "var(--kls-on-surface-variant)"
  }), " 12 min"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--kls-space-tiny)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle",
    size: 14,
    color: "var(--kls-on-surface-variant)"
  }), " 4 steps"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--kls-tertiary)",
      padding: "var(--kls-space-small) var(--kls-space-med)"
    }
  }, /*#__PURE__*/React.createElement(ProgressBar, {
    value: 0.4
  }))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--kls-space-med)",
      display: "flex",
      alignItems: "center",
      gap: "var(--kls-space-small)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: "var(--kls-on-surface-variant)",
      fontFamily: "Plus Jakarta Sans"
    }
  }, "STEP 1 OF 4"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 500,
      color: "var(--kls-on-surface)",
      marginTop: "var(--kls-space-tiny)",
      fontFamily: "Plus Jakarta Sans"
    }
  }, "Pre-flight checks"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--kls-space-xsmall)",
      marginTop: "var(--kls-space-xsmall)"
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    variant: "blue",
    size: "sm"
  }, "Audio"), /*#__PURE__*/React.createElement(Pill, {
    variant: "grey",
    size: "sm"
  }, "Video"))), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 20,
    color: "var(--kls-content-quaternary)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--kls-surface)",
      borderRadius: 16,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--kls-space-small) var(--kls-space-med) var(--kls-space-tiny)",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: ".06em",
      textTransform: "uppercase",
      color: "var(--kls-on-surface-variant)",
      fontFamily: "Plus Jakarta Sans"
    }
  }, "Recent"), /*#__PURE__*/React.createElement(ListRow, {
    avatar: /*#__PURE__*/React.createElement(Avatar, {
      initials: "JM"
    }),
    title: "Jamal Morris",
    sub: "Exam logs \xB7 12:08",
    badge: "3"
  }), /*#__PURE__*/React.createElement(ListRow, {
    avatar: /*#__PURE__*/React.createElement(Avatar, {
      initials: "SK"
    }),
    title: "Sana Kapoor",
    sub: "Awaiting review"
  }), /*#__PURE__*/React.createElement(ListRow, {
    avatar: /*#__PURE__*/React.createElement(Avatar, {
      initials: "MO"
    }),
    title: "Mateo Oliveira",
    sub: "Onboarding \xB7 step 3 of 4",
    last: true
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    leadingIcon: "plus"
  }, "New session")));
}
function ExamListScreen({
  go
}) {
  const {
    TopBar,
    Icon,
    ListRow,
    Avatar,
    Pill
  } = window.KLS;
  const [tab, setTab] = useStateScreens("today");
  const tabs = [["today", "Today"], ["week", "Week"], ["month", "Month"], ["all", "All"]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--kls-scaffold-bg)"
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    title: "Exams",
    leading: /*#__PURE__*/React.createElement(Icon, {
      name: "bars-3",
      size: 22,
      color: "var(--kls-on-surface)"
    }),
    trailing: /*#__PURE__*/React.createElement(Icon, {
      name: "funnel",
      size: 22,
      color: "var(--kls-on-surface)"
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--kls-space-small)",
      display: "flex",
      gap: "var(--kls-space-xsmall)",
      overflow: "auto"
    }
  }, tabs.map(([id, label]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setTab(id),
    style: {
      padding: "var(--kls-space-xsmall) var(--kls-space-small)",
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 600,
      background: tab === id ? "var(--kls-on-surface)" : "var(--kls-tertiary)",
      color: tab === id ? "var(--kls-surface)" : "var(--kls-on-surface-variant)",
      border: "none",
      cursor: "pointer",
      fontFamily: "Plus Jakarta Sans",
      flexShrink: 0
    }
  }, label))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto"
    }
  }, [["CR", "Claire Renault", "Calibration A2 · 14:32", "green", "In progress"], ["JM", "Jamal Morris", "Skills test · pending", "amber", "Review"], ["SK", "Sana Kapoor", "Calibration B1 · 11:00", "grey", "Scheduled"], ["MO", "Mateo Oliveira", "Onboarding · 09:42", "blue", "Step 3/4"], ["AR", "Aysha Ramos", "Exam complete", "green", "Passed"], ["TF", "Tomás Fonseca", "Exam · 08:15", "red", "Failed"]].map(([i, n, s, v, t], idx, arr) => /*#__PURE__*/React.createElement(ListRow, {
    key: i,
    avatar: /*#__PURE__*/React.createElement(Avatar, {
      initials: i,
      dark: idx === 0
    }),
    title: n,
    sub: s,
    last: idx === arr.length - 1
  }))));
}
function CalibrationScreen({
  go
}) {
  const {
    TopBar,
    Icon,
    Card,
    Pill,
    Button,
    ProgressBar
  } = window.KLS;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--kls-scaffold-bg)"
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    title: "Calibration",
    leading: /*#__PURE__*/React.createElement("button", {
      onClick: () => go("home"),
      style: {
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-left",
      size: 24,
      color: "var(--kls-on-surface)"
    })),
    trailing: /*#__PURE__*/React.createElement(Icon, {
      name: "ellipsis-horizontal",
      size: 22,
      color: "var(--kls-on-surface)"
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--kls-space-xsmall) var(--kls-space-med) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: "var(--kls-on-surface-variant)",
      letterSpacing: ".06em",
      fontFamily: "Plus Jakarta Sans"
    }
  }, "STEP 2 OF 4"), /*#__PURE__*/React.createElement(ProgressBar, {
    value: 0.5
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "var(--kls-space-med)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--kls-space-med)",
      overflow: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Pill, {
    variant: "green"
  }, "Active"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 600,
      color: "var(--kls-on-surface)",
      fontFamily: "Plus Jakarta Sans",
      lineHeight: "32px",
      marginTop: "var(--kls-space-small)"
    }
  }, "Audio calibration"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 400,
      color: "var(--kls-content-secondary)",
      fontFamily: "Plus Jakarta Sans",
      marginTop: "var(--kls-space-xsmall)",
      lineHeight: "20px"
    }
  }, "Speak the displayed phrase clearly. We will measure ambient noise and microphone signal.")), /*#__PURE__*/React.createElement(Card, {
    style: {
      border: "1px solid var(--kls-outline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--kls-space-med)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--kls-space-small)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "microphone",
    size: 32,
    color: "var(--kls-on-surface)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 500,
      color: "var(--kls-on-surface)",
      textAlign: "center",
      fontFamily: "Plus Jakarta Sans",
      lineHeight: "26px"
    }
  }, "\"The quiet morning fog drifted across the harbor.\""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--kls-space-xsmall)",
      marginTop: "var(--kls-space-tiny)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 999,
      background: "var(--kls-success)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: "var(--kls-success)",
      fontFamily: "Plus Jakarta Sans"
    }
  }, "Listening \xB7 \u201332 dB")))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--kls-tertiary)",
      borderRadius: 12,
      padding: "var(--kls-space-small)",
      display: "flex",
      gap: "var(--kls-space-small)",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "information-circle",
    size: 18,
    color: "var(--kls-content-secondary)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--kls-content-secondary)",
      lineHeight: "18px",
      fontFamily: "Plus Jakarta Sans"
    }
  }, "If your mic level stays below \u201350 dB, move to a quieter room and try again.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--kls-space-xsmall)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "tertiary",
    size: "lg"
  }, "Retry"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    trailingIcon: "arrow-right"
  }, "Continue")))));
}
function ProfileScreen({
  go
}) {
  const {
    TopBar,
    Icon,
    Avatar,
    ListRow,
    Pill,
    Button
  } = window.KLS;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--kls-scaffold-bg)"
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    title: "Profile",
    leading: /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-left",
      size: 24,
      color: "var(--kls-on-surface)"
    }),
    trailing: /*#__PURE__*/React.createElement(Icon, {
      name: "cog-6-tooth",
      size: 22,
      color: "var(--kls-on-surface)"
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--kls-space-med) var(--kls-space-med) var(--kls-space-med)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--kls-space-small)",
      borderBottom: "1px solid var(--kls-outline-variant)"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    initials: "CR",
    dark: true,
    size: 72,
    dot: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 600,
      color: "var(--kls-on-surface)",
      fontFamily: "Plus Jakarta Sans"
    }
  }, "Claire Renault"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--kls-on-surface-variant)",
      fontFamily: "Plus Jakarta Sans"
    }
  }, "Operator \xB7 ID 04A2"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--kls-space-xsmall)",
      marginTop: "var(--kls-space-tiny)"
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    variant: "violet"
  }, "Premium"), /*#__PURE__*/React.createElement(Pill, {
    variant: "green"
  }, "Verified"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto"
    }
  }, /*#__PURE__*/React.createElement(ListRow, {
    avatar: /*#__PURE__*/React.createElement(Icon, {
      name: "clipboard-document-list",
      size: 22,
      color: "var(--kls-on-surface)"
    }),
    title: "Exam logs",
    sub: "42 sessions \xB7 last today"
  }), /*#__PURE__*/React.createElement(ListRow, {
    avatar: /*#__PURE__*/React.createElement(Icon, {
      name: "archive-box",
      size: 22,
      color: "var(--kls-on-surface)"
    }),
    title: "Library",
    sub: "6 saved tests"
  }), /*#__PURE__*/React.createElement(ListRow, {
    avatar: /*#__PURE__*/React.createElement(Icon, {
      name: "bell",
      size: 22,
      color: "var(--kls-on-surface)"
    }),
    title: "Notifications",
    sub: "Push, email"
  }), /*#__PURE__*/React.createElement(ListRow, {
    avatar: /*#__PURE__*/React.createElement(Icon, {
      name: "lock-closed",
      size: 22,
      color: "var(--kls-on-surface)"
    }),
    title: "Privacy & data",
    sub: "Manage permissions"
  }), /*#__PURE__*/React.createElement(ListRow, {
    avatar: /*#__PURE__*/React.createElement(Icon, {
      name: "question-mark-circle",
      size: 22,
      color: "var(--kls-on-surface)"
    }),
    title: "Help",
    sub: "Guides, contact",
    last: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--kls-space-med)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "destructive",
    size: "lg",
    leadingIcon: "arrow-left-end-on-rectangle"
  }, "Sign out")));
}
window.KLS_SCREENS = {
  HomeScreen,
  ExamListScreen,
  CalibrationScreen,
  ProfileScreen
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shared/kls-icon.jsx
try { (() => {
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

const KLS_ICON_BASE = typeof window !== "undefined" && window.KLS_ICON_BASE || "/assets/icons";
function KlsIcon({
  name,
  path,
  size = 24,
  color = "currentColor",
  rotate = 0,
  style = {}
}) {
  const url = path || `${KLS_ICON_BASE}/${name}.png`;
  const transform = rotate ? `rotate(${rotate}deg)` : undefined;
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: "inline-block",
      width: size,
      height: size,
      backgroundColor: color,
      WebkitMask: `url("${url}") center/contain no-repeat`,
      mask: `url("${url}") center/contain no-repeat`,
      transform,
      flex: "none",
      ...style
    }
  });
}

// also expose plain-image variant (when you need the original colored PNG, not a mask)
function KlsImage({
  name,
  path,
  size,
  width,
  height,
  alt = "",
  style = {}
}) {
  const url = path || `${KLS_ICON_BASE}/${name}.png`;
  return /*#__PURE__*/React.createElement("img", {
    src: url,
    alt: alt,
    style: {
      width: width || size,
      height: height || size,
      flex: "none",
      ...style
    }
  });
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shared/kls-icon.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/browser-window.jsx
try { (() => {
// Chrome.jsx — Simplified Chrome browser window (dark theme, macOS)
// No dependencies, no image assets. All inline styles + inline SVG.

const CHROME_C = {
  barBg: '#202124',
  tabBg: '#35363a',
  text: '#e8eaed',
  dim: '#9aa0a6',
  urlBg: '#282a2d'
};
function ChromeTrafficLights() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      padding: '0 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: '#ff5f57'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: '#febc2e'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: '#28c840'
    }
  }));
}

// Single tab (active has curved scoops)
function ChromeTab({
  title = 'New Tab',
  active = false
}) {
  const curve = flip => /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "10",
    viewBox: "0 0 8 10",
    style: {
      position: 'absolute',
      bottom: 0,
      [flip ? 'right' : 'left']: -8,
      transform: flip ? 'scaleX(-1)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 10C2 9 6 8 8 0V10H0Z",
    fill: CHROME_C.tabBg
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 34,
      alignSelf: 'flex-end',
      padding: '0 12px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: active ? CHROME_C.tabBg : 'transparent',
      borderRadius: '8px 8px 0 0',
      minWidth: 120,
      maxWidth: 220,
      fontFamily: 'system-ui, sans-serif',
      fontSize: 12,
      color: active ? CHROME_C.text : CHROME_C.dim
    }
  }, active && curve(false), active && curve(true), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 14,
      height: 14,
      borderRadius: '50%',
      background: '#5f6368',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, title));
}
function ChromeTabBar({
  tabs = [{
    title: 'New Tab'
  }],
  activeIndex = 0
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      height: 44,
      background: CHROME_C.barBg,
      paddingRight: 8
    }
  }, /*#__PURE__*/React.createElement(ChromeTrafficLights, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      height: '100%',
      paddingLeft: 4,
      flex: 1
    }
  }, tabs.map((t, i) => /*#__PURE__*/React.createElement(ChromeTab, {
    key: i,
    title: t.title,
    active: i === activeIndex
  }))));
}
function ChromeToolbar({
  url = 'example.com'
}) {
  const iconDot = /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: CHROME_C.dim,
      opacity: 0.4
    }
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 40,
      background: CHROME_C.tabBg,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '0 8px'
    }
  }, iconDot, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 30,
      borderRadius: 15,
      background: CHROME_C.urlBg,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '0 14px',
      margin: '0 6px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: CHROME_C.dim,
      opacity: 0.4
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: CHROME_C.text,
      fontSize: 13,
      fontFamily: 'system-ui, sans-serif'
    }
  }, url)), iconDot);
}
function ChromeWindow({
  tabs = [{
    title: 'New Tab'
  }],
  activeIndex = 0,
  url = 'example.com',
  width = 900,
  height = 600,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      borderRadius: 10,
      overflow: 'hidden',
      boxShadow: '0 24px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      background: CHROME_C.tabBg
    }
  }, /*#__PURE__*/React.createElement(ChromeTabBar, {
    tabs: tabs,
    activeIndex: activeIndex
  }), /*#__PURE__*/React.createElement(ChromeToolbar, {
    url: url
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'var(--kls-surface)',
      overflow: 'auto'
    }
  }, children));
}
Object.assign(window, {
  ChromeWindow,
  ChromeTabBar,
  ChromeToolbar,
  ChromeTab,
  ChromeTrafficLights
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/browser-window.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/chrome.jsx
try { (() => {
// chrome.jsx — Web app Header + NavSidebar (uses real Kilsar PNG icons + logo)
const {
  useState
} = React;

// ── Header ────────────────────────────────────────────────────────
function Header({
  title = "Library",
  unread = 0,
  onAvatar,
  onBell
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const history = ["chemistry midterm", "knot tying", "FCC handbook"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "var(--kls-header-height, 64px)",
      padding: "0 var(--kls-header-padding-x, 20px)",
      background: "var(--kls-header-bg)",
      color: "var(--kls-header-fg)",
      borderBottom: "var(--kls-header-border)",
      display: "flex",
      alignItems: "center",
      gap: "var(--kls-space-xsmall)",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: "var(--kls-subtitle-small-size)",
      fontWeight: "var(--kls-subtitle-small-weight)",
      color: "var(--kls-on-surface)"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: searchOpen ? "var(--kls-search-pill-width, 300px)" : "var(--kls-search-button-size, 32px)",
      height: 32,
      position: "relative",
      transition: "width var(--kls-motion-fade, 250ms) var(--kls-easing-standard)"
    }
  }, searchOpen ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: "Search",
    onBlur: () => {
      if (!query) setSearchOpen(false);
    },
    style: {
      width: "100%",
      height: "var(--kls-search-pill-height, 32px)",
      padding: "0 var(--kls-space-small) 0 var(--kls-space-large)",
      background: "var(--kls-search-pill-bg)",
      border: "none",
      borderRadius: "var(--kls-search-pill-radius, 16px)",
      fontFamily: "var(--kls-font-sans)",
      fontSize: 14,
      color: "var(--kls-on-surface)",
      outline: "none",
      boxSizing: "border-box"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 10,
      top: 8,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement(KlsIcon, {
    name: "search",
    size: 16,
    color: "var(--kls-on-surface-variant)"
  })), query.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 36,
      left: 0,
      right: 0,
      background: "var(--kls-search-suggestion-bg)",
      borderRadius: "var(--kls-search-suggestion-radius, 8px)",
      boxShadow: "var(--kls-search-suggestion-elevation)",
      overflow: "hidden",
      zIndex: 10
    }
  }, history.filter(h => h.startsWith(query.toLowerCase())).map((h, i, arr) => /*#__PURE__*/React.createElement("div", {
    key: h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--kls-space-small) var(--kls-space-small)",
      fontFamily: "var(--kls-font-sans)",
      fontSize: 14,
      fontWeight: 500,
      color: "var(--kls-on-surface)",
      cursor: "pointer"
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--kls-search-suggestion-hover)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, h), i < arr.length - 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: "var(--kls-tertiary)"
    }
  }))))) : /*#__PURE__*/React.createElement("button", {
    onClick: () => setSearchOpen(true),
    "aria-label": "Search",
    style: {
      width: 32,
      height: 32,
      border: "none",
      background: "transparent",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(KlsIcon, {
    name: "search",
    size: 20,
    color: "var(--kls-on-surface)"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: onBell,
    "aria-label": "Notifications",
    style: {
      width: "var(--kls-bell-size, 40px)",
      height: "var(--kls-bell-size, 40px)",
      border: "none",
      background: "transparent",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(KlsIcon, {
    name: "bell",
    size: 24,
    color: "var(--kls-on-surface)"
  }), unread > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      right: 2,
      minWidth: "var(--kls-bell-badge-size, 18px)",
      height: "var(--kls-bell-badge-size, 18px)",
      padding: "0 var(--kls-space-xsmall)",
      background: "var(--kls-bell-badge-bg)",
      color: "var(--kls-bell-badge-fg)",
      borderRadius: 9,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--kls-font-sans)",
      fontSize: 10,
      fontWeight: 600,
      lineHeight: 1
    }
  }, unread)), /*#__PURE__*/React.createElement("button", {
    onClick: onAvatar,
    "aria-label": "Profile",
    style: {
      width: "var(--kls-header-avatar-size, 32px)",
      height: "var(--kls-header-avatar-size, 32px)",
      borderRadius: "50%",
      border: "none",
      background: "var(--kls-tertiary-container)",
      cursor: "pointer",
      padding: 0,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--kls-on-surface)",
      fontFamily: "var(--kls-font-sans)",
      fontSize: 12,
      fontWeight: 600
    }
  }, "AS"));
}

// ── Sidebar ───────────────────────────────────────────────────────
// `iconPath` lets us pick from /assets/icons/tabs/* when available, or fall back
// to /assets/icons/*. Names mirror the FeatureFlag.key in Flutter.
//
// `flavor` swaps labels via WorkspaceSettings overrides (termsKey / ticketsKey
// / coursesKey / assignmentsKey). The icon set is identical across flavors.
const FLAVOR_LABELS = {
  education: {
    terms: "Courses",
    tickets: "Tickets",
    library: "Library",
    oralExams: "Oral Exams",
    inventory: "Inventory Mgr",
    assistant: "Assistant",
    analytics: "Analytics",
    controlTower: "Control Tower"
  },
  commercial: {
    terms: "Cases",
    tickets: "Tickets",
    library: "Library",
    oralExams: "Oral Exams",
    inventory: "Inventory Mgr",
    assistant: "Assistant",
    analytics: "Analytics",
    controlTower: "Control Tower"
  }
};
const SIDEBAR_TABS_BASE = [{
  key: "terms",
  icon: "tabs/home"
}, {
  key: "tickets",
  icon: "checkpoint"
}, {
  key: "library",
  icon: "tabs/library"
}, {
  key: "oralExams",
  icon: "chatBubbles"
}, {
  key: "inventory",
  icon: "cube"
}, {
  key: "assistant",
  icon: "orionOutline"
}, {
  key: "analytics",
  icon: "tabs/analytics"
}, {
  key: "controlTower",
  icon: "tower"
}];
function tabsForFlavor(flavor) {
  const labels = FLAVOR_LABELS[flavor] || FLAVOR_LABELS.education;
  return SIDEBAR_TABS_BASE.map(t => ({
    ...t,
    label: labels[t.key]
  }));
}

// Default export — used by code that doesn't yet pass flavor.
const SIDEBAR_TABS = tabsForFlavor("education");
function NavSidebar({
  active = "library",
  onSelect,
  workspaceName = "Acme Aviation Co.",
  showSpoofBanner = false,
  version = "v3.14.2",
  flavor = "education"
}) {
  const tabs = tabsForFlavor(flavor);
  const [collapsed, setCollapsed] = useState(false);
  const showLabels = !collapsed;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: collapsed ? "var(--kls-sidebar-width-collapsed, 90px)" : "var(--kls-sidebar-width-expanded, 224px)",
      background: "var(--kls-sidebar-bg)",
      padding: "var(--kls-sidebar-padding, 20px)",
      borderRight: "var(--kls-sidebar-border)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      flex: "none",
      transition: "width var(--kls-motion-fade, 250ms) var(--kls-easing-standard)",
      overflow: "hidden",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      height: 40,
      alignItems: "center"
    }
  }, showLabels ?
  /*#__PURE__*/
  // Full wordmark (splashLogo) — wordmark is wider than collapsed mark
  React.createElement("img", {
    src: "../../assets/images/splashLogo.png",
    alt: "Kilsar",
    style: {
      height: 28,
      width: "auto",
      display: "block"
    }
  }) :
  /*#__PURE__*/
  // Collapsed: K mark only
  React.createElement(KlsIcon, {
    name: "kilsar",
    size: 32,
    color: "var(--kls-on-surface)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "var(--kls-space-xsmall)"
    }
  }, showLabels && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: "var(--kls-subtitle-small-size)",
      fontWeight: "var(--kls-subtitle-small-weight)",
      color: "var(--kls-on-surface)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, workspaceName)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 49,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "var(--kls-space-med)"
    }
  }, showSpoofBanner ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--kls-accent-5)",
      color: "var(--kls-accent-4)",
      padding: showLabels ? "8px 12px" : "8px",
      borderRadius: 8,
      fontFamily: "var(--kls-font-sans)",
      fontSize: 12,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: "var(--kls-space-xsmall)"
    }
  }, /*#__PURE__*/React.createElement(KlsIcon, {
    name: "info",
    size: 16,
    color: "var(--kls-accent-4)"
  }), showLabels && "Viewer Mode") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingLeft: collapsed ? 0 : 12,
      display: "flex",
      justifyContent: collapsed ? "center" : "flex-start"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setCollapsed(c => !c),
    "aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar",
    style: {
      width: 32,
      height: 32,
      border: "1px solid var(--kls-outline-variant)",
      background: "var(--kls-surface)",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(KlsIcon, {
    name: "sidebar-collapse",
    size: 16,
    color: "var(--kls-on-surface)",
    rotate: collapsed ? 180 : 0
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      marginTop: "var(--kls-space-xsmall)"
    }
  }, tabs.map(tab => /*#__PURE__*/React.createElement(SidebarOption, {
    key: tab.key,
    icon: tab.icon,
    label: tab.label,
    isActive: active === tab.key,
    showLabel: showLabels,
    onClick: () => onSelect && onSelect(tab.key)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(SidebarOption, {
    icon: "group",
    label: "Workspace",
    isActive: active === "teamWorkspace",
    showLabel: showLabels,
    onClick: () => onSelect && onSelect("teamWorkspace")
  }), /*#__PURE__*/React.createElement(SidebarOption, {
    icon: "tabs/logout",
    label: "Logout",
    isActive: false,
    showLabel: showLabels,
    onClick: () => onSelect && onSelect("logout")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: "var(--kls-space-tiny)",
      marginTop: "var(--kls-space-small)",
      fontFamily: "var(--kls-font-sans)",
      fontSize: 10,
      fontWeight: 600,
      color: "var(--kls-on-tertiary)"
    }
  }, showLabels && /*#__PURE__*/React.createElement("span", null, "Version:"), /*#__PURE__*/React.createElement("span", null, version))));
}
function SidebarOption({
  icon,
  label,
  isActive,
  showLabel,
  onClick
}) {
  // Active uses --kls-primary tint; idle uses --kls-on-surface (matches Flutter spec).
  const iconColor = isActive ? "var(--kls-primary)" : "var(--kls-on-surface)";
  const labelColor = "var(--kls-on-surface)";
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      height: "var(--kls-sidebar-tab-height, 56px)",
      marginTop: "var(--kls-space-med)",
      padding: "0 var(--kls-space-med)",
      background: isActive ? "var(--kls-sidebar-tab-bg-active)" : "var(--kls-sidebar-tab-bg-idle)",
      border: "none",
      borderRadius: "var(--kls-sidebar-tab-radius, 4px)",
      display: "flex",
      alignItems: "center",
      gap: "var(--kls-space-med)",
      cursor: "pointer",
      textAlign: "left",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement(KlsIcon, {
    name: icon,
    size: 24,
    color: iconColor
  }), showLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: "var(--kls-navigation-size)",
      fontWeight: "var(--kls-navigation-weight)",
      color: labelColor,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, label));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/home-dashboard.jsx
try { (() => {
// home-dashboard.jsx — Web Home (TermsDashboardScreenWeb)
//
// Mirrors home_screen_web.dart structurally:
//   • Optional analytics row (horizontal scroll of compact graphs)
//   • Detail pane card with rounded border + outlineVariant
//     – CompoundSwitch (4 segments) + RefreshWidget
//     – AnimatedSwitcher cross-fading the active detail (Terms/Templates/Courses/Assignments)
//   • Floating AssistantFab (bottom-right) opens a side drawer
//
// Flavor labels come from a flavor map mirroring WorkspaceSettings overrides:
//   termsKey, termKey, coursesKey, assignmentsKey, viewerKey
//
// Dependencies: react in scope, KlsIcon (loaded by parent index.html).

const {
  useState: useStateHomeDash
} = React;
const HOME_FLAVORS = {
  education: {
    workspaceName: "Acme Aviation Co.",
    user: "Aaliyah Singh",
    termsKey: "Courses",
    termKey: "Course",
    coursesKey: "Modules",
    assignmentsKey: "Assignments",
    viewerKey: "Student"
  },
  commercial: {
    workspaceName: "Acme Operations",
    user: "Marcus Doyle",
    termsKey: "Cases",
    termKey: "Case",
    coursesKey: "Workflows",
    assignmentsKey: "Tasks",
    viewerKey: "Operator"
  }
};
function HomeDashboard({
  flavor = "education",
  showAnalytics = true
}) {
  const f = HOME_FLAVORS[flavor];
  const [detail, setDetail] = useStateHomeDash(0);
  const labels = [f.termsKey, `${f.termKey} Templates`, f.coursesKey, f.assignmentsKey];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      padding: "var(--kls-space-med)",
      background: "var(--kls-surface-variant)"
    }
  }, showAnalytics && /*#__PURE__*/React.createElement(AnalyticsHeader, {
    flavor: flavor
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      marginTop: showAnalytics ? 16 : 0,
      background: "var(--kls-surface)",
      borderRadius: 12,
      border: "1px solid var(--kls-outline-variant)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--kls-space-med)",
      display: "flex",
      alignItems: "center",
      gap: "var(--kls-space-small)",
      borderBottom: "1px solid var(--kls-outline-variant)"
    }
  }, /*#__PURE__*/React.createElement(CompoundSwitch, {
    labels: labels,
    value: detail,
    onChange: setDetail
  }), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Refresh",
    style: {
      width: 36,
      height: 36,
      borderRadius: 8,
      border: "1px solid var(--kls-outline-variant)",
      background: "var(--kls-surface)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(KlsIcon, {
    name: "refresh",
    size: 18,
    color: "var(--kls-on-surface)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    key: detail,
    style: {
      position: "absolute",
      inset: 0,
      overflow: "auto",
      animation: "homeFade 280ms var(--kls-easing-standard, cubic-bezier(0.2, 0, 0, 1))"
    }
  }, detail === 0 && /*#__PURE__*/React.createElement(TermsTable, {
    flavor: flavor
  }), detail === 1 && /*#__PURE__*/React.createElement(TemplatesTable, {
    flavor: flavor
  }), detail === 2 && /*#__PURE__*/React.createElement(CoursesTable, {
    flavor: flavor
  }), detail === 3 && /*#__PURE__*/React.createElement(AssignmentsTable, {
    flavor: flavor
  })))), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Open assistant",
    style: {
      position: "absolute",
      bottom: 16,
      right: 16,
      width: 56,
      height: 56,
      borderRadius: "50%",
      border: "none",
      background: "var(--kls-surface-variant)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(KlsIcon, {
    name: "orionOutline",
    size: 28,
    color: "var(--kls-on-surface)"
  })), /*#__PURE__*/React.createElement("style", null, `
        @keyframes homeFade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `));
}

// ── Analytics header ─────────────────────────────────────────────
// Two compact cards (Assignments Completed graph + Time-in-Assignment graph)
// to stay representative without going overboard, per the default decision.
function AnalyticsHeader({
  flavor
}) {
  const f = HOME_FLAVORS[flavor];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--kls-space-med)",
      overflowX: "auto",
      paddingBottom: "var(--kls-space-tiny)"
    }
  }, /*#__PURE__*/React.createElement(AnalyticsCard, {
    title: `${f.assignmentsKey} completed`,
    sub: "Last 30 days",
    chart: /*#__PURE__*/React.createElement(BarChart, {
      data: [24, 18, 32, 28, 45, 38, 52, 41, 36, 48, 55, 42]
    }),
    big: "412",
    delta: "+14%",
    deltaPositive: true
  }), /*#__PURE__*/React.createElement(AnalyticsCard, {
    title: `Time in ${f.assignmentsKey.toLowerCase().replace(/s$/, "")}`,
    sub: "Average per session",
    chart: /*#__PURE__*/React.createElement(LineChart, {
      data: [42, 38, 45, 50, 48, 52, 55, 51, 49, 53, 58, 56]
    }),
    big: "48m",
    delta: "+6m",
    deltaPositive: true
  }));
}
function AnalyticsCard({
  title,
  sub,
  chart,
  big,
  delta,
  deltaPositive
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      width: 500,
      background: "var(--kls-surface)",
      borderRadius: 12,
      border: "1px solid var(--kls-outline-variant)",
      padding: "var(--kls-space-med)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--kls-space-xsmall)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: "var(--kls-subtitle-small-size)",
      fontWeight: "var(--kls-subtitle-small-weight)",
      color: "var(--kls-on-surface)"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: 12,
      color: "var(--kls-on-surface-variant)",
      marginTop: "var(--kls-space-tiny)"
    }
  }, sub)), /*#__PURE__*/React.createElement("button", {
    "aria-label": "More",
    style: {
      width: 28,
      height: 28,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      padding: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(KlsIcon, {
    name: "dots",
    size: 16,
    color: "var(--kls-on-surface-variant)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "var(--kls-space-xsmall)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: 32,
      fontWeight: 700,
      color: "var(--kls-on-surface)",
      lineHeight: 1
    }
  }, big), delta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: 12,
      fontWeight: 600,
      color: deltaPositive ? "var(--kls-on-success-container)" : "var(--kls-error)",
      padding: "var(--kls-space-tiny) var(--kls-space-xsmall)",
      borderRadius: 999,
      background: deltaPositive ? "var(--kls-success-container)" : "var(--kls-error-container)"
    }
  }, delta)), chart);
}

// ── Tiny chart components (no library) ───────────────────────────
function BarChart({
  data,
  height = 60
}) {
  const max = Math.max(...data);
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${data.length * 24} ${height}`,
    style: {
      width: "100%",
      height
    }
  }, data.map((v, i) => {
    const h = v / max * (height - 6);
    return /*#__PURE__*/React.createElement("rect", {
      key: i,
      x: i * 24 + 4,
      y: height - h,
      width: 16,
      height: h,
      rx: 3,
      fill: "var(--kls-primary)",
      opacity: 0.8
    });
  }));
}
function LineChart({
  data,
  height = 60
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = data.length * 24;
  const points = data.map((v, i) => {
    const x = i * 24 + 12;
    const y = height - 4 - (v - min) / (max - min || 1) * (height - 12);
    return `${x},${y}`;
  }).join(" ");
  // Build a closed polygon for the area fill
  const area = `M ${data[0] !== undefined ? `12,${height}` : ""} L ${points} L ${(data.length - 1) * 24 + 12},${height} Z`;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${height}`,
    style: {
      width: "100%",
      height
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: area,
    fill: "var(--kls-primary)",
    opacity: 0.15
  }), /*#__PURE__*/React.createElement("polyline", {
    points: points,
    fill: "none",
    stroke: "var(--kls-primary)",
    strokeWidth: 2,
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }));
}

// ── Compound switch (4-way segmented control) ───────────────────
function CompoundSwitch({
  labels,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      background: "var(--kls-tertiary)",
      borderRadius: 8,
      padding: "var(--kls-space-tiny)",
      gap: "var(--kls-space-tiny)"
    }
  }, labels.map((l, i) => /*#__PURE__*/React.createElement("button", {
    key: l,
    onClick: () => onChange(i),
    style: {
      minWidth: 140,
      padding: "var(--kls-space-xsmall) var(--kls-space-med)",
      border: "none",
      borderRadius: 6,
      background: value === i ? "var(--kls-surface)" : "transparent",
      color: value === i ? "var(--kls-on-surface)" : "var(--kls-on-surface-variant)",
      fontFamily: "var(--kls-font-sans)",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      transition: "background 200ms var(--kls-easing-standard, cubic-bezier(0.2, 0, 0, 1))",
      boxShadow: value === i ? "0 1px 2px rgba(0,0,0,0.06)" : "none"
    }
  }, l)));
}

// ── Detail tables (representative samples) ──────────────────────
function DetailTable({
  columns,
  rows
}) {
  return /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "var(--kls-font-sans)"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c,
    style: {
      textAlign: "left",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: ".06em",
      textTransform: "uppercase",
      color: "var(--kls-on-surface-variant)",
      padding: "var(--kls-space-small) var(--kls-space-med)",
      borderBottom: "1px solid var(--kls-outline-variant)",
      background: "var(--kls-surface-variant)",
      position: "sticky",
      top: 0
    }
  }, c)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      borderBottom: "1px solid var(--kls-tertiary)"
    }
  }, r.map((cell, j) => /*#__PURE__*/React.createElement("td", {
    key: j,
    style: {
      padding: "var(--kls-space-small) var(--kls-space-med)",
      fontSize: 13,
      color: "var(--kls-on-surface)",
      verticalAlign: "middle"
    }
  }, cell))))));
}
function StatusPill({
  tone,
  children
}) {
  const palette = {
    active: {
      bg: "var(--kls-success-container)",
      fg: "var(--kls-on-success-container)"
    },
    review: {
      bg: "var(--kls-progress-container)",
      fg: "var(--kls-on-progress-container)"
    },
    draft: {
      bg: "var(--kls-tertiary)",
      fg: "var(--kls-on-surface-variant)"
    },
    closed: {
      bg: "var(--kls-error-container)",
      fg: "var(--kls-error)"
    }
  };
  const p = palette[tone] || palette.draft;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      padding: "var(--kls-space-tiny) var(--kls-space-small)",
      borderRadius: 999,
      background: p.bg,
      color: p.fg,
      fontSize: 11,
      fontWeight: 600
    }
  }, children);
}
function TermsTable({
  flavor
}) {
  if (flavor === "commercial") {
    return /*#__PURE__*/React.createElement(DetailTable, {
      columns: ["Case", "Aircraft", `${HOME_FLAVORS.commercial.viewerKey}`, "Status", "Updated"],
      rows: [["Q1 Inspection — N42KL", "Cessna 172", "M. Doyle", /*#__PURE__*/React.createElement(StatusPill, {
        tone: "active"
      }, "Active"), "Today 09:42"], ["Engine Overhaul — N115DB", "Piper Seneca", "S. Renault", /*#__PURE__*/React.createElement(StatusPill, {
        tone: "review"
      }, "Review"), "Yesterday"], ["Avionics Upgrade — N803WC", "Cirrus SR22", "—", /*#__PURE__*/React.createElement(StatusPill, {
        tone: "draft"
      }, "Draft"), "2 days ago"], ["Annual — N221AT", "Beech Bonanza", "T. Fonseca", /*#__PURE__*/React.createElement(StatusPill, {
        tone: "closed"
      }, "Closed"), "Mar 14"]]
    });
  }
  return /*#__PURE__*/React.createElement(DetailTable, {
    columns: ["Course", "Term", "Students", "Status", "Updated"],
    rows: [["Spring 2025 — Private Pilot", "Spring 25", "12", /*#__PURE__*/React.createElement(StatusPill, {
      tone: "active"
    }, "Active"), "Today 09:42"], ["Multi-Engine Bridge", "Spring 25", "5", /*#__PURE__*/React.createElement(StatusPill, {
      tone: "active"
    }, "Active"), "Yesterday"], ["Instrument Rating — Cohort B", "Fall 24", "18", /*#__PURE__*/React.createElement(StatusPill, {
      tone: "review"
    }, "Grading"), "2 days ago"], ["Commercial Add-On", "Fall 24", "0", /*#__PURE__*/React.createElement(StatusPill, {
      tone: "draft"
    }, "Draft"), "Mar 14"]]
  });
}
function TemplatesTable({
  flavor
}) {
  return /*#__PURE__*/React.createElement(DetailTable, {
    columns: ["Template", "Used in", "Last edit"],
    rows: [["Pre-Solo Knowledge Test", flavor === "education" ? "8 courses" : "6 cases", "Mar 18"], ["Cross-Country Planning", flavor === "education" ? "5 courses" : "—", "Feb 27"], ["Engine Run-Up Checklist", flavor === "education" ? "12 courses" : "14 cases", "Feb 12"]]
  });
}
function CoursesTable({
  flavor
}) {
  if (flavor === "commercial") {
    return /*#__PURE__*/React.createElement(DetailTable, {
      columns: ["Workflow", "Steps", "Owner", "Active in"],
      rows: [["Pre-flight ground checks", "5", "S. Renault", "12 cases"], ["100-hour inspection", "18", "M. Doyle", "4 cases"], ["Squawk triage", "3", "Ops team", "8 cases"]]
    });
  }
  return /*#__PURE__*/React.createElement(DetailTable, {
    columns: ["Module", "Lessons", "Author", "Used in"],
    rows: [["Multi-engine systems", "7", "Capt. Reed", "4 courses"], ["Aerodynamics fundamentals", "12", "Dr. Patel", "9 courses"], ["FAR/AIM walkthrough", "6", "Capt. Reed", "11 courses"]]
  });
}
function AssignmentsTable({
  flavor
}) {
  return /*#__PURE__*/React.createElement(DetailTable, {
    columns: [flavor === "education" ? "Assignment" : "Task", "Assigned to", "Due", "Status"],
    rows: [[flavor === "education" ? "Logbook entry — solo XC" : "Replace pitot tube — N42KL", "A. Ramos", "Today", /*#__PURE__*/React.createElement(StatusPill, {
      tone: "active"
    }, "Open")], [flavor === "education" ? "Quiz: Airspace classes" : "Order replacement gasket", "M. Oliveira", "Tomorrow", /*#__PURE__*/React.createElement(StatusPill, {
      tone: "review"
    }, "Review")], [flavor === "education" ? "Stage check — Module 3" : "Sign off — engine overhaul", "S. Kapoor", "Fri", /*#__PURE__*/React.createElement(StatusPill, {
      tone: "draft"
    }, "Pending")]]
  });
}
window.KLS_HOME_DASHBOARD = {
  HomeDashboard,
  HOME_FLAVORS
};
// Also expose at top level so other Babel files can reference it directly.
window.HomeDashboard = HomeDashboard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/home-dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/screens.jsx
try { (() => {
// screens.jsx — Web workspace shell sample content (Library tab)
const {
  useState: useState_S
} = React;
function LibraryScreen() {
  const folders = [{
    name: "Aviation",
    count: 124,
    color: "var(--kls-color-blue-100)"
  }, {
    name: "Maritime",
    count: 87,
    color: "var(--kls-color-green-100)"
  }, {
    name: "Medical",
    count: 42,
    color: "var(--kls-color-red-100)"
  }, {
    name: "FCC Regs",
    count: 19,
    color: "var(--kls-color-orange-100)"
  }];
  const recents = [{
    title: "Part 91 — General Operating Rules",
    subtitle: "Updated 2 days ago",
    type: "Course"
  }, {
    title: "Knot Tying — Bowline",
    subtitle: "Updated 4 days ago",
    type: "Module"
  }, {
    title: "Radar Plotting Fundamentals",
    subtitle: "Updated last week",
    type: "Course"
  }, {
    title: "Q4 Inventory Audit Notes",
    subtitle: "Updated last week",
    type: "Doc"
  }, {
    title: "Crew Briefing — Approach Plates",
    subtitle: "Updated 2 weeks ago",
    type: "Module"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto",
      background: "var(--kls-scaffold-bg)",
      padding: "var(--kls-space-med)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginBottom: "var(--kls-space-med)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: "var(--kls-h2-size)",
      fontWeight: "var(--kls-h2-weight)",
      color: "var(--kls-on-surface)",
      marginBottom: "var(--kls-space-tiny)"
    }
  }, "Library"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: "var(--kls-body-small-size)",
      fontWeight: "var(--kls-body-small-weight)",
      color: "var(--kls-on-surface-variant)"
    }
  }, "All courses, modules, and documents in this workspace.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--kls-space-small)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      height: 40,
      padding: "0 var(--kls-space-small)",
      background: "var(--kls-tertiary)",
      color: "var(--kls-on-surface)",
      border: "none",
      borderRadius: 8,
      fontFamily: "var(--kls-font-sans)",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "var(--kls-space-xsmall)"
    }
  }, /*#__PURE__*/React.createElement(KlsIcon, {
    name: "filter",
    size: 16,
    color: "var(--kls-on-surface)"
  }), "Filter"), /*#__PURE__*/React.createElement("button", {
    style: {
      height: 40,
      padding: "0 var(--kls-space-med)",
      background: "var(--kls-primary)",
      color: "var(--kls-on-primary)",
      border: "none",
      borderRadius: 8,
      fontFamily: "var(--kls-font-sans)",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "var(--kls-space-xsmall)"
    }
  }, /*#__PURE__*/React.createElement(KlsIcon, {
    name: "pencil",
    size: 14,
    color: "var(--kls-on-primary)"
  }), "New course"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "var(--kls-space-med)",
      marginBottom: "var(--kls-space-large)"
    }
  }, folders.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.name,
    style: {
      background: "var(--kls-surface)",
      border: "1px solid var(--kls-outline-variant)",
      borderRadius: 12,
      padding: "var(--kls-space-med)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 8,
      background: f.color,
      marginBottom: "var(--kls-space-small)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(KlsIcon, {
    name: "folder",
    size: 20,
    color: "var(--kls-on-surface)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: 16,
      fontWeight: 600,
      color: "var(--kls-on-surface)",
      marginBottom: "var(--kls-space-tiny)"
    }
  }, f.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: 12,
      fontWeight: 500,
      color: "var(--kls-on-surface-variant)"
    }
  }, f.count, " items")))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: "var(--kls-h4-size)",
      fontWeight: "var(--kls-h4-weight)",
      color: "var(--kls-on-surface)",
      marginBottom: "var(--kls-space-small)"
    }
  }, "Recent"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--kls-surface)",
      border: "1px solid var(--kls-outline-variant)",
      borderRadius: 12,
      overflow: "hidden"
    }
  }, recents.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: r.title,
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--kls-space-med)",
      padding: "var(--kls-space-small) var(--kls-space-med)",
      borderBottom: i < recents.length - 1 ? "1px solid var(--kls-outline-variant)" : "none",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 8,
      background: "var(--kls-tertiary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(KlsIcon, {
    name: r.type === "Course" ? "modulesLarge" : r.type === "Module" ? "cube" : "worklog",
    size: 20,
    color: "var(--kls-on-surface)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--kls-on-surface)",
      marginBottom: "var(--kls-space-tiny)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, r.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kls-font-sans)",
      fontSize: 12,
      fontWeight: 500,
      color: "var(--kls-on-surface-variant)"
    }
  }, r.subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--kls-space-tiny) var(--kls-space-small)",
      background: "var(--kls-tertiary-container)",
      borderRadius: 12,
      fontFamily: "var(--kls-font-sans)",
      fontSize: 11,
      fontWeight: 600,
      color: "var(--kls-on-tertiary-container)"
    }
  }, r.type), /*#__PURE__*/React.createElement(KlsIcon, {
    name: "chevronRight",
    size: 16,
    color: "var(--kls-on-surface-variant)"
  })))));
}

// ── App shell ────────────────────────────────────────────────────
function WebApp({
  flavor = "education"
}) {
  const f = window.KLS_HOME_DASHBOARD && window.KLS_HOME_DASHBOARD.HOME_FLAVORS || {
    education: {
      workspaceName: "Acme Aviation Co.",
      user: "Aaliyah"
    },
    commercial: {
      workspaceName: "Acme Operations",
      user: "Marcus"
    }
  };
  const flavorMeta = f[flavor] || f.education;
  const tabsForActive = (window.tabsForFlavor || (x => SIDEBAR_TABS))(flavor);
  const [active, setActive] = useState_S("terms");
  const activeTab = tabsForActive.find(t => t.key === active) || tabsForActive[0];
  const isHome = active === "terms";

  // Workspace name (top-left of sidebar) — flips per flavor.
  const workspaceName = flavor === "commercial" ? "Acme Operations" : "Acme Aviation Co.";
  // Header title — for home, dynamic welcome; otherwise the active tab label.
  const userName = flavor === "commercial" ? "Marcus" : "Aaliyah";
  const headerTitle = isHome ? `Welcome back, ${userName}` : activeTab.label;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      display: "flex",
      background: "var(--kls-scaffold-bg)"
    }
  }, /*#__PURE__*/React.createElement(NavSidebar, {
    active: active,
    onSelect: setActive,
    workspaceName: workspaceName,
    flavor: flavor
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Header, {
    title: headerTitle,
    unread: 3
  }), isHome ? /*#__PURE__*/React.createElement(HomeDashboard, {
    flavor: flavor,
    showAnalytics: true
  }) : /*#__PURE__*/React.createElement(LibraryScreen, null)));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/screens.jsx", error: String((e && e.message) || e) }); }

})();
