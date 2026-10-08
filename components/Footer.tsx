import FadeIn from '@/components/FadeIn'

export default function Footer() {
  return (
    <footer className="bg-dr-black px-8 pt-16 pb-10">
      <div className="max-w-7xl mx-auto">

        <FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

          {/* Brand */}
          <div>
            <p className="font-display text-dr-cream text-xs tracking-widest uppercase mb-1">
              Designer Residence
            </p>
            <p className="font-display text-dr-gold/60 text-[10px] tracking-widest uppercase mb-6">
              Tribeca
            </p>
            <p className="font-serif text-dr-cream/75 text-sm leading-relaxed">
              A rotating residency for exceptional designers.<br />
              A curated fashion experience.
            </p>
          </div>

          {/* Visit */}
          <div>
            <p className="font-display text-dr-gold text-[10px] tracking-widest uppercase mb-6">
              Visit
            </p>
            <address className="not-italic font-serif text-dr-cream/75 text-sm leading-loose">
              147 Reade St<br />
              Tribeca, NY 10013
            </address>
            <div className="mt-6 font-serif text-dr-cream/75 text-sm leading-loose">
              <p>Monday &nbsp; Closed</p>
              <p>Tuesday – Friday &nbsp; 11am – 7pm</p>
              <p>Saturday – Sunday &nbsp; 12pm – 5pm</p>
            </div>
          </div>

          {/* Connect */}
          <div>
            <p className="font-display text-dr-gold text-[10px] tracking-widest uppercase mb-6">
              Connect
            </p>
            <a
              href="tel:+19172452876"
              className="font-serif text-dr-cream/75 text-sm hover:text-dr-gold transition-colors duration-300 block mb-3"
              style={{ textDecoration: 'none' }}
            >
              917-245-2876
            </a>
            <a
              href="mailto:info@designerresidence.com"
              className="font-serif text-dr-cream/75 text-sm hover:text-dr-gold transition-colors duration-300 block"
              style={{ textDecoration: 'none' }}
            >
              info@designerresidence.com
            </a>
          </div>

        </div>
        </FadeIn>

        {/* Bottom rule + copyright */}
        <div
          className="pt-8"
          style={{ borderTop: '1px solid rgba(201,169,110,0.2)' }}
        >
          <p className="font-display text-dr-cream/50 text-[10px] tracking-widest uppercase text-center">
            © {new Date().getFullYear()} Designer Residence. All rights reserved.
          </p>
          <p className="font-display text-dr-cream/50 text-[10px] tracking-widest uppercase text-center mt-3">
            Created by{' '}
            <a
              href="https://www.jamcreativetech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-dr-gold transition-colors duration-300"
              style={{ textDecoration: 'none' }}
            >
              JAM Creative &amp; Technology
            </a>
          </p>
        </div>

      </div>
    </footer>
  )
}
