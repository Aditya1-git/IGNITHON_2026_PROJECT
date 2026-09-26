'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { EventCategory } from '@/data/events'

interface EventFormData {
  name: string
  description: string
  date: string
  venue: string
  category: EventCategory
  capacity: string
}

interface EventFormErrors {
  name?: string
  date?: string
  venue?: string
  category?: string
  capacity?: string
}

interface EventFormProps {
  initialData?: Partial<EventFormData>
  onSubmit: (data: EventFormData) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
  submitLabel: string
}

const CATEGORIES: EventCategory[] = ['Tech', 'Cultural', 'Sports', 'Workshop', 'Career', 'Music']

export default function EventForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    date: '',
    venue: '',
    category: 'Tech',
    capacity: '',
    ...initialData,
  })

  const [errors, setErrors] = useState<EventFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validateField = (name: keyof EventFormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Event name is required'
        break
      case 'date':
        if (!value) return 'Event date is required'
        const eventDate = new Date(value)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (eventDate <= today) return 'Event date must be in the future'
        break
      case 'venue':
        if (!value.trim()) return 'Venue is required'
        break
      case 'category':
        if (!CATEGORIES.includes(value as EventCategory)) return 'Invalid category'
        break
      case 'capacity':
        if (!value) return 'Capacity is required'
        const cap = parseInt(value, 10)
        if (isNaN(cap) || cap <= 0 || !Number.isInteger(cap)) return 'Capacity must be a positive integer'
        break
    }
    return undefined
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    const validatedKeys = ['name', 'date', 'venue', 'category', 'capacity'] as const
    if (validatedKeys.includes(name as typeof validatedKeys[number])) {
      const error = validateField(name as keyof EventFormData, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
    if (submitError) setSubmitError(null)
  }

  const validateAll = (): boolean => {
    const newErrors: EventFormErrors = {}
    let isValid = true
    const validatedKeys = ['name', 'date', 'venue', 'category', 'capacity'] as const
    for (const key of validatedKeys) {
      const error = validateField(key, formData[key])
      if (error) {
        newErrors[key] = error
        isValid = false
      }
    }
    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateAll()) return

    setSubmitError(null)
    try {
      await onSubmit(formData)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong'
      setSubmitError(message)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label htmlFor="name" style={{ display: 'block', fontSize: 13.5, marginBottom: 6, fontWeight: 500 }}>
          Event name <span style={{ color: 'var(--rust)' }}>*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '10px 14px',
            border: `1.5px solid ${errors.name ? 'var(--rust)' : 'var(--line)'}`,
            borderRadius: 'var(--radius)',
            fontSize: 14.5,
            background: 'var(--paper-raised)',
            color: 'var(--ink)',
          }}
        />
        {errors.name && <p style={{ fontSize: 12.5, color: 'var(--rust)', marginTop: 4 }}>{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="description" style={{ display: 'block', fontSize: 13.5, marginBottom: 6, fontWeight: 500 }}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isSubmitting}
          rows={4}
          style={{
            width: '100%',
            padding: '10px 14px',
            border: '1.5px solid var(--line)',
            borderRadius: 'var(--radius)',
            fontSize: 14.5,
            background: 'var(--paper-raised)',
            color: 'var(--ink)',
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
        />
      </div>

      <div>
        <label htmlFor="date" style={{ display: 'block', fontSize: 13.5, marginBottom: 6, fontWeight: 500 }}>
          Date & time <span style={{ color: 'var(--rust)' }}>*</span>
        </label>
        <input
          id="date"
          name="date"
          type="datetime-local"
          value={formData.date}
          onChange={handleChange}
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '10px 14px',
            border: `1.5px solid ${errors.date ? 'var(--rust)' : 'var(--line)'}`,
            borderRadius: 'var(--radius)',
            fontSize: 14.5,
            background: 'var(--paper-raised)',
            color: 'var(--ink)',
          }}
        />
        {errors.date && <p style={{ fontSize: 12.5, color: 'var(--rust)', marginTop: 4 }}>{errors.date}</p>}
      </div>

      <div>
        <label htmlFor="venue" style={{ display: 'block', fontSize: 13.5, marginBottom: 6, fontWeight: 500 }}>
          Venue <span style={{ color: 'var(--rust)' }}>*</span>
        </label>
        <input
          id="venue"
          name="venue"
          type="text"
          value={formData.venue}
          onChange={handleChange}
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '10px 14px',
            border: `1.5px solid ${errors.venue ? 'var(--rust)' : 'var(--line)'}`,
            borderRadius: 'var(--radius)',
            fontSize: 14.5,
            background: 'var(--paper-raised)',
            color: 'var(--ink)',
          }}
        />
        {errors.venue && <p style={{ fontSize: 12.5, color: 'var(--rust)', marginTop: 4 }}>{errors.venue}</p>}
      </div>

      <div>
        <label htmlFor="category" style={{ display: 'block', fontSize: 13.5, marginBottom: 6, fontWeight: 500 }}>
          Category <span style={{ color: 'var(--rust)' }}>*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '10px 14px',
            border: `1.5px solid ${errors.category ? 'var(--rust)' : 'var(--line)'}`,
            borderRadius: 'var(--radius)',
            fontSize: 14.5,
            background: 'var(--paper-raised)',
            color: 'var(--ink)',
          }}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <p style={{ fontSize: 12.5, color: 'var(--rust)', marginTop: 4 }}>{errors.category}</p>}
      </div>

      <div>
        <label htmlFor="capacity" style={{ display: 'block', fontSize: 13.5, marginBottom: 6, fontWeight: 500 }}>
          Capacity <span style={{ color: 'var(--rust)' }}>*</span>
        </label>
        <input
          id="capacity"
          name="capacity"
          type="number"
          min="1"
          step="1"
          value={formData.capacity}
          onChange={handleChange}
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '10px 14px',
            border: `1.5px solid ${errors.capacity ? 'var(--rust)' : 'var(--line)'}`,
            borderRadius: 'var(--radius)',
            fontSize: 14.5,
            background: 'var(--paper-raised)',
            color: 'var(--ink)',
          }}
        />
        {errors.capacity && <p style={{ fontSize: 12.5, color: 'var(--rust)', marginTop: 4 }}>{errors.capacity}</p>}
      </div>

      {submitError && (
        <div
          className="card-surface"
          style={{
            padding: '12px 16px',
            background: 'var(--rust-bg)',
            borderColor: 'var(--rust)',
            color: 'var(--rust)',
            fontSize: 13.5,
          }}
        >
          {submitError}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
          style={{ flex: 1 }}
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          style={{ flex: 1 }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}