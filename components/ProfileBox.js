import { useEffect, useState } from 'react'

export default function ProfileBox() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [variation, setVariation] = useState('')

  useEffect(() => {
    setFirstName(localStorage.getItem('firstName') || '')
    setLastName(localStorage.getItem('lastName') || '')
    setVariation(localStorage.getItem('variation') || '')
  }, [])

  return (
    <div className="text-sm bg-gray-800 text-white p-3 rounded-lg mb-4 shadow-md">
      <p className="font-semibold">👋 Welcome, {firstName} {lastName}</p>
      <p className="mt-1">🎁 Package: <span className="text-green-300">{variation}</span></p>
    </div>
  )
}
