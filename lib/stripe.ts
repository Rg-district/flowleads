import Stripe from 'stripe'

// Stripe client - will fail at runtime if key not set, but allows build
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null as unknown as Stripe
