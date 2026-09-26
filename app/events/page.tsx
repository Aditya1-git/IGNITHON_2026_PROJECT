import { events } from '@/data/events'
import { registrations } from '@/data/registrations'
import EventsClient from './EventsClient'

export const dynamic = 'force-dynamic'

export default function EventsPage() {
  return <EventsClient events={events} allRegistrations={registrations} />
}
