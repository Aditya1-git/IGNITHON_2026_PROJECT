'use client'

import { useState } from 'react'
import { CampusEvent, EventCategory, searchEventsByName, filterEventsByCategory, isPastEvent } from '@/data/events'
import { Registration } from '@/data/registrations'
import { useAuth } from '@/components/AuthProvider'
import EventCard from '@/components/EventCard'
import EmptyState from '@/components/EmptyState'

const CATEGORIES: (EventCategory | 'All')[] = [
  'All',
  'Tech',
  'Cultural',
  'Sports',
  'Workshop',
  'Career',
  'Music',
]

export default function EventsClient({ events, allRegistrations }: { events: CampusEvent[], allRegistrations: Registration[] }) {
  const { currentUser } = useAuth()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<EventCategory | 'All'>('All')

  // Filter out past/cancelled events, then apply search and category filter
  const upcomingEvents = events.filter((e) => !isPastEvent(e) && !e.cancelled)
  const categoryFiltered = filterEventsByCategory(upcomingEvents, category)
  const displayedEvents = searchEventsByName(categoryFiltered, query)

  return (
    <section className="shell" style={{ padding: '40px 0 64px' }}>
      <div style={{ marginBottom: 28 }}>
        <span className="eyebrow-tag">the board</span>
        <h1 style={{ fontSize: 30, marginTop: 10 }}>All events</h1>
        <p style={{ marginTop: 8 }}>
          Everything posted by clubs and departments this semester.
        </p>
      </div>

      <div
        style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}
      >
        <input
          type="search"
          placeholder="Search events by name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: '1 1 240px',
            padding: '10px 14px',
            border: '1.5px solid var(--line)',
            borderRadius: 'var(--radius)',
            fontSize: 14.5,
            background: 'var(--paper-raised)',
          }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as EventCategory | 'All')}
          style={{
            padding: '10px 14px',
            border: '1.5px solid var(--line)',
            borderRadius: 'var(--radius)',
            fontSize: 14.5,
            background: 'var(--paper-raised)',
          }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === 'All' ? 'All categories' : c}
            </option>
          ))}
        </select>
      </div>

      {displayedEvents.length === 0 ? (
        <EmptyState
          title="No events found"
          description="Try adjusting your search or category filter to find what you're looking for."
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}
        >
          {displayedEvents.map((event) => {
            const isRegistered = allRegistrations.some(
              (r) => r.eventId === event.id && r.studentId === currentUser.id && r.status === 'confirmed'
            )
            return <EventCard key={event.id} event={event} isRegistered={isRegistered} />
          })}
        </div>
      )}
    </section>
  )
}
