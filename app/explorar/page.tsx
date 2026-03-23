'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const API = 'http://ww5y7zdj6dn9y63m6zk4ec7r.187.77.248.115.sslip.io'

export default function Explorar() {
  const [markets, setMarkets] = useState([])
  useEffect(() => {
    fetch(API + '/api/markets')
      .then(r => r.json())
      .then(data => setMarkets(Array.isArray(data) ? data : []))
      .catch(() => setMarkets([]))
  }, [])
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <Link href="/" className="text-xl font-bold text-green-400">Previsoes.cc</Link>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-8">Mercados abertos</h2>
        {markets.length === 0 ? (
          <p className="text-gray-500 text-center py-20">Nenhum mercado aberto no momento.</p>
        ) : (
          <div className="grid gap-4">
            {markets.map((m: any) => (
              <div key={m.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold">{m.question}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
