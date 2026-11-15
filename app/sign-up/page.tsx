import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth/auth-form'
import { AuthShell } from '@/components/auth/auth-shell'
import { getSession } from '@/lib/session'

export const metadata: Metadata = { title: 'Create account | Sustainabytes NME' }

export default async function SignUpPage() {
  const session = await getSession()
  if (session?.user) redirect('/')

  return (
    <AuthShell title="Create your account" subtitle="Pick a username and password to start saving routes.">
      <AuthForm mode="sign-up" />
    </AuthShell>
  )
}
