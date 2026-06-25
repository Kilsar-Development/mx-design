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

const { useState: useStateHome } = React;

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
    ticketsKey: "Tickets",
  },
  commercial: {
    workspaceName: "Acme Operations",
    termsKey: "Cases",
    termKey: "Case",
    viewerKey: "Operator",
    coursesKey: "Workflows",
    assignmentsKey: "Tasks",
    ticketsKey: "Tickets",
  },
};

function getFlavor(name) {
  return FLAVORS[name] || FLAVORS.education;
}

// ── Splash ───────────────────────────────────────────────────────
// Matches splash_screen.dart: full-bleed splash.png + centered white wordmark.
function SplashScreen() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: `url("../../assets/images/splash.png") center/cover no-repeat var(--kls-on-surface)`,
        overflow: "hidden",
      }}
    >
      {/* The wordmark (splashLogo.png) is the source-of-truth Kilsar logotype.
          Production tints it to neutral50 (white). We achieve that with a
          mask + white fill so the recoloring matches Flutter's behavior. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <KlsIcon
          path="../../assets/images/splashLogo.png"
          size={undefined}
          color="var(--kls-color-neutral-50)"
          style={{
            width: 180,
            height: 44,
            backgroundColor: "var(--kls-color-neutral-50)",
            WebkitMask: 'url("../../assets/images/splashLogo.png") center/contain no-repeat',
            mask: 'url("../../assets/images/splashLogo.png") center/contain no-repeat',
          }}
        />
      </div>
    </div>
  );
}

// ── Home: Empty state ────────────────────────────────────────────
// Matches _buildEmptyStatePage in home_screen.dart:
//   • Header row (workspace logo + spoof banner + profile avatar)
//   • Big circular hero (180×180) with airplane icon + accent4 glow
//   • Welcome heading
//   • Flavor-specific subtitle ("not enrolled in any <termsKey>")
//   • Two action cards: "Get Started" + "Explore"
function HomeScreenEmpty({ flavor = "education", showSpoofBanner = false, userName = "Claire" }) {
  const f = getFlavor(flavor);
  const isStudent = true;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--kls-scaffold-bg)",
        padding: "0 var(--kls-space-xsmall)",
      }}
    >
      <HomeHeader flavor={flavor} showSpoofBanner={showSpoofBanner} />

      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 var(--kls-space-med)"}}>
        {/* Hero circle (180×180 with accent4 glow) */}
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "linear-gradient(135deg, color-mix(in oklab, var(--kls-accent-4) 15%, transparent), color-mix(in oklab, var(--kls-accent-2) 10%, transparent))",
            border: "2px solid color-mix(in oklab, var(--kls-accent-4) 30%, transparent)",
            boxShadow: "0 0 30px 5px color-mix(in oklab, var(--kls-accent-4) 20%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "none",
          }}
        >
          {/* Plane icon — Kilsar mark serves as the airplane */}
          <KlsIcon name="kilsar" size={90} color="var(--kls-accent-4)" />
        </div>

        <div style={{ height: 24 }} />

        <div
          style={{
            fontFamily: "var(--kls-font-sans)",
            fontSize: "var(--kls-h2-size, 24px)",
            fontWeight: "var(--kls-h2-weight, 700)",
            color: "var(--kls-on-surface)",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          Welcome, {userName}!
        </div>

        <div style={{ height: 8 }} />

        <div
          style={{
            fontFamily: "var(--kls-font-sans)",
            fontSize: "var(--kls-body-large-size, 16px)",
            fontWeight: 400,
            color: "var(--kls-on-surface-variant)",
            textAlign: "center",
            padding: "0 var(--kls-space-med)",
            lineHeight: 1.4,
          }}
        >
          {isStudent
            ? `You're not enrolled in any ${f.termsKey.toLowerCase()} yet`
            : `You don't have any ${f.viewerKey.toLowerCase()}s enrolled yet`}
        </div>

        <div style={{ height: 32 }} />

        {/* Two action cards side-by-side */}
        <div style={{ display: "flex", gap: "var(--kls-space-xsmall)", alignSelf: "stretch" }}>
          <ActionCard
            iconName="modulesLarge"
            title="Get Started"
            subtitle={isStudent ? "View your home screen" : "View your dashboard"}
            accent="var(--kls-accent-1)"
          />
          <ActionCard
            iconName="circles"
            title="Explore"
            subtitle="Browse the workspace"
            accent="var(--kls-accent-4)"
          />
        </div>
      </div>
    </div>
  );
}

function ActionCard({ iconName, title, subtitle, accent }) {
  return (
    <button
      style={{
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
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <KlsIcon name={iconName} size={24} color="var(--kls-on-primary)" />
      </div>
      <div>
        <div
          style={{
            fontFamily: "var(--kls-font-sans)",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--kls-on-surface)",
          }}
        >
          {title}
        </div>
        <div style={{ height: 2 }} />
        <div
          style={{
            fontFamily: "var(--kls-font-sans)",
            fontSize: 12,
            fontWeight: 400,
            color: "var(--kls-on-surface-variant)",
            lineHeight: 1.3,
          }}
        >
          {subtitle}
        </div>
      </div>
    </button>
  );
}

// ── Home: Populated state ────────────────────────────────────────
// Matches _buildHomePage in home_screen.dart:
//   header → PendingReview/ContinueWorking → ActiveTerms → Todo
function HomeScreenPopulated({ flavor = "education", showSpoofBanner = false, isStudent = true }) {
  const f = getFlavor(flavor);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--kls-scaffold-bg)",
        padding: "0 var(--kls-space-xsmall)",
      }}
    >
      <HomeHeader flavor={flavor} showSpoofBanner={showSpoofBanner} />

      <div style={{ flex: 1, overflow: "auto", padding: "var(--kls-space-med) var(--kls-space-xsmall)", display: "flex", flexDirection: "column", gap: "var(--kls-space-med)"}}>
        {/* Pending Review (instructors) OR Continue Working (students) */}
        {isStudent ? <ContinueWorkingSection flavor={flavor} /> : <PendingReviewSection flavor={flavor} />}

        {/* Active Terms */}
        <ActiveTermsSection flavor={flavor} />

        {/* Todo list */}
        <TodoListSection flavor={flavor} />
      </div>
    </div>
  );
}

// ── Sections ─────────────────────────────────────────────────────
function SectionHeader({ title, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 var(--kls-space-xsmall)"}}>
      <div
        style={{
          fontFamily: "var(--kls-font-sans)",
          fontSize: "var(--kls-subtitle-medium-size, 18px)",
          fontWeight: "var(--kls-subtitle-medium-weight, 600)",
          color: "var(--kls-on-surface)",
        }}
      >
        {title}
      </div>
      {action && (
        <button
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontFamily: "var(--kls-font-sans)",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--kls-primary)",
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}

function ContinueWorkingSection({ flavor }) {
  const f = getFlavor(flavor);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--kls-space-xsmall)"}}>
      <SectionHeader title="Continue working" action="View all" />
      <div style={{ background: "var(--kls-surface)", borderRadius: 12, padding: "var(--kls-space-med)", border: "1px solid var(--kls-outline-variant)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-small)"}}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "var(--kls-accent-1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "none",
            }}
          >
            <KlsIcon name="modulesLarge" size={22} color="var(--kls-on-primary)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--kls-font-sans)",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--kls-on-surface)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {flavor === "education" ? "Multi-engine systems" : "Pre-flight ground checks"}
            </div>
            <div
              style={{
                fontFamily: "var(--kls-font-sans)",
                fontSize: 12,
                color: "var(--kls-on-surface-variant)",
                marginTop: "var(--kls-space-tiny)",
              }}
            >
              {flavor === "education" ? "Module 4 of 7 · 64% complete" : "Step 2 of 5 · in progress"}
            </div>
            <div style={{ height: 8 }} />
            <div style={{ height: 4, background: "var(--kls-tertiary)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: flavor === "education" ? "64%" : "40%", height: "100%", background: "var(--kls-primary)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PendingReviewSection({ flavor }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--kls-space-xsmall)"}}>
      <SectionHeader title="Pending review" action="View all" />
      <div style={{ background: "var(--kls-surface)", borderRadius: 12, padding: "var(--kls-space-xsmall) 0", border: "1px solid var(--kls-outline-variant)" }}>
        {[
          { initials: "JM", name: "Jamal Morris", sub: "Awaiting review · 12:08", flag: "amber" },
          { initials: "SK", name: "Sana Kapoor", sub: "Submitted · 11:42", flag: "amber" },
        ].map((r, i, arr) => (
          <div
            key={r.initials}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--kls-space-small)",
              padding: "var(--kls-space-small) var(--kls-space-med)",
              borderBottom: i < arr.length - 1 ? "1px solid var(--kls-tertiary)" : "none",
            }}
          >
            <div
              style={{
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
                fontWeight: 700,
              }}
            >
              {r.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 500, color: "var(--kls-on-surface)" }}>{r.name}</div>
              <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, color: "var(--kls-on-surface-variant)", marginTop: "var(--kls-space-tiny)"}}>{r.sub}</div>
            </div>
            <span
              style={{
                padding: "var(--kls-space-tiny) var(--kls-space-xsmall)",
                borderRadius: 999,
                background: "var(--kls-progress-container)",
                color: "var(--kls-on-progress-container)",
                fontFamily: "var(--kls-font-sans)",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              Review
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActiveTermsSection({ flavor }) {
  const f = getFlavor(flavor);
  const items = flavor === "education"
    ? [
        { title: "Spring 2025 — Private Pilot", sub: "12 students · 6 modules", state: "Active" },
        { title: "Multi-Engine Bridge", sub: "5 students · 4 modules", state: "Active" },
      ]
    : [
        { title: "Q1 Inspection — N42KL", sub: "8 tasks · 3 open", state: "Active" },
        { title: "Engine Overhaul — N115DB", sub: "12 tasks · 7 open", state: "Active" },
      ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--kls-space-xsmall)"}}>
      <SectionHeader title={`Active ${f.termsKey.toLowerCase()}`} action="View all" />
      <div style={{ display: "flex", gap: "var(--kls-space-xsmall)", overflowX: "auto", padding: "0 var(--kls-space-xsmall) var(--kls-space-tiny)", margin: "0 -8px" }}>
        {items.map((it) => (
          <div
            key={it.title}
            style={{
              flex: "none",
              width: 240,
              background: "var(--kls-surface)",
              borderRadius: 12,
              padding: "var(--kls-space-small)",
              border: "1px solid var(--kls-outline-variant)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--kls-space-xsmall)",
            }}
          >
            <span
              style={{
                alignSelf: "flex-start",
                padding: "var(--kls-space-tiny) var(--kls-space-xsmall)",
                borderRadius: 999,
                background: "var(--kls-success-container)",
                color: "var(--kls-on-success-container)",
                fontFamily: "var(--kls-font-sans)",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {it.state}
            </span>
            <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 14, fontWeight: 600, color: "var(--kls-on-surface)" }}>{it.title}</div>
            <div style={{ fontFamily: "var(--kls-font-sans)", fontSize: 12, color: "var(--kls-on-surface-variant)" }}>{it.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TodoListSection({ flavor }) {
  const f = getFlavor(flavor);
  const items = flavor === "education"
    ? [
        { label: "Grade Aysha's flight log", due: "Today" },
        { label: "Approve module 4 quiz", due: "Tomorrow" },
        { label: "Schedule check-ride for Mateo", due: "Fri" },
      ]
    : [
        { label: "Sign off on N42KL inspection", due: "Today" },
        { label: "Order replacement gasket", due: "Tomorrow" },
        { label: "Review Tomás's incident report", due: "Fri" },
      ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--kls-space-xsmall)"}}>
      <SectionHeader title="To-do" />
      <div style={{ background: "var(--kls-surface)", borderRadius: 12, padding: "var(--kls-space-tiny) 0", border: "1px solid var(--kls-outline-variant)" }}>
        {items.map((it, i, arr) => (
          <div
            key={it.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--kls-space-small)",
              padding: "var(--kls-space-small) var(--kls-space-med)",
              borderBottom: i < arr.length - 1 ? "1px solid var(--kls-tertiary)" : "none",
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                border: "2px solid var(--kls-outline)",
                flex: "none",
              }}
            />
            <div style={{ flex: 1, fontFamily: "var(--kls-font-sans)", fontSize: 14, color: "var(--kls-on-surface)" }}>{it.label}</div>
            <span
              style={{
                fontFamily: "var(--kls-font-sans)",
                fontSize: 11,
                fontWeight: 600,
                color: "var(--kls-on-surface-variant)",
              }}
            >
              {it.due}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Header (used by both empty + populated) ──────────────────────
function HomeHeader({ flavor, showSpoofBanner = false }) {
  const f = getFlavor(flavor);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "var(--kls-space-small) var(--kls-space-xsmall) var(--kls-space-tiny)",
        flex: "none",
      }}
    >
      {/* Workspace logo (left) — splashLogo wordmark, tinted to primary in dart spec */}
      <div style={{ height: 40, display: "flex", alignItems: "center" }}>
        <img
          src="../../assets/images/splashLogo.png"
          alt="Kilsar"
          style={{ height: 26, width: "auto", display: "block" }}
        />
      </div>

      {/* Right cluster */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-xsmall)"}}>
        {showSpoofBanner && (
          <span
            style={{
              padding: "var(--kls-space-tiny) var(--kls-space-small)",
              borderRadius: 6,
              background: "var(--kls-accent-5)",
              color: "var(--kls-accent-4)",
              fontFamily: "var(--kls-font-sans)",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {f.viewerKey} Mode
          </span>
        )}
        {/* Profile avatar */}
        <div
          style={{
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
            border: "1px solid var(--kls-outline-variant)",
          }}
        >
          CR
        </div>
      </div>
    </div>
  );
}

// Export
window.KLS_HOME = {
  SplashScreen,
  HomeScreenEmpty,
  HomeScreenPopulated,
  FLAVORS,
};
