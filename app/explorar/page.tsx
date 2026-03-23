'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const API = 'http://187.77.248.115:3001'

interface Market {
  id: string
  question: string
  yes_odds: number
  no_odds: number
  category?: string
}

export default function Explorar() {
  const [markets, setMarkets] = useState<Market[]>([])

  useEffect(() => {
    fetch(API + '/api/markets')
      .then(r => r.json())
      .then(data => setMarkets(Array.isArray(data) ? data : []))
      .catch(() => setMarkets([]))
  }, [])

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <Link href="/" className="text-xl font-bold text-green-400">Previmarket</Link>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-400 hover:text-white">Entrar</Link>
          <Link href="/cadastrar" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-medium">Cadastrar</Link>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-8">Mercados abertos</h2>
        {markets.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">Nenhum mercado aberto no momento.</p>
            <p className="mt-2">Volte em breve!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {markets.map((m: Market) => (
              <div key={m.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">{m.question}</h3>
                <div className="flex gap-4">
                  <div className="flex-1 bg-green-900 rounded-lg p-3 text-center">
                    <p className="text-green-400 font-bold text-xl">{m.yes_odds}%</p>
                    <p className="text-sm text-gray-400">SIM</p>
                  </div>
                  <div className="flex-1 bg-red-900 rounded-lg p-3 text-center">
                    <p className="text-red-400 font-bold text-xl">{m.no_odds}%</p>
                    <p className="text-sm text-gray-400">NÃO</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
