// screens.jsx — Kilsar mobile screens
const { useState: useStateScreens } = React;

function HomeScreen({ go }) {
  const { TopBar, Icon, Card, Pill, Avatar, ListRow, ProgressBar, Button } = window.KLS;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--kls-scaffold-bg)" }}>
      <TopBar
        title="Today"
        leading={<button style={{ background: "transparent", border: "none", padding: 0 }}><Avatar initials="CR" dark size={32} /></button>}
        trailing={<Icon name="bell" size={22} color="var(--kls-on-surface)" />}
      />
      <div style={{ flex: 1, overflow: "auto", padding: "var(--kls-space-med)", display: "flex", flexDirection: "column", gap: "var(--kls-space-med)"}}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--kls-on-surface-variant)", fontFamily: "Plus Jakarta Sans", marginBottom: "var(--kls-space-xsmall)"}}>Good morning, Claire</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: "var(--kls-on-surface)", fontFamily: "Plus Jakarta Sans", lineHeight: "32px" }}>3 calibrations<br/>scheduled today</div>
        </div>

        <Card onClick={() => go("calibration")}>
          <div style={{ padding: "var(--kls-space-med)", display: "flex", flexDirection: "column", gap: "var(--kls-space-xsmall)"}}>
            <Pill variant="green">Active</Pill>
            <div style={{ fontSize: 16, fontWeight: 500, color: "var(--kls-on-surface)", fontFamily: "Plus Jakarta Sans" }}>Calibration sequence A2</div>
            <div style={{ display: "flex", gap: "var(--kls-space-small)", fontSize: 12, color: "var(--kls-on-surface-variant)", fontFamily: "Plus Jakarta Sans" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-tiny)"}}><Icon name="clock" size={14} color="var(--kls-on-surface-variant)" /> 12 min</span>
              <span style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-tiny)"}}><Icon name="check-circle" size={14} color="var(--kls-on-surface-variant)" /> 4 steps</span>
            </div>
          </div>
          <div style={{ background: "var(--kls-tertiary)", padding: "var(--kls-space-small) var(--kls-space-med)"}}>
            <ProgressBar value={0.4} />
          </div>
        </Card>

        <Card>
          <div style={{ padding: "var(--kls-space-med)", display: "flex", alignItems: "center", gap: "var(--kls-space-small)"}}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--kls-on-surface-variant)", fontFamily: "Plus Jakarta Sans" }}>STEP 1 OF 4</div>
              <div style={{ fontSize: 16, fontWeight: 500, color: "var(--kls-on-surface)", marginTop: "var(--kls-space-tiny)", fontFamily: "Plus Jakarta Sans" }}>Pre-flight checks</div>
              <div style={{ display: "flex", gap: "var(--kls-space-xsmall)", marginTop: "var(--kls-space-xsmall)"}}>
                <Pill variant="blue" size="sm">Audio</Pill>
                <Pill variant="grey" size="sm">Video</Pill>
              </div>
            </div>
            <Icon name="chevron-right" size={20} color="var(--kls-content-quaternary)" />
          </div>
        </Card>

        <div style={{ background: "var(--kls-surface)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "var(--kls-space-small) var(--kls-space-med) var(--kls-space-tiny)", fontSize: 10, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--kls-on-surface-variant)", fontFamily: "Plus Jakarta Sans" }}>Recent</div>
          <ListRow avatar={<Avatar initials="JM" />} title="Jamal Morris" sub="Exam logs · 12:08" badge="3" />
          <ListRow avatar={<Avatar initials="SK" />} title="Sana Kapoor" sub="Awaiting review" />
          <ListRow avatar={<Avatar initials="MO" />} title="Mateo Oliveira" sub="Onboarding · step 3 of 4" last />
        </div>

        <Button variant="primary" size="lg" leadingIcon="plus">New session</Button>
      </div>
    </div>
  );
}

function ExamListScreen({ go }) {
  const { TopBar, Icon, ListRow, Avatar, Pill } = window.KLS;
  const [tab, setTab] = useStateScreens("today");
  const tabs = [["today","Today"],["week","Week"],["month","Month"],["all","All"]];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--kls-scaffold-bg)" }}>
      <TopBar title="Exams" leading={<Icon name="bars-3" size={22} color="var(--kls-on-surface)" />} trailing={<Icon name="funnel" size={22} color="var(--kls-on-surface)" />} />
      <div style={{ padding: "var(--kls-space-small)", display: "flex", gap: "var(--kls-space-xsmall)", overflow: "auto" }}>
        {tabs.map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "var(--kls-space-xsmall) var(--kls-space-small)", borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: tab === id ? "var(--kls-on-surface)" : "var(--kls-tertiary)",
            color: tab === id ? "var(--kls-surface)" : "var(--kls-on-surface-variant)",
            border: "none", cursor: "pointer", fontFamily: "Plus Jakarta Sans", flexShrink: 0,
          }}>{label}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>
        {[
          ["CR","Claire Renault","Calibration A2 · 14:32","green","In progress"],
          ["JM","Jamal Morris","Skills test · pending","amber","Review"],
          ["SK","Sana Kapoor","Calibration B1 · 11:00","grey","Scheduled"],
          ["MO","Mateo Oliveira","Onboarding · 09:42","blue","Step 3/4"],
          ["AR","Aysha Ramos","Exam complete","green","Passed"],
          ["TF","Tomás Fonseca","Exam · 08:15","red","Failed"],
        ].map(([i,n,s,v,t], idx, arr) => (
          <ListRow key={i} avatar={<Avatar initials={i} dark={idx === 0} />} title={n} sub={s} last={idx === arr.length - 1} />
        ))}
      </div>
    </div>
  );
}

function CalibrationScreen({ go }) {
  const { TopBar, Icon, Card, Pill, Button, ProgressBar } = window.KLS;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--kls-scaffold-bg)" }}>
      <TopBar title="Calibration" leading={<button onClick={() => go("home")} style={{ background:"transparent", border:"none", padding:0, cursor:"pointer" }}><Icon name="chevron-left" size={24} color="var(--kls-on-surface)" /></button>} trailing={<Icon name="ellipsis-horizontal" size={22} color="var(--kls-on-surface)" />} />
      <div style={{ padding: "var(--kls-space-xsmall) var(--kls-space-med) 0"}}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--kls-on-surface-variant)", letterSpacing: ".06em", fontFamily: "Plus Jakarta Sans" }}>STEP 2 OF 4</div>
        <ProgressBar value={0.5} />
      </div>
      <div style={{ flex: 1, padding: "var(--kls-space-med)", display: "flex", flexDirection: "column", gap: "var(--kls-space-med)", overflow: "auto" }}>
        <div>
          <Pill variant="green">Active</Pill>
          <div style={{ fontSize: 24, fontWeight: 600, color: "var(--kls-on-surface)", fontFamily: "Plus Jakarta Sans", lineHeight: "32px", marginTop: "var(--kls-space-small)"}}>Audio calibration</div>
          <div style={{ fontSize: 14, fontWeight: 400, color: "var(--kls-content-secondary)", fontFamily: "Plus Jakarta Sans", marginTop: "var(--kls-space-xsmall)", lineHeight: "20px" }}>Speak the displayed phrase clearly. We will measure ambient noise and microphone signal.</div>
        </div>

        <Card style={{ border: "1px solid var(--kls-outline)" }}>
          <div style={{ padding: "var(--kls-space-med)", display: "flex", flexDirection: "column", gap: "var(--kls-space-small)", alignItems: "center" }}>
            <Icon name="microphone" size={32} color="var(--kls-on-surface)" />
            <div style={{ fontSize: 18, fontWeight: 500, color: "var(--kls-on-surface)", textAlign: "center", fontFamily: "Plus Jakarta Sans", lineHeight: "26px" }}>"The quiet morning fog drifted across the harbor."</div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--kls-space-xsmall)", marginTop: "var(--kls-space-tiny)"}}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "var(--kls-success)" }}></span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--kls-success)", fontFamily: "Plus Jakarta Sans" }}>Listening · –32 dB</span>
            </div>
          </div>
        </Card>

        <div style={{ background: "var(--kls-tertiary)", borderRadius: 12, padding: "var(--kls-space-small)", display: "flex", gap: "var(--kls-space-small)", alignItems: "flex-start" }}>
          <Icon name="information-circle" size={18} color="var(--kls-content-secondary)" />
          <div style={{ fontSize: 13, color: "var(--kls-content-secondary)", lineHeight: "18px", fontFamily: "Plus Jakarta Sans" }}>If your mic level stays below –50 dB, move to a quieter room and try again.</div>
        </div>

        <div style={{ display: "flex", gap: "var(--kls-space-xsmall)"}}>
          <Button variant="tertiary" size="lg">Retry</Button>
          <div style={{ flex: 1 }}><Button variant="primary" size="lg" trailingIcon="arrow-right">Continue</Button></div>
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({ go }) {
  const { TopBar, Icon, Avatar, ListRow, Pill, Button } = window.KLS;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--kls-scaffold-bg)" }}>
      <TopBar title="Profile" leading={<Icon name="chevron-left" size={24} color="var(--kls-on-surface)" />} trailing={<Icon name="cog-6-tooth" size={22} color="var(--kls-on-surface)" />} />
      <div style={{ padding: "var(--kls-space-med) var(--kls-space-med) var(--kls-space-med)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--kls-space-small)", borderBottom: "1px solid var(--kls-outline-variant)" }}>
        <Avatar initials="CR" dark size={72} dot />
        <div style={{ fontSize: 20, fontWeight: 600, color: "var(--kls-on-surface)", fontFamily: "Plus Jakarta Sans" }}>Claire Renault</div>
        <div style={{ fontSize: 13, color: "var(--kls-on-surface-variant)", fontFamily: "Plus Jakarta Sans" }}>Operator · ID 04A2</div>
        <div style={{ display: "flex", gap: "var(--kls-space-xsmall)", marginTop: "var(--kls-space-tiny)"}}>
          <Pill variant="violet">Premium</Pill>
          <Pill variant="green">Verified</Pill>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>
        <ListRow avatar={<Icon name="clipboard-document-list" size={22} color="var(--kls-on-surface)" />} title="Exam logs" sub="42 sessions · last today" />
        <ListRow avatar={<Icon name="archive-box" size={22} color="var(--kls-on-surface)" />} title="Library" sub="6 saved tests" />
        <ListRow avatar={<Icon name="bell" size={22} color="var(--kls-on-surface)" />} title="Notifications" sub="Push, email" />
        <ListRow avatar={<Icon name="lock-closed" size={22} color="var(--kls-on-surface)" />} title="Privacy & data" sub="Manage permissions" />
        <ListRow avatar={<Icon name="question-mark-circle" size={22} color="var(--kls-on-surface)" />} title="Help" sub="Guides, contact" last />
      </div>
      <div style={{ padding: "var(--kls-space-med)"}}>
        <Button variant="destructive" size="lg" leadingIcon="arrow-left-end-on-rectangle">Sign out</Button>
      </div>
    </div>
  );
}

window.KLS_SCREENS = { HomeScreen, ExamListScreen, CalibrationScreen, ProfileScreen };
