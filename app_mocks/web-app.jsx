// AUTO-ASSEMBLED unified web app (chrome + router + Control Tower + Team Workspace + drawers + picker).
// Mounted by "Web App.dc.html" via <x-import component-from-global-scope="WebApp">.
const { useState, useRef, useEffect, useLayoutEffect } = React;
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

// chrome.jsx — Web app Header + NavSidebar (uses real Kilsar PNG icons + logo)


// ── Header ────────────────────────────────────────────────────────
function Header({ systemMessage = null, unread = 0, onAvatar, onBell, onSearch, searchPlaceholder = "Search" }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const history = ["chemistry midterm", "knot tying", "FCC handbook"];

  return (
    <div
      style={{
        height: "var(--kls-header-height)",
        padding: "0 var(--kls-header-padding-x)",
        background: "var(--kls-header-bg)",
        color: "var(--kls-header-fg)",
        borderBottom: "var(--kls-header-border)",
        display: "flex",
        alignItems: "center",
        gap: "var(--kls-space-xsmall)",
        flex: "none",
      }}
    >
      {/* Left zone — reserved for system messages, not a page title (new standard pattern) */}
      <div
        style={{
          fontFamily: "var(--kls-font-sans)",
          fontSize: "var(--kls-subtitle-small-size)",
          fontWeight: "var(--kls-subtitle-small-weight)",
          color: "var(--kls-on-surface-variant)",
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {systemMessage}
      </div>

      <div style={{ flex: 1 }} />

      {/* Search — collapses to 32px button, expands to 300 */}
      <div
        style={{
          width: searchOpen ? "var(--kls-search-pill-width)" : "var(--kls-search-button-size)",
          height: 32,
          position: "relative",
          transition: "width var(--kls-dur-fade-animation) var(--kls-ease-standard)",
        }}
      >
        {searchOpen ? (
          <div style={{ position: "relative" }}>
            <input
              autoFocus
              value={query}
              onChange={(e) => { setQuery(e.target.value); onSearch && onSearch(e.target.value); }}
              placeholder={searchPlaceholder}
              onBlur={() => { if (!query) setSearchOpen(false); }}
              style={{
                width: "100%",
                height: "var(--kls-search-pill-height)",
                padding: "0 var(--kls-space-small) 0 var(--kls-space-large)",
                background: "var(--kls-search-pill-bg)",
                border: "none",
                borderRadius: "var(--kls-search-pill-radius)",
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
                  borderRadius: "var(--kls-search-suggestion-radius)",
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
          width: "var(--kls-bell-size)",
          height: "var(--kls-bell-size)",
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
              minWidth: "var(--kls-bell-badge-size)",
              height: "var(--kls-bell-badge-size)",
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
          width: "var(--kls-header-avatar-size)",
          height: "var(--kls-header-avatar-size)",
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
  education:  { terms: "Courses",   tickets: "Tickets", library: "Library", oralExams: "Oral Exams", inventory: "Inventory Mgr", assistant: "Assistant", analytics: "Analytics", controlTower: "Control Tower", writtenExams: "Written Exams" },
  commercial: { terms: "Cases",     tickets: "Tickets", library: "Library", oralExams: "Oral Exams", inventory: "Inventory Mgr", assistant: "Assistant", analytics: "Analytics", controlTower: "Control Tower", writtenExams: "Written Exams" },
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
  { key: "writtenExams", icon: "checkpoint" },
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
        width: collapsed ? "var(--kls-sidebar-width-collapsed)" : "var(--kls-sidebar-width-expanded)",
        background: "var(--kls-sidebar-bg)",
        padding: "var(--kls-sidebar-padding)",
        borderRight: "var(--kls-sidebar-border)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flex: "none",
        transition: "width var(--kls-dur-fade-animation) var(--kls-ease-standard)",
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
              src="assets/images/splashLogo.png"
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
                padding: showLabels ? "var(--kls-space-xsmall) var(--kls-space-small)" : "var(--kls-space-xsmall)",
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
          glyph
          label="Help & Feedback"
          isActive={false}
          showLabel={showLabels}
          onClick={() => onSelect && onSelect("help")}
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

function SidebarOption({ icon, glyph, label, isActive, showLabel, onClick }) {
  // Active uses --kls-primary tint; idle uses --kls-on-surface (matches Flutter spec).
  const iconColor = isActive ? "var(--kls-primary)" : "var(--kls-on-surface)";
  const labelColor = "var(--kls-on-surface)";
  return (
    <button
      onClick={onClick}
      style={{
        height: 44,
        marginTop: "var(--kls-space-small)",
        padding: "0 var(--kls-space-med)",
        background: isActive ? "var(--kls-sidebar-tab-bg-active)" : "var(--kls-sidebar-tab-bg-idle)",
        border: "none",
        borderRadius: "var(--kls-sidebar-tab-radius)",
        display: "flex",
        alignItems: "center",
        gap: "var(--kls-space-med)",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
      }}
    >
      {glyph ? <HelpGlyph size={24} color={iconColor} /> : <KlsIcon name={icon} size={24} color={iconColor} />}
      {showLabel && (
        <span
          className="kls-text-navigation"
          style={{
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

// control-tower-data.jsx — Control Tower seed data, status/type meta, shared UI bits.
// Education flavor: Students / Tasks / Oral & Written exams.
// Everything is exposed on window.CT for the screen + drawer files (separate babel scopes).

// ── Status + type meta ──────────────────────────────────────────────────────
const CT_STATUS = {
  not_started: { label: "Not started", bg: "var(--kls-tertiary)",         fg: "var(--kls-on-surface-variant)", bar: "var(--kls-outline-variant)" },
  in_progress: { label: "In progress", bg: "var(--kls-info-container)",    fg: "var(--kls-info)",     bar: "var(--kls-info)" },
  overdue:     { label: "Overdue",     bg: "var(--kls-accent-5)",          fg: "var(--kls-accent-4)", bar: "var(--kls-accent-4)" },
  completed:   { label: "Completed",   bg: "var(--kls-success-container)", fg: "var(--kls-success)",  bar: "var(--kls-success)" },
  passed:      { label: "Passed",      bg: "var(--kls-success-container)", fg: "var(--kls-success)",  bar: "var(--kls-success)" },
  failed:      { label: "Failed",      bg: "var(--kls-error-container)",   fg: "var(--kls-error)",    bar: "var(--kls-error)" },
};

const CT_TYPES = {
  task:    { label: "Task",         short: "Task",    icon: "worklog",     passFail: false },
  oral:    { label: "Oral exam",    short: "Oral",    icon: "chatBubbles", passFail: true },
  written: { label: "Written exam", short: "Written", icon: "checkpoint",  passFail: true },
};

// ── Roster ──────────────────────────────────────────────────────────────────
const CT_STUDENTS = [
  { id: "s1", name: "Joel Bishop",    email: "joel.b@kilsar.com",  lastActive: "2h ago" },
  { id: "s2", name: "Melodie Stone",  email: "melodie@kilsar.com", lastActive: "40m ago" },
  { id: "s3", name: "Dana Whitfield", email: "dana@kilsar.com",    lastActive: "Yesterday" },
  { id: "s4", name: "Marcus Reyes",   email: "marcus@kilsar.com",  lastActive: "5d ago" },
  { id: "s5", name: "Priya Nair",     email: "priya@kilsar.com",   lastActive: "3h ago" },
  { id: "s6", name: "Caleb Turner",   email: "caleb@kilsar.com",   lastActive: "1w ago" },
  { id: "s7", name: "Sofia Alvarez",  email: "sofia@kilsar.com",   lastActive: "Yesterday" },
  { id: "s8", name: "Liam O'Connor",  email: "liam@kilsar.com",    lastActive: "4d ago" },
];

// ── Groups (a group is a named set of students; a row in the table) ───────────
const CT_GROUP_COLORS = {
  blue:   { bg: "var(--kls-info-container)",    fg: "var(--kls-info)" },
  green:  { bg: "var(--kls-success-container)", fg: "var(--kls-success)" },
  orange: { bg: "var(--kls-accent-5)",          fg: "var(--kls-accent-4)" },
  purple: { bg: "var(--kls-accent-13)",         fg: "var(--kls-accent-12)" },
};
const CT_GROUPS = [
  { id: "g1", name: "Airframe Team",    color: "orange", icon: "cube",       memberIds: ["s1", "s3"] },
  { id: "g2", name: "Avionics Lab",     color: "purple", icon: "checkpoint", memberIds: ["s2", "s5"] },
  { id: "g3", name: "Powerplant Group", color: "green",  icon: "tower",      memberIds: ["s4", "s6"] },
];
function ctGroupMembers(group) { return group.memberIds.map((id) => CT_STUDENTS.find((s) => s.id === id)).filter(Boolean); }
function ctUngroupedStudents() {
  const inGroup = new Set(CT_GROUPS.flatMap((g) => g.memberIds));
  return CT_STUDENTS.filter((s) => !inGroup.has(s.id));
}

// ── Task / course library (existing tasks, chosen by term → course → task) ────
const CT_TERMS = ["Fall 2024", "Spring 2025"];
const CT_COURSES = {
  "Fall 2024":   ["Airframe Structures", "Avionics Fundamentals", "Powerplant Systems"],
  "Spring 2025": ["Airframe Systems", "Advanced Avionics", "Turbine Theory"],
};
const CT_TASK_LIBRARY = {
  "Airframe Structures":  ["Torque Sequence Worksheet", "Rivet Inspection Log"],
  "Avionics Fundamentals":["Wiring Diagram Reading", "Bus Architecture Quiz Prep"],
  "Powerplant Systems":   ["Fuel System Schematic", "Magneto Timing Worksheet"],
  "Airframe Systems":     ["Hydraulics Troubleshooting", "Landing Gear Rigging"],
  "Advanced Avionics":    ["Autopilot Config Lab", "Transponder Setup"],
  "Turbine Theory":       ["Compressor Stage Worksheet", "EGT Analysis"],
};

const CT_EXAM_TITLES = {
  oral:    ["Engine Run-Up Oral", "Landing Gear Inspection Oral", "Sheet Metal Repair Oral"],
  written: ["FAA Regulations Written", "Turbine Theory Written", "Electrical Systems Written"],
};

// ── Generate assignment instances (deterministic) ────────────────────────────
const CT_DUE_PAST = ["Sep 28", "Oct 02", "Oct 09"];
const CT_DUE_FUTURE = ["Nov 14", "Nov 21", "Dec 03", "Dec 12"];
const CT_STATUS_CYCLE = ["completed", "in_progress", "not_started", "overdue", "passed", "failed", "in_progress", "completed"];

function ctBuildAssignments() {
  const out = [];
  let id = 0;
  CT_STUDENTS.forEach((s, si) => {
    const n = 4 + (si % 3); // 4–6 each
    for (let k = 0; k < n; k++) {
      const type = ["task", "oral", "written"][(si + k) % 3];
      let status = CT_STATUS_CYCLE[(si * 2 + k) % CT_STATUS_CYCLE.length];
      if (type === "task" && (status === "passed" || status === "failed")) status = "completed";
      if (type !== "task" && status === "completed") status = "passed";

      let title, course, term;
      if (type === "task") {
        term = CT_TERMS[(si + k) % CT_TERMS.length];
        const courses = CT_COURSES[term];
        course = courses[(si + k) % courses.length];
        const lib = CT_TASK_LIBRARY[course];
        title = lib[k % lib.length];
      } else {
        term = CT_TERMS[k % CT_TERMS.length];
        course = "Open-ended";
        const pool = CT_EXAM_TITLES[type];
        title = pool[(si + k) % pool.length];
      }

      const due = status === "overdue" ? CT_DUE_PAST[(si + k) % CT_DUE_PAST.length] : CT_DUE_FUTURE[(si + k) % CT_DUE_FUTURE.length];
      const score = status === "passed" ? 80 + ((si + k * 3) % 18) : status === "failed" ? 52 + ((si + k) % 14) : null;

      out.push({ id: "a" + (id++), studentId: s.id, type, title, course, term, due, status, score });
    }
  });
  return out;
}

// ── Group allocations (one piece of work assigned to a whole group) ───────────
// Each allocation is a distinct task/exam given to every member of the group.
// `instances` carry the per-assignee progress the segmented bar aggregates.
const CT_ASSIGNED = ["Sep 10", "Sep 24", "Oct 05", "Oct 18"];
function ctBuildAllocations() {
  const out = [];
  let id = 0;
  CT_GROUPS.forEach((g, gi) => {
    const members = ctGroupMembers(g);
    const n = 3 + (gi % 2); // 3–4 allocations per group
    for (let k = 0; k < n; k++) {
      const type = ["task", "oral", "written"][(gi + k) % 3];
      let title, course, term;
      if (type === "task") {
        term = CT_TERMS[(gi + k) % CT_TERMS.length];
        const courses = CT_COURSES[term];
        course = courses[(gi + k) % courses.length];
        const lib = CT_TASK_LIBRARY[course];
        title = lib[k % lib.length];
      } else {
        term = CT_TERMS[k % CT_TERMS.length];
        course = "Open-ended";
        const pool = CT_EXAM_TITLES[type];
        title = pool[(gi + k) % pool.length];
      }
      const overdueAlloc = (gi + k) % 3 === 0;
      const due = overdueAlloc ? CT_DUE_PAST[(gi + k) % CT_DUE_PAST.length] : CT_DUE_FUTURE[(gi + k) % CT_DUE_FUTURE.length];
      const assigned = CT_ASSIGNED[(gi + k) % CT_ASSIGNED.length];
      const instances = members.map((m, mi) => {
        let status = CT_STATUS_CYCLE[(gi * 2 + k + mi) % CT_STATUS_CYCLE.length];
        if (type === "task" && (status === "passed" || status === "failed")) status = "completed";
        if (type !== "task" && status === "completed") status = "passed";
        const score = status === "passed" ? 80 + ((mi + k * 3) % 18) : status === "failed" ? 52 + ((mi + k) % 14) : null;
        return { studentId: m.id, status, score };
      });
      out.push({ id: "al" + (id++), groupId: g.id, type, title, course, term, due, assigned, instances,
        settings: { allowResubmission: type !== "task", notifyOverdue: true } });
    }
  });
  return out;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function ctInitials(name) {
  const p = (name || "").trim().split(/\s+/);
  return ((p[0]?.[0] || "?") + (p[1]?.[0] || "")).toUpperCase();
}
const CT_DONE = ["completed", "passed"];
function ctRollup(items) {
  const by = { not_started: 0, in_progress: 0, overdue: 0, completed: 0, passed: 0, failed: 0 };
  items.forEach((a) => { by[a.status] = (by[a.status] || 0) + 1; });
  const total = items.length;
  const done = by.completed + by.passed;
  return { by, total, done, overdue: by.overdue, inProgress: by.in_progress, failed: by.failed };
}

// ── Shared bits ──────────────────────────────────────────────────────────────
function CTAvatar({ name, size = 40 }) {
  return (
    <div style={{
      flexShrink: 0, width: size, height: size, borderRadius: 999,
      background: "var(--kls-tertiary-container)", color: "var(--kls-on-surface-variant)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--kls-font-sans)", fontWeight: 700, fontSize: Math.round(size * 0.36),
    }}>{ctInitials(name)}</div>
  );
}

function CTStatusPill({ status, size = "md" }) {
  const m = CT_STATUS[status] || CT_STATUS.not_started;
  const pad = size === "sm" ? "var(--kls-space-tiny) var(--kls-space-xsmall)" : "var(--kls-space-tiny) var(--kls-space-small)";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: pad, borderRadius: 8,
      background: m.bg, color: m.fg, fontFamily: "var(--kls-font-sans)",
      fontSize: size === "sm" ? 11 : 12, fontWeight: 600, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: m.fg }} />
      {m.label}
    </span>
  );
}

// Stacked roll-up bar of an item set's statuses.
function CTRollupBar({ items, height = 8 }) {
  const order = ["overdue", "failed", "in_progress", "not_started", "completed", "passed"];
  const total = items.length || 1;
  const counts = {};
  items.forEach((a) => { counts[a.status] = (counts[a.status] || 0) + 1; });
  return (
    <div style={{ display: "flex", width: "100%", height, borderRadius: 999, overflow: "hidden", background: "var(--kls-outline-variant)" }}>
      {order.map((st) => {
        const n = counts[st] || 0;
        if (!n) return null;
        return <div key={st} title={`${CT_STATUS[st].label}: ${n}`} style={{ width: `${(n / total) * 100}%`, background: CT_STATUS[st].bar }} />;
      })}
    </div>
  );
}

function CTGroupMedallion({ color, icon, size = 40 }) {
  const c = CT_GROUP_COLORS[color] || CT_GROUP_COLORS.blue;
  return (
    <div style={{
      flexShrink: 0, width: size, height: size, borderRadius: 12, background: c.bg, color: c.fg,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <KlsIcon name={icon || "group"} size={Math.round(size * 0.5)} color={c.fg} />
    </div>
  );
}

window.CT = {
  STATUS: CT_STATUS, TYPES: CT_TYPES, STUDENTS: CT_STUDENTS, GROUPS: CT_GROUPS,
  GROUP_COLORS: CT_GROUP_COLORS, groupMembers: ctGroupMembers, ungrouped: ctUngroupedStudents,
  TERMS: CT_TERMS, COURSES: CT_COURSES, TASK_LIBRARY: CT_TASK_LIBRARY, EXAM_TITLES: CT_EXAM_TITLES,
  DUE_FUTURE: CT_DUE_FUTURE, ASSIGNED: CT_ASSIGNED, DONE: CT_DONE,
  buildAssignments: ctBuildAssignments, buildAllocations: ctBuildAllocations, initials: ctInitials, rollup: ctRollup,
  Avatar: CTAvatar, StatusPill: CTStatusPill, RollupBar: CTRollupBar, GroupMedallion: CTGroupMedallion,
};

// control-tower.jsx — Instructor Control Tower: assign work + track student status.
// Student-centric list with roll-up; click a student for per-assignment detail.
// Loads after control-tower-data.jsx, teammate-picker.jsx, ct-student-drawer.jsx, ct-assign-drawer.jsx.
const { useState: useCtState, useMemo: useCtMemo } = React;

const ctPrimaryBtn = {
  height: 40, padding: "0 var(--kls-space-med)", borderRadius: 8, border: "none", cursor: "pointer",
  background: "var(--kls-tertiary-container)", color: "var(--kls-on-tertiary-container)",
  display: "inline-flex", alignItems: "center", gap: "var(--kls-space-xsmall)",
  fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 700,
};
const CT_TH = { textAlign: "left", padding: "var(--kls-space-small) var(--kls-space-med)", fontFamily: "var(--kls-font-sans)", fontSize: 12,
  fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--kls-on-surface-variant)",
  borderBottom: "1px solid var(--kls-outline-variant)", whiteSpace: "nowrap" };
const CT_TD = { paddingTop: "var(--kls-space-small)", paddingRight: "var(--kls-space-med)", paddingBottom: "var(--kls-space-small)", paddingLeft: "var(--kls-space-med)", fontFamily: "var(--kls-font-sans)", fontSize: 14, color: "var(--kls-on-surface)", verticalAlign: "middle" };

function StatCard({ label, value, tone, icon }) {
  return (
    <div style={{ flex: 1, minWidth: 0, background: "var(--kls-surface)", border: "1px solid var(--kls-outline-variant)",
      borderRadius: 12, padding: "var(--kls-space-med)", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--kls-on-surface-variant)" }}>{label}</span>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: "var(--kls-tertiary)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <KlsIcon name={icon} size={14} color="var(--kls-on-surface-variant)" />
        </span>
      </div>
      <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 30, fontWeight: 700, lineHeight: 1, color: tone || "var(--kls-on-surface)" }}>{value}</span>
    </div>
  );
}

function CTFilterChip({ active, label, count, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 8, height: 36, padding: "0 var(--kls-space-small)", borderRadius: 999, cursor: "pointer",
      background: active ? "var(--kls-tertiary-container)" : "var(--kls-tertiary)",
      border: `1px solid ${active ? "var(--kls-primary)" : "var(--kls-outline-variant)"}`,
      color: active ? "var(--kls-on-surface)" : "var(--kls-on-tertiary)",
      fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600 }}>
      {label}
      {count != null && <span style={{ minWidth: 18, height: 18, padding: "0 var(--kls-space-xsmall)", boxSizing: "border-box", borderRadius: 999,
        background: "var(--kls-tertiary-container)", color: "var(--kls-on-surface-variant)", fontSize: 11, fontWeight: 700,
        display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{count}</span>}
    </button>
  );
}

function CTContextMenu({ x, y, items, onClose }) {
  const ref = React.useRef(null);
  const [pos, setPos] = useCtState({ left: x, top: y });
  React.useEffect(() => {
    const el = ref.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const left = Math.min(x, window.innerWidth - r.width - 8);
      const top = Math.min(y, window.innerHeight - r.height - 8);
      setPos({ left, top });
    }
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 1600 }}>
      <div ref={ref} onClick={(e) => e.stopPropagation()} style={{
        position: "fixed", left: pos.left, top: pos.top, minWidth: 220,
        background: "var(--kls-on-primary)", borderRadius: 8, boxShadow: "var(--kls-drop-shadow)",
        padding: 4, display: "flex", flexDirection: "column" }}>
        {items.map((it, i) => (
          <button key={i} onClick={() => { onClose(); it.onClick(); }} style={{
            height: 52, padding: "0 var(--kls-space-small)", border: "none", background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "var(--kls-space-xsmall)", borderRadius: 6,
            fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, color: it.destructive ? "var(--kls-error)" : "var(--kls-on-secondary)", textAlign: "left" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--kls-tertiary-container)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            <KlsIcon name={it.icon} size={18} color="currentColor" />
            <span>{it.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StudentRow({ student, items, expanded, onToggle, onOpenAllocation, onMenuAllocation, onMenu }) {
  const [hover, setHover] = useCtState(false);
  const CT = window.CT;
  const r = CT.rollup(items);
  return (
    <>
      <tr onClick={onToggle} onContextMenu={onMenu} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ cursor: "pointer", borderBottom: "1px solid var(--kls-outline-variant)",
          background: hover || expanded ? "var(--kls-tertiary)" : "transparent", transition: "background 80ms var(--kls-ease-standard)" }}>
        <td style={CT_TD}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <CT.Avatar name={student.name} size={40} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{student.name}</div>
              <div style={{ fontSize: 12, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap" }}>{items.length} assignment{items.length === 1 ? "" : "s"}</div>
            </div>
          </div>
        </td>
        <td style={CT_TD}></td>
        <td style={{ ...CT_TD, minWidth: 200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, minWidth: 90 }}><CT.RollupBar items={items} /></div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap" }}>{r.done}/{r.total}</span>
          </div>
        </td>
        <td style={CT_TD}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {r.overdue > 0
              ? <CountBadge n={r.overdue} label="overdue" bg="var(--kls-accent-5)" fg="var(--kls-accent-4)" />
              : <span style={{ fontSize: 13, color: "var(--kls-on-surface-variant)" }}>—</span>}
          </div>
        </td>
        <td style={{ ...CT_TD, textAlign: "right", width: 40 }}>
          <KlsIcon name={expanded ? "chevronDown" : "chevronRight"} size={18} color="var(--kls-on-surface-variant)" />
        </td>
      </tr>
      {expanded && items.length === 0 && (
        <tr style={{ background: "var(--kls-surface-variant)", borderBottom: "1px solid var(--kls-outline-variant)" }}>
          <td colSpan={5} style={{ ...CT_TD, paddingLeft: "calc(var(--kls-space-large) + var(--kls-space-med))", color: "var(--kls-on-surface-variant)", fontSize: 13 }}>No allocations for this student yet.</td>
        </tr>
      )}
      {expanded && items.map((a) => (
        <AllocationRow key={a.id} alloc={ctStudentAlloc(a)} onOpen={() => onOpenAllocation(a.id)} onMenu={(e) => onMenuAllocation(e, a)} />
      ))}
    </>
  );
}

// Adapt a per-student assignment into an allocation-shaped object so the shared
// AllocationRow + allocation drawer can render it (single-assignee instance).
function ctStudentAlloc(a) {
  return { ...a, assigned: a.assigned || "—",
    instances: [{ studentId: a.studentId, status: a.status, score: a.score }],
    settings: a.settings || { allowResubmission: a.type !== "task", notifyOverdue: true } };
}

// Overlapping avatar stack for the Assignees column. Shows up to `max` avatars,
// then "+X more". NOTE: clicking the stack should open the shared Teammate dialog
// popup used on the Tickets and Blocks/Terms screens (not yet wired into this bundle).
function CTAvatarStack({ students, max = 3, onClick }) {
  const CT = window.CT;
  if (!students || students.length === 0) return null;
  const shown = students.slice(0, max);
  const extra = students.length - shown.length;
  return (
    <div onClick={onClick ? (e) => { e.stopPropagation(); onClick(e); } : undefined}
      style={{ display: "inline-flex", alignItems: "center", cursor: onClick ? "pointer" : "default" }}>
      <div style={{ display: "flex" }}>
        {shown.map((s, i) => (
          <div key={s.id} title={s.name} style={{ marginLeft: i === 0 ? 0 : -8, borderRadius: 999,
            position: "relative", zIndex: shown.length - i, boxShadow: "0 0 0 2px var(--kls-surface)" }}>
            <CT.Avatar name={s.name} size={28} />
          </div>
        ))}
      </div>
      {extra > 0 && <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 600, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap" }}>+{extra} more</span>}
    </div>
  );
}

function AllocationRow({ alloc, onOpen, onMenu }) {
  const [hover, setHover] = useCtState(false);
  const CT = window.CT;
  const T = CT.TYPES[alloc.type];
  const r = CT.rollup(alloc.instances);
  const meta = `${T.label} · ${alloc.type === "task" ? alloc.course : alloc.term} · Due ${alloc.due}`;
  const students = alloc.instances.map((i) => CT.STUDENTS.find((s) => s.id === i.studentId)).filter(Boolean);
  return (
    <tr onClick={onOpen} onContextMenu={onMenu} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer", borderBottom: "1px solid var(--kls-outline-variant)",
        background: hover ? "var(--kls-tertiary)" : "var(--kls-surface-variant)", transition: "background 80ms var(--kls-ease-standard)" }}>
      <td style={{ ...CT_TD, paddingLeft: "calc(var(--kls-space-large) + var(--kls-space-med))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: "var(--kls-tertiary)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <KlsIcon name={T.icon} size={16} color="var(--kls-on-surface-variant)" />
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{alloc.title}</div>
            <div style={{ fontSize: 12, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap" }}>{meta}</div>
          </div>
        </div>
      </td>
      <td style={CT_TD}>
        <CTAvatarStack students={students} />
      </td>
      <td style={{ ...CT_TD, minWidth: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, minWidth: 90 }}><CT.RollupBar items={alloc.instances} /></div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap" }}>{r.done}/{r.total}</span>
        </div>
      </td>
      <td style={CT_TD}>
        {r.overdue > 0
          ? <CountBadge n={r.overdue} label="overdue" bg="var(--kls-accent-5)" fg="var(--kls-accent-4)" />
          : <span style={{ fontSize: 13, color: "var(--kls-on-surface-variant)" }}>—</span>}
      </td>
      <td style={{ ...CT_TD, textAlign: "right", width: 40 }}>
        <KlsIcon name="chevronRight" size={16} color="var(--kls-on-surface-variant)" />
      </td>
    </tr>
  );
}

function CTGroupRow({ group, allocs, expanded, onToggle, onMenu, onOpenAllocation, onMenuAllocation }) {
  const [hover, setHover] = useCtState(false);
  const CT = window.CT;
  const members = CT.groupMembers(group);
  const items = allocs.flatMap((a) => a.instances);
  const r = CT.rollup(items);
  return (
    <>
      <tr onClick={onToggle} onContextMenu={onMenu} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ cursor: "pointer", borderBottom: "1px solid var(--kls-outline-variant)",
          background: hover || expanded ? "var(--kls-tertiary)" : "transparent", transition: "background 80ms var(--kls-ease-standard)" }}>
        <td style={CT_TD}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <CT.GroupMedallion color={group.color} icon={group.icon} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{group.name}</div>
              <div style={{ fontSize: 12, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap" }}>{allocs.length} assignment{allocs.length === 1 ? "" : "s"}</div>
            </div>
          </div>
        </td>
        <td style={CT_TD}>
          <CTAvatarStack students={members} onClick={() => {}} />
        </td>
        <td style={{ ...CT_TD, minWidth: 200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, minWidth: 90 }}><CT.RollupBar items={items} /></div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap" }}>{r.done}/{r.total}</span>
          </div>
        </td>
        <td style={CT_TD}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {r.overdue > 0
              ? <CountBadge n={r.overdue} label="overdue" bg="var(--kls-accent-5)" fg="var(--kls-accent-4)" />
              : <span style={{ fontSize: 13, color: "var(--kls-on-surface-variant)" }}>—</span>}
          </div>
        </td>
        <td style={{ ...CT_TD, textAlign: "right", width: 40 }}>
          <KlsIcon name={expanded ? "chevronDown" : "chevronRight"} size={18} color="var(--kls-on-surface-variant)" />
        </td>
      </tr>
      {expanded && allocs.length === 0 && (
        <tr style={{ background: "var(--kls-surface-variant)", borderBottom: "1px solid var(--kls-outline-variant)" }}>
          <td colSpan={5} style={{ ...CT_TD, paddingLeft: "calc(var(--kls-space-large) + var(--kls-space-med))", color: "var(--kls-on-surface-variant)", fontSize: 13 }}>No allocations for this group yet.</td>
        </tr>
      )}
      {expanded && allocs.map((a) => (
        <AllocationRow key={a.id} alloc={a} onOpen={() => onOpenAllocation(a.id)} onMenu={(e) => onMenuAllocation(e, a)} />
      ))}
    </>
  );
}

function CountBadge({ n, label, bg, fg }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "var(--kls-space-tiny) var(--kls-space-small)", borderRadius: 8,
      background: bg, color: fg, fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
      {n} {label}
    </span>
  );
}

function ControlTower({ showKpis = true, initialQuick = "all", query = "" }) {
  const CT = window.CT;
  const [assignments, setAssignments] = useCtState(() => CT.buildAssignments());
  const [allocations, setAllocations] = useCtState(() => CT.buildAllocations());
  const [quick, setQuick] = useCtState(initialQuick); // all|overdue
  const [expandedGroups, setExpandedGroups] = useCtState({});
  const [expandedStudents, setExpandedStudents] = useCtState({});
  const [openAllocId, setOpenAllocId] = useCtState(null);
  const [assignOpen, setAssignOpen] = useCtState(false);
  const [assignPreset, setAssignPreset] = useCtState([]);
  const [ctxMenu, setCtxMenu] = useCtState(null); // {x,y,items}
  const [toast, setToast] = useCtState(null);

  const roster = useCtMemo(() => ({
    people: CT.STUDENTS.map((s) => ({ id: s.id, name: s.name, email: s.email })),
    groups: CT.GROUPS.map((g) => ({ id: g.id, name: g.name, color: g.color, icon: g.icon,
      count: CT.groupMembers(g).length, memberIds: g.memberIds })),
  }), []);

  const itemsByStudent = useCtMemo(() => {
    const m = {};
    CT.STUDENTS.forEach((s) => { m[s.id] = []; });
    assignments.forEach((a) => { (m[a.studentId] = m[a.studentId] || []).push(a); });
    return m;
  }, [assignments]);

  const allocsByGroup = useCtMemo(() => {
    const m = {};
    CT.GROUPS.forEach((g) => { m[g.id] = []; });
    allocations.forEach((a) => { (m[a.groupId] = m[a.groupId] || []).push(a); });
    return m;
  }, [allocations]);

  const totals = useCtMemo(() => {
    const instances = allocations.flatMap((a) => a.instances);
    let overdue = 0, inProgress = 0, done = 0;
    instances.forEach((a) => {
      if (a.status === "overdue") overdue++;
      if (a.status === "in_progress") inProgress++;
      if (CT.DONE.includes(a.status)) done++;
    });
    const pct = instances.length ? Math.round((done / instances.length) * 100) : 0;
    return { overdue, inProgress, pct };
  }, [allocations]);

  const studentHasOverdue = (s) => (itemsByStudent[s.id] || []).some((a) => a.status === "overdue");
  const studentInProgress = (s) => (itemsByStudent[s.id] || []).some((a) => a.status === "in_progress");
  const groupItems = (g) => (allocsByGroup[g.id] || []).flatMap((a) => a.instances);
  const groupHasOverdue = (g) => groupItems(g).some((a) => a.status === "overdue");
  const groupInProgress = (g) => groupItems(g).some((a) => a.status === "in_progress");

  const term = query.trim().toLowerCase();
  const studentMatch = (s) => !term || s.name.toLowerCase().includes(term) || s.email.toLowerCase().includes(term);

  const groups = CT.GROUPS.filter((g) => {
    const members = CT.groupMembers(g);
    if (term && !(g.name.toLowerCase().includes(term) || members.some(studentMatch))) return false;
    if (quick === "overdue" && !groupHasOverdue(g)) return false;
    if (quick === "in_progress" && !groupInProgress(g)) return false;
    return true;
  });
  const looseStudents = CT.ungrouped().filter((s) => {
    if (!studentMatch(s)) return false;
    if (quick === "overdue" && !studentHasOverdue(s)) return false;
    if (quick === "in_progress" && !studentInProgress(s)) return false;
    return true;
  });
  const overdueCount = CT.GROUPS.filter(groupHasOverdue).length + CT.ungrouped().filter(studentHasOverdue).length;
  const inProgressCount = CT.GROUPS.filter(groupInProgress).length + CT.ungrouped().filter(studentInProgress).length;
  const rowCount = groups.length + looseStudents.length;

  function doAssign(created) {
    setAssignments((cur) => [...created, ...cur]);
    setAssignOpen(false);
    setAssignPreset([]);
    const n = new Set(created.map((c) => c.studentId)).size;
    const what = created[0] ? created[0].title : "assignment";
    setToast(`Assigned “${what}” to ${n} student${n === 1 ? "" : "s"}.`);
    setTimeout(() => setToast(null), 3200);
  }

  function saveAllocation(updated) {
    if (allocations.some((a) => a.id === updated.id)) {
      setAllocations((cur) => cur.map((a) => (a.id === updated.id ? updated : a)));
    } else {
      const inst = updated.instances[0] || {};
      setAssignments((cur) => cur.map((a) => (a.id === updated.id
        ? { ...a, due: updated.due, title: updated.title, course: updated.course, term: updated.term, instructions: updated.instructions, status: inst.status, score: inst.score } : a)));
    }
    setOpenAllocId(null);
    setToast(`Updated “${updated.title}”.`);
    setTimeout(() => setToast(null), 3200);
  }
  function removeAllocation(alloc) {
    if (allocations.some((a) => a.id === alloc.id)) setAllocations((cur) => cur.filter((a) => a.id !== alloc.id));
    else setAssignments((cur) => cur.filter((a) => a.id !== alloc.id));
    setOpenAllocId(null);
    setToast(`Removed “${alloc.title}”.`);
    setTimeout(() => setToast(null), 3200);
  }

  function openMenu(e, items) {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, items });
  }
  const menuStudent = (e, s) => openMenu(e, [
    { icon: "worklog", label: "Add assignment", onClick: () => { setAssignPreset([{ type: "person", id: s.id }]); setAssignOpen(true); } },
  ]);
  const menuGroup = (e, g) => openMenu(e, [
    { icon: "worklog", label: "Add assignment", onClick: () => { setAssignPreset([{ type: "group", id: g.id }]); setAssignOpen(true); } },
  ]);
  const menuAllocation = (e, a) => openMenu(e, [
    { icon: "pencil", label: "Edit", onClick: () => setOpenAllocId(a.id) },
    { icon: "trash", label: "Remove", destructive: true, onClick: () => removeAllocation(a) },
  ]);

  return (
    <div style={{ flex: 1, minWidth: 0, overflowY: "auto", background: "var(--kls-scaffold-bg)" }}>
      <div style={{ padding: "var(--kls-space-med) var(--kls-space-large) var(--kls-space-xlarge)", display: "flex", flexDirection: "column", gap: "var(--kls-space-med)" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-med)" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: "0 0 var(--kls-space-tiny)", fontFamily: "var(--kls-font-sans)", fontSize: 24, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--kls-on-surface)" }}>Control Tower</h1>
            <p style={{ margin: 0, fontFamily: "var(--kls-font-sans)", fontSize: 13.5, color: "var(--kls-on-surface-variant)" }}>Assign tasks and exams, and track what your students have done.</p>
          </div>
          <button style={ctPrimaryBtn} onClick={() => { setAssignPreset([]); setAssignOpen(true); }}>
            <span style={{ fontSize: 18, lineHeight: 1, marginTop: -1 }}>+</span> Assign
          </button>
        </div>

        {/* KPIs */}
        {showKpis && (
        <div style={{ display: "flex", gap: "var(--kls-space-small)", flexWrap: "wrap" }}>
          <StatCard label="Students" value={CT.STUDENTS.length} icon="group" />
          <StatCard label="In progress" value={totals.inProgress} tone={totals.inProgress ? "var(--kls-info)" : null} icon="worklog" />
          <StatCard label="Overdue" value={totals.overdue} tone={totals.overdue ? "var(--kls-accent-4)" : null} icon="clock" />
          <StatCard label="Completion" value={totals.pct + "%"} icon="checkpoint" />
        </div>
        )}

        {/* List card */}
        <div style={{ background: "var(--kls-surface)", border: "1px solid var(--kls-outline-variant)", borderRadius: 12, overflow: "hidden" }}>
          {/* Quick filters */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "var(--kls-space-small) var(--kls-space-med)", borderBottom: "1px solid var(--kls-outline-variant)", flexWrap: "wrap" }}>
            <CTFilterChip active={quick === "all"} label="All" onClick={() => setQuick("all")} />
            <CTFilterChip active={quick === "in_progress"} label="In progress" count={inProgressCount} onClick={() => setQuick("in_progress")} />
            <CTFilterChip active={quick === "overdue"} label="Has overdue" count={overdueCount} onClick={() => setQuick("overdue")} />
          </div>

          {/* Table */}
          {rowCount === 0 ? (
            <div style={{ padding: "var(--kls-space-xlarge) var(--kls-space-med)", textAlign: "center", fontFamily: "var(--kls-font-sans)" }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--kls-on-surface)" }}>Nothing matches</div>
              <div style={{ fontSize: 14, color: "var(--kls-on-surface-variant)", marginTop: 4 }}>Try clearing the search or filters.</div>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={CT_TH}>Group / Student</th>
                  <th style={CT_TH}>Assignees</th>
                  <th style={CT_TH}>Progress</th>
                  <th style={CT_TH}>Needs attention</th>
                  <th style={{ ...CT_TH, width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {groups.map((g) => (
                  <CTGroupRow key={g.id} group={g} allocs={allocsByGroup[g.id] || []}
                    expanded={!!expandedGroups[g.id]}
                    onToggle={() => setExpandedGroups((e) => ({ ...e, [g.id]: !e[g.id] }))}
                    onMenu={(e) => menuGroup(e, g)}
                    onOpenAllocation={(id) => setOpenAllocId(id)}
                    onMenuAllocation={menuAllocation} />
                ))}
                {looseStudents.map((s) => (
                  <StudentRow key={s.id} student={s} items={itemsByStudent[s.id] || []}
                    expanded={!!expandedStudents[s.id]}
                    onToggle={() => setExpandedStudents((e) => ({ ...e, [s.id]: !e[s.id] }))}
                    onOpenAllocation={(id) => setOpenAllocId(id)}
                    onMenuAllocation={menuAllocation}
                    onMenu={(e) => menuStudent(e, s)} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Drawers */}
      {assignOpen && (
        <window.CTAssignDrawer
          roster={roster}
          presetAssignees={assignPreset}
          onClose={() => { setAssignOpen(false); setAssignPreset([]); }}
          onAssign={doAssign} />
      )}

      {openAllocId && (() => {
        const groupAlloc = allocations.find((a) => a.id === openAllocId);
        const assignAlloc = !groupAlloc ? assignments.find((a) => a.id === openAllocId) : null;
        const alloc = groupAlloc || (assignAlloc ? ctStudentAlloc(assignAlloc) : null);
        if (!alloc) return null;
        const group = groupAlloc ? CT.GROUPS.find((g) => g.id === groupAlloc.groupId) : null;
        const student = assignAlloc ? CT.STUDENTS.find((s) => s.id === assignAlloc.studentId) : null;
        const contextLabel = group ? group.name : (student ? student.name : "");
        return (
          <window.CTAllocationDrawer
            allocation={alloc}
            group={group}
            contextLabel={contextLabel}
            roster={roster}
            onClose={() => setOpenAllocId(null)}
            onSave={saveAllocation}
            onRemove={removeAllocation} />
        );
      })()}

      {ctxMenu && (
        <CTContextMenu x={ctxMenu.x} y={ctxMenu.y} onClose={() => setCtxMenu(null)}
          items={ctxMenu.items} />
      )}

      {/* Snackbar */}
      {toast && (
        <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 1700,
          maxWidth: 540, background: "var(--kls-tertiary-container)", color: "var(--kls-on-tertiary-container)",
          borderRadius: 12, boxShadow: "var(--kls-drop-shadow)", padding: "var(--kls-space-small) var(--kls-space-med)",
          fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600 }}>
          {toast}
        </div>
      )}
    </div>
  );
}

// ── App shell ────────────────────────────────────────────────────────────────

// (student drawer removed — student rows now expand inline like groups)


// ct-allocation-drawer.jsx — Allocation detail: work assigned to a whole group.
//   Shows info + each assignee's progress. Header Edit button flips to edit mode; Save persists.
// Reads window.CT.
const { useState: useCtldState, useEffect: useCtldEffect } = React;

function CTAllocLabel({ children }) {
  return (
    <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
      textTransform: "uppercase", color: "var(--kls-on-surface-variant)", marginBottom: "var(--kls-space-small)" }}>{children}</div>
  );
}

function CTAllocProgressRow({ inst, last }) {
  const CT = window.CT;
  const s = CT.STUDENTS.find((x) => x.id === inst.studentId) || { name: "Unknown" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--kls-space-small) 0",
      borderBottom: last ? "none" : "1px solid var(--kls-outline-variant)" }}>
      <CT.Avatar name={s.name} size={36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600, color: "var(--kls-on-surface)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
        <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)" }}>
          {inst.score != null ? `Score ${inst.score}%` : "No score yet"}
        </div>
      </div>
      <CT.StatusPill status={inst.status} />
    </div>
  );
}

function CTAllocationDrawer({ allocation, group, contextLabel, roster, onClose, onSave, onRemove }) {
  const CT = window.CT;
  const T = CT.TYPES[allocation.type];
  const initialAssignees = group
    ? [{ type: "group", id: group.id }]
    : (allocation.instances[0] ? [{ type: "person", id: allocation.instances[0].studentId }] : []);

  const [shown, setShown] = useCtldState(false);
  const [editing, setEditing] = useCtldState(false);
  const [due, setDue] = useCtldState(allocation.due);
  const [term, setTerm] = useCtldState(allocation.term || "");
  const [course, setCourse] = useCtldState(allocation.type === "task" ? (allocation.course || "") : "");
  const [task, setTask] = useCtldState(allocation.type === "task" ? allocation.title : "");
  const [studentDefined, setStudentDefined] = useCtldState(!!allocation.studentDefined);
  const [topic, setTopic] = useCtldState(allocation.topic || "");
  const [qCount, setQCount] = useCtldState(String(allocation.qCount || 20));
  const [selModules, setSelModules] = useCtldState(() => new Set(allocation.selModules || []));
  const [instructions, setInstructions] = useCtldState(allocation.instructions || "");
  const [assignees, setAssignees] = useCtldState(initialAssignees);
  const [pickerOpen, setPickerOpen] = useCtldState(false);

  useCtldEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    function onKey(e) { if (e.key === "Escape" && !pickerOpen) onClose && onClose(); }
    document.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(id); document.removeEventListener("keydown", onKey); };
  }, [pickerOpen]);

  const r = CT.rollup(allocation.instances);
  const drawerWidth = "min(500px, calc(100vw - 24px))";
  const oralTopics = (window.KILSAR_DATA && window.KILSAR_DATA.blocks) ? window.KILSAR_DATA.blocks.map((b) => b.title) : [];
  const courses = term ? (CT.COURSES[term] || []) : [];
  const tasks = course ? (CT.TASK_LIBRARY[course] || []) : [];
  const chips = assignees.map((s) => {
    if (s.type === "group") { const g = (roster.groups || []).find((x) => x.id === s.id); return { ...s, label: g && g.name, color: g && g.color }; }
    const p = (roster.people || []).find((x) => x.id === s.id); return { ...s, label: p && p.name };
  }).filter((c) => c.label);
  const valid = assignees.length > 0 && (allocation.type === "task" ? !!task : allocation.type === "oral" ? (studentDefined || !!topic) : (studentDefined || selModules.size > 0));

  function cancelEdit() {
    setDue(allocation.due);
    setTerm(allocation.term || "");
    setCourse(allocation.type === "task" ? (allocation.course || "") : "");
    setTask(allocation.type === "task" ? allocation.title : "");
    setStudentDefined(!!allocation.studentDefined);
    setTopic(allocation.topic || "");
    setQCount(String(allocation.qCount || 20));
    setSelModules(new Set(allocation.selModules || []));
    setInstructions(allocation.instructions || "");
    setAssignees(initialAssignees);
    setEditing(false);
  }
  function buildUpdated() {
    const studentIds = [...new Set(assignees.flatMap((a) => a.type === "group"
      ? (((roster.groups || []).find((g) => g.id === a.id) || {}).memberIds || [])
      : [a.id]))];
    const prev = {};
    allocation.instances.forEach((i) => { prev[i.studentId] = i; });
    const instances = studentIds.length
      ? studentIds.map((id) => prev[id] || { studentId: id, status: "not_started", score: null })
      : allocation.instances;
    return { ...allocation, due,
      title: allocation.type === "task" ? (task || allocation.title) : allocation.title,
      course: allocation.type === "task" ? course : allocation.course,
      term: term || allocation.term,
      studentDefined, topic, qCount, selModules: [...selModules], instructions, instances };
  }

  const stat = (label, value, tone) => (
    <div style={{ flex: 1, minWidth: 0, background: "var(--kls-surface-variant)", borderRadius: 12, padding: "var(--kls-space-small)" }}>
      <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 22, fontWeight: 700, color: tone || "var(--kls-on-surface)" }}>{value}</div>
      <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, color: "var(--kls-on-surface-variant)", marginTop: 2 }}>{label}</div>
    </div>
  );

  const infoRow = (label, value) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "var(--kls-space-small) 0", borderBottom: "1px solid var(--kls-outline-variant)" }}>
      <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 500, color: "var(--kls-on-surface-variant)" }}>{label}</span>
      <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600, color: "var(--kls-on-surface)", textAlign: "right" }}>{value}</span>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1500 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "var(--kls-scrim)", opacity: shown ? 1 : 0, transition: "opacity 250ms var(--kls-ease-standard)" }} />
      <div style={{
        position: "absolute", top: 12, bottom: 12, right: 12, width: drawerWidth,
        background: "var(--kls-surface)", borderRadius: 8, boxShadow: "var(--kls-drop-shadow)",
        display: "flex", flexDirection: "column", overflow: "hidden",
        transform: shown ? "translateX(0)" : "translateX(calc(100% + 24px))",
        transition: "transform 250ms var(--kls-ease-standard)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "var(--kls-space-med)", borderBottom: "1px solid var(--kls-outline-variant)" }}>
          <span style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0, background: "var(--kls-tertiary)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <KlsIcon name={T.icon} size={22} color="var(--kls-on-surface-variant)" />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 18, fontWeight: 700, color: "var(--kls-on-surface)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{allocation.title}</div>
            <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 500, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{T.label} · {contextLabel || (group ? group.name : "")}</div>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} style={{ height: 36, padding: "0 var(--kls-space-small)", borderRadius: 8, cursor: "pointer",
              background: "transparent", color: "var(--kls-on-surface)", border: "1px solid var(--kls-outline-variant)", display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0,
              fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 700 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--kls-tertiary)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <KlsIcon name="pencil" size={15} color="currentColor" /> Edit
            </button>
          )}
          <button onClick={onClose} aria-label="Close"
            style={{ width: 36, height: 36, borderRadius: 999, border: "none", cursor: "pointer", background: "transparent",
              color: "var(--kls-on-surface)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--kls-tertiary)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: "currentColor", fill: "none", strokeWidth: 1.8 }}>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "var(--kls-space-med)", display: "flex", flexDirection: "column", gap: "var(--kls-space-med)" }}>
          {/* progress summary */}
          <div>
            <CTAllocLabel>Progress</CTAllocLabel>
            <div style={{ display: "flex", gap: "var(--kls-space-small)", marginBottom: "var(--kls-space-small)" }}>
              {stat("Completed", `${r.done}/${r.total}`)}
              {stat("In progress", r.inProgress, r.inProgress ? "var(--kls-info)" : null)}
              {stat("Overdue", r.overdue, r.overdue ? "var(--kls-accent-4)" : null)}
            </div>
            <CT.RollupBar items={allocation.instances} height={8} />
          </div>

          {editing ? (
            <>
              {/* Type (locked) */}
              <div>
                <CTLabel>Type</CTLabel>
                <div style={{ display: "flex", alignItems: "center", gap: 10, height: 48, boxSizing: "border-box", padding: "0 var(--kls-space-small)", borderRadius: 8, border: "1px solid var(--kls-outline-variant)", background: "var(--kls-surface-variant)" }}>
                  <KlsIcon name={T.icon} size={18} color="var(--kls-on-surface-variant)" />
                  <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600, color: "var(--kls-on-surface)" }}>{T.label}</span>
                  <span style={{ marginLeft: "auto", fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)" }}>Can’t be changed</span>
                </div>
              </div>

              {/* Type-specific controls (mirrors the Assign flow) */}
              {allocation.type === "task" ? (
                <>
                  <div><CTLabel>Term</CTLabel><CTSelect value={term} options={CT.TERMS} placeholder="Select a term" onChange={(v) => { setTerm(v); setCourse(""); setTask(""); }} /></div>
                  <div><CTLabel>Course</CTLabel><CTSelect value={course} options={courses} placeholder={term ? "Select a course" : "Choose a term first"} disabled={!term} onChange={(v) => { setCourse(v); setTask(""); }} /></div>
                  <div><CTLabel>Task</CTLabel><CTSelect value={task} options={tasks} placeholder={course ? "Select a task" : "Choose a course first"} disabled={!course} onChange={setTask} /></div>
                </>
              ) : allocation.type === "oral" ? (
                <>
                  <div style={{ background: "var(--kls-surface-variant)", borderRadius: 12, padding: "var(--kls-space-small)" }}>
                    <CTToggleRow label="Let the student choose the topic" hint="Student picks the topic when they begin the oral exam." checked={studentDefined} onChange={setStudentDefined} />
                  </div>
                  {!studentDefined && (<div><CTLabel>Topic</CTLabel><CTSelect value={topic} options={oralTopics} placeholder="Select a topic" onChange={setTopic} /></div>)}
                </>
              ) : (
                <>
                  <div style={{ background: "var(--kls-surface-variant)", borderRadius: 12, padding: "var(--kls-space-small)" }}>
                    <CTToggleRow label="Let the student choose parameters" hint="Student sets topic, length, and scope when they begin." checked={studentDefined} onChange={setStudentDefined} />
                  </div>
                  {!studentDefined && (<WrittenTopicPicker selModules={selModules} setSelModules={setSelModules} count={qCount} setCount={setQCount} />)}
                </>
              )}

              {/* Instructions */}
              <div>
                <CTLabel>Instructions (optional)</CTLabel>
                <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} placeholder="What should students focus on or prepare?"
                  style={{ ...ctInput, height: "auto", padding: "var(--kls-space-small)", resize: "vertical", lineHeight: 1.45 }} />
              </div>

              {/* Assignees */}
              <div>
                <CTLabel trailing={chips.length > 0 ? (<span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 700, color: "var(--kls-on-surface-variant)", textTransform: "none", letterSpacing: 0 }}>{chips.length} selected</span>) : null}>Assign to</CTLabel>
                {chips.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                    {chips.map((c) => {
                      const dot = c.type === "group" ? ((window.PK_COLORS[c.color] || window.PK_COLORS.blue).fg) : "var(--kls-primary)";
                      return (
                        <span key={c.type + c.id} style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 32, paddingLeft: 10, paddingRight: 6, borderRadius: 999, background: "var(--kls-tertiary)", border: "1px solid var(--kls-outline-variant)", fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 600, color: "var(--kls-on-surface)" }}>
                          <span style={{ width: 8, height: 8, borderRadius: 999, background: dot }} />
                          {c.label}
                          <button onClick={() => setAssignees((cur) => cur.filter((x) => !(x.type === c.type && x.id === c.id)))} aria-label={"Remove " + c.label} style={{ width: 20, height: 20, borderRadius: 999, border: "none", cursor: "pointer", background: "transparent", color: "var(--kls-on-surface-variant)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                            <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: "currentColor", fill: "none", strokeWidth: 2 }}><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
                <button onClick={() => setPickerOpen(true)} style={{ width: "100%", height: 48, borderRadius: 8, cursor: "pointer", background: "transparent", border: "1px dashed var(--kls-outline)", color: "var(--kls-on-surface)", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600 }}>
                  <KlsIcon name="group" size={16} color="var(--kls-on-surface)" /> Choose students / groups
                </button>
              </div>

              {/* Due date */}
              <div>
                <CTLabel>Due date</CTLabel>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, boxSizing: "border-box", padding: "0 var(--kls-space-small)", borderRadius: 8, border: "1px solid var(--kls-outline-variant)", background: "var(--kls-surface)" }}>
                  <KlsIcon name="date" size={16} color="var(--kls-on-surface-variant)" />
                  <input value={due} onChange={(e) => setDue(e.target.value)} placeholder="No due date"
                    style={{ border: "none", outline: "none", background: "transparent", width: 160, fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600, color: "var(--kls-on-surface)" }} />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* details */}
              <div>
                <CTAllocLabel>Details</CTAllocLabel>
                {infoRow("Type", T.label)}
                {infoRow(allocation.type === "task" ? "Course" : "Term", allocation.type === "task" ? allocation.course : allocation.term)}
                {infoRow("Assigned", allocation.assigned)}
                {infoRow("Due date", due)}
              </div>

              {/* student progress */}
              <div>
                <CTAllocLabel>Student progress</CTAllocLabel>
                {allocation.instances.map((inst, i) => (
                  <CTAllocProgressRow key={inst.studentId} inst={inst} last={i === allocation.instances.length - 1} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "var(--kls-space-small) var(--kls-space-med) var(--kls-space-med)", borderTop: "1px solid var(--kls-outline-variant)" }}>
          {editing ? (
            <>
              <button onClick={() => onRemove && onRemove(allocation)} style={{ height: 44, padding: "0 var(--kls-space-med)", borderRadius: 8, cursor: "pointer",
                background: "transparent", color: "var(--kls-error)", border: "1px solid var(--kls-outline-variant)", display: "inline-flex", alignItems: "center", gap: 8,
                fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 700 }}>
                <KlsIcon name="trash" size={16} color="var(--kls-error)" /> Delete
              </button>
              <div style={{ display: "inline-flex", gap: 8 }}>
                <button onClick={cancelEdit} style={{ height: 44, padding: "0 var(--kls-space-med)", borderRadius: 8, cursor: "pointer",
                  background: "transparent", color: "var(--kls-on-surface)", border: "1px solid var(--kls-outline-variant)",
                  fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 700 }}>Cancel</button>
                <button onClick={() => onSave && onSave(buildUpdated())} disabled={!valid} style={{ height: 44, padding: "0 var(--kls-space-med)", borderRadius: 8, border: "none", cursor: valid ? "pointer" : "default",
                  background: "var(--kls-tertiary-container)", color: "var(--kls-on-tertiary-container)", opacity: valid ? 1 : 0.5,
                  fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 700 }}>Save changes</button>
              </div>
            </>
          ) : (
            <button onClick={onClose} style={{ height: 44, padding: "0 var(--kls-space-med)", borderRadius: 8, cursor: "pointer", marginLeft: "auto",
              background: "transparent", color: "var(--kls-on-surface)", border: "1px solid var(--kls-outline-variant)",
              fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 700 }}>Close</button>
          )}
        </div>
      </div>
      {pickerOpen && (
        <window.TeammatePicker
          title="Choose students / groups"
          mode="multi"
          kinds={["people", "groups"]}
          peopleRoster={roster.people}
          groups={roster.groups}
          initialSelection={assignees}
          onClose={() => setPickerOpen(false)}
          onSubmit={(sel) => { setAssignees(sel); setPickerOpen(false); }} />
      )}
    </div>
  );
}

window.CTAllocationDrawer = CTAllocationDrawer;

// ct-assign-drawer.jsx — Assign a Task / Oral exam / Written exam to students.
//   • Task: pick Term → Course → existing Task.
//   • Oral / Written exam: open-ended — instructor defines parameters, or lets the student choose.
//   • Assignees chosen via the TeammatePicker (students).
// Reads window.CT, window.TeammatePicker.
const { useState: useCtadState, useEffect: useCtadEffect } = React;

function CTLabel({ children, trailing }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
      <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--kls-on-surface-variant)" }}>{children}</span>
      <span style={{ flex: 1 }} />
      {trailing}
    </div>
  );
}

const ctInput = {
  width: "100%", boxSizing: "border-box", height: 48, padding: "0 var(--kls-space-small)", borderRadius: 8,
  background: "var(--kls-surface)", border: "1px solid var(--kls-outline-variant)",
  fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500, color: "var(--kls-on-surface)", outline: "none",
};

function CTSelect({ value, options, placeholder, disabled, onChange }) {
  return (
    <div style={{ position: "relative", opacity: disabled ? 0.5 : 1 }}>
      <select value={value || ""} disabled={disabled} onChange={(e) => onChange(e.target.value)}
        style={{ ...ctInput, appearance: "none", WebkitAppearance: "none", cursor: disabled ? "not-allowed" : "pointer",
          color: value ? "var(--kls-on-surface)" : "var(--kls-on-surface-variant)", paddingRight: 40 }}>
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg viewBox="0 0 24 24" style={{ position: "absolute", right: 12, top: 15, width: 18, height: 18, pointerEvents: "none",
        stroke: "var(--kls-on-surface-variant)", fill: "none", strokeWidth: 1.6 }}>
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function CTToggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} aria-pressed={checked} style={{
      width: 44, height: 26, borderRadius: 999, border: "none", cursor: "pointer", padding: 2, flexShrink: 0,
      background: checked ? "var(--kls-primary)" : "var(--kls-outline-variant)",
      display: "inline-flex", alignItems: "center", transition: "background 120ms var(--kls-ease-standard)" }}>
      <span style={{ width: 22, height: 22, borderRadius: 999, background: "var(--kls-surface)",
        transform: checked ? "translateX(18px)" : "translateX(0)", transition: "transform 120ms var(--kls-ease-standard)",
        boxShadow: "0 1px 2px rgba(0,0,0,.2)" }} />
    </button>
  );
}

function CTToggleRow({ label, hint, checked, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600, color: "var(--kls-on-surface)" }}>{label}</div>
        {hint && <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)", marginTop: 1 }}>{hint}</div>}
      </div>
      <CTToggle checked={checked} onChange={onChange} />
    </div>
  );
}

function CTTypeCard({ active, icon, label, sub, accent, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, display: "flex", flexDirection: "column", textAlign: "left", cursor: "pointer",
      padding: "var(--kls-space-small)", borderRadius: 8,
      border: active ? `2px solid ${accent}` : "1.5px solid var(--kls-outline-variant)",
      background: active ? `color-mix(in srgb, ${accent} 8%, transparent)` : "var(--kls-surface)",
      transition: "all var(--kls-dur-fast-animation) var(--kls-ease-standard)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-xsmall)" }}>
        <span style={{ display: "inline-flex" }}>
          <KlsIcon name={icon} size={18} color={active ? accent : "var(--kls-on-surface)"} />
        </span>
        <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600, color: "var(--kls-primary)" }}>{label}</span>
      </div>
      <div style={{ marginTop: "var(--kls-space-xsmall)", minHeight: "2.9em", fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)", lineHeight: 1.45 }}>{sub}</div>
    </button>
  );
}

function CTCheck({ checked, indeterminate, onClick }) {
  const on = checked || indeterminate;
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick && onClick(); }} aria-label="toggle" style={{
      width: 18, height: 18, borderRadius: 4, flexShrink: 0, cursor: "pointer", padding: 0,
      border: on ? "1.5px solid var(--kls-primary)" : "1.5px solid var(--kls-outline)",
      background: on ? "var(--kls-primary)" : "transparent", color: "var(--kls-on-primary)",
      display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      {checked && <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "currentColor", fill: "none", strokeWidth: 3 }}><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      {indeterminate && !checked && <span style={{ width: 8, height: 2, background: "currentColor", borderRadius: 1 }} />}
    </button>
  );
}

// Question-pool taxonomy for the Written exam assign flow: Term → Course → ACS code (leaf).
// Each course is tagged with an FAA subject so the subject filter still applies.
const CT_POOL = [
  { id: "t-f24", name: "Fall 2024", courses: [
    { id: "c-pp1", name: "Powerplant Systems", subject: "Powerplant", codes: [
      { id: "pp1a", code: "PA.I.A",  desc: "Reciprocating engine theory & construction", count: 18, mastery: 0.74 },
      { id: "pp1b", code: "PA.I.B",  desc: "Valves & valve mechanisms", count: 22, mastery: 0.81 },
      { id: "pp3a", code: "PA.III.A", desc: "Magnetos & ignition timing", count: 26, mastery: 0.84 },
    ]},
    { id: "c-af1", name: "Airframe Structures", subject: "Airframe", codes: [
      { id: "af1a", code: "AM.II.A.K1", desc: "Sheet metal layout & forming", count: 34, mastery: 0.72 },
      { id: "af1b", code: "AM.II.A.K2", desc: "Riveting & fastener selection", count: 16, mastery: 0.59 },
    ]},
    { id: "c-gen1", name: "General & Regulations", subject: "General", codes: [
      { id: "g1k1",  code: "AM.I.A.K1",  desc: "Electron theory (conventional flow vs. electron flow).", count: 3, mastery: 0.66 },
      { id: "g1k10", code: "AM.I.A.K10", desc: "Current.", count: 5, mastery: 0.9 },
      { id: "g1k11", code: "AM.I.A.K11", desc: "Resistance.", count: 7, mastery: 0.78 },
      { id: "g1far", code: "GE.I.A",     desc: "FAR Part 43 — maintenance records", count: 12, mastery: 0.86 },
    ]},
  ]},
  { id: "t-s25", name: "Spring 2025", courses: [
    { id: "c-pp2", name: "Turbine Theory", subject: "Powerplant", codes: [
      { id: "pp2a", code: "PA.IV.A", desc: "Compressor stages & airflow", count: 20, mastery: 0.71 },
      { id: "pp2b", code: "PA.IV.B", desc: "EGT & engine instruments", count: 14, mastery: -1 },
    ]},
    { id: "c-af2", name: "Airframe Systems", subject: "Airframe", codes: [
      { id: "af2a", code: "AM.II.B.K1", desc: "Hydraulics & pneumatics", count: 28, mastery: 0.64 },
      { id: "af2b", code: "AM.II.B.K2", desc: "Landing gear systems", count: 24, mastery: 0.71 },
    ]},
    { id: "c-gen2", name: "Physics & Math", subject: "General", codes: [
      { id: "g2a", code: "GE.II.A", desc: "Mathematics for aviation", count: 16, mastery: 0.72 },
      { id: "g2b", code: "GE.II.B", desc: "Physics principles", count: 19, mastery: 0.68 },
    ]},
  ]},
];

// Study-mode question-pool picker (Term → Course → ACS code) for the Written exam assign flow.
function WrittenTopicPicker({ selModules, setSelModules, count, setCount }) {
  const [expanded, setExpanded] = useCtadState({});
  const [subj, setSubj] = useCtadState("All");
  const subjects = ["All", "Powerplant", "Airframe", "General"];
  const allCodes = CT_POOL.flatMap((t) => t.courses.flatMap((c) => c.codes));
  const pool = allCodes.reduce((a, c) => a + (selModules.has(c.id) ? c.count : 0), 0);
  const n = Number(count) || 0;
  const drawing = Math.min(n, pool);
  const toggleOne = (id) => setSelModules((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleSet = (ids) => setSelModules((prev) => { const s = new Set(prev); const all = ids.every((id) => s.has(id)); ids.forEach((id) => all ? s.delete(id) : s.add(id)); return s; });
  const toggleExpand = (id) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  const qStyle = { fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap", flexShrink: 0 };
  const stepBtn = { width: 36, height: 32, display: "grid", placeItems: "center", border: "none", background: "transparent", borderRadius: 8, padding: 0, fontSize: 20, lineHeight: 1 };
  const chev = (open, onClick) => (
    <button onClick={onClick} aria-label="expand" style={{ width: 20, height: 20, border: "none", background: "transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
      <KlsIcon name={open ? "chevronDown" : "chevronRight"} size={16} color="var(--kls-on-surface-variant)" />
    </button>
  );
  const cfgRow = (label, value) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "3px 0" }}>
      <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, color: "var(--kls-on-surface-variant)" }}>{label}</span>
      <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 700, color: "var(--kls-on-surface)" }}>{value}</span>
    </div>
  );

  return (
    <>
      <div>
        <CTLabel>Topics</CTLabel>
        <div style={{ display: "flex", gap: "var(--kls-space-xsmall)", flexWrap: "wrap", marginBottom: "var(--kls-space-small)" }}>
          {subjects.map((s) => {
            const active = subj === s;
            return (
              <button key={s} onClick={() => setSubj(s)} style={{
                height: 32, padding: "0 var(--kls-space-small)", borderRadius: 999, cursor: "pointer",
                fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 600,
                background: active ? "var(--kls-tertiary-container)" : "var(--kls-tertiary)",
                border: `1px solid ${active ? "var(--kls-primary)" : "var(--kls-outline-variant)"}`,
                color: active ? "var(--kls-on-surface)" : "var(--kls-on-tertiary)" }}>{s}</button>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--kls-space-xsmall)" }}>
          {CT_POOL.map((t) => {
            const courses = subj === "All" ? t.courses : t.courses.filter((c) => c.subject === subj);
            if (!courses.length) return null;
            const tCodes = courses.flatMap((c) => c.codes);
            const tIds = tCodes.map((c) => c.id);
            const tAll = tIds.every((id) => selModules.has(id));
            const tSome = tIds.some((id) => selModules.has(id));
            const tTotal = tCodes.reduce((a, c) => a + c.count, 0);
            const tOpen = !!expanded[t.id];
            return (
              <div key={t.id} style={{ borderRadius: 8, border: "1px solid var(--kls-outline-variant)", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-small)", padding: "var(--kls-space-small)", background: "var(--kls-surface-variant)" }}>
                  {chev(tOpen, () => toggleExpand(t.id))}
                  <CTCheck checked={tAll} indeterminate={tSome && !tAll} onClick={() => toggleSet(tIds)} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontFamily: "var(--kls-font-sans)", fontWeight: 600, fontSize: 14, color: "var(--kls-on-surface)", whiteSpace: "nowrap" }}>{t.name}</span>
                  </div>
                  <span style={qStyle}>{tTotal} Q</span>
                </div>
                {tOpen && courses.map((c) => {
                  const cIds = c.codes.map((x) => x.id);
                  const cAll = cIds.every((id) => selModules.has(id));
                  const cSome = cIds.some((id) => selModules.has(id));
                  const cTotal = c.codes.reduce((a, x) => a + x.count, 0);
                  const cOpen = !!expanded[c.id];
                  return (
                    <React.Fragment key={c.id}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-small)", padding: "var(--kls-space-small) var(--kls-space-small) var(--kls-space-small) var(--kls-space-large)", borderTop: "1px solid var(--kls-outline-variant)", background: "var(--kls-surface)" }}>
                        {chev(cOpen, () => toggleExpand(c.id))}
                        <CTCheck checked={cAll} indeterminate={cSome && !cAll} onClick={() => toggleSet(cIds)} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontFamily: "var(--kls-font-sans)", fontWeight: 600, fontSize: 14, color: "var(--kls-on-surface)", whiteSpace: "nowrap" }}>{c.name}</span>
                        </div>
                        <span style={qStyle}>{cTotal} Q</span>
                      </div>
                      {cOpen && c.codes.map((x) => {
                        const sel = selModules.has(x.id);
                        return (
                          <div key={x.id} onClick={() => toggleOne(x.id)} style={{
                            display: "flex", alignItems: "center", gap: "var(--kls-space-small)",
                            padding: "var(--kls-space-small) var(--kls-space-small) var(--kls-space-small) calc(var(--kls-space-large) + var(--kls-space-med))",
                            cursor: "pointer", borderTop: "1px solid var(--kls-outline-variant)",
                            background: sel ? "color-mix(in srgb, var(--kls-info) 8%, transparent)" : "transparent" }}>
                            <CTCheck checked={sel} onClick={() => toggleOne(x.id)} />
                            <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "baseline", gap: 8 }}>
                              <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 600, color: "var(--kls-on-surface)", whiteSpace: "nowrap", flexShrink: 0 }}>{x.code}</span>
                              <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{x.desc}</span>
                            </div>
                            <span style={qStyle}>{x.count} Q</span>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: "var(--kls-surface-variant)", borderRadius: 12, padding: "var(--kls-space-small)" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "var(--kls-space-small)", minWidth: 0 }}>
            <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, color: "var(--kls-on-surface-variant)" }}>Question Count:</span>
            {pool > 0 && <button onClick={() => setCount(String(pool))} style={{ border: "none", background: "transparent", padding: 0, color: "var(--kls-info)", fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>(All)</button>}
          </div>
          <button onClick={() => setCount(String(Math.max(1, n - 1)))} style={{ ...stepBtn, cursor: "pointer", color: "var(--kls-on-surface-variant)" }}>−</button>
          <div style={{ width: 40, textAlign: "center", fontFamily: "var(--kls-font-sans)", fontSize: 16, fontWeight: 500, color: "var(--kls-on-surface)" }}>{n}</div>
          <button onClick={() => { if (n < pool) setCount(String(n + 1)); }} style={{ ...stepBtn, color: n >= pool ? "var(--kls-outline-variant)" : "var(--kls-on-surface-variant)", cursor: n >= pool ? "default" : "pointer" }}>+</button>
        </div>
        {cfgRow("Pool", `${pool} question${pool === 1 ? "" : "s"}`)}
        {cfgRow("Drawing", `${drawing} question${drawing === 1 ? "" : "s"}`)}
      </div>
    </>
  );
}

function CTAssignDrawer({ roster, presetAssignees = [], onClose, onAssign }) {
  const [shown, setShown] = useCtadState(false);
  const [type, setType] = useCtadState("task"); // task|oral|written
  const [term, setTerm] = useCtadState("");
  const [course, setCourse] = useCtadState("");
  const [task, setTask] = useCtadState("");
  // exam params
  const [studentDefined, setStudentDefined] = useCtadState(false);
  const [topic, setTopic] = useCtadState("");
  const [qCount, setQCount] = useCtadState("20");
  const [timeLimit, setTimeLimit] = useCtadState("60");
  const [passScore, setPassScore] = useCtadState("70");
  const [instructions, setInstructions] = useCtadState("");
  const [selModules, setSelModules] = useCtadState(() => new Set());
  // shared
  const [assignees, setAssignees] = useCtadState(presetAssignees); // [{type,id}]
  const [due, setDue] = useCtadState("");
  const [allowLate, setAllowLate] = useCtadState(true);
  const [notify, setNotify] = useCtadState(true);
  const [pickerOpen, setPickerOpen] = useCtadState(false);

  useCtadEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    function onKey(e) { if (e.key === "Escape" && !pickerOpen) onClose && onClose(); }
    document.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(id); document.removeEventListener("keydown", onKey); };
  }, [pickerOpen]);

  const CT = window.CT;
  const isExam = type !== "task";
  const oralTopics = (window.KILSAR_DATA && window.KILSAR_DATA.blocks) ? window.KILSAR_DATA.blocks.map((b) => b.title) : [];

  const courses = term ? (CT.COURSES[term] || []) : [];
  const tasks = course ? (CT.TASK_LIBRARY[course] || []) : [];

  // resolve assignee chips (people + groups)
  const chips = assignees.map((s) => {
    if (s.type === "group") { const g = (roster.groups || []).find((x) => x.id === s.id); return { ...s, label: g?.name, color: g?.color }; }
    const p = roster.people.find((x) => x.id === s.id); return { ...s, label: p?.name };
  }).filter((c) => c.label);

  const valid = assignees.length > 0 && (type === "task" ? !!task : type === "oral" ? (studentDefined || !!topic) : (studentDefined || selModules.size > 0));

  function buildAndAssign() {
    if (!valid) return;
    const dueLabel = due ? new Date(due + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "2-digit" }) : null;
    const expanded = assignees.flatMap((a) => {
      if (a.type === "group") { const g = (roster.groups || []).find((x) => x.id === a.id); return g ? g.memberIds : []; }
      return [a.id];
    });
    const studentIds = [...new Set(expanded)];
    const title = type === "task" ? task : type === "written" ? "Written Exam" : (studentDefined ? "Oral Exam" : (topic || "Oral Exam"));
    const created = studentIds.map((sid, i) => ({
      id: "n" + Date.now() + "_" + i, studentId: sid, type,
      title, course: type === "task" ? course : "Open-ended", term: type === "task" ? term : (term || CT.TERMS[0]),
      due: dueLabel, status: "not_started", score: null,
    }));
    onAssign && onAssign(created);
  }

  const drawerWidth = "min(500px, calc(100vw - 24px))";
  const num = { ...ctInput, height: 44 };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1500 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "var(--kls-scrim)", opacity: shown ? 1 : 0, transition: "opacity 250ms var(--kls-ease-standard)" }} />
      <div style={{
        position: "absolute", top: 12, bottom: 12, right: 12, width: drawerWidth,
        background: "var(--kls-surface)", borderRadius: 8, boxShadow: "var(--kls-drop-shadow)",
        display: "flex", flexDirection: "column", overflow: "hidden",
        transform: shown ? "translateX(0)" : "translateX(calc(100% + 24px))",
        transition: "transform 250ms var(--kls-ease-standard)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--kls-space-med)", borderBottom: "1px solid var(--kls-outline-variant)" }}>
          <span style={{ width: 36, height: 36, borderRadius: 12, background: "var(--kls-tertiary-container)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <KlsIcon name="worklog" size={18} color="var(--kls-on-tertiary-container)" />
          </span>
          <span style={{ flex: 1, fontFamily: "var(--kls-font-sans)", fontSize: 18, fontWeight: 700, color: "var(--kls-on-surface)" }}>New assignment</span>
          <button onClick={onClose} aria-label="Close"
            style={{ width: 36, height: 36, borderRadius: 999, border: "none", cursor: "pointer", background: "transparent",
              color: "var(--kls-on-surface)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--kls-tertiary)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: "currentColor", fill: "none", strokeWidth: 1.8 }}>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "var(--kls-space-med)", display: "flex", flexDirection: "column", gap: "var(--kls-space-med)" }}>
          {/* Type */}
          <div>
            <CTLabel>Type</CTLabel>
            <div style={{ display: "flex", gap: 8 }}>
              <CTTypeCard active={type === "task"} icon="worklog" label="Task" sub="Hands-on procedures and tasks to perform." accent="var(--kls-success)" onClick={() => setType("task")} />
              <CTTypeCard active={type === "oral"} icon="chatBubbles" label="Oral exam" sub="Practice dynamic questions on various topics." accent="var(--kls-accent-4)" onClick={() => setType("oral")} />
              <CTTypeCard active={type === "written"} icon="checkpoint" label="Written exam" sub="Prepare for your FAA exam." accent="var(--kls-info)" onClick={() => setType("written")} />
            </div>
          </div>

          {/* Task picker */}
          {type === "task" ? (
            <>
              <div>
                <CTLabel>Term</CTLabel>
                <CTSelect value={term} options={CT.TERMS} placeholder="Select a term"
                  onChange={(v) => { setTerm(v); setCourse(""); setTask(""); }} />
              </div>
              <div>
                <CTLabel>Course</CTLabel>
                <CTSelect value={course} options={courses} placeholder={term ? "Select a course" : "Choose a term first"}
                  disabled={!term} onChange={(v) => { setCourse(v); setTask(""); }} />
              </div>
              <div>
                <CTLabel>Task</CTLabel>
                <CTSelect value={task} options={tasks} placeholder={course ? "Select a task" : "Choose a course first"}
                  disabled={!course} onChange={setTask} />
              </div>
            </>
          ) : type === "oral" ? (
            <>
              <div style={{ background: "var(--kls-surface-variant)", borderRadius: 12, padding: "var(--kls-space-small)" }}>
                <CTToggleRow label="Let the student choose the topic"
                  hint="Student picks the topic when they begin the oral exam."
                  checked={studentDefined} onChange={setStudentDefined} />
              </div>

              {!studentDefined && (
                <div>
                  <CTLabel>Topic</CTLabel>
                  <CTSelect value={topic} options={oralTopics} placeholder="Select a topic" onChange={setTopic} />
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ background: "var(--kls-surface-variant)", borderRadius: 12, padding: "var(--kls-space-small)" }}>
                <CTToggleRow label="Let the student choose parameters"
                  hint="Student sets topic, length, and scope when they begin."
                  checked={studentDefined} onChange={setStudentDefined} />
              </div>

              {!studentDefined && (
                <WrittenTopicPicker selModules={selModules} setSelModules={setSelModules} count={qCount} setCount={setQCount} />
              )}
            </>
          )}

          {/* Instructions — all types */}
          <div>
            <CTLabel>Instructions (optional)</CTLabel>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3}
              placeholder="What should students focus on or prepare?"
              style={{ ...ctInput, height: "auto", padding: "var(--kls-space-small)", resize: "vertical", lineHeight: 1.45 }} />
          </div>

          {/* Assignees */}
          <div>
            <CTLabel trailing={chips.length > 0 ? (
              <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 700, color: "var(--kls-on-surface-variant)", textTransform: "none", letterSpacing: 0 }}>{chips.length} selected</span>
            ) : null}>Assign to</CTLabel>
            {chips.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                {chips.map((c) => {
                  const dot = c.type === "group"
                    ? ((window.PK_COLORS[c.color] || window.PK_COLORS.blue).fg)
                    : "var(--kls-primary)";
                  return (
                    <span key={c.type + c.id} style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 32, paddingLeft: 10, paddingRight: 6,
                      borderRadius: 999, background: "var(--kls-tertiary)", border: "1px solid var(--kls-outline-variant)",
                      fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 600, color: "var(--kls-on-surface)" }}>
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: dot }} />
                      {c.label}
                      <button onClick={() => setAssignees((cur) => cur.filter((x) => !(x.type === c.type && x.id === c.id)))} aria-label={"Remove " + c.label}
                        style={{ width: 20, height: 20, borderRadius: 999, border: "none", cursor: "pointer", background: "transparent",
                          color: "var(--kls-on-surface-variant)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: "currentColor", fill: "none", strokeWidth: 2 }}><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
            <button onClick={() => setPickerOpen(true)} style={{
              width: "100%", height: 48, borderRadius: 8, cursor: "pointer", background: "transparent",
              border: "1px dashed var(--kls-outline)", color: "var(--kls-on-surface)",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600 }}>
              <KlsIcon name="group" size={16} color="var(--kls-on-surface)" />
              {chips.length ? "Choose students / groups" : "Choose students / groups"}
            </button>
          </div>

          {/* Due + options */}
          <div>
            <CTLabel>Due date (optional)</CTLabel>
            <input type="date" value={due} onChange={(e) => setDue(e.target.value)} style={ctInput} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--kls-space-small)", background: "var(--kls-surface-variant)", borderRadius: 12, padding: "var(--kls-space-small)" }}>
            <CTToggleRow label="Allow late submissions" checked={allowLate} onChange={setAllowLate} />
            <div style={{ height: 1, background: "var(--kls-outline-variant)" }} />
            <CTToggleRow label="Notify students" hint="Send an in-app notification now." checked={notify} onChange={setNotify} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "var(--kls-space-small) var(--kls-space-med) var(--kls-space-med)", borderTop: "1px solid var(--kls-outline-variant)" }}>
          <button onClick={onClose} style={{ height: 48, padding: "0 var(--kls-space-med)", borderRadius: 8, cursor: "pointer",
            background: "transparent", color: "var(--kls-on-surface)", border: "1px solid var(--kls-outline-variant)",
            fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 700 }}>Cancel</button>
          <button disabled={!valid} onClick={buildAndAssign} style={{
            flex: 1, height: 48, borderRadius: 8, border: "none", cursor: valid ? "pointer" : "not-allowed",
            background: "var(--kls-tertiary-container)", color: "var(--kls-on-tertiary-container)",
            fontFamily: "var(--kls-font-sans)", fontSize: 15, fontWeight: 700, opacity: valid ? 1 : 0.45 }}>
            Assign{chips.length ? ` to ${chips.length}` : ""}
          </button>
        </div>
      </div>

      {pickerOpen && (
        <window.TeammatePicker
          title="Choose students / groups"
          mode="multi"
          kinds={["people", "groups"]}
          peopleRoster={roster.people}
          groups={roster.groups}
          initialSelection={assignees}
          onClose={() => setPickerOpen(false)}
          onSubmit={(sel) => { setAssignees(sel); setPickerOpen(false); }} />
      )}
    </div>
  );
}

window.CTAssignDrawer = CTAssignDrawer;

// teammate-picker.jsx — Teammate Picker dialog (people + groups), single or multi select.
//   • Centered DialogOverlay (surface card, radius med, drop shadow, blurred scrim).
//   • Title is caller-supplied. mode="single" → radio · mode="multi" → checkbox.
//   • kinds = ["people","groups"] decides which tabs show.
//   • A group is itself a selectable entity (returns {type:"group", id}).
//   • Selections surface as removable chips above the footer.
//   • DS tokens only; tabs follow CompoundSwitch spec; rows use inverted selection accent.
const { useState: usePkState, useMemo: usePkMemo, useRef: usePkRef, useEffect: usePkEffect } = React;

// ───────────────────────── Seed data ─────────────────────────
const PK_PEOPLE = [
  { id: "m4",  name: "Joel Frank",       email: "joel@kilsar.com",            role: "Admin" },
  { id: "m5",  name: "Joel Instructor",  email: "joel+test@kilsar.com",       role: "Instructor" },
  { id: "m6",  name: "Joel Student",     email: "joel+student@kilsar.com",    role: "Student" },
  { id: "m7",  name: "Justin Carpenter", email: "admin@kilsar.com",           role: "Admin" },
  { id: "m3",  name: "Brendan Lawlor",   email: "brendan@kilsar.com",         role: "Instructor" },
  { id: "m10", name: "Melodie Harris",   email: "melodie@kilsar.com",         role: "Instructor" },
  { id: "m11", name: "Melodie Student",  email: "melodie+student@kilsar.com", role: "Student" },
  { id: "m12", name: "Spencer Carr",     email: "scarr@kilsar.com",           role: "Admin" },
  { id: "m8",  name: "Dana Whitfield",   email: "dana@kilsar.com",            role: "Student" },
];
const PK_GROUPS = [
  { id: "g1", name: "Workspace Admins", color: "blue",   icon: "tower",      count: 5 },
  { id: "g2", name: "Instructors",      color: "green",  icon: "person",     count: 4 },
  { id: "g3", name: "Airframe Cohort",  color: "orange", icon: "cube",       count: 3 },
  { id: "g4", name: "Avionics Lab",     color: "purple", icon: "checkpoint", count: 2 },
];

const PK_COLORS = {
  blue:   { bg: "var(--kls-info-container)",    fg: "var(--kls-info)" },
  green:  { bg: "var(--kls-success-container)", fg: "var(--kls-success)" },
  orange: { bg: "var(--kls-accent-5)",          fg: "var(--kls-accent-4)" },
  purple: { bg: "var(--kls-accent-13)",         fg: "var(--kls-accent-12)" },
  red:    { bg: "var(--kls-error-container)",   fg: "var(--kls-error)" },
};

function pkInitials(name) {
  const parts = (name || "").trim().split(/\s+/);
  return ((parts[0]?.[0] || "?") + (parts[1]?.[0] || "")).toUpperCase();
}

// ───────────────────────── Bits ─────────────────────────
function PkAvatar({ name, size = 40 }) {
  return (
    <div style={{
      flexShrink: 0, width: size, height: size, borderRadius: 999,
      background: "var(--kls-tertiary-container)", color: "var(--kls-on-surface-variant)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--kls-font-sans)", fontWeight: 700, fontSize: Math.round(size * 0.36),
    }}>{pkInitials(name)}</div>
  );
}

function PkMedallion({ color, icon, size = 40 }) {
  const c = PK_COLORS[color] || PK_COLORS.blue;
  return (
    <div style={{
      flexShrink: 0, width: size, height: size, borderRadius: 12, background: c.bg, color: c.fg,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <KlsIcon name={icon || "group"} size={Math.round(size * 0.5)} color={c.fg} />
    </div>
  );
}

// Selection indicator — checkbox (multi) or radio (single). Accent = primary.
function PkIndicator({ checked, single }) {
  const radius = single ? 999 : 6;
  return (
    <span style={{
      width: 22, height: 22, borderRadius: radius, flexShrink: 0,
      border: checked ? "none" : "1.5px solid var(--kls-on-surface-variant)",
      background: checked ? "var(--kls-primary)" : "transparent",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      transition: "background 80ms var(--kls-ease-standard), border-color 80ms var(--kls-ease-standard)",
    }}>
      {checked && (single ? (
        <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--kls-on-primary)" }} />
      ) : (
        <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "var(--kls-on-primary)", fill: "none", strokeWidth: 3 }}>
          <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}

function PkRow({ checked, single, onToggle, leading, title, subtitle, trailing }) {
  const [hover, setHover] = usePkState(false);
  return (
    <button onClick={onToggle}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 14, textAlign: "left",
        padding: "var(--kls-space-small) var(--kls-space-small)", border: "none", cursor: "pointer",
        borderRadius: 12, background: checked ? "var(--kls-tertiary-container)" : (hover ? "var(--kls-tertiary)" : "transparent"),
        transition: "background 80ms var(--kls-ease-standard)",
      }}>
      <PkIndicator checked={checked} single={single} />
      {leading}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: "var(--kls-font-sans)", fontSize: 15, fontWeight: 600, color: "var(--kls-on-surface)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
        <span style={{ display: "block", fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 500, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subtitle}</span>
      </span>
      {trailing}
    </button>
  );
}

function PkChip({ label, color, onRemove }) {
  const dot = color ? (PK_COLORS[color] || PK_COLORS.blue).fg : "var(--kls-primary)";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8, height: 32, paddingLeft: 10, paddingRight: 6,
      borderRadius: 999, background: "var(--kls-tertiary)", border: "1px solid var(--kls-outline-variant)",
      fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 600, color: "var(--kls-on-surface)", maxWidth: 200,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: dot, flexShrink: 0 }} />
      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      <button onClick={onRemove} aria-label={"Remove " + label}
        style={{ width: 20, height: 20, borderRadius: 999, border: "none", cursor: "pointer", flexShrink: 0,
          background: "transparent", color: "var(--kls-on-surface-variant)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--kls-tertiary-container)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
        <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: "currentColor", fill: "none", strokeWidth: 2 }}>
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
    </span>
  );
}

// Segmented tabs (CompoundSwitch spec): track h40 pad2 gap4 radius8 bg tertiary border outline-variant.
function PkTabs({ tabs, value, onChange }) {
  return (
    <div style={{
      display: "inline-flex", gap: 4, padding: 2, height: 40, boxSizing: "border-box",
      background: "var(--kls-tertiary)", border: "1px solid var(--kls-outline-variant)", borderRadius: 8,
    }}>
      {tabs.map((t) => {
        const active = t.key === value;
        return (
          <button key={t.key} onClick={() => onChange(t.key)}
            style={{
              height: 36, padding: "0 18px", borderRadius: 8, border: "none", cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600,
              background: active ? "var(--kls-surface)" : "transparent",
              color: active ? "var(--kls-on-surface)" : "var(--kls-on-tertiary)",
              boxShadow: active ? "0 1px 2px rgba(0,0,0,.04)" : "none",
              transition: "background 80ms var(--kls-ease-standard), color 80ms var(--kls-ease-standard)",
            }}>
            {t.label}
            <span style={{
              minWidth: 20, height: 18, padding: "0 var(--kls-space-xsmall)", borderRadius: 999, boxSizing: "border-box",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700,
              background: active ? "var(--kls-tertiary-container)" : "var(--kls-tertiary-container)",
              color: active ? "var(--kls-on-surface)" : "var(--kls-on-surface-variant)",
            }}>{t.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function PkSort({ dir, onToggle }) {
  return (
    <button onClick={onToggle}
      style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "transparent", border: "none",
        cursor: "pointer", fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600,
        letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--kls-on-surface-variant)", padding: 0 }}>
      Name
      <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "currentColor", fill: "none", strokeWidth: 1.8,
        transform: dir === "desc" ? "rotate(180deg)" : "none", transition: "transform 125ms var(--kls-ease-standard)" }}>
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// ───────────────────────── The dialog ─────────────────────────
function TeammatePicker({
  title = "Choose a teammate",
  mode = "single",            // "single" | "multi"
  kinds = ["people", "groups"],
  initialSelection = [],
  peopleRoster, groups: groupRoster,   // optional roster override; default to seed data
  onClose, onSubmit,
}) {
  const ALL_PEOPLE = peopleRoster || PK_PEOPLE;
  const ALL_GROUPS = groupRoster || PK_GROUPS;
  const single = mode === "single";
  const [shown, setShown] = usePkState(false);
  const [tab, setTab] = usePkState(kinds[0]);
  const [q, setQ] = usePkState("");
  const [dir, setDir] = usePkState("asc");
  const [searchFocus, setSearchFocus] = usePkState(false);
  const [sel, setSel] = usePkState(initialSelection); // [{type,id}]

  usePkEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    function onKey(e) { if (e.key === "Escape") onClose && onClose(); }
    document.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(id); document.removeEventListener("keydown", onKey); };
  }, []);

  const isSel = (type, id) => sel.some((s) => s.type === type && s.id === id);
  const toggle = (type, id) => {
    setSel((cur) => {
      const has = cur.some((s) => s.type === type && s.id === id);
      if (single) return has ? [] : [{ type, id }];
      return has ? cur.filter((s) => !(s.type === type && s.id === id)) : [...cur, { type, id }];
    });
  };
  const remove = (type, id) => setSel((cur) => cur.filter((s) => !(s.type === type && s.id === id)));

  const term = q.trim().toLowerCase();
  const people_ = usePkMemo(() => {
    let r = ALL_PEOPLE.filter((p) => !term || p.name.toLowerCase().includes(term) || p.email.toLowerCase().includes(term));
    r = [...r].sort((a, b) => a.name.localeCompare(b.name) * (dir === "asc" ? 1 : -1));
    return r;
  }, [term, dir]);
  const groups = usePkMemo(() => {
    let r = ALL_GROUPS.filter((g) => !term || g.name.toLowerCase().includes(term));
    r = [...r].sort((a, b) => a.name.localeCompare(b.name) * (dir === "asc" ? 1 : -1));
    return r;
  }, [term, dir]);
  const people = people_;

  const tabs = [];
  if (kinds.includes("people")) tabs.push({ key: "people", label: "People", count: ALL_PEOPLE.length });
  if (kinds.includes("groups")) tabs.push({ key: "groups", label: "Groups", count: ALL_GROUPS.length });

  // chips (resolve labels)
  const chips = sel.map((s) => {
    if (s.type === "group") { const g = ALL_GROUPS.find((x) => x.id === s.id); return { ...s, label: g?.name, color: g?.color }; }
    const p = ALL_PEOPLE.find((x) => x.id === s.id); return { ...s, label: p?.name };
  }).filter((c) => c.label);

  const list = tab === "groups" ? groups : people;
  const empty = list.length === 0;
  const canSubmit = sel.length > 0;
  const width = "min(560px, calc(100vw - 32px))";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "var(--kls-scrim)", backdropFilter: "blur(6px)",
          opacity: shown ? 1 : 0, transition: "opacity 250ms var(--kls-ease-standard)" }} />
      <div style={{
        position: "relative", width, maxHeight: "min(680px, calc(100vh - 40px))",
        display: "flex", flexDirection: "column", overflow: "hidden",
        background: "var(--kls-surface)", borderRadius: 16, boxShadow: "var(--kls-drop-shadow)",
        border: "1px solid var(--kls-outline-variant)",
        transform: shown ? "translateY(0) scale(1)" : "translateY(8px) scale(0.98)", opacity: shown ? 1 : 0,
        transition: "transform 250ms var(--kls-ease-standard), opacity 250ms var(--kls-ease-standard)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--kls-space-med) var(--kls-space-med)" }}>
          <span style={{ width: 36, height: 36, borderRadius: 12, background: "var(--kls-tertiary-container)",
            display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <KlsIcon name="group" size={18} color="var(--kls-on-tertiary-container)" />
          </span>
          <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--kls-font-sans)", fontSize: 18, fontWeight: 700, color: "var(--kls-on-surface)", lineHeight: 1.25 }}>{title}</span>
          <button onClick={onClose} aria-label="Close"
            style={{ width: 36, height: 36, borderRadius: 999, border: "none", cursor: "pointer", background: "transparent",
              color: "var(--kls-on-surface)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--kls-tertiary)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: "currentColor", fill: "none", strokeWidth: 1.8 }}>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Controls: tabs + search + sort */}
        <div style={{ padding: "0 var(--kls-space-med) var(--kls-space-small)", display: "flex", flexDirection: "column", gap: "var(--kls-space-small)" }}>
          {tabs.length > 1 && <div><PkTabs tabs={tabs} value={tab} onChange={setTab} /></div>}

          <div style={{
            height: 48, display: "flex", alignItems: "center", gap: 10, padding: "0 var(--kls-space-small)",
            borderRadius: 8, background: "var(--kls-surface)",
            border: `1px solid ${searchFocus ? "var(--kls-on-surface-variant)" : "var(--kls-outline-variant)"}`,
            transition: "border-color 120ms var(--kls-ease-standard)",
          }}>
            <KlsIcon name="search" size={18} color="var(--kls-on-surface-variant)" />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={tab === "groups" ? "Search groups" : "Search people"}
              onFocus={() => setSearchFocus(true)} onBlur={() => setSearchFocus(false)}
              style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent",
                fontFamily: "var(--kls-font-sans)", fontSize: 15, fontWeight: 500, color: "var(--kls-on-surface)" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <PkSort dir={dir} onToggle={() => setDir((d) => (d === "asc" ? "desc" : "asc"))} />
            <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, color: "var(--kls-on-surface-variant)" }}>
              {list.length} {tab === "groups" ? (list.length === 1 ? "group" : "groups") : (list.length === 1 ? "person" : "people")}
            </span>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, minHeight: 120, overflowY: "auto", padding: "var(--kls-space-tiny) var(--kls-space-small) var(--kls-space-med)" }}>
          {empty ? (
            <div style={{ height: "100%", minHeight: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 24, textAlign: "center" }}>
              <span style={{ width: 56, height: 56, borderRadius: 16, background: "var(--kls-tertiary)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <KlsIcon name="search" size={24} color="var(--kls-on-surface-variant)" />
              </span>
              <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 15, fontWeight: 600, color: "var(--kls-on-surface)" }}>No matches</span>
              <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 500, color: "var(--kls-on-surface-variant)", maxWidth: 280 }}>Try a different name or clear the search.</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {tab === "groups"
                ? groups.map((g) => (
                    <PkRow key={g.id} single={single} checked={isSel("group", g.id)} onToggle={() => toggle("group", g.id)}
                      leading={<PkMedallion color={g.color} icon={g.icon} />}
                      title={g.name} subtitle={g.count + (g.count === 1 ? " member" : " members")} />
                  ))
                : people.map((p) => (
                    <PkRow key={p.id} single={single} checked={isSel("person", p.id)} onToggle={() => toggle("person", p.id)}
                      leading={<PkAvatar name={p.name} />}
                      title={p.name} subtitle={p.email} />
                  ))}
            </div>
          )}
        </div>

        {/* Selected chips */}
        {!single && chips.length > 0 && (
          <div style={{ borderTop: "1px solid var(--kls-outline-variant)", padding: "var(--kls-space-med) var(--kls-space-med)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--kls-on-surface-variant)" }}>{chips.length} selected</span>
              <button onClick={() => setSel([])} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0,
                fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, color: "var(--kls-primary)" }}>Clear all</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxHeight: 84, overflowY: "auto" }}>
              {chips.map((c) => <PkChip key={c.type + c.id} label={c.label} color={c.color} onRemove={() => remove(c.type, c.id)} />)}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--kls-space-small) var(--kls-space-med) var(--kls-space-med)", borderTop: (single || chips.length === 0) ? "1px solid var(--kls-outline-variant)" : "none" }}>
          <button onClick={onClose} style={{
            height: 48, padding: "0 var(--kls-space-med)", borderRadius: 8, cursor: "pointer", background: "transparent",
            color: "var(--kls-on-surface)", border: "1px solid var(--kls-outline-variant)",
            fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 700 }}>Cancel</button>
          <button disabled={!canSubmit} onClick={() => canSubmit && onSubmit && onSubmit(sel)} style={{
            flex: 1, height: 48, borderRadius: 8, border: "none", cursor: canSubmit ? "pointer" : "not-allowed",
            background: "var(--kls-tertiary-container)", color: "var(--kls-on-tertiary-container)",
            fontFamily: "var(--kls-font-sans)", fontSize: 15, fontWeight: 700, opacity: canSubmit ? 1 : 0.45,
            transition: "opacity 120ms var(--kls-ease-standard)" }}>
            {single ? "Select" : (canSubmit ? `Select ${sel.length}` : "Select")}
          </button>
        </div>
      </div>
    </div>
  );
}

window.TeammatePicker = TeammatePicker;
window.PK_PEOPLE = PK_PEOPLE;
window.PK_GROUPS = PK_GROUPS;
window.PkAvatar = PkAvatar;
window.PkMedallion = PkMedallion;
window.pkInitials = pkInitials;
window.PK_COLORS = PK_COLORS;

// workspace-screen.jsx — Team Workspace members management (center context pane)
// Built on the MX/Kilsar Design System. Chrome (Header + NavSidebar) comes from
// chrome.jsx; this file implements the center pane to spec:
//   • Data Table treatment (sortable header, hover rows, per-row menu)  → preview/data-table.html
//   • Role editor uses the canonical neutral Dropdown                    → preview/dropdown.html
//   • Status uses StatusPill (success container)                         → bundle StatusPill / status-badges.html
//   • Avatar (tertiary-container, initials)                              → bundle Avatar


// ───────────────────────── Data (from the live screen) ─────────────────────────
const SEED_MEMBERS = [
  { id: "m1",  name: "",                email: "matt@kilsar.com",                 role: "Admin",      status: "active", title: "Program Director",      joined: "Jan 14, 2024", lastActive: "2 hours ago" },
  { id: "m2",  name: "",                email: "darren@kilsar.com",               role: "Admin",      status: "active", title: "Operations Lead",       joined: "Jan 14, 2024", lastActive: "Yesterday" },
  { id: "m3",  name: "Brendan Lawlor",  email: "brendan@kilsar.com",              role: "Admin",      status: "active", title: "Lead Instructor",       joined: "Feb 03, 2024", lastActive: "3 hours ago" },
  { id: "m4",  name: "Joel Frank",      email: "joel@kilsar.com",                 role: "Admin",      status: "active", title: "Curriculum Admin",      joined: "Feb 20, 2024", lastActive: "Just now" },
  { id: "m5",  name: "Joel Instructor", email: "joel+test@kilsar.com",            role: "Instructor", status: "active", title: "A&P Instructor",        joined: "Mar 11, 2024", lastActive: "Yesterday" },
  { id: "m6",  name: "Joel Student",    email: "joel+student@kilsar.com",         role: "Student",    status: "active", title: "Student — Airframe",    joined: "Sep 02, 2024", lastActive: "5 days ago" },
  { id: "m7",  name: "Justin Carpenter",email: "admin@kilsar.com",                role: "Admin",      status: "active", title: "Systems Admin",         joined: "Jan 14, 2024", lastActive: "1 hour ago" },
  { id: "m8",  name: "Justin Carpenter",email: "kilsar@aviationmaintenance.edu",  role: "Student",    status: "active", title: "Student — Powerplant",  joined: "Sep 02, 2024", lastActive: "2 days ago" },
  { id: "m9",  name: "Justin Carpenter",email: "justin@kilsar.com",               role: "Admin",      status: "active", title: "Workspace Owner",       joined: "Jan 14, 2024", lastActive: "Just now" },
  { id: "m10", name: "Melodie Harris",  email: "melodie@kilsar.com",              role: "Admin",      status: "active", title: "Instructor",            joined: "Apr 08, 2024", lastActive: "4 hours ago" },
  { id: "m11", name: "Melodie Student", email: "melodie+student@kilsar.com",      role: "Student",    status: "active", title: "Student — Avionics",    joined: "Sep 02, 2024", lastActive: "Yesterday" },
  { id: "m12", name: "Spencer Carr",    email: "scarr@kilsar.com",                role: "Admin",      status: "active", title: "Facilities Admin",      joined: "May 19, 2024", lastActive: "6 days ago" },
];

const ROLES = ["Admin", "Instructor", "Student"];
const ROLE_DOTS = { Admin: "var(--kls-primary)", Instructor: "var(--kls-info)", Student: "var(--kls-on-surface-variant)" };

// ───────────────────────── Groups (seed) ─────────────────────────
// group_role is PER-GROUP (a user can be a Creator in one group and a plain Member in
// another), so it lives on the group — never on the global member record. Exactly one
// immutable `creatorId`; everyone else is an Editor (in `editorIds`) or a Member (default).
const SEED_GROUPS = [
  { id: "g1", name: "Workspace Admins",  color: "blue",   icon: "tower",       description: "Owners and operators with full workspace access.", memberIds: ["m1", "m2", "m7", "m9", "m12"], creatorId: "m9", editorIds: ["m1"] },
  { id: "g2", name: "Instructors",       color: "green",  icon: "person",      description: "Teaching staff across all programs.",              memberIds: ["m3", "m4", "m5", "m10"], creatorId: "m3", editorIds: ["m4"] },
  { id: "g3", name: "Airframe Cohort",   color: "orange", icon: "cube",        description: "Fall 2024 airframe & powerplant students.",        memberIds: ["m6", "m8", "m11"], creatorId: "m6", editorIds: [] },
  { id: "g4", name: "Avionics Lab",      color: "purple", icon: "checkpoint",  description: "Students and TAs assigned to the avionics bench.",  memberIds: ["m11", "m5"], creatorId: "m5", editorIds: ["m11"] },
];

// Resolve a member's group_role within a given group draft/record.
const CURRENT_USER_ID = "m9"; // the signed-in user — becomes Creator of groups they create
const GROUP_ROLE_RANK = { creator: 0, editor: 1, member: 2 };
function groupRoleOf(g, id) {
  if (!g) return "member";
  if (id === g.creatorId) return "creator";
  return (g.editorIds || []).includes(id) ? "editor" : "member";
}
const GROUP_ROLE_PALETTE = {
  creator: { bg: "var(--kls-primary-container)", fg: "var(--kls-on-primary-container)", label: "Creator" },
  editor:  { bg: "var(--kls-info-container)",     fg: "var(--kls-on-info-container)",     label: "Editor" },
  member:  { bg: "var(--kls-tertiary)",           fg: "var(--kls-on-surface-variant)",    label: "Member" },
};

// Recent-activity feed, shaped by role (representative sample for the profile view).
function activityFor(member) {
  const byRole = {
    Admin: [
      { icon: "worklog",    text: "Updated workspace permissions",        when: "2h ago" },
      { icon: "group",      text: "Invited 3 members to the workspace",    when: "Yesterday" },
      { icon: "checkpoint", text: "Archived Block 124498.3938",            when: "4d ago" },
    ],
    Instructor: [
      { icon: "checkpoint", text: "Graded Engine Run-Up oral exam",         when: "3h ago" },
      { icon: "worklog",    text: "Published Module: Turbine Basics",       when: "2d ago" },
      { icon: "chatBubble", text: "Left feedback on Assignment 4",          when: "6d ago" },
    ],
    Student: [
      { icon: "checkpoint", text: "Completed Written Exam: FAA Regs",       when: "5h ago" },
      { icon: "worklog",    text: "Submitted Assignment 4",                 when: "Yesterday" },
      { icon: "chatBubble", text: "Started Block: Engine Teardown",         when: "1w ago" },
    ],
  };
  return byRole[member.role] || byRole.Admin;
}

function initialsFor(member) {
  const n = (member.name || "").trim();
  if (n) {
    const parts = n.split(/\s+/);
    return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
  }
  return (member.email[0] || "?").toUpperCase();
}

// ───────────────────────── Avatar (DS spec) ─────────────────────────
function WSAvatar({ initials, size = 36, photo = null }) {
  return (
    <div style={{
      flexShrink: 0, width: size, height: size, borderRadius: 999, overflow: "hidden",
      background: photo ? `center/cover no-repeat url("${photo}")` : "var(--kls-tertiary-container)",
      color: "var(--kls-on-surface-variant)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: Math.round(size * 0.36), fontFamily: "var(--kls-font-sans)",
    }}>{photo ? "" : initials}</div>
  );
}

// ───────────────────────── StatusPill (DS spec) ─────────────────────────
const STATUS_PALETTE = {
  active:    { bg: "var(--kls-success-container)",  fg: "var(--kls-on-success-container)",  label: "Active",   dot: "var(--kls-success)" },
  invited:   { bg: "var(--kls-info-container)",     fg: "var(--kls-on-info-container)",     label: "Invited",  dot: "var(--kls-info)" },
  suspended: { bg: "var(--kls-error-container)",    fg: "var(--kls-on-error-container)",    label: "Suspended",dot: "var(--kls-error)" },
};
function WSStatusPill({ status }) {
  const p = STATUS_PALETTE[status] || STATUS_PALETTE.active;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "var(--kls-space-tiny) var(--kls-space-small) var(--kls-space-tiny) var(--kls-space-xsmall)", borderRadius: 999, background: p.bg, color: p.fg,
      fontSize: 12, fontWeight: 600, fontFamily: "var(--kls-font-sans)", whiteSpace: "nowrap",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: 999, background: p.dot, flexShrink: 0 }} />
      {p.label}
    </span>
  );
}

// ───────────────────────── Floating menu primitive (fixed, anchored) ─────────────────────────
// Renders below `anchorRef`, closes on outside-click / scroll / Esc.
function FloatingMenu({ anchorRef, align = "left", width = 200, onClose, children }) {
  const [pos, setPos] = useState(null);
  const menuRef = useRef(null);

  useLayoutEffect(() => {
    const a = anchorRef.current;
    if (!a) return;
    const r = a.getBoundingClientRect();
    const left = align === "right" ? r.right - width : r.left;
    setPos({ top: r.bottom + 6, left: Math.max(8, left), width });
  }, [anchorRef, align, width]);

  useEffect(() => {
    function onDoc(e) { if (menuRef.current && !menuRef.current.contains(e.target) && !(anchorRef.current && anchorRef.current.contains(e.target))) onClose(); }
    function onKey(e) { if (e.key === "Escape") onClose(); }
    function onScroll() { onClose(); }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [anchorRef, onClose]);

  if (!pos) return null;
  return (
    <div ref={menuRef} style={{
      position: "fixed", top: pos.top, left: pos.left, width: pos.width, zIndex: 1000,
      background: "var(--kls-on-primary)", borderRadius: 8, boxShadow: "var(--kls-drop-shadow)",
      padding: 6, display: "flex", flexDirection: "column", gap: 2,
    }}>{children}</div>
  );
}

function MenuItem({ children, selected, danger, onClick }) {
  const [hover, setHover] = useState(false);
  const base = danger ? "var(--kls-error)" : "var(--kls-on-surface)";
  return (
    <button
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        textAlign: "left", border: "none", cursor: "pointer",
        padding: "var(--kls-space-small) var(--kls-space-small)", borderRadius: 6,
        background: selected ? "var(--kls-tertiary)" : (hover ? "var(--kls-tertiary-container)" : "transparent"),
        color: base, fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500,
        display: "flex", alignItems: "center", gap: 10, width: "100%",
      }}>
      {children}
    </button>
  );
}

// ───────────────────────── Role Dropdown (canonical neutral DS Dropdown) ─────────────────────────
function RoleDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const btnRef = useRef(null);
  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          height: 40, padding: "0 var(--kls-space-xsmall) 0 var(--kls-space-small)", minWidth: 156,
          borderRadius: 8, border: "1px solid var(--kls-outline-variant)",
          background: hover ? "var(--kls-tertiary)" : "transparent",
          display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
          fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500, color: "var(--kls-on-surface)",
        }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: ROLE_DOTS[value] || "var(--kls-on-surface-variant)", flexShrink: 0 }} />
        {value}
        <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, marginLeft: "auto", stroke: "currentColor", fill: "none", strokeWidth: 1.6, transform: open ? "rotate(180deg)" : "none", transition: "transform 125ms var(--kls-ease-standard)" }}>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <FloatingMenu anchorRef={btnRef} width={180} onClose={() => setOpen(false)}>
          {ROLES.map((r) => (
            <MenuItem key={r} selected={r === value} onClick={() => { onChange(r); setOpen(false); }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: ROLE_DOTS[r] || "var(--kls-on-surface-variant)", flexShrink: 0 }} />
              {r}
            </MenuItem>
          ))}
        </FloatingMenu>
      )}
    </>
  );
}

// ───────────────────────── Row action menu (per-row chevron → context menu) ─────────────────────────
// ⚠️ IMPLEMENTER NOTE — FUTURE FEATURE, NOT PART OF V1.
// The per-row "⋯" actions menu (Edit member / View profile / Remove from workspace)
// is scoped for a later release. It is shown here for design completeness only —
// do not wire it up or ship it in V1. No visual change requested; this is a
// scope marker for the build.
function RowMenu({ onEdit, onView, onRemove }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const btnRef = useRef(null);
  return (
    <>
      <button
        ref={btnRef}
        aria-label="Row actions"
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer",
          background: (open || hover) ? "var(--kls-tertiary-container)" : "transparent",
          color: "var(--kls-on-surface-variant)", display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
        <KlsIcon name="dots" size={16} color="var(--kls-on-surface-variant)" />
      </button>
      {open && (
        <FloatingMenu anchorRef={btnRef} align="right" width={184} onClose={() => setOpen(false)}>
          <MenuItem onClick={() => { setOpen(false); onView(); }}><KlsIcon name="person" size={16} color="var(--kls-on-surface)" />View profile</MenuItem>
          <MenuItem onClick={() => { setOpen(false); onEdit(); }}><KlsIcon name="pencil" size={16} color="var(--kls-on-surface)" />Edit member</MenuItem>
          <div style={{ height: 1, background: "var(--kls-outline-variant)", margin: "var(--kls-space-tiny) var(--kls-space-xsmall)" }} />
          <MenuItem danger onClick={() => { setOpen(false); onRemove(); }}><KlsIcon name="trash" size={16} color="var(--kls-error)" />Remove from workspace</MenuItem>
        </FloatingMenu>
      )}
    </>
  );
}

// Shared table cell styles.
const TH = {
  textAlign: "left", padding: "var(--kls-space-small) var(--kls-space-med)",
  fontSize: 14, fontWeight: 500, color: "var(--kls-on-surface-variant)",
  borderBottom: "1px solid var(--kls-outline-variant)", fontFamily: "var(--kls-font-sans)",
  position: "sticky", top: 0, background: "var(--kls-surface)", zIndex: 1,
};
const TD = {
  padding: "var(--kls-space-small) var(--kls-space-med)", fontSize: 14, fontWeight: 500,
  color: "var(--kls-on-surface)", verticalAlign: "middle", fontFamily: "var(--kls-font-sans)",
};

// Count chip used next to a card title.
function CountChip({ n }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", height: 24, padding: "0 var(--kls-space-small)",
      borderRadius: 999, background: "var(--kls-tertiary)", color: "var(--kls-on-surface-variant)",
      fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600,
    }}>{n}</span>
  );
}

const primaryBtn = {
  height: 40, padding: "0 var(--kls-space-med)", borderRadius: 8, border: "none", cursor: "pointer",
  background: "var(--kls-tertiary-container)", color: "var(--kls-on-tertiary-container)",
  fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 700,
  display: "inline-flex", alignItems: "center", gap: "var(--kls-space-xsmall)",
};

// ───────────────────────── Segmented tabs (CompoundSwitch spec) ─────────────────────────
function SegmentedTabs({ tabs, value, onChange, variant }) {
  if (variant === "underline") {
    return (
      <div style={{ display: "flex", gap: "var(--kls-space-med)", borderBottom: "1px solid var(--kls-outline-variant)" }}>
        {tabs.map((t) => {
          const active = t.key === value;
          return (
            <button key={t.key} onClick={() => onChange(t.key)}
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: "var(--kls-space-small) var(--kls-space-tiny) var(--kls-space-small)",
                fontFamily: "var(--kls-font-sans)", fontSize: 15, fontWeight: active ? 700 : 500,
                color: active ? "var(--kls-on-surface)" : "var(--kls-on-surface-variant)",
                borderBottom: active ? "2px solid var(--kls-primary)" : "2px solid transparent", marginBottom: -1,
                display: "inline-flex", alignItems: "center", gap: 8 }}>
              <KlsIcon name={t.icon} size={16} color={active ? "var(--kls-on-surface)" : "var(--kls-on-surface-variant)"} />{t.label}
            </button>
          );
        })}
      </div>
    );
  }
  // pill segmented — canonical CompoundSwitch (compound-switch.html):
  // track h40 · pad 2 · gap 4 · radius 8 · tertiary · active tile surface · labelMediumSemiBold (12/600)
  return (
    <div style={{ display: "inline-flex", height: 40, padding: 2, gap: 4, borderRadius: 8,
      background: "var(--kls-tertiary)", border: "1px solid var(--kls-outline-variant)" }}>
      {tabs.map((t) => {
        const active = t.key === value;
        const fg = active ? "var(--kls-on-surface)" : "var(--kls-on-tertiary)";
        return (
          <button key={t.key} onClick={() => onChange(t.key)}
            style={{ height: 36, padding: "0 18px", borderRadius: 8, border: 0, cursor: "pointer",
              background: active ? "var(--kls-surface)" : "transparent",
              boxShadow: active ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
              color: fg, fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600,
              display: "inline-flex", alignItems: "center", gap: 8 }}>
            <KlsIcon name={t.icon} size={16} color={fg} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ───────────────────────── Card shell ─────────────────────────
// Single surface container. `header` renders in the top row (tabs or title) with
// `action` pinned to the right — matching the DS pattern (tabs live INSIDE the card).
function Card({ header, action, children }) {
  return (
    <div style={{ background: "var(--kls-surface)", borderRadius: 16, padding: "var(--kls-space-small) 0", overflow: "hidden" }}>
      {(header || action) && (
        <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-small)", padding: "var(--kls-space-small) var(--kls-space-med)", marginBottom: "var(--kls-space-tiny)", flexWrap: "wrap" }}>
          {header}
          <div style={{ flex: 1 }} />
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

function CardTitle({ label, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 20, fontWeight: 600, color: "var(--kls-on-surface)" }}>{label}</span>
      <CountChip n={count} />
    </div>
  );
}

// ───────────────────────── Members table body ─────────────────────────
function MembersBody({ members, setMembers, flags }) {
  const [sortDir, setSortDir] = useState("asc");
  const [drawer, setDrawer] = useState(null); // { id, mode } | null
  const [ctx, setCtx] = useState(null); // { id, x, y } | null — right-click context menu

  const setRole = (id, role) => setMembers((ms) => ms.map((m) => (m.id === id ? { ...m, role } : m)));
  const removeMember = (id) => setMembers((ms) => ms.filter((m) => m.id !== id));
  const saveMember = (u) => setMembers((ms) => ms.map((m) => (m.id === u.id ? { ...m, ...u } : m)));
  const activeMember = drawer ? members.find((m) => m.id === drawer.id) : null;

  const sorted = [...members];
  if (sortDir) {
    sorted.sort((a, b) => {
      const an = (a.name || "").toLowerCase(), bn = (b.name || "").toLowerCase();
      if (!an && bn) return 1;
      if (an && !bn) return -1;
      const cmp = an.localeCompare(bn);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }
  const toggleSort = () => setSortDir((d) => (d === "asc" ? "desc" : "asc"));

  return (
    <>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--kls-font-sans)" }}>
        <thead>
          <tr>
            <th style={{ ...TH, cursor: "pointer", userSelect: "none" }} onClick={toggleSort}>
              Name
              <span style={{ marginLeft: 6, display: "inline-block", color: "var(--kls-on-surface-variant)", transform: sortDir === "desc" ? "rotate(180deg)" : "none", transition: "transform 125ms var(--kls-ease-standard)" }}>▾</span>
            </th>
            <th style={TH}>Email</th>
            <th style={TH}>Role</th>
            <th style={TH}>Status</th>
            <th style={{ ...TH, width: 48 }}></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((m) => (
            <MemberRow key={m.id} m={m} td={TD}
              onRole={(r) => setRole(m.id, r)}
              onRemove={() => removeMember(m.id)}
              onView={() => setDrawer({ id: m.id, mode: "view" })}
              onEdit={() => setDrawer({ id: m.id, mode: "edit" })}
              onContext={(e) => { e.preventDefault(); setCtx({ id: m.id, x: Math.min(e.clientX, window.innerWidth - 196), y: e.clientY }); }} />
          ))}
        </tbody>
      </table>

      {ctx && (() => {
        const cm = members.find((m) => m.id === ctx.id);
        if (!cm) return null;
        return (
          <CursorMenu x={ctx.x} y={ctx.y} onClose={() => setCtx(null)}>
            <MenuItem onClick={() => { setCtx(null); setDrawer({ id: cm.id, mode: "view" }); }}><KlsIcon name="person" size={16} color="var(--kls-on-surface)" />View profile</MenuItem>
            <MenuItem onClick={() => { setCtx(null); setDrawer({ id: cm.id, mode: "edit" }); }}><KlsIcon name="pencil" size={16} color="var(--kls-on-surface)" />Edit member</MenuItem>
            <div style={{ height: 1, background: "var(--kls-outline-variant)", margin: "var(--kls-space-tiny) var(--kls-space-xsmall)" }} />
            <MenuItem danger onClick={() => { setCtx(null); removeMember(cm.id); }}><KlsIcon name="trash" size={16} color="var(--kls-error)" />Remove member</MenuItem>
          </CursorMenu>
        );
      })()}

      {activeMember && (
        <MemberDrawer
          member={activeMember} mode={drawer.mode} flags={flags}
          onClose={() => setDrawer(null)}
          onSwitchToEdit={() => setDrawer({ id: drawer.id, mode: "edit" })}
          onSave={(updated) => { saveMember(updated); setDrawer(null); }} />
      )}
    </>
  );
}

// ───────────────────────── Groups table body ─────────────────────────
// Editor + delete state is lifted to the parent so the card-header "New group"
// action can open the create drawer.
function GroupsBody({ groups, setGroups, members, editor, setEditor, deleteId, setDeleteId }) {
  const memberById = (id) => members.find((m) => m.id === id);
  const membersOf = (g) => g.memberIds.map(memberById).filter(Boolean);
  const [expanded, setExpanded] = useState({});
  const toggle = (id) => setExpanded((e) => ({ ...e, [id]: !e[id] }));
  const [ctx, setCtx] = useState(null); // { id, x, y } | null — right-click context menu
  const setMemberGroupRole = (groupId, memberId, role) => setGroups((gs) => gs.map((g) => {
    if (g.id !== groupId || memberId === g.creatorId) return g; // Creator is immutable
    const editors = new Set(g.editorIds || []);
    if (role === "editor") editors.add(memberId); else editors.delete(memberId);
    return { ...g, editorIds: [...editors] };
  }));

  function saveGroup(draft) {
    if (draft.id) {
      setGroups((gs) => gs.map((g) => (g.id === draft.id ? { ...g, ...draft } : g)));
    } else {
      const id = "g" + (Date.now().toString(36));
      setGroups((gs) => [...gs, { ...draft, id }]);
    }
    setEditor(null);
  }
  function confirmDelete() {
    setGroups((gs) => gs.filter((g) => g.id !== deleteId));
    setDeleteId(null);
  }

  const editing = editor && editor.id ? groups.find((g) => g.id === editor.id) : null;
  const deleteTarget = deleteId ? groups.find((g) => g.id === deleteId) : null;

  return (
    <>
      {groups.length === 0 ? (
        <div style={{ padding: "var(--kls-space-large) var(--kls-space-med)", textAlign: "center", fontFamily: "var(--kls-font-sans)" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--kls-tertiary)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <KlsIcon name="group" size={26} color="var(--kls-on-surface-variant)" />
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--kls-on-surface)" }}>No groups yet</div>
          <div style={{ fontSize: 14, color: "var(--kls-on-surface-variant)", marginTop: 4, maxWidth: 320, marginInline: "auto" }}>Organize members into cohorts, teams, or labs. Create your first group to get started.</div>
          <button style={{ ...primaryBtn, marginTop: 16 }} onClick={() => setEditor({ mode: "create" })}>
            <span style={{ fontSize: 18, lineHeight: 1, marginTop: -1 }}>+</span> New group
          </button>
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--kls-font-sans)" }}>
          <thead>
            <tr>
              <th style={TH}>Group</th>
              <th style={TH}>Members</th>
              <th style={TH}>Group Role</th>
              <th style={{ ...TH, width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <GroupRow key={g.id} g={g} members={membersOf(g)}
                expanded={!!expanded[g.id]} onToggle={() => toggle(g.id)}
                onEdit={() => setEditor({ mode: "edit", id: g.id })}
                onContext={(e) => { e.preventDefault(); setCtx({ id: g.id, x: Math.min(e.clientX, window.innerWidth - 196), y: e.clientY }); }}
                onMemberRole={setMemberGroupRole} />
            ))}
          </tbody>
        </table>
      )}

      {ctx && (() => {
        const cg = groups.find((g) => g.id === ctx.id);
        if (!cg) return null;
        return (
          <CursorMenu x={ctx.x} y={ctx.y} onClose={() => setCtx(null)}>
            <MenuItem onClick={() => { setCtx(null); setEditor({ mode: "edit", id: cg.id }); }}><KlsIcon name="pencil" size={16} color="var(--kls-on-surface)" />Edit group</MenuItem>
            <div style={{ height: 1, background: "var(--kls-outline-variant)", margin: "var(--kls-space-tiny) var(--kls-space-xsmall)" }} />
            <MenuItem danger onClick={() => { setCtx(null); setDeleteId(cg.id); }}><KlsIcon name="trash" size={16} color="var(--kls-error)" />Delete group</MenuItem>
          </CursorMenu>
        );
      })()}

      {editor && (
        <GroupDrawer
          group={editing} mode={editor.mode} allMembers={members}
          onClose={() => setEditor(null)} onSave={saveGroup} />
      )}
      {deleteTarget && (
        <DeleteGroupDialog group={deleteTarget} onCancel={() => setDeleteId(null)} onConfirm={confirmDelete} />
      )}
    </>
  );
}

// Circular row action button (CircleButton spec: 32 · radius 999 · outline border · 16px icon).
function RowCircleButton({ title, onClick, children }) {
  const [hover, setHover] = useState(false);
  return (
    <button title={title} aria-label={title} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width: 32, height: 32, borderRadius: 999, cursor: "pointer", flexShrink: 0,
        border: "1px solid var(--kls-outline)", background: hover ? "var(--kls-tertiary-container)" : "var(--kls-surface)",
        color: "var(--kls-on-surface)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      {children}
    </button>
  );
}

// Context menu anchored at a cursor point (right-click). Same items as the row menu.
function CursorMenu({ x, y, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onClose, true);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); window.removeEventListener("scroll", onClose, true); };
  }, [onClose]);
  return (
    <div ref={ref} style={{ position: "fixed", top: y, left: x, width: 184, zIndex: 1000,
      background: "var(--kls-on-primary)", borderRadius: 8, boxShadow: "var(--kls-drop-shadow)",
      padding: 6, display: "flex", flexDirection: "column", gap: 2 }}>{children}</div>
  );
}

// Expanded member sub-row — Control Tower style: indented, surface-variant tint, real
// table columns. The Group Role column carries the per-group role control (Creator locked).
function GroupMemberSubRow({ g, m, onMemberRole }) {
  const [hover, setHover] = useState(false);
  const isCreator = m.id === g.creatorId;
  return (
    <tr onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ borderBottom: "1px solid var(--kls-outline-variant)", background: hover ? "var(--kls-tertiary)" : "var(--kls-surface-variant)", transition: "background 80ms var(--kls-ease-standard)" }}>
      <td style={{ ...TD, paddingLeft: "calc(var(--kls-space-large) + var(--kls-space-med))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <WSAvatar initials={initialsFor(m)} size={32} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name || <span style={{ color: "var(--kls-on-surface-variant)", fontWeight: 500 }}>No name set</span>}</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.email}</div>
          </div>
        </div>
      </td>
      <td style={TD}></td>
      <td style={TD} onClick={(e) => e.stopPropagation()}>
        {isCreator
          ? <GroupRolePill role="creator" />
          : <GroupRoleControl role={groupRoleOf(g, m.id)} onChange={(r) => onMemberRole(g.id, m.id, r)} />}
      </td>
      <td style={{ ...TD, width: 40 }}></td>
    </tr>
  );
}

function GroupRow({ g, members, expanded, onToggle, onEdit, onContext, onMemberRole }) {
  const [hover, setHover] = useState(false);
  const ordered = [...members].sort((a, b) =>
    (GROUP_ROLE_RANK[groupRoleOf(g, a.id)] - GROUP_ROLE_RANK[groupRoleOf(g, b.id)]) || (a.name || a.email).localeCompare(b.name || b.email));
  return (
    <>
      <tr onClick={onToggle} onContextMenu={onContext}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ cursor: "pointer", borderBottom: "1px solid var(--kls-outline-variant)", background: (hover || expanded) ? "var(--kls-tertiary)" : "transparent", transition: "background 80ms var(--kls-ease-standard)" }}>
        <td style={TD}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <GroupMedallion color={g.color} icon={g.icon} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{g.name}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 420 }}>{g.description || `${members.length} member${members.length === 1 ? "" : "s"}`}</div>
            </div>
          </div>
        </td>
        <td style={TD}><AvatarStack members={members} /></td>
        <td style={TD}></td>
        <td style={{ ...TD, textAlign: "right", width: 40 }} onClick={(e) => e.stopPropagation()}>
          <RowCircleButton title="Edit group" onClick={onEdit}>
            <KlsIcon name="pencil" size={16} color="var(--kls-on-surface)" />
          </RowCircleButton>
        </td>
      </tr>
      {expanded && ordered.map((m) => (
        <GroupMemberSubRow key={g.id + "_" + m.id} g={g} m={m} onMemberRole={onMemberRole} />
      ))}
    </>
  );
}

function GroupRowMenu({ onView, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const btnRef = useRef(null);
  return (
    <>
      <button ref={btnRef} aria-label="Group actions" onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer",
          background: (open || hover) ? "var(--kls-tertiary-container)" : "transparent",
          color: "var(--kls-on-surface-variant)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <KlsIcon name="dots" size={16} color="var(--kls-on-surface-variant)" />
      </button>
      {open && (
        <FloatingMenu anchorRef={btnRef} align="right" width={184} onClose={() => setOpen(false)}>
          <MenuItem onClick={() => { setOpen(false); onView(); }}><KlsIcon name="group" size={16} color="var(--kls-on-surface)" />View group</MenuItem>
          <MenuItem onClick={() => { setOpen(false); onEdit(); }}><KlsIcon name="pencil" size={16} color="var(--kls-on-surface)" />Edit group</MenuItem>
          <div style={{ height: 1, background: "var(--kls-outline-variant)", margin: "var(--kls-space-tiny) var(--kls-space-xsmall)" }} />
          <MenuItem danger onClick={() => { setOpen(false); onDelete(); }}><KlsIcon name="trash" size={16} color="var(--kls-error)" />Delete group</MenuItem>
        </FloatingMenu>
      )}
    </>
  );
}

// ───────────────────────── The center pane ─────────────────────────
function WorkspaceMembers({ flags, surface = "tabs" }) {
  const [members, setMembers] = useState(SEED_MEMBERS);
  const [groups, setGroups] = useState(SEED_GROUPS);
  const [tab, setTab] = useState("members"); // members | groups
  const [groupEditor, setGroupEditor] = useState(null); // { mode, id? } | null
  const [groupDeleteId, setGroupDeleteId] = useState(null);

  const tabDefs = [
    { key: "members", label: "Members", count: members.length, icon: "person" },
    { key: "groups",  label: "Groups",  count: groups.length,  icon: "group" },
  ];

  const inviteBtn = (
    <button style={primaryBtn}><span style={{ fontSize: 18, lineHeight: 1, marginTop: -1 }}>+</span> Invite</button>
  );
  const newGroupBtn = (
    <button style={primaryBtn} onClick={() => setGroupEditor({ mode: "create" })}><span style={{ fontSize: 18, lineHeight: 1, marginTop: -1 }}>+</span> New group</button>
  );

  const membersBody = <MembersBody members={members} setMembers={setMembers} flags={flags} />;
  const groupsBody = (
    <GroupsBody groups={groups} setGroups={setGroups} members={members}
      editor={groupEditor} setEditor={setGroupEditor} deleteId={groupDeleteId} setDeleteId={setGroupDeleteId} />
  );

  const stacked = surface === "stacked";

  const pageHeader = (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-med)" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ margin: "0 0 var(--kls-space-tiny)", fontFamily: "var(--kls-font-sans)", fontSize: 24, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--kls-on-surface)" }}>Team Workspace</h1>
        <p style={{ margin: 0, fontFamily: "var(--kls-font-sans)", fontSize: 13.5, color: "var(--kls-on-surface-variant)" }}>Manage members and groups in your workspace.</p>
      </div>
      {!stacked && (tab === "members" ? inviteBtn : newGroupBtn)}
    </div>
  );

  return (
    <div style={{ flex: 1, minWidth: 0, overflowY: "auto", background: "var(--kls-scaffold-bg)" }}>
      <div style={{ padding: "var(--kls-space-med) var(--kls-space-large) var(--kls-space-xlarge)", display: "flex", flexDirection: "column", gap: "var(--kls-space-med)" }}>

        {pageHeader}

        {stacked ? (
          <>
            <Card header={<CardTitle label="Team members" count={members.length} />} action={inviteBtn}>{membersBody}</Card>
            <Card header={<CardTitle label="Groups" count={groups.length} />} action={newGroupBtn}>{groupsBody}</Card>
          </>
        ) : (
          <>
            <div style={{ display: "flex" }}>
              <SegmentedTabs tabs={tabDefs} value={tab} onChange={setTab} variant={surface === "underline" ? "underline" : "pill"} />
            </div>
            <Card>{tab === "members" ? membersBody : groupsBody}</Card>
          </>
        )}

      </div>
    </div>
  );
}

function MemberRow({ m, td, onRole, onRemove, onView, onEdit, onContext }) {
  const [hover, setHover] = useState(false);
  return (
    <tr
      onClick={onView}
      onContextMenu={onContext}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer", borderBottom: "1px solid var(--kls-outline-variant)", background: hover ? "var(--kls-tertiary)" : "transparent", transition: "background 80ms var(--kls-ease-standard)" }}>
      <td style={td}>
        <button
          onClick={onView}
          title="View profile"
          style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", padding: 0, cursor: "pointer",
            font: "inherit", color: "var(--kls-on-surface)", textAlign: "left" }}>
          <WSAvatar initials={initialsFor(m)} />
          {m.name
            ? <span>{m.name}</span>
            : <span style={{ color: "var(--kls-on-surface-variant)", fontWeight: 500 }}>No name set</span>}
        </button>
      </td>
      <td style={{ ...td, color: "var(--kls-on-surface-variant)" }}>{m.email}</td>
      <td style={td} onClick={(e) => e.stopPropagation()}><RoleDropdown value={m.role} onChange={onRole} /></td>
      <td style={td}><WSStatusPill status={m.status} /></td>
      <td style={{ ...td, textAlign: "right" }} onClick={(e) => e.stopPropagation()}><RowMenu onEdit={onEdit} onView={onView} onRemove={onRemove} /></td>
    </tr>
  );
}

// ───────────────────────── App shell assembly ─────────────────────────

// member-drawer.jsx — Edit / View member, one DrawerOverlay serving both modes.
//   • DrawerOverlay spec: right, 426px, 12px inset, surface card, radius 8, drop shadow, over scrim
//   • Fields use IconTextField spec (h48, surface, outline-variant, radius 8)
//   • Field labels = uppercase section label (labelMediumSemiBold · .08em · on-surface-variant)
//   • Editability is gated per field by feature flags (passed in `flags`).
//   • mode="view" forces every field read-only regardless of flags.
const { useState: useDrawerState, useEffect: useDrawerEffect, useRef: useDrawerRef } = React;

const STATUS_OPTIONS = [
  { key: "active",    label: "Active" },
  { key: "invited",   label: "Invited" },
  { key: "suspended", label: "Suspended" },
];

// Label above each field.
function FieldLabel({ children }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--kls-on-surface-variant)" }}>{children}</span>
    </div>
  );
}

// Editable text input (IconTextField spec) or a static, identical-looking box (not clickable).
function DrawerText({ value, onChange, type = "text", editable, placeholder }) {
  const [focus, setFocus] = useDrawerState(false);
  const empty = !value;
  const box = {
    height: 48, display: "flex", alignItems: "center", padding: "0 var(--kls-space-small)",
    background: "var(--kls-surface)", borderRadius: 8,
    fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500,
  };
  if (editable) {
    return (
      <div style={{ ...box, border: `1px solid ${focus ? "var(--kls-on-surface-variant)" : "var(--kls-outline-variant)"}`, transition: "border-color 120ms" }}>
        <input
          type={type} value={value} placeholder={placeholder}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent",
            fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500, color: "var(--kls-on-surface)" }} />
      </div>
    );
  }
  // static — looks the same as editing, just not interactive
  return (
    <div style={{ ...box, border: "1px solid var(--kls-outline-variant)", color: empty ? "var(--kls-on-surface-variant)" : "var(--kls-on-surface)" }}>
      {value || placeholder || "—"}
    </div>
  );
}

// Generic select control (role + status), reuses the table's FloatingMenu + MenuItem.
// pillOnly: when static, render just the value (e.g. a bare status pill) with no field box.
function DrawerSelect({ value, options, editable, renderValue, pillOnly, onChange }) {
  const [open, setOpen] = useDrawerState(false);
  const [hover, setHover] = useDrawerState(false);
  const btnRef = useDrawerRef(null);
  const display = renderValue ? renderValue(value) : value;
  if (!editable) {
    if (pillOnly) {
      return <div style={{ minHeight: 48, display: "flex", alignItems: "center" }}>{display}</div>;
    }
    return (
      <div style={{
        minHeight: 48, display: "flex", alignItems: "center", padding: "0 var(--kls-space-small)",
        background: "var(--kls-surface)", borderRadius: 8, border: "1px solid var(--kls-outline-variant)",
      }}>{display}</div>
    );
  }
  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          height: 48, width: "100%", padding: "0 var(--kls-space-xsmall) 0 var(--kls-space-small)", borderRadius: 8,
          border: "1px solid var(--kls-outline-variant)", background: hover ? "var(--kls-tertiary)" : "var(--kls-surface)",
          display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
          fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500, color: "var(--kls-on-surface)",
        }}>
        {display}
        <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, marginLeft: "auto", stroke: "currentColor", fill: "none", strokeWidth: 1.6, transform: open ? "rotate(180deg)" : "none", transition: "transform 125ms var(--kls-ease-standard)" }}>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <FloatingMenu anchorRef={btnRef} width={btnRef.current ? btnRef.current.offsetWidth : 240} onClose={() => setOpen(false)}>
          {options.map((opt) => (
            <MenuItem key={opt.key || opt} selected={(opt.key || opt) === value} onClick={() => { onChange(opt.key || opt); setOpen(false); }}>
              {opt.render ? opt.render() : (opt.label || opt)}
            </MenuItem>
          ))}
        </FloatingMenu>
      )}
    </>
  );
}

function ActivityRow({ item }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}>
      <span style={{ width: 32, height: 32, borderRadius: 999, background: "var(--kls-tertiary)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <KlsIcon name={item.icon} size={16} color="var(--kls-on-surface-variant)" />
      </span>
      <span style={{ flex: 1, fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500, color: "var(--kls-on-surface)" }}>{item.text}</span>
      <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap" }}>{item.when}</span>
    </div>
  );
}

function MetaCell({ icon, label, value }) {
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

function MemberDrawer({ member, mode, flags, onClose, onSwitchToEdit, onSave }) {
  const [editing, setEditing] = useDrawerState(mode === "edit");
  const isEdit = editing;
  // local draft (only meaningful in edit mode)
  const [draft, setDraft] = useDrawerState(member);
  const [photo, setPhoto] = useDrawerState(null);
  const [shown, setShown] = useDrawerState(false);
  const fileRef = useDrawerRef(null);

  useDrawerEffect(() => { setDraft(member); setPhoto(null); setEditing(mode === "edit"); }, [member, mode]);
  useDrawerEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(id); document.removeEventListener("keydown", onKey); };
  }, []);

  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  const canEdit = (field) => isEdit && flags[field];
  const anyEditable = ["name", "email", "title", "role", "status"].some((f) => flags[f]);
  function cancelEdit() { setDraft(member); setPhoto(null); setEditing(false); }

  function pickPhoto(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(f);
  }

  const v = isEdit ? draft : member;
  const displayName = v.name || "No name set";

  const drawerWidth = "min(426px, calc(100vw - 24px))";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1500 }}>
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "var(--kls-scrim)", opacity: shown ? 1 : 0, transition: "opacity 250ms var(--kls-ease-standard)" }} />

      {/* Drawer panel */}
      <div style={{
        position: "absolute", top: 12, bottom: 12, right: 12, width: drawerWidth,
        background: "var(--kls-surface)", borderRadius: 8, boxShadow: "var(--kls-drop-shadow)",
        display: "flex", flexDirection: "column", overflow: "hidden",
        transform: shown ? "translateX(0)" : "translateX(calc(100% + 24px))",
        transition: "transform 250ms var(--kls-ease-standard)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--kls-space-med) var(--kls-space-med)", borderBottom: "1px solid var(--kls-outline-variant)" }}>
          <span style={{ flex: 1, fontFamily: "var(--kls-font-sans)", fontSize: 16, fontWeight: 600, color: "var(--kls-on-surface)" }}>
            {isEdit ? "Edit member" : "Member profile"}
          </span>
          {!isEdit && anyEditable && (
            <button onClick={() => setEditing(true)} style={{ height: 32, padding: "0 var(--kls-space-small)", borderRadius: 8, cursor: "pointer",
              background: "transparent", color: "var(--kls-on-surface)", border: "1px solid var(--kls-outline-variant)", display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0,
              fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 700 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--kls-tertiary)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <KlsIcon name="pencil" size={15} color="currentColor" /> Edit
            </button>
          )}
          <button
            onClick={onClose} aria-label="Close"
            style={{ width: 32, height: 32, borderRadius: 999, border: "none", cursor: "pointer", background: "transparent",
              color: "var(--kls-on-surface)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: "currentColor", fill: "none", strokeWidth: 1.8 }}>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body (scrolls) */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Identity */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative" }}>
              <WSAvatar initials={initialsFor(member)} size={72} photo={photo} />
              {canEdit("avatar") || (isEdit && flags.avatar) ? (
                <button
                  onClick={() => fileRef.current && fileRef.current.click()}
                  aria-label="Upload photo"
                  style={{ position: "absolute", right: -2, bottom: -2, width: 28, height: 28, borderRadius: 999,
                    border: "2px solid var(--kls-surface)", background: "var(--kls-tertiary-container)", cursor: "pointer",
                    display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <KlsIcon name="camera" size={14} color="var(--kls-on-tertiary-container)" />
                </button>
              ) : null}
              <input ref={fileRef} type="file" accept="image/*" onChange={pickPhoto} style={{ display: "none" }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 20, fontWeight: 600, color: v.name ? "var(--kls-on-surface)" : "var(--kls-on-surface-variant)" }}>{displayName}</div>
              <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500, color: "var(--kls-on-surface-variant)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.email}</div>
              {isEdit && flags.avatar && (
                <button onClick={() => fileRef.current && fileRef.current.click()}
                  style={{ marginTop: 8, height: 28, padding: "0 10px", borderRadius: 8, border: "1px solid var(--kls-outline-variant)", background: "transparent", cursor: "pointer",
                    display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, color: "var(--kls-on-surface)" }}>
                  <KlsIcon name="upload" size={13} color="var(--kls-on-surface)" />{photo ? "Replace photo" : "Upload photo"}
                </button>
              )}
            </div>
          </div>

          {/* Fields */}
          <div>
            <FieldLabel>Name</FieldLabel>
            <DrawerText value={v.name} onChange={(x) => set("name", x)} editable={canEdit("name")} placeholder="No name set" />
          </div>
          <div>
            <FieldLabel>Email</FieldLabel>
            <DrawerText value={v.email} type="email" onChange={(x) => set("email", x)} editable={canEdit("email")} />
          </div>
          <div>
            <FieldLabel>Title</FieldLabel>
            <DrawerText value={v.title} onChange={(x) => set("title", x)} editable={canEdit("title")} placeholder="No title" />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <FieldLabel>Role</FieldLabel>
              <DrawerSelect value={v.role} options={ROLES} editable={canEdit("role")} onChange={(x) => set("role", x)} />
            </div>
            <div style={{ flex: 1 }}>
              <FieldLabel>Status</FieldLabel>
              <DrawerSelect
                value={v.status}
                options={STATUS_OPTIONS}
                editable={canEdit("status")}
                pillOnly
                renderValue={(s) => <WSStatusPill status={s} />}
                onChange={(x) => set("status", x)} />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, padding: "var(--kls-space-small) var(--kls-space-med)", borderTop: "1px solid var(--kls-outline-variant)" }}>
          {isEdit ? (
            <>
              <button onClick={cancelEdit} style={btnSecondary}>Cancel</button>
              <button onClick={() => onSave(draft)} style={btnPrimary}>Save changes</button>
            </>
          ) : (
            <button onClick={onClose} style={btnSecondary}>Close</button>
          )}
        </div>
      </div>
    </div>
  );
}

// PrimaryActionButton / SecondaryActionButton specs (h40, radius 8 web)
const btnPrimary = {
  height: 40, padding: "0 18px", borderRadius: 8, border: "none", cursor: "pointer",
  background: "var(--kls-tertiary-container)", color: "var(--kls-on-tertiary-container)",
  fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 700,
};
const btnSecondary = {
  height: 40, padding: "0 18px", borderRadius: 8, cursor: "pointer",
  background: "transparent", color: "var(--kls-on-surface)", border: "1px solid var(--kls-outline-variant)",
  fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 700,
};

window.MemberDrawer = MemberDrawer;

// group-drawer.jsx — Create / Edit a user group, plus the delete-confirm dialog.
// Reuses shared primitives from workspace-screen.jsx (WSAvatar, initialsFor,
// FloatingMenu, MenuItem, btnPrimary/btnSecondary) — same global babel scope.
//   • DrawerOverlay spec: right, 426px, 12px inset, surface card, radius 8, drop shadow, scrim
//   • Member picker = searchable list with inverted checkboxes (selection rows)
//   • Color/icon = curated DS accent medallions
//   • Delete = AlertPrompt centered card (radius small, dropShadow, blurred scrim)
const { useState: useGroupState, useEffect: useGroupEffect, useRef: useGroupRef } = React;

// Curated medallion palette from DS accent / container tokens.
const GROUP_COLORS = [
  { key: "blue",    bg: "var(--kls-info-container)",    fg: "var(--kls-info)" },
  { key: "green",   bg: "var(--kls-success-container)", fg: "var(--kls-success)" },
  { key: "orange",  bg: "var(--kls-accent-5)",          fg: "var(--kls-accent-4)" },
  { key: "purple",  bg: "var(--kls-accent-13)",         fg: "var(--kls-accent-12)" },
  { key: "red",     bg: "var(--kls-error-container)",   fg: "var(--kls-error)" },
  { key: "neutral", bg: "var(--kls-tertiary)",          fg: "var(--kls-on-surface-variant)" },
];
const GROUP_ICONS = ["group", "person", "cube", "tower", "checkpoint", "worklog", "chatBubbles", "orionOutline"];

function colorFor(key) {
  return GROUP_COLORS.find((c) => c.key === key) || GROUP_COLORS[0];
}

// Colored, icon'd medallion used in the table + drawer header.
function GroupMedallion({ color, icon, size = 40 }) {
  const c = colorFor(color);
  return (
    <div style={{
      flexShrink: 0, width: size, height: size, borderRadius: 12,
      background: c.bg, color: c.fg,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <KlsIcon name={icon || "group"} size={Math.round(size * 0.5)} color={c.fg} />
    </div>
  );
}

// Small overlapping avatar stack for the members column.
function AvatarStack({ members, max = 4 }) {
  const shown = members.slice(0, max);
  const extra = members.length - shown.length;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {shown.map((m, i) => (
        <div key={m.id} style={{ marginLeft: i === 0 ? 0 : -10, border: "2px solid var(--kls-surface)", borderRadius: 999 }}>
          <WSAvatar initials={initialsFor(m)} size={28} />
        </div>
      ))}
      {extra > 0 && (
        <div style={{
          marginLeft: -10, width: 28, height: 28, borderRadius: 999, border: "2px solid var(--kls-surface)",
          background: "var(--kls-tertiary)", color: "var(--kls-on-surface-variant)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--kls-font-sans)", fontSize: 11, fontWeight: 700,
        }}>+{extra}</div>
      )}
      {members.length === 0 && (
        <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, color: "var(--kls-on-surface-variant)" }}>No members</span>
      )}
    </div>
  );
}

// Inverted checkbox (selection-row variant): 22×22, radius 6, 1.5px border.
function PickerCheck({ checked }) {
  return (
    <span style={{
      width: 22, height: 22, borderRadius: 6, flexShrink: 0,
      border: checked ? "none" : "1.5px solid var(--kls-on-surface-variant)",
      background: checked ? "var(--kls-on-surface)" : "transparent",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
    }}>
      {checked && (
        <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "var(--kls-surface)", fill: "none", strokeWidth: 3 }}>
          <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

// Searchable multi-select member picker. Selected rows expose a group_role control;
// the Creator row is locked (checked, no remove, shown as a Creator pill).
function MemberPicker({ allMembers, selectedIds, onToggle, roleOf, onRole, creatorId }) {
  const [q, setQ] = useGroupState("");
  const [focus, setFocus] = useGroupState(false);
  const term = q.trim().toLowerCase();
  const list = allMembers.filter((m) =>
    !term || (m.name || "").toLowerCase().includes(term) || m.email.toLowerCase().includes(term)
  );
  return (
    <div style={{ border: "1px solid var(--kls-outline-variant)", borderRadius: 8, overflow: "hidden" }}>
      {/* search box */}
      <div style={{
        height: 44, display: "flex", alignItems: "center", gap: 8, padding: "0 var(--kls-space-small)",
        borderBottom: "1px solid var(--kls-outline-variant)",
        background: focus ? "var(--kls-tertiary)" : "var(--kls-surface)", transition: "background 120ms",
      }}>
        <KlsIcon name="search" size={16} color="var(--kls-on-surface-variant)" />
        <input
          value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search people"
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent",
            fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500, color: "var(--kls-on-surface)" }} />
      </div>
      {/* rows */}
      <div style={{ maxHeight: 268, overflowY: "auto" }}>
        {list.length === 0 && (
          <div style={{ padding: "var(--kls-space-med) var(--kls-space-small)", fontFamily: "var(--kls-font-sans)", fontSize: 14, color: "var(--kls-on-surface-variant)" }}>No matches.</div>
        )}
        {list.map((m) => {
          const checked = selectedIds.includes(m.id);
          const isCreator = m.id === creatorId;
          const role = roleOf ? roleOf(m.id) : "member";
          return (
            <div key={m.id}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "var(--kls-space-xsmall) var(--kls-space-small)",
                background: checked ? "var(--kls-tertiary)" : "transparent",
              }}>
              <button
                onClick={() => !isCreator && onToggle(m.id)}
                disabled={isCreator}
                title={isCreator ? "The Creator can't be removed" : undefined}
                style={{
                  flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 12,
                  border: "none", background: "transparent", padding: 0, textAlign: "left",
                  cursor: isCreator ? "default" : "pointer",
                }}>
                {isCreator
                  ? <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, flexShrink: 0, stroke: "var(--kls-on-surface-variant)", fill: "none", strokeWidth: 1.8 }}><rect x="5" y="11" width="14" height="9" rx="2" strokeLinejoin="round" /><path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" /></svg>
                  : <PickerCheck checked={checked} />}
                <WSAvatar initials={initialsFor(m)} size={32} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600, color: m.name ? "var(--kls-on-surface)" : "var(--kls-on-surface-variant)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name || "No name set"}</span>
                  <span style={{ display: "block", fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.email}</span>
                </span>
              </button>
              {checked
                ? (isCreator
                    ? <GroupRolePill role="creator" />
                    : <GroupRoleControl role={role} onChange={(r) => onRole && onRole(m.id, r)} />)
                : <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)", flexShrink: 0 }}>{m.role}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GroupFieldLabel({ children, trailing }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
      <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--kls-on-surface-variant)" }}>{children}</span>
      <span style={{ flex: 1 }} />
      {trailing}
    </div>
  );
}

// ───────────────────────── Group role: read pill + edit control ─────────────────────────
function GroupRolePill({ role }) {
  const p = GROUP_ROLE_PALETTE[role] || GROUP_ROLE_PALETTE.member;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", height: 24, padding: "0 var(--kls-space-small)",
      borderRadius: 999, background: p.bg, color: p.fg, whiteSpace: "nowrap",
      fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600,
    }}>{p.label}</span>
  );
}

// Compact Member/Editor picker (Creator is immutable and never offered here).
function GroupRoleControl({ role, onChange }) {
  const [open, setOpen] = useGroupState(false);
  const [hover, setHover] = useGroupState(false);
  const btnRef = useRef(null);
  const p = GROUP_ROLE_PALETTE[role] || GROUP_ROLE_PALETTE.member;
  return (
    <>
      <button
        ref={btnRef}
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          height: 32, padding: "0 var(--kls-space-xsmall) 0 var(--kls-space-small)", minWidth: 108,
          borderRadius: 8, border: "1px solid var(--kls-outline-variant)",
          background: hover || open ? "var(--kls-tertiary)" : "transparent",
          display: "inline-flex", alignItems: "center", gap: "var(--kls-space-tiny)", cursor: "pointer",
          fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600, color: "var(--kls-on-surface)",
        }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: p.fg, flexShrink: 0 }} />
        {p.label}
        <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, marginLeft: "auto", stroke: "currentColor", fill: "none", strokeWidth: 1.6, transform: open ? "rotate(180deg)" : "none", transition: "transform 125ms var(--kls-ease-standard)" }}>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <FloatingMenu anchorRef={btnRef} align="right" width={148} onClose={() => setOpen(false)}>
          {["member", "editor"].map((r) => (
            <MenuItem key={r} selected={r === role} onClick={() => { onChange(r); setOpen(false); }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: GROUP_ROLE_PALETTE[r].fg, flexShrink: 0 }} />
              {GROUP_ROLE_PALETTE[r].label}
            </MenuItem>
          ))}
        </FloatingMenu>
      )}
    </>
  );
}

// ───────────────────────── Group create/edit drawer ─────────────────────────
function GroupDrawer({ group, mode, allMembers, onClose, onSave }) {
  const isCreate = mode === "create";
  const blank = { id: null, name: "", description: "", color: "blue", icon: "group", memberIds: [CURRENT_USER_ID], creatorId: CURRENT_USER_ID, editorIds: [] };
  const [draft, setDraft] = useGroupState(group || blank);
  const [shown, setShown] = useGroupState(false);

  useGroupEffect(() => { setDraft(group || blank); }, [group, mode]);
  useGroupEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(id); document.removeEventListener("keydown", onKey); };
  }, []);

  const set = (k, val) => setDraft((d) => ({ ...d, [k]: val }));
  const toggleMember = (id) => setDraft((d) => {
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
  const roleOf = (id) => groupRoleOf(draft, id);
  const selectedMembers = allMembers
    .filter((m) => draft.memberIds.includes(m.id))
    .sort((a, b) => (GROUP_ROLE_RANK[roleOf(a.id)] - GROUP_ROLE_RANK[roleOf(b.id)]) || (a.name || a.email).localeCompare(b.name || b.email));
  const canSave = draft.name.trim().length > 0;
  const drawerWidth = "min(460px, calc(100vw - 24px))";

  const inputBox = {
    width: "100%", boxSizing: "border-box", padding: "0 var(--kls-space-small)", height: 48,
    background: "var(--kls-surface)", borderRadius: 8, border: "1px solid var(--kls-outline-variant)",
    fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500, color: "var(--kls-on-surface)", outline: "none",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1500 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "var(--kls-scrim)", opacity: shown ? 1 : 0, transition: "opacity 250ms var(--kls-ease-standard)" }} />
      <div style={{
        position: "absolute", top: 12, bottom: 12, right: 12, width: drawerWidth,
        background: "var(--kls-surface)", borderRadius: 8, boxShadow: "var(--kls-drop-shadow)",
        display: "flex", flexDirection: "column", overflow: "hidden",
        transform: shown ? "translateX(0)" : "translateX(calc(100% + 24px))",
        transition: "transform 250ms var(--kls-ease-standard)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--kls-space-med) var(--kls-space-med)", borderBottom: "1px solid var(--kls-outline-variant)" }}>
          <GroupMedallion color={draft.color} icon={draft.icon} size={36} />
          <span style={{ flex: 1, fontFamily: "var(--kls-font-sans)", fontSize: 16, fontWeight: 600, color: "var(--kls-on-surface)" }}>
            {isCreate ? "New group" : "Edit group"}
          </span>
          <button onClick={onClose} aria-label="Close"
            style={{ width: 32, height: 32, borderRadius: 999, border: "none", cursor: "pointer", background: "transparent",
              color: "var(--kls-on-surface)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: "currentColor", fill: "none", strokeWidth: 1.8 }}>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <GroupFieldLabel>Group name</GroupFieldLabel>
            <input value={draft.name} placeholder="e.g. Airframe Cohort" autoFocus
              onChange={(e) => set("name", e.target.value)} style={inputBox} />
          </div>

          <div>
            <GroupFieldLabel>Description</GroupFieldLabel>
            <textarea value={draft.description} placeholder="What is this group for?"
              onChange={(e) => set("description", e.target.value)} rows={3}
              style={{ ...inputBox, height: "auto", padding: "var(--kls-space-small) var(--kls-space-small)", resize: "vertical", lineHeight: 1.45 }} />
          </div>

          {/* Color */}
          <div>
            <GroupFieldLabel>Color</GroupFieldLabel>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {GROUP_COLORS.map((c) => {
                const active = draft.color === c.key;
                return (
                  <button key={c.key} onClick={() => set("color", c.key)} aria-label={c.key}
                    style={{ width: 32, height: 32, borderRadius: 999, cursor: "pointer", background: c.bg,
                      border: active ? "2px solid var(--kls-on-surface)" : "2px solid transparent",
                      outline: active ? "2px solid var(--kls-surface)" : "none", outlineOffset: -4,
                      display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ width: 12, height: 12, borderRadius: 999, background: c.fg }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icon */}
          <div>
            <GroupFieldLabel>Icon</GroupFieldLabel>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {GROUP_ICONS.map((ic) => {
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

          {/* Members */}
          <div>
            <GroupFieldLabel trailing={
              <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 700, color: "var(--kls-on-surface-variant)", letterSpacing: 0, textTransform: "none" }}>
                {selectedMembers.length} selected
              </span>
            }>Members</GroupFieldLabel>
            <MemberPicker allMembers={allMembers} selectedIds={draft.memberIds} onToggle={toggleMember}
              roleOf={roleOf} onRole={setMemberRole} creatorId={draft.creatorId} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, padding: "var(--kls-space-small) var(--kls-space-med)", borderTop: "1px solid var(--kls-outline-variant)" }}>
          <button onClick={onClose} style={btnSecondary}>Cancel</button>
          <button onClick={() => canSave && onSave(draft)} disabled={!canSave}
            style={{ ...btnPrimary, opacity: canSave ? 1 : 0.5, cursor: canSave ? "pointer" : "not-allowed" }}>
            {isCreate ? "Create group" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Delete confirm (AlertPrompt + DialogOverlay) ─────────────────────────
function DeleteGroupDialog({ group, onCancel, onConfirm }) {
  const [shown, setShown] = useGroupState(false);
  useGroupEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    function onKey(e) { if (e.key === "Escape") onCancel(); }
    document.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(id); document.removeEventListener("keydown", onKey); };
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1600, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onCancel} style={{ position: "absolute", inset: 0, background: "var(--kls-scrim)", backdropFilter: "blur(4px)", opacity: shown ? 1 : 0, transition: "opacity 200ms var(--kls-ease-standard)" }} />
      <div style={{
        position: "relative", width: "min(420px, 100%)", background: "var(--kls-surface)",
        borderRadius: 8, boxShadow: "var(--kls-drop-shadow)", padding: 24,
        transform: shown ? "scale(1)" : "scale(0.96)", opacity: shown ? 1 : 0,
        transition: "transform 200ms var(--kls-ease-standard), opacity 200ms var(--kls-ease-standard)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ width: 40, height: 40, borderRadius: 999, background: "var(--kls-error-container)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <KlsIcon name="trash" size={18} color="var(--kls-error)" />
          </span>
          <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 18, fontWeight: 600, color: "var(--kls-on-surface)" }}>Delete group?</span>
        </div>
        <p style={{ margin: "0 0 var(--kls-space-med)", fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500, lineHeight: 1.5, color: "var(--kls-on-surface-variant)" }}>
          “{group.name}” will be deleted. Its {group.memberIds.length} member{group.memberIds.length === 1 ? "" : "s"} stay in the workspace — only the group is removed. This can’t be undone.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onCancel} style={btnSecondary}>Cancel</button>
          <button onClick={onConfirm}
            style={{ height: 40, padding: "0 18px", borderRadius: 8, border: "none", cursor: "pointer",
              background: "var(--kls-error)", color: "var(--kls-on-error, #fff)",
              fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 700 }}>Delete group</button>
        </div>
      </div>
    </div>
  );
}

window.GroupDrawer = GroupDrawer;
window.DeleteGroupDialog = DeleteGroupDialog;
window.GroupMedallion = GroupMedallion;
window.AvatarStack = AvatarStack;
window.GROUP_COLORS = GROUP_COLORS;


// ── Unified web shell: one chrome + router over the feature screens ──
function webLabelMeta(key) {
  const all = tabsForFlavor("education").concat([
    { key: "teamWorkspace", label: "Workspace", icon: "group" },
    { key: "logout", label: "Logout", icon: "tabs/logout" },
  ]);
  return all.find((t) => t.key === key) || { key, label: key, icon: "worklog" };
}
function WebPlaceholder({ tabKey }) {
  const m = webLabelMeta(tabKey);
  return (
    <div style={{ flex: 1, minWidth: 0, overflowY: "auto", background: "var(--kls-scaffold-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 360, padding: "var(--kls-space-large)" }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--kls-tertiary)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <KlsIcon name={m.icon} size={28} color="var(--kls-on-surface-variant)" />
        </div>
        <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 20, fontWeight: 600, color: "var(--kls-on-surface)" }}>{m.label}</div>
        <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500, color: "var(--kls-on-surface-variant)", marginTop: 6, lineHeight: 1.5 }}>This screen isn’t built in the mock yet. Control Tower and Workspace are the live ones.</div>
      </div>
    </div>
  );
}
function WebApp(props) {
  const groupsSurface = props.groupsSurface || "tabs";
  const showKpis = props.showKpis !== false;
  const examRole = props.examRole || "instructor";
  const [active, setActive] = useState("controlTower");
  const [query, setQuery] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const flags = { name: true, email: false, title: true, role: true, status: false, avatar: true };
  const onSelect = (key) => {
    if (key === "help") { setHelpOpen(true); return; }
    if (key === "logout") return;
    setActive(key);
  };
  let content;
  if (active === "controlTower") content = <ControlTower showKpis={showKpis} initialQuick="all" query={query} />;
  else if (active === "teamWorkspace") content = <WorkspaceMembers flags={flags} surface={groupsSurface} />;
  else if (active === "writtenExams") content = <WrittenExams role={examRole} />;
  else content = <WebPlaceholder tabKey={active} />;
  return (
    <div style={{ height: "100vh", display: "flex", background: "var(--kls-scaffold-bg)", overflow: "hidden" }}>
      <NavSidebar active={active} workspaceName="EduDev" version="2.16.5" flavor="education" onSelect={onSelect} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header unread={47} onSearch={setQuery} onAvatar={() => setProfileOpen(true)} searchPlaceholder={active === "controlTower" ? "Search students" : "Search"} />
        {content}
      </div>
      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} onHelp={() => { setProfileOpen(false); setHelpOpen(true); }} />
      <FeedbackDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
window.WebApp = WebApp;

// ── Help & Feedback dialog + Profile drawer (folded in from 88549d6b web app.jsx) ──
const FEEDBACK_FORM_URL = "https://forms.kilsar.io/aim-feedback";

function HelpGlyph({ size = 24, color = "currentColor", strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flex: "none", display: "block" }} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
      <path d="M9.3 9.2a2.7 2.7 0 1 1 3.6 2.55c-.62.25-1.05.82-1.05 1.5v.55" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
      <circle cx="11.85" cy="16.5" r="1.05" fill={color} />
    </svg>
  );
}

const helpSectionLabel = {
  fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 600,
  letterSpacing: ".08em", textTransform: "uppercase", color: "var(--kls-on-surface-variant)",
};

function FeedbackDialog({ open, onClose }) {
  const [closeHover, setCloseHover] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const cardRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  const openForm = () => { window.open(FEEDBACK_FORM_URL, "_blank", "noopener,noreferrer"); };
  return (
    <div onMouseDown={(e) => { if (cardRef.current && !cardRef.current.contains(e.target)) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
        background: "color-mix(in oklab, var(--kls-surface) 80%, transparent)", animation: "kls-fade 180ms var(--kls-ease-standard)" }}>
      <div ref={cardRef} role="dialog" aria-modal="true" aria-label="Help & Feedback"
        style={{ width: 460, maxWidth: "calc(100vw - 48px)", background: "var(--kls-surface)", borderRadius: 12,
          boxShadow: "var(--kls-drop-shadow)", display: "flex", flexDirection: "column", overflow: "hidden", animation: "kls-pop 200ms var(--kls-ease-standard)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--kls-space-med) var(--kls-space-med) 14px" }}>
          <span style={{ width: 24, height: 24, display: "inline-flex", color: "var(--kls-primary)" }}><HelpGlyph size={24} color="var(--kls-primary)" /></span>
          <span style={{ flex: 1, fontFamily: "var(--kls-font-sans)", fontSize: 16, fontWeight: 600, color: "var(--kls-on-surface)" }}>Help &amp; Feedback</span>
          <button aria-label="Close" onClick={onClose} onMouseEnter={() => setCloseHover(true)} onMouseLeave={() => setCloseHover(false)}
            style={{ width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0,
              background: closeHover ? "color-mix(in oklab, var(--kls-on-surface) 9%, transparent)" : "transparent" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="var(--kls-on-surface)" strokeWidth="1.9" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div style={{ height: 1, background: "var(--kls-outline-variant)" }} />
        <div style={{ padding: "var(--kls-space-med) var(--kls-space-med) 8px", display: "flex", flexDirection: "column", gap: 18 }}>
          <p style={{ margin: 0, fontFamily: "var(--kls-font-sans)", fontSize: 15, lineHeight: "22px", color: "var(--kls-on-surface)" }}>
            We're building this platform with you in mind, and your input shapes what comes next. This is your direct line to the team behind it.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={helpSectionLabel}>You can use it to</div>
            {["Suggest a new feature you'd like to see", "Report a bug or something that isn't working", "Ask a general question about the platform"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--kls-on-surface)", marginTop: 7, flex: "none" }} />
                <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 15, lineHeight: "22px", color: "var(--kls-on-surface)" }}>{t}</span>
              </div>
            ))}
          </div>
          <p style={{ margin: 0, fontFamily: "var(--kls-font-sans)", fontSize: 14, lineHeight: "21px", color: "var(--kls-on-surface-variant)" }}>
            A real person reads every submission — we typically follow up within two business days.
          </p>
        </div>
        <div style={{ padding: "var(--kls-space-small) var(--kls-space-med) var(--kls-space-med)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, fontWeight: 500, color: "var(--kls-on-surface-variant)" }}>Opens in a new tab</span>
          <button onClick={openForm} onMouseEnter={() => setBtnHover(true)} onMouseLeave={() => setBtnHover(false)}
            style={{ height: 40, padding: "0 var(--kls-space-med)", borderRadius: 8, border: "1px solid transparent", background: "var(--kls-tertiary-container)", color: "var(--kls-on-tertiary-container)",
              fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
              filter: btnHover ? "brightness(1.06)" : "none", transition: "filter 120ms var(--kls-ease-standard)" }}>
            Open form
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 5h5v5M19 5l-8 8M11 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const PROFILE_AVATAR = "assets/images/placeholderImage.jpg";

function DrawerToggle({ on }) {
  return (
    <span style={{ width: 52, height: 30, borderRadius: 999, flex: "none", background: on ? "var(--kls-primary)" : "var(--kls-surface-container-low)", position: "relative", transition: "background 200ms" }}>
      <span style={{ position: "absolute", top: 3, left: on ? 25 : 3, width: 24, height: 24, borderRadius: "50%", background: on ? "var(--kls-surface)" : "var(--kls-on-surface-variant)", transition: "left 200ms" }} />
    </span>
  );
}

function ProfileDrawer({ open, onClose, onHelp }) {
  const [helpHover, setHelpHover] = useState(false);
  const [closeHover, setCloseHover] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  return (
    <div aria-hidden={!open} style={{ position: "fixed", inset: 0, zIndex: 90, pointerEvents: open ? "auto" : "none" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "var(--kls-scrim)", opacity: open ? 1 : 0, transition: "opacity 250ms var(--kls-ease-standard)" }} />
      <div role="dialog" aria-modal="true" aria-label="Profile" style={{ position: "absolute", top: 12, bottom: 12, right: 12, width: 426, maxWidth: "calc(100vw - 24px)",
        background: "var(--kls-surface)", borderRadius: 8, boxShadow: "var(--kls-drop-shadow)", display: "flex", flexDirection: "column", overflow: "hidden",
        transform: open ? "translateX(0)" : "translateX(calc(100% + 16px))", transition: "transform 300ms var(--kls-ease-standard)" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "22px 24px" }}>
          <span style={{ flex: 1, fontFamily: "var(--kls-font-sans)", fontSize: 22, fontWeight: 700, color: "var(--kls-on-surface)" }}>Profile</span>
          <button aria-label="Close" onClick={onClose} style={{ width: 32, height: 32, border: "none", background: "transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="var(--kls-on-surface)" strokeWidth="1.9" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "var(--kls-space-tiny) 24px 0" }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 22px" }}>
            <div style={{ position: "relative", width: 168, height: 168 }}>
              <img src={PROFILE_AVATAR} alt="Joel Frank" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 16 }} />
              <span style={{ position: "absolute", right: 10, bottom: 10, width: 40, height: 40, borderRadius: 10, background: "var(--kls-surface-variant)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <KlsIcon name="pencil" size={18} color="var(--kls-on-surface)" />
              </span>
            </div>
          </div>
          <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 20, fontWeight: 700, color: "var(--kls-on-surface)" }}>Joel Frank</div>
          <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500, color: "var(--kls-on-surface)", marginTop: 4 }}>Admin</div>
          <div style={{ height: 1, background: "var(--kls-outline-variant)", margin: "var(--kls-space-med) 0" }} />
          <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, color: "var(--kls-on-surface)", marginBottom: 20 }}>
            <b style={{ fontWeight: 700 }}>Email:</b> joel@kilsar.com
          </div>
          {[["Allow Push notifications", false, "Coming Soon"], ["Enable dark mode", true, null], ["Student Mode", false, null]].map(([label, on, tag]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--kls-space-small) 0" }}>
              <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 700, color: "var(--kls-on-surface)" }}>{label}</span>
              <span style={{ flex: 1 }} />
              {tag ? <span style={{ fontFamily: "var(--kls-font-sans)", fontSize: 13, fontWeight: 500, color: "var(--kls-on-surface-variant)" }}>{tag}</span> : <DrawerToggle on={on} />}
            </div>
          ))}
          <div style={{ height: 1, background: "var(--kls-outline-variant)", margin: "16px 0" }} />
          <button onClick={onHelp} onMouseEnter={() => setHelpHover(true)} onMouseLeave={() => setHelpHover(false)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px var(--kls-space-small)", margin: "0 -12px", border: "none", borderRadius: 10, cursor: "pointer", textAlign: "left",
              background: helpHover ? "color-mix(in oklab, var(--kls-on-surface) 7%, transparent)" : "transparent" }}>
            <HelpGlyph size={20} color="var(--kls-on-surface)" />
            <span style={{ flex: 1, fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 700, color: "var(--kls-on-surface)" }}>Help &amp; Feedback</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="var(--kls-on-surface-variant)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <div style={{ padding: "16px 24px", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} onMouseEnter={() => setCloseHover(true)} onMouseLeave={() => setCloseHover(false)}
            style={{ height: 40, padding: "0 24px", borderRadius: 8, cursor: "pointer", border: "1px solid var(--kls-outline-variant)",
              background: closeHover ? "color-mix(in oklab, var(--kls-on-surface) 6%, transparent)" : "transparent",
              fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 700, color: "var(--kls-on-surface)" }}>Close</button>
        </div>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════
// WRITTEN EXAMS (folded in from project 019df76f, re-themed via written-exams.css)
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
const Icon = ({ name, size = 16, ...rest }) => {
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

window.Icon = Icon;

/* StudentPickerTrigger — sits in the topbar, shows the currently viewed student.
   Click opens StudentPickerDialog (a centered modal with searchable list). */
const StudentPickerTrigger = ({ student, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      marginLeft: 14, padding: '5px 10px 5px 6px',
      background: 'var(--bg-inset)', border: '1px solid var(--line)',
      borderRadius: 999, cursor: 'pointer',
      fontFamily: 'var(--font-ui)',
    }}
  >
    <span style={{fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, paddingLeft: 4}}>Viewing</span>
    <span style={{
      width: 22, height: 22, borderRadius: '50%',
      background: 'linear-gradient(135deg, #1F6FEB, #6E40C9)',
      color: 'white', display: 'grid', placeItems: 'center',
      fontSize: 10, fontWeight: 600,
    }}>{student.avatar}</span>
    <span style={{fontSize: 13, fontWeight: 600, color: 'var(--ink)'}}>{student.name}</span>
    <Icon name="chev-d" size={12} style={{color: 'var(--ink-4)'}} />
  </button>
);

/* StudentPickerDialog — modal with searchable list. Click outside / Esc to dismiss. */
const StudentPickerDialog = ({ open, onClose, selectedId, onSelect }) => {
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all'); // all | at-risk | excellent
  const D = window.KILSAR_DATA;

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const list = D.students.filter(s => {
    if (filter === 'at-risk' && s.status !== 'at-risk') return false;
    if (filter === 'excellent' && s.status !== 'excellent') return false;
    if (query && !s.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(11,15,20,0.42)',
        display: 'grid', placeItems: 'start center',
        paddingTop: '8vh',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 540, maxWidth: 'calc(100vw - 32px)',
          maxHeight: '78vh',
          background: 'var(--bg-elev)',
          border: '1px solid var(--line)',
          borderRadius: 14,
          boxShadow: '0 24px 64px rgba(11,15,20,0.28)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{padding: '16px 18px 12px', borderBottom: '1px solid var(--line)'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12}}>
            <div>
              <div style={{fontSize: 15, fontWeight: 600}}>Pick a student</div>
              <div style={{fontSize: 12, color: 'var(--ink-3)', marginTop: 2}}>Switch the view to any student's history & progress.</div>
            </div>
            <button onClick={onClose} className="btn btn--ghost btn--sm" aria-label="Close"><Icon name="x" size={13} /></button>
          </div>

          {/* Search */}
          <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'var(--bg-inset)', borderRadius: 8, border: '1px solid var(--line)'}}>
            <Icon name="search" size={13} style={{color: 'var(--ink-4)'}} />
            <input
              autoFocus
              placeholder="Search students by name…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{flex: 1, border: 0, background: 'transparent', outline: 'none', fontSize: 13.5, color: 'var(--ink)', fontFamily: 'var(--font-ui)'}}
            />
            <span className="mono" style={{fontSize: 11, color: 'var(--ink-4)'}}>{list.length}</span>
          </div>

          {/* Filters */}
          <div className="tabs" style={{marginTop: 10}}>
            {[
              {v: 'all', l: `All · ${D.students.length}`},
              {v: 'at-risk', l: `At risk · ${D.students.filter(s => s.status === 'at-risk').length}`},
              {v: 'excellent', l: `Excellent · ${D.students.filter(s => s.status === 'excellent').length}`},
            ].map(f => (
              <button key={f.v} className="tab" data-active={filter === f.v} onClick={() => setFilter(f.v)}>{f.l}</button>
            ))}
          </div>
        </div>

        {/* List */}
        <div style={{flex: 1, overflowY: 'auto', padding: 6}}>
          {list.length === 0 && (
            <div style={{padding: '40px 20px', textAlign: 'center', color: 'var(--ink-4)', fontSize: 13}}>No students match "{query}".</div>
          )}
          {list.map(s => {
            const isSel = s.id === selectedId;
            const statusColor = s.status === 'at-risk' ? 'var(--bad)' : s.status === 'excellent' ? 'var(--good)' : 'var(--ink-4)';
            return (
              <button
                key={s.id}
                onClick={() => { onSelect(s.id); onClose(); }}
                style={{
                  width: '100%', display: 'grid',
                  gridTemplateColumns: 'auto 1fr 90px 80px 16px',
                  alignItems: 'center', gap: 12,
                  padding: '10px 12px',
                  background: isSel ? 'var(--bg-sunken)' : 'transparent',
                  border: 0, borderRadius: 8, textAlign: 'left', cursor: 'pointer',
                }}
                onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = 'var(--bg-inset)'; }}
                onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1F6FEB, #6E40C9)',
                  color: 'white', display: 'grid', placeItems: 'center',
                  fontSize: 11, fontWeight: 600,
                }}>{s.avatar}</div>
                <div style={{minWidth: 0}}>
                  <div style={{fontSize: 13.5, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6}}>
                    {s.name}
                    {s.status === 'at-risk' && <span style={{fontSize: 10, color: 'var(--bad)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em'}}>At risk</span>}
                    {s.status === 'excellent' && <span style={{fontSize: 10, color: 'var(--good)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em'}}>Excellent</span>}
                  </div>
                  <div style={{fontSize: 11.5, color: 'var(--ink-4)', marginTop: 1}}>Last active {s.lastActive}</div>
                </div>
                <div className="mono" style={{fontSize: 13, fontWeight: 600, color: s.avg >= 0.7 ? 'var(--good)' : 'var(--warn)', textAlign: 'right'}}>
                  {Math.round(s.avg*100)}%
                </div>
                <div className="mono" style={{fontSize: 11.5, color: 'var(--ink-4)', textAlign: 'right'}}>
                  {s.attempts} attempts
                </div>
                <div style={{textAlign: 'right'}}>
                  {isSel && <Icon name="check" size={13} style={{color: 'var(--accent)'}} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer hint */}
        <div style={{padding: '10px 18px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-inset)'}}>
          <span style={{fontSize: 11, color: 'var(--ink-4)'}}>{D.students.length} students enrolled</span>
          <span style={{fontSize: 11, color: 'var(--ink-4)', display: 'inline-flex', gap: 6}}>
            <kbd style={{padding: '1px 5px', border: '1px solid var(--line-2)', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: 10}}>Esc</kbd>
            to close
          </span>
        </div>
      </div>
    </div>
  );
};

window.StudentPickerTrigger = StudentPickerTrigger;
window.StudentPickerDialog = StudentPickerDialog;

/* Practice Setup — topic picker (Study) + subject chooser (Exam) */

const FAA_EXAMS = [
  {
    id: 'general',
    subject: 'General',
    short: 'GEN',
    count: 60,
    duration: 7200, // 2 hours
    acs: ['GE.I', 'GE.II'],
    topics: ['FAR Part 43', 'FAR Part 65', 'Maintenance records', 'Weight & balance', 'Basic electricity', 'Materials & processes'],
    blurb: 'Trade fundamentals every certificated mechanic must know — regulations, records, basic electricity, materials, and weight & balance.',
  },
  {
    id: 'airframe',
    subject: 'Airframe',
    short: 'AF',
    count: 100,
    duration: 7200,
    acs: ['AF.I', 'AF.II'],
    topics: ['Sheet metal', 'Composites', 'Corrosion', 'Hydraulics & pneumatics', 'Landing gear', 'Fuel systems', 'Fire protection'],
    blurb: 'The structures and systems that make up the airframe — sheet metal, composites, hydraulics, landing gear, fuel, ice, fire protection.',
  },
  {
    id: 'powerplant',
    subject: 'Powerplant',
    short: 'PP',
    count: 100,
    duration: 7200,
    acs: ['PA.I', 'PA.II', 'PA.III'],
    topics: ['Reciprocating engines', 'Turbine engines', 'Induction & exhaust', 'Ignition', 'Fuel metering', 'Propellers', 'Engine instruments'],
    blurb: 'Reciprocating and turbine engines, induction, exhaust, ignition, fuel metering, propellers, lubrication, and engine instruments.',
  },
];

const PracticeSetup = ({ tweaks, onStart }) => {
  const D = window.KILSAR_DATA;
  const [expanded, setExpanded] = React.useState({ 't-f24': true, 'c-pp1': true });
  const [selectedModules, setSelectedModules] = React.useState(new Set(['pp1a', 'pp1b']));
  const [mode, setMode] = React.useState('study');
  const [count, setCount] = React.useState(25);
  const [random, setRandom] = React.useState(false);
  const [filterSubject, setFilterSubject] = React.useState('All');
  const [examChoice, setExamChoice] = React.useState('airframe');

  React.useEffect(() => { if (tweaks.mode) setMode(tweaks.mode); }, [tweaks.mode]);

  const toggleModule = (id) => {
    const next = new Set(selectedModules);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedModules(next);
  };
  const toggleCodes = (ids) => {
    const allSelected = ids.every(id => selectedModules.has(id));
    const next = new Set(selectedModules);
    ids.forEach(id => allSelected ? next.delete(id) : next.add(id));
    setSelectedModules(next);
  };

  // Stats (study mode)
  const POOL_CODES = CT_POOL.flatMap(t => t.courses.flatMap(c => c.codes));
  const rollupMastery = (codes) => {
    const vals = codes.map(c => c.mastery).filter(v => v != null && v >= 0);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : -1;
  };
  const totalAvailable = POOL_CODES.reduce((s, c) => s + (selectedModules.has(c.id) ? c.count : 0), 0);
  const selectedAcs = [...new Set(POOL_CODES.filter(c => selectedModules.has(c.id)).map(c => c.code))];

  const activeExam = FAA_EXAMS.find(e => e.id === examChoice) || FAA_EXAMS[0];

  const beginExam = () => onStart({
    mode: 'exam',
    subject: activeExam.subject,
    short: activeExam.short,
    count: activeExam.count,
    duration: activeExam.duration,
    acs: activeExam.acs,
    modules: [],
  });
  const beginStudy = () => onStart({ mode: 'study', count, random, modules: [...selectedModules] });

  return (
    <div className="setup-grid">
      {/* LEFT: topic picker (Study) or exam chooser (Exam) */}
      {mode === 'study' ? (
        <div className="card" style={{padding: 0, minWidth: 0}}>
          <div className="setup-topics-head" style={{padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0}}>
              <h3 style={{margin: 0, whiteSpace: 'nowrap'}}>Topics</h3>
              <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: 'var(--ink-3)', flexWrap: 'wrap'}} title="Mastery — your current accuracy on each module">
                <span style={{display: 'flex', alignItems: 'center', gap: 4}}><span style={{width: 7, height: 7, borderRadius: '50%', background: 'var(--kls-accent-3)'}} />Expert</span>
                <span style={{display: 'flex', alignItems: 'center', gap: 4}}><span style={{width: 7, height: 7, borderRadius: '50%', background: 'var(--kls-accent-9)'}} />Proficient</span>
                <span style={{display: 'flex', alignItems: 'center', gap: 4}}><span style={{width: 7, height: 7, borderRadius: '50%', background: 'var(--kls-accent-4)'}} />Familiar</span>
                <span style={{display: 'flex', alignItems: 'center', gap: 4}}><span style={{width: 7, height: 7, borderRadius: '50%', background: 'var(--kls-outline)'}} />Untested</span>
              </div>
            </div>
            <div style={{flex: 1, minWidth: 8}} />
            <div className="tabs" style={{flexWrap: 'wrap'}}>
              {['All', 'Powerplant', 'Airframe', 'General'].map(s => (
                <button key={s} className="tab" data-active={filterSubject === s} onClick={() => setFilterSubject(s)}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{padding: 4}}>
            {CT_POOL.map(t => {
              const courses = filterSubject === 'All' ? t.courses : t.courses.filter(c => c.subject === filterSubject);
              if (!courses.length) return null;
              const tCodes = courses.flatMap(c => c.codes);
              const tIds = tCodes.map(c => c.id);
              const tAll = tIds.every(id => selectedModules.has(id));
              const tSome = tIds.some(id => selectedModules.has(id));
              const tOpen = expanded[t.id];
              return (
                <div key={t.id} style={{margin: 4, borderRadius: 8, border: '1px solid var(--line)', overflow: 'hidden'}}>
                  <div style={{display: 'flex', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-inset)', gap: 10}}>
                    <button className="btn btn--ghost btn--sm" style={{width: 24, padding: 0, flexShrink: 0}} onClick={() => setExpanded({...expanded, [t.id]: !tOpen})}>
                      <Icon name={tOpen ? 'chev-d' : 'chev-r'} size={12} />
                    </button>
                    <Checkbox checked={tAll} indeterminate={tSome && !tAll} onChange={() => toggleCodes(tIds)} />
                    <div style={{flex: 1, minWidth: 0}}>
                      <span style={{fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap'}}>{t.name}</span>
                    </div>
                    <MasteryDot m={rollupMastery(tCodes)} />
                    <span style={{fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', flexShrink: 0}}>
                      {tCodes.reduce((s, c) => s + c.count, 0)} Q
                    </span>
                  </div>
                  {tOpen && courses.map(c => {
                    const cIds = c.codes.map(x => x.id);
                    const cAll = cIds.every(id => selectedModules.has(id));
                    const cSome = cIds.some(id => selectedModules.has(id));
                    const cOpen = expanded[c.id];
                    return (
                      <React.Fragment key={c.id}>
                        <div style={{display: 'flex', alignItems: 'center', padding: '10px 14px 10px 36px', background: 'var(--bg-inset)', gap: 10, borderTop: '1px solid var(--line)'}}>
                          <button className="btn btn--ghost btn--sm" style={{width: 24, padding: 0, flexShrink: 0}} onClick={() => setExpanded({...expanded, [c.id]: !cOpen})}>
                            <Icon name={cOpen ? 'chev-d' : 'chev-r'} size={12} />
                          </button>
                          <Checkbox checked={cAll} indeterminate={cSome && !cAll} onChange={() => toggleCodes(cIds)} />
                          <div style={{flex: 1, minWidth: 0}}>
                            <span style={{fontWeight: 600, fontSize: 13.5, whiteSpace: 'nowrap'}}>{c.name}</span>
                          </div>
                          <MasteryDot m={rollupMastery(c.codes)} />
                          <span style={{fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', flexShrink: 0}}>
                            {c.codes.reduce((s, x) => s + x.count, 0)} Q
                          </span>
                        </div>
                        {cOpen && c.codes.map(x => {
                          const selected = selectedModules.has(x.id);
                          return (
                            <div key={x.id} onClick={() => toggleModule(x.id)} style={{
                              display: 'flex', alignItems: 'center', padding: '10px 14px 10px 60px',
                              gap: 10, cursor: 'pointer',
                              background: selected ? 'var(--accent-soft)' : 'transparent',
                              borderTop: '1px solid var(--line)',
                            }}>
                              <Checkbox checked={selected} onChange={() => toggleModule(x.id)} />
                              <div style={{flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 8}}>
                                <span style={{fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0}}>{x.code}</span>
                                <span style={{fontSize: 12, color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{x.desc}</span>
                              </div>
                              <MasteryDot m={x.mastery} />
                              <span style={{fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', flexShrink: 0, minWidth: 32, textAlign: 'right'}}>{x.count} Q</span>
                            </div>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <ExamSubjectPicker exams={FAA_EXAMS} value={examChoice} onChange={setExamChoice} />
      )}

      {/* RIGHT: config sidebar */}
      <div className="setup-config" style={{display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 76, minWidth: 0}}>
        <div className="card" style={{padding: 'var(--kls-space-med)', display: 'flex', flexDirection: 'column', gap: 'var(--kls-space-med)'}}>
          {/* Mode */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--kls-space-small)'}}>
            <ModeCard active={mode === 'study'} onClick={() => setMode('study')} icon="book" name="Study" sub="AI enabled · feedback after each Q" />
            <ModeCard active={mode === 'exam'} onClick={() => setMode('exam')} icon="lock" name="Exam" sub="FAA simulation · AI locked" />
          </div>

          {/* Config */}
          {mode === 'study' ? (
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <CountStepper value={count} availablePool={random ? 397 : totalAvailable} onChange={setCount} onSelectAll={() => setCount(random ? 397 : totalAvailable)} />
              <ConfigRow label="Pool" value={`${random ? 397 : totalAvailable} question(s)`} />
              <ConfigRow label="Drawing" value={`${count} question(s)`} />
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <ConfigRow label="Subject" value={activeExam.subject} />
              <ConfigRow label="Questions" value={activeExam.count} />
              <ConfigRow label="Time" value="2h" />
              <ConfigRow label="Passing score" value="70%" />
              <div style={{display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 6, fontSize: 14, color: 'var(--ink)', lineHeight: 1.45}}>
                <span style={{flexShrink: 0, marginTop: 1, color: 'var(--ink-3)'}}><Icon name="orion" size={16} /></span>
                <span>Orion AI assistance unavailable during exam.</span>
              </div>
            </div>
          )}

          {/* Begin button — DS PrimaryActionButton, color per mode (accent10/11 are unbound in this port → info/lock) */}
          {(() => {
            const isExam = mode === 'exam';
            const btnColor = isExam ? 'var(--lock)' : 'var(--kls-info)';
            const disabled = !isExam && !random && selectedModules.size === 0;
            return (
              <button
                disabled={disabled}
                onClick={isExam ? beginExam : beginStudy}
                style={{
                  width: '100%', height: 40, padding: '0 var(--kls-space-med)',
                  border: '1px solid transparent', borderRadius: 8,
                  background: btnColor,
                  color: disabled ? 'var(--kls-on-surface-variant)' : 'var(--kls-color-base-white)',
                  fontFamily: 'var(--kls-font-sans)', fontSize: 14, fontWeight: 700,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--kls-space-xsmall)',
                  cursor: disabled ? 'default' : 'pointer',
                }}
              >
                {isExam ? `Begin ${activeExam.subject} Exam` : 'Begin Practice'}
              </button>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

/* ---------- Exam subject picker (Exam mode) ---------- */

const ExamSubjectPicker = ({ exams, value, onChange }) => {
  return (
    <div className="card" style={{padding: 0, minWidth: 0}}>
      <div style={{padding: '14px 18px', borderBottom: '1px solid var(--line)'}}>
        <h3 style={{margin: 0}}>Topics</h3>
        <div style={{marginTop: 6, fontSize: 13.5, color: 'var(--ink-3)'}}>Question count and time limit are fixed by the FAA.</div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 0}}>
        {exams.map((e, i) => {
          const active = value === e.id;
          return (
            <button
              key={e.id}
              onClick={() => onChange(e.id)}
              style={{
                appearance: 'none', textAlign: 'left', cursor: 'pointer',
                border: 0, borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                background: active ? 'var(--lock-soft)' : 'transparent',
                padding: '18px 18px 18px 18px',
                display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 16,
                alignItems: 'flex-start',
                transition: 'background 100ms',
              }}
            >
              {/* Radio */}
              <div style={{paddingTop: 4}}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: `2px solid ${active ? 'var(--lock)' : 'var(--line-2)'}`,
                  background: 'var(--bg-elev)',
                  display: 'grid', placeItems: 'center',
                  transition: 'border-color 100ms',
                }}>
                  {active && <div style={{width: 10, height: 10, borderRadius: '50%', background: 'var(--lock)'}} />}
                </div>
              </div>

              {/* Body */}
              <div style={{minWidth: 0}}>
                <div style={{display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6, flexWrap: 'wrap'}}>
                  <span style={{fontSize: 18, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em'}}>{e.subject}</span>
                  <span style={{fontSize: 12, color: 'var(--ink-4)', fontFamily: 'var(--font-mono)', fontWeight: 500}}>{e.short}</span>
                </div>
                <div style={{fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.5, marginBottom: 10, maxWidth: 560}}>
                  {e.blurb}
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
                  {e.topics.slice(0, 6).map(t => (
                    <span key={t} className="chip" style={{fontSize: 11}}>{t}</span>
                  ))}
                  {e.topics.length > 6 && <span style={{fontSize: 11.5, color: 'var(--ink-4)', alignSelf: 'center'}}>+{e.topics.length - 6}</span>}
                </div>
              </div>

              {/* Stats */}
              <div style={{display: 'grid', gap: 10, minWidth: 110, textAlign: 'right', alignContent: 'start'}}>
                <ExamStat label="Questions" value={e.count} />
                <ExamStat label="Time" value="2:00:00" mono />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ExamStat = ({ label, value, mono }) => (
  <div>
    <div style={{fontSize: 10.5, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2}}>{label}</div>
    <div className={mono ? 'mono' : ''} style={{fontSize: 17, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums'}}>{value}</div>
  </div>
);

const ExamConfigCard = ({ exam }) => (
  <div className="card" style={{padding: 18, borderTop: '3px solid var(--lock)'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14}}>
      <Icon name="lock" size={14} />
      <h3 style={{margin: 0}}>Exam configuration</h3>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 14px', fontSize: 14, alignItems: 'center'}}>
      <span style={{color: 'var(--ink-3)'}}>Subject</span>
      <span style={{color: 'var(--ink)', fontWeight: 600}}>{exam.subject}</span>

      <span style={{color: 'var(--ink-3)'}}>Questions</span>
      <span className="mono" style={{color: 'var(--ink)'}}>{exam.count}</span>

      <span style={{color: 'var(--ink-3)'}}>Time limit</span>
      <span className="mono" style={{color: 'var(--ink)'}}>2:00:00</span>

      <span style={{color: 'var(--ink-3)'}}>Passing score</span>
      <span className="mono" style={{color: 'var(--ink)'}}>70%</span>

      <span style={{color: 'var(--ink-3)'}}>ACS coverage</span>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 4}}>
        {exam.acs.map(a => <span key={a} className="chip" style={{fontSize: 11}}>{a}</span>)}
      </div>
    </div>
    <div style={{height: 1, background: 'var(--line)', margin: '14px 0'}} />
    <div style={{fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.5, display: 'flex', gap: 8}}>
      <Icon name="lock" size={12} />
      <span>Orion AI assistance is locked for the entire exam. The session must be completed in one sitting.</span>
    </div>
  </div>
);

/* ---------- Shared sub-components ---------- */

const ModeCard = ({ active, icon, name, sub, onClick }) => {
  const isExam = name === 'Exam';
  // activeColor: Study → info blue, Exam → lock purple (accent-12). Label is always primary (white in dark).
  const activeColor = isExam ? 'var(--lock)' : 'var(--kls-info)';
  return (
    <button onClick={onClick} style={{
      border: active ? `2px solid ${activeColor}` : '1.5px solid var(--line)',
      background: active ? `color-mix(in srgb, ${activeColor} 8%, transparent)` : 'var(--bg-elev)',
      borderRadius: 8, padding: 12, textAlign: 'left',
      transition: 'all 100ms',
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
        <span style={{display: 'inline-flex', color: active ? activeColor : 'var(--ink)'}}><Icon name={icon} size={18} /></span>
        <span style={{fontWeight: 600, fontSize: 14, color: 'var(--kls-primary)'}}>{name}</span>
      </div>
      <div style={{marginTop: 6, fontSize: 12, fontWeight: 500, color: 'var(--ink-3)', lineHeight: 1.45}}>{sub}</div>
    </button>
  );
};

const ConfigRow = ({ label, value, children }) => (
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 0', gap: 12}}>
    <span style={{fontSize: 12, fontWeight: 600, color: 'var(--ink-3)'}}>{label}:</span>
    {children ? children : <span style={{fontSize: 14, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums'}}>{value}</span>}
  </div>
);

/* Question-count stepper — borderless −/value/+ matching _CountStepper (Flutter).
   + disables at the pool ceiling; Select all appears only when the pool has questions. */
const CountStepper = ({ value, availablePool, onChange, onSelectAll }) => {
  const atCeiling = value >= availablePool;
  const iconBtn = {
    width: 36, height: 32, display: 'grid', placeItems: 'center',
    border: 0, background: 'transparent', borderRadius: 8, padding: 0,
    fontSize: 20, lineHeight: 1,
  };
  return (
    <div style={{display: 'flex', alignItems: 'center', padding: '3px 0', gap: 0}}>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', gap: 12, minWidth: 0}}>
        <span style={{fontSize: 12, fontWeight: 600, color: 'var(--ink-3)'}}>Question Count:</span>
        {availablePool > 0 && (
          <button onClick={onSelectAll} style={{border: 0, background: 'transparent', padding: 0, color: 'var(--accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer'}}>Select all</button>
        )}
      </div>
      <button onClick={() => onChange(Math.max(1, value - 1))} style={{...iconBtn, color: 'var(--ink-3)', cursor: 'pointer'}}>−</button>
      <div style={{width: 40, textAlign: 'center', fontSize: 16, fontWeight: 500, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums'}}>{value}</div>
      <button onClick={atCeiling ? undefined : () => onChange(value + 1)} disabled={atCeiling} style={{...iconBtn, color: atCeiling ? 'var(--line)' : 'var(--ink-3)', cursor: atCeiling ? 'default' : 'pointer'}}>+</button>
    </div>
  );
};

const Row = ({ label, sub, children }) => (
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', gap: 12}}>
    <div>
      <div style={{fontSize: 14, fontWeight: 500, color: 'var(--ink)'}}>{label}</div>
      {sub && <div style={{fontSize: 12.5, color: 'var(--ink-3)', marginTop: 3, lineHeight: 1.4}}>{sub}</div>}
    </div>
    <div>{children}</div>
  </div>
);

const Checkbox = ({ checked, indeterminate, onChange }) => (
  <button onClick={(e) => { e.stopPropagation(); onChange(); }} style={{
    width: 16, height: 16, borderRadius: 4,
    border: checked || indeterminate ? '1px solid var(--ink)' : '1px solid var(--line-2)',
    background: checked || indeterminate ? 'var(--ink)' : 'var(--bg-elev)',
    color: 'var(--bg-elev)',
    display: 'grid', placeItems: 'center', padding: 0,
    transition: 'all 80ms',
  }}>
    {checked && <Icon name="check" size={11} />}
    {indeterminate && <div style={{width: 7, height: 1.6, background: 'currentColor', borderRadius: 1}} />}
  </button>
);

const Toggle = ({ on, onClick }) => (
  <button onClick={onClick} style={{
    width: 32, height: 18, borderRadius: 999,
    background: on ? 'var(--ink)' : 'var(--line-2)',
    border: 0, padding: 0, position: 'relative',
    transition: 'background 120ms',
  }}>
    <div style={{
      position: 'absolute', top: 2, left: on ? 16 : 2,
      width: 14, height: 14, borderRadius: '50%',
      background: 'white', transition: 'left 120ms',
    }} />
  </button>
);

const Stepper = ({ value, onChange, min = 1, max = 100, step = 1 }) => (
  <div className="stepper">
    <button onClick={() => onChange(Math.max(min, value - step))}>−</button>
    <input type="number" value={value} onChange={(e) => onChange(Math.max(min, Math.min(max, +e.target.value || min)))} />
    <button onClick={() => onChange(Math.min(max, value + step))}>+</button>
  </div>
);

const MasteryDot = ({ m }) => {
  const tested = m != null && m >= 0;
  let color = 'var(--kls-outline)';
  let label = 'Untested';
  if (tested) {
    color = 'var(--kls-accent-4)'; label = 'Familiar';
    if (m >= 0.85) { color = 'var(--kls-accent-3)'; label = 'Expert'; }
    else if (m >= 0.7) { color = 'var(--kls-accent-9)'; label = 'Proficient'; }
  }
  return (
    <span title={tested ? `${label} — ${Math.round(m * 100)}% mastery` : 'Untested'} style={{
      width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0,
    }} />
  );
};

window.PracticeSetup = PracticeSetup;
window.Stepper = Stepper;
window.Toggle = Toggle;
window.Checkbox = Checkbox;
window.MasteryDot = MasteryDot;

/* Question-taking UI — Study + Exam modes, pre-exam warning, results */

const PreExamWarning = ({ count, subject, duration, onProceed, onCancel }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(11,15,20,0.55)',
    display: 'grid', placeItems: 'center', zIndex: 100, padding: 20,
    backdropFilter: 'blur(4px)',
  }}>
    <div className="card fade-in" style={{maxWidth: 520, width: '100%', padding: 32}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 10px', borderRadius: 999, background: 'var(--lock-soft)', color: 'var(--lock)', fontSize: 12, fontWeight: 600, marginBottom: 18}}>
        <Icon name="lock" size={13} />
        EXAM MODE — FAA SIMULATION
      </div>
      <h2 style={{fontSize: 22, marginBottom: 10}}>{subject ? `${subject} written exam — FAA conditions.` : 'This exam simulates FAA testing conditions.'}</h2>
      <p style={{color: 'var(--ink-3)', fontSize: 14, lineHeight: 1.55, marginBottom: 20}}>
        AI assistance is disabled for the duration of the test. You will not see whether questions are correct until you submit. The full exam must be completed in one sitting.
      </p>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24}}>
        <Stat label="Questions" value={count} />
        <Stat label="Time limit" value={duration ? `${Math.floor(duration/3600)}:${String(Math.floor((duration%3600)/60)).padStart(2,'0')}:00` : `${Math.ceil(count * 2)}:00`} mono />
        <Stat label="Orion" value="Locked" icon="lock" />
        <Stat label="Per-question feedback" value="Disabled" icon="x" />
      </div>
      <div style={{display: 'flex', gap: 8, justifyContent: 'flex-end'}}>
        <button className="btn" onClick={onCancel}>Cancel</button>
        <button className="btn btn--primary btn--lg" onClick={onProceed}>
          Begin · I understand
          <Icon name="arrow-r" size={14} />
        </button>
      </div>
    </div>
  </div>
);

const Stat = ({ label, value, mono, icon }) => (
  <div style={{padding: '10px 12px', background: 'var(--bg-inset)', borderRadius: 6, border: '1px solid var(--line)'}}>
    <div style={{fontSize: 11.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontWeight: 600}}>{label}</div>
    <div className={mono ? 'mono' : ''} style={{fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6}}>
      {icon && <Icon name={icon} size={13} />}
      {value}
    </div>
  </div>
);

/* Question runner */
const QuestionRunner = ({ session, tweaks, onFinish, onExit }) => {
  const D = window.KILSAR_DATA;
  // Build question list (cycle the sample bank up to count)
  const questions = React.useMemo(() => {
    const out = [];
    for (let i = 0; i < session.count; i++) out.push({...D.sampleQuestions[i % D.sampleQuestions.length], id: `q-${i}`});
    return out;
  }, [session.count]);

  const [idx, setIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState({}); // id -> choice
  const [revealed, setRevealed] = React.useState({}); // id -> bool (study mode immediate feedback)
  const [orionOpen, setOrionOpen] = React.useState(session.mode === 'study');
  const [showSubmit, setShowSubmit] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(session.duration || session.count * 120); // exam-mode uses fixed duration

  const isExam = session.mode === 'exam';
  const q = questions[idx];
  const chosen = answers[q.id];
  const isRevealed = revealed[q.id];

  React.useEffect(() => {
    if (!isExam) return;
    const t = setInterval(() => setTimeLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [isExam]);

  // Demo: prefill some answers in tweaks-set "preview state"
  React.useEffect(() => {
    if (tweaks.questionState === 'progress' && Object.keys(answers).length === 0) {
      const a = {}; const r = {};
      for (let i = 0; i < Math.min(idx, questions.length); i++) {
        const qq = questions[i];
        const useCorrect = Math.random() < 0.7;
        a[qq.id] = useCorrect ? qq.correct : (qq.choices.find(c => c.id !== qq.correct)?.id);
        if (!isExam) r[qq.id] = true;
      }
      setAnswers(a); setRevealed(r);
    }
  }, []);

  const choose = (cid) => {
    if (isRevealed) return;
    setAnswers({...answers, [q.id]: cid});
    if (!isExam) {
      setTimeout(() => setRevealed(r => ({...r, [q.id]: true})), 100);
    }
  };

  const next = () => {
    if (idx < questions.length - 1) setIdx(idx + 1);
    else setShowSubmit(true);
  };
  const prev = () => idx > 0 && setIdx(idx - 1);

  const finish = () => {
    const results = questions.map(qq => ({
      ...qq,
      chosen: answers[qq.id] || null,
      correct: qq.correct,
      isCorrect: answers[qq.id] === qq.correct,
    }));
    const total = session.duration || session.count * 120;
    onFinish({ session, questions: results, duration: total - timeLeft });
  };

  const fmtTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  return (
    <div style={{minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr auto', background: 'var(--bg)'}}>
      {/* Exam top bar */}
      <div className="runner-topbar" style={{
        height: 56, padding: '0 16px',
        background: isExam ? 'var(--ink)' : 'var(--bg-elev)',
        color: isExam ? 'var(--bg-elev)' : 'var(--ink)',
        borderBottom: '1px solid var(--line)',
      }}>
        <div className="runner-topbar__title">
          {isExam ? <Icon name="lock" size={14} /> : <Icon name="book" size={14} />}
          <span style={{fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap'}}>{isExam ? 'Exam Mode' : 'Study Mode'}</span>
          <span className="runner-topbar__title-extra" style={{opacity: 0.6, fontSize: 13}}>·</span>
          <span className="runner-topbar__title-extra" style={{fontSize: 13, opacity: 0.85, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{isExam && session.subject ? session.subject : 'Reciprocating Engines'}</span>
        </div>

        {/* Progress dots */}
        <div className="runner-progress">
          <span className="mono" style={{fontSize: 12, opacity: 0.7, whiteSpace: 'nowrap'}}>{idx + 1} / {questions.length}</span>
          <div className="runner-progress__bar" style={{height: 4, background: isExam ? 'rgba(255,255,255,0.12)' : 'var(--bg-sunken)', borderRadius: 999}}>
            <div style={{
              width: `${((idx + 1) / questions.length) * 100}%`, height: '100%',
              background: isExam ? '#fff' : 'var(--ink)',
              borderRadius: 999, transition: 'width 200ms',
            }} />
          </div>
        </div>

        {isExam && (
          <div style={{display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0}}>
            <Icon name="history" size={14} />
            <span className="mono" style={{fontSize: 14, fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: timeLeft < 300 ? '#FFA199' : 'inherit'}}>
              {fmtTime(timeLeft)}
            </span>
          </div>
        )}
        <button onClick={onExit} className="btn btn--sm" style={{background: 'transparent', border: '1px solid currentColor', color: 'inherit', opacity: 0.85, flexShrink: 0}}>
          {isExam ? 'Save & Exit' : 'Exit'}
        </button>
      </div>

      {/* Main content */}
      <div style={{display: 'grid', gridTemplateColumns: orionOpen && !isExam ? '1fr 360px' : '1fr', overflow: 'hidden'}}>
        <div className="scroll-y" style={{overflowY: 'auto', padding: '36px 28px 28px'}}>
          <div style={{maxWidth: 760, margin: '0 auto'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20}}>
              <span className="chip">{q.acs}</span>
              <span style={{fontSize: 12, color: 'var(--ink-4)'}}>{q.module}</span>
              <div style={{flex: 1}} />
            </div>

            <div className="serif" style={{fontSize: 26, lineHeight: 1.35, marginBottom: 28, color: 'var(--ink)', letterSpacing: '-0.005em'}}>
              {q.stem}
            </div>

            {/* Figure placeholder if applicable */}
            {idx === 1 && (
              <div style={{
                marginBottom: 24, border: '1px solid var(--line)', borderRadius: 8, padding: 16,
                background: 'var(--bg-inset)', display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{width: 100, height: 80, background: 'var(--bg-sunken)', borderRadius: 4, display: 'grid', placeItems: 'center', color: 'var(--ink-4)'}}>
                  <Icon name="image" size={20} />
                </div>
                <div>
                  <div style={{fontSize: 12, color: 'var(--ink-4)'}}>FIGURE 12</div>
                  <div style={{fontSize: 13.5, fontWeight: 500}}>Cylinder bore micrometer measurement</div>
                </div>
              </div>
            )}

            {/* Choices */}
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              {q.choices.map(c => {
                const selected = chosen === c.id;
                const isCorrect = c.id === q.correct;
                const showState = isRevealed && !isExam;
                let bg = 'var(--bg-elev)', border = 'var(--line-2)', accent = null;
                if (showState && isCorrect) { bg = 'var(--good-soft)'; border = 'var(--good)'; accent = 'good'; }
                else if (showState && selected && !isCorrect) { bg = 'var(--bad-soft)'; border = 'var(--bad)'; accent = 'bad'; }
                else if (selected) { border = 'var(--ink)'; bg = 'var(--bg-elev)'; }

                return (
                  <button key={c.id} onClick={() => choose(c.id)} disabled={isRevealed} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    padding: '14px 16px',
                    border: `1px solid ${border}`,
                    background: bg, borderRadius: 8,
                    textAlign: 'left', cursor: isRevealed ? 'default' : 'pointer',
                    boxShadow: selected && !showState ? '0 0 0 3px rgba(11,15,20,0.06)' : 'none',
                    transition: 'all 100ms',
                  }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%',
                      border: `1px solid ${selected || accent ? 'transparent' : 'var(--line-2)'}`,
                      background: accent === 'good' ? 'var(--good)' : accent === 'bad' ? 'var(--bad)' : selected ? 'var(--ink)' : 'transparent',
                      color: selected || accent ? 'white' : 'var(--ink-3)',
                      display: 'grid', placeItems: 'center',
                      flexShrink: 0,
                      fontSize: 13, fontWeight: 600,
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {accent === 'good' ? <Icon name="check" size={13} /> : accent === 'bad' ? <Icon name="x" size={13} /> : c.id}
                    </div>
                    <div style={{flex: 1, fontSize: 15, lineHeight: 1.45, paddingTop: 3}}>{c.text}</div>
                  </button>
                );
              })}
            </div>

            {/* Study-mode feedback */}
            {isRevealed && !isExam && (
              <div className="fade-in" style={{
                marginTop: 24, padding: 18, borderRadius: 10,
                background: chosen === q.correct ? 'var(--good-soft)' : 'var(--bad-soft)',
                border: `1px solid ${chosen === q.correct ? 'var(--good)' : 'var(--bad)'}`,
                borderLeft: `3px solid ${chosen === q.correct ? 'var(--good)' : 'var(--bad)'}`,
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10}}>
                  <Icon name={chosen === q.correct ? 'check' : 'x'} size={14} />
                  <span style={{fontWeight: 600, fontSize: 13.5}}>
                    {chosen === q.correct ? 'Correct' : `Incorrect — answer is ${q.correct}`}
                  </span>
                  <div style={{flex: 1}} />
                  <span style={{fontSize: 11.5, color: 'var(--ink-4)', fontFamily: 'var(--font-mono)'}}>{q.reference}</span>
                </div>
                <div style={{fontSize: 14, lineHeight: 1.55, color: 'var(--ink-2)'}}>{q.explanation}</div>
                <div style={{display: 'flex', gap: 8, marginTop: 14}}>
                  <button className="btn btn--sm" onClick={() => setOrionOpen(true)} style={{background: 'var(--bg-elev)'}}>
                    <Icon name="orion" size={13} />
                    Ask Orion to elaborate
                  </button>
                  <button className="btn btn--sm">
                    <Icon name="book" size={13} />
                    Open reference
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Orion side panel — Study mode only */}
        {orionOpen && !isExam && <OrionPanel question={q} onClose={() => setOrionOpen(false)} />}

        {/* Exam-mode locked Orion strip */}
        {isExam && <OrionLocked />}
      </div>

      {/* Footer nav */}
      <div style={{
        height: 64, padding: '0 28px',
        background: 'var(--bg-elev)',
        borderTop: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button className="btn" onClick={prev} disabled={idx === 0}>
          <Icon name="chev-l" size={13} />
          Previous
        </button>
        <QuestionPalette questions={questions} answers={answers} idx={idx} setIdx={setIdx} isExam={isExam} revealed={revealed} />
        <div style={{flex: 1}} />
        <span style={{fontSize: 12, color: 'var(--ink-4)'}}>
          <kbd>←</kbd> <kbd>→</kbd> navigate · <kbd>1</kbd>–<kbd>3</kbd> answer
        </span>
        {idx === questions.length - 1 ? (
          <button className="btn btn--primary" onClick={() => setShowSubmit(true)}>
            Submit {isExam ? 'Exam' : 'Practice'}
            <Icon name="check" size={13} />
          </button>
        ) : (
          <button className="btn btn--primary" onClick={next} disabled={isExam ? false : !chosen}>
            {isRevealed || isExam ? 'Next' : 'Submit answer'}
            <Icon name="arrow-r" size={13} />
          </button>
        )}
      </div>

      {showSubmit && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(11,15,20,0.55)', display: 'grid', placeItems: 'center', zIndex: 100, padding: 20, backdropFilter: 'blur(4px)'}}>
          <div className="card" style={{maxWidth: 480, padding: 28}}>
            <h2 style={{marginBottom: 8}}>Submit {isExam ? 'exam' : 'practice'}?</h2>
            <p style={{color: 'var(--ink-3)', fontSize: 14, marginBottom: 18}}>
              You answered {Object.keys(answers).length} of {questions.length} questions.
            </p>
            <div style={{display: 'flex', gap: 8, justifyContent: 'flex-end'}}>
              <button className="btn" onClick={() => setShowSubmit(false)}>Keep working</button>
              <button className="btn btn--primary" onClick={finish}>Submit and see results</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const QuestionPalette = ({ questions, answers, idx, setIdx, isExam, revealed }) => (
  <div style={{display: 'flex', gap: 3, alignItems: 'center', maxWidth: 560, overflowX: 'auto', padding: '0 8px'}}>
    {questions.map((qq, i) => {
      const answered = answers[qq.id];
      const isRev = revealed[qq.id];
      let bg = 'var(--bg-sunken)', color = 'var(--ink-3)';
      if (i === idx) { bg = 'var(--ink)'; color = 'var(--bg-elev)'; }
      else if (isRev && !isExam) { bg = answered === qq.correct ? 'var(--good)' : 'var(--bad)'; color = 'white'; }
      else if (answered) { bg = 'var(--ink-2)'; color = 'var(--bg-elev)'; }
      return (
        <button key={i} onClick={() => setIdx(i)} title={`Question ${i+1}`} style={{
          width: 22, height: 22, borderRadius: 4,
          border: 0, background: bg, color, fontSize: 10.5, fontWeight: 600,
          fontFamily: 'var(--font-mono)', position: 'relative', flexShrink: 0,
        }}>
          {i + 1}
        </button>
      );
    })}
  </div>
);

const OrionLocked = () => (
  <div style={{
    width: 56, borderLeft: '1px solid var(--line)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '20px 0', gap: 14, background: 'var(--bg-inset)',
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: 'var(--lock-soft)', color: 'var(--lock)',
      display: 'grid', placeItems: 'center',
    }}>
      <Icon name="orion" size={16} />
    </div>
    <div style={{
      writingMode: 'vertical-rl', transform: 'rotate(180deg)',
      fontSize: 11, color: 'var(--ink-4)', letterSpacing: '0.08em',
      textTransform: 'uppercase', fontWeight: 500,
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      Orion locked during exam
    </div>
    <div style={{flex: 1}} />
    <Icon name="lock" size={14} />
  </div>
);

const OrionPanel = ({ question, onClose }) => {
  const [messages, setMessages] = React.useState([
    { role: 'orion', text: 'I noticed you might be working through valve overlap. Want me to walk through the four-stroke cycle and where overlap happens?' },
  ]);
  const [input, setInput] = React.useState('');

  const send = (text) => {
    if (!text.trim()) return;
    const next = [...messages, { role: 'user', text }];
    setMessages(next);
    setInput('');
    setTimeout(() => {
      setMessages([...next, { role: 'orion', typing: true }]);
      setTimeout(() => {
        setMessages([...next, {
          role: 'orion',
          text: 'Think of it like this: at the end of the exhaust stroke, the exhaust valve is still open as inertia pulls residual gas out. The intake valve cracks open early so the incoming charge "rides" that low-pressure wave into the cylinder. The brief overlap is what improves volumetric efficiency.',
        }]);
      }, 800);
    }, 200);
  };

  return (
    <div style={{borderLeft: '1px solid var(--line)', background: 'var(--bg-elev)', display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div style={{padding: '14px 16px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10}}>
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          background: 'linear-gradient(135deg, #4D8BFF, #A586E8)',
          color: 'white', display: 'grid', placeItems: 'center',
        }}>
          <Icon name="orion" size={13} />
        </div>
        <div style={{flex: 1}}>
          <div style={{fontSize: 13, fontWeight: 600, lineHeight: 1.1}}>Orion</div>
          <div style={{fontSize: 11, color: 'var(--good)', display: 'flex', alignItems: 'center', gap: 4}}>
            <span style={{width: 5, height: 5, borderRadius: '50%', background: 'var(--good)'}} />
            Available · Study Mode
          </div>
        </div>
        <button className="btn btn--ghost btn--sm" onClick={onClose}><Icon name="x" size={12} /></button>
      </div>

      <div className="scroll-y" style={{flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 12}}>
        <div style={{padding: 10, background: 'var(--bg-inset)', borderRadius: 8, fontSize: 11.5, color: 'var(--ink-3)', lineHeight: 1.5}}>
          <div style={{fontWeight: 600, color: 'var(--ink-2)', marginBottom: 4}}>Context</div>
          Question {question.id} · {question.module} · {question.acs}
        </div>
        {messages.map((m, i) => (
          <div key={i} style={{display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', gap: 8}}>
            <div style={{
              maxWidth: '85%',
              padding: '8px 12px', borderRadius: 12,
              background: m.role === 'user' ? 'var(--ink)' : 'var(--bg-inset)',
              color: m.role === 'user' ? 'var(--bg-elev)' : 'var(--ink-2)',
              fontSize: 13, lineHeight: 1.5,
            }}>
              {m.typing ? <span style={{display: 'inline-flex', gap: 3}}>
                <Pulse delay={0} /><Pulse delay={150} /><Pulse delay={300} />
              </span> : m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{padding: 12, borderTop: '1px solid var(--line)'}}>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8}}>
          {['Explain like I\'m new', 'Why is B wrong?', 'Show diagram'].map(s => (
            <button key={s} className="btn btn--sm" onClick={() => send(s)} style={{fontSize: 11.5}}>{s}</button>
          ))}
        </div>
        <div style={{display: 'flex', gap: 6, alignItems: 'center', border: '1px solid var(--line-2)', borderRadius: 8, padding: '6px 10px', background: 'var(--bg-elev)'}}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send(input)} placeholder="Ask Orion..." style={{flex: 1, border: 0, background: 'transparent', outline: 'none', fontSize: 13.5}} />
          <button className="btn btn--ghost btn--sm" onClick={() => send(input)} style={{color: 'var(--accent)'}}><Icon name="send" size={14} /></button>
        </div>
      </div>
    </div>
  );
};

const Pulse = ({ delay }) => (
  <span style={{
    width: 5, height: 5, borderRadius: '50%', background: 'var(--ink-3)',
    animation: `pulse-dot 1.2s ${delay}ms infinite`,
  }} />
);

window.PreExamWarning = PreExamWarning;
window.QuestionRunner = QuestionRunner;

/* Results + Missed Questions + Orion Remediation */

const ResultsScreen = ({ result, onStartFollowUp, onDone }) => {
  const { session, questions, duration } = result;
  const correct = questions.filter(q => q.isCorrect).length;
  const score = correct / questions.length;
  const passed = score >= 0.7;
  const missed = questions.filter(q => !q.isCorrect);

  // Group misses by module
  const byModule = {};
  missed.forEach(q => {
    if (!byModule[q.module]) byModule[q.module] = [];
    byModule[q.module].push(q);
  });

  const fmtTime = (s) => `${Math.floor(s/60)}m ${s%60}s`;

  return (
    <div className="page" style={{maxWidth: 1080, margin: '0 auto'}}>
      {/* Hero */}
      <div className="card" style={{padding: 32, marginBottom: 20, position: 'relative', overflow: 'hidden'}}>
        <div style={{display: 'flex', alignItems: 'flex-start', gap: 32}}>
          <div style={{flex: '0 0 200px'}}>
            <div style={{fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 500}}>
              {session.mode === 'exam' ? 'Exam Result' : 'Practice Result'}
            </div>
            <div style={{fontSize: 13, color: 'var(--ink-3)'}}>Reciprocating Engines</div>
          </div>
          <div style={{flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: 24, alignItems: 'baseline'}}>
            <div>
              <div className="serif tnum" style={{fontSize: 76, lineHeight: 1, color: passed ? 'var(--good)' : 'var(--bad)', letterSpacing: '-0.03em'}}>
                {Math.round(score * 100)}<span style={{fontSize: 34, color: 'var(--ink-4)'}}>%</span>
              </div>
              <div style={{fontSize: 12, color: 'var(--ink-3)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6}}>
                <span className={passed ? 'chip chip--good' : 'chip chip--bad'}>{passed ? 'PASS' : 'BELOW PASSING'}</span>
                <span>FAA passing: 70%</span>
              </div>
            </div>
            <ResultStat label="Correct" value={`${correct}/${questions.length}`} />
            <ResultStat label="Time" value={fmtTime(duration)} />
          </div>
        </div>

        {/* Score bar comparison */}
        <div style={{marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--line)'}}>
          <div style={{fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, fontWeight: 500}}>Trend (last 6 attempts in this section)</div>
          <div style={{display: 'flex', gap: 4, alignItems: 'flex-end', height: 60}}>
            {[0.66, 0.72, 0.71, 0.78, 0.65, 0.72, score].map((v, i, a) => (
              <div key={i} style={{flex: 1, position: 'relative'}}>
                <div style={{
                  height: `${v * 100}%`, minHeight: 8,
                  background: i === a.length - 1 ? (passed ? 'var(--good)' : 'var(--bad)') : 'var(--ink-5)',
                  borderRadius: '4px 4px 0 0',
                }} />
                <div style={{textAlign: 'center', fontSize: 10.5, color: 'var(--ink-4)', fontFamily: 'var(--font-mono)', marginTop: 4}}>{Math.round(v*100)}</div>
              </div>
            ))}
          </div>
          <div style={{position: 'relative', height: 1, background: 'var(--line)', marginTop: -28, marginBottom: 28}}>
            <div style={{position: 'absolute', top: -7, right: 0, fontSize: 10.5, color: 'var(--ink-4)', background: 'var(--bg-elev)', padding: '0 6px', fontFamily: 'var(--font-mono)'}}>70% pass</div>
          </div>
        </div>
      </div>

      {/* Remediation hero — Orion re-enabled */}
      {missed.length > 0 && (
        <div className="card" style={{padding: 24, marginBottom: 20, background: 'linear-gradient(180deg, var(--bg-elev), var(--accent-soft))', borderColor: 'var(--accent)', borderWidth: 1}}>
          <div style={{display: 'flex', gap: 20, alignItems: 'flex-start'}}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, #4D8BFF, #A586E8)',
              color: 'white', display: 'grid', placeItems: 'center',
            }}>
              <Icon name="orion" size={22} />
            </div>
            <div style={{flex: 1}}>
              <div style={{fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6}}>
                <Icon name="unlock" size={11} /> Orion re-enabled · Remediation ready
              </div>
              <h2 style={{fontSize: 18, marginBottom: 8}}>Let's break down the {missed.length} you missed.</h2>
              <p style={{color: 'var(--ink-2)', fontSize: 13.5, lineHeight: 1.55, marginBottom: 14, maxWidth: 620}}>
                Your weak areas in this attempt were <strong>{Object.keys(byModule).slice(0, 2).join(' and ')}</strong>. I can walk through each miss, surface the pattern, and generate a 15-question drill targeting those exact gaps.
              </p>
              <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                <button className="btn btn--primary" onClick={onStartFollowUp}>
                  <Icon name="sparkles" size={13} />
                  Generate quiz from misses ({missed.length} Q)
                </button>
                <button className="btn">Review with Orion</button>
                <button className="btn">See weak-area breakdown</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Missed questions */}
      {missed.length > 0 && (
        <div className="card" style={{padding: 0, marginBottom: 20}}>
          <div style={{padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center'}}>
            <h3>Missed Questions</h3>
            <span style={{fontSize: 12, color: 'var(--ink-4)', marginLeft: 10}}>{missed.length} of {questions.length}</span>
            <div style={{flex: 1}} />
            <div className="tabs">
              <button className="tab" data-active>By question</button>
              <button className="tab">By module</button>
            </div>
          </div>
          {missed.slice(0, 4).map((q, i) => (
            <MissedRow key={q.id} q={q} idx={i} />
          ))}
          {missed.length > 4 && (
            <button className="btn btn--ghost" style={{margin: 12, width: 'calc(100% - 24px)'}}>
              View all {missed.length} missed
              <Icon name="chev-d" size={12} />
            </button>
          )}
        </div>
      )}

      {/* Footer actions */}
      <div style={{display: 'flex', gap: 8, justifyContent: 'space-between', padding: '12px 0'}}>
        <button className="btn" onClick={onDone}>
          <Icon name="chev-l" size={13} /> Back to Written Exams
        </button>
        <div style={{display: 'flex', gap: 8}}>
          <button className="btn"><Icon name="download" size={13} /> Export results</button>
          <button className="btn">Retake same setup</button>
          <button className="btn btn--primary" onClick={onStartFollowUp}>
            <Icon name="sparkles" size={13} />
            Quiz from misses
          </button>
        </div>
      </div>
    </div>
  );
};

const ResultStat = ({ label, value }) => (
  <div>
    <div style={{fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontWeight: 500}}>{label}</div>
    <div className="tnum" style={{fontSize: 24, fontWeight: 600, fontFamily: 'var(--font-mono)'}}>{value}</div>
  </div>
);

const MissedRow = ({ q, idx }) => {
  const [open, setOpen] = React.useState(idx === 0);
  return (
    <div style={{borderTop: idx > 0 ? '1px solid var(--line)' : 0}}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '14px 18px', display: 'flex', alignItems: 'center',
        gap: 12, background: 'transparent', border: 0, textAlign: 'left',
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          background: 'var(--bad-soft)', color: 'var(--bad)',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <Icon name="x" size={12} />
        </div>
        <div style={{flex: 1}}>
          <div style={{fontSize: 13.5, fontWeight: 500, marginBottom: 2}}>{q.stem.slice(0, 90)}{q.stem.length > 90 && '…'}</div>
          <div style={{fontSize: 12, color: 'var(--ink-4)', display: 'flex', alignItems: 'center', gap: 8}}>
            <span className="chip" style={{fontSize: 10.5}}>{q.acs}</span>
            <span>{q.module}</span>
            <span>· You answered <strong style={{color: 'var(--bad)'}}>{q.chosen || '—'}</strong>, correct was <strong style={{color: 'var(--good)'}}>{q.correct}</strong></span>
          </div>
        </div>
        <Icon name={open ? 'chev-d' : 'chev-r'} size={13} />
      </button>
      {open && (
        <div style={{padding: '0 18px 18px 54px', display: 'flex', flexDirection: 'column', gap: 12}}>
          {q.choices.map(c => (
            <div key={c.id} style={{
              display: 'flex', gap: 10, padding: '8px 12px', borderRadius: 6,
              background: c.id === q.correct ? 'var(--good-soft)' : c.id === q.chosen ? 'var(--bad-soft)' : 'var(--bg-inset)',
              fontSize: 13, lineHeight: 1.5,
            }}>
              <span className="mono" style={{fontWeight: 600, color: c.id === q.correct ? 'var(--good)' : c.id === q.chosen ? 'var(--bad)' : 'var(--ink-4)'}}>{c.id}</span>
              <span>{c.text}</span>
              {c.id === q.correct && <Icon name="check" size={13} />}
              {c.id === q.chosen && c.id !== q.correct && <Icon name="x" size={13} />}
            </div>
          ))}
          <div style={{padding: 12, background: 'var(--bg-inset)', borderRadius: 6, fontSize: 13, lineHeight: 1.5, color: 'var(--ink-2)'}}>
            <strong style={{fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-4)', display: 'block', marginBottom: 6}}>Explanation</strong>
            {q.explanation}
          </div>
          <div style={{display: 'flex', gap: 6}}>
            <button className="btn btn--sm"><Icon name="orion" size={12} /> Ask Orion</button>
            <button className="btn btn--sm"><Icon name="book" size={12} /> {q.reference}</button>
          </div>
        </div>
      )}
    </div>
  );
};

window.ResultsScreen = ResultsScreen;

/* History tab + Instructor lookup + Progress Dashboard */

const HistoryTab = ({ tweaks, onOpenAttempt, student = null }) => {
  const D = window.KILSAR_DATA;
  const isInstructor = tweaks.role === 'instructor';
  const sourceHistory = (isInstructor && student) ? (D.studentDataFor(student.id)?.history || D.history) : D.history;
  const [filterMode, setFilterMode] = React.useState('All');
  const [filterRange, setFilterRange] = React.useState('Last 30 days');

  const visibleHistory = sourceHistory.filter(h => filterMode === 'All' || h.mode === filterMode);

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14}}>
          <div className="tabs">
            {['All', 'Exam', 'Study'].map(m => (
              <button key={m} className="tab" data-active={filterMode === m} onClick={() => setFilterMode(m)}>{m}</button>
            ))}
          </div>
          <div className="tabs">
            {['Last 7 days', 'Last 30 days', 'All time'].map(r => (
              <button key={r} className="tab" data-active={filterRange === r} onClick={() => setFilterRange(r)}>{r}</button>
            ))}
          </div>
          <div style={{flex: 1}} />
          <button className="btn"><Icon name="filter" size={13} /> Filter</button>
          <button className="btn"><Icon name="download" size={13} /> Export</button>
        </div>

        <div className="card" style={{padding: 0}}>
          <div style={{display: 'grid', gridTemplateColumns: '90px 1fr 90px 110px 100px 80px 36px', padding: '10px 18px', borderBottom: '1px solid var(--line)', background: 'var(--bg-inset)', fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500}}>
            <div>Date</div>
            <div>Title</div>
            <div>Mode</div>
            <div>Questions</div>
            <div>Time</div>
            <div style={{textAlign: 'right'}}>Score</div>
            <div></div>
          </div>
          {visibleHistory.map(h => (
            <button key={h.id} onClick={() => onOpenAttempt && onOpenAttempt(h)} style={{
              width: '100%', display: 'grid',
              gridTemplateColumns: '90px 1fr 90px 110px 100px 80px 36px',
              padding: '12px 18px', borderTop: '1px solid var(--line)',
              background: 'transparent', border: 0, textAlign: 'left',
              alignItems: 'center', cursor: 'pointer',
            }}>
              <div className="mono" style={{fontSize: 12.5, color: 'var(--ink-3)'}}>{h.date.slice(5)}</div>
              <div>
                <div style={{fontSize: 13.5, fontWeight: 500}}>{h.title}</div>
                <div style={{fontSize: 11.5, color: 'var(--ink-4)', display: 'flex', gap: 4, marginTop: 2}}>
                  {h.acs.slice(0, 3).map(a => <span key={a} className="chip" style={{fontSize: 10}}>{a}</span>)}
                </div>
              </div>
              <div>
                <span className={h.mode === 'Exam' ? 'chip chip--lock' : 'chip chip--accent'}>
                  {h.mode === 'Exam' ? <Icon name="lock" size={10} /> : <Icon name="book" size={10} />}
                  {h.mode}
                </span>
              </div>
              <div className="mono" style={{fontSize: 13}}>{h.count}</div>
              <div className="mono" style={{fontSize: 13, color: 'var(--ink-3)'}}>{h.duration}</div>
              <div style={{textAlign: 'right'}}>
                <span className="mono" style={{fontSize: 14, fontWeight: 600, color: h.score >= 0.7 ? 'var(--good)' : 'var(--bad)'}}>{Math.round(h.score*100)}%</span>
              </div>
              <div style={{color: 'var(--ink-4)', textAlign: 'right'}}><Icon name="chev-r" size={13} /></div>
            </button>
          ))}
        </div>
    </div>
  );
};

const KV = ({ label, value, good }) => (
  <div>
    <div style={{fontSize: 10.5, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500}}>{label}</div>
    <div className="mono" style={{fontSize: 16, fontWeight: 600, color: good ? 'var(--good)' : 'var(--ink)'}}>{value}</div>
  </div>
);

/* Dashboard */
const Dashboard = ({ onJumpToWeak, tweaks = {}, student = null }) => {
  const D = window.KILSAR_DATA;
  const isInstructor = tweaks.role === 'instructor';
  const sd = (isInstructor && student) ? D.studentDataFor(student.id) : null;
  const overallTrend = sd ? sd.overallTrend : D.overallTrend;
  const acsTrends = sd ? sd.acsTrends : D.acsTrends;
  const lastScore = overallTrend[overallTrend.length - 1];
  const focusAreas = [
    { module: 'Theory of Operation', acs: 'PA.I.F', mastery: 0.49, trend: -3, suggestion: 'Detonation, valve timing concepts repeatedly miss' },
    { module: 'Pistons', acs: 'PA.I.D', mastery: 0.55, trend: 2, suggestion: 'Ring identification & oversize bore questions' },
    { module: 'Composites', acs: 'AF.I.C', mastery: 0.51, trend: 5, suggestion: 'Repair classifications, ply orientation' },
  ];

  return (
    <div>
      {/* Stat row */}
      <div className="dashboard-stats" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
        <BigStat label="Avg score · last 10" value={`${Math.round(lastScore*100)}%`} trend={`${sd ? (sd.student.trend>0?'+':'')+sd.student.trend+'pt' : '+5.2pt'}`} good />
        <BigStat label="Attempts this week" value="6" sub="2 exam, 4 study" />
        <BigStat label="Time invested" value="11h 24m" sub="this month" />
      </div>

      <div className="dashboard-grid">
        {/* Trend chart */}
        <div className="card" style={{padding: 20}}>
          <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18}}>
            <div>
              <h3>Score trend</h3>
              <div style={{fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2}}>Last 10 attempts across all sections</div>
            </div>
            <div className="tabs">
              <button className="tab" data-active>10</button>
              <button className="tab">25</button>
              <button className="tab">All</button>
            </div>
          </div>
          <TrendChart data={overallTrend} />

          <div style={{marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--line)'}}>
            <div style={{fontSize: 12, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, fontWeight: 500}}>By ACS code</div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              {Object.entries(acsTrends).map(([acs, vals]) => (
                <ACSRow key={acs} acs={acs} vals={vals} />
              ))}
            </div>
          </div>
        </div>

        {/* Focus areas */}
        <div className="card" style={{padding: 20, alignSelf: 'start'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4}}>
            <Icon name="sparkles" size={14} />
            <h3>Focus Areas</h3>
          </div>
          <div style={{fontSize: 12.5, color: 'var(--ink-3)', marginBottom: 18}}>Auto-generated from your last 10 attempts</div>

          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            {focusAreas.map(f => (
              <div key={f.acs} style={{padding: 12, border: '1px solid var(--line)', borderRadius: 8, background: 'var(--bg-inset)'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6}}>
                  <span className="mono" style={{fontSize: 11, color: 'var(--ink-4)'}}>{f.acs}</span>
                  <span style={{fontSize: 13.5, fontWeight: 600}}>{f.module}</span>
                  <div style={{flex: 1}} />
                  <span className="mono" style={{fontSize: 12, fontWeight: 600, color: 'var(--bad)'}}>{Math.round(f.mastery*100)}%</span>
                </div>
                <div className="bar bar--bad" style={{height: 4, marginBottom: 8}}>
                  <span style={{width: `${f.mastery*100}%`}} />
                </div>
                <div style={{fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.45}}>{f.suggestion}</div>
              </div>
            ))}
          </div>

          <button onClick={onJumpToWeak} className="btn btn--primary" style={{width: '100%', marginTop: 16}}>
            <Icon name="sparkles" size={13} />
            Generate exam targeting weak areas
          </button>
          <div style={{textAlign: 'center', fontSize: 11.5, color: 'var(--ink-4)', marginTop: 8}}>30 questions · weighted toward modules &lt; 60%</div>
        </div>
      </div>
    </div>
  );
};

const BigStat = ({ label, value, trend, sub, good, highlight }) => (
  <div className="card" style={{padding: 16, background: highlight ? 'linear-gradient(180deg, var(--bg-elev), var(--accent-soft))' : 'var(--bg-elev)', borderColor: highlight ? 'var(--accent)' : 'var(--line)'}}>
    <div style={{fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 6}}>{label}</div>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 8}}>
      <div className="mono tnum" style={{fontSize: 26, fontWeight: 600}}>{value}</div>
      {trend && <div className="mono" style={{fontSize: 12, color: good ? 'var(--good)' : 'var(--bad)'}}>{trend}</div>}
    </div>
    {sub && <div style={{fontSize: 11.5, color: 'var(--ink-4)', marginTop: 2}}>{sub}</div>}
  </div>
);

const TrendChart = ({ data }) => {
  const W = 500, H = 160;
  const pad = { l: 28, r: 14, t: 10, b: 22 };
  const innerW = W - pad.l - pad.r, innerH = H - pad.t - pad.b;
  const x = (i) => pad.l + (i / (data.length - 1)) * innerW;
  const y = (v) => pad.t + (1 - v) * innerH;
  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');
  const area = `${path} L ${x(data.length-1)} ${pad.t + innerH} L ${pad.l} ${pad.t + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width: '100%', height: 'auto', overflow: 'visible'}}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(t => (
        <g key={t}>
          <line x1={pad.l} y1={y(t)} x2={W - pad.r} y2={y(t)} stroke="var(--line)" strokeDasharray={t === 0.7 ? '0' : '2 3'} />
          <text x={pad.l - 6} y={y(t) + 3} fontSize="10" fill="var(--ink-4)" textAnchor="end" fontFamily="var(--font-mono)">{Math.round(t*100)}</text>
        </g>
      ))}
      {/* Pass line at 70 */}
      <line x1={pad.l} y1={y(0.7)} x2={W - pad.r} y2={y(0.7)} stroke="var(--warn)" strokeDasharray="4 3" strokeWidth="1" />
      <text x={W - pad.r} y={y(0.7) - 4} fontSize="9.5" fill="var(--warn)" textAnchor="end" fontFamily="var(--font-mono)">FAA pass · 70%</text>

      <path d={area} fill="var(--ink)" opacity="0.06" />
      <path d={path} fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(v)} r={i === data.length - 1 ? 4 : 2.5} fill={i === data.length - 1 ? 'var(--good)' : 'var(--ink)'} />
          {i === data.length - 1 && (
            <text x={x(i) + 8} y={y(v) - 6} fontSize="11" fill="var(--good)" fontFamily="var(--font-mono)" fontWeight="600">{Math.round(v*100)}%</text>
          )}
        </g>
      ))}
      {/* X axis labels */}
      {data.map((_, i) => (
        <text key={i} x={x(i)} y={H - 6} fontSize="10" fill="var(--ink-4)" textAnchor="middle" fontFamily="var(--font-mono)">{i + 1}</text>
      ))}
    </svg>
  );
};

const ACSRow = ({ acs, vals }) => {
  const last = vals[vals.length - 1];
  const first = vals[0];
  const trend = last - first;
  const W = 100, H = 24;
  const x = (i) => (i / (vals.length - 1)) * W;
  const y = (v) => (1 - v) * H;
  const path = vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');
  const color = last >= 0.7 ? 'var(--good)' : last >= 0.55 ? 'var(--warn)' : 'var(--bad)';

  return (
    <div style={{display: 'grid', gridTemplateColumns: '60px 1fr 110px 50px 50px', alignItems: 'center', gap: 10, padding: '4px 0'}}>
      <span className="mono" style={{fontSize: 11.5, color: 'var(--ink-3)'}}>{acs}</span>
      <div className="bar" style={{height: 5}}>
        <span style={{width: `${last*100}%`, background: color}} />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100" height="24">
        <path d={path} fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
        <circle cx={x(vals.length-1)} cy={y(last)} r="2" fill={color} />
      </svg>
      <span className="mono" style={{fontSize: 12, fontWeight: 600, textAlign: 'right'}}>{Math.round(last*100)}%</span>
      <span className="mono" style={{fontSize: 11, color: trend > 0 ? 'var(--good)' : 'var(--bad)', textAlign: 'right'}}>
        {trend > 0 ? '+' : ''}{Math.round(trend*100)}
      </span>
    </div>
  );
};

window.HistoryTab = HistoryTab;
window.Dashboard = Dashboard;

/* Historical exam detail — click an attempt to see this */

const HistoryDetail = ({ attempt, onBack }) => {
  const D = window.KILSAR_DATA;
  // Build per-question results from sample bank for realism
  const questions = React.useMemo(() => {
    const out = [];
    const n = Math.min(attempt.count, 30); // show up to 30 in detail
    for (let i = 0; i < n; i++) {
      const q = D.sampleQuestions[i % D.sampleQuestions.length];
      // Fix correctness ratio to match overall score
      const wantCorrect = (i / n) < attempt.score;
      out.push({
        ...q,
        id: `${attempt.id}-q-${i}`,
        chosen: wantCorrect ? q.correct : q.choices.find(c => c.id !== q.correct).id,
        isCorrect: wantCorrect,
        timeSpent: 60 + Math.floor(Math.random() * 90),
      });
    }
    return out;
  }, [attempt.id]);

  const correct = questions.filter(q => q.isCorrect).length;
  const wrong = questions.length - correct;

  // Per-module breakdown
  const byModule = {};
  questions.forEach(q => {
    if (!byModule[q.module]) byModule[q.module] = { correct: 0, total: 0, acs: q.acs };
    byModule[q.module].total++;
    if (q.isCorrect) byModule[q.module].correct++;
  });

  const [filter, setFilter] = React.useState('all'); // all | wrong
  const visible = questions.filter(q => {
    if (filter === 'wrong') return !q.isCorrect;
    return true;
  });

  return (
    <div className="page" data-screen-label="History Detail" style={{maxWidth: 1080, margin: '0 auto'}}>
      {/* Breadcrumb */}
      <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontSize: 13}}>
        <button onClick={onBack} className="btn btn--ghost btn--sm" style={{padding: '0 6px'}}>
          <Icon name="chev-l" size={12} />
          Historical Exams
        </button>
        <span style={{color: 'var(--ink-4)'}}>/</span>
        <span style={{fontWeight: 600}}>{attempt.title}</span>
      </div>

      {/* Hero summary */}
      <div className="card" style={{padding: 24, marginBottom: 18}}>
        <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap'}}>
          <div style={{flex: '1 1 320px', minWidth: 0}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8}}>
              <span className={attempt.mode === 'Exam' ? 'chip chip--lock' : 'chip chip--accent'}>
                {attempt.mode === 'Exam' ? <Icon name="lock" size={10} /> : <Icon name="book" size={10} />}
                {attempt.mode} Mode
              </span>
              <span className="chip">{attempt.acs.join(' · ')}</span>
            </div>
            <h2 style={{fontSize: 22, marginBottom: 6}}>{attempt.title}</h2>
            <div style={{fontSize: 13, color: 'var(--ink-3)'}}>
              Taken on <span style={{color: 'var(--ink)', fontWeight: 500}}>{new Date(attempt.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              {' · '}{attempt.duration}
              {' · '}{attempt.count} questions
            </div>
          </div>
          <div style={{display: 'flex', gap: 28}}>
            <ResultStat label="Score" value={`${Math.round(attempt.score*100)}%`} />
            <ResultStat label="Correct" value={`${correct}/${questions.length}`} />
            <ResultStat label="Missed" value={wrong} />
          </div>
        </div>

        <div style={{display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap'}}>
          <button className="btn btn--primary"><Icon name="sparkles" size={13} /> Quiz from these {wrong} misses</button>
          <button className="btn">Retake same setup</button>
          <button className="btn"><Icon name="orion" size={13} /> Review with Orion</button>
          <div style={{flex: 1}} />
        </div>
      </div>

      {/* Two-column: breakdown + question list */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: 18}}>
        {/* Per-module breakdown */}
        <div className="card" style={{padding: 18}}>
          <h3 style={{marginBottom: 12}}>Performance by module</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10}}>
            {Object.entries(byModule).map(([mod, v]) => {
              const pct = v.correct / v.total;
              const color = pct >= 0.8 ? 'var(--good)' : pct >= 0.6 ? 'var(--warn)' : 'var(--bad)';
              return (
                <div key={mod} style={{padding: 12, background: 'var(--bg-inset)', border: '1px solid var(--line)', borderRadius: 8}}>
                  <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6}}>
                    <div>
                      <div style={{fontSize: 13.5, fontWeight: 600}}>{mod}</div>
                      <div className="mono" style={{fontSize: 11, color: 'var(--ink-4)'}}>{v.acs}</div>
                    </div>
                    <div className="mono" style={{fontSize: 16, fontWeight: 600, color}}>{Math.round(pct*100)}%</div>
                  </div>
                  <div className="bar" style={{height: 4}}>
                    <span style={{width: `${pct*100}%`, background: color}} />
                  </div>
                  <div style={{fontSize: 11.5, color: 'var(--ink-3)', marginTop: 6}}>{v.correct} of {v.total} correct</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All questions list */}
        <div className="card" style={{padding: 0}}>
          <div style={{padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap'}}>
            <h3 style={{margin: 0}}>All questions</h3>
            <span style={{fontSize: 12, color: 'var(--ink-4)'}}>{visible.length} shown</span>
            <div style={{flex: 1}} />
            <div className="tabs">
              <button className="tab" data-active={filter === 'all'} onClick={() => setFilter('all')}>All ({questions.length})</button>
              <button className="tab" data-active={filter === 'wrong'} onClick={() => setFilter('wrong')}>Missed ({wrong})</button>
            </div>
          </div>
          {visible.map((q, i) => (
            <HistoryQuestionRow key={q.id} q={q} idx={questions.indexOf(q)} isFirst={i === 0} />
          ))}
          {questions.length < attempt.count && (
            <div style={{padding: 14, textAlign: 'center', borderTop: '1px solid var(--line)', fontSize: 12, color: 'var(--ink-4)'}}>
              Showing {questions.length} of {attempt.count} — full review available in expanded view
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HistoryQuestionRow = ({ q, idx, isFirst }) => {
  const [open, setOpen] = React.useState(false);
  const fmtT = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  return (
    <div style={{borderTop: isFirst ? 0 : '1px solid var(--line)'}}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '12px 18px',
        display: 'grid', gridTemplateColumns: '24px 28px 1fr auto auto', gap: 12,
        background: 'transparent', border: 0, textAlign: 'left', alignItems: 'center', cursor: 'pointer',
      }}>
        <span className="mono" style={{fontSize: 11.5, color: 'var(--ink-4)', textAlign: 'right'}}>{idx + 1}</span>
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          background: q.isCorrect ? 'var(--good-soft)' : 'var(--bad-soft)',
          color: q.isCorrect ? 'var(--good)' : 'var(--bad)',
          display: 'grid', placeItems: 'center',
        }}>
          <Icon name={q.isCorrect ? 'check' : 'x'} size={12} />
        </div>
        <div style={{minWidth: 0}}>
          <div style={{fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{q.stem}</div>
          <div style={{fontSize: 11.5, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 8, marginTop: 2}}>
            <span className="mono">{q.acs}</span>
            <span>{q.module}</span>
          </div>
        </div>
        <span className="mono" style={{fontSize: 11.5, color: 'var(--ink-3)', whiteSpace: 'nowrap'}}>{fmtT(q.timeSpent)}</span>
        <Icon name={open ? 'chev-d' : 'chev-r'} size={13} />
      </button>
      {open && (
        <div className="fade-in" style={{padding: '0 18px 18px 76px', display: 'flex', flexDirection: 'column', gap: 10}}>
          <div style={{fontSize: 14, lineHeight: 1.5, color: 'var(--ink-2)', padding: '4px 0 8px'}}>{q.stem}</div>
          {q.choices.map(c => (
            <div key={c.id} style={{
              display: 'flex', gap: 10, padding: '8px 12px', borderRadius: 6,
              background: c.id === q.correct ? 'var(--good-soft)' : c.id === q.chosen && !q.isCorrect ? 'var(--bad-soft)' : 'var(--bg-inset)',
              fontSize: 13, lineHeight: 1.5, alignItems: 'flex-start',
            }}>
              <span className="mono" style={{fontWeight: 600, color: c.id === q.correct ? 'var(--good)' : c.id === q.chosen && !q.isCorrect ? 'var(--bad)' : 'var(--ink-4)'}}>{c.id}</span>
              <span style={{flex: 1}}>{c.text}</span>
              {c.id === q.correct && <span className="chip chip--good" style={{fontSize: 10}}>Correct</span>}
              {c.id === q.chosen && c.id !== q.correct && <span className="chip chip--bad" style={{fontSize: 10}}>Your answer</span>}
            </div>
          ))}
          <div style={{padding: 12, background: 'var(--bg-inset)', borderRadius: 6, fontSize: 13, lineHeight: 1.5, color: 'var(--ink-2)'}}>
            <div style={{fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-3)', fontWeight: 600, marginBottom: 6}}>Explanation</div>
            {q.explanation}
            <div style={{fontSize: 11, color: 'var(--ink-4)', marginTop: 8, fontFamily: 'var(--font-mono)'}}>{q.reference}</div>
          </div>
          <div style={{display: 'flex', gap: 6}}>
            <button className="btn btn--sm"><Icon name="orion" size={12} /> Ask Orion</button>
            <button className="btn btn--sm"><Icon name="book" size={12} /> Open reference</button>
          </div>
        </div>
      )}
    </div>
  );
};

window.HistoryDetail = HistoryDetail;


// ── Written Exams orchestrator (folded into the Web App as the writtenExams route) ──
function WrittenExams({ role = "instructor" }) {
  const D = window.KILSAR_DATA;
  const tw = { role, mode: "study", questionState: "fresh" };
  const [internalTab, setInternalTab] = React.useState("practice");
  const [screen, setScreen] = React.useState("main");
  const [pendingSession, setPendingSession] = React.useState(null);
  const [activeSession, setActiveSession] = React.useState(null);
  const [result, setResult] = React.useState(null);
  const [historyAttempt, setHistoryAttempt] = React.useState(null);
  const [viewingStudentId, setViewingStudentId] = React.useState("u-1");
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const viewingStudent = D.students.find((s) => s.id === viewingStudentId);

  const handleStart = (session) => {
    if (session.mode === "exam") { setPendingSession(session); setScreen("warning"); }
    else { setActiveSession(session); setScreen("running"); }
  };
  const proceedExam = () => { setActiveSession(pendingSession); setScreen("running"); };
  const finish = (r) => { setResult(r); setActiveSession(null); setScreen("results"); };
  const exitRunning = () => { setActiveSession(null); setScreen("main"); };
  const startMissedDrill = () => { setActiveSession({ mode: "study", count: (result.questions.filter((q) => !q.isCorrect).length) || 5, modules: [] }); setScreen("running"); };

  if (screen === "running" && activeSession) return <QuestionRunner session={activeSession} tweaks={tw} onFinish={finish} onExit={exitRunning} />;
  if (screen === "warning" && pendingSession) return <PreExamWarning count={pendingSession.count} subject={pendingSession.subject} duration={pendingSession.duration} onProceed={proceedExam} onCancel={() => setScreen("main")} />;
  if (screen === "results" && result) {
    return (
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto", background: "var(--kls-scaffold-bg)" }}>
        <ResultsScreen result={result} onStartFollowUp={startMissedDrill} onDone={() => setScreen("main")} />
      </div>
    );
  }
  const showPicker = role === "instructor" && (internalTab === "history" || internalTab === "progress");
  return (
    <div style={{ flex: 1, minWidth: 0, overflowY: "auto", background: "var(--kls-scaffold-bg)" }}>
      <div className="page" data-screen-label="Written Exams">
        <div className="page__head">
          <div>
            <div className="page__title">Written Exams</div>
            <div className="page__sub">Practice for your FAA written test. Build mastery, then simulate the real thing.</div>
          </div>
          {showPicker && <StudentPickerTrigger student={viewingStudent} onClick={() => setPickerOpen(true)} />}
        </div>
        <div className="compound-switch" role="tablist">
          <button className="compound-switch__option" role="tab" data-active={internalTab === "practice"} onClick={() => setInternalTab("practice")}><Icon name="exam" size={14} />Practice Setup</button>
          <button className="compound-switch__option" role="tab" data-active={internalTab === "history"} onClick={() => setInternalTab("history")}><Icon name="history" size={14} />Exam History<span className="count">{D.history.length}</span></button>
          <button className="compound-switch__option" role="tab" data-active={internalTab === "progress"} onClick={() => setInternalTab("progress")}><Icon name="chart" size={14} />Progress</button>
        </div>
        {internalTab === "practice" && <PracticeSetup tweaks={tw} onStart={handleStart} />}
        {internalTab === "history" && !historyAttempt && <HistoryTab tweaks={tw} student={role === "instructor" ? viewingStudent : null} onOpenAttempt={(a) => setHistoryAttempt(a)} />}
        {internalTab === "history" && historyAttempt && <HistoryDetail attempt={historyAttempt} onBack={() => setHistoryAttempt(null)} />}
        {internalTab === "progress" && <Dashboard tweaks={tw} student={role === "instructor" ? viewingStudent : null} onJumpToWeak={() => setInternalTab("practice")} />}
      </div>
      <StudentPickerDialog open={pickerOpen} onClose={() => setPickerOpen(false)} selectedId={viewingStudentId} onSelect={(id) => { setViewingStudentId(id); setPickerOpen(false); setHistoryAttempt(null); }} />
    </div>
  );
}
window.WrittenExams = WrittenExams;
