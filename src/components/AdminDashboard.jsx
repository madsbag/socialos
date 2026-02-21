// SocialOS — Admin Dashboard
// Multi-user admin view for managing players, assignments, and unlock requests
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme';
import { SCENARIOS } from '../data/scenarios';
import {
  getAllUsers,
  getUserDetail,
  adminAssignScenario,
  adminGetUnlockRequests,
  adminResolveUnlockRequest,
  adminGetNotes,
  adminAddNote,
  adminDeleteNote,
} from '../services/database';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user: adminUser } = useAuth();
  const [tab, setTab] = useState('users'); // users | detail | requests
  const [users, setUsers] = useState([]);
  const [unlockRequests, setUnlockRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [userNotes, setUserNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [assignModal, setAssignModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [u, r] = await Promise.all([
        getAllUsers(),
        adminGetUnlockRequests(),
      ]);
      setUsers(u);
      setUnlockRequests(r);
    } catch (err) {
      console.error('Admin load error:', err);
    }
    setLoading(false);
  }

  async function openUserDetail(userId) {
    try {
      const detail = await getUserDetail(userId);
      const notes = await adminGetNotes(userId);
      setUserDetail(detail);
      setUserNotes(notes);
      setSelectedUser(userId);
      setTab('detail');
    } catch (err) {
      console.error('Error loading user detail:', err);
    }
  }

  async function handleAddNote() {
    if (!newNote.trim() || !selectedUser) return;
    try {
      await adminAddNote(adminUser.id, selectedUser, newNote.trim());
      setUserNotes(await adminGetNotes(selectedUser));
      setNewNote('');
    } catch (err) {
      console.error('Error adding note:', err);
    }
  }

  async function handleDeleteNote(noteId) {
    try {
      await adminDeleteNote(noteId);
      setUserNotes(await adminGetNotes(selectedUser));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  }

  async function handleResolveRequest(requestId, status) {
    try {
      await adminResolveUnlockRequest(requestId, adminUser.id, status, status === 'approved' ? 2 : 0);
      setUnlockRequests(await adminGetUnlockRequests());
    } catch (err) {
      console.error('Error resolving request:', err);
    }
  }

  async function handleAssign(scenarioId, chapterId) {
    if (!selectedUser) return;
    try {
      await adminAssignScenario(adminUser.id, selectedUser, scenarioId, chapterId);
      setAssignModal(false);
      // Refresh detail
      const detail = await getUserDetail(selectedUser);
      setUserDetail(detail);
    } catch (err) {
      console.error('Error assigning scenario:', err);
    }
  }

  // Flatten all scenarios for assignment picker
  const allScenarios = [];
  Object.entries(SCENARIOS).forEach(([levelId, level]) => {
    Object.entries(level.chapters).forEach(([chId, ch]) => {
      (ch.scenarios || []).forEach(sc => {
        allScenarios.push({ ...sc, chapterId: chId, chapterTitle: ch.title, levelTitle: level.title });
      });
    });
  });

  const pendingRequests = unlockRequests.filter(r => r.status === 'pending');

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      fontFamily: theme.fontFamily,
      color: theme.textPrimary,
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: `${theme.bg}ee`,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.border}`,
        padding: '12px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22, color: theme.purple }}>{"🛡️"}</span>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1 }}>
            Admin Dashboard
          </span>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.radiusSm,
            padding: '8px 16px',
            fontSize: 13, fontWeight: 600,
            color: theme.textSecondary,
            cursor: 'pointer',
            fontFamily: theme.fontFamily,
          }}
        >
          {"←"} Back to App
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[
            { key: 'users', label: 'All Users' },
            { key: 'requests', label: `Unlock Requests${pendingRequests.length ? ` (${pendingRequests.length})` : ''}` },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSelectedUser(null); }}
              style={{
                padding: '10px 20px',
                borderRadius: theme.radiusMd,
                border: `1px solid ${tab === t.key ? theme.purple + '40' : theme.border}`,
                background: tab === t.key ? `${theme.purple}10` : theme.surface,
                color: tab === t.key ? theme.purple : theme.textSecondary,
                fontSize: 14, fontWeight: 700,
                cursor: 'pointer',
                fontFamily: theme.fontFamily,
              }}
            >
              {t.label}
            </button>
          ))}
          {selectedUser && (
            <button
              style={{
                padding: '10px 20px',
                borderRadius: theme.radiusMd,
                border: `1px solid ${theme.purple}40`,
                background: `${theme.purple}10`,
                color: theme.purple,
                fontSize: 14, fontWeight: 700,
                cursor: 'default',
                fontFamily: theme.fontFamily,
              }}
            >
              User Detail
            </button>
          )}
        </div>

        {loading && <div style={{ textAlign: 'center', padding: 40, color: theme.textMuted }}>Loading...</div>}

        {/* ─── USERS LIST ─── */}
        {!loading && tab === 'users' && (
          <div>
            <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, marginBottom: 16, fontWeight: 700 }}>
              {users.length} PLAYER{users.length !== 1 ? 'S' : ''}
            </div>
            {users.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: theme.textMuted }}>No players yet.</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {users.map(u => {
                const gs = u.game_state?.[0] || u.game_state || {};
                return (
                  <div
                    key={u.id}
                    onClick={() => openUserDetail(u.id)}
                    style={{
                      background: theme.surface,
                      border: `1px solid ${theme.border}`,
                      borderRadius: theme.radiusMd,
                      padding: '16px 20px',
                      cursor: 'pointer',
                      boxShadow: theme.shadow,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = theme.shadowMd; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = theme.shadow; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 17, fontWeight: 700 }}>{u.display_name}</div>
                        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>
                          Joined {new Date(u.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: theme.xp, fontWeight: 800, fontSize: 16 }}>{gs.xp ?? 0}</div>
                          <div style={{ color: theme.textMuted, fontWeight: 700 }}>XP</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: theme.info, fontWeight: 800, fontSize: 16 }}>{gs.status_score ?? 0}</div>
                          <div style={{ color: theme.textMuted, fontWeight: 700 }}>STATUS</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: theme.accent, fontWeight: 800, fontSize: 16 }}>{(gs.completed_scenarios || []).length}</div>
                          <div style={{ color: theme.textMuted, fontWeight: 700 }}>DONE</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── USER DETAIL ─── */}
        {!loading && tab === 'detail' && userDetail && (
          <div>
            <button
              onClick={() => { setTab('users'); setSelectedUser(null); }}
              style={{
                background: 'none', border: 'none',
                color: theme.textSecondary, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', padding: '4px 0', marginBottom: 12,
                fontFamily: theme.fontFamily,
              }}
            >
              {"←"} Back to Users
            </button>

            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 16 }}>
              {userDetail.profile.display_name}
            </h2>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
              <MiniStatCard label="Energy" value={userDetail.gameState.energy} color={theme.accent} />
              <MiniStatCard label="XP" value={userDetail.gameState.xp} color={theme.xp} />
              <MiniStatCard label="Status" value={userDetail.gameState.status_score} color={theme.info} />
              <MiniStatCard label="Completed" value={(userDetail.gameState.completed_scenarios || []).length} color={theme.purple} />
            </div>

            {/* Reputation */}
            {Object.keys(userDetail.gameState.reputation || {}).length > 0 && (
              <div style={{
                marginBottom: 20, padding: '14px 18px',
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: theme.radiusMd,
              }}>
                <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, marginBottom: 8, fontWeight: 700 }}>REPUTATION</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {Object.entries(userDetail.gameState.reputation).map(([tag, count]) => (
                    <span key={tag} style={{
                      padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: `${theme.accent}12`, color: theme.accent,
                    }}>
                      {tag} x{count}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Assign button */}
            <button
              onClick={() => setAssignModal(true)}
              style={{
                padding: '10px 20px', borderRadius: theme.radiusMd, marginBottom: 20,
                background: `${theme.purple}10`, border: `1px solid ${theme.purple}30`,
                color: theme.purple, fontSize: 14, fontWeight: 700,
                cursor: 'pointer', fontFamily: theme.fontFamily,
              }}
            >
              {"📋"} Assign Scenario
            </button>

            {/* Session History */}
            <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, marginBottom: 12, fontWeight: 700 }}>
              RECENT SESSIONS ({userDetail.sessions.length})
            </div>
            {userDetail.sessions.length === 0 && (
              <div style={{ color: theme.textMuted, fontSize: 14, padding: 20 }}>No sessions yet.</div>
            )}
            {userDetail.sessions.slice(0, 20).map(s => (
              <div key={s.id} style={{
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: theme.radiusSm,
                padding: '12px 16px',
                marginBottom: 8,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{s.scenario_title}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted }}>
                    {new Date(s.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>
                  Status: <span style={{ color: s.status_delta >= 0 ? theme.accent : theme.danger, fontWeight: 700 }}>
                    {s.status_delta > 0 ? '+' : ''}{s.status_delta}
                  </span>
                  {(s.reputation_tags || []).length > 0 && (
                    <span> {"·"} Tags: {s.reputation_tags.join(', ')}</span>
                  )}
                </div>
              </div>
            ))}

            {/* Admin Notes */}
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, marginBottom: 12, fontWeight: 700 }}>
                COACHING NOTES
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input
                  type="text"
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                  placeholder="Add a note..."
                  style={{
                    flex: 1, padding: '10px 14px',
                    borderRadius: theme.radiusSm,
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.textPrimary,
                    fontSize: 14, fontFamily: theme.fontFamily,
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleAddNote}
                  style={{
                    padding: '10px 16px', borderRadius: theme.radiusSm,
                    background: theme.accent, border: 'none',
                    color: '#fff', fontSize: 14, fontWeight: 700,
                    cursor: 'pointer', fontFamily: theme.fontFamily,
                  }}
                >
                  Add
                </button>
              </div>
              {userNotes.map(n => (
                <div key={n.id} style={{
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: theme.radiusSm,
                  padding: '10px 14px',
                  marginBottom: 6,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: 14 }}>{n.note}</div>
                    <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>
                      {new Date(n.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(n.id)}
                    style={{
                      background: 'none', border: 'none',
                      color: theme.textMuted, fontSize: 16, cursor: 'pointer',
                    }}
                  >{"×"}</button>
                </div>
              ))}
            </div>

            {/* Assign Modal */}
            {assignModal && (
              <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 100,
              }}>
                <div style={{
                  background: theme.surface,
                  borderRadius: theme.radiusMd,
                  padding: '24px',
                  width: '90%', maxWidth: 500, maxHeight: '70vh', overflow: 'auto',
                  boxShadow: theme.shadowLg,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800 }}>Assign Scenario</h3>
                    <button onClick={() => setAssignModal(false)} style={{
                      background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: theme.textMuted,
                    }}>{"×"}</button>
                  </div>
                  {allScenarios.map(sc => (
                    <div
                      key={sc.id}
                      onClick={() => handleAssign(sc.id, sc.chapterId)}
                      style={{
                        padding: '12px 16px', marginBottom: 6,
                        background: theme.bg, border: `1px solid ${theme.border}`,
                        borderRadius: theme.radiusSm, cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = theme.purple + '40'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{sc.title}</div>
                      <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
                        {sc.levelTitle} {">"} {sc.chapterTitle}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── UNLOCK REQUESTS ─── */}
        {!loading && tab === 'requests' && (
          <div>
            <div style={{ fontSize: 11, color: theme.textSecondary, letterSpacing: 2, marginBottom: 16, fontWeight: 700 }}>
              UNLOCK REQUESTS
            </div>
            {unlockRequests.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: theme.textMuted }}>No unlock requests.</div>
            )}
            {unlockRequests.map(r => (
              <div key={r.id} style={{
                background: theme.surface,
                border: `1px solid ${r.status === 'pending' ? theme.purple + '30' : theme.border}`,
                borderRadius: theme.radiusMd,
                padding: '16px 20px',
                marginBottom: 10,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>
                      {r.profiles?.display_name || 'Unknown User'}
                    </div>
                    <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 2 }}>
                      Wants more scenarios for <strong>{r.chapter_id}</strong>
                    </div>
                    <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>
                      {new Date(r.created_at).toLocaleDateString()}
                      {r.status !== 'pending' && (
                        <span style={{
                          marginLeft: 8, padding: '2px 8px', borderRadius: 10,
                          fontSize: 11, fontWeight: 700,
                          background: r.status === 'approved' ? `${theme.accent}15` : `${theme.danger}15`,
                          color: r.status === 'approved' ? theme.accent : theme.danger,
                        }}>
                          {r.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  {r.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleResolveRequest(r.id, 'approved')}
                        style={{
                          padding: '8px 16px', borderRadius: theme.radiusSm,
                          background: theme.accent, border: 'none',
                          color: '#fff', fontSize: 13, fontWeight: 700,
                          cursor: 'pointer', fontFamily: theme.fontFamily,
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleResolveRequest(r.id, 'denied')}
                        style={{
                          padding: '8px 16px', borderRadius: theme.radiusSm,
                          background: 'transparent', border: `1px solid ${theme.border}`,
                          color: theme.textMuted, fontSize: 13, fontWeight: 700,
                          cursor: 'pointer', fontFamily: theme.fontFamily,
                        }}
                      >
                        Deny
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStatCard({ label, value, color }) {
  return (
    <div style={{
      background: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: theme.radiusMd,
      padding: '14px 16px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 700, marginTop: 4 }}>{label}</div>
    </div>
  );
}
