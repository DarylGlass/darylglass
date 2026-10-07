import { useState } from 'react'
import { validateContact } from '../lib/validate-contact.js'

const initial = { state: 'idle', message: '', errors: {} }

export default function ContactForm() {
  const [status, setStatus] = useState(initial)

  async function onSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const input = Object.fromEntries(new FormData(form))
    const { errors } = validateContact(input)

    if (Object.keys(errors).length) {
      setStatus({ state: 'error', message: 'Check the highlighted fields.', errors })
      return
    }

    setStatus({ state: 'pending', message: '', errors: {} })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const body = await response.json()
      setStatus({
        state: body.ok ? 'success' : 'error',
        message: body.message || 'Could not send just now. Email me directly.',
        errors: body.errors || {},
      })
      if (body.ok) form.reset()
    } catch {
      setStatus({
        state: 'error',
        message: 'Could not send just now. Email me directly.',
        errors: {},
      })
    }
  }

  const pending = status.state === 'pending'

  return (
    <form className="relative grid max-w-xl gap-5 bg-paper p-6 sm:p-8" onSubmit={onSubmit} noValidate>
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium">
        Name
        <input
          name="name"
          type="text"
          autoComplete="name"
          aria-invalid={status.errors.name ? 'true' : undefined}
          className="border-b border-ink bg-transparent py-2 text-base font-normal outline-none"
        />
        {status.errors.name ? <span className="font-normal">{status.errors.name}</span> : null}
      </label>

      <label className="grid gap-2 text-sm font-medium">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={status.errors.email ? 'true' : undefined}
          className="border-b border-ink bg-transparent py-2 text-base font-normal outline-none"
        />
        {status.errors.email ? <span className="font-normal">{status.errors.email}</span> : null}
      </label>

      <label className="grid gap-2 text-sm font-medium">
        Message
        <textarea
          name="message"
          rows={5}
          aria-invalid={status.errors.message ? 'true' : undefined}
          className="resize-y border-b border-ink bg-transparent py-2 text-base font-normal outline-none"
        />
        {status.errors.message ? <span className="font-normal">{status.errors.message}</span> : null}
      </label>

      <button
        type="submit"
        disabled={pending}
        className="justify-self-start bg-ink px-5 py-3 text-sm font-medium text-paper disabled:opacity-60"
      >
        {pending ? 'Sending' : 'Send'}
      </button>

      {status.message ? (
        <p role="status" className="text-sm">
          {status.message}
        </p>
      ) : null}
    </form>
  )
}
