'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart2, Users, TrendingUp, DollarSign, Plus, LogOut } from 'lucide-react'

const API = 'http://187.77.248.115:3001'

export default function Admin() {
  const router = useRouter()
  const [tab, setTab] = useState('dashboard')
  const [markets, setMarkets] = useState<any[]>([])
  const [question, setQuestion] = useState('')
  const [category, setCategory] = useState('Financeiro')
  const [yesOdds, setYesOdds] = useState('50')
  const [noOdds, setNoOdds] = useState('50')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    loadMarkets()
  }, [])

  function loadMarkets() {
    fetch(API + '/api/markets')
      .then(r => r.json())
      .then(data => setMarkets(Array.isArray(data) ? data : []))
  }

  async function createMarket(e: any) {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(API + '/api/admin/markets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ question, category, yes_odds: Number(yesOdds), no_odds: Number(noOdds) })
      })
      if (res.ok) {
        setMsg('Mercado criado com sucesso!')
        setQuestion('')
        loadMarkets()
        setTimeout(() => setMsg(''), 3000)
      } else {
        setMsg('Erro ao criar mercado.')
      }
    } catch { setMsg('Erro ao criar mercado.') }
  }

  return (
    <div className="min-h-screen flex" style={{background: '#0a0a0f'}}>
      <aside className="w-64 border-r border-white/5 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, #00c896, #00a878)'}}>
            <BarChart2 className="w-4 h-4 text-white"/>
          </div>
          <span className="font-bold text-white">Previmarket</span>
        </div>
        <p className="text-white/30 text-xs uppercase tracking-widest mb-4">Admin</p>
        <nav className="space-y-1 flex-1">
          {[
            { id: 'dashboard', label: 'Dashboard', Icon: BarChart2 },
            { id: 'markets', label: 'Mercados', Icon: TrendingUp },
            { id: 'criar', label: 'Criar Mercado', Icon: Plus },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={tab === t.id ? {background: 'rgba(0,200,150,0.15)', color: '#00c896'} : {color: 'rgba(255,255,255,0.4)'}}>
              <t.Icon className="w-4 h-4"/>
              {t.label}
            </button>
          ))}
        </nav>
        <button onClick={() => { localStorage.clear(); router.push('/') }}
          className="flex items-center gap-2 text-sm" style={{color: 'rgba(255,255,255,0.3)'}}>
          <LogOut className="w-4 h-4"/>Sair
        </button>
      </aside>
      <main className="flex-1 p-8">
        {tab === 'dashboard' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Mercados ativos', value: markets.length, Icon: TrendingUp, color: '#00c896' },
                { label: 'Usuarios', value: '0', Icon: Users, color: '#6366f1' },
                { label: 'Volume total', value: 'R$ 0', Icon: DollarSign, color: '#f59e0b' },
              ].map(card => (
                <div key={card.label} className="rounded-2xl p-6" style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'}}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm" style={{color: 'rgba(255,255,255,0.5)'}}>{card.label}</p>
                    <card.Icon className="w-5 h-5" style={{color: card.color}}/>
                  </div>
                  <p className="text-3xl font-bold text-white">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'markets' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-8">Mercados</h1>
            <div className="rounded-2xl overflow-hidden" style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'}}>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{color: 'rgba(255,255,255,0.4)'}}>Pergunta</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{color: 'rgba(255,255,255,0.4)'}}>Categoria</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{color: 'rgba(255,255,255,0.4)'}}>Sim</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{color: 'rgba(255,255,255,0.4)'}}>Nao</th>
                  </tr>
                </thead>
                <tbody>
                  {markets.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-12" style={{color: 'rgba(255,255,255,0.3)'}}>Nenhum mercado criado ainda.</td></tr>
                  ) : markets.map(m => (
                    <tr key={m.id} className="border-b border-white/5">
                      <td className="px-6 py-4 text-white text-sm">{m.question}</td>
                      <td className="px-6 py-4 text-sm" style={{color: 'rgba(255,255,255,0.5)'}}>{m.category || '-'}</td>
                      <td className="px-6 py-4 text-sm font-medium" style={{color: '#00c896'}}>{m.yes_odds}%</td>
                      <td className="px-6 py-4 text-sm font-medium" style={{color: '#f87171'}}>{m.no_odds}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tab === 'criar' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-8">Criar Mercado</h1>
            {msg && (
              <div className="mb-6 px-4 py-3 rounded-xl text-sm" style={{background: msg.includes('sucesso') ? 'rgba(0,200,150,0.15)' : 'rgba(239,68,68,0.15)', color: msg.includes('sucesso') ? '#00c896' : '#f87171'}}>
                {msg}
              </div>
            )}
            <form onSubmit={createMarket} className="max-w-lg space-y-5">
              <div>
                <label className="block text-sm mb-2" style={{color: 'rgba(255,255,255,0.6)'}}>Pergunta</label>
                <input type="text" value={question} onChange={e => setQuestion(e.target.value)} required
                  placeholder="Ex: Bitcoin vai subir amanha?"
                  className="w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
                  style={{background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)'}}/>
              </div>
              <div>
                <label className="block text-sm mb-2" style={{color: 'rgba(255,255,255,0.6)'}}>Categoria</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
                  style={{background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)'}}>
                  {['Entretenimento','Criptom oedas','Financeiro','Esportes','Politica','Clima','Celebridades'].map(c => (
                    <option key={c} value={c} style={{background: '#1a1a2e'}}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm mb-2" style={{color: 'rgba(255,255,255,0.6)'}}>% SIM</label>
                  <input type="number" min="1" max="99" value={yesOdds}
                    onChange={e => { setYesOdds(e.target.value); setNoOdds(String(100 - Number(e.target.value))) }}
                    className="w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
                    style={{background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)'}}/>
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-2" style={{color: 'rgba(255,255,255,0.6)'}}>% NAO</label>
                  <input type="number" min="1" max="99" value={noOdds}
                    onChange={e => { setNoOdds(e.target.value); setYesOdds(String(100 - Number(e.target.value))) }}
                    className="w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
                    style={{background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)'}}/>
                </div>
              </div>
              <button type="submit" className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                style={{background: 'linear-gradient(135deg, #00c896, #00a878)'}}>
                Criar mercado
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
