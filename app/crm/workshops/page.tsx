import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { PageHeader, Badge, Card, Button, EmptyState } from '@/components/crm/ui'
import { statusBadge } from '@/components/crm/ui'
import { Plus } from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

export default async function WorkshopsPage() {
  const supabase = await createClient()
  const { data: workshops } = await supabase
    .from('workshops')
    .select('*')
    .order('date', { ascending: false })

  return (
    <div>
      <PageHeader
        title="Workshops & Events"
        action={
          <Link href="/crm/workshops/new">
            <Button><Plus size={16} weight="light" /> Create event</Button>
          </Link>
        }
      />
      {workshops?.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workshops.map(w => (
            <Link key={w.id} href={`/crm/workshops/${w.id}`}>
              <Card className="cursor-pointer transition-colors hover:border-[#C9A84C]/40">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-xl font-light text-[#171410]">{w.name}</h3>
                    <p className="mt-1 text-xs text-[#9A907F]">
                      {format(parseISO(w.date), 'EEE d MMM yyyy')} · {w.start_time?.slice(0,5)}
                    </p>
                  </div>
                  <Badge variant={statusBadge(w.status)}>{w.status}</Badge>
                </div>
                {w.location && <p className="mb-2 text-xs text-[#9A907F]">{w.location}</p>}
                <div className="flex justify-between text-xs text-[#6B6155]">
                  <span>{w.type}</span>
                  <span>{w.price > 0 ? `${w.price.toLocaleString()} HUF` : 'Free'}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          message="No workshops or events yet."
          action={<Link href="/crm/workshops/new"><Button>Create first event</Button></Link>}
        />
      )}
    </div>
  )
}
