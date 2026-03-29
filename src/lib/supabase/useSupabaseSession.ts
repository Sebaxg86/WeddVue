import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'

import { supabase } from '@/lib/supabase/client'

function getAnonymousFlag(session: Session | null) {
  if (!session) {
    return false
  }

  return Boolean((session.user as { is_anonymous?: boolean }).is_anonymous)
}

export function isAccountSession(session: Session | null) {
  return Boolean(session) && !getAnonymousFlag(session)
}

export function useSupabaseSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(() => Boolean(supabase))
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) {
      return
    }

    const client = supabase
    let isMounted = true

    async function bootstrapSession() {
      const { data, error } = await client.auth.getSession()

      if (!isMounted) {
        return
      }

      setSession(data.session ?? null)
      setErrorMessage(error?.message ?? null)
      setIsLoading(false)
    }

    void bootstrapSession()

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) {
        return
      }

      setSession(nextSession)
      setIsLoading(false)
      setErrorMessage(null)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  return {
    errorMessage,
    isLoading,
    isReady: !isLoading,
    isSignedIn: isAccountSession(session),
    session,
  }
}
