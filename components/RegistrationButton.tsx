'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'

import { Registration } from '@/data/registrations'

interface RegistrationButtonProps {
  eventId: string
  canRegister: boolean
  status: string
  eventRegistrations?: Registration[]
}

export default function RegistrationButton({
  eventId,
  canRegister,
  status,
  eventRegistrations = [],
}: RegistrationButtonProps) {
  const { currentUser } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Calculate isRegistered based on server data and current user
  const isRegisteredServer = eventRegistrations.some(
    (r) => r.studentId === currentUser?.id && r.status === 'confirmed'
  )
  const [success, setSuccess] = useState(false)
  const isRegistered = isRegisteredServer || success

  const handleRegister = async () => {
    if (!currentUser) return
    
    if (currentUser.role !== 'student') {
      setError('Please log in as a student to register.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          studentId: currentUser.id,
          userRole: currentUser.role,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to register')
      } else {
        setSuccess(true)
        // Re-fetch the page data to update the seat count display immediately
        router.refresh()
      }
    } catch (err) {
      setError('Network error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
      {success && (
        <div style={{ fontSize: 13.5, color: 'var(--green)', fontWeight: 500 }}>
          Registration successful!
        </div>
      )}
      {error && (
        <div style={{ fontSize: 13.5, color: 'var(--rust)', fontWeight: 500, lineHeight: 1.4 }}>
          {error}
        </div>
      )}
      <button
        className="btn btn-primary"
        disabled={!canRegister || loading || isRegistered}
        onClick={handleRegister}
      >
        {loading
          ? 'Registering...'
          : isRegistered
            ? 'Registered'
            : !canRegister
              ? (status === 'full' ? 'Event full' : 'Registration closed')
              : currentUser?.role !== 'student'
                ? 'Log in to register'
                : 'Register'}
      </button>
    </div>
  )
}
