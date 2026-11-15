'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

type Mode = 'sign-in' | 'sign-up'

const USERNAME_PATTERN = /^[a-zA-Z0-9_.]{3,30}$/

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const isSignUp = mode === 'sign-up'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const username = String(form.get('username') ?? '').trim()
    const password = String(form.get('password') ?? '')

    if (!USERNAME_PATTERN.test(username)) {
      setError('Usernames are 3–30 characters: letters, numbers, dots and underscores.')
      return
    }
    if (password.length < 8) {
      setError('Passwords must be at least 8 characters.')
      return
    }

    setPending(true)
    setError(null)

    const { error } = isSignUp
      ? await authClient.signUp.email({
          username,
          password,
          name: username,
          // Accounts are username-only; Better Auth still needs a unique email, so derive a
          // non-routable placeholder (.invalid is reserved and never delivers mail).
          email: `${username.toLowerCase()}@users.sustainabytes.invalid`,
        })
      : await authClient.signIn.username({ username, password })

    if (error) {
      setPending(false)
      if (isSignUp && (error.code === 'USERNAME_IS_ALREADY_TAKEN' || error.code?.includes('ALREADY_EXISTS'))) {
        setError('That username is taken. Try another one.')
      } else {
        setError(isSignUp ? 'Could not create your account. Please try again.' : 'Incorrect username or password.')
      }
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-sm font-medium text-foreground">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          minLength={3}
          maxLength={30}
          className="h-11 rounded-xl border border-input bg-background px-3.5 text-foreground outline-none transition focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring/30"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          required
          minLength={8}
          className="h-11 rounded-xl border border-input bg-background px-3.5 text-foreground outline-none transition focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring/30"
        />
        {isSignUp && <p className="text-xs text-muted-foreground">At least 8 characters.</p>}
      </div>

      <div aria-live="polite">
        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{error}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 disabled:opacity-70"
      >
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {isSignUp ? 'Create account' : 'Log in'}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        {isSignUp ? 'Already have an account?' : 'New to Sustainabytes?'}{' '}
        <Link
          href={isSignUp ? '/sign-in' : '/sign-up'}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          {isSignUp ? 'Log in' : 'Create an account'}
        </Link>
      </p>
    </form>
  )
}
