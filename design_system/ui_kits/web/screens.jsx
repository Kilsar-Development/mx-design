// screens.jsx — Web workspace shell sample content (Library tab)
const { useState: useState_S } = React;

function LibraryScreen() {
  const folders = [
    { name: "Aviation",  count: 124, color: "var(--kls-color-blue-100)" },
    { name: "Maritime",  count: 87,  color: "var(--kls-color-green-100)" },
    { name: "Medical",   count: 42,  color: "var(--kls-color-red-100)" },
    { name: "FCC Regs",  count: 19,  color: "var(--kls-color-orange-100)" },
  ];
  const recents = [
    { title: "Part 91 — General Operating Rules", subtitle: "Updated 2 days ago", type: "Course" },
    { title: "Knot Tying — Bowline", subtitle: "Updated 4 days ago", type: "Module" },
    { title: "Radar Plotting Fundamentals", subtitle: "Updated last week", type: "Course" },
    { title: "Q4 Inventory Audit Notes", subtitle: "Updated last week", type: "Doc" },
    { title: "Crew Briefing — Approach Plates", subtitle: "Updated 2 weeks ago", type: "Module" },
  ];

  return (
    <div style={{ flex: 1, overflow: "auto", background: "var(--kls-scaffold-bg)", padding: "var(--kls-space-med)"}}>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "var(--kls-space-med)"}}>
        <div>
          <div
            style={{
              fontFamily: "var(--kls-font-sans)",
              fontSize: "var(--kls-h2-size)",
              fontWeight: "var(--kls-h2-weight)",
              color: "var(--kls-on-surface)",
              marginBottom: "var(--kls-space-tiny)",
            }}
          >
            Library
          </div>
          <div
            style={{
              fontFamily: "var(--kls-font-sans)",
              fontSize: "var(--kls-body-small-size)",
              fontWeight: "var(--kls-body-small-weight)",
              color: "var(--kls-on-surface-variant)",
            }}
          >
            All courses, modules, and documents in this workspace.
          </div>
        </div>
        <div style={{ display: "flex", gap: "var(--kls-space-small)"}}>
          <button
            style={{
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
              gap: "var(--kls-space-xsmall)",
            }}
          >
            <KlsIcon name="filter" size={16} color="var(--kls-on-surface)" />
            Filter
          </button>
          <button
            style={{
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
              gap: "var(--kls-space-xsmall)",
            }}
          >
            <KlsIcon name="pencil" size={14} color="var(--kls-on-primary)" />
            New course
          </button>
        </div>
      </div>

      {/* Folder cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--kls-space-med)", marginBottom: "var(--kls-space-large)"}}>
        {folders.map((f) => (
          <div
            key={f.name}
            style={{
              background: "var(--kls-surface)",
              border: "1px solid var(--kls-outline-variant)",
              borderRadius: 12,
              padding: "var(--kls-space-med)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: f.color,
                marginBottom: "var(--kls-space-small)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <KlsIcon name="folder" size={20} color="var(--kls-on-surface)" />
            </div>
            <div
              style={{
                fontFamily: "var(--kls-font-sans)",
                fontSize: 16,
                fontWeight: 600,
                color: "var(--kls-on-surface)",
                marginBottom: "var(--kls-space-tiny)",
              }}
            >
              {f.name}
            </div>
            <div
              style={{
                fontFamily: "var(--kls-font-sans)",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--kls-on-surface-variant)",
              }}
            >
              {f.count} items
            </div>
          </div>
        ))}
      </div>

      {/* Recents */}
      <div
        style={{
          fontFamily: "var(--kls-font-sans)",
          fontSize: "var(--kls-h4-size)",
          fontWeight: "var(--kls-h4-weight)",
          color: "var(--kls-on-surface)",
          marginBottom: "var(--kls-space-small)",
        }}
      >
        Recent
      </div>
      <div
        style={{
          background: "var(--kls-surface)",
          border: "1px solid var(--kls-outline-variant)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {recents.map((r, i) => (
          <div
            key={r.title}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--kls-space-med)",
              padding: "var(--kls-space-small) var(--kls-space-med)",
              borderBottom: i < recents.length - 1 ? "1px solid var(--kls-outline-variant)" : "none",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: "var(--kls-tertiary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "none",
              }}
            >
              <KlsIcon
                name={r.type === "Course" ? "modulesLarge" : r.type === "Module" ? "cube" : "worklog"}
                size={20}
                color="var(--kls-on-surface)"
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--kls-font-sans)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--kls-on-surface)",
                  marginBottom: "var(--kls-space-tiny)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {r.title}
              </div>
              <div
                style={{
                  fontFamily: "var(--kls-font-sans)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--kls-on-surface-variant)",
                }}
              >
                {r.subtitle}
              </div>
            </div>
            <div
              style={{
                padding: "var(--kls-space-tiny) var(--kls-space-small)",
                background: "var(--kls-tertiary-container)",
                borderRadius: 12,
                fontFamily: "var(--kls-font-sans)",
                fontSize: 11,
                fontWeight: 600,
                color: "var(--kls-on-tertiary-container)",
              }}
            >
              {r.type}
            </div>
            <KlsIcon name="chevronRight" size={16} color="var(--kls-on-surface-variant)" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── App shell ────────────────────────────────────────────────────
function WebApp({ flavor = "education" }) {
  const f = (window.KLS_HOME_DASHBOARD && window.KLS_HOME_DASHBOARD.HOME_FLAVORS)
    || { education: { workspaceName: "Acme Aviation Co.", user: "Aaliyah" }, commercial: { workspaceName: "Acme Operations", user: "Marcus" } };
  const flavorMeta = f[flavor] || f.education;
  const tabsForActive = (window.tabsForFlavor || ((x) => SIDEBAR_TABS))(flavor);
  const [active, setActive] = useState_S("terms");

  const activeTab = tabsForActive.find((t) => t.key === active) || tabsForActive[0];
  const isHome = active === "terms";

  // Workspace name (top-left of sidebar) — flips per flavor.
  const workspaceName = flavor === "commercial" ? "Acme Operations" : "Acme Aviation Co.";
  // Header title — for home, dynamic welcome; otherwise the active tab label.
  const userName = flavor === "commercial" ? "Marcus" : "Aaliyah";
  const headerTitle = isHome ? `Welcome back, ${userName}` : activeTab.label;

  return (
    <div style={{ height: "100%", display: "flex", background: "var(--kls-scaffold-bg)" }}>
      <NavSidebar active={active} onSelect={setActive} workspaceName={workspaceName} flavor={flavor} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header title={headerTitle} unread={3} />
        {isHome
          ? <HomeDashboard flavor={flavor} showAnalytics={true} />
          : <LibraryScreen />}
      </div>
    </div>
  );
}
