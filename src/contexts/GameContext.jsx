// SocialOS — Game State Context
// Manages all game state with Supabase persistence
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import {
  loadGameState,
  saveGameState,
  getGeneratedScenarios,
  saveGeneratedScenario,
  removeGeneratedScenario,
  getAssignedScenarios,
  completeAssignment,
  logSession,
  getUnlockRequests,
  createUnlockRequest,
} from '../services/database';
import { hasLocalData, migrateToCloud } from '../services/migration';

const GameContext = createContext(null);

// Debounce delay for saving game state (ms)
const SAVE_DEBOUNCE = 1500;

export function GameProvider({ children }) {
  const { user } = useAuth();
  const [gameState, setGameState] = useState(null);
  const [generatedScenarios, setGeneratedScenarios] = useState({});
  const [assignments, setAssignments] = useState([]);
  const [unlockRequests, setUnlockRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);

  // Debounced save ref
  const saveTimer = useRef(null);
  const pendingUpdates = useRef({});

  // Load all data when user changes
  useEffect(() => {
    if (!user) {
      setGameState(null);
      setGeneratedScenarios({});
      setAssignments([]);
      setUnlockRequests([]);
      setLoading(false);
      return;
    }

    async function loadAll() {
      setLoading(true);
      try {
        // Check for localStorage migration
        if (hasLocalData()) {
          setMigrating(true);
          try {
            await migrateToCloud(user.id);
          } catch (err) {
            console.error('Migration failed:', err);
          }
          setMigrating(false);
        }

        const [gs, gen, assign, unlock] = await Promise.all([
          loadGameState(user.id),
          getGeneratedScenarios(user.id),
          getAssignedScenarios(user.id),
          getUnlockRequests(user.id),
        ]);

        setGameState(gs);
        setGeneratedScenarios(gen);
        setAssignments(assign);
        setUnlockRequests(unlock);
      } catch (err) {
        console.error('Error loading game data:', err);
      }
      setLoading(false);
    }

    loadAll();
  }, [user]);

  // Debounced save to database
  const flushSave = useCallback(async () => {
    if (!user || Object.keys(pendingUpdates.current).length === 0) return;
    const updates = { ...pendingUpdates.current };
    pendingUpdates.current = {};
    try {
      await saveGameState(user.id, updates);
    } catch (err) {
      console.error('Error saving game state:', err);
    }
  }, [user]);

  // Update game state locally + queue save
  const updateGameState = useCallback((updates) => {
    setGameState(prev => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
    // Queue for database save
    pendingUpdates.current = { ...pendingUpdates.current, ...updates };
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(flushSave, SAVE_DEBOUNCE);
  }, [flushSave]);

  // Force immediate save (e.g., before navigation)
  const forceSave = useCallback(async () => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    await flushSave();
  }, [flushSave]);

  // Convenience getters from game state
  const energy = gameState?.energy ?? 100;
  const xp = gameState?.xp ?? 0;
  const statusScore = gameState?.status_score ?? 0;
  const reputation = gameState?.reputation ?? {};
  const completedScenarios = gameState?.completed_scenarios ?? [];
  const flashcardProgress = gameState?.flashcard_progress ?? {};
  const onboardingSeen = gameState?.onboarding_seen ?? false;

  // Game actions
  async function handleScenarioComplete(scenario, allChoices) {
    if (!user) return;

    const statusDelta = allChoices.reduce((sum, c) => sum + (c.status_impact || 0), 0);
    const newReputation = { ...reputation };
    const reputationTags = [];
    allChoices.forEach(c => {
      if (c.reputation_tag) {
        reputationTags.push(c.reputation_tag);
        newReputation[c.reputation_tag] = (newReputation[c.reputation_tag] || 0) + 1;
      }
    });

    const newCompleted = completedScenarios.includes(scenario.id)
      ? completedScenarios
      : [...completedScenarios, scenario.id];

    updateGameState({
      energy: Math.max(0, energy - scenario.energy_cost),
      xp: xp + scenario.xp_reward,
      status_score: statusScore + statusDelta,
      reputation: newReputation,
      completed_scenarios: newCompleted,
    });

    // Log session
    try {
      await logSession(user.id, scenario.id, scenario.title, allChoices, statusDelta, reputationTags);
    } catch (err) {
      console.error('Error logging session:', err);
    }

    // Complete assignment if applicable
    const isAssigned = assignments.some(a => a.scenarioId === scenario.id && !a.completed);
    if (isAssigned) {
      try {
        await completeAssignment(user.id, scenario.id);
        setAssignments(await getAssignedScenarios(user.id));
      } catch (err) {
        console.error('Error completing assignment:', err);
      }
    }

    return { statusDelta, reputationTags };
  }

  function completeFlashcards(chapterId, totalCards) {
    const updated = { ...flashcardProgress, [chapterId]: totalCards };
    updateGameState({ flashcard_progress: updated });
  }

  function rechargeEnergy() {
    updateGameState({ energy: 100 });
  }

  function markOnboardingSeen() {
    updateGameState({ onboarding_seen: true });
  }

  async function resetAllProgress() {
    updateGameState({
      energy: 100,
      xp: 0,
      status_score: 0,
      reputation: {},
      completed_scenarios: [],
      flashcard_progress: {},
      onboarding_seen: false,
    });
  }

  // Generated scenarios
  async function handleGenerateScenario(chapterId, scenario) {
    if (!user) return;
    const updated = await saveGeneratedScenario(user.id, chapterId, scenario);
    setGeneratedScenarios(updated);
  }

  async function handleRemoveGenerated(scenarioId) {
    if (!user) return;
    const updated = await removeGeneratedScenario(user.id, scenarioId);
    setGeneratedScenarios(updated);
  }

  // Unlock requests
  async function handleRequestUnlock(chapterId) {
    if (!user) return;
    await createUnlockRequest(user.id, chapterId);
    setUnlockRequests(await getUnlockRequests(user.id));
  }

  function getApprovedExtraSlots(chapterId) {
    return unlockRequests
      .filter(r => r.chapter_id === chapterId && r.status === 'approved')
      .reduce((sum, r) => sum + (r.extra_slots || 0), 0);
  }

  function hasPendingRequest(chapterId) {
    return unlockRequests.some(r => r.chapter_id === chapterId && r.status === 'pending');
  }

  const value = {
    loading,
    migrating,
    energy,
    xp,
    statusScore,
    reputation,
    completedScenarios,
    flashcardProgress,
    onboardingSeen,
    generatedScenarios,
    assignments,
    unlockRequests,
    updateGameState,
    forceSave,
    handleScenarioComplete,
    completeFlashcards,
    rechargeEnergy,
    markOnboardingSeen,
    resetAllProgress,
    handleGenerateScenario,
    handleRemoveGenerated,
    handleRequestUnlock,
    getApprovedExtraSlots,
    hasPendingRequest,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
}
