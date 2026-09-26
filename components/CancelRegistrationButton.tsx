'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CancelRegistrationButton({ regId, onCancel }: { regId: string, onCancel?: () => void }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this registration?')) return

    setLoading(true)
    try {
      const res = await fetch(`/api/registrations/${regId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        if (onCancel) onCancel() // Call local update first if provided
        router.refresh()
      } else {
        alert('Failed to cancel registration.')
      }
    } catch (err) {
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className="btn btn-secondary"
      disabled={loading}
      onClick={handleCancel}
    >
      {loading ? 'Cancelling...' : 'Cancel'}
    </button>
  )
}
