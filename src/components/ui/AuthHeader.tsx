interface AuthHeaderProps {
  mode: 'signin' | 'signup'
}

export function AuthHeader({ mode }: AuthHeaderProps) {
  return (
    <section className="mb-8 pt-6 text-center">
      <p className="font-display text-2xl font-extrabold tracking-wide">WAHALA</p>
      <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight">
        {mode === 'signin' ? (
          <>
            Welcome back to the <span className="text-w-orange">chaos</span>
          </>
        ) : (
          <>
            Join the <span className="text-w-yellow">trouble</span>, start the{' '}
            <span className="text-w-orange">chaos</span>
          </>
        )}
      </h1>
      <p className="mt-2 text-sm text-w-text-2">
        {mode === 'signin'
          ? 'Sign in to continue the trouble'
          : 'Create your account and pick a side'}
      </p>
    </section>
  )
}
