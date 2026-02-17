// SocialOS — Local Storage Service
// All persistence is localStorage-based. No cloud backend.

const PREFIX = "socialos-";

// ─── Generated Scenarios ────────────────────────────────────────────
export function getGeneratedScenarios() {
  return JSON.parse(localStorage.getItem(PREFIX + "generated-scenarios") || "{}");
}

export function saveGeneratedScenario(chapterId, scenario) {
  const all = getGeneratedScenarios();
  if (!all[chapterId]) all[chapterId] = [];
  // Avoid duplicates by id
  if (!all[chapterId].find(s => s.id === scenario.id)) {
    all[chapterId].push(scenario);
  }
  localStorage.setItem(PREFIX + "generated-scenarios", JSON.stringify(all));
  return all;
}

export function removeGeneratedScenario(chapterId, scenarioId) {
  const all = getGeneratedScenarios();
  if (all[chapterId]) {
    all[chapterId] = all[chapterId].filter(s => s.id !== scenarioId);
    if (all[chapterId].length === 0) delete all[chapterId];
  }
  localStorage.setItem(PREFIX + "generated-scenarios", JSON.stringify(all));
  return all;
}

export function clearGeneratedScenarios() {
  localStorage.removeItem(PREFIX + "generated-scenarios");
}

// ─── Parent Notes ───────────────────────────────────────────────────
export function getParentNotes() {
  return JSON.parse(localStorage.getItem(PREFIX + "parent-notes") || "[]");
}

export function addParentNote(note) {
  const notes = getParentNotes();
  notes.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    text: note,
    created: new Date().toISOString(),
  });
  localStorage.setItem(PREFIX + "parent-notes", JSON.stringify(notes));
  return notes;
}

export function removeParentNote(noteId) {
  const notes = getParentNotes().filter(n => n.id !== noteId);
  localStorage.setItem(PREFIX + "parent-notes", JSON.stringify(notes));
  return notes;
}

// ─── Assigned Scenarios ─────────────────────────────────────────────
export function getAssignedScenarios() {
  return JSON.parse(localStorage.getItem(PREFIX + "assigned-scenarios") || "[]");
}

export function assignScenario(scenarioId, chapterId, note = "") {
  const list = getAssignedScenarios();
  if (!list.find(a => a.scenarioId === scenarioId)) {
    list.push({
      scenarioId,
      chapterId,
      note,
      assignedAt: new Date().toISOString(),
      completed: false,
    });
  }
  localStorage.setItem(PREFIX + "assigned-scenarios", JSON.stringify(list));
  return list;
}

export function completeAssignment(scenarioId) {
  const list = getAssignedScenarios().map(a =>
    a.scenarioId === scenarioId ? { ...a, completed: true, completedAt: new Date().toISOString() } : a
  );
  localStorage.setItem(PREFIX + "assigned-scenarios", JSON.stringify(list));
  return list;
}

export function removeAssignment(scenarioId) {
  const list = getAssignedScenarios().filter(a => a.scenarioId !== scenarioId);
  localStorage.setItem(PREFIX + "assigned-scenarios", JSON.stringify(list));
  return list;
}

// ─── Session History ────────────────────────────────────────────────
export function getSessionHistory() {
  return JSON.parse(localStorage.getItem(PREFIX + "session-history") || "[]");
}

export function logSession(scenarioId, scenarioTitle, choices, statusDelta, reputationTags) {
  const history = getSessionHistory();
  history.push({
    id: Date.now().toString(36),
    scenarioId,
    scenarioTitle,
    choices: choices.map(c => ({
      text: c.text,
      signals: c.signals,
      status_impact: c.status_impact,
      reputation_tag: c.reputation_tag,
    })),
    statusDelta,
    reputationTags,
    timestamp: new Date().toISOString(),
  });
  // Keep last 100 sessions
  if (history.length > 100) history.shift();
  localStorage.setItem(PREFIX + "session-history", JSON.stringify(history));
  return history;
}

// ─── Parent Dashboard Access ────────────────────────────────────────
const PARENT_PIN = PREFIX + "parent-pin";

export function hasParentPin() {
  return !!localStorage.getItem(PARENT_PIN);
}

export function setParentPin(pin) {
  localStorage.setItem(PARENT_PIN, pin);
}

export function checkParentPin(pin) {
  return localStorage.getItem(PARENT_PIN) === pin;
}
