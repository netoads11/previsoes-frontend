'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, TrendingUp, Zap, Clock, ChevronRight, BarChart2 } from 'lucide-react'

const API = 'http://ww5y7zdj6dn9y63m6zk4ec7r.187.77.248.115.sslip.io'

const CATEGORIAS = [
  { name: 'Todos', icon: '🔥' },
  { name: 'Entretenimento', icon: '🎬' },
  { name: 'Criptomoedas', icon: '₿' },
  { name: 'Financeiro', icon: '📈' },
  { name: 'Esportes', icon: '⚽' },
  { name: 'Política', icon: '🏛️' },
  { name: 'Clima', icon: '🌤️' },
  { name: 'Celebridades', icon: '⭐' },
]

interface Market {
  id: string
  question: string
  yes_odds: number
  no_odds: number
  category?: string
  status?: string
}

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [categoria, setCategoria] = useState('Todos')
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(API + '/api/markets')
      .then(r => r.json())
      .then(data => { setMarkets(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => { setMarkets([]); setLoading(false) })
  }, [])

  const filtrados = markets.filter(m => {
    const matchCat = categoria === 'Todos' || m.category === categoria
    const matchBusca = m.question.toLowerCase().includes(busca.toLowerCase())
    return matchCat && matchBusca
  })

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1117 100%)'}}>
      {/* Header */}
      <header className="border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl" style={{background: 'rgba(10,10,15,0.85)'}}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, #00c896, #00a878)'}}>
              <BarChart2 className="w-4 h-4 text-white"/>
            </div>
            <span className="font-bold text-white text-lg tracking-tight">Previmarket</span>
          </Link>
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4"/>
            <input
              type="text"
              placeholder="Buscar mercados..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none transition-all"
              style={{background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)'}}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Link href="/login" className="text-white/60 hover:text-white text-sm px-4 py-2 rounded-xl transition-colors font-medium">
              Entrar
            </Link>
            <Link href="/cadastrar" className="text-sm px-4 py-2 rounded-xl font-semibold text-white transition-all hover:opacity-90" style={{background: 'linear-gradient(135deg, #00c896, #00a878)'}}>
              Cadastrar
            </Link>
          </div>
        </div>
        {/* Categorias */}
        <div className="max-w-7xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
          {CATEGORIAS.map(cat => (
            <button
              key={cat.name}
              onClick={() => setCategoria(cat.name)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                categoria === cat.name
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
              style={categoria === cat.name ? {background: 'linear-gradient(135deg, #00c896, #00a878)'} : {background: 'rgba(255,255,255,0.05)'}}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Lista principal */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400"/>
              <h2 className="font-bold text-white text-lg">Em Alta</h2>
              {!loading && <span className="text-white/30 text-sm">{filtrados.length} mercados</span>}
            </div>
          </div>

          {loading ? (
            <div className="grid gap-3">
              {[1,2,3].map(i => (
                <div key={i} className="rounded-2xl h-32 animate-pulse" style={{background: 'rgba(255,255,255,0.04)'}}/>
              ))}
            </div>
          ) : filtrados.length === 0 ? (
            <div className="text-center py-24 rounded-2xl" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)'}}>
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-white/50 text-lg">Nenhum mercado encontrado</p>
              <p className="text-white/30 text-sm mt-1">Tente outra categoria</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filtrados.map(m => <MarketCard key={m.id} market={m}/>)}
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside className="w-72 shrink-0 hidden lg:block space-y-4">
          <div className="rounded-2xl p-5" style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'}}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
              <span className="text-white font-semibold text-sm">Ao Vivo</span>
            </div>
            <p className="text-white/30 text-sm">Nenhum mercado ao vivo.</p>
          </div>

          <div className="rounded-2xl p-5" style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'}}>
            <h3 className="text-white font-semibold text-sm mb-4">Categorias</h3>
            <div className="space-y-1">
              {CATEGORIAS.slice(1).map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setCategoria(cat.name)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors hover:bg-white/5 group"
                >
                  <div className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span className={categoria === cat.name ? 'text-emerald-400 font-medium' : 'text-white/50 group-hover:text-white/80'}>{cat.name}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-white/40"/>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{background: 'linear-gradient(135deg, rgba(0,200,150,0.1), rgba(0,168,120,0.05))', border: '1px solid rgba(0,200,150,0.2)'}}>
            <h3 className="text-white font-semibold text-sm mb-2">Novo por aqui?</h3>
            <p className="text-white/50 text-xs mb-4">Crie sua conta e ganhe R$10 de bônus para começar a apostar.</p>
            <Link href="/cadastrar" className="block text-center text-sm font-semibold text-white py-2.5 rounded-xl transition-all hover:opacity-90" style={{background: 'linear-gradient(135deg, #00c896, #00a878)'}}>
              Criar conta grátis
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

function MarketCard({ market }: { market: Market }) {
  const yes = market.yes_odds || 50
  const no = market.no_odds || 50
  const yesMult = (100 / yes).toFixed(2)
  const noMult = (100 / no).toFixed(2)

  return (
    <div className="group rounded-2xl p-5 transition-all hover:border-white/10 cursor-pointer" style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'}}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          {market.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2" style={{background: 'rgba(0,200,150,0.1)', color: '#00c896'}}>
              {market.category}
            </span>
          )}
          <h3 className="text-white font-medium text-sm leading-relaxed">{market.question}</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-white/30 shrink-0">
          <Clock className="w-3 h-3"/>
          <span>Aberto</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 rounded-xl p-3 text-center transition-all hover:opacity-90 active:scale-95" style={{background: 'rgba(0,200,150,0.12)', border: '1px solid rgba(0,200,150,0.2)'}}>
          <p className="font-bold text-lg" style={{color: '#00c896'}}>{yesMult}x</p>
          <p className="text-xs text-white/40 mt-0.5">SIM · {yes}%</p>
        </button>
        <button className="flex-1 rounded-xl p-3 text-center transition-all hover:opacity-90 active:scale-95" style={{background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)'}}>
          <p className="font-bold text-lg text-red-400">{noMult}x</p>
          <p className="text-xs text-white/40 mt-0.5">NÃO · {no}%</p>
        </button>
      </div>
    </div>
  )
}
