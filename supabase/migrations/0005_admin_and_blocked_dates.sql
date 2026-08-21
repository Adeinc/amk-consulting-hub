-- ============================================================================
-- MS-001 AMK Consulting Hub — Admin Dashboard support (Milestone 6)
-- ============================================================================
-- * profiles.email: the admin practitioners list needs to show who someone is
--   by email (names alone can collide). The client can never safely call
--   supabase.auth.admin.* (service-role only), so the cheapest correct fix is
--   mirroring auth.users.email onto profiles at signup time via the existing
--   handle_new_user() trigger. No backfill — no real practitioners exist yet.
-- * prevent_blocked_date_booking: blocked_dates has existed since 0001_init.sql
--   but was never enforced — nothing stopped a booking on a date Freda blocks.
--   Same database-trigger pattern as prevent_full_day_conflicts, for the same
--   reason: race-safety, not just a first-check-then-insert app-side check.
-- ============================================================================

alter table profiles add column email text;

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

create trigger trg_prevent_blocked_date_booking
  before insert on bookings
  for each row execute function prevent_blocked_date_booking();
