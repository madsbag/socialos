// SocialOS — Database Service (Supabase)
// Replaces localStorage-based storage.js with cloud persistence
import { supabase } from '../lib/supabase';

// ─── Game State ─────────────────────────────────────────────────────
export async function loadGameState(userId) {
  const { data, error } = await supabase
    .from('game_state')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function saveGameState(userId, updates) {
  const { error } = await supabase
    .from('game_state')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
  if (error) throw error;
}

// ─── Generated Scenarios ────────────────────────────────────────────
export async function getGeneratedScenarios(userId) {
  const { data, error } = await supabase
    .from('generated_scenarios')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  // Group by chapter_id for compatibility with existing UI
  const grouped = {};
  (data || []).forEach(row => {
    if (!grouped[row.chapter_id]) grouped[row.chapter_id] = [];
    grouped[row.chapter_id].push(row.scenario_data);
  });
  return grouped;
}

export async function saveGeneratedScenario(userId, chapterId, scenario) {
  const { error } = await supabase
    .from('generated_scenarios')
    .insert({
      id: scenario.id,
      user_id: userId,
      chapter_id: chapterId,
      scenario_data: scenario,
    });
  if (error) throw error;
  return getGeneratedScenarios(userId);
}

export async function removeGeneratedScenario(userId, scenarioId) {
  const { error } = await supabase
    .from('generated_scenarios')
    .delete()
    .eq('id', scenarioId)
    .eq('user_id', userId);
  if (error) throw error;
  return getGeneratedScenarios(userId);
}

// ─── Session History ────────────────────────────────────────────────
export async function getSessionHistory(userId) {
  const { data, error } = await supabase
    .from('session_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data || [];
}

export async function logSession(userId, scenarioId, scenarioTitle, choices, statusDelta, reputationTags) {
  const { error } = await supabase
    .from('session_history')
    .insert({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      user_id: userId,
      scenario_id: scenarioId,
      scenario_title: scenarioTitle,
      choices: choices.map(c => ({
        text: c.text,
        signals: c.signals,
        status_impact: c.status_impact,
        reputation_tag: c.reputation_tag,
      })),
      status_delta: statusDelta,
      reputation_tags: reputationTags,
    });
  if (error) throw error;
}

// ─── Assigned Scenarios ─────────────────────────────────────────────
export async function getAssignedScenarios(userId) {
  const { data, error } = await supabase
    .from('assigned_scenarios')
    .select('*')
    .eq('target_user_id', userId)
    .order('assigned_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(row => ({
    scenarioId: row.scenario_id,
    chapterId: row.chapter_id,
    note: row.note,
    assignedAt: row.assigned_at,
    completed: row.completed,
    completedAt: row.completed_at,
  }));
}

export async function completeAssignment(userId, scenarioId) {
  const { error } = await supabase
    .from('assigned_scenarios')
    .update({ completed: true, completed_at: new Date().toISOString() })
    .eq('target_user_id', userId)
    .eq('scenario_id', scenarioId)
    .eq('completed', false);
  if (error) throw error;
}

// ─── Unlock Requests ────────────────────────────────────────────────
export async function getUnlockRequests(userId) {
  const { data, error } = await supabase
    .from('unlock_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createUnlockRequest(userId, chapterId) {
  // Check if already has a pending request for this chapter
  const { data: existing } = await supabase
    .from('unlock_requests')
    .select('id')
    .eq('user_id', userId)
    .eq('chapter_id', chapterId)
    .eq('status', 'pending')
    .limit(1);
  if (existing && existing.length > 0) return; // Already pending

  const { error } = await supabase
    .from('unlock_requests')
    .insert({
      user_id: userId,
      chapter_id: chapterId,
      status: 'pending',
    });
  if (error) throw error;
}

// ─── Admin Functions ────────────────────────────────────────────────
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      game_state (*)
    `)
    .eq('role', 'player')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getUserDetail(userId) {
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (profileErr) throw profileErr;

  const { data: gameState, error: gsErr } = await supabase
    .from('game_state')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (gsErr) throw gsErr;

  const { data: sessions, error: sessErr } = await supabase
    .from('session_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (sessErr) throw sessErr;

  return { profile, gameState, sessions: sessions || [] };
}

export async function adminAssignScenario(adminId, targetUserId, scenarioId, chapterId, note = '') {
  const { error } = await supabase
    .from('assigned_scenarios')
    .insert({
      admin_id: adminId,
      target_user_id: targetUserId,
      scenario_id: scenarioId,
      chapter_id: chapterId,
      note,
    });
  if (error) throw error;
}

export async function adminGetUnlockRequests() {
  const { data, error } = await supabase
    .from('unlock_requests')
    .select(`
      *,
      profiles:user_id (display_name)
    `)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function adminResolveUnlockRequest(requestId, adminId, status, extraSlots = 2) {
  const { error } = await supabase
    .from('unlock_requests')
    .update({
      status,
      admin_id: adminId,
      extra_slots: status === 'approved' ? extraSlots : 0,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', requestId);
  if (error) throw error;
}

export async function adminGetNotes(targetUserId) {
  const { data, error } = await supabase
    .from('admin_notes')
    .select('*')
    .eq('target_user_id', targetUserId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function adminAddNote(adminId, targetUserId, note) {
  const { error } = await supabase
    .from('admin_notes')
    .insert({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      admin_id: adminId,
      target_user_id: targetUserId,
      note,
    });
  if (error) throw error;
}

export async function adminDeleteNote(noteId) {
  const { error } = await supabase
    .from('admin_notes')
    .delete()
    .eq('id', noteId);
  if (error) throw error;
}
