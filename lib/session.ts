import 'server-only'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

export function displayNameFor(user: { name: string; username?: string | null; displayUsername?: string | null }) {
  return user.displayUsername || user.username || user.name
}
