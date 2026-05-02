-- 📋 SUPABASE SQL SCHEMA FOR STUDYFLOW

-- 1. Users Profile Table (Extensions for Supabase Auth)
CREATE TABLE users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT DEFAULT 'Focado na aprovação! 🚀',
  profile_pic TEXT,
  cover_pic TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  league TEXT DEFAULT 'Bronze',
  daily_xp INTEGER DEFAULT 0,
  last_study_date DATE,
  daily_goal_minutes INTEGER DEFAULT 120,
  coins INTEGER DEFAULT 0,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Study Sessions Table
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  duration INTEGER NOT NULL,
  subject TEXT NOT NULL
);

-- 3. Decks Table
CREATE TABLE decks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  card_count INTEGER DEFAULT 0,
  new_cards INTEGER DEFAULT 0,
  review_cards INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Flashcards Table
CREATE TABLE flashcards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  deck_id UUID REFERENCES decks ON DELETE CASCADE NOT NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  subject TEXT NOT NULL,
  level TEXT DEFAULT 'Novo',
  interval INTEGER DEFAULT 0,
  next_review TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  last_reviewed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Notes Table
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  subject TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Chat Sessions Table
CREATE TABLE chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  agent_id TEXT NOT NULL,
  title TEXT NOT NULL,
  last_message TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Messages Table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  role TEXT NOT NULL,
  text TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  data JSONB DEFAULT '{}'::jsonb,
  engine TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Question History Table
CREATE TABLE history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  question_id TEXT NOT NULL,
  user_answer INTEGER,
  is_correct BOOLEAN NOT NULL,
  time_spent INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Study Rooms Table
CREATE TABLE study_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  audio TEXT,
  color TEXT,
  icon TEXT,
  current_video_lesson TEXT,
  video_started_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Room Messages Table
CREATE TABLE room_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES study_rooms ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  text TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Room Presence Table
CREATE TABLE room_presence (
  room_id UUID REFERENCES study_rooms ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  status TEXT DEFAULT 'focando',
  time_str TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  last_ping TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (room_id, user_id)
);

-- 🛡️ ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_presence ENABLE ROW LEVEL SECURITY;

-- users: users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
-- allow public reading for leaderboard
CREATE POLICY "Leaderboard visibility" ON users FOR SELECT USING (true);

-- general user_id policy for personal data
CREATE POLICY "Own data access" ON sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own data access" ON decks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own data access" ON flashcards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own data access" ON notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own data access" ON chat_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own data access" ON messages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own data access" ON history FOR ALL USING (auth.uid() = user_id);

-- Study Rooms: everyone can see rooms
CREATE POLICY "Public room access" ON study_rooms FOR SELECT USING (true);

-- Room Messages: everyone can see, authenticated can send
CREATE POLICY "View messages" ON room_messages FOR SELECT USING (true);
CREATE POLICY "Send messages" ON room_messages FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Room Presence: everyone can see, authenticated can update own
CREATE POLICY "View presence" ON room_presence FOR SELECT USING (true);
CREATE POLICY "Update own presence" ON room_presence FOR ALL USING (auth.uid() = user_id);

-- 12. Usage Table
CREATE TABLE usage (
  id TEXT PRIMARY KEY, -- Format: user_id_YYYY-MM-DD
  user_id UUID REFERENCES auth.users NOT NULL,
  count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own usage access" ON usage FOR SELECT USING (auth.uid() = user_id);
