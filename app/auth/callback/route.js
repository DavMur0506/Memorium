import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/error?message=${encodeURIComponent(error.message)}`)
      }

      // Verificar si el usuario tiene perfil, si no crearlo
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (profileError && profileError.code === 'PGRST116') {
          // El perfil no existe, crear uno nuevo
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              full_name: data.user.user_metadata?.full_name || 
                        data.user.user_metadata?.name || 
                        data.user.email?.split('@')[0] || 
                        'Usuario',
              avatar_url: data.user.user_metadata?.avatar_url || 
                         data.user.user_metadata?.picture || 
                         null
            })

          if (insertError) {
            console.error('Error creating profile:', insertError)
          }
        }
      }

      // Redirigir al dashboard o página principal
      return NextResponse.redirect(`${requestUrl.origin}/`)
    } catch (error) {
      console.error('Unexpected error in auth callback:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/error?message=${encodeURIComponent('Error inesperado')}`)
    }
  }

  // Si no hay código, redirigir a la página principal
  return NextResponse.redirect(`${requestUrl.origin}/`)
}