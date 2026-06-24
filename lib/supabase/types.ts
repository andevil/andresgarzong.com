// Auto-shaped from schema — update if columns change

export type PersonStatus = 'lead' | 'waitlist' | 'active' | 'inactive' | 'alumni' | 'private-only' | 'workshop-only'
export type DanceRole    = 'leader' | 'follower' | 'both' | 'solo' | 'unknown'
export type DanceExp     = 'absolute-beginner' | 'beginner' | 'intermediate' | 'advanced' | 'unknown'

export interface Person {
  id: string
  first_name: string
  last_name: string
  full_name: string
  email: string | null
  phone: string | null
  instagram_handle: string | null
  whatsapp_number: string | null
  nationality: string | null
  languages: string[] | null
  date_of_birth: string | null
  notes: string | null
  tags: string[] | null
  source: string | null
  status: PersonStatus
  dance_role: DanceRole
  dance_experience: DanceExp
  preferred_style: string[] | null
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  name: string
  style: 'partnerwork' | 'caleña' | 'fusion' | 'private' | 'workshop' | 'other'
  level: string | null
  description: string | null
  location: string | null
  day_of_week: string | null
  start_time: string | null
  end_time: string | null
  capacity: number | null
  status: 'planned' | 'active' | 'paused' | 'finished'
  season: string | null
  default_price: number
  monthly_pass_price: number
  notes: string | null
  slug: string | null
  thumbnail_url: string | null
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

export interface CourseEnrollment {
  id: string
  person_id: string
  course_id: string
  enrollment_status: 'active' | 'paused' | 'dropped' | 'completed' | 'trial' | 'invited'
  start_date: string | null
  end_date: string | null
  package_type: 'drop-in' | 'monthly-pass' | 'two-month-pass' | 'three-month-pass' | 'custom'
  payment_status: 'unpaid' | 'partial' | 'paid' | 'overdue'
  notes: string | null
  created_at: string
  people?: Person
  courses?: Course
}

export interface ClassSession {
  id: string
  course_id: string
  date: string
  start_time: string | null
  end_time: string | null
  location: string | null
  topic: string | null
  teacher_notes: string | null
  status: 'scheduled' | 'completed' | 'cancelled'
  created_at: string
  courses?: Course
}

export interface Attendance {
  id: string
  session_id: string
  person_id: string
  status: 'present' | 'absent' | 'late' | 'cancelled-in-time' | 'no-show'
  payment_required: boolean
  notes: string | null
  created_at: string
  people?: Person
  class_sessions?: ClassSession
}

export interface Payment {
  id: string
  person_id: string
  amount: number
  currency: string
  payment_method: string | null
  payment_type: string | null
  related_course_id: string | null
  related_session_id: string | null
  related_private_lesson_id: string | null
  related_workshop_id: string | null
  payment_date: string
  period_start: string | null
  period_end: string | null
  status: 'paid' | 'pending' | 'overdue' | 'refunded'
  reference_note: string | null
  admin_notes: string | null
  created_at: string
  people?: Person
}

export interface Pass {
  id: string
  person_id: string
  package_name: string | null
  package_type: 'monthly-pass' | 'two-month-pass' | 'three-month-pass' | 'private-lesson-pack' | 'custom'
  total_credits: number
  used_credits: number
  remaining_credits: number
  valid_from: string
  valid_until: string
  status: 'active' | 'expired' | 'used-up' | 'cancelled'
  related_payment_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  people?: Person
}

export interface WaitlistEntry {
  id: string
  person_id: string
  desired_course_type: string | null
  desired_level: string | null
  preferred_days: string[] | null
  has_partner: boolean
  partner_name: string | null
  dance_role: string | null
  urgency: 'low' | 'normal' | 'high'
  status: 'new' | 'contacted' | 'invited' | 'registered' | 'not-ready' | 'lost'
  notes: string | null
  created_at: string
  last_contacted_at: string | null
  people?: Person
}

export interface PrivateLesson {
  id: string
  person_id: string
  partner_person_id: string | null
  date: string
  start_time: string | null
  end_time: string | null
  location: string | null
  focus_area: string | null
  price: number
  room_rental_included: boolean
  payment_status: string
  pass_id: string | null
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  notes: string | null
  created_at: string
  people?: Person
}

export interface Workshop {
  id: string
  name: string
  type: string | null
  date: string
  start_time: string | null
  end_time: string | null
  location: string | null
  capacity: number | null
  price: number
  status: 'planned' | 'active' | 'completed' | 'cancelled'
  description: string | null
  notes: string | null
  slug: string | null
  thumbnail_url: string | null
  created_at: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  person_id: string | null
  related_course_id: string | null
  related_workshop_id: string | null
  due_date: string | null
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'done' | 'dismissed'
  created_at: string
  people?: Person
}

export interface CommunicationLog {
  id: string
  person_id: string
  channel: string | null
  direction: 'incoming' | 'outgoing' | null
  subject: string | null
  summary: string
  date: string
  follow_up_needed: boolean
  follow_up_date: string | null
  created_at: string
  people?: Person
}

// ---------------------------------------------------------------------------
// PACKAGES & PROMOTIONS
// ---------------------------------------------------------------------------

export interface PromotionBonusItem {
  type: string
  label: string
  description?: string
}

export interface Promotion {
  id: string
  name: string
  month_season: string | null
  start_date: string | null
  end_date: string | null
  applicable_class: string | null
  price: number
  classes_included: number
  validity_weeks: number
  bonus_items: PromotionBonusItem[]
  notes: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface StudentPackage {
  id: string
  person_id: string
  promotion_id: string | null
  name: string
  price: number
  classes_included: number
  classes_attended: number
  start_date: string | null
  expiry_date: string | null
  payment_status: 'unpaid' | 'partial' | 'paid'
  notes: string | null
  archived: boolean
  override_remaining: number | null
  created_at: string
  updated_at: string
  people?: Person
  promotions?: Promotion
  package_bonuses?: PackageBonus[]
}

export interface PackageBonus {
  id: string
  package_id: string
  bonus_type: 'free_private_lesson' | 'half_price_private' | 'free_workshop' | 'free_salsa_fusion' | 'free_colombian_salsa' | 'custom'
  label: string
  used: boolean
  used_date: string | null
  used_for: string | null
  notes: string | null
  created_at: string
}

export interface NotificationRule {
  id: string
  name: string
  trigger_type: 'expiry' | 'unused_bonus' | 'unused_private_lesson' | 'low_classes' | 'payment_pending'
  trigger_days_before: number | null
  audience: 'admin' | 'student' | 'both'
  channel: 'in_app' | 'email' | 'whatsapp'
  message_template: string | null
  applies_globally: boolean
  enabled: boolean
  created_at: string
}

export interface PackageNotification {
  id: string
  rule_id: string | null
  package_id: string
  person_id: string
  status: 'created' | 'viewed' | 'sent' | 'dismissed'
  message: string
  trigger_type: string
  created_at: string
  viewed_at: string | null
  dismissed_at: string | null
  people?: Person
  student_packages?: StudentPackage
}

export interface PublicRegistration {
  id:                  string
  event_type:          'course' | 'workshop'
  event_id:            string
  event_name:          string
  name:                string
  email:               string | null
  instagram:           string | null
  phone:               string | null
  dance_level:         string | null
  dance_role:          'leader' | 'follower' | 'both' | null
  coming_with_partner: boolean | null
  partner_name:        string | null
  status:              'pending' | 'payment_sent' | 'paid' | 'cancelled'
  notes:               string | null
  created_at:          string
}
