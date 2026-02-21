-- SocialOS — Initial Database Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)

-- ─── Profiles (extends auth.users) ──────────────────────────────────
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT NOT NULL DEFAULT 'Player',
  role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('player', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Game State ─────────────────────────────────────────────────────
CREATE TABLE public.game_state (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  energy INTEGER NOT NULL DEFAULT 100,
  xp INTEGER NOT NULL DEFAULT 0,
  status_score INTEGER NOT NULL DEFAULT 0,
  reputation JSONB NOT NULL DEFAULT '{}',
  completed_scenarios TEXT[] NOT NULL DEFAULT '{}',
  flashcard_progress JSONB NOT NULL DEFAULT '{}',
  onboarding_seen BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Generated Scenarios ────────────────────────────────────────────
CREATE TABLE public.generated_scenarios (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  chapter_id TEXT NOT NULL,
  scenario_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Session History ────────────────────────────────────────────────
CREATE TABLE public.session_history (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  scenario_id TEXT NOT NULL,
  scenario_title TEXT NOT NULL,
  choices JSONB NOT NULL,
  status_delta INTEGER NOT NULL DEFAULT 0,
  reputation_tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Admin Notes ────────────────────────────────────────────────────
CREATE TABLE public.admin_notes (
  id TEXT PRIMARY KEY,
  admin_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  target_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Assigned Scenarios ─────────────────────────────────────────────
CREATE TABLE public.assigned_scenarios (
  id SERIAL PRIMARY KEY,
  admin_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  target_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  scenario_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  note TEXT DEFAULT '',
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  assigned_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Unlock Requests ────────────────────────────────────────────────
CREATE TABLE public.unlock_requests (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  chapter_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  admin_id UUID REFERENCES public.profiles(id),
  extra_slots INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- ─── Row Level Security ─────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assigned_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unlock_requests ENABLE ROW LEVEL SECURITY;

-- Players: read/write own data
CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users manage own game_state" ON public.game_state
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own generated_scenarios" ON public.generated_scenarios
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own session_history" ON public.session_history
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users read own assignments" ON public.assigned_scenarios
  FOR SELECT USING (auth.uid() = target_user_id);
CREATE POLICY "Users update own assignments" ON public.assigned_scenarios
  FOR UPDATE USING (auth.uid() = target_user_id);

CREATE POLICY "Users read own unlock_requests" ON public.unlock_requests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create unlock_requests" ON public.unlock_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin role check (SECURITY DEFINER bypasses RLS to avoid infinite recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Admins: read/write all (using is_admin() to avoid RLS recursion)
CREATE POLICY "Admins read all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins read all game_state" ON public.game_state
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins read all session_history" ON public.session_history
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins manage notes" ON public.admin_notes
  FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage assignments" ON public.assigned_scenarios
  FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage unlock_requests" ON public.unlock_requests
  FOR ALL USING (public.is_admin());
CREATE POLICY "Admins read all generated_scenarios" ON public.generated_scenarios
  FOR SELECT USING (public.is_admin());

-- ─── Auto-create profile + game_state on signup ─────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Player'),
    'player'
  );
  INSERT INTO public.game_state (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
