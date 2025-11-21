
-- 1. Add missing columns to game_progress (if they don't exist)
alter table game_progress 
add column if not exists creative_high_score bigint default 0,
add column if not exists creative_max_level int default 1,
add column if not exists max_combo int default 0,
add column if not exists current_combo int default 0;

-- 2. Ensure Profiles table exists
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text,
  website text,
  constraint username_length check (char_length(username) >= 3)
);

-- 3. Create a Mock Users table for the Leaderboard (to show dummy data without needing real auth users)
create table if not exists mock_leaderboard (
    id uuid default gen_random_uuid() primary key,
    username text unique,
    avatar_url text,
    high_score bigint default 0,
    max_level int default 0,
    creative_high_score bigint default 0,
    creative_max_level int default 1,
    updated_at timestamp with time zone default now()
);

-- Enable RLS on mock_leaderboard (Public Read-Only)
alter table mock_leaderboard enable row level security;
drop policy if exists "Mock leaderboard is viewable by everyone" on mock_leaderboard;
create policy "Mock leaderboard is viewable by everyone" on mock_leaderboard for select using (true);

-- 4. Update Leaderboard View to combine Real Users and Mock Users
create or replace view leaderboard as
  select 
    p.username,
    p.avatar_url,
    gp.high_score,
    gp.max_level,
    gp.creative_high_score,
    gp.creative_max_level,
    gp.updated_at
  from profiles p
  join game_progress gp on p.id = gp.user_id
  
  UNION ALL
  
  select 
    username,
    avatar_url,
    high_score,
    max_level,
    creative_high_score,
    creative_max_level,
    updated_at
  from mock_leaderboard;

-- 5. Insert Dummy Data into Mock Leaderboard
insert into mock_leaderboard (username, avatar_url, high_score, max_level, creative_high_score, creative_max_level)
values 
('WordMaster99', '🧙‍♂️', 15000, 12, 5000, 5),
('PuzzleQueen', '👑', 12500, 10, 8000, 8),
('SpeedDemon', '⚡', 9000, 8, 3000, 3)
on conflict (username) do update 
set high_score = EXCLUDED.high_score, 
    creative_high_score = EXCLUDED.creative_high_score;

-- 6. Fix RLS Policies for Real Tables (Just in case)
alter table profiles enable row level security;
alter table game_progress enable row level security;

drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles for select using ( true );

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );

drop policy if exists "Game progress is viewable by everyone." on game_progress;
create policy "Game progress is viewable by everyone." on game_progress for select using ( true );

drop policy if exists "Users can insert their own progress." on game_progress;
create policy "Users can insert their own progress." on game_progress for insert with check ( auth.uid() = user_id );

drop policy if exists "Users can update own progress." on game_progress;
create policy "Users can update own progress." on game_progress for update using ( auth.uid() = user_id );
