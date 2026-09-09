'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-dr-black' : 'bg-transparent'
      }`}
      style={{ borderBottom: '1px solid rgba(201,169,110,0.2)' }}
    >
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="no-underline flex items-center gap-4" aria-label="Designer Residence">
          <DRMonogram />
          <div className="flex flex-col justify-center pl-2">
            <span className="font-display text-dr-cream text-xs tracking-[0.25em] uppercase leading-tight">
              Designer Residence
            </span>
            <span className="font-serif text-dr-cream/40 text-[9px] tracking-[0.2em] uppercase leading-tight mt-0.5">
              Tribeca
            </span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-6">
          <Link
            href="https://www.instagram.com/designerresidence"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-dr-cream/70 hover:text-dr-gold transition-colors duration-300"
          >
            <InstagramIcon />
          </Link>
        </div>

      </div>
    </nav>
  )
}

function DRMonogram() {
  return (
    <svg
      width="44"
      height="40"
      viewBox="0 0 44 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <text
        x="0"
        y="34"
        fontFamily="Cormorant SC, Georgia, serif"
        fontSize="38"
        fontWeight="400"
        fill="#E8DFD0"
        letterSpacing="-2"
      >
        D
      </text>
      <text
        x="18"
        y="34"
        fontFamily="Cormorant SC, Georgia, serif"
        fontSize="38"
        fontWeight="400"
        fill="#E8DFD0"
        letterSpacing="-2"
      >
        R
      </text>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}
