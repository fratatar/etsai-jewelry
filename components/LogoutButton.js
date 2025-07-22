import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-500 hover:underline mt-2"
    >
      Logout
    </button>
  )
}
