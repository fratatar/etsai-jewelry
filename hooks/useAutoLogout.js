import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function useAutoLogout(timeout = 20 * 60 * 1000) {
  const router = useRouter()

  useEffect(() => {
    let logoutTimer

    const resetTimer = () => {
      clearTimeout(logoutTimer)
      logoutTimer = setTimeout(async () => {
        await supabase.auth.signOut()
        localStorage.clear()
        router.push('/login')
      }, timeout)
    }

    resetTimer()
    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('keydown', resetTimer)
    window.addEventListener('click', resetTimer)

    return () => {
      clearTimeout(logoutTimer)
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('keydown', resetTimer)
      window.removeEventListener('click', resetTimer)
    }
  }, [router, timeout])
}
