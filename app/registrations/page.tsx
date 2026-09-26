import { events } from '@/data/events'
import { registrations } from '@/data/registrations'
import RegistrationsClient from './RegistrationsClient'

export const dynamic = 'force-dynamic'

export default function RegistrationsPage() {
  return <RegistrationsClient allEvents={events} allRegistrations={registrations} />
}
