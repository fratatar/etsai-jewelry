import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useAutoLogout from '../hooks/useAutoLogout'
import FAQ from '../components/FAQ'
import ProfileBox from '../components/ProfileBox'
import LogoutButton from '../components/LogoutButton'

export default function Home() {
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

        <h1 className="text-2xl font-bold mb-4">EtsAI – AI Content Generator for Etsy</h1>
        <input
          type="text"
          placeholder="Enter your product idea..."
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
        />
        <button className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
          Generate
        </button>

        <FAQ />
      </div>
    </div>
  )
}
