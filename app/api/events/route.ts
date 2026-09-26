import { NextRequest, NextResponse } from 'next/server'
import { getUserById } from '@/data/auth'
import { createEvent, validateEventInput, EventValidationError, events, CampusEvent } from '@/data/events'

export async function GET(request: NextRequest) {
  const organizerId = request.nextUrl.searchParams.get('organizerId')
  if (!organizerId || typeof organizerId !== 'string') {
    return NextResponse.json(
      { error: 'organizerId is required' },
      { status: 400 }
    )
  }

  const user = getUserById(organizerId)
  if (!user) {
    return NextResponse.json(
      { error: 'Organizer not found' },
      { status: 403 }
    )
  }

  if (user.role !== 'organizer') {
    return NextResponse.json(
      { error: 'Only organizers can view events' },
      { status: 403 }
    )
  }

  const myEvents = events.filter((e) => e.organizerId === organizerId)
  return NextResponse.json(myEvents)
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const { organizerId, ...eventData } = body as Record<string, unknown>

  if (!organizerId || typeof organizerId !== 'string') {
    return NextResponse.json(
      { error: 'organizerId is required' },
      { status: 400 }
    )
  }

  const user = getUserById(organizerId)
  if (!user) {
    return NextResponse.json(
      { error: 'Organizer not found' },
      { status: 403 }
    )
  }

  if (user.role !== 'organizer') {
    return NextResponse.json(
      { error: 'Only organizers can create events' },
      { status: 403 }
    )
  }

  const errors = validateEventInput(eventData)
  if (errors.length > 0) {
    return NextResponse.json(
      { error: 'Validation failed', details: errors },
      { status: 400 }
    )
  }

  try {
    const event = createEvent({
      ...eventData,
      organizerId,
    } as {
      name: string
      description: string
      date: string
      venue: string
      category: import('@/data/events').EventCategory
      capacity: number
      organizerId: string
    })
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create event'
    return NextResponse.json(
      { error: message },
      { status: 400 }
    )
  }
}