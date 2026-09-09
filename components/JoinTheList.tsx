'use client'

import { useState } from 'react'
import FadeIn from '@/components/FadeIn'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function JoinTheList() {
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')
    setError(null)

    try {
      const res = await fetch('/api/mailchimp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong.')
      }

      setState('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setState('error')
    }
  }

  return (
    <section className="bg-dr-black py-24 px-8">
      <div className="max-w-xl mx-auto">

        <FadeIn>
          {/* Section label */}
          <p className="font-display text-dr-gold text-xs tracking-widest uppercase mb-6 text-center">
            Join the List
          </p>

          <h2 className="font-serif font-light text-dr-cream text-center leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Be the first to know.
          </h2>

          <p className="font-serif text-dr-cream/50 text-center text-base leading-relaxed mb-14">
            Private previews, new residencies, and exclusive access — delivered quietly to your inbox.
          </p>
        </FadeIn>

        {state === 'success' ? (
          <div className="text-center py-12">
            <div className="h-px w-16 mx-auto mb-10" style={{ background: 'rgba(201,169,110,0.4)' }} />
            <p className="font-display text-dr-gold text-xs tracking-widest uppercase mb-4">
              You're on the list
            </p>
            <p className="font-serif text-dr-cream/60 text-base">
              Thank you. We'll be in touch.
            </p>
            <div className="h-px w-16 mx-auto mt-10" style={{ background: 'rgba(201,169,110,0.4)' }} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <Field
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <Field
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-8">
              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-12">
              <Field
                label="Phone (optional)"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            {state === 'error' && error && (
              <p className="font-serif text-red-400/80 text-sm text-center mb-6">{error}</p>
            )}

            <div className="text-center">
              <button
                type="submit"
                disabled={state === 'loading'}
                className="inline-block font-display text-dr-cream text-xs tracking-widest uppercase border border-dr-cream/40 px-12 py-4 hover:bg-dr-gold hover:border-dr-gold hover:text-dr-black transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {state === 'loading' ? 'Sending…' : 'Join the List'}
              </button>
            </div>
          </form>
        )}

      </div>

      <div className="max-w-7xl mx-auto">
        <div className="h-px w-full mt-24" style={{ background: 'rgba(201,169,110,0.25)' }} />
      </div>
    </section>
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

function Field({ label, name, value, onChange, type = 'text', required }: FieldProps) {
  return (
    <div className="relative group">
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        autoComplete={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'off'}
        className="peer w-full bg-transparent text-dr-cream font-serif text-base pt-5 pb-2 outline-none border-b border-dr-cream/20 focus:border-dr-gold transition-colors duration-300 placeholder-transparent"
      />
      <label
        htmlFor={name}
        className="absolute left-0 top-0 font-display text-[10px] tracking-widest uppercase text-dr-cream/30 peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:font-serif peer-focus:top-0 peer-focus:text-[10px] peer-focus:tracking-widest peer-focus:font-display peer-focus:text-dr-gold/70 transition-all duration-200"
      >
        {label}
      </label>
    </div>
  )
}
