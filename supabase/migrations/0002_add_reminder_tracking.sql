-- ============================================================================
-- MS-001 AMK Consulting Hub — Reminder tracking
-- ============================================================================
-- Supports send-booking-reminder: marks when a reminder email has gone out for
-- a booking so the scheduled function never double-sends one.
-- ============================================================================

alter table bookings add column reminder_sent_at timestamptz;

comment on column bookings.reminder_sent_at is
  'Set by the send-booking-reminder Edge Function once a reminder email has gone out. Null means not yet sent.';
