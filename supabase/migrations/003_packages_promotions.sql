-- =============================================================================
-- Packages & Promotions Module
-- =============================================================================

-- ---------------------------------------------------------------------------
-- PROMOTIONS
-- ---------------------------------------------------------------------------
create table if not exists promotions (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  month_season     text,
  start_date       date,
  end_date         date,
  applicable_class text,
  price            int not null,
  classes_included int not null default 1,
  validity_weeks   int not null default 5,
  bonus_items      jsonb not null default '[]',
  notes            text,
  active           boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- STUDENT PACKAGES
-- ---------------------------------------------------------------------------
create table if not exists student_packages (
  id               uuid primary key default gen_random_uuid(),
  person_id        uuid not null references people(id) on delete cascade,
  promotion_id     uuid references promotions(id) on delete set null,
  name             text not null,
  price            int not null,
  classes_included int not null,
  classes_attended int not null default 0,
  start_date       date,
  expiry_date      date,
  payment_status   text not null default 'unpaid' check (payment_status in ('unpaid','partial','paid')),
  notes            text,
  archived         boolean not null default false,
  override_remaining int,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- PACKAGE BONUSES
-- ---------------------------------------------------------------------------
create table if not exists package_bonuses (
  id          uuid primary key default gen_random_uuid(),
  package_id  uuid not null references student_packages(id) on delete cascade,
  bonus_type  text not null check (bonus_type in ('free_private_lesson','half_price_private','free_workshop','free_salsa_fusion','free_colombian_salsa','custom')),
  label       text not null,
  used        boolean not null default false,
  used_date   date,
  used_for    text,
  notes       text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- NOTIFICATION RULES
-- ---------------------------------------------------------------------------
create table if not exists notification_rules (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  trigger_type     text not null check (trigger_type in ('expiry','unused_bonus','unused_private_lesson','low_classes','payment_pending')),
  trigger_days_before int,
  audience         text not null default 'admin' check (audience in ('admin','student','both')),
  channel          text not null default 'in_app' check (channel in ('in_app','email','whatsapp')),
  message_template text,
  applies_globally boolean not null default true,
  enabled          boolean not null default true,
  created_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- PACKAGE NOTIFICATIONS
-- ---------------------------------------------------------------------------
create table if not exists package_notifications (
  id           uuid primary key default gen_random_uuid(),
  rule_id      uuid references notification_rules(id) on delete set null,
  package_id   uuid not null references student_packages(id) on delete cascade,
  person_id    uuid not null references people(id) on delete cascade,
  status       text not null default 'created' check (status in ('created','viewed','sent','dismissed')),
  message      text not null,
  trigger_type text not null,
  created_at   timestamptz not null default now(),
  viewed_at    timestamptz,
  dismissed_at timestamptz
);

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------
create index if not exists student_packages_person_id_idx on student_packages(person_id);
create index if not exists package_bonuses_package_id_idx on package_bonuses(package_id);
create index if not exists package_notifications_person_id_idx on package_notifications(person_id);
create index if not exists package_notifications_status_idx on package_notifications(status);

-- ---------------------------------------------------------------------------
-- UPDATED_AT TRIGGERS (reuse existing set_updated_at function)
-- ---------------------------------------------------------------------------
create trigger set_promotions_updated_at
  before update on promotions
  for each row execute function set_updated_at();

create trigger set_student_packages_updated_at
  before update on student_packages
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table promotions enable row level security;
alter table student_packages enable row level security;
alter table package_bonuses enable row level security;
alter table notification_rules enable row level security;
alter table package_notifications enable row level security;

-- promotions
create policy "auth_select_promotions" on promotions for select to authenticated using (true);
create policy "auth_insert_promotions" on promotions for insert to authenticated with check (true);
create policy "auth_update_promotions" on promotions for update to authenticated using (true) with check (true);
create policy "auth_delete_promotions" on promotions for delete to authenticated using (true);

-- student_packages
create policy "auth_select_student_packages" on student_packages for select to authenticated using (true);
create policy "auth_insert_student_packages" on student_packages for insert to authenticated with check (true);
create policy "auth_update_student_packages" on student_packages for update to authenticated using (true) with check (true);
create policy "auth_delete_student_packages" on student_packages for delete to authenticated using (true);

-- package_bonuses
create policy "auth_select_package_bonuses" on package_bonuses for select to authenticated using (true);
create policy "auth_insert_package_bonuses" on package_bonuses for insert to authenticated with check (true);
create policy "auth_update_package_bonuses" on package_bonuses for update to authenticated using (true) with check (true);
create policy "auth_delete_package_bonuses" on package_bonuses for delete to authenticated using (true);

-- notification_rules
create policy "auth_select_notification_rules" on notification_rules for select to authenticated using (true);
create policy "auth_insert_notification_rules" on notification_rules for insert to authenticated with check (true);
create policy "auth_update_notification_rules" on notification_rules for update to authenticated using (true) with check (true);
create policy "auth_delete_notification_rules" on notification_rules for delete to authenticated using (true);

-- package_notifications
create policy "auth_select_package_notifications" on package_notifications for select to authenticated using (true);
create policy "auth_insert_package_notifications" on package_notifications for insert to authenticated with check (true);
create policy "auth_update_package_notifications" on package_notifications for update to authenticated using (true) with check (true);
create policy "auth_delete_package_notifications" on package_notifications for delete to authenticated using (true);

-- ---------------------------------------------------------------------------
-- SEED: DEFAULT PROMOTIONS
-- ---------------------------------------------------------------------------
insert into promotions (name, price, classes_included, validity_weeks, bonus_items, active)
values
  ('Returning Student First Month', 14000, 4, 5, '[]', true),
  ('Standard Monthly Pass',         15000, 4, 5, '[]', true),
  ('2-Month Commitment Package',    28000, 8, 10,
   '[{"type":"half_price_private","label":"50% off one private lesson"},{"type":"free_workshop","label":"1 free Salsa Fusion / Colombian Salsa / workshop class"}]',
   true),
  ('3-Month Commitment Package',    42000, 12, 15,
   '[{"type":"free_private_lesson","label":"1 free private lesson"},{"type":"free_workshop","label":"1 free Salsa Fusion / Colombian Salsa / workshop class"}]',
   true)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- SEED: DEFAULT NOTIFICATION RULES
-- ---------------------------------------------------------------------------
insert into notification_rules (name, trigger_type, trigger_days_before, audience, channel, message_template, enabled)
values
  ('30-day expiry reminder', 'expiry', 30, 'admin', 'in_app',
   '{{name}}''s package expires in 30 days.', true),
  ('15-day expiry reminder', 'expiry', 15, 'admin', 'in_app',
   '{{name}}''s package expires in 15 days. Check if renewal or bonus usage is needed.', true)
on conflict do nothing;
