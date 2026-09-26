import { NextResponse } from 'next/server'
import { registrations, cancelRegistration } from '@/data/registrations'
import { incrementEventSeats } from '@/data/events'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const regId = params.id
    const reg = registrations.find(r => r.id === regId)
    
    if (!reg) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    if (reg.status === 'cancelled') {
      return NextResponse.json({ error: 'Already cancelled' }, { status: 400 })
    }

    cancelRegistration(regId)
    incrementEventSeats(reg.eventId)

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to cancel' }, { status: 500 })
  }
}
