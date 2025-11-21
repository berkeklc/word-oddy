-- Create a table for public profiles
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text,
  website text,
  
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Create a table for game progress
create table if not exists game_progress (
  user_id uuid references auth.users not null primary key,
  high_score integer default 0,
  max_level integer default 0,
  total_words integer default 0,
  games_played integer default 0,
  tutorial_complete boolean default false,
  inventory jsonb default '{"clear": 3}'::jsonb,
  max_combo integer default 0,
  current_combo integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table game_progress enable row level security;

drop policy if exists "Users can view own progress." on game_progress;
create policy "Users can view own progress." on game_progress for select using (auth.uid() = user_id);

drop policy if exists "Users can update own progress." on game_progress;
create policy "Users can update own progress." on game_progress for update using (auth.uid() = user_id);

drop policy if exists "Users can insert own progress." on game_progress;
create policy "Users can insert own progress." on game_progress for insert with check (auth.uid() = user_id);

-- Add combo columns if they don't exist (migration)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='game_progress' AND column_name='max_combo') THEN
        ALTER TABLE game_progress ADD COLUMN max_combo integer default 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='game_progress' AND column_name='current_combo') THEN
        ALTER TABLE game_progress ADD COLUMN current_combo integer default 0;
    END IF;
END $$;

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  
  insert into public.game_progress (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
