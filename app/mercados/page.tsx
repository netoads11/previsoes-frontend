'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Mercados() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) { router.push('/login'); return }
    const u = JSON.parse(user)
    if (u.is_admin) {
      router.push('/admin')
    } else {
      router.push('/')
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: '#0a0a0f'}}>
      <p className="text-white/50">Redirecionando...</p>
    </div>
  )
}
