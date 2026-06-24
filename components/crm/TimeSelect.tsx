'use client'

const HOURS   = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

function parse(time24: string): { h: number; m: string; ampm: 'AM' | 'PM' } {
  if (!time24) return { h: 7, m: '00', ampm: 'AM' }
  const [hStr = '0', mStr = '00'] = time24.split(':')
  const h24 = parseInt(hStr, 10)
  const m   = mStr.slice(0, 2).padStart(2, '0')
  if (h24 === 0)  return { h: 12, m, ampm: 'AM' }
  if (h24 < 12)  return { h: h24, m, ampm: 'AM' }
  if (h24 === 12) return { h: 12, m, ampm: 'PM' }
  return { h: h24 - 12, m, ampm: 'PM' }
}

function format24(h: number, m: string, ampm: 'AM' | 'PM'): string {
  const h24 = ampm === 'AM' ? (h === 12 ? 0 : h) : (h === 12 ? 12 : h + 12)
  return `${String(h24).padStart(2, '0')}:${m}`
}

const sel = 'border border-[#E2DDD5] bg-white px-2 py-2.5 text-sm text-[#171410] outline-none focus:border-[#C9A84C] transition-colors'

export function TimeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { h, m, ampm } = parse(value)

  const set = (nh: number, nm: string, na: 'AM' | 'PM') => onChange(format24(nh, nm, na))

  return (
    <div className="flex gap-1">
      <select className={sel} value={h} onChange={e => set(Number(e.target.value), m, ampm)}>
        {HOURS.map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <select className={sel} value={m} onChange={e => set(h, e.target.value, ampm)}>
        {MINUTES.map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <select className={sel} value={ampm} onChange={e => set(h, m, e.target.value as 'AM' | 'PM')}>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  )
}
