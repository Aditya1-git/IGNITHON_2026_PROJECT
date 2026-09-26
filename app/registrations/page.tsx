'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { getRegistrationsForStudent, cancelRegistration, Registration } from '@/data/registrations'
import { getEventById, isPastEvent } from '@/data/events'
import StatusBadge from '@/components/StatusBadge'
import EmptyState from '@/components/EmptyState'

export default function RegistrationsPage() {
  const { currentUser } = useAuth()
  const [refreshTick, setRefreshTick] = useState(0)

  if (currentUser.role !== 'student') {
    return (
      <section className="shell" style={{ padding: '56px 0' }}>
        <EmptyState
          title="This page is for students"
          description="Switch to a student account from the top-right menu to see registered events."
        />
      </section>
    )
  }

  const myRegistrations = getRegistrationsForStudent(currentUser.id)

  const handleCancel = (regId: string, eventId: string) => {
    if (confirm('Are you sure you want to cancel this registration?')) {
      cancelRegistration(regId)
      const event = getEventById(eventId)
      if (event) {
        event.seatsAvailable += 1
      }
      setRefreshTick(t => t + 1)
    }
  }

  const upcomingRegs: Registration[] = []
  const pastRegs: Registration[] = []

  myRegistrations.forEach((reg) => {
    const event = getEventById(reg.eventId)
    if (!event) return
    if (isPastEvent(event)) {
      pastRegs.push(reg)
    } else {
      upcomingRegs.push(reg)
    }
  })

  const renderRegList = (regs: Registration[], title?: string) => {
    if (regs.length === 0) return null
    return (
      <div style={{ marginBottom: 32 }}>
        {title && <h2 style={{ fontSize: 20, marginBottom: 16 }}>{title}</h2>}
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {regs.map((reg) => {
            const event = getEventById(reg.eventId)!
            const isPast = isPastEvent(event)
            const status = reg.status === 'cancelled' ? 'cancelled' : (isPast ? 'past' : 'open')
            return (
              <li
                key={reg.id}
                className="card-surface"
                style={{
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <Link
                    href={`/events/${event.id}`}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      fontSize: 17,
                      textDecoration: 'none',
                    }}
                  >
                    {event.name}
                  </Link>
                  <div
                    style={{
                      fontSize: 13.5,
                      color: 'var(--ink-soft)',
                      marginTop: 4,
                    }}
                  >
                    {new Date(event.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    · {event.venue}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <StatusBadge status={status} />
                  {reg.status !== 'cancelled' && !isPast && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleCancel(reg.id, event.id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <section className="shell" style={{ padding: '40px 0 64px' }}>
      <div style={{ marginBottom: 28 }}>
        <span className="eyebrow-tag">signed up as {currentUser.name}</span>
        <h1 style={{ fontSize: 30, marginTop: 10 }}>My registrations</h1>
        <p style={{ marginTop: 8 }}>
          Everything you've registered for.
        </p>
      </div>

      {myRegistrations.length === 0 ? (
        <EmptyState
          title="No registrations yet"
          description="Once you register for an event, it'll show up here."
          action={
            <Link href="/events" className="btn btn-primary">
              Browse events
            </Link>
          }
        />
      ) : (
        <>
          {renderRegList(upcomingRegs, 'Upcoming Events')}
          {renderRegList(pastRegs, 'Past Events')}
        </>
      )}
    </section>
  )
}
