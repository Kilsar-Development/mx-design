// Shared release-note data for Web App + Mobile App. Newest first; [0] is the current release.
window.MX_RELEASES = [
  { version: "2.16.5", date: "Oct 14, 2026", summary: "Simulators arrive in Training and can now be assigned from Control Tower.",
    sections: [
      { kind: "New", items: ["Training tab with eight interactive simulators: Six-Pack, Turbocharger, Vapor Cycle, Circuit Trainer, Logic Gate, Four-Stroke Cycle, Micrometer and Propeller Protractor.", "Simulator assignment type in Control Tower. Instructors pick one or more simulators per assignment.", "Release notes are viewable in-app from the version number."] },
      { kind: "Improved", items: ["New and Edit Assignment drawers are wider so simulator previews and topic lists fit without scrolling.", "Type colors are consistent between the assignment drawer and the Control Tower lists."] },
      { kind: "Fixed", items: ["Simulator allocations no longer show a Term row.", "Control Tower crashed when a workspace contained a Simulator assignment."] },
    ] },
  { version: "2.16.4", date: "Sep 30, 2026", summary: "Student Oral Exams setup on web and mobile.",
    sections: [
      { kind: "New", items: ["Students can set up an Oral Exam: pick topics or mix ACS codes, choose Speak or Write, set difficulty and question count.", "Exam Logs list and per-question review for oral exams."] },
      { kind: "Improved", items: ["Instructor Oral Exams view: Calibrate button icon and selected-row tint corrected.", "Assignment column added to Exam Logs on both platforms."] },
    ] },
  { version: "2.16.3", date: "Sep 9, 2026", summary: "Written Exams history and progress.",
    sections: [
      { kind: "New", items: ["History tab with attempt summaries and per-question review.", "Progress dashboard with mastery by module and a jump-to-weak-area shortcut."] },
      { kind: "Fixed", items: ["Question timer no longer resets when the app is backgrounded on iOS.", "Pre-exam sheet could be dismissed without confirming on small screens."] },
    ] },
  { version: "2.16.2", date: "Aug 19, 2026", summary: "Team Workspace drawers and the Teammate Picker.",
    sections: [
      { kind: "New", items: ["Member and group drawers with view and edit modes.", "Teammate Picker inside the Assign flow, with group selection as a single entity."] },
      { kind: "Improved", items: ["Swipe-to-delete on mobile member rows.", "Help & Feedback dialog reachable from the sidebar and the profile menu."] },
    ] },
  { version: "2.16.1", date: "Jul 29, 2026", summary: "Control Tower launch.",
    sections: [
      { kind: "New", items: ["Control Tower for instructors: assignments, allocations, progress and overdue tracking.", "Student Control Tower with grouped assignment sections."] },
      { kind: "Fixed", items: ["Dark theme contrast on secondary buttons.", "Sidebar collapse state persists between sessions."] },
    ] },
];
