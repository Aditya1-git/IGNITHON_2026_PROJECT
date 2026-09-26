'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { getRegistrationsForStudent, cancelRegistration, Registration } from '@/data/registrations'
import { getEventById, isPastEvent } from '@/data/events'
import StatusBadge from '@/components/StatusBadge'
import EmptyState from '@/components/EmptyState'

export default function RegistrationsPage() {
  const { currentUser } = useAuth()
  const [refreshTick, setRefreshTick] = useState(0)
  const [cancellingReg, setCancellingReg] = useState<{regId: string, eventId: string} | null>(null)

  // Load persisted cancellations on mount
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'student') return

    const cancelledStr = localStorage.getItem('cancelledRegs')
    if (cancelledStr) {
      try {
        const cancelledArr = JSON.parse(cancelledStr)
        let updated = false
        cancelledArr.forEach((id: string) => {
          const reg = getRegistrationsForStudent(currentUser.id).find((r) => r.id === id)
          if (reg && reg.status !== 'cancelled') {
            cancelRegistration(id)
            updated = true
          }
        })
        if (updated) {
          setRefreshTick((t) => t + 1)
        }
      } catch (err) {
        console.error('Failed to parse cancelledRegs', err)
      }
    }
  }, [currentUser])

  if (currentUser.role !== 'student') {
    return (
      <section className="shell" style={{ padding: '56px 24px' }}>
        <EmptyState
          title="This page is for students"
          description="Switch to a student account from the top-right menu to see registered events."
        />
      </section>
    )
  }

  const myRegistrations = getRegistrationsForStudent(currentUser.id)

  const handleConfirmCancel = () => {
    if (!cancellingReg) return

    // Cancel in memory
    cancelRegistration(cancellingReg.regId)

    // Persist to localStorage
    const cancelledStr = localStorage.getItem('cancelledRegs')
    const cancelledArr = cancelledStr ? JSON.parse(cancelledStr) : []
    if (!cancelledArr.includes(cancellingReg.regId)) {
      cancelledArr.push(cancellingReg.regId)
      localStorage.setItem('cancelledRegs', JSON.stringify(cancelledArr))
    }

    setRefreshTick((t) => t + 1)
    setCancellingReg(null)
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
                      onClick={() => setCancellingReg({ regId: reg.id, eventId: event.id })}
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
    <section className="shell" style={{ padding: '40px 24px 64px' }}>
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

      {/* Confirmation Modal Overlay */}
      {cancellingReg && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px',
          }}
        >
          <div
            className="card-surface"
            style={{
              padding: '32px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            }}
          >
            <h2 style={{ fontSize: '22px', marginBottom: '12px' }}>Cancel Registration?</h2>
            <p style={{ marginBottom: '24px' }}>
              Are you sure you want to cancel this registration? You will lose your spot and this action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setCancellingReg(null)}
              >
                Keep it
              </button>
              <button
                className="btn btn-primary"
                style={{
                  backgroundColor: 'var(--rust)',
                  borderColor: 'var(--rust)',
                  color: 'var(--paper)',
                }}
                onClick={handleConfirmCancel}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
