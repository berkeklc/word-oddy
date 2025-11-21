-- Update the handle_new_user function to handle anonymous users
-- This fixes the "Database error creating anonymous user" by ensuring a username is always present
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
  insert into public.profiles (id, username)
  values (new.id, default_username);
  
  -- Initialize game progress
  insert into public.game_progress (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;
