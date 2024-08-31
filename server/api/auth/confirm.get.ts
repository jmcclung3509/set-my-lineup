import { defineEventHandler, getQuery, H3Event, sendRedirect } from 'h3'
import { createSupabaseClient } from '~/composables/useCreateSupabaseClient'

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event)
  const tokenHash = query.token_hash as string
  const type = query.type as string
  const next = query.next as string ?? '/'
  
  const redirectTo = next.startsWith('/') ? next : '/'

  if (tokenHash && type === 'email') {
    const supabase = createSupabaseClient() // Create the Supabase client

    const { error } = await supabase.auth.verifyOtp({
      type: "email",
      token_hash: tokenHash,
    })
    if (!error) {
      return sendRedirect(event, redirectTo)
    }
  }

  // Return the user to an error page with some instructions
  return sendRedirect(event, '/auth/auth-code-error')
})