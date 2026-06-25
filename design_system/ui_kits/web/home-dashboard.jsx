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

const { useState: useStateHomeDash } = React;

const HOME_FLAVORS = {
  education: {
    workspaceName: "Acme Aviation Co.",
    user: "Aaliyah Singh",
    termsKey: "Courses",
    termKey: "Course",
    coursesKey: "Modules",
    assignmentsKey: "Assignments",
    viewerKey: "Student",
  },
  commercial: {
    workspaceName: "Acme Operations",
    user: "Marcus Doyle",
    termsKey: "Cases",
    termKey: "Case",
    coursesKey: "Workflows",
    assignmentsKey: "Tasks",
    viewerKey: "Operator",
  },
};

function HomeDashboard({ flavor = "education", showAnalytics = true }) {
  const f = HOME_FLAVORS[flavor];
  const [detail, setDetail] = useStateHomeDash(0);
  const labels = [
    f.termsKey,
    `${f.termKey} Templates`,
    f.coursesKey,
    f.assignmentsKey,
  ];

  return (
    <div style={{ position: "relative", flex: 1, minHeight: 0, display: "flex", flexDirection: "column", padding: "var(--kls-space-med)", background: "var(--kls-surface-variant)" }}>
      {showAnalytics && <AnalyticsHeader flavor={flavor} />}

      {/* Detail pane card */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          marginTop: showAnalytics ? 16 : 0,
          background: "var(--kls-surface)",
          borderRadius: 12,
          border: "1px solid var(--kls-outline-variant)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top bar: CompoundSwitch + Refresh */}
        <div style={{ padding: "var(--kls-space-med)", display: "flex", alignItems: "center", gap: "var(--kls-space-small)", borderBottom: "1px solid var(--kls-outline-variant)" }}>
          <CompoundSwitch labels={labels} value={detail} onChange={setDetail} />
          <button
            aria-label="Refresh"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: "1px solid var(--kls-outline-variant)",
              background: "var(--kls-surface)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <KlsIcon name="refresh" size={18} color="var(--kls-on-surface)" />
          </button>
        </div>

        {/* Detail content (cross-fades on segment change) */}
        <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
          <div key={detail} style={{ position: "absolute", inset: 0, overflow: "auto", animation: "homeFade 280ms var(--kls-easing-standard, cubic-bezier(0.2, 0, 0, 1))" }}>
            {detail === 0 && <TermsTable flavor={flavor} />}
            {detail === 1 && <TemplatesTable flavor={flavor} />}
            {detail === 2 && <CoursesTable flavor={flavor} />}
            {detail === 3 && <AssignmentsTable flavor={flavor} />}
          </div>
        </div>
      </div>

      {/* Floating Assistant FAB */}
      <button
        aria-label="Open assistant"
        style={{
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
          justifyContent: "center",
        }}
      >
        <KlsIcon name="orionOutline" size={28} color="var(--kls-on-surface)" />
      </button>

      <style>{`
        @keyframes homeFade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Analytics header ─────────────────────────────────────────────
// Two compact cards (Assignments Completed graph + Time-in-Assignment graph)
// to stay representative without going overboard, per the default decision.
function AnalyticsHeader({ flavor }) {
  const f = HOME_FLAVORS[flavor];
  return (
    <div style={{ display: "flex", gap: "var(--kls-space-med)", overflowX: "auto", paddingBottom: "var(--kls-space-tiny)"}}>
      <AnalyticsCard
        title={`${f.assignmentsKey} completed`}
        sub="Last 30 days"
        chart={<BarChart data={[24, 18, 32, 28, 45, 38, 52, 41, 36, 48, 55, 42]} />}
        big="412"
        delta="+14%"
        deltaPositive
      />
      <AnalyticsCard
        title={`Time in ${f.assignmentsKey.toLowerCase().replace(/s$/, "")}`}
        sub="Average per session"
        chart={<LineChart data={[42, 38, 45, 50, 48, 52, 55, 51, 49, 53, 58, 56]} />}
        big="48m"
        delta="+6m"
        deltaPositive
      />
    </div>
  );
}

function AnalyticsCard({ title, sub, chart, big, delta, deltaPositive }) {
  return (
    <div
      style={{
        flex: "none",
        width: 500,
        background: "var(--kls-surface)",
        borderRadius: 12,
        border: "1px solid var(--kls-outline-variant)",
        padding: "var(--kls-space-med)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--kls-space-xsmall)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
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
          <div
            style={{
              fontFamily: "var(--kls-font-sans)",
              fontSize: 12,
              color: "var(--kls-on-surface-variant)",
              marginTop: "var(--kls-space-tiny)",
            }}
          >
            {sub}
          </div>
        </div>
        <button
          aria-label="More"
          style={{ width: 28, height: 28, border: "none", background: "transparent", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <KlsIcon name="dots" size={16} color="var(--kls-on-surface-variant)" />
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "var(--kls-space-xsmall)"}}>
        <div
          style={{
            fontFamily: "var(--kls-font-sans)",
            fontSize: 32,
            fontWeight: 700,
            color: "var(--kls-on-surface)",
            lineHeight: 1,
          }}
        >
          {big}
        </div>
        {delta && (
          <span
            style={{
              fontFamily: "var(--kls-font-sans)",
              fontSize: 12,
              fontWeight: 600,
              color: deltaPositive ? "var(--kls-on-success-container)" : "var(--kls-error)",
              padding: "var(--kls-space-tiny) var(--kls-space-xsmall)",
              borderRadius: 999,
              background: deltaPositive
                ? "var(--kls-success-container)"
                : "var(--kls-error-container)",
            }}
          >
            {delta}
          </span>
        )}
      </div>

      {chart}
    </div>
  );
}

// ── Tiny chart components (no library) ───────────────────────────
function BarChart({ data, height = 60 }) {
  const max = Math.max(...data);
  return (
    <svg viewBox={`0 0 ${data.length * 24} ${height}`} style={{ width: "100%", height }}>
      {data.map((v, i) => {
        const h = (v / max) * (height - 6);
        return (
          <rect
            key={i}
            x={i * 24 + 4}
            y={height - h}
            width={16}
            height={h}
            rx={3}
            fill="var(--kls-primary)"
            opacity={0.8}
          />
        );
      })}
    </svg>
  );
}

function LineChart({ data, height = 60 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = data.length * 24;
  const points = data
    .map((v, i) => {
      const x = i * 24 + 12;
      const y = height - 4 - ((v - min) / (max - min || 1)) * (height - 12);
      return `${x},${y}`;
    })
    .join(" ");
  // Build a closed polygon for the area fill
  const area = `M ${data[0] !== undefined ? `12,${height}` : ""} L ${points} L ${(data.length - 1) * 24 + 12},${height} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: "100%", height }}>
      <path d={area} fill="var(--kls-primary)" opacity={0.15} />
      <polyline points={points} fill="none" stroke="var(--kls-primary)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ── Compound switch (4-way segmented control) ───────────────────
function CompoundSwitch({ labels, value, onChange }) {
  return (
    <div
      style={{
        display: "inline-flex",
        background: "var(--kls-tertiary)",
        borderRadius: 8,
        padding: "var(--kls-space-tiny)",
        gap: "var(--kls-space-tiny)",
      }}
    >
      {labels.map((l, i) => (
        <button
          key={l}
          onClick={() => onChange(i)}
          style={{
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
            boxShadow: value === i ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

// ── Detail tables (representative samples) ──────────────────────
function DetailTable({ columns, rows }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--kls-font-sans)" }}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th
              key={c}
              style={{
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
                top: 0,
              }}
            >
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderBottom: "1px solid var(--kls-tertiary)" }}>
            {r.map((cell, j) => (
              <td key={j} style={{ padding: "var(--kls-space-small) var(--kls-space-med)", fontSize: 13, color: "var(--kls-on-surface)", verticalAlign: "middle" }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StatusPill({ tone, children }) {
  const palette = {
    active: { bg: "var(--kls-success-container)", fg: "var(--kls-on-success-container)" },
    review: { bg: "var(--kls-progress-container)", fg: "var(--kls-on-progress-container)" },
    draft:  { bg: "var(--kls-tertiary)", fg: "var(--kls-on-surface-variant)" },
    closed: { bg: "var(--kls-error-container)", fg: "var(--kls-error)" },
  };
  const p = palette[tone] || palette.draft;
  return (
    <span style={{ padding: "var(--kls-space-tiny) var(--kls-space-small)", borderRadius: 999, background: p.bg, color: p.fg, fontSize: 11, fontWeight: 600 }}>
      {children}
    </span>
  );
}

function TermsTable({ flavor }) {
  if (flavor === "commercial") {
    return (
      <DetailTable
        columns={["Case", "Aircraft", `${HOME_FLAVORS.commercial.viewerKey}`, "Status", "Updated"]}
        rows={[
          ["Q1 Inspection — N42KL", "Cessna 172", "M. Doyle", <StatusPill tone="active">Active</StatusPill>, "Today 09:42"],
          ["Engine Overhaul — N115DB", "Piper Seneca", "S. Renault", <StatusPill tone="review">Review</StatusPill>, "Yesterday"],
          ["Avionics Upgrade — N803WC", "Cirrus SR22", "—", <StatusPill tone="draft">Draft</StatusPill>, "2 days ago"],
          ["Annual — N221AT", "Beech Bonanza", "T. Fonseca", <StatusPill tone="closed">Closed</StatusPill>, "Mar 14"],
        ]}
      />
    );
  }
  return (
    <DetailTable
      columns={["Course", "Term", "Students", "Status", "Updated"]}
      rows={[
        ["Spring 2025 — Private Pilot", "Spring 25", "12", <StatusPill tone="active">Active</StatusPill>, "Today 09:42"],
        ["Multi-Engine Bridge", "Spring 25", "5", <StatusPill tone="active">Active</StatusPill>, "Yesterday"],
        ["Instrument Rating — Cohort B", "Fall 24", "18", <StatusPill tone="review">Grading</StatusPill>, "2 days ago"],
        ["Commercial Add-On", "Fall 24", "0", <StatusPill tone="draft">Draft</StatusPill>, "Mar 14"],
      ]}
    />
  );
}

function TemplatesTable({ flavor }) {
  return (
    <DetailTable
      columns={["Template", "Used in", "Last edit"]}
      rows={[
        ["Pre-Solo Knowledge Test", flavor === "education" ? "8 courses" : "6 cases", "Mar 18"],
        ["Cross-Country Planning", flavor === "education" ? "5 courses" : "—", "Feb 27"],
        ["Engine Run-Up Checklist", flavor === "education" ? "12 courses" : "14 cases", "Feb 12"],
      ]}
    />
  );
}

function CoursesTable({ flavor }) {
  if (flavor === "commercial") {
    return (
      <DetailTable
        columns={["Workflow", "Steps", "Owner", "Active in"]}
        rows={[
          ["Pre-flight ground checks", "5", "S. Renault", "12 cases"],
          ["100-hour inspection", "18", "M. Doyle", "4 cases"],
          ["Squawk triage", "3", "Ops team", "8 cases"],
        ]}
      />
    );
  }
  return (
    <DetailTable
      columns={["Module", "Lessons", "Author", "Used in"]}
      rows={[
        ["Multi-engine systems", "7", "Capt. Reed", "4 courses"],
        ["Aerodynamics fundamentals", "12", "Dr. Patel", "9 courses"],
        ["FAR/AIM walkthrough", "6", "Capt. Reed", "11 courses"],
      ]}
    />
  );
}

function AssignmentsTable({ flavor }) {
  return (
    <DetailTable
      columns={[flavor === "education" ? "Assignment" : "Task", "Assigned to", "Due", "Status"]}
      rows={[
        [flavor === "education" ? "Logbook entry — solo XC" : "Replace pitot tube — N42KL", "A. Ramos", "Today", <StatusPill tone="active">Open</StatusPill>],
        [flavor === "education" ? "Quiz: Airspace classes" : "Order replacement gasket", "M. Oliveira", "Tomorrow", <StatusPill tone="review">Review</StatusPill>],
        [flavor === "education" ? "Stage check — Module 3" : "Sign off — engine overhaul", "S. Kapoor", "Fri", <StatusPill tone="draft">Pending</StatusPill>],
      ]}
    />
  );
}

window.KLS_HOME_DASHBOARD = { HomeDashboard, HOME_FLAVORS };
// Also expose at top level so other Babel files can reference it directly.
window.HomeDashboard = HomeDashboard;
