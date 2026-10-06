import { client } from '@/lib/sanity'
import FadeIn from '@/components/FadeIn'

async function getUpcomingEvents() {
  return client.fetch(
    `*[_type == "event" && !isPrivate && date >= now()] | order(date asc) {
      _id,
      title,
      date,
      endDate,
      type,
      description,
      location,
      rsvpLink,
      rsvpEmail
    }`
  )
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return {
    day: d.toLocaleDateString('en-US', { day: '2-digit' }),
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    year: d.toLocaleDateString('en-US', { year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),
  }
}

function getBioText(description: unknown[]): string | null {
  if (!description?.length) return null
  const block = description[0] as { children?: { text: string }[] }
  return block?.children?.[0]?.text ?? null
}

type Event = {
  _id: string
  title: string
  date: string
  endDate?: string
  type?: string
  description?: unknown[]
  location?: { name?: string; address?: string; notes?: string }
  rsvpLink?: string
  rsvpEmail?: string
}

export default async function UpcomingEvents() {
  const events: Event[] = await getUpcomingEvents()
  if (!events.length) return null

  return (
    <section className="bg-dr-black py-24 px-8">
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <FadeIn>
          <p className="font-display text-dr-gold text-xs tracking-widest uppercase mb-16 text-center">
            Upcoming Events
          </p>
        </FadeIn>

        <div className="max-w-3xl mx-auto">
          {events.map((event, i) => {
            const { day, month, year, time, weekday } = formatDate(event.date)
            const descText = event.description ? getBioText(event.description) : null
            const rsvp = event.rsvpLink || (event.rsvpEmail ? `mailto:${event.rsvpEmail}` : null)

            return (
              <FadeIn key={event._id} delay={i * 100}>
                {/* Divider — top of first, between all */}
                <div className="h-px w-full" style={{ background: 'rgba(201,169,110,0.2)' }} />

                <div className="grid grid-cols-[80px_1fr] gap-10 py-12">

                  {/* Date column */}
                  <div className="flex flex-col items-center pt-1">
                    <span className="font-serif text-dr-gold leading-none" style={{ fontSize: '2.75rem' }}>
                      {day}
                    </span>
                    <span className="font-display text-dr-gold/70 text-[10px] tracking-widest uppercase mt-1">
                      {month}
                    </span>
                    <span className="font-display text-dr-cream/80 text-[9px] tracking-widest mt-1">
                      {year}
                    </span>
                  </div>

                  {/* Content column */}
                  <div>
                    <p className="font-display text-dr-cream/75 text-[10px] tracking-widest uppercase mb-3">
                      {weekday} · {time}
                      {event.location?.name ? ` · ${event.location.name}` : ''}
                    </p>

                    <h3 className="font-serif font-light text-dr-cream text-3xl leading-tight mb-4">
                      {event.title}
                    </h3>

                    {descText && (
                      <p className="font-serif font-light text-dr-cream/75 text-base leading-relaxed mb-6 max-w-lg">
                        {descText.length > 180 ? descText.slice(0, 180).trimEnd() + '…' : descText}
                      </p>
                    )}

                    {event.location?.address && (
                      <p className="font-display text-dr-cream/80 text-[10px] tracking-widest uppercase mb-6">
                        {event.location.address}
                        {event.location.notes ? ` · ${event.location.notes}` : ''}
                      </p>
                    )}

                    {rsvp && (
                      <a
                        href={rsvp}
                        target={event.rsvpLink ? '_blank' : undefined}
                        rel={event.rsvpLink ? 'noopener noreferrer' : undefined}
                        className="inline-block font-display text-dr-cream text-[10px] tracking-widest uppercase border border-dr-cream/30 px-6 py-3 hover:border-dr-gold hover:text-dr-gold transition-colors duration-300"
                      >
                        RSVP
                      </a>
                    )}
                  </div>

                </div>

                {/* Bottom divider on last item */}
                {i === events.length - 1 && (
                  <div className="h-px w-full" style={{ background: 'rgba(201,169,110,0.2)' }} />
                )}
              </FadeIn>
            )
          })}
        </div>

        <div className="h-px w-full mt-16" style={{ background: 'rgba(201,169,110,0.25)' }} />
      </div>
    </section>
  )
}
