import { Resend } from 'resend'

// Resend client - will fail at runtime if key not set, but allows build
export const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null as unknown as Resend
