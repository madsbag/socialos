// SocialOS — Login / Sign Up Screen
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!displayName.trim()) {
          setError('Please enter a display name');
          setLoading(false);
          return;
        }
        await signUp(email, password, displayName.trim());
        setSignUpSuccess(true);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
    setLoading(false);
  }

  if (signUpSuccess) {
    return (
      <div style={{
        minHeight: '100vh',
        background: theme.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.fontFamily,
        padding: 20,
      }}>
        <div style={{
          width: '100%',
          maxWidth: 400,
          background: theme.surface,
          borderRadius: theme.radiusMd,
          padding: '40px 32px',
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadowMd,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>{"✓"}</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: theme.accent, margin: '0 0 12px' }}>
            Account Created!
          </h2>
          <p style={{ fontSize: 15, color: theme.textSecondary, lineHeight: 1.6, marginBottom: 24 }}>
            Check your email for a confirmation link, then sign in below.
          </p>
          <button
            onClick={() => { setSignUpSuccess(false); setMode('signin'); }}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: theme.radiusMd,
              background: theme.accent,
              border: 'none',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: theme.fontFamily,
            }}
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: theme.fontFamily,
      padding: 20,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: theme.surface,
        borderRadius: theme.radiusMd,
        padding: '40px 32px',
        border: `1px solid ${theme.border}`,
        boxShadow: theme.shadowMd,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{
            fontSize: 36, fontWeight: 800,
            color: theme.textPrimary,
            margin: '0 0 6px',
          }}>
            Social<span style={{ color: theme.accent }}>OS</span>
          </h1>
          <p style={{ color: theme.textSecondary, fontSize: 14, margin: 0 }}>
            Social Intelligence Simulator
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex',
          background: theme.bg,
          borderRadius: theme.radiusSm,
          padding: 3,
          marginBottom: 24,
        }}>
          <button
            onClick={() => { setMode('signin'); setError(''); }}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: theme.radiusSm,
              border: 'none',
              background: mode === 'signin' ? theme.surface : 'transparent',
              color: mode === 'signin' ? theme.textPrimary : theme.textMuted,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: theme.fontFamily,
              boxShadow: mode === 'signin' ? theme.shadow : 'none',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); }}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: theme.radiusSm,
              border: 'none',
              background: mode === 'signup' ? theme.surface : 'transparent',
              color: mode === 'signup' ? theme.textPrimary : theme.textMuted,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: theme.fontFamily,
              boxShadow: mode === 'signup' ? theme.shadow : 'none',
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                color: theme.textSecondary,
                fontWeight: 700,
                letterSpacing: 1,
                marginBottom: 6,
              }}>
                DISPLAY NAME
              </label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Your name"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: theme.radiusSm,
                  border: `1px solid ${theme.border}`,
                  background: theme.bg,
                  color: theme.textPrimary,
                  fontSize: 15,
                  fontFamily: theme.fontFamily,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              color: theme.textSecondary,
              fontWeight: 700,
              letterSpacing: 1,
              marginBottom: 6,
            }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: theme.radiusSm,
                border: `1px solid ${theme.border}`,
                background: theme.bg,
                color: theme.textPrimary,
                fontSize: 15,
                fontFamily: theme.fontFamily,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 12,
              color: theme.textSecondary,
              fontWeight: 700,
              letterSpacing: 1,
              marginBottom: 6,
            }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'Min 6 characters' : 'Your password'}
              required
              minLength={mode === 'signup' ? 6 : undefined}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: theme.radiusSm,
                border: `1px solid ${theme.border}`,
                background: theme.bg,
                color: theme.textPrimary,
                fontSize: 15,
                fontFamily: theme.fontFamily,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{
              marginBottom: 16,
              padding: '10px 14px',
              background: `${theme.danger}10`,
              border: `1px solid ${theme.danger}30`,
              borderRadius: theme.radiusSm,
              fontSize: 13,
              color: theme.danger,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: theme.radiusMd,
              background: loading ? theme.textMuted : theme.accent,
              border: 'none',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? 'default' : 'pointer',
              fontFamily: theme.fontFamily,
              boxShadow: `0 4px 12px ${theme.accent}30`,
            }}
          >
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
