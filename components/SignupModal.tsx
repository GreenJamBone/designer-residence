'use client'

import { useEffect, useState } from 'react'

type FormState = 'idle' | 'loading' | 'success' | 'error'

const STORAGE_KEY = 'dr_signup_dismissed'

export default function SignupModal() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' })

  useEffect(() => {
    // Manual trigger from hero CTA — always opens regardless of storage
    const onForceOpen = () => {
      setState('idle')
      setError(null)
      setOpen(true)
    }
    window.addEventListener('dr:open-signup', onForceOpen)

    // Scroll trigger — only fires once per visit if not already dismissed/subscribed
    let scrollBound = false
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        scrollBound = true
      }
    } catch {}

    const onScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (scrolled >= 0.6) {
        setOpen(true)
        window.removeEventListener('scroll', onScroll)
      }
    }

    if (scrollBound) {
      window.addEventListener('scroll', onScroll, { passive: true })
    }

    return () => {
      window.removeEventListener('dr:open-signup', onForceOpen)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, 'dismissed') } catch {}
    setOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')
    setError(null)

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Something went wrong.')
      setState('success')
      try { localStorage.setItem(STORAGE_KEY, 'subscribed') } catch {}
      setTimeout(() => setOpen(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setState('error')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dr-black/80 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal */}
      <div className="relative z-10 bg-dr-card w-full max-w-md px-10 py-12"
        style={{ border: '1px solid rgba(201,169,110,0.2)' }}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-5 right-6 font-display text-dr-cream/30 text-xs tracking-widest hover:text-dr-gold transition-colors duration-200"
        >
          ✕
        </button>

        {state === 'success' ? (
          <div className="text-center py-6">
            <div className="h-px w-12 mx-auto mb-8" style={{ background: 'rgba(201,169,110,0.4)' }} />
            <p className="font-display text-dr-gold text-xs tracking-widest uppercase mb-4">
              You're on the list
            </p>
            <p className="font-serif text-dr-cream/60 text-base">Thank you. We'll be in touch.</p>
            <div className="h-px w-12 mx-auto mt-8" style={{ background: 'rgba(201,169,110,0.4)' }} />
          </div>
        ) : (
          <>
            <p className="font-display text-dr-gold text-[10px] tracking-widest uppercase mb-4 text-center">
              Join the List
            </p>
            <h2 className="font-serif font-light text-dr-cream text-3xl text-center leading-tight mb-3">
              Be the first to know.
            </h2>
            <p className="font-serif text-dr-cream/40 text-sm text-center leading-relaxed mb-10">
              Private previews, new residencies, and exclusive access.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <ModalField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required />
                <ModalField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
              <div className="mb-6">
                <ModalField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="mb-10">
                <ModalField label="Phone (optional)" name="phone" type="tel" value={form.phone} onChange={handleChange} />
              </div>

              {state === 'error' && error && (
                <p className="font-serif text-red-400/80 text-sm text-center mb-4">{error}</p>
              )}

              <button
                type="submit"
                disabled={state === 'loading'}
                className="w-full font-display text-dr-cream text-xs tracking-widest uppercase border border-dr-cream/30 py-4 hover:bg-dr-gold hover:border-dr-gold hover:text-dr-black transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {state === 'loading' ? 'Sending…' : 'Join the List'}
              </button>

              <button
                type="button"
                onClick={dismiss}
                className="w-full mt-4 font-display text-dr-cream/20 text-[10px] tracking-widest uppercase hover:text-dr-cream/40 transition-colors duration-200"
              >
                No thanks
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

type FieldProps = {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
}

function ModalField({ label, name, value, onChange, type = 'text', required }: FieldProps) {
  return (
    <div className="relative">
      <input
        id={`modal-${name}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        className="peer w-full bg-transparent text-dr-cream font-serif text-base pt-5 pb-2 outline-none border-b border-dr-cream/20 focus:border-dr-gold transition-colors duration-300 placeholder-transparent"
      />
      <label
        htmlFor={`modal-${name}`}
        className="absolute left-0 top-0 font-display text-[10px] tracking-widest uppercase text-dr-cream/30 peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-serif peer-focus:top-0 peer-focus:text-[10px] peer-focus:tracking-widest peer-focus:font-display peer-focus:text-dr-gold/70 transition-all duration-200"
      >
        {label}
      </label>
    </div>
  )
}
