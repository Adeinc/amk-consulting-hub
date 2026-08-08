-- ============================================================================
-- MS-001 AMK Consulting Hub — Auto-create profile on sign-up
-- ============================================================================
-- Standard Supabase pattern: a trigger on auth.users, not a client-side second
-- insert, so a profile can never end up missing if the client call after
-- signUp() fails/is interrupted. full_name comes from the signUp() call's
-- options.data.full_name (stored in auth.users.raw_user_meta_data by Supabase
-- Auth itself). New users default to role='practitioner' and get a matching
-- practitioners row too, since that's every self-registered user today —
-- admin accounts are provisioned separately, not through public sign-up.
-- ============================================================================

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), 'practitioner');

  insert into public.practitioners (id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
