'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: any) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch("http://187.77.248.115:3001" + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/mercados')
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <Link href="/" className="block text-center text-2xl font-bold text-green-400 mb-8">Previsões.cc</Link>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Entrar</h2>
          {error && <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500" placeholder="seu@email.com"/>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Senha</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500" placeholder="••••••••"/>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 py-3 rounded-lg font-bold text-lg">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <p className="text-center text-gray-400 mt-6">Não tem conta? <Link href="/cadastrar" className="text-green-400 hover:underline">Cadastre-se</Link></p>
        </div>
      </div>
    </main>
  )
}
 
