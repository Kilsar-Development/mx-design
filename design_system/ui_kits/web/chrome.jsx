// chrome.jsx — Web app Header + NavSidebar (uses real Kilsar PNG icons + logo)
const { useState } = React;

// ── Header ────────────────────────────────────────────────────────
function Header({ title = "Library", unread = 0, onAvatar, onBell }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const history = ["chemistry midterm", "knot tying", "FCC handbook"];

  return (
    <div
      style={{
        height: "var(--kls-header-height, 64px)",
        padding: "0 var(--kls-header-padding-x, 20px)",
        background: "var(--kls-header-bg)",
        color: "var(--kls-header-fg)",
        borderBottom: "var(--kls-header-border)",
        display: "flex",
        alignItems: "center",
        gap: "var(--kls-space-xsmall)",
        flex: "none",
      }}
    >
      {/* Title — uses subtitleSmall (16px / w600 desktop) */}
      <div
        style={{
          fontFamily: "var(--kls-font-sans)",
          fontSize: "var(--kls-subtitle-small-size)",
          fontWeight: "var(--kls-subtitle-small-weight)",
          color: "var(--kls-on-surface)",
        }}
      >
        {title}
      </div>

      <div style={{ flex: 1 }} />

      {/* Search — collapses to 32px button, expands to 300 */}
      <div
        style={{
          width: searchOpen ? "var(--kls-search-pill-width, 300px)" : "var(--kls-search-button-size, 32px)",
          height: 32,
          position: "relative",
          transition: "width var(--kls-motion-fade, 250ms) var(--kls-easing-standard)",
        }}
      >
        {searchOpen ? (
          <div style={{ position: "relative" }}>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              onBlur={() => { if (!query) setSearchOpen(false); }}
              style={{
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
                boxSizing: "border-box",
              }}
            />
            <span style={{ position: "absolute", left: 10, top: 8, pointerEvents: "none" }}>
              <KlsIcon name="search" size={16} color="var(--kls-on-surface-variant)" />
            </span>
            {/* Suggestions */}
            {query.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 36,
                  left: 0,
                  right: 0,
                  background: "var(--kls-search-suggestion-bg)",
                  borderRadius: "var(--kls-search-suggestion-radius, 8px)",
                  boxShadow: "var(--kls-search-suggestion-elevation)",
                  overflow: "hidden",
                  zIndex: 10,
                }}
              >
                {history.filter((h) => h.startsWith(query.toLowerCase())).map((h, i, arr) => (
                  <div key={h}>
                    <div
                      style={{
                        padding: "var(--kls-space-small) var(--kls-space-small)",
                        fontFamily: "var(--kls-font-sans)",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "var(--kls-on-surface)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--kls-search-suggestion-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {h}
                    </div>
                    {i < arr.length - 1 && <div style={{ height: 1, background: "var(--kls-tertiary)" }} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            style={{
              width: 32,
              height: 32,
              border: "none",
              background: "transparent",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <KlsIcon name="search" size={20} color="var(--kls-on-surface)" />
          </button>
        )}
      </div>

      {/* Bell with badge */}
      <button
        onClick={onBell}
        aria-label="Notifications"
        style={{
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
          padding: 0,
        }}
      >
        <KlsIcon name="bell" size={24} color="var(--kls-on-surface)" />
        {unread > 0 && (
          <span
            style={{
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
              lineHeight: 1,
            }}
          >
            {unread}
          </span>
        )}
      </button>

      {/* Avatar */}
      <button
        onClick={onAvatar}
        aria-label="Profile"
        style={{
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
          fontWeight: 600,
        }}
      >
        AS
      </button>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────
// `iconPath` lets us pick from /assets/icons/tabs/* when available, or fall back
// to /assets/icons/*. Names mirror the FeatureFlag.key in Flutter.
//
// `flavor` swaps labels via WorkspaceSettings overrides (termsKey / ticketsKey
// / coursesKey / assignmentsKey). The icon set is identical across flavors.
const FLAVOR_LABELS = {
  education:  { terms: "Courses",   tickets: "Tickets", library: "Library", oralExams: "Oral Exams", inventory: "Inventory Mgr", assistant: "Assistant", analytics: "Analytics", controlTower: "Control Tower" },
  commercial: { terms: "Cases",     tickets: "Tickets", library: "Library", oralExams: "Oral Exams", inventory: "Inventory Mgr", assistant: "Assistant", analytics: "Analytics", controlTower: "Control Tower" },
};

const SIDEBAR_TABS_BASE = [
  { key: "terms",         icon: "tabs/home" },
  { key: "tickets",       icon: "checkpoint" },
  { key: "library",       icon: "tabs/library" },
  { key: "oralExams",     icon: "chatBubbles" },
  { key: "inventory",     icon: "cube" },
  { key: "assistant",     icon: "orionOutline" },
  { key: "analytics",     icon: "tabs/analytics" },
  { key: "controlTower",  icon: "tower" },
];

function tabsForFlavor(flavor) {
  const labels = FLAVOR_LABELS[flavor] || FLAVOR_LABELS.education;
  return SIDEBAR_TABS_BASE.map((t) => ({ ...t, label: labels[t.key] }));
}

// Default export — used by code that doesn't yet pass flavor.
const SIDEBAR_TABS = tabsForFlavor("education");

function NavSidebar({ active = "library", onSelect, workspaceName = "Acme Aviation Co.", showSpoofBanner = false, version = "v3.14.2", flavor = "education" }) {
  const tabs = tabsForFlavor(flavor);
  const [collapsed, setCollapsed] = useState(false);
  const showLabels = !collapsed;

  return (
    <div
      style={{
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
        boxSizing: "border-box",
      }}
    >
      {/* TOP */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
        {/* Workspace logo (Kilsar mark) */}
        <div style={{ display: "flex", justifyContent: "center", height: 40, alignItems: "center" }}>
          {showLabels ? (
            // Full wordmark (splashLogo) — wordmark is wider than collapsed mark
            <img
              src="../../assets/images/splashLogo.png"
              alt="Kilsar"
              style={{ height: 28, width: "auto", display: "block" }}
            />
          ) : (
            // Collapsed: K mark only
            <KlsIcon name="kilsar" size={32} color="var(--kls-on-surface)" />
          )}
        </div>

        {/* Workspace name */}
        <div style={{ height: 24, display: "flex", justifyContent: "center", alignItems: "center", marginTop: "var(--kls-space-xsmall)"}}>
          {showLabels && (
            <div
              style={{
                fontFamily: "var(--kls-font-sans)",
                fontSize: "var(--kls-subtitle-small-size)",
                fontWeight: "var(--kls-subtitle-small-weight)",
                color: "var(--kls-on-surface)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {workspaceName}
            </div>
          )}
        </div>

        {/* Spoof banner (or 49px spacer) */}
        <div style={{ height: 49, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "var(--kls-space-med)"}}>
          {showSpoofBanner ? (
            <div
              style={{
                background: "var(--kls-accent-5)",
                color: "var(--kls-accent-4)",
                padding: showLabels ? "8px 12px" : "8px",
                borderRadius: 8,
                fontFamily: "var(--kls-font-sans)",
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "var(--kls-space-xsmall)",
              }}
            >
              <KlsIcon name="info" size={16} color="var(--kls-accent-4)" />
              {showLabels && "Viewer Mode"}
            </div>
          ) : null}
        </div>

        {/* Collapse chevron — using sidebar-collapse.png, mirrored when collapsed */}
        <div style={{ paddingLeft: collapsed ? 0 : 12, display: "flex", justifyContent: collapsed ? "center" : "flex-start" }}>
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{
              width: 32,
              height: 32,
              border: "1px solid var(--kls-outline-variant)",
              background: "var(--kls-surface)",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <KlsIcon
              name="sidebar-collapse"
              size={16}
              color="var(--kls-on-surface)"
              rotate={collapsed ? 180 : 0}
            />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: "var(--kls-space-xsmall)"}}>
          {tabs.map((tab) => (
            <SidebarOption
              key={tab.key}
              icon={tab.icon}
              label={tab.label}
              isActive={active === tab.key}
              showLabel={showLabels}
              onClick={() => onSelect && onSelect(tab.key)}
            />
          ))}
        </div>
      </div>

      {/* BOTTOM */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <SidebarOption
          icon="group"
          label="Workspace"
          isActive={active === "teamWorkspace"}
          showLabel={showLabels}
          onClick={() => onSelect && onSelect("teamWorkspace")}
        />
        <SidebarOption
          icon="tabs/logout"
          label="Logout"
          isActive={false}
          showLabel={showLabels}
          onClick={() => onSelect && onSelect("logout")}
        />

        {/* Version */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "var(--kls-space-tiny)",
            marginTop: "var(--kls-space-small)",
            fontFamily: "var(--kls-font-sans)",
            fontSize: 10,
            fontWeight: 600,
            color: "var(--kls-on-tertiary)",
          }}
        >
          {showLabels && <span>Version:</span>}
          <span>{version}</span>
        </div>
      </div>
    </div>
  );
}

function SidebarOption({ icon, label, isActive, showLabel, onClick }) {
  // Active uses --kls-primary tint; idle uses --kls-on-surface (matches Flutter spec).
  const iconColor = isActive ? "var(--kls-primary)" : "var(--kls-on-surface)";
  const labelColor = "var(--kls-on-surface)";
  return (
    <button
      onClick={onClick}
      style={{
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
        width: "100%",
      }}
    >
      <KlsIcon name={icon} size={24} color={iconColor} />
      {showLabel && (
        <span
          style={{
            fontFamily: "var(--kls-font-sans)",
            fontSize: "var(--kls-navigation-size)",
            fontWeight: "var(--kls-navigation-weight)",
            color: labelColor,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </span>
      )}
    </button>
  );
}
