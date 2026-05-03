-- 🚀 SUPABASE SQL SCHEMA EXTENSION FOR STUDYFLOW
-- Este script adiciona as tabelas faltantes para as funcionalidades avançadas

-- 1. Document Analysis Table
CREATE TABLE IF NOT EXISTS docs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  analysis_summary TEXT,
  topics JSONB DEFAULT '[]'::jsonb,
  flashcards JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Video Summaries Table
CREATE TABLE IF NOT EXISTS video_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  video_url TEXT NOT NULL,
  title TEXT,
  summary TEXT,
  topics JSONB DEFAULT '[]'::jsonb,
  flashcards JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Memory Palace Tables
CREATE TABLE IF NOT EXISTS memory_palaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS memory_palace_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  palace_id UUID REFERENCES memory_palaces ON DELETE CASCADE NOT NULL,
  concept TEXT NOT NULL,
  association TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Community Feed Tables
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  media_url TEXT,
  type TEXT DEFAULT 'status', -- status, achievement, question
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS likes (
  post_id UUID REFERENCES posts ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (post_id, user_id)
);

-- 5. Socratic Duel Tables (Matchmaking & Turns)
CREATE TABLE IF NOT EXISTS duels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  status TEXT DEFAULT 'waiting', -- waiting, active, finished
  player1_id UUID REFERENCES auth.users NOT NULL,
  player2_id UUID REFERENCES auth.users, -- can be null while waiting
  winner_id UUID REFERENCES auth.users,
  turns_count INTEGER DEFAULT 0,
  max_turns INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS duel_turns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  duel_id UUID REFERENCES duels ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  analytical_score INTEGER DEFAULT 0,
  ai_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 🛡️ RLS POLICIES FOR NEW TABLES

-- Enable RLS
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_palaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_palace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE duels ENABLE ROW LEVEL SECURITY;
ALTER TABLE duel_turns ENABLE ROW LEVEL SECURITY;

-- Personal Data Policies
CREATE POLICY "Docs access" ON docs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Video access" ON video_summaries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Palace access" ON memory_palaces FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Palace items access" ON memory_palace_items FOR ALL USING (
  EXISTS (SELECT 1 FROM memory_palaces WHERE id = palace_id AND user_id = auth.uid())
);

-- Community Policies (Public Read, Own Write)
CREATE POLICY "View posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Delete posts" ON posts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "View comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "View likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Toggle likes" ON likes FOR ALL USING (auth.uid() = user_id);

-- Duel Policies (Participant access)
CREATE POLICY "Duel visibility" ON duels FOR SELECT USING (true); -- everyone can see open duels to join
CREATE POLICY "Join or create duel" ON duels FOR ALL USING (auth.uid() = player1_id OR auth.uid() = player2_id OR status = 'waiting');
CREATE POLICY "Duel turns access" ON duel_turns FOR ALL USING (
  EXISTS (SELECT 1 FROM duels WHERE id = duel_id AND (player1_id = auth.uid() OR player2_id = auth.uid()))
);

-- 6. Study Room Messages
CREATE TABLE IF NOT EXISTS room_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE room_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View room messages" ON room_messages FOR SELECT USING (true);
CREATE POLICY "Post room messages" ON room_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create storage buckets for uploads
-- Note: These often need to be created via Dashboard or specific API, but this SQL serves as a reference for policies

-- Buckets: 'profile-assets', 'study-docs', 'post-media'

-- Policy for profile-assets (Public read, Own update)
-- (Assuming bucket 'profile-assets' exists)
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-assets', 'profile-assets', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('study-docs', 'study-docs', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('post-media', 'post-media', true) ON CONFLICT DO NOTHING;

-- profile-assets policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'profile-assets');
CREATE POLICY "Users can upload own profile assets" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'profile-assets' AND (auth.uid())::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can update own profile assets" ON storage.objects FOR UPDATE USING (
  bucket_id = 'profile-assets' AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- study-docs policies
CREATE POLICY "Users can manage own docs" ON storage.objects FOR ALL USING (
  bucket_id = 'study-docs' AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- post-media policies
CREATE POLICY "Public post media access" ON storage.objects FOR SELECT USING (bucket_id = 'post-media');
CREATE POLICY "Users can upload post media" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'post-media' AND (auth.uid())::text = (storage.foldername(name))[1]
);
