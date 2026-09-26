'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { events as seedEvents, CampusEvent, EventCategory } from '@/data/events'
import EmptyState from '@/components/EmptyState'
import StatusBadge from '@/components/StatusBadge'
import EventForm from '@/components/EventForm'

export default function OrganizerPage() {
  const { currentUser } = useAuth()
  const [myEvents, setMyEvents] = useState<CampusEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null)
  const [editingEvent, setEditingEvent] = useState<CampusEvent | null>(null)

  useEffect(() => {
    if (currentUser.role === 'organizer') {
      refreshEvents()
    }
  }, [currentUser.id, currentUser.role])

  const refreshEvents = async () => {
    try {
      const res = await fetch('/api/events?organizerId=' + currentUser.id)
      if (res.ok) {
        const data = await res.json()
        setMyEvents(data)
      } else {
        setMyEvents(seedEvents.filter((e) => e.organizerId === currentUser.id))
      }
    } catch {
      setMyEvents(seedEvents.filter((e) => e.organizerId === currentUser.id))
    } finally {
      setIsLoading(false)
    }
  }

  const normalizeDate = (date: string): string => {
    return date.length === 16 ? date + ':00' : date
  }

  const handleCreateSubmit = async (formData: {
    name: string
    description: string
    date: string
    venue: string
    category: EventCategory
    capacity: string
  }) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizerId: currentUser.id,
          ...formData,
          date: normalizeDate(formData.date),
          capacity: parseInt(formData.capacity, 10),
        }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create event')
      }
      setFormMode(null)
      await refreshEvents()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSubmit = async (formData: {
    name: string
    description: string
    date: string
    venue: string
    category: EventCategory
    capacity: string
  }) => {
    if (!editingEvent) return
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/events/${editingEvent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizerId: currentUser.id,
          ...formData,
          date: normalizeDate(formData.date),
          capacity: parseInt(formData.capacity, 10),
        }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update event')
      }
      setFormMode(null)
      setEditingEvent(null)
      await refreshEvents()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to cancel this event? This action cannot be undone.')) {
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/events/${eventId}?organizerId=${currentUser.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to cancel event')
      }
      await refreshEvents()
    } finally {
      setIsSubmitting(false)
    }
  }

  const openCreateForm = () => {
    setEditingEvent(null)
    setFormMode('create')
  }

  const openEditForm = (event: CampusEvent) => {
    setEditingEvent(event)
    setFormMode('edit')
  }

  const closeForm = () => {
    setFormMode(null)
    setEditingEvent(null)
  }

  if (currentUser.role !== 'organizer') {
    return (
      <section className="shell" style={{ padding: '56px 0' }}>
        <EmptyState
          title="This page is for organizers"
          description="Switch to an organizer account from the top-right menu to manage events."
        />
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="shell" style={{ padding: '40px 0 64px' }}>
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--ink-soft)' }}>
          Loading your events…
        </div>
      </section>
    )
  }

  return (
    <section className="shell" style={{ padding: '40px 0 64px' }}>
      <div
        style={{
          marginBottom: 28,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <span className="eyebrow-tag">organizer console</span>
          <h1 style={{ fontSize: 30, marginTop: 10 }}>Manage your events</h1>
          <p style={{ marginTop: 8 }}>Create, edit, and cancel your events below.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateForm} disabled={isSubmitting}>
          + New event
        </button>
      </div>

      {myEvents.length === 0 ? (
        <EmptyState
          title="No events posted yet"
          description="Once you create an event, it'll show up here."
        />
      ) : (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {myEvents.map((event) => {
            const status = event.cancelled
              ? 'cancelled'
              : event.seatsAvailable <= 0
                ? 'full'
                : 'open'
            return (
              <li
                key={event.id}
                className="card-surface"
                style={{
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  flexWrap: 'wrap',
                  opacity: event.cancelled ? 0.6 : 1,
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
                    · {event.venue} · {event.seatsAvailable}/{event.capacity}{' '}
                    seats
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <StatusBadge status={status} />
                  {!event.cancelled && (
                    <>
                      <button
                        className="btn btn-secondary"
                        onClick={() => openEditForm(event)}
                        disabled={isSubmitting}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleCancel(event.id)}
                        disabled={isSubmitting}
                        style={{ background: 'transparent', borderColor: 'var(--rust)', color: 'var(--rust)' }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {formMode && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            zIndex: 100,
          }}
          onClick={closeForm}
        >
          <div
            className="card-surface"
            style={{
              width: '100%',
              maxWidth: 560,
              maxHeight: '90vh',
              overflow: 'auto',
              padding: 32,
              background: 'var(--paper-raised)',
              border: '1.5px solid var(--line)',
              borderRadius: 'var(--radius)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>
              {formMode === 'create' ? 'Create new event' : 'Edit event'}
            </h2>
            <EventForm
              initialData={editingEvent
                ? {
                    name: editingEvent.name,
                    description: editingEvent.description,
                    date: editingEvent.date.slice(0, 16),
                    venue: editingEvent.venue,
                    category: editingEvent.category,
                    capacity: String(editingEvent.capacity),
                  }
                : undefined}
              onSubmit={formMode === 'create' ? handleCreateSubmit : handleEditSubmit}
              onCancel={closeForm}
              isSubmitting={isSubmitting}
              submitLabel={formMode === 'create' ? 'Create event' : 'Save changes'}
            />
          </div>
        </div>
      )}
    </section>
  )
}