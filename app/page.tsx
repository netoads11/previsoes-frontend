'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, TrendingUp, Zap, Clock } from 'lucide-react'

const API = 'http://ww5y7zdj6dn9y63m6zk4ec7r.187.77.248.115.sslip.io'

const CATEGORIAS = ['Todos', 'Entretenimento', 'Criptomoedas', 'Financeiro', 'Esportes', 'Política', 'Clima', 'Celebridades']

export default function Home() {
  const [markets, setMarkets] = useState<any[]>([])
  const [categoria, setCategoria] = useState('Todos')
  const [busca, setBusca] = useState('')

  useEffect(() => {
    fetch(API + '/api/markets')
      .then(r => r.json())
      .then(data => setMarkets(Array.isArray(data) ? data : []))
      .catch(() => setMarkets([]))
  }, [])

  const filtrados = markets.filter(m => {
    const matchCat = categoria === 'Todos' || m.category === categoria
    const matchBusca = m.question.toLowerCase().includes(busca.toLowerCase())
    return matchCat && matchBusca
  })

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="text-green-400 font-bold text-xl shrink-0">Previmarket</Link>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"/>
            <input
              type="text"
              placeholder="Buscar mercados..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/login" className="text-gray-400 hover:text-white text-sm px-3 py-2">Entrar</Link>
            <Link href="/cadastrar" className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg font-medium">Cadastrar</Link>
          </div>
        </div>
        {/* Categorias */}
        <div className="max-w-7xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                categoria === cat
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Lista de mercados */}
        <main className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400"/>
            <h2 className="font-bold text-lg">Em Alta</h2>
          </div>

          {filtrados.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">Nenhum mercado encontrado.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filtrados.map((m: any) => (
                <MarketCard key={m.id} market={m} />
              ))}
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside className="w-72 shrink-0 hidden lg:block">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-yellow-400"/>
              <h3 className="font-bold text-sm">Mercados Ao Vivo</h3>
            </div>
            <p className="text-gray-500 text-sm">Nenhum mercado ao vivo.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="font-bold text-sm mb-3">Categorias</h3>
            <div className="space-y-2">
              {CATEGORIAS.slice(1).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoria(cat)}
                  className="w-full text-left text-sm text-gray-400 hover:text-white py-1"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function MarketCard({ market }: { market: any }) {
  const yesOdds = market.yes_odds || 50
  const noOdds = market.no_odds || 50
  const yesMult = (100 / yesOdds).toFixed(2)
  const noMult = (100 / noOdds).toFixed(2)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-green-500 transition-colors cursor-pointer">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          {market.category && (
            <span className="text-xs text-green-400 font-medium uppercase tracking-wide">{market.category}</span>
          )}
          <h3 className="text-sm font-semibold mt-1">{market.question}</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
          <Clock className="w-3 h-3"/>
          <span>Aberto</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 bg-green-900 hover:bg-green-800 border border-green-700 rounded-lg p-2 text-center transition-colors">
          <p className="text-green-400 font-bold">{yesMult}x</p>
          <p className="text-xs text-gray-400">SIM · {yesOdds}%</p>
        </button>
        <button className="flex-1 bg-red-900 hover:bg-red-800 border border-red-700 rounded-lg p-2 text-center transition-colors">
          <p className="text-red-400 font-bold">{noMult}x</p>
          <p className="text-xs text-gray-400">NÃO · {noOdds}%</p>
        </button>
      </div>
    </div>
  )
}
