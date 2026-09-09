'use client'

export default function HeroCTA() {
  const openModal = () => {
    window.dispatchEvent(new CustomEvent('dr:open-signup'))
  }

  return (
    <button
      onClick={openModal}
      className="inline-block font-display text-dr-cream text-xs tracking-widest uppercase border border-dr-cream/40 px-10 py-4 hover:bg-dr-gold hover:border-dr-gold hover:text-dr-black transition-all duration-300 mt-10"
    >
      Join the List
    </button>
  )
}
