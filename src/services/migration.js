// SocialOS — localStorage to Supabase Migration
// One-time migration when an existing user signs up/in for the first time

import { saveGameState, saveGeneratedScenario, logSession } from './database';

const PREFIX = 'socialos-';

export function hasLocalData() {
  return localStorage.getItem(PREFIX + 'energy') !== null ||
    localStorage.getItem(PREFIX + 'xp') !== null ||
    localStorage.getItem(PREFIX + 'status') !== null;
}

export async function migrateToCloud(userId) {
  const energy = JSON.parse(localStorage.getItem(PREFIX + 'energy') || '100');
  const xp = JSON.parse(localStorage.getItem(PREFIX + 'xp') || '0');
  const statusScore = JSON.parse(localStorage.getItem(PREFIX + 'status') || '0');
  const reputation = JSON.parse(localStorage.getItem(PREFIX + 'reputation') || '{}');
  const completed = JSON.parse(localStorage.getItem(PREFIX + 'completed') || '[]');
  const flashcardProgress = JSON.parse(localStorage.getItem(PREFIX + 'flashcard-progress') || '{}');
  const onboardingSeen = localStorage.getItem(PREFIX + 'onboarding-seen') === 'true';

  // Save game state
  await saveGameState(userId, {
    energy,
    xp,
    status_score: statusScore,
    reputation,
    completed_scenarios: completed,
    flashcard_progress: flashcardProgress,
    onboarding_seen: onboardingSeen,
  });

  // Migrate generated scenarios
  const genScenarios = JSON.parse(localStorage.getItem(PREFIX + 'generated-scenarios') || '{}');
  for (const [chapterId, scenarios] of Object.entries(genScenarios)) {
    for (const scenario of scenarios) {
      try {
        await saveGeneratedScenario(userId, chapterId, scenario);
      } catch (err) {
        console.warn('Skipping generated scenario migration:', err.message);
      }
    }
  }

  // Migrate session history
  const sessions = JSON.parse(localStorage.getItem(PREFIX + 'session-history') || '[]');
  for (const session of sessions) {
    try {
      await logSession(
        userId,
        session.scenarioId,
        session.scenarioTitle,
        session.choices,
        session.statusDelta,
        session.reputationTags || []
      );
    } catch (err) {
      console.warn('Skipping session migration:', err.message);
    }
  }

  // Clear localStorage after successful migration
  clearLocalStorage();
}

export function clearLocalStorage() {
  const keys = [
    'energy', 'xp', 'status', 'reputation', 'completed',
    'flashcard-progress', 'onboarding-seen', 'generated-scenarios',
    'session-history', 'parent-notes', 'assigned-scenarios', 'parent-pin',
  ];
  keys.forEach(k => localStorage.removeItem(PREFIX + k));
}
