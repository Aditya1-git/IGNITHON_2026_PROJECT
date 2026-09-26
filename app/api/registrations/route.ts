import { NextResponse } from 'next/server'
import { getEventById, isPastEvent, decrementEventSeats } from '@/data/events'
import { hasActiveRegistration, createRegistration } from '@/data/registrations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { eventId, studentId, userRole } = body

    if (!studentId || !eventId) {
      return NextResponse.json({ error: 'Missing studentId or eventId' }, { status: 400 })
    }

    if (userRole !== 'student') {
      return NextResponse.json({ error: 'Please log in as a student to register.' }, { status: 403 })
    }

    const event = getEventById(eventId)
    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    }

    if (event.cancelled) {
      return NextResponse.json({ error: 'This event has been cancelled.' }, { status: 400 })
    }

    if (isPastEvent(event)) {
      return NextResponse.json({ error: 'Registration has closed because this event has already occurred.' }, { status: 400 })
    }

    if (event.seatsAvailable <= 0) {
      return NextResponse.json({ error: 'This event is full.' }, { status: 400 })
    }

    if (hasActiveRegistration(studentId, eventId)) {
      return NextResponse.json({ error: 'You are already registered for this event.' }, { status: 400 })
    }

    // Validation passed, perform both operations
    decrementEventSeats(eventId)
    const registration = createRegistration(studentId, eventId)

    return NextResponse.json({ success: true, registration })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to register.' }, { status: 500 })
  }
}
