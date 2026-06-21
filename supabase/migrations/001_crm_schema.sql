-- =============================================================================
-- Salsita with Cris — CRM Database Schema
-- Run this in your Supabase SQL editor: Dashboard → SQL Editor → New query
-- =============================================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- PEOPLE / CONTACTS
-- ---------------------------------------------------------------------------
create table if not exists people (
  id            uuid primary key default gen_random_uuid(),
  first_name    text not null,
  last_name     text not null,
  full_name     text generated always as (first_name || ' ' || last_name) stored,
  email         text,
  phone         text,
  instagram_handle   text,
  whatsapp_number    text,
  nationality        text,
  languages          text[],
  date_of_birth      date,
  notes              text,
  tags               text[],
  source             text check (source in ('instagram','whatsapp','friend-referral','facebook','workshop','party','website','other')),
  status             text not null default 'lead' check (status in ('lead','waitlist','active','inactive','alumni','private-only','workshop-only')),
  dance_role         text not null default 'unknown' check (dance_role in ('leader','follower','both','solo','unknown')),
  dance_experience   text not null default 'unknown' check (dance_experience in ('absolute-beginner','beginner','intermediate','advanced','unknown')),
  preferred_style    text[],
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- WAITLIST ENTRIES
-- ---------------------------------------------------------------------------
create table if not exists waitlist_entries (
  id                 uuid primary key default gen_random_uuid(),
  person_id          uuid not null references people(id) on delete cascade,
  desired_course_type text,
  desired_level      text,
  preferred_days     text[],
  has_partner        boolean default false,
  partner_name       text,
  dance_role         text check (dance_role in ('leader','follower','both','solo','unknown')),
  urgency            text default 'normal' check (urgency in ('low','normal','high')),
  status             text not null default 'new' check (status in ('new','contacted','invited','registered','not-ready','lost')),
  notes              text,
  created_at         timestamptz not null default now(),
  last_contacted_at  timestamptz
);

-- ---------------------------------------------------------------------------
-- COURSES
-- ---------------------------------------------------------------------------
create table if not exists courses (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  style              text not null check (style in ('partnerwork','caleña','fusion','private','workshop','other')),
  level              text check (level in ('A1','A2','B1','B2','beginner','intermediate','advanced','open')),
  description        text,
  location           text,
  day_of_week        text check (day_of_week in ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
  start_time         time,
  end_time           time,
  capacity           int,
  status             text not null default 'active' check (status in ('planned','active','paused','finished')),
  season             text,
  default_price      int default 4000,
  monthly_pass_price int default 15000,
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- COURSE ENROLLMENTS
-- ---------------------------------------------------------------------------
create table if not exists course_enrollments (
  id                 uuid primary key default gen_random_uuid(),
  person_id          uuid not null references people(id) on delete cascade,
  course_id          uuid not null references courses(id) on delete cascade,
  enrollment_status  text not null default 'active' check (enrollment_status in ('active','paused','dropped','completed','trial','invited')),
  start_date         date,
  end_date           date,
  package_type       text default 'drop-in' check (package_type in ('drop-in','monthly-pass','two-month-pass','three-month-pass','custom')),
  payment_status     text not null default 'unpaid' check (payment_status in ('unpaid','partial','paid','overdue')),
  notes              text,
  created_at         timestamptz not null default now(),
  unique(person_id, course_id)
);

-- ---------------------------------------------------------------------------
-- CLASS SESSIONS
-- ---------------------------------------------------------------------------
create table if not exists class_sessions (
  id            uuid primary key default gen_random_uuid(),
  course_id     uuid not null references courses(id) on delete cascade,
  date          date not null,
  start_time    time,
  end_time      time,
  location      text,
  topic         text,
  teacher_notes text,
  status        text not null default 'scheduled' check (status in ('scheduled','completed','cancelled')),
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- ATTENDANCE
-- ---------------------------------------------------------------------------
create table if not exists attendance (
  id               uuid primary key default gen_random_uuid(),
  session_id       uuid not null references class_sessions(id) on delete cascade,
  person_id        uuid not null references people(id) on delete cascade,
  status           text not null default 'present' check (status in ('present','absent','late','cancelled-in-time','no-show')),
  payment_required boolean default true,
  notes            text,
  created_at       timestamptz not null default now(),
  unique(session_id, person_id)
);

-- ---------------------------------------------------------------------------
-- PAYMENTS
-- ---------------------------------------------------------------------------
create table if not exists payments (
  id                      uuid primary key default gen_random_uuid(),
  person_id               uuid not null references people(id) on delete cascade,
  amount                  int not null,
  currency                text not null default 'HUF',
  payment_method          text check (payment_method in ('cash','revolut','wise','bank-transfer','other')),
  payment_type            text check (payment_type in ('single-class','monthly-pass','two-month-pass','three-month-pass','private-lesson','workshop','event','custom')),
  related_course_id       uuid references courses(id),
  related_session_id      uuid references class_sessions(id),
  related_private_lesson_id uuid,
  related_workshop_id     uuid,
  payment_date            date not null default current_date,
  period_start            date,
  period_end              date,
  status                  text not null default 'paid' check (status in ('paid','pending','overdue','refunded')),
  reference_note          text,
  admin_notes             text,
  created_at              timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- PASSES / PACKAGES
-- ---------------------------------------------------------------------------
create table if not exists passes (
  id               uuid primary key default gen_random_uuid(),
  person_id        uuid not null references people(id) on delete cascade,
  package_name     text,
  package_type     text not null check (package_type in ('monthly-pass','two-month-pass','three-month-pass','private-lesson-pack','custom')),
  total_credits    int not null,
  used_credits     int not null default 0,
  remaining_credits int generated always as (total_credits - used_credits) stored,
  valid_from       date not null default current_date,
  valid_until      date not null,
  status           text not null default 'active' check (status in ('active','expired','used-up','cancelled')),
  related_payment_id uuid references payments(id),
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- PRIVATE LESSONS
-- ---------------------------------------------------------------------------
create table if not exists private_lessons (
  id                uuid primary key default gen_random_uuid(),
  person_id         uuid not null references people(id) on delete cascade,
  partner_person_id uuid references people(id),
  date              date not null,
  start_time        time,
  end_time          time,
  location          text,
  focus_area        text,
  price             int default 14000,
  room_rental_included boolean default false,
  payment_status    text default 'unpaid' check (payment_status in ('unpaid','paid','partial','overdue')),
  pass_id           uuid references passes(id),
  status            text not null default 'scheduled' check (status in ('scheduled','completed','cancelled','no-show')),
  notes             text,
  created_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- WORKSHOPS / EVENTS
-- ---------------------------------------------------------------------------
create table if not exists workshops (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  type        text check (type in ('colombian-workshop','caleña-workshop','social-practice','bbq','party','guest-teacher','festival','corporate','bachelorette','wedding','show','other')),
  date        date not null,
  start_time  time,
  end_time    time,
  location    text,
  capacity    int,
  price       int default 0,
  status      text not null default 'planned' check (status in ('planned','active','completed','cancelled')),
  description text,
  notes       text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- WORKSHOP REGISTRATIONS
-- ---------------------------------------------------------------------------
create table if not exists workshop_registrations (
  id              uuid primary key default gen_random_uuid(),
  workshop_id     uuid not null references workshops(id) on delete cascade,
  person_id       uuid not null references people(id) on delete cascade,
  status          text not null default 'registered' check (status in ('registered','paid','attended','cancelled','no-show')),
  payment_status  text default 'unpaid' check (payment_status in ('unpaid','paid','partial','refunded')),
  notes           text,
  created_at      timestamptz not null default now(),
  unique(workshop_id, person_id)
);

-- ---------------------------------------------------------------------------
-- COMMUNICATION LOGS
-- ---------------------------------------------------------------------------
create table if not exists communication_logs (
  id               uuid primary key default gen_random_uuid(),
  person_id        uuid not null references people(id) on delete cascade,
  channel          text check (channel in ('whatsapp','instagram','email','phone','in-person','other')),
  direction        text check (direction in ('incoming','outgoing')),
  subject          text,
  summary          text not null,
  date             timestamptz not null default now(),
  follow_up_needed boolean default false,
  follow_up_date   date,
  created_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- TASKS / FOLLOW-UPS
-- ---------------------------------------------------------------------------
create table if not exists tasks (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  description         text,
  person_id           uuid references people(id) on delete set null,
  related_course_id   uuid references courses(id) on delete set null,
  related_workshop_id uuid references workshops(id) on delete set null,
  due_date            date,
  priority            text default 'medium' check (priority in ('low','medium','high')),
  status              text not null default 'open' check (status in ('open','done','dismissed')),
  created_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- UPDATED_AT triggers
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger people_updated_at before update on people
  for each row execute procedure set_updated_at();

create trigger courses_updated_at before update on courses
  for each row execute procedure set_updated_at();

create trigger passes_updated_at before update on passes
  for each row execute procedure set_updated_at();

-- ---------------------------------------------------------------------------
-- USEFUL INDEXES
-- ---------------------------------------------------------------------------
create index if not exists idx_people_status on people(status);
create index if not exists idx_people_dance_role on people(dance_role);
create index if not exists idx_people_full_name on people using gin(to_tsvector('english', full_name));
create index if not exists idx_attendance_session on attendance(session_id);
create index if not exists idx_attendance_person on attendance(person_id);
create index if not exists idx_payments_person on payments(person_id);
create index if not exists idx_payments_date on payments(payment_date);
create index if not exists idx_class_sessions_date on class_sessions(date);
create index if not exists idx_class_sessions_course on class_sessions(course_id);
create index if not exists idx_passes_person on passes(person_id);
create index if not exists idx_passes_status on passes(status);

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — single admin MVP (disable public access)
-- ---------------------------------------------------------------------------
alter table people enable row level security;
alter table waitlist_entries enable row level security;
alter table courses enable row level security;
alter table course_enrollments enable row level security;
alter table class_sessions enable row level security;
alter table attendance enable row level security;
alter table payments enable row level security;
alter table passes enable row level security;
alter table private_lessons enable row level security;
alter table workshops enable row level security;
alter table workshop_registrations enable row level security;
alter table communication_logs enable row level security;
alter table tasks enable row level security;

-- All access requires an authenticated session (single admin user)
create policy "auth users only" on people to authenticated using (true) with check (true);
create policy "auth users only" on waitlist_entries to authenticated using (true) with check (true);
create policy "auth users only" on courses to authenticated using (true) with check (true);
create policy "auth users only" on course_enrollments to authenticated using (true) with check (true);
create policy "auth users only" on class_sessions to authenticated using (true) with check (true);
create policy "auth users only" on attendance to authenticated using (true) with check (true);
create policy "auth users only" on payments to authenticated using (true) with check (true);
create policy "auth users only" on passes to authenticated using (true) with check (true);
create policy "auth users only" on private_lessons to authenticated using (true) with check (true);
create policy "auth users only" on workshops to authenticated using (true) with check (true);
create policy "auth users only" on workshop_registrations to authenticated using (true) with check (true);
create policy "auth users only" on communication_logs to authenticated using (true) with check (true);
create policy "auth users only" on tasks to authenticated using (true) with check (true);
