import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity'
import HeroCTA from '@/components/HeroCTA'

async function getHeroData() {
  const [designer, settings] = await Promise.all([
    client.fetch(
      `*[_type == "designer" && isActive == true][0]{
        name,
        tagline,
        slug,
        startDate,
        endDate
      }`
    ),
    client.fetch(
      `*[_type == "siteSettings" && _id == "siteSettings"][0]{
        heroImage,
        heroOverlayOpacity
      }`
    ),
  ])
  return { designer, settings }
}

export default async function Hero() {
  const { designer, settings } = await getHeroData()

  const heroImageUrl = settings?.heroImage
    ? urlFor(settings.heroImage).width(1920).quality(90).url()
    : null

  const overlayOpacity = (settings?.heroOverlayOpacity ?? 50) / 100
  const overlayStyle = {
    background: `linear-gradient(to bottom, rgba(13,13,13,${overlayOpacity}) 0%, rgba(13,13,13,${Math.max(overlayOpacity - 0.15, 0)}) 40%, rgba(13,13,13,${Math.min(overlayOpacity + 0.2, 0.98)}) 100%)`,
  }

  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden">

      {/* Background image */}
      <div className="absolute inset-0">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={settings.heroImage?.alt ?? 'Designer Residence'}
            fill
            priority
            className="object-cover object-center"
          />
        ) : (
          <Image
            src="/store-interior.png"
            alt="Designer Residence — Tribeca"
            fill
            priority
            className="object-cover object-center"
          />
        )}
        <div className="absolute inset-0" style={overlayStyle} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">

        <p className="font-display text-dr-gold text-xs tracking-widest uppercase mb-3">
          {designer ? 'Now In Residence' : 'A Curated Fashion Experience'}
        </p>

        <p className="font-display text-dr-cream/60 text-xs tracking-widest uppercase mb-10">
          Tribeca · New York
        </p>

        <h1
          className="font-serif font-light text-dr-cream leading-[1.05] mb-10"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', textShadow: '0 2px 40px rgba(0,0,0,0.5)' }}
        >
          {designer ? designer.name : 'Designer\nResidence'}
        </h1>

        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="h-px flex-1 max-w-[80px]" style={{ background: 'rgba(201,169,110,0.5)' }} />
          <p className="font-serif text-dr-cream/80 text-sm tracking-[0.2em] uppercase" style={{ textShadow: '0 1px 20px rgba(0,0,0,0.6)' }}>
            {designer?.tagline ?? 'Limited Tribeca Edits — Rotating Residencies, Exceptional Pieces'}
          </p>
          <div className="h-px flex-1 max-w-[80px]" style={{ background: 'rgba(201,169,110,0.5)' }} />
        </div>

        <HeroCTA />

      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dr-cream/40">
        <span className="font-display text-[9px] tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-dr-gold/40 animate-pulse" />
      </div>

    </section>
  )
}
