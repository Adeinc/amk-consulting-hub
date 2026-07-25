-- ============================================================================
-- MS-001 AMK Consulting Hub — Initial Schema
-- Monedela Software
-- ============================================================================
-- Updated per the 21 Jul 2026 Planning & Confirmation Pack:
--   * business_name default changed from 'MediSpace' to 'AMK Consulting Hub'.
--   * auto_confirm_on_payment now defaults to true (locked decision: bookings
--     auto-confirm on payment, no manual admin approval step).
--   * Practitioner credentials are a self-declared Yes/No attestation, not an
--     uploaded document — practitioners.credentials_attested replaces the
--     original documents table's file-upload/review workflow entirely.
--
-- Notes:
--   * Every table has RLS enabled. There is no "trusted client" assumption.
--   * auth.uid() is used throughout to scope practitioner access to their
--     own data; admin access is granted via profiles.role = 'admin'.
--   * Booking conflict prevention is enforced at the database layer via a
--     partial unique index, not just application logic, because two
--     practitioners can race to book the same slot.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- profiles: one row per authenticated user (practitioner or admin)
-- Mirrors auth.users, extended with role and contact info.
-- ----------------------------------------------------------------------------
create type user_role as enum ('practitioner', 'admin');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'practitioner',
  full_name text not null,
  phone text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table profiles is 'One row per Supabase auth user. Role drives both UI routing and RLS.';

-- ----------------------------------------------------------------------------
-- practitioners: profession-specific detail, 1:1 with profiles where role = practitioner
-- ----------------------------------------------------------------------------
create table practitioners (
  id uuid primary key references profiles(id) on delete cascade,
  profession text,
  registration_number text,
  bio text,
  -- Self-declared Yes/No attestation (21 Jul 2026 pack) — not a reviewed document upload.
  credentials_attested boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column practitioners.credentials_attested is
  'Practitioner self-declares they hold valid credentials/insurance. No document is uploaded or reviewed.';

-- ----------------------------------------------------------------------------
-- rooms
-- ----------------------------------------------------------------------------
create table rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  amenities text[] not null default '{}',
  price_am numeric(10,2) not null check (price_am >= 0),
  price_pm numeric(10,2) not null check (price_pm >= 0),
  price_full_day numeric(10,2) not null check (price_full_day >= 0),
  is_active boolean not null default true,
  display_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table room_images (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  display_order smallint not null default 0,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- bookings
-- ----------------------------------------------------------------------------
create type session_type as enum ('am', 'pm', 'full_day');
create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');

create table bookings (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id),
  practitioner_id uuid not null references practitioners(id),
  booking_date date not null,
  session_type session_type not null,
  status booking_status not null default 'pending',
  price numeric(10,2) not null check (price >= 0),
  notes text,
  cancelled_reason text,
  cancelled_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Prevent double-booking at the database layer.
-- A room can only have one ACTIVE (pending/confirmed) booking per date+session.
-- Full-day bookings are validated against AM/PM conflicts via the trigger below,
-- since a partial unique index alone can't express "full_day blocks am and pm".
create unique index bookings_no_overlap
  on bookings (room_id, booking_date, session_type)
  where status in ('pending', 'confirmed');

create or replace function prevent_full_day_conflicts()
returns trigger as $$
begin
  if new.status not in ('pending', 'confirmed') then
    return new;
  end if;

  if new.session_type = 'full_day' then
    if exists (
      select 1 from bookings
      where room_id = new.room_id
        and booking_date = new.booking_date
        and status in ('pending', 'confirmed')
        and id <> new.id
        and session_type in ('am', 'pm', 'full_day')
    ) then
      raise exception 'Room already has a conflicting booking on this date';
    end if;
  else
    if exists (
      select 1 from bookings
      where room_id = new.room_id
        and booking_date = new.booking_date
        and status in ('pending', 'confirmed')
        and id <> new.id
        and session_type = 'full_day'
    ) then
      raise exception 'Room is booked full-day on this date';
    end if;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger trg_prevent_full_day_conflicts
  before insert or update on bookings
  for each row execute function prevent_full_day_conflicts();

-- ----------------------------------------------------------------------------
-- blocked_dates
-- ----------------------------------------------------------------------------
create table blocked_dates (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade, -- null = applies to all rooms
  start_date date not null,
  end_date date not null check (end_date >= start_date),
  reason text,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- payments
-- ----------------------------------------------------------------------------
create type payment_status as enum ('pending', 'succeeded', 'failed', 'refunded', 'partially_refunded');

create table payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id),
  stripe_payment_intent_id text unique,
  amount numeric(10,2) not null check (amount >= 0),
  currency text not null default 'gbp',
  status payment_status not null default 'pending',
  refunded_amount numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- notifications
-- ----------------------------------------------------------------------------
create table notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  read_at timestamptz,
  related_booking_id uuid references bookings(id),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- settings (single-row config table, admin-editable)
-- ----------------------------------------------------------------------------
create table settings (
  id boolean primary key default true check (id), -- enforces single row
  business_name text not null default 'AMK Consulting Hub',
  cancellation_window_hours integer not null default 48,
  auto_confirm_on_payment boolean not null default true,
  business_hours jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into settings (id) values (true);

-- ----------------------------------------------------------------------------
-- audit_logs
-- ----------------------------------------------------------------------------
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table profiles enable row level security;
alter table practitioners enable row level security;
alter table rooms enable row level security;
alter table room_images enable row level security;
alter table bookings enable row level security;
alter table blocked_dates enable row level security;
alter table payments enable row level security;
alter table notifications enable row level security;
alter table settings enable row level security;
alter table audit_logs enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer;

-- profiles: users see/edit their own row; admins see/edit all
create policy "profiles_select_own_or_admin" on profiles
  for select using (id = auth.uid() or is_admin());
create policy "profiles_update_own_or_admin" on profiles
  for update using (id = auth.uid() or is_admin());

-- practitioners: owner + admin
create policy "practitioners_select_own_or_admin" on practitioners
  for select using (id = auth.uid() or is_admin());
create policy "practitioners_update_own_or_admin" on practitioners
  for update using (id = auth.uid() or is_admin());
create policy "practitioners_insert_own" on practitioners
  for insert with check (id = auth.uid());

-- rooms + room_images: public read (active rooms), admin write
create policy "rooms_public_read_active" on rooms
  for select using (is_active = true or is_admin());
create policy "rooms_admin_write" on rooms
  for all using (is_admin()) with check (is_admin());

create policy "room_images_public_read" on room_images
  for select using (true);
create policy "room_images_admin_write" on room_images
  for all using (is_admin()) with check (is_admin());

-- bookings: practitioners see/create their own; admins see/manage all
create policy "bookings_select_own_or_admin" on bookings
  for select using (practitioner_id = auth.uid() or is_admin());
create policy "bookings_insert_own" on bookings
  for insert with check (practitioner_id = auth.uid());
create policy "bookings_update_own_or_admin" on bookings
  for update using (practitioner_id = auth.uid() or is_admin());

-- blocked_dates: public read (needed to render availability), admin write
create policy "blocked_dates_public_read" on blocked_dates
  for select using (true);
create policy "blocked_dates_admin_write" on blocked_dates
  for all using (is_admin()) with check (is_admin());

-- payments: visible to the owning practitioner (via booking) and admin
create policy "payments_select_own_or_admin" on payments
  for select using (
    is_admin() or
    exists (select 1 from bookings b where b.id = payments.booking_id and b.practitioner_id = auth.uid())
  );
create policy "payments_admin_write" on payments
  for all using (is_admin()) with check (is_admin());

-- notifications: owner only
create policy "notifications_select_own" on notifications
  for select using (recipient_id = auth.uid());
create policy "notifications_update_own" on notifications
  for update using (recipient_id = auth.uid());

-- settings: public read (needed for e.g. cancellation window display), admin write
create policy "settings_public_read" on settings
  for select using (true);
create policy "settings_admin_write" on settings
  for update using (is_admin()) with check (is_admin());

-- audit_logs: admin only
create policy "audit_logs_admin_only" on audit_logs
  for select using (is_admin());
-- inserts happen via security-definer functions/triggers in application logic, not direct client writes

-- ============================================================================
-- updated_at maintenance trigger (reused across tables)
-- ============================================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated_at before update on profiles
  for each row execute function set_updated_at();
create trigger trg_practitioners_updated_at before update on practitioners
  for each row execute function set_updated_at();
create trigger trg_rooms_updated_at before update on rooms
  for each row execute function set_updated_at();
create trigger trg_bookings_updated_at before update on bookings
  for each row execute function set_updated_at();
create trigger trg_payments_updated_at before update on payments
  for each row execute function set_updated_at();
