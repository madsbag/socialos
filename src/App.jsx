import { useState, useEffect, useRef } from "react";
import { theme, LEVEL_ICONS } from "./theme";
import { SCENARIOS } from "./data/scenarios";
import { FLASHCARDS } from "./data/flashcards";
import OnboardingScreen from "./components/OnboardingScreen";
import SwipeDeck from "./components/SwipeDeck";
import ParentDashboard from "./components/ParentDashboard";
import { generateScenario, canGenerateForChapter } from "./services/scenarioGenerator";
import {
  getGeneratedScenarios,
  saveGeneratedScenario,
  removeGeneratedScenario,
  logSession,
  getAssignedScenarios,
  completeAssignment,
} from "./services/storage";

// ─── MAIN APP ─────────────────────────────────────────────────────────
export default function SocialOS() {
  const [screen, setScreen] = useState("home");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [choiceHistory, setChoiceHistory] = useState([]);
  const [lastOutcome, setLastOutcome] = useState(null);
  const [showSignals, setShowSignals] = useState(false);
  const [emotionGuess, setEmotionGuess] = useState(null);
  const [emotionFeedback, setEmotionFeedback] = useState(null);
  const [animatingChoice, setAnimatingChoice] = useState(null);
  const [energy, setEnergy] = useState(
    () => {
      const saved = localStorage.getItem("socialos-energy");
      return saved !== null ? JSON.parse(saved) : 100;
    }
  );
  const [xp, setXp] = useState(
    () => {
      const saved = localStorage.getItem("socialos-xp");
      return saved !== null ? JSON.parse(saved) : 0;
    }
  );
  const [statusScore, setStatusScore] = useState(
    () => {
      const saved = localStorage.getItem("socialos-status");
      return saved !== null ? JSON.parse(saved) : 0;
    }
  );
  const [reputation, setReputation] = useState(
    () => JSON.parse(localStorage.getItem("socialos-reputation") || "{}")
  );
  const [completedScenarios, setCompletedScenarios] = useState(
    () => JSON.parse(localStorage.getItem("socialos-completed") || "[]")
  );
  const [debriefText, setDebriefText] = useState("");
  const [debriefLoading, setDebriefLoading] = useState(false);

  // Phase 2 — Generated scenarios & parent dashboard
  const [generatedScenarios, setGeneratedScenarios] = useState(() => getGeneratedScenarios());
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);
  const [assignments, setAssignments] = useState(() => getAssignedScenarios());

  // Persist game state to localStorage
  useEffect(() => { localStorage.setItem("socialos-energy", JSON.stringify(energy)); }, [energy]);
  useEffect(() => { localStorage.setItem("socialos-xp", JSON.stringify(xp)); }, [xp]);
  useEffect(() => { localStorage.setItem("socialos-status", JSON.stringify(statusScore)); }, [statusScore]);
  useEffect(() => { localStorage.setItem("socialos-reputation", JSON.stringify(reputation)); }, [reputation]);
  useEffect(() => { localStorage.setItem("socialos-completed", JSON.stringify(completedScenarios)); }, [completedScenarios]);
  const [fadeIn, setFadeIn] = useState(false);
  const scrollRef = useRef(null);

  // Onboarding
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(
    () => localStorage.getItem("socialos-onboarding-seen") === "true"
  );

  // Flashcard progress: { "ch-1": 3, "ch-2": 1, ... }
  const [flashcardProgress, setFlashcardProgress] = useState(
    () => JSON.parse(localStorage.getItem("socialos-flashcard-progress") || "{}")
  );

  useEffect(() => {
    if (!hasSeenOnboarding) setScreen("onboarding");
  }, []);

  useEffect(() => {
    setFadeIn(false);
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, [screen, selectedScenario, currentTurn]);

  const scenarioStatus = choiceHistory.reduce((sum, c) => sum + (c.status_impact || 0), 0);
  const totalStatus = statusScore + scenarioStatus;

  // ─── NAVIGATION ──────────────────────────────────────────────────
  function goHome() {
    setScreen("home");
    setSelectedLevel(null);
    setSelectedChapter(null);
    setSelectedScenario(null);
    setCurrentTurn(0);
    setChoiceHistory([]);
    setLastOutcome(null);
    setShowSignals(false);
    setEmotionGuess(null);
    setEmotionFeedback(null);
  }

  function openLevel(levelId) {
    setSelectedLevel(levelId);
    setScreen("levels");
  }

  function openChapter(chapterId) {
    setSelectedChapter(chapterId);
    setScreen("chapter");
  }

  function openFlashcards(chapterId) {
    setSelectedChapter(chapterId);
    setScreen("flashcards");
  }

  function completeFlashcards(chapterId, totalCards) {
    setFlashcardProgress(prev => {
      const updated = { ...prev, [chapterId]: totalCards };
      localStorage.setItem("socialos-flashcard-progress", JSON.stringify(updated));
      return updated;
    });
    setScreen("chapter");
  }

  function completeOnboarding() {
    localStorage.setItem("socialos-onboarding-seen", "true");
    setHasSeenOnboarding(true);
    setScreen("home");
  }

  function startScenario(scenario) {
    if (energy < scenario.energy_cost) return;
    setSelectedScenario(scenario);
    setCurrentTurn(0);
    setChoiceHistory([]);
    setLastOutcome(null);
    setShowSignals(false);
    setEmotionGuess(null);
    setEmotionFeedback(null);
    setScreen("scenario");
  }

  function makeChoice(choice) {
    setAnimatingChoice(choice.text);
    setShowSignals(false);
    setTimeout(() => {
      setAnimatingChoice(null);
      setChoiceHistory(prev => [...prev, choice]);
      setLastOutcome(choice.outcome);
      const nextTurn = currentTurn + 1;
      if (nextTurn < selectedScenario.turns.length) {
        setCurrentTurn(nextTurn);
        setEmotionGuess(null);
        setEmotionFeedback(null);
      } else {
        finishScenario(choice);
      }
    }, 600);
  }

  async function finishScenario(lastChoice) {
    const allChoices = [...choiceHistory, lastChoice];
    setEnergy(prev => Math.max(0, prev - selectedScenario.energy_cost));
    setXp(prev => prev + selectedScenario.xp_reward);
    // Accumulate status from all choices in this scenario
    const scenarioStatusDelta = allChoices.reduce((sum, c) => sum + (c.status_impact || 0), 0);
    setStatusScore(prev => prev + scenarioStatusDelta);
    // Collect all reputation tags from this scenario
    const scenarioTags = [];
    allChoices.forEach(c => {
      if (c.reputation_tag) {
        scenarioTags.push(c.reputation_tag);
        setReputation(prev => ({ ...prev, [c.reputation_tag]: (prev[c.reputation_tag] || 0) + 1 }));
      }
    });
    setCompletedScenarios(prev =>
      prev.includes(selectedScenario.id) ? prev : [...prev, selectedScenario.id]
    );
    // Log session for parent dashboard
    logSession(
      selectedScenario.id,
      selectedScenario.title,
      allChoices,
      scenarioStatusDelta,
      scenarioTags
    );
    // Complete assignment if this scenario was assigned
    if (assignments.some(a => a.scenarioId === selectedScenario.id && !a.completed)) {
      completeAssignment(selectedScenario.id);
      setAssignments(getAssignedScenarios());
    }
    setScreen("debrief");
    await generateDebrief(allChoices);
  }

  async function generateDebrief(allChoices) {
    setDebriefLoading(true);
    const prompt = buildDebriefPrompt(allChoices);
    try {
      const key = import.meta.env.VITE_ANTHROPIC_API_KEY;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are the analytical coach in SocialOS, a social intelligence training system designed for people with ASD who think analytically. Your job is to debrief a scenario the player just completed.

Your style:
- Analytical, not emotional. Think game strategy guide, not therapy session.
- Use pattern recognition language: "The signal you sent was...", "The dynamic at play was..."
- Be direct about what worked and what didn't \u2014 no sugarcoating, but also no judgment
- Frame social interactions as systems with inputs and outputs
- Reference the specific choices they made
- End with one concrete "pattern to remember" they can use in real life
- Keep it to 3-4 paragraphs max
- Use "you" to address the player directly`,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "Debrief unavailable.";
      setDebriefText(text);
    } catch {
      setDebriefText("Couldn't generate debrief right now. Here's what happened: you made " + allChoices.length + " decisions with a net status impact of " + allChoices.reduce((s, c) => s + (c.status_impact || 0), 0) + ".");
    }
    setDebriefLoading(false);
  }

  function buildDebriefPrompt(allChoices) {
    const scenario = selectedScenario;
    let prompt = `SCENARIO: "${scenario.title}"\nSETUP: ${scenario.setup}\nCHARACTERS: ${scenario.characters.join(", ")}\nSOCIAL CONTEXT: ${scenario.social_context}\n\nPLAYER'S CHOICES:\n`;
    allChoices.forEach((c, i) => {
      prompt += `\nDecision ${i + 1}: "${c.text}"\n- Signals sent: ${c.signals.join(", ")}\n- Status impact: ${c.status_impact > 0 ? "+" : ""}${c.status_impact}\n- Reputation tag: ${c.reputation_tag || "none"}\n`;
    });
    prompt += `\nTotal status change: ${allChoices.reduce((s, c) => s + (c.status_impact || 0), 0)}`;
    prompt += `\n\nProvide the analytical debrief. What social dynamics were at play? What did each choice signal to others? What was the optimal path and why? What pattern should they remember?`;
    return prompt;
  }

  // ─── DYNAMIC SCENARIO GENERATION ─────────────────────────────────
  async function handleGenerateScenario(chapterId) {
    setGenerating(true);
    setGenerateError(null);
    try {
      // Get existing titles to avoid duplicates
      const ch = getChapterFromId(chapterId);
      const existingTitles = [
        ...(ch?.scenarios || []).map(s => s.title),
        ...(generatedScenarios[chapterId] || []).map(s => s.title),
      ];
      const scenario = await generateScenario(chapterId, existingTitles);
      const updated = saveGeneratedScenario(chapterId, scenario);
      setGeneratedScenarios(updated);
    } catch (err) {
      setGenerateError(err.message);
    }
    setGenerating(false);
  }

  function handleRemoveGenerated(chapterId, scenarioId) {
    const updated = removeGeneratedScenario(chapterId, scenarioId);
    setGeneratedScenarios(updated);
  }

  function getChapterFromId(chapterId) {
    for (const level of Object.values(SCENARIOS)) {
      if (level.chapters[chapterId]) return level.chapters[chapterId];
    }
    return null;
  }

  // ─── GET CURRENT TURN DATA ──────────────────────────────────────
  function getCurrentChoices() {
    if (!selectedScenario) return [];
    const turn = selectedScenario.turns[currentTurn];
    if (!turn) return [];
    if (currentTurn === 0) return turn.choices;
    if (turn.choices_by_outcome && lastOutcome) {
      return turn.choices_by_outcome[lastOutcome] || [];
    }
    return turn.choices || [];
  }

  function getCurrentSituation() {
    if (!selectedScenario) return "";
    const turn = selectedScenario.turns[currentTurn];
    if (!turn) return "";
    if (currentTurn === 0) return turn.situation;
    if (turn.situation_by_outcome && lastOutcome) {
      return turn.situation_by_outcome[lastOutcome] || "";
    }
    return turn.situation || "";
  }

  function getCurrentEmotionGuess() {
    if (!selectedScenario) return null;
    const turn = selectedScenario.turns[currentTurn];
    return turn?.emotion_guess || null;
  }

  function rechargeEnergy() {
    setEnergy(100);
  }

  function resetAllProgress() {
    setEnergy(100);
    setXp(0);
    setStatusScore(0);
    setReputation({});
    setCompletedScenarios([]);
    setFlashcardProgress({});
    localStorage.removeItem("socialos-flashcard-progress");
    localStorage.removeItem("socialos-onboarding-seen");
    setHasSeenOnboarding(false);
    setScreen("onboarding");
  }

  // ─── RENDER ─────────────────────────────────────────────────────
  const levelEntries = Object.entries(SCENARIOS);

  // Parent dashboard
  if (screen === "parent") {
    return (
      <ParentDashboard
        onClose={goHome}
        playerStats={{
          energy,
          xp,
          statusScore,
          reputation,
          completedScenarios,
          flashcardProgress,
        }}
      />
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.bg,
      color: theme.textPrimary,
      fontFamily: theme.fontFamily,
      position: "relative",
    }}>
      {/* ─── ONBOARDING ─── */}
      {screen === "onboarding" && (
        <OnboardingScreen onComplete={completeOnboarding} />
      )}

      {/* ─── MAIN APP ─── */}
      {screen !== "onboarding" && (
        <>
          {/* Header bar */}
          <div style={{
            position: "sticky", top: 0, zIndex: 50,
            background: `${theme.bg}ee`,
            backdropFilter: "blur(12px)",
            borderBottom: `1px solid ${theme.border}`,
            padding: "12px 24px",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={goHome}>
              <span style={{ fontSize: 22, color: theme.accent }}>&#9678;</span>
              <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1, color: theme.textPrimary }}>
                Social<span style={{ color: theme.accent }}>OS</span>
              </span>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 12, alignItems: "center" }}>
              <StatPill label="ENERGY" value={energy} max={100} color={theme.accent} />
              <StatPill label="XP" value={xp} color={theme.xp} />
              <StatPill label="STATUS" value={totalStatus} color={totalStatus >= 0 ? theme.info : theme.danger} showSign />
              <button
                onClick={() => { setHasSeenOnboarding(true); setScreen("onboarding"); }}
                title="How to play"
                style={{
                  background: theme.border,
                  border: "none",
                  width: 28, height: 28,
                  borderRadius: "50%",
                  fontSize: 14, fontWeight: 700,
                  color: theme.textSecondary,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: theme.fontFamily,
                }}
              >
                ?
              </button>
            </div>
          </div>

          {/* Content */}
          <div ref={scrollRef} style={{
            maxWidth: 800, margin: "0 auto", padding: "32px 20px 80px",
            position: "relative", zIndex: 1,
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.3s ease, transform 0.3s ease"
          }}>

            {/* ─── HOME SCREEN ─── */}
            {screen === "home" && (
              <div>
                <div style={{ textAlign: "center", marginBottom: 44 }}>
                  <h1 style={{
                    fontSize: 44, fontWeight: 800,
                    color: theme.textPrimary,
                    margin: "0 0 8px"
                  }}>
                    Social<span style={{ color: theme.accent }}>OS</span>
                  </h1>
                  <p style={{ color: theme.textSecondary, fontSize: 16, margin: 0 }}>
                    Social Intelligence Simulator
                  </p>
                  <p style={{ color: theme.textMuted, fontSize: 14, marginTop: 6 }}>
                    Pattern recognition for social dynamics
                  </p>
                </div>

                {/* Assigned scenarios banner */}
                {assignments.filter(a => !a.completed).length > 0 && (
                  <div style={{
                    marginBottom: 20, padding: "16px 20px",
                    background: `${theme.purple}06`,
                    border: `1px solid ${theme.purple}25`,
                    borderRadius: theme.radiusMd,
                  }}>
                    <div style={{ fontSize: 11, color: theme.purple, letterSpacing: 2, marginBottom: 8, fontWeight: 700 }}>
                      {"📋"} ASSIGNED BY COACH
                    </div>
                    {assignments.filter(a => !a.completed).map(a => {
                      const sc = findScenarioById(a.scenarioId);
                      return sc ? (
                        <div
                          key={a.scenarioId}
                          onClick={() => {
                            if (energy >= sc.energy_cost) {
                              // Find the level and chapter for navigation
                              const loc = findScenarioLocation(a.scenarioId);
                              if (loc) {
                                setSelectedLevel(loc.levelId);
                                setSelectedChapter(loc.chapterId);
                              }
                              startScenario(sc);
                            }
                          }}
                          style={{
                            padding: "10px 14px", marginBottom: 6,
                            background: theme.surface,
                            border: `1px solid ${theme.border}`,
                            borderRadius: theme.radiusSm,
                            cursor: energy >= sc.energy_cost ? "pointer" : "not-allowed",
                            opacity: energy >= sc.energy_cost ? 1 : 0.5,
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700 }}>{sc.title}</div>
                            {a.note && <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 2 }}>{a.note}</div>}
                          </div>
                          <span style={{ fontSize: 18, color: theme.purple }}>{"→"}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}

                {/* Reputation tags */}
                {Object.keys(reputation).length > 0 && (
                  <div style={{
                    marginBottom: 28, padding: "16px 20px",
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: theme.radiusMd,
                    boxShadow: theme.shadow,
                  }}>
                    <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, marginBottom: 10, fontWeight: 700 }}>REPUTATION SIGNALS</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {Object.entries(reputation).map(([tag, count]) => (
                        <span key={tag} style={{
                          padding: "5px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                          background: `${theme.accent}15`, color: theme.accent
                        }}>
                          {tag} {"×"}{count}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Level cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {levelEntries.map(([levelId, level], i) => {
                    const chapters = Object.values(level.chapters);
                    const hasScenarios = chapters.some(ch => ch.scenarios?.length > 0);
                    const levelColor = theme.levels[levelId] || level.color;
                    return (
                      <div
                        key={levelId}
                        onClick={() => openLevel(levelId)}
                        style={{
                          background: theme.surface,
                          border: `1px solid ${theme.border}`,
                          borderLeft: `4px solid ${levelColor}`,
                          borderRadius: theme.radiusMd,
                          padding: "20px 24px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          opacity: hasScenarios ? 1 : 0.55,
                          boxShadow: theme.shadow,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = theme.shadowMd; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = theme.shadow; }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: 11, color: levelColor, letterSpacing: 2, marginBottom: 6, fontWeight: 700 }}>
                              {LEVEL_ICONS[levelId]} LEVEL {i + 1}
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 800 }}>{level.title}</div>
                            <div style={{ fontSize: 14, color: theme.textSecondary, marginTop: 4 }}>
                              {chapters.length} chapters {"·"} {chapters.reduce((n, ch) => n + (ch.scenarios?.length || 0), 0)} scenarios
                            </div>
                          </div>
                          {!hasScenarios && (
                            <span style={{
                              fontSize: 11, color: theme.textMuted, fontWeight: 700,
                              background: theme.border, padding: "5px 12px", borderRadius: 20
                            }}>
                              COMING SOON
                            </span>
                          )}
                          {hasScenarios && (
                            <span style={{ fontSize: 20, color: theme.textMuted }}>{"→"}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recharge, Reset & Parent */}
                <div style={{ marginTop: 32, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  {energy < 50 && (
                    <button
                      onClick={rechargeEnergy}
                      style={{
                        padding: "10px 20px", borderRadius: theme.radiusMd,
                        background: `${theme.accent}15`, border: `1px solid ${theme.accent}30`,
                        color: theme.accent, fontSize: 14, fontWeight: 700,
                        cursor: "pointer", fontFamily: theme.fontFamily,
                      }}
                    >
                      {"⚡"} Recharge Energy
                    </button>
                  )}
                  <button
                    onClick={() => setScreen("parent")}
                    style={{
                      padding: "10px 20px", borderRadius: theme.radiusMd,
                      background: `${theme.purple}10`, border: `1px solid ${theme.purple}30`,
                      color: theme.purple, fontSize: 13, fontWeight: 700,
                      cursor: "pointer", fontFamily: theme.fontFamily,
                    }}
                  >
                    {"🔒"} Parent Dashboard
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Reset all progress? This will clear everything — XP, energy, reputation, completed scenarios, and flashcard progress.")) {
                        resetAllProgress();
                      }
                    }}
                    style={{
                      padding: "10px 20px", borderRadius: theme.radiusMd,
                      background: "transparent", border: `1px solid ${theme.border}`,
                      color: theme.textMuted, fontSize: 13, fontWeight: 600,
                      cursor: "pointer", fontFamily: theme.fontFamily,
                    }}
                  >
                    {"↻"} Reset Progress
                  </button>
                </div>
              </div>
            )}

            {/* ─── LEVEL VIEW ─── */}
            {screen === "levels" && selectedLevel && (
              <div>
                <BackBtn onClick={goHome} label="Back" />
                <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8, color: theme.levels[selectedLevel] }}>
                  {SCENARIOS[selectedLevel].title}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
                  {Object.entries(SCENARIOS[selectedLevel].chapters).map(([chId, ch]) => {
                    const hasContent = ch.scenarios?.length > 0;
                    const hasFlashcards = FLASHCARDS[chId]?.length > 0;
                    const hasGenerated = (generatedScenarios[chId] || []).length > 0;
                    const canGenerate = canGenerateForChapter(chId);
                    const levelColor = theme.levels[selectedLevel];
                    return (
                      <div
                        key={chId}
                        onClick={() => (hasContent || hasFlashcards || hasGenerated || canGenerate) && openChapter(chId)}
                        style={{
                          background: theme.surface,
                          border: `1px solid ${theme.border}`,
                          borderRadius: theme.radiusMd,
                          padding: "20px 24px",
                          cursor: (hasContent || hasFlashcards || hasGenerated || canGenerate) ? "pointer" : "default",
                          opacity: (hasContent || hasFlashcards || hasGenerated || canGenerate) ? 1 : 0.45,
                          transition: "all 0.2s ease",
                          boxShadow: theme.shadow,
                        }}
                        onMouseEnter={e => { if (hasContent || hasFlashcards || hasGenerated || canGenerate) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = theme.shadowMd; } }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = theme.shadow; }}
                      >
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{ch.title}</div>
                        <div style={{ fontSize: 14, color: theme.textSecondary, marginTop: 4 }}>{ch.subtitle}</div>
                        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {ch.concepts.map((c, i) => (
                            <span key={i} style={{
                              fontSize: 12, padding: "4px 10px", borderRadius: 20,
                              background: `${levelColor}12`, color: levelColor, fontWeight: 600
                            }}>{c}</span>
                          ))}
                        </div>
                        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 10, fontWeight: 600 }}>
                          {hasFlashcards && <span>{FLASHCARDS[chId].length} concept cards</span>}
                          {hasFlashcards && (hasContent || hasGenerated) && <span> {"·"} </span>}
                          {hasContent && <span>{ch.scenarios.length} scenario{ch.scenarios.length !== 1 ? "s" : ""}</span>}
                          {hasGenerated && <span> {"·"} {generatedScenarios[chId].length} AI-generated</span>}
                          {!hasContent && !hasFlashcards && !hasGenerated && canGenerate && <span>AI scenarios available</span>}
                          {!hasContent && !hasFlashcards && !hasGenerated && !canGenerate && <span>Coming soon</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─── CHAPTER VIEW ─── */}
            {screen === "chapter" && selectedLevel && selectedChapter && (() => {
              const ch = SCENARIOS[selectedLevel].chapters[selectedChapter];
              const levelColor = theme.levels[selectedLevel];
              const cards = FLASHCARDS[selectedChapter] || [];
              const progress = flashcardProgress[selectedChapter] || 0;
              const genScenarios = generatedScenarios[selectedChapter] || [];
              const canGen = canGenerateForChapter(selectedChapter);
              return (
                <div>
                  <BackBtn onClick={() => setScreen("levels")} label={`Back to ${SCENARIOS[selectedLevel].title}`} />
                  <h2 style={{ fontSize: 28, fontWeight: 800, margin: "16px 0 4px" }}>{ch.title}</h2>
                  <p style={{ color: theme.textSecondary, fontSize: 15, margin: "0 0 28px" }}>{ch.subtitle}</p>

                  {/* Learn Concepts — Flashcard Deck */}
                  {cards.length > 0 && (
                    <div
                      onClick={() => openFlashcards(selectedChapter)}
                      style={{
                        background: theme.surface,
                        border: `1px solid ${theme.border}`,
                        borderRadius: theme.radiusMd,
                        padding: "20px 24px",
                        marginBottom: 24,
                        cursor: "pointer",
                        boxShadow: theme.shadow,
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = theme.shadowMd; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = theme.shadow; }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 11, color: levelColor, letterSpacing: 2, marginBottom: 6, fontWeight: 700 }}>
                            LEARN CONCEPTS
                          </div>
                          <div style={{ fontSize: 18, fontWeight: 700 }}>
                            {progress >= cards.length ? (
                              <span style={{ color: theme.accent }}>{"✓"} All {cards.length} concepts learned</span>
                            ) : (
                              <span>{progress} of {cards.length} concepts</span>
                            )}
                          </div>
                        </div>
                        <div style={{
                          width: 48, height: 48, borderRadius: "50%",
                          background: progress >= cards.length ? `${theme.accent}20` : `${levelColor}15`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 22,
                        }}>
                          {progress >= cards.length ? "✓" : "🃏"}
                        </div>
                      </div>
                      <div style={{
                        marginTop: 14, height: 6, borderRadius: 3,
                        background: theme.border,
                        overflow: "hidden",
                      }}>
                        <div style={{
                          height: "100%", borderRadius: 3,
                          width: `${cards.length > 0 ? (progress / cards.length) * 100 : 0}%`,
                          background: levelColor,
                          transition: "width 0.5s ease",
                        }} />
                      </div>
                    </div>
                  )}

                  {/* Core Scenarios */}
                  {ch.scenarios.length > 0 && (
                    <>
                      <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, marginBottom: 12, fontWeight: 700 }}>
                        PRACTICE SCENARIOS
                      </div>
                      {ch.scenarios.map(sc => (
                        <ScenarioCard
                          key={sc.id}
                          scenario={sc}
                          done={completedScenarios.includes(sc.id)}
                          lowEnergy={energy < sc.energy_cost}
                          assigned={assignments.some(a => a.scenarioId === sc.id && !a.completed)}
                          onStart={() => startScenario(sc)}
                        />
                      ))}
                    </>
                  )}

                  {ch.scenarios.length === 0 && genScenarios.length === 0 && !canGen && (
                    <div style={{
                      padding: "20px 24px",
                      background: theme.surface,
                      border: `1px solid ${theme.border}`,
                      borderRadius: theme.radiusMd,
                      color: theme.textMuted,
                      fontSize: 14,
                      textAlign: "center",
                    }}>
                      Practice scenarios coming soon
                    </div>
                  )}

                  {/* AI-Generated Scenarios */}
                  {genScenarios.length > 0 && (
                    <>
                      <div style={{ fontSize: 11, color: theme.info, letterSpacing: 2, marginTop: 24, marginBottom: 12, fontWeight: 700 }}>
                        {"🤖"} AI-GENERATED SCENARIOS
                      </div>
                      {genScenarios.map(sc => (
                        <div key={sc.id} style={{ position: "relative" }}>
                          <ScenarioCard
                            scenario={sc}
                            done={completedScenarios.includes(sc.id)}
                            lowEnergy={energy < sc.energy_cost}
                            assigned={false}
                            onStart={() => startScenario(sc)}
                            isGenerated
                          />
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveGenerated(selectedChapter, sc.id); }}
                            title="Remove this generated scenario"
                            style={{
                              position: "absolute", top: 12, right: 12,
                              background: "none", border: "none",
                              color: theme.textMuted, fontSize: 16, cursor: "pointer",
                              padding: "4px 8px",
                            }}
                          >{"×"}</button>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Generate New Scenario Button */}
                  {canGen && (
                    <div style={{ marginTop: 20 }}>
                      <button
                        onClick={() => !generating && handleGenerateScenario(selectedChapter)}
                        disabled={generating}
                        style={{
                          width: "100%",
                          padding: "16px 20px",
                          borderRadius: theme.radiusMd,
                          background: generating ? theme.surface : `${theme.info}08`,
                          border: `2px dashed ${generating ? theme.border : theme.info + "40"}`,
                          color: generating ? theme.textMuted : theme.info,
                          fontSize: 15, fontWeight: 700,
                          cursor: generating ? "default" : "pointer",
                          fontFamily: theme.fontFamily,
                          transition: "all 0.2s ease",
                        }}
                      >
                        {generating ? (
                          <span style={{ display: "inline-block", animation: "pulse 1.5s infinite" }}>
                            {"🤖"} Generating new scenario...
                          </span>
                        ) : (
                          <span>{"🤖"} Generate AI Scenario</span>
                        )}
                      </button>
                      {generateError && (
                        <div style={{
                          marginTop: 8, padding: "10px 14px",
                          background: `${theme.danger}08`,
                          border: `1px solid ${theme.danger}20`,
                          borderRadius: theme.radiusSm,
                          fontSize: 13, color: theme.danger,
                        }}>
                          {generateError}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ─── FLASHCARDS ─── */}
            {screen === "flashcards" && selectedLevel && selectedChapter && (() => {
              const ch = SCENARIOS[selectedLevel].chapters[selectedChapter];
              const levelColor = theme.levels[selectedLevel];
              const cards = FLASHCARDS[selectedChapter] || [];
              return (
                <div>
                  <BackBtn onClick={() => setScreen("chapter")} label={`Back to ${ch.title}`} />
                  <div style={{ fontSize: 11, color: levelColor, letterSpacing: 2, marginBottom: 8, fontWeight: 700 }}>
                    CONCEPT CARDS
                  </div>
                  <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 24px" }}>{ch.title}</h2>
                  {cards.length > 0 ? (
                    <SwipeDeck
                      cards={cards}
                      onComplete={() => completeFlashcards(selectedChapter, cards.length)}
                      chapterColor={levelColor}
                    />
                  ) : (
                    <div style={{ color: theme.textMuted, fontSize: 14, textAlign: "center", padding: 40 }}>
                      No concept cards for this chapter yet.
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ─── SCENARIO ─── */}
            {screen === "scenario" && selectedScenario && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: theme.accent, letterSpacing: 2, fontWeight: 700 }}>
                    SCENARIO {"·"} TURN {currentTurn + 1}/{selectedScenario.turns.length}
                  </div>
                  {selectedScenario.generated && (
                    <span style={{
                      fontSize: 10, padding: "2px 8px", borderRadius: 12,
                      background: `${theme.info}15`, color: theme.info, fontWeight: 700,
                    }}>AI-GENERATED</span>
                  )}
                </div>
                <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 16px" }}>{selectedScenario.title}</h2>

                {/* Setup (only on first turn) */}
                {currentTurn === 0 && (
                  <div style={{
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: theme.radiusMd,
                    padding: "16px 20px",
                    marginBottom: 16,
                    boxShadow: theme.shadow,
                  }}>
                    <div style={{ fontSize: 15, lineHeight: 1.7, color: theme.textSecondary }}>{selectedScenario.setup}</div>
                    <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {selectedScenario.characters.map((c, i) => (
                        <span key={i} style={{
                          fontSize: 12, padding: "4px 10px", borderRadius: 20,
                          background: `${theme.accent}12`, color: theme.accent, fontWeight: 600
                        }}>{c}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Situation */}
                <div style={{
                  background: `${theme.accent}08`,
                  border: `1px solid ${theme.accent}20`,
                  borderRadius: theme.radiusMd,
                  padding: "16px 20px",
                  marginBottom: 20,
                }}>
                  <div style={{ fontSize: 11, color: theme.accent, letterSpacing: 2, marginBottom: 8, fontWeight: 700 }}>SITUATION</div>
                  <div style={{ fontSize: 16, lineHeight: 1.7 }}>{getCurrentSituation()}</div>
                </div>

                {/* Emotion guess */}
                {getCurrentEmotionGuess() && !emotionGuess && (
                  <div style={{
                    background: `${theme.info}08`,
                    border: `1px solid ${theme.info}25`,
                    borderRadius: theme.radiusMd,
                    padding: "16px 20px",
                    marginBottom: 20,
                  }}>
                    <div style={{ fontSize: 11, color: theme.info, letterSpacing: 2, marginBottom: 8, fontWeight: 700 }}>
                      {"⚡"} EMOTION SCAN REQUIRED
                    </div>
                    <div style={{ fontSize: 15, color: theme.textSecondary, marginBottom: 12 }}>{getCurrentEmotionGuess().prompt}</div>
                    {getCurrentEmotionGuess().options.map((opt, i) => (
                      <div
                        key={i}
                        onClick={() => { setEmotionGuess(opt); setEmotionFeedback(opt); }}
                        style={{
                          padding: "12px 16px", marginBottom: 6, borderRadius: theme.radiusSm,
                          background: theme.surface, border: `1px solid ${theme.border}`,
                          cursor: "pointer", fontSize: 15, transition: "all 0.2s ease",
                          boxShadow: theme.shadow,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = theme.info + "50"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = "translateY(0)"; }}
                      >
                        {opt.text}
                      </div>
                    ))}
                  </div>
                )}

                {/* Emotion feedback */}
                {emotionFeedback && (
                  <div style={{
                    background: emotionFeedback.correct ? `${theme.accent}10` : `${theme.danger}10`,
                    border: `1px solid ${emotionFeedback.correct ? theme.accent + "30" : theme.danger + "30"}`,
                    borderRadius: theme.radiusMd,
                    padding: "16px 20px",
                    marginBottom: 20,
                  }}>
                    <div style={{
                      fontSize: 14, fontWeight: 700, marginBottom: 6,
                      color: emotionFeedback.correct ? theme.accent : theme.danger,
                    }}>
                      {emotionFeedback.correct ? "✓ CORRECT READ" : "✗ MISREAD"}
                    </div>
                    <div style={{ fontSize: 15, lineHeight: 1.6, color: theme.textSecondary }}>{emotionFeedback.explanation}</div>
                  </div>
                )}

                {/* Choices */}
                {(getCurrentEmotionGuess() ? emotionGuess : true) && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, fontWeight: 700 }}>CHOOSE YOUR RESPONSE</div>
                      <button
                        onClick={() => setShowSignals(!showSignals)}
                        style={{
                          background: showSignals ? `${theme.purple}15` : theme.surface,
                          border: `1px solid ${showSignals ? theme.purple + "40" : theme.border}`,
                          color: showSignals ? theme.purple : theme.textSecondary,
                          fontSize: 11, padding: "5px 12px", borderRadius: 20, cursor: "pointer",
                          fontWeight: 700, letterSpacing: 1, fontFamily: theme.fontFamily,
                        }}
                      >
                        {showSignals ? "HIDE" : "SHOW"} SIGNALS
                      </button>
                    </div>
                    {getCurrentChoices().map((choice, i) => (
                      <div
                        key={i}
                        onClick={() => !animatingChoice && makeChoice(choice)}
                        style={{
                          padding: "14px 18px", marginBottom: 8, borderRadius: theme.radiusMd,
                          background: animatingChoice === choice.text ? `${theme.accent}10` : theme.surface,
                          border: `1px solid ${animatingChoice === choice.text ? theme.accent + "40" : theme.border}`,
                          cursor: animatingChoice ? "default" : "pointer",
                          transition: "all 0.2s ease",
                          transform: animatingChoice === choice.text ? "scale(0.98)" : "scale(1)",
                          boxShadow: theme.shadow,
                        }}
                        onMouseEnter={e => { if (!animatingChoice) { e.currentTarget.style.borderColor = theme.accent + "40"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                        onMouseLeave={e => { if (!animatingChoice) { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = "scale(1)"; } }}
                      >
                        <div style={{ fontSize: 15, lineHeight: 1.6 }}>{choice.text}</div>
                        {showSignals && (
                          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {choice.signals.map((s, j) => (
                              <span key={j} style={{
                                fontSize: 11, padding: "3px 10px", borderRadius: 20,
                                background: `${theme.purple}12`, color: theme.purple, fontWeight: 600
                              }}>{s}</span>
                            ))}
                            <span style={{
                              fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600,
                              background: choice.status_impact >= 0 ? `${theme.accent}12` : `${theme.danger}12`,
                              color: choice.status_impact >= 0 ? theme.accent : theme.danger
                            }}>
                              {choice.status_impact > 0 ? "+" : ""}{choice.status_impact} status
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── DEBRIEF ─── */}
            {screen === "debrief" && selectedScenario && (
              <div>
                <div style={{ fontSize: 11, color: theme.accent, letterSpacing: 2, marginBottom: 8, fontWeight: 700 }}>DEBRIEF</div>
                <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 4px" }}>{selectedScenario.title}</h2>
                <p style={{ color: theme.textSecondary, fontSize: 14, margin: "0 0 24px" }}>Analytical breakdown of your choices</p>

                {/* Choice summary */}
                <div style={{
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: theme.radiusMd,
                  padding: "16px 20px",
                  marginBottom: 16,
                  boxShadow: theme.shadow,
                }}>
                  <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, marginBottom: 12, fontWeight: 700 }}>YOUR PATH</div>
                  {choiceHistory.map((c, i) => (
                    <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < choiceHistory.length - 1 ? `1px solid ${theme.border}` : "none" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: theme.textMuted }}>Decision {i + 1}</div>
                      <div style={{ fontSize: 15, color: theme.textSecondary, lineHeight: 1.5 }}>{c.text}</div>
                      <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <span style={{
                          fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600,
                          background: c.status_impact >= 0 ? `${theme.accent}12` : `${theme.danger}12`,
                          color: c.status_impact >= 0 ? theme.accent : theme.danger
                        }}>
                          {c.status_impact > 0 ? "+" : ""}{c.status_impact} status
                        </span>
                        {c.reputation_tag && (
                          <span style={{
                            fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600,
                            background: `${theme.purple}12`, color: theme.purple
                          }}>
                            {c.reputation_tag}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                  <StatCard label="ENERGY SPENT" value={`-${selectedScenario.energy_cost}`} color={theme.danger} bgColor={`${theme.danger}08`} />
                  <StatCard label="XP EARNED" value={`+${selectedScenario.xp_reward}`} color={theme.xp} bgColor={`${theme.xp}10`} />
                  <StatCard label="NET STATUS" value={`${scenarioStatus > 0 ? "+" : ""}${scenarioStatus}`} color={scenarioStatus >= 0 ? theme.accent : theme.danger} bgColor={scenarioStatus >= 0 ? `${theme.accent}08` : `${theme.danger}08`} />
                </div>

                {/* AI Debrief */}
                <div style={{
                  background: `${theme.accent}06`,
                  border: `1px solid ${theme.accent}20`,
                  borderRadius: theme.radiusMd,
                  padding: "20px 24px",
                  marginBottom: 20,
                }}>
                  <div style={{ fontSize: 11, color: theme.accent, letterSpacing: 2, marginBottom: 12, fontWeight: 700 }}>
                    &#9678; COACH ANALYSIS
                  </div>
                  {debriefLoading ? (
                    <div style={{ color: theme.textSecondary, fontSize: 15 }}>
                      <span style={{ display: "inline-block", animation: "pulse 1.5s infinite" }}>Analyzing social dynamics...</span>
                    </div>
                  ) : (
                    <div style={{ fontSize: 15, lineHeight: 1.8, color: theme.textSecondary, whiteSpace: "pre-wrap" }}>{debriefText}</div>
                  )}
                </div>

                {/* Navigation */}
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => startScenario(selectedScenario)}
                    style={{
                      flex: 1, padding: "14px 20px", borderRadius: theme.radiusMd,
                      background: theme.surface, border: `1px solid ${theme.border}`,
                      color: theme.textSecondary, fontSize: 15, fontWeight: 700,
                      cursor: energy < selectedScenario.energy_cost ? "not-allowed" : "pointer",
                      opacity: energy < selectedScenario.energy_cost ? 0.4 : 1,
                      fontFamily: theme.fontFamily, boxShadow: theme.shadow,
                    }}
                  >
                    {"↻"} Replay
                  </button>
                  <button
                    onClick={goHome}
                    style={{
                      flex: 1, padding: "14px 20px", borderRadius: theme.radiusMd,
                      background: theme.accent, border: "none",
                      color: "#fff", fontSize: 15, fontWeight: 700,
                      cursor: "pointer", fontFamily: theme.fontFamily,
                      boxShadow: `0 4px 12px ${theme.accent}30`,
                    }}
                  >
                    Continue {"→"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${theme.bg}; }
        ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 3px; }
      `}</style>
    </div>
  );
}

// ─── HELPER: Find scenario by ID across all levels/chapters ──────────
function findScenarioById(scenarioId) {
  for (const level of Object.values(SCENARIOS)) {
    for (const ch of Object.values(level.chapters)) {
      const found = (ch.scenarios || []).find(s => s.id === scenarioId);
      if (found) return found;
    }
  }
  // Also check generated scenarios
  const gen = JSON.parse(localStorage.getItem("socialos-generated-scenarios") || "{}");
  for (const chScenarios of Object.values(gen)) {
    const found = chScenarios.find(s => s.id === scenarioId);
    if (found) return found;
  }
  return null;
}

function findScenarioLocation(scenarioId) {
  for (const [levelId, level] of Object.entries(SCENARIOS)) {
    for (const [chapterId, ch] of Object.entries(level.chapters)) {
      if ((ch.scenarios || []).find(s => s.id === scenarioId)) {
        return { levelId, chapterId };
      }
    }
  }
  return null;
}

// ─── HELPER COMPONENTS ────────────────────────────────────────────────
function ScenarioCard({ scenario: sc, done, lowEnergy, assigned, onStart, isGenerated }) {
  return (
    <div
      onClick={() => !lowEnergy && onStart()}
      style={{
        background: theme.surface,
        border: `1px solid ${assigned ? theme.purple + "40" : theme.border}`,
        borderLeft: assigned ? `4px solid ${theme.purple}` : undefined,
        borderRadius: theme.radiusMd,
        padding: "20px 24px",
        marginBottom: 10,
        cursor: lowEnergy ? "not-allowed" : "pointer",
        opacity: lowEnergy ? 0.5 : 1,
        transition: "all 0.2s ease",
        boxShadow: theme.shadow,
      }}
      onMouseEnter={e => { if (!lowEnergy) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = theme.shadowMd; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = theme.shadow; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            {done && <span style={{ color: theme.accent }}>{"✓"}</span>}
            {sc.title}
            {isGenerated && (
              <span style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 12,
                background: `${theme.info}12`, color: theme.info, fontWeight: 700,
              }}>AI</span>
            )}
            {assigned && (
              <span style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 12,
                background: `${theme.purple}12`, color: theme.purple, fontWeight: 700,
              }}>ASSIGNED</span>
            )}
          </div>
          <div style={{ fontSize: 14, color: theme.textSecondary, marginTop: 4, lineHeight: 1.5 }}>{sc.setup.slice(0, 120)}...</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0, marginLeft: 16 }}>
          <MiniStat label="ENERGY" value={`-${sc.energy_cost}`} color={theme.danger} />
          <MiniStat label="XP" value={`+${sc.xp_reward}`} color={theme.xp} />
        </div>
      </div>
      {lowEnergy && (
        <div style={{ fontSize: 13, color: theme.danger, marginTop: 8, fontWeight: 600 }}>Not enough energy — rest or come back later</div>
      )}
    </div>
  );
}

function StatPill({ label, value, max, color, showSign }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 11, letterSpacing: 1, color: theme.textMuted, fontWeight: 700 }}>{label}</span>
      <span style={{ fontWeight: 800, fontSize: 14, color }}>
        {showSign && value > 0 ? "+" : ""}{value}{max ? `/${max}` : ""}
      </span>
      {max && (
        <div style={{ width: 40, height: 4, background: theme.border, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.5s ease" }} />
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 10, letterSpacing: 1, color: theme.textMuted, marginBottom: 2, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

function StatCard({ label, value, color, bgColor }) {
  return (
    <div style={{
      flex: 1, background: bgColor, border: `1px solid ${theme.border}`,
      borderRadius: theme.radiusMd, padding: "14px 16px", textAlign: "center",
    }}>
      <div style={{ fontSize: 10, color: theme.textMuted, letterSpacing: 1, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function BackBtn({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none", border: "none",
        color: theme.textSecondary,
        fontSize: 14, fontWeight: 600,
        cursor: "pointer", padding: "4px 0", marginBottom: 12,
        fontFamily: theme.fontFamily,
      }}
    >
      {"←"} {label}
    </button>
  );
}
