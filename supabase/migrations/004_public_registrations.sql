-- =============================================================================
-- Public event registrations (submitted from the public event page)
-- =============================================================================

create table if not exists public_registrations (
  id                  uuid primary key default gen_random_uuid(),
  event_type          text not null check (event_type in ('course','workshop')),
  event_id            uuid not null,
  event_name          text not null,
  name                text not null,
  email               text,
  instagram           text,
  phone               text,
  dance_level         text,
  dance_role          text check (dance_role in ('leader','follower','both')),
  coming_with_partner boolean,
  partner_name        text,
  status              text not null default 'pending'
                        check (status in ('pending','payment_sent','paid','cancelled')),
  notes               text,
  created_at          timestamptz not null default now()
);

create index if not exists public_registrations_event_idx  on public_registrations(event_id);
create index if not exists public_registrations_status_idx on public_registrations(status);
create index if not exists public_registrations_email_idx  on public_registrations(email);

alter table public_registrations enable row level security;

-- Anyone (anon) can submit a registration from the public event page
create policy "anon_insert_registrations"
  on public_registrations for insert
  to anon, authenticated
  with check (true);

-- Only authenticated admin can read / update / delete
create policy "auth_select_registrations"
  on public_registrations for select to authenticated using (true);

create policy "auth_update_registrations"
  on public_registrations for update to authenticated using (true) with check (true);

create policy "auth_delete_registrations"
  on public_registrations for delete to authenticated using (true);
