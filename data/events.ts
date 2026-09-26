export type EventCategory =
  | 'Tech'
  | 'Cultural'
  | 'Sports'
  | 'Workshop'
  | 'Career'
  | 'Music'

export interface CampusEvent {
  id: string
  name: string
  description: string
  date: string // ISO 8601 date string, e.g. "2026-10-02T17:00:00"
  venue: string
  category: EventCategory
  capacity: number
  seatsAvailable: number
  organizerId: string
  cancelled: boolean
}

// "Today" for the seed data. Events before this are considered past.
export const TODAY = new Date('2026-09-16T09:00:00')

export const events: CampusEvent[] = [
  {
    id: 'evt-01',
    name: 'Hack the Campus 2026',
    description:
      'A 24-hour overnight hackathon open to all branches. Teams of up to 4 build anything that makes campus life better. Food, mentors, and a closing demo night included.',
    date: '2026-10-04T18:00:00',
    venue: 'Innovation Lab, Block C',
    category: 'Tech',
    capacity: 120,
    seatsAvailable: 37,
    organizerId: 'org-1',
    cancelled: false,
  },
  {
    id: 'evt-02',
    name: 'Acoustic Nights: Open Mic',
    description:
      'Sign up to sing, play, or read poetry. No audition needed — just bring your nerves and your talent. Snacks provided by the Cultural Committee.',
    date: '2026-09-25T19:30:00',
    venue: 'Amphitheatre Lawn',
    category: 'Music',
    capacity: 80,
    seatsAvailable: 0,
    organizerId: 'org-2',
    cancelled: false,
  },
  {
    id: 'evt-03',
    name: 'Resume & LinkedIn Clinic',
    description:
      'Drop-in session with alumni volunteers who will review your resume and LinkedIn profile in 15-minute slots. Walk-ins welcome, but seats are limited.',
    date: '2026-09-22T14:00:00',
    venue: 'Placement Cell, Admin Block',
    category: 'Career',
    capacity: 40,
    seatsAvailable: 12,
    organizerId: 'org-3',
    cancelled: false,
  },
  {
    id: 'evt-04',
    name: 'Inter-Hostel Football Cup — Final',
    description:
      "The championship match of this year's Inter-Hostel Football Cup. Come cheer your hostel on.",
    date: '2026-09-05T16:00:00',
    venue: 'Main Sports Ground',
    category: 'Sports',
    capacity: 300,
    seatsAvailable: 45,
    organizerId: 'org-4',
    cancelled: false,
  },
  {
    id: 'evt-05',
    name: 'Intro to Figma Workshop',
    description:
      'A hands-on beginner workshop covering frames, components, and prototyping in Figma. Bring your own laptop.',
    date: '2026-10-10T15:00:00',
    venue: 'Design Studio, Block B',
    category: 'Workshop',
    capacity: 30,
    seatsAvailable: 6,
    organizerId: 'org-2',
    cancelled: false,
  },
  {
    id: 'evt-06',
    name: 'Diwali Mela',
    description:
      'Stalls, rangoli competitions, and a fireworks-free light show to celebrate Diwali on campus. Open to students, faculty, and families.',
    date: '2026-11-01T17:00:00',
    venue: 'Central Quad',
    category: 'Cultural',
    capacity: 500,
    seatsAvailable: 500,
    organizerId: 'org-2',
    cancelled: false,
  },
  {
    id: 'evt-07',
    name: 'Competitive Programming Bootcamp',
    description:
      "Three-hour bootcamp on graph algorithms and dynamic programming, run by the CP club's senior members ahead of the ICPC regionals.",
    date: '2026-09-10T10:00:00',
    venue: 'Computer Science Lab 2',
    category: 'Tech',
    capacity: 60,
    seatsAvailable: 0,
    organizerId: 'org-1',
    cancelled: false,
  },
  {
    id: 'evt-08',
    name: 'Basketball 3x3 Street League',
    description:
      'Casual weekly 3x3 basketball league. Register your team of 3–4, matches are round-robin followed by knockouts.',
    date: '2026-09-30T17:30:00',
    venue: 'Outdoor Courts',
    category: 'Sports',
    capacity: 64,
    seatsAvailable: 20,
    organizerId: 'org-4',
    cancelled: false,
  },
  {
    id: 'evt-09',
    name: 'Startup Pitch Day',
    description:
      'Student founders pitch to a panel of alumni investors for a shot at seed funding and mentorship from the E-Cell.',
    date: '2026-10-18T13:00:00',
    venue: 'Auditorium',
    category: 'Career',
    capacity: 200,
    seatsAvailable: 88,
    organizerId: 'org-3',
    cancelled: false,
  },
  {
    id: 'evt-10',
    name: 'Photography Walk: Old Campus',
    description:
      'A guided golden-hour photo walk through the older parts of campus, led by the Photography Club. All skill levels welcome.',
    date: '2026-09-01T17:00:00',
    venue: 'Meet at Main Gate',
    category: 'Workshop',
    capacity: 25,
    seatsAvailable: 3,
    organizerId: 'org-2',
    cancelled: false,
  },
  {
    id: 'evt-11',
    name: 'Classical Fusion Night',
    description:
      'The Music Society blends Carnatic and Hindustani classical forms with modern instruments in a one-night showcase.',
    date: '2026-10-25T19:00:00',
    venue: 'Amphitheatre Lawn',
    category: 'Music',
    capacity: 150,
    seatsAvailable: 150,
    organizerId: 'org-2',
    cancelled: false,
  },
  {
    id: 'evt-12',
    name: 'Data Structures Doubt-Clearing Marathon',
    description:
      'Pre-exam doubt-clearing session covering trees, heaps, and hashing, run by teaching assistants from the CS department.',
    date: '2026-08-28T11:00:00',
    venue: 'Lecture Hall 4',
    category: 'Tech',
    capacity: 90,
    seatsAvailable: 9,
    organizerId: 'org-1',
    cancelled: false,
  },
  {
    id: 'evt-13',
    name: "Freshers' Orientation Games",
    description:
      'Icebreaker games and campus scavenger hunt for the incoming batch, hosted by the Student Council.',
    date: '2026-09-08T09:30:00',
    venue: 'Central Quad',
    category: 'Cultural',
    capacity: 250,
    seatsAvailable: 0,
    organizerId: 'org-4',
    cancelled: false,
  },
  {
    id: 'evt-14',
    name: 'Cloud & DevOps Study Group Kickoff',
    description:
      'First meetup of a semester-long study group covering AWS fundamentals and CI/CD pipelines. No prior cloud experience needed.',
    date: '2026-09-29T18:00:00',
    venue: 'Computer Science Lab 1',
    category: 'Workshop',
    capacity: 45,
    seatsAvailable: 45,
    organizerId: 'org-1',
    cancelled: false,
  },
  {
    id: 'evt-15',
    name: 'Badminton Doubles Tournament',
    description:
      'Open doubles tournament, singles-elimination bracket. Racquets available to borrow at the sports office.',
    date: '2026-10-12T08:00:00',
    venue: 'Indoor Sports Complex',
    category: 'Sports',
    capacity: 32,
    seatsAvailable: 14,
    organizerId: 'org-4',
    cancelled: false,
  },
]

/** True when the event's date has already passed relative to TODAY. */
export function isPastEvent(event: CampusEvent): boolean {
  return new Date(event.date).getTime() < TODAY.getTime()
}

/** True when there are no seats left. */
export function isFullEvent(event: CampusEvent): boolean {
  return event.seatsAvailable <= 0
}

/** Look up a single event by id, or undefined if it doesn't exist. */
export function getEventById(id: string): CampusEvent | undefined {
  return events.find((event) => event.id === id)
}

/**
 * PARTICIPANT TASK (Task 1 — Event Listing):
 *
 * This is a stub. Right now it ignores `query` completely and just
 * returns every event, which is why `tests/search.test.ts` is failing.
 *
 * You need to make this do a case-insensitive, partial match on
 * `event.name` — e.g. "hack" should match "Hack the Campus 2026".
 */
export function searchEventsByName(
  eventList: CampusEvent[],
  query: string,
): CampusEvent[] {
  // TODO(participant): implement case-insensitive partial name search.
  return eventList
}

/**
 * PARTICIPANT TASK (Task 1 — Event Listing):
 *
 * This is a stub. Right now it ignores `category` and returns every
 * event unchanged. You need to filter by exact category match, and
 * make sure it composes with searchEventsByName above.
 */
export function filterEventsByCategory(
  eventList: CampusEvent[],
  category: EventCategory | 'All',
): CampusEvent[] {
  // TODO(participant): implement category filtering.
  return eventList
}

const VALID_CATEGORIES: EventCategory[] = [
  'Tech',
  'Cultural',
  'Sports',
  'Workshop',
  'Career',
  'Music',
]

export interface EventValidationError {
  field: string
  message: string
}

export function validateEventInput(input: {
  name?: string
  description?: string
  date?: string
  venue?: string
  category?: string
  capacity?: number
}): EventValidationError[] {
  const errors: EventValidationError[] = []

  if (!input.name || input.name.trim() === '') {
    errors.push({ field: 'name', message: 'Event name is required' })
  }

  if (!input.date) {
    errors.push({ field: 'date', message: 'Event date is required' })
  } else {
    const eventDate = new Date(input.date)
    if (isNaN(eventDate.getTime())) {
      errors.push({ field: 'date', message: 'Invalid date format' })
    } else if (eventDate.getTime() <= TODAY.getTime()) {
      errors.push({ field: 'date', message: 'Event date must be in the future' })
    }
  }

  if (!input.venue || input.venue.trim() === '') {
    errors.push({ field: 'venue', message: 'Venue is required' })
  }

  if (!input.category || !VALID_CATEGORIES.includes(input.category as EventCategory)) {
    errors.push({ field: 'category', message: 'Category must be one of: ' + VALID_CATEGORIES.join(', ') })
  }

  if (input.capacity === undefined || input.capacity === null) {
    errors.push({ field: 'capacity', message: 'Capacity is required' })
  } else if (!Number.isInteger(input.capacity) || input.capacity <= 0) {
    errors.push({ field: 'capacity', message: 'Capacity must be a positive integer' })
  }

  return errors
}

function generateEventId(): string {
  const maxId = events.reduce((max, event) => {
    const match = event.id.match(/^evt-(\d+)$/)
    if (match) {
      const num = parseInt(match[1], 10)
      return num > max ? num : max
    }
    return max
  }, 0)
  const nextId = maxId + 1
  return `evt-${String(nextId).padStart(2, '0')}`
}

export function createEvent(input: {
  name: string
  description: string
  date: string
  venue: string
  category: EventCategory
  capacity: number
  organizerId: string
}): CampusEvent {
  const errors = validateEventInput(input)
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join('; '))
  }

  const newEvent: CampusEvent = {
    id: generateEventId(),
    name: input.name.trim(),
    description: input.description?.trim() ?? '',
    date: input.date,
    venue: input.venue.trim(),
    category: input.category,
    capacity: input.capacity,
    seatsAvailable: input.capacity,
    organizerId: input.organizerId,
    cancelled: false,
  }

  events.push(newEvent)
  return newEvent
}

export function updateEvent(
  id: string,
  updates: Partial<Pick<CampusEvent, 'name' | 'description' | 'date' | 'venue' | 'category' | 'capacity'>>
): CampusEvent | undefined {
  const index = events.findIndex((e) => e.id === id)
  if (index === -1) {
    return undefined
  }

  const existingEvent = events[index]
  const mergedEvent: CampusEvent = {
    ...existingEvent,
    ...updates,
    name: updates.name?.trim() ?? existingEvent.name,
    description: updates.description?.trim() ?? existingEvent.description,
    venue: updates.venue?.trim() ?? existingEvent.venue,
  }

  const errors = validateEventInput({
    name: mergedEvent.name,
    date: mergedEvent.date,
    venue: mergedEvent.venue,
    category: mergedEvent.category,
    capacity: mergedEvent.capacity,
  })
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join('; '))
  }

  if (updates.capacity !== undefined && updates.capacity !== existingEvent.capacity) {
    const registered = existingEvent.capacity - existingEvent.seatsAvailable
    mergedEvent.seatsAvailable = Math.max(0, updates.capacity - registered)
  }

  events[index] = mergedEvent
  return mergedEvent
}

export function cancelEvent(id: string): CampusEvent | undefined {
  const index = events.findIndex((e) => e.id === id)
  if (index === -1) {
    return undefined
  }

  events[index] = {
    ...events[index],
    cancelled: true,
  }
  return events[index]
}
