-- COMPLETE FIX FOR AUTH TRIGGER
-- Run this entire script in the Supabase SQL Editor

-- 1. Drop existing trigger and function to ensure a clean slate
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 2. Recreate the function with robust error handling for anonymous users
create or replace function public.handle_new_user()
returns trigger as $$
declare
  default_username text;
begin
  -- Try to get username from metadata
  default_username := new.raw_user_meta_data->>'username';
  
  -- If no username (anonymous user), generate one like "Guest-1234abcd"
  if default_username is null or length(default_username) < 3 then
    default_username := 'Guest-' || substr(new.id::text, 1, 8);
  end if;

  -- Insert into profiles with the generated username
  -- Use ON CONFLICT DO NOTHING to prevent errors if profile already exists
  insert into public.profiles (id, username)
  values (new.id, default_username)
  on conflict (id) do nothing;
  
  -- Initialize game progress
  -- Use ON CONFLICT DO NOTHING to prevent errors if progress already exists
  insert into public.game_progress (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  
  return new;
end;
$$ language plpgsql security definer;

-- 3. Recreate the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. (Optional) Fix any existing users who might be missing profiles
-- This part attempts to backfill profiles for users who exist in auth.users but not in profiles
do $$
declare
  missing_user record;
begin
  for missing_user in 
    select id from auth.users 
    where id not in (select id from public.profiles)
  loop
    insert into public.profiles (id, username)
    values (missing_user.id, 'Guest-' || substr(missing_user.id::text, 1, 8))
    on conflict (id) do nothing;
    
    insert into public.game_progress (user_id)
    values (missing_user.id)
    on conflict (user_id) do nothing;
  end loop;
end;
$$;
