-- ============================================================================
-- MS-001 AMK Consulting Hub — Booking Engine (Milestone 4)
-- ============================================================================
-- * booking_group_id: bookings.booking_date models one date per row. A multi-day
--   booking is N rows sharing one booking_group_id, so the existing per-day
--   conflict-prevention (bookings_no_overlap unique index + the full-day trigger
--   in 0001_init.sql) covers multi-day bookings with zero changes to that logic.
-- * enforce_booking_price: the schema's own design principle is "no trusted
--   client assumption", but nothing previously stopped a client insert from
--   setting bookings.price to anything. This trigger recomputes price
--   server-side from the room's real rate on every insert.
-- * Seed rooms: mirrors src/data/rooms.ts as of 2026-08-08. That file remains
--   the source of truth for display content (still client-unconfirmed
--   placeholder pricing/copy per its own header comment) — this seed exists so
--   bookings have a real room_id to reference and so price enforcement has a
--   real rate to enforce. Keeping the two in sync when pricing changes is a
--   manual step until Milestone 6 gives rooms an admin-editable home.
-- ============================================================================

alter table bookings add column booking_group_id uuid not null default gen_random_uuid();

create index bookings_group_id_idx on bookings (booking_group_id);

create or replace function enforce_booking_price()
returns trigger as $$
declare
  room_price numeric(10,2);
begin
  select case new.session_type
    when 'am' then price_am
    when 'pm' then price_pm
    when 'full_day' then price_full_day
  end into room_price
  from rooms
  where id = new.room_id;

  if room_price is null then
    raise exception 'Room not found or price unavailable for room_id %', new.room_id;
  end if;

  new.price := room_price;
  return new;
end;
$$ language plpgsql;

create trigger trg_enforce_booking_price
  before insert on bookings
  for each row execute function enforce_booking_price();

-- ----------------------------------------------------------------------------
-- Seed rooms (table is empty prior to this migration)
-- ----------------------------------------------------------------------------
insert into rooms (name, slug, description, amenities, price_am, price_pm, price_full_day, is_active, display_order)
values
  ('Oak Room', 'oak-room',
   'A quiet, naturally lit room suited to one-to-one consultation and talking therapies.',
   array['Couch', 'Sink', 'Storage', 'Natural light', 'Wi-Fi'],
   75, 75, 145, true, 1),
  ('Willow Room', 'willow-room',
   'Compact treatment room with easy access, suited to shorter clinical sessions.',
   array['Couch', 'Sink', 'Storage', 'Wi-Fi'],
   70, 70, 140, true, 2),
  ('Birch Room', 'birch-room',
   'Softer-toned room for talking therapy and counselling sessions.',
   array['Two armchairs', 'Side table', 'Natural light', 'Wi-Fi'],
   72, 72, 148, true, 3),
  ('Elm Room', 'elm-room',
   'Larger clinical room with additional bench space, one of two rooms that can combine.',
   array['Couch', 'Sink', 'Bench space', 'Storage', 'Wi-Fi'],
   95, 95, 180, true, 4),
  ('Ash Room', 'ash-room',
   'Adjoins the Elm Room to form a larger combined space for bigger sessions or equipment.',
   array['Couch', 'Sink', 'Bench space', 'Storage', 'Wi-Fi'],
   95, 95, 180, true, 5),
  ('Rowan Room', 'rowan-room',
   'Fully equipped dental treatment room with chair, overhead light and sterilisation area — specified for dental and equipment-heavy procedures.',
   array['Dental chair', 'Overhead light', 'Sink', 'Sterilisation area', 'Storage', 'Wi-Fi'],
   110, 110, 210, true, 6);
