import { NextRequest, NextResponse } from 'next/server'
import { getUserById } from '@/data/auth'
import { getEventById, updateEvent, cancelEvent, validateEventInput, CampusEvent } from '@/data/events'

async function verifyOrganizer(
  organizerId: string
): Promise<{ user: import('@/data/auth').AppUser } | NextResponse> {
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
      { error: 'Only organizers can perform this action' },
      { status: 403 }
    )
  }

  return { user }
}

async function getEventAndVerifyOwner(
  id: string,
  organizerId: string
): Promise<{ event: import('@/data/events').CampusEvent } | NextResponse> {
  const event = getEventById(id)
  if (!event) {
    return NextResponse.json(
      { error: 'Event not found' },
      { status: 404 }
    )
  }

  if (event.organizerId !== organizerId) {
    return NextResponse.json(
      { error: 'You can only manage your own events' },
      { status: 403 }
    )
  }

  return { event }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const bodyRecord = body as Record<string, unknown>
  const organizerId = bodyRecord.organizerId as string | undefined
  const { organizerId: _, ...updates } = bodyRecord

  const authResult = await verifyOrganizer(organizerId ?? '')
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const eventResult = await getEventAndVerifyOwner(id, organizerId!)
  if (eventResult instanceof NextResponse) {
    return eventResult
  }

  const allowedFields = ['name', 'description', 'date', 'venue', 'category', 'capacity']
  const filteredUpdates: Record<string, unknown> = {}
  for (const key of allowedFields) {
    if (key in updates) {
      filteredUpdates[key] = updates[key]
    }
  }

  if (Object.keys(filteredUpdates).length === 0) {
    return NextResponse.json(
      { error: 'No valid fields to update' },
      { status: 400 }
    )
  }

  const validationInput = {
    name: filteredUpdates.name as string | undefined,
    date: filteredUpdates.date as string | undefined,
    venue: filteredUpdates.venue as string | undefined,
    category: filteredUpdates.category as string | undefined,
    capacity: filteredUpdates.capacity as number | undefined,
  }

  const errors = validateEventInput(validationInput)
  if (errors.length > 0) {
    return NextResponse.json(
      { error: 'Validation failed', details: errors },
      { status: 400 }
    )
  }

  try {
    const updatedEvent = updateEvent(
      id,
      filteredUpdates as Partial<Pick<CampusEvent, 'name' | 'description' | 'date' | 'venue' | 'category' | 'capacity'>>
    )
    if (!updatedEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(updatedEvent, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update event'
    return NextResponse.json(
      { error: message },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const searchParams = request.nextUrl.searchParams
  const organizerId = searchParams.get('organizerId')

  const authResult = await verifyOrganizer(organizerId ?? '')
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const eventResult = await getEventAndVerifyOwner(id, organizerId!)
  if (eventResult instanceof NextResponse) {
    return eventResult
  }

  const cancelledEvent = cancelEvent(id)
  if (!cancelledEvent) {
    return NextResponse.json(
      { error: 'Event not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(cancelledEvent, { status: 200 })
}