import { getContactInput, processContact } from '../server/contact.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Method not allowed' })
    return
  }

  try {
    const input = await getContactInput(req)
    const result = await processContact(input, process.env)
    res.status(result.status).json(result.body)
  } catch {
    res.status(400).json({ ok: false, message: 'Could not read that message.' })
  }
}
