-- =============================================================================
-- Seed data — realistic salsa business development data
-- Run AFTER 001_crm_schema.sql
-- =============================================================================

-- Courses
insert into courses (id, name, style, level, location, day_of_week, start_time, end_time, capacity, status, default_price, monthly_pass_price)
values
  ('c1000000-0000-0000-0000-000000000001', 'A1 Partnerwork',        'partnerwork', 'A1',          'BackStage Studio, Dohány u. 5b', 'monday',    '19:00', '20:15', 16, 'active', 4000, 15000),
  ('c1000000-0000-0000-0000-000000000002', 'A2 Partnerwork',        'partnerwork', 'A2',          'BackStage Studio, Dohány u. 5b', 'monday',    '20:30', '21:45', 14, 'active', 4000, 15000),
  ('c1000000-0000-0000-0000-000000000003', 'B1 Partnerwork',        'partnerwork', 'B1',          'Roxy Studio, Tátra u. 4',        'wednesday', '19:00', '20:15', 12, 'active', 4000, 15000),
  ('c1000000-0000-0000-0000-000000000004', 'B2 Partnerwork',        'partnerwork', 'B2',          'Roxy Studio, Tátra u. 4',        'wednesday', '20:30', '21:45',  8, 'active', 4000, 15000),
  ('c1000000-0000-0000-0000-000000000005', 'Salsa Fusion',          'fusion',      'open',        'BackStage Studio, Dohány u. 5b', 'thursday',  '19:00', '20:15', 14, 'active', 4000, 15000),
  ('c1000000-0000-0000-0000-000000000006', 'Caleña Beginners',      'caleña',      'beginner',    'BackStage Studio, Dohány u. 5b', 'tuesday',   '18:30', '19:45', 12, 'active', 4000, 15000),
  ('c1000000-0000-0000-0000-000000000007', 'Caleña Intermediates',  'caleña',      'intermediate','BackStage Studio, Dohány u. 5b', 'tuesday',   '20:00', '21:15', 10, 'active', 4000, 15000);

-- People (sample dancers)
insert into people (id, first_name, last_name, email, phone, instagram_handle, source, status, dance_role, dance_experience)
values
  ('p1000000-0000-0000-0000-000000000001', 'Anna',     'Kovács',    'anna.kovacs@email.com',    '+36201234001', '@anna_salsa',    'instagram',       'active',   'follower', 'beginner'),
  ('p1000000-0000-0000-0000-000000000002', 'Mateo',    'Rivas',     'mateo.rivas@email.com',    '+36201234002', '@mateodance',    'workshop',        'active',   'leader',   'beginner'),
  ('p1000000-0000-0000-0000-000000000003', 'Dóra',     'Varga',     'dora.varga@email.com',     '+36201234003', '@doravarga',     'friend-referral', 'active',   'follower', 'intermediate'),
  ('p1000000-0000-0000-0000-000000000004', 'Péter',    'Szabó',     'peter.szabo@email.com',    '+36201234004', null,             'instagram',       'active',   'leader',   'beginner'),
  ('p1000000-0000-0000-0000-000000000005', 'Sofia',    'Molnár',    'sofia.molnar@email.com',   '+36201234005', '@sofia.moves',   'website',         'active',   'follower', 'absolute-beginner'),
  ('p1000000-0000-0000-0000-000000000006', 'Bence',    'Tóth',      'bence.toth@email.com',     '+36201234006', null,             'facebook',        'active',   'leader',   'intermediate'),
  ('p1000000-0000-0000-0000-000000000007', 'Réka',     'Nagy',      'reka.nagy@email.com',      '+36201234007', '@reka.dance',    'instagram',       'active',   'follower', 'beginner'),
  ('p1000000-0000-0000-0000-000000000008', 'Ádám',     'Kiss',      'adam.kiss@email.com',      '+36201234008', null,             'friend-referral', 'active',   'leader',   'advanced'),
  ('p1000000-0000-0000-0000-000000000009', 'Nóra',     'Fekete',    'nora.fekete@email.com',    '+36201234009', '@noradance',     'party',           'active',   'both',     'intermediate'),
  ('p1000000-0000-0000-0000-000000000010', 'Gábor',    'Papp',      'gabor.papp@email.com',     '+36201234010', null,             'whatsapp',        'inactive', 'leader',   'beginner'),
  ('p1000000-0000-0000-0000-000000000011', 'Lena',     'Müller',    'lena.mueller@email.com',   '+36201234011', '@lena_bpst',     'instagram',       'waitlist', 'follower', 'absolute-beginner'),
  ('p1000000-0000-0000-0000-000000000012', 'Carlos',   'García',    'carlos.garcia@email.com',  '+36201234012', '@carlosguate',   'workshop',        'waitlist', 'leader',   'beginner'),
  ('p1000000-0000-0000-0000-000000000013', 'Hanna',    'Schmidt',   'hanna.schmidt@email.com',  '+36201234013', '@hanna.bpst',    'instagram',       'lead',     'follower', 'unknown'),
  ('p1000000-0000-0000-0000-000000000014', 'Tamás',    'Horváth',   'tamas.horvath@email.com',  '+36201234014', null,             'friend-referral', 'active',   'leader',   'beginner'),
  ('p1000000-0000-0000-0000-000000000015', 'Zsófi',    'Pintér',    'zsofi.pinter@email.com',   '+36201234015', '@zsofisalsa',    'instagram',       'active',   'follower', 'intermediate');

-- Course enrollments
insert into course_enrollments (person_id, course_id, enrollment_status, start_date, package_type, payment_status)
values
  ('p1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'active', '2026-01-13', 'monthly-pass',  'paid'),
  ('p1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'active', '2026-01-13', 'drop-in',       'paid'),
  ('p1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 'active', '2026-02-03', 'monthly-pass',  'paid'),
  ('p1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'active', '2026-02-10', 'drop-in',       'unpaid'),
  ('p1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000001', 'active', '2026-03-02', 'monthly-pass',  'paid'),
  ('p1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', 'active', '2026-01-20', 'monthly-pass',  'paid'),
  ('p1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000002', 'active', '2026-01-20', 'monthly-pass',  'paid'),
  ('p1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000003', 'active', '2026-01-15', 'monthly-pass',  'paid'),
  ('p1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000003', 'active', '2026-01-15', 'monthly-pass',  'paid'),
  ('p1000000-0000-0000-0000-000000000014', 'c1000000-0000-0000-0000-000000000001', 'active', '2026-04-07', 'drop-in',       'paid'),
  ('p1000000-0000-0000-0000-000000000015', 'c1000000-0000-0000-0000-000000000002', 'active', '2026-04-07', 'monthly-pass',  'unpaid'),
  ('p1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000006', 'active', '2026-02-04', 'drop-in',       'paid'),
  ('p1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000005', 'active', '2026-03-06', 'monthly-pass',  'paid');

-- Waitlist entries
insert into waitlist_entries (person_id, desired_course_type, desired_level, dance_role, urgency, status, notes, last_contacted_at)
values
  ('p1000000-0000-0000-0000-000000000011', 'partnerwork', 'A1', 'follower', 'normal', 'new',       'Found us on Instagram. Excited to start.',   null),
  ('p1000000-0000-0000-0000-000000000012', 'partnerwork', 'A1', 'leader',   'high',   'contacted', 'Has some Cuban salsa background from Guatemala.', '2026-06-10'),
  ('p1000000-0000-0000-0000-000000000013', 'caleña',      'beginner', 'follower', 'normal', 'new',  'Saw our Reels. Interested in Caleña only.',  null);

-- Passes (active)
insert into passes (person_id, package_name, package_type, total_credits, used_credits, valid_from, valid_until, status)
values
  ('p1000000-0000-0000-0000-000000000001', 'June Monthly Pass', 'monthly-pass', 4, 2, '2026-06-02', '2026-07-07', 'active'),
  ('p1000000-0000-0000-0000-000000000003', 'June Monthly Pass', 'monthly-pass', 4, 1, '2026-06-02', '2026-07-07', 'active'),
  ('p1000000-0000-0000-0000-000000000007', 'June Monthly Pass', 'monthly-pass', 4, 3, '2026-06-02', '2026-07-07', 'active'),
  ('p1000000-0000-0000-0000-000000000015', 'June Monthly Pass', 'monthly-pass', 4, 0, '2026-06-16', '2026-07-21', 'active');

-- Tasks
insert into tasks (title, person_id, due_date, priority, status)
values
  ('Follow up with Lena — waitlist A1',      'p1000000-0000-0000-0000-000000000011', '2026-06-24', 'high',   'open'),
  ('Remind Sofia about payment',             'p1000000-0000-0000-0000-000000000005', '2026-06-22', 'high',   'open'),
  ('Remind Zsófi about payment',             'p1000000-0000-0000-0000-000000000015', '2026-06-23', 'medium', 'open'),
  ('Contact inactive dancers for new season', null,                                    '2026-06-30', 'medium', 'open'),
  ('Plan July workshop',                     null,                                    '2026-07-01', 'low',    'open');

-- Upcoming class sessions (current week + next 2 weeks)
insert into class_sessions (course_id, date, start_time, end_time, location, status)
values
  ('c1000000-0000-0000-0000-000000000001', '2026-06-22', '19:00', '20:15', 'BackStage Studio, Dohány u. 5b', 'scheduled'),
  ('c1000000-0000-0000-0000-000000000002', '2026-06-22', '20:30', '21:45', 'BackStage Studio, Dohány u. 5b', 'scheduled'),
  ('c1000000-0000-0000-0000-000000000006', '2026-06-23', '18:30', '19:45', 'BackStage Studio, Dohány u. 5b', 'scheduled'),
  ('c1000000-0000-0000-0000-000000000007', '2026-06-23', '20:00', '21:15', 'BackStage Studio, Dohány u. 5b', 'scheduled'),
  ('c1000000-0000-0000-0000-000000000003', '2026-06-24', '19:00', '20:15', 'Roxy Studio, Tátra u. 4',        'scheduled'),
  ('c1000000-0000-0000-0000-000000000004', '2026-06-24', '20:30', '21:45', 'Roxy Studio, Tátra u. 4',        'scheduled'),
  ('c1000000-0000-0000-0000-000000000005', '2026-06-25', '19:00', '20:15', 'BackStage Studio, Dohány u. 5b', 'scheduled'),
  ('c1000000-0000-0000-0000-000000000001', '2026-06-29', '19:00', '20:15', 'BackStage Studio, Dohány u. 5b', 'scheduled'),
  ('c1000000-0000-0000-0000-000000000002', '2026-06-29', '20:30', '21:45', 'BackStage Studio, Dohány u. 5b', 'scheduled');
