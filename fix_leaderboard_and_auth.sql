-- 1. Ensure game_progress is publicly readable for the leaderboard
ALTER TABLE game_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Game progress is viewable by everyone." ON game_progress;
CREATE POLICY "Game progress is viewable by everyone." ON game_progress FOR SELECT USING (true);

-- 2. Ensure profiles is publicly readable for the leaderboard
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);

-- 3. Create or replace the leaderboard view
-- We must DROP the view first because we might be changing column types (e.g. bigint vs integer)
DROP VIEW IF EXISTS leaderboard;

CREATE OR REPLACE VIEW leaderboard AS
  SELECT 
    p.username,
    p.avatar_url,
    gp.high_score,
    gp.max_level,
    gp.creative_high_score,
    gp.creative_max_level,
    gp.updated_at
  FROM profiles p
  JOIN game_progress gp ON p.id = gp.user_id;

-- 4. Grant permissions to anonymous and authenticated users
GRANT SELECT ON leaderboard TO anon, authenticated;
GRANT SELECT ON game_progress TO anon, authenticated;
GRANT SELECT ON profiles TO anon, authenticated;
