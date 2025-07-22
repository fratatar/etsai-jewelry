import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useAutoLogout from '../hooks/useAutoLogout'
import ProfileBox from '../components/ProfileBox'
import LogoutButton from '../components/LogoutButton'
import FAQ from '../components/FAQ'

export default function Result() {
  const router = useRouter()
  useAutoLogout()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('firstName') && localStorage.getItem('lastName')
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <ProfileBox />
        <LogoutButton />

        <h1 className="text-2xl font-bold mb-4">Generated Content</h1>

        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <p>Your AI-generated Etsy content will appear here.</p>
        </div>

        <FAQ />
      </div>
    </div>
  )
}
