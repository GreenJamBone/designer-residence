import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client, urlFor } from '@/lib/sanity'

type Props = {
  params: Promise<{ slug: string }>
}

async function getDesigner(slug: string) {
  return client.fetch(
    `*[_type == "designer" && slug.current == $slug][0]{
      name,
      slug,
      tagline,
      bio,
      location,
      instagram,
      website,
      isActive,
      startDate,
      endDate,
      appointmentLink,
      pressQuote,
      pressSource,
      photos,
      collection[]{
        title,
        image,
        description,
        price,
        sizes,
        materials,
        isAvailable
      }
    }`,
    { slug }
  )
}

function formatDateRange(start: string, end: string) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  return `${fmt(start)} — ${fmt(end)}`
}

function getBioBlocks(bio: unknown[]): string {
  if (!bio?.length) return ''
  return (bio as { children?: { text: string }[] }[])
    .map((block) => block.children?.map((c) => c.text).join('') ?? '')
    .join('\n\n')
}

export default async function DesignerPage({ params }: Props) {
  const { slug } = await params
  const designer = await getDesigner(slug)

  if (!designer || !designer.isActive) notFound()

  const heroImage = designer.photos?.[0]
    ? urlFor(designer.photos[0]).width(1920).height(1080).fit('crop').quality(90).url()
    : null

  const bioText = designer.bio ? getBioBlocks(designer.bio) : null
  const appointmentHref = designer.appointmentLink ?? `mailto:info@designerresidence.com?subject=Private Styling — ${designer.name}`

  return (
    <main className="bg-dr-black min-h-screen">

      {/* Hero image */}
      <div className="relative w-full h-[70vh] min-h-[500px]">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={designer.name}
            fill
            priority
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 bg-dr-card" />
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(13,13,13,0.2) 0%, rgba(13,13,13,0.85) 100%)' }}
        />

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-16 max-w-7xl mx-auto">
          {designer.startDate && designer.endDate && (
            <p className="font-display text-dr-gold/70 text-[10px] tracking-widest uppercase mb-4">
              {formatDateRange(designer.startDate, designer.endDate)}
            </p>
          )}
          <p className="font-display text-dr-gold text-xs tracking-widest uppercase mb-4">
            In Residence
          </p>
          <h1
            className="font-serif font-light text-dr-cream leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
          >
            {designer.name}
          </h1>
          {designer.tagline && (
            <p className="font-display text-dr-cream/50 text-xs tracking-widest uppercase mt-4">
              {designer.tagline}
            </p>
          )}
        </div>
      </div>

      {/* Bio + press */}
      <section className="px-8 py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          <div>
            {designer.location && (
              <p className="font-display text-dr-gold/60 text-[10px] tracking-widest uppercase mb-6">
                {designer.location}
              </p>
            )}
            {bioText && (
              <div className="font-serif font-light text-dr-cream/70 text-lg leading-relaxed space-y-6">
                {bioText.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}

            {/* Links */}
            <div className="flex gap-6 mt-10">
              {designer.instagram && (
                <a
                  href={`https://instagram.com/${designer.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-dr-cream/40 text-[10px] tracking-widest uppercase hover:text-dr-gold transition-colors duration-300"
                  style={{ textDecoration: 'none' }}
                >
                  @{designer.instagram}
                </a>
              )}
              {designer.website && (
                <a
                  href={designer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-dr-cream/40 text-[10px] tracking-widest uppercase hover:text-dr-gold transition-colors duration-300"
                  style={{ textDecoration: 'none' }}
                >
                  Website
                </a>
              )}
            </div>
          </div>

          {/* Press quote */}
          {designer.pressQuote && (
            <div className="md:pt-12">
              <div className="h-px w-12 mb-8" style={{ background: 'rgba(201,169,110,0.4)' }} />
              <blockquote className="font-serif font-light text-dr-cream/80 text-2xl leading-relaxed italic mb-6">
                "{designer.pressQuote}"
              </blockquote>
              {designer.pressSource && (
                <p className="font-display text-dr-gold/60 text-[10px] tracking-widest uppercase">
                  — {designer.pressSource}
                </p>
              )}
            </div>
          )}

        </div>
      </section>

      {/* Divider */}
      <div className="px-8">
        <div className="max-w-7xl mx-auto h-px" style={{ background: 'rgba(201,169,110,0.2)' }} />
      </div>

      {/* Collection */}
      {designer.collection?.length > 0 && (
        <section className="px-8 py-24">
          <div className="max-w-7xl mx-auto">
            <p className="font-display text-dr-gold text-xs tracking-widest uppercase mb-16 text-center">
              The Collection
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {designer.collection.map((piece: {
                title: string
                image?: unknown
                description?: string
                price?: number
                sizes?: string[]
                materials?: string
                isAvailable?: boolean
              }, i: number) => {
                const pieceImage = piece.image
                  ? urlFor(piece.image).width(600).height(750).fit('crop').quality(85).url()
                  : null

                return (
                  <div key={i} className="group">
                    {/* Image */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-dr-card mb-6">
                      {pieceImage ? (
                        <Image
                          src={pieceImage}
                          alt={piece.title}
                          fill
                          className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-dr-card" />
                      )}
                      {piece.isAvailable === false && (
                        <div className="absolute top-4 left-4 font-display text-[9px] tracking-widest uppercase text-dr-cream/60 bg-dr-black/80 px-3 py-1">
                          Sold
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <h3 className="font-serif text-dr-cream text-xl mb-2">{piece.title}</h3>
                    {piece.description && (
                      <p className="font-serif font-light text-dr-cream/50 text-sm leading-relaxed mb-3">
                        {piece.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {piece.price ? (
                        <p className="font-display text-dr-gold text-xs tracking-widest">
                          ${piece.price.toLocaleString()}
                        </p>
                      ) : <span />}
                      {piece.materials && (
                        <p className="font-display text-dr-cream/30 text-[9px] tracking-widest uppercase">
                          {piece.materials}
                        </p>
                      )}
                    </div>
                    {piece.sizes?.length ? (
                      <p className="font-display text-dr-cream/30 text-[9px] tracking-widest uppercase mt-2">
                        {piece.sizes.join(' · ')}
                      </p>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Divider */}
      <div className="px-8">
        <div className="max-w-7xl mx-auto h-px" style={{ background: 'rgba(201,169,110,0.2)' }} />
      </div>

      {/* CTA — Private Styling */}
      <section className="px-8 py-24 text-center">
        <p className="font-display text-dr-gold text-xs tracking-widest uppercase mb-6">
          Private Appointments
        </p>
        <h2
          className="font-serif font-light text-dr-cream leading-tight mb-8"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
        >
          Book a Private Styling Appointment
        </h2>
        <p className="font-serif text-dr-cream/50 text-base mb-12 max-w-md mx-auto leading-relaxed">
          Experience the collection one-on-one with a personal stylist at 147 Reade St.
        </p>
        <a
          href={appointmentHref}
          target={designer.appointmentLink ? '_blank' : undefined}
          rel={designer.appointmentLink ? 'noopener noreferrer' : undefined}
          className="inline-block font-display text-dr-cream text-xs tracking-widest uppercase border border-dr-cream/30 px-12 py-4 hover:bg-dr-gold hover:border-dr-gold hover:text-dr-black transition-all duration-300"
        >
          Request an Appointment
        </a>
      </section>

      {/* Back link */}
      <div className="px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="h-px w-full mb-10" style={{ background: 'rgba(201,169,110,0.2)' }} />
          <Link
            href="/"
            className="font-display text-dr-cream/30 text-[10px] tracking-widest uppercase hover:text-dr-gold transition-colors duration-300"
            style={{ textDecoration: 'none' }}
          >
            ← Back to Designer Residence
          </Link>
        </div>
      </div>

    </main>
  )
}
