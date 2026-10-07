import { validateContact } from '../src/lib/validate-contact.js'

export function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        resolve(raw ? JSON.parse(raw) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

export async function getContactInput(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body
  }
  if (typeof req.body === 'string' && req.body) {
    return JSON.parse(req.body)
  }
  return readJsonBody(req)
}

export async function processContact(input, env = {}) {
  const { name, email, message, company, errors } = validateContact(input)

  if (Object.keys(errors).length) {
    return {
      status: 400,
      body: { ok: false, message: 'Check the highlighted fields.', errors },
    }
  }

  if (company) {
    return { status: 200, body: { ok: true, message: 'Thanks. I’ll get back to you.' } }
  }

  const key = env.RESEND_API_KEY
  const to = env.CONTACT_TO_EMAIL
  const from = env.CONTACT_FROM_EMAIL || 'Daryl Glass <onboarding@resend.dev>'

  if (!key || !to) {
    return {
      status: 503,
      body: {
        ok: false,
        message: 'The form is not sending yet. Use the email address above.',
      },
    }
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Website enquiry from ${name}`,
      text: `${name} <${email}>\n\n${message}`,
    }),
  })

  if (!response.ok) {
    return {
      status: 502,
      body: { ok: false, message: 'Could not send just now. Email me directly.' },
    }
  }

  return { status: 200, body: { ok: true, message: 'Thanks. I’ll get back to you.' } }
}
