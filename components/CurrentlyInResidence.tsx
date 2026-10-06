import Link from 'next/link'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity'
import FadeIn from '@/components/FadeIn'

async function getActiveDesigner() {
  return client.fetch(
    `*[_type == "designer" && isActive == true][0]{
      name,
      slug,
      tagline,
      bio,
      startDate,
      endDate,
      "heroImage": photos[0]
    }`
  )
}

function formatDateRange(start: string, end: string) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  return `${fmt(start)} — ${fmt(end)}`
}

export default async function CurrentlyInResidence() {
  const designer = await getActiveDesigner()
  if (!designer) return null

  const imageUrl = designer.heroImage
    ? urlFor(designer.heroImage).width(900).height(1100).fit('crop').quality(90).url()
    : null

  const bioExcerpt = designer.bio?.[0]?.children?.[0]?.text ?? null

  return (
    <section className="bg-dr-black py-24 px-8">
      {/* Gold rule top */}
      <div className="max-w-7xl mx-auto">
        <div className="h-px w-full mb-16" style={{ background: 'rgba(201,169,110,0.25)' }} />

        {/* Section label */}
        <FadeIn>
          <p className="font-display text-dr-gold text-xs tracking-widest uppercase mb-16 text-center">
            Currently In Residence
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Image */}
          {imageUrl && (
            <FadeIn direction="right">
              <div className="relative overflow-hidden aspect-[3/4] w-full">
                <Image
                  src={imageUrl}
                  alt={designer.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
            </FadeIn>
          )}

          {/* Text */}
          <FadeIn delay={150} className={imageUrl ? '' : 'md:col-span-2 max-w-2xl mx-auto text-center'}>
            {designer.startDate && designer.endDate && (
              <p className="font-display text-dr-gold/70 text-[10px] tracking-widest uppercase mb-6">
                {formatDateRange(designer.startDate, designer.endDate)}
              </p>
            )}

            <h2
              className="font-serif font-light text-dr-cream leading-tight mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
            >
              {designer.name}
            </h2>

            {designer.tagline && (
              <p className="font-display text-dr-cream/80 text-xs tracking-widest uppercase mb-8">
                {designer.tagline}
              </p>
            )}

            {bioExcerpt && (
              <p className="font-serif font-light text-dr-cream/80 text-lg leading-relaxed mb-12 max-w-md">
                {bioExcerpt.length > 220 ? bioExcerpt.slice(0, 220).trimEnd() + '…' : bioExcerpt}
              </p>
            )}

            <Link
              href={`/designers/${designer.slug.current}`}
              className="inline-block font-display text-dr-cream text-xs tracking-widest uppercase border border-dr-cream/30 px-8 py-4 hover:border-dr-gold hover:text-dr-gold transition-colors duration-300"
            >
              View the Collection
            </Link>
          </FadeIn>

        </div>

        {/* Gold rule bottom */}
        <div className="h-px w-full mt-16" style={{ background: 'rgba(201,169,110,0.25)' }} />
      </div>
    </section>
  )
}
