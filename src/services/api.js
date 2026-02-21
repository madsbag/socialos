// SocialOS — API Proxy Service
// Routes Anthropic API calls through Vercel serverless function
// so the API key stays server-side

import { supabase } from '../lib/supabase';

export async function callAnthropic({ system, messages, max_tokens = 1000 }) {
  // Get current auth token
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const response = await fetch('/api/anthropic-proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ system, messages, max_tokens }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  return response.json();
}
