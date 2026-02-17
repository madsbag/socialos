import { useState, useEffect } from "react";
import { theme } from "../theme";
import { SCENARIOS } from "../data/scenarios";
import {
  getSessionHistory,
  getParentNotes,
  addParentNote,
  removeParentNote,
  getAssignedScenarios,
  assignScenario,
  removeAssignment,
  hasParentPin,
  setParentPin,
  checkParentPin,
} from "../services/storage";

// ─── Parent Dashboard ─────────────────────────────────────────────────
export default function ParentDashboard({ onClose, playerStats }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [isSettingPin, setIsSettingPin] = useState(!hasParentPin());
  const [tab, setTab] = useState("overview");
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [sessions, setSessions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [assignModal, setAssignModal] = useState(null);
  const [assignNote, setAssignNote] = useState("");

  useEffect(() => {
    setNotes(getParentNotes());
    setSessions(getSessionHistory());
    setAssignments(getAssignedScenarios());
  }, [authenticated]);

  // ─── PIN Auth ───────────────────────────────────────────────────
  function handlePinSubmit(e) {
    e.preventDefault();
    if (pinInput.length < 4) {
      setPinError("PIN must be at least 4 digits");
      return;
    }
    if (isSettingPin) {
      setParentPin(pinInput);
      setIsSettingPin(false);
      setAuthenticated(true);
      setPinInput("");
    } else {
      if (checkParentPin(pinInput)) {
        setAuthenticated(true);
        setPinInput("");
        setPinError("");
      } else {
        setPinError("Incorrect PIN");
        setPinInput("");
      }
    }
  }

  // ─── Notes ──────────────────────────────────────────────────────
  function handleAddNote() {
    if (!newNote.trim()) return;
    const updated = addParentNote(newNote.trim());
    setNotes(updated);
    setNewNote("");
  }

  function handleRemoveNote(noteId) {
    const updated = removeParentNote(noteId);
    setNotes(updated);
  }

  // ─── Assignments ────────────────────────────────────────────────
  function handleAssign(scenarioId, chapterId) {
    const updated = assignScenario(scenarioId, chapterId, assignNote);
    setAssignments(updated);
    setAssignModal(null);
    setAssignNote("");
  }

  function handleRemoveAssignment(scenarioId) {
    const updated = removeAssignment(scenarioId);
    setAssignments(updated);
  }

  // ─── All Scenarios flat list ────────────────────────────────────
  function getAllScenarios() {
    const all = [];
    Object.entries(SCENARIOS).forEach(([levelId, level]) => {
      Object.entries(level.chapters).forEach(([chId, ch]) => {
        (ch.scenarios || []).forEach(sc => {
          all.push({ ...sc, chapterId: chId, levelId, chapterTitle: ch.title });
        });
      });
    });
    return all;
  }

  // ─── PIN Screen ─────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div style={{
        minHeight: "100vh",
        background: theme.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
        fontFamily: theme.fontFamily,
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 20, right: 24,
            background: "none", border: "none",
            fontSize: 14, fontWeight: 600,
            color: theme.textMuted, cursor: "pointer",
            fontFamily: theme.fontFamily,
          }}
        >
          Back
        </button>

        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: `${theme.purple}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, marginBottom: 24,
        }}>
          {"🔒"}
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: theme.textPrimary }}>
          {isSettingPin ? "Set Parent PIN" : "Parent Dashboard"}
        </h2>
        <p style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 24, textAlign: "center", maxWidth: 300 }}>
          {isSettingPin
            ? "Create a 4+ digit PIN to protect the parent dashboard"
            : "Enter your PIN to access the dashboard"
          }
        </p>

        <form onSubmit={handlePinSubmit} style={{ width: "100%", maxWidth: 280 }}>
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            value={pinInput}
            onChange={e => { setPinInput(e.target.value.replace(/\D/g, "")); setPinError(""); }}
            placeholder="Enter PIN"
            autoFocus
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: theme.radiusMd,
              border: `2px solid ${pinError ? theme.danger : theme.border}`,
              background: theme.surface,
              fontSize: 24,
              fontWeight: 700,
              textAlign: "center",
              letterSpacing: 8,
              color: theme.textPrimary,
              fontFamily: theme.fontFamily,
              outline: "none",
            }}
          />
          {pinError && (
            <div style={{ fontSize: 13, color: theme.danger, textAlign: "center", marginTop: 8, fontWeight: 600 }}>
              {pinError}
            </div>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: 16,
              padding: "14px 20px",
              borderRadius: theme.radiusMd,
              background: theme.purple,
              border: "none",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: theme.fontFamily,
              boxShadow: `0 4px 12px ${theme.purple}30`,
            }}
          >
            {isSettingPin ? "Set PIN" : "Unlock"}
          </button>
        </form>
      </div>
    );
  }

  // ─── Dashboard ──────────────────────────────────────────────────
  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "history", label: "Session Log" },
    { id: "assign", label: "Assign" },
    { id: "notes", label: "Notes" },
  ];

  const allScenarios = getAllScenarios();
  const completedCount = playerStats.completedScenarios?.length || 0;
  const totalScenarios = allScenarios.length;

  // Compute patterns from session history
  const recentSessions = sessions.slice(-20);
  const avgStatus = recentSessions.length > 0
    ? (recentSessions.reduce((sum, s) => sum + s.statusDelta, 0) / recentSessions.length).toFixed(1)
    : "N/A";
  const tagCounts = {};
  sessions.forEach(s => {
    (s.reputationTags || []).forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.bg,
      fontFamily: theme.fontFamily,
    }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: `${theme.bg}ee`,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${theme.border}`,
        padding: "12px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18, color: theme.purple }}>{"🔒"}</span>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1, color: theme.textPrimary }}>
            Parent <span style={{ color: theme.purple }}>Dashboard</span>
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: theme.surface, border: `1px solid ${theme.border}`,
            padding: "8px 16px", borderRadius: theme.radiusMd,
            fontSize: 13, fontWeight: 700, color: theme.textSecondary,
            cursor: "pointer", fontFamily: theme.fontFamily,
          }}
        >
          {"←"} Back to App
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 4,
        padding: "12px 24px 0",
        borderBottom: `1px solid ${theme.border}`,
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "10px 18px",
              borderRadius: `${theme.radiusSm}px ${theme.radiusSm}px 0 0`,
              border: "none",
              borderBottom: tab === t.id ? `3px solid ${theme.purple}` : "3px solid transparent",
              background: tab === t.id ? `${theme.purple}08` : "transparent",
              color: tab === t.id ? theme.purple : theme.textSecondary,
              fontSize: 14, fontWeight: 700,
              cursor: "pointer",
              fontFamily: theme.fontFamily,
              transition: "all 0.2s ease",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 20px 80px" }}>

        {/* ─── OVERVIEW TAB ─── */}
        {tab === "overview" && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Player Progress</h2>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
              <DashCard label="Energy" value={`${playerStats.energy}/100`} color={theme.accent} />
              <DashCard label="Total XP" value={playerStats.xp} color={theme.xp} />
              <DashCard label="Status" value={playerStats.statusScore >= 0 ? `+${playerStats.statusScore}` : playerStats.statusScore} color={playerStats.statusScore >= 0 ? theme.accent : theme.danger} />
              <DashCard label="Completed" value={`${completedCount}/${totalScenarios}`} color={theme.info} />
              <DashCard label="Sessions" value={sessions.length} color={theme.purple} />
              <DashCard label="Avg Status/Session" value={avgStatus} color={parseFloat(avgStatus) >= 0 ? theme.accent : theme.danger} />
            </div>

            {/* Reputation Analysis */}
            {topTags.length > 0 && (
              <div style={{
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: theme.radiusMd,
                padding: "20px 24px",
                marginBottom: 16,
                boxShadow: theme.shadow,
              }}>
                <div style={{ fontSize: 11, color: theme.purple, letterSpacing: 2, marginBottom: 12, fontWeight: 700 }}>
                  REPUTATION PATTERN ANALYSIS
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {topTags.map(([tag, count]) => (
                    <div key={tag} style={{
                      padding: "8px 14px",
                      borderRadius: 20,
                      background: `${theme.purple}10`,
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: theme.purple }}>{tag}</span>
                      <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 600 }}>{"×"}{count}</span>
                    </div>
                  ))}
                </div>
                {topTags.length > 0 && (
                  <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 12, lineHeight: 1.6 }}>
                    {topTags[0][1] > 3
                      ? `Dominant pattern: "${topTags[0][0]}" — appearing ${topTags[0][1]} times across sessions.`
                      : "Still gathering pattern data. More sessions needed for reliable analysis."
                    }
                  </div>
                )}
              </div>
            )}

            {/* Active Assignments */}
            {assignments.filter(a => !a.completed).length > 0 && (
              <div style={{
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: theme.radiusMd,
                padding: "20px 24px",
                boxShadow: theme.shadow,
              }}>
                <div style={{ fontSize: 11, color: theme.info, letterSpacing: 2, marginBottom: 12, fontWeight: 700 }}>
                  ACTIVE ASSIGNMENTS
                </div>
                {assignments.filter(a => !a.completed).map(a => {
                  const sc = allScenarios.find(s => s.id === a.scenarioId);
                  return (
                    <div key={a.scenarioId} style={{
                      padding: "10px 0",
                      borderBottom: `1px solid ${theme.border}`,
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{sc?.title || a.scenarioId}</div>
                        {a.note && <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 2 }}>{a.note}</div>}
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: theme.warning,
                        padding: "4px 10px", borderRadius: 20, background: `${theme.warning}12`,
                      }}>PENDING</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── SESSION HISTORY TAB ─── */}
        {tab === "history" && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Session History</h2>
            {sessions.length === 0 ? (
              <div style={{
                padding: "40px 24px",
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: theme.radiusMd,
                textAlign: "center",
                color: theme.textMuted,
                fontSize: 15,
              }}>
                No sessions recorded yet. Sessions will appear here as your child practices scenarios.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[...sessions].reverse().map(session => (
                  <div key={session.id} style={{
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: theme.radiusMd,
                    padding: "16px 20px",
                    boxShadow: theme.shadow,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>{session.scenarioTitle}</div>
                        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
                          {new Date(session.timestamp).toLocaleDateString()} at {new Date(session.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 16, fontWeight: 800,
                        color: session.statusDelta >= 0 ? theme.accent : theme.danger,
                      }}>
                        {session.statusDelta > 0 ? "+" : ""}{session.statusDelta}
                      </span>
                    </div>
                    {/* Choices */}
                    <div style={{ marginTop: 12 }}>
                      {session.choices.map((c, i) => (
                        <div key={i} style={{
                          fontSize: 13, color: theme.textSecondary, lineHeight: 1.6,
                          padding: "6px 0",
                          borderTop: i > 0 ? `1px solid ${theme.borderLight}` : "none",
                        }}>
                          <span style={{ fontWeight: 700, color: theme.textMuted, marginRight: 6 }}>D{i + 1}:</span>
                          {c.text}
                          <span style={{
                            marginLeft: 8, fontSize: 11, fontWeight: 600,
                            color: c.status_impact >= 0 ? theme.accent : theme.danger,
                          }}>
                            ({c.status_impact > 0 ? "+" : ""}{c.status_impact})
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Tags */}
                    {session.reputationTags?.length > 0 && (
                      <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {session.reputationTags.map((t, i) => (
                          <span key={i} style={{
                            fontSize: 11, padding: "3px 10px", borderRadius: 20,
                            background: `${theme.purple}10`, color: theme.purple, fontWeight: 600,
                          }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── ASSIGN TAB ─── */}
        {tab === "assign" && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Assign Scenarios</h2>
            <p style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 20 }}>
              Select scenarios to assign for your child to practice. They will see assigned scenarios highlighted.
            </p>

            {/* Active Assignments */}
            {assignments.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: theme.purple, letterSpacing: 2, marginBottom: 10, fontWeight: 700 }}>
                  CURRENT ASSIGNMENTS
                </div>
                {assignments.map(a => {
                  const sc = allScenarios.find(s => s.id === a.scenarioId);
                  return (
                    <div key={a.scenarioId} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "12px 16px", marginBottom: 6,
                      background: theme.surface,
                      border: `1px solid ${a.completed ? theme.accent + "30" : theme.border}`,
                      borderRadius: theme.radiusSm,
                    }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>
                          {a.completed && <span style={{ color: theme.accent, marginRight: 6 }}>{"✓"}</span>}
                          {sc?.title || a.scenarioId}
                        </div>
                        {a.note && <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{a.note}</div>}
                      </div>
                      <button
                        onClick={() => handleRemoveAssignment(a.scenarioId)}
                        style={{
                          background: "none", border: "none",
                          color: theme.danger, fontSize: 18, cursor: "pointer",
                          padding: "4px 8px", fontFamily: theme.fontFamily,
                        }}
                      >{"×"}</button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Scenario Picker */}
            <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, marginBottom: 10, fontWeight: 700 }}>
              ALL SCENARIOS
            </div>
            {allScenarios.map(sc => {
              const isAssigned = assignments.some(a => a.scenarioId === sc.id);
              const isDone = playerStats.completedScenarios?.includes(sc.id);
              return (
                <div key={sc.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 16px", marginBottom: 6,
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: theme.radiusSm,
                  opacity: isAssigned ? 0.5 : 1,
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>
                      {isDone && <span style={{ color: theme.accent, marginRight: 6 }}>{"✓"}</span>}
                      {sc.title}
                    </div>
                    <div style={{ fontSize: 12, color: theme.textMuted }}>{sc.chapterTitle}</div>
                  </div>
                  {!isAssigned ? (
                    <button
                      onClick={() => setAssignModal(sc)}
                      style={{
                        background: `${theme.purple}10`, border: `1px solid ${theme.purple}30`,
                        color: theme.purple, fontSize: 12, fontWeight: 700,
                        padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                        fontFamily: theme.fontFamily,
                      }}
                    >
                      Assign
                    </button>
                  ) : (
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: theme.textMuted,
                      padding: "4px 10px", borderRadius: 20, background: theme.border,
                    }}>Assigned</span>
                  )}
                </div>
              );
            })}

            {/* Assign Modal */}
            {assignModal && (
              <div style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 100,
              }} onClick={() => setAssignModal(null)}>
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    background: theme.surface,
                    borderRadius: theme.radiusMd,
                    padding: "24px 28px",
                    maxWidth: 400,
                    width: "90%",
                    boxShadow: theme.shadowLg,
                  }}
                >
                  <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
                    Assign: {assignModal.title}
                  </h3>
                  <p style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 16 }}>
                    Add an optional note for your child
                  </p>
                  <input
                    type="text"
                    value={assignNote}
                    onChange={e => setAssignNote(e.target.value)}
                    placeholder="e.g., Try the strategic approach this time"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: theme.radiusSm,
                      border: `1px solid ${theme.border}`,
                      background: theme.bg,
                      fontSize: 14,
                      color: theme.textPrimary,
                      fontFamily: theme.fontFamily,
                      outline: "none",
                      marginBottom: 16,
                    }}
                  />
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => setAssignModal(null)}
                      style={{
                        flex: 1, padding: "12px", borderRadius: theme.radiusSm,
                        background: "transparent", border: `1px solid ${theme.border}`,
                        color: theme.textSecondary, fontSize: 14, fontWeight: 700,
                        cursor: "pointer", fontFamily: theme.fontFamily,
                      }}
                    >Cancel</button>
                    <button
                      onClick={() => handleAssign(assignModal.id, assignModal.chapterId)}
                      style={{
                        flex: 1, padding: "12px", borderRadius: theme.radiusSm,
                        background: theme.purple, border: "none",
                        color: "#fff", fontSize: 14, fontWeight: 700,
                        cursor: "pointer", fontFamily: theme.fontFamily,
                      }}
                    >Assign</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── NOTES TAB ─── */}
        {tab === "notes" && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Coaching Notes</h2>
            <p style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 20 }}>
              Private notes for tracking observations, strategies, or things to discuss.
            </p>

            {/* Add Note */}
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              <input
                type="text"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAddNote()}
                placeholder="Add a coaching note..."
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: theme.radiusMd,
                  border: `1px solid ${theme.border}`,
                  background: theme.surface,
                  fontSize: 14,
                  color: theme.textPrimary,
                  fontFamily: theme.fontFamily,
                  outline: "none",
                }}
              />
              <button
                onClick={handleAddNote}
                style={{
                  padding: "12px 20px",
                  borderRadius: theme.radiusMd,
                  background: theme.purple,
                  border: "none",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: theme.fontFamily,
                }}
              >Add</button>
            </div>

            {/* Note List */}
            {notes.length === 0 ? (
              <div style={{
                padding: "40px 24px",
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: theme.radiusMd,
                textAlign: "center",
                color: theme.textMuted,
                fontSize: 15,
              }}>
                No notes yet. Add observations or reminders above.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[...notes].reverse().map(note => (
                  <div key={note.id} style={{
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: theme.radiusSm,
                    padding: "14px 18px",
                    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                    gap: 12,
                  }}>
                    <div>
                      <div style={{ fontSize: 15, lineHeight: 1.6, color: theme.textPrimary }}>{note.text}</div>
                      <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>
                        {new Date(note.created).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveNote(note.id)}
                      style={{
                        background: "none", border: "none",
                        color: theme.textMuted, fontSize: 16, cursor: "pointer",
                        padding: "2px 6px", flexShrink: 0,
                      }}
                    >{"×"}</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Helper Components ────────────────────────────────────────────
function DashCard({ label, value, color }) {
  return (
    <div style={{
      background: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: theme.radiusMd,
      padding: "16px",
      textAlign: "center",
      boxShadow: theme.shadow,
    }}>
      <div style={{ fontSize: 10, color: theme.textMuted, letterSpacing: 1, fontWeight: 700, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}
