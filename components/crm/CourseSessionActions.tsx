'use client'

import { useState, useTransition } from 'react'
import { addWeeks, format, nextDay, parseISO, getDay, isBefore, isEqual } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/crm/ui'
import { CalendarPlus } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'

const DOW_MAP: Record<string, 0 | 1 | 2 | 3 | 4 | 5 | 6> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
}

export function CourseSessionActions({ courseId }: { courseId: string }) {
  const [, startTransition] = useTransition()
  const [generating, setGenerating] = useState(false)
  const router = useRouter()

  const generateSessions = () => {
    startTransition(async () => {
      setGenerating(true)
      const supabase = createClient()
      const { data: course } = await supabase
        .from('courses')
        .select('day_of_week, start_time, end_time, location, start_date, end_date')
        .eq('id', courseId)
        .single()

      if (!course?.day_of_week) { setGenerating(false); return }

      const dow = DOW_MAP[course.day_of_week]
      const rangeStart = course.start_date ? parseISO(course.start_date) : new Date()
      const rangeEnd   = course.end_date   ? parseISO(course.end_date)   : addWeeks(rangeStart, 8)

      // Find first occurrence of the target weekday on or after rangeStart
      const startDow = getDay(rangeStart)
      let current = startDow === dow ? rangeStart : nextDay(rangeStart, dow)

      const sessions = []
      while (isBefore(current, rangeEnd) || isEqual(current, rangeEnd)) {
        sessions.push({
          course_id:  courseId,
          date:       format(current, 'yyyy-MM-dd'),
          start_time: course.start_time,
          end_time:   course.end_time,
          location:   course.location,
          status:     'scheduled',
        })
        current = addWeeks(current, 1)
      }

      if (sessions.length > 0) {
        await supabase
          .from('class_sessions')
          .upsert(sessions, { onConflict: 'course_id,date' })
      }

      setGenerating(false)
      router.refresh()
    })
  }

  return (
    <Button variant="secondary" size="sm" onClick={generateSessions} disabled={generating}>
      <CalendarPlus size={14} weight="light" />
      {generating ? 'Generating…' : 'Generate sessions'}
    </Button>
  )
}
