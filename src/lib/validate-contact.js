const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContact(input = {}) {
  const name = String(input.name || '').trim()
  const email = String(input.email || '').trim()
  const message = String(input.message || '').trim()
  const company = String(input.company || '').trim()
  const errors = {}

  if (name.length < 2) errors.name = 'Enter your name.'
  if (!EMAIL.test(email)) errors.email = 'Enter a valid email.'
  if (message.length < 10) errors.message = 'Add a few more words so I know how to help.'

  return { name, email, message, company, errors }
}
