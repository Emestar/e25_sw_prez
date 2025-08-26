'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirection automatique vers /tasks
    router.push('/tasks')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirection...</h1>
        <p className="text-gray-600">Vous allez être redirigé vers le gestionnaire de tâches</p>
      </div>
    </div>
  )
}