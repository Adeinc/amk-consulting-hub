-- ============================================================================
-- MS-001 AMK Consulting Hub — Admin Dashboard support (Milestone 6)
-- ============================================================================
-- * profiles.email: the admin practitioners list needs to show who someone is
--   by email (names alone can collide). The client can never safely call
--   supabase.auth.admin.* (service-role only), so the cheapest correct fix is
--   mirroring auth.users.email onto profiles at signup time via the existing
--   handle_new_user() trigger, plus a one-time backfill from auth.users for
--   any rows that predate this migration.
-- * prevent_blocked_date_booking: blocked_dates has existed since 0001_init.sql
--   but was never enforced — nothing stopped a booking on a date Freda blocks.
--   Same database-trigger pattern as prevent_full_day_conflicts, for the same
--   reason: race-safety, not just a first-check-then-insert app-side check.
-- * prevent_role_self_escalation: found live, 23 Aug 2026, while QA-testing the
--   admin build — profiles_update_own_or_admin (0001_init.sql) lets a user
--   update their own row (id = auth.uid()), but the policy has no column-level
--   restriction, so any signed-up practitioner could set their own role to
--   'admin' with a single client-side update call. Confirmed exploitable, not
--   theoretical. This trigger silently reverts role to its prior value on any
--   update from a non-admin, so the existing "own row" RLS ergonomics for
--   full_name/phone stay unchanged while role itself is admin-only.
-- * trg_settings_updated_at: settings has an updated_at column but was missing
--   from 0001_init.sql's list of tables wired to set_updated_at() — found
--   live when a real settings save didn't move the timestamp. Same trigger
--   function every other table already uses.
-- ============================================================================

begin;

alter table profiles add column if not exists email text;

-- Backfill existing rows (any real practitioners signed up before this migration)
-- from the authoritative source, auth.users. Only fills nulls — never overwrites.
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and p.email is null;

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), new.email, 'practitioner');

  insert into public.practitioners (id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer set search_path = public;

create or replace function prevent_blocked_date_booking()
returns trigger as $$
begin
  if new.status not in ('pending', 'confirmed') then
    return new;
  end if;

  if exists (
    select 1 from blocked_dates
    where (room_id = new.room_id or room_id is null)
      and new.booking_date between start_date and end_date
  ) then
    raise exception 'This date is blocked and not available for booking';
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_prevent_blocked_date_booking on bookings;
create trigger trg_prevent_blocked_date_booking
  before insert on bookings
  for each row execute function prevent_blocked_date_booking();

create or replace function prevent_role_self_escalation()
returns trigger as $$
begin
  if new.role is distinct from old.role and not is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_prevent_role_self_escalation on profiles;
create trigger trg_prevent_role_self_escalation
  before update on profiles
  for each row execute function prevent_role_self_escalation();

drop trigger if exists trg_settings_updated_at on settings;
create trigger trg_settings_updated_at
  before update on settings
  for each row execute function set_updated_at();

commit;
