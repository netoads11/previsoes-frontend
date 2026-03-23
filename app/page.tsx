'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, Star, Clock, Zap, TrendingUp, Home, DollarSign, Globe, Trophy, Tv, ChevronRight, Plus } from 'lucide-react'

const API = 'http://187.77.248.115:3001'

const CATEGORIAS = [
  { name: 'Tela Inicial', icon: Home },
  { name: 'Economia', icon: DollarSign },
  { name: 'Entretenimento', icon: Tv },
  { name: 'Esportes', icon: Trophy },
  { name: 'Geopolítica', icon: Globe },
  { name: 'Política', icon: TrendingUp },
]

interface Market {
  id: string
  question: string
  yes_odds: number
  no_odds: number
  category?: string
  status?: string
  expires_at?: string
}

interface BetPanel {
  market: Market
  choice: 'yes' | 'no'
}

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)
  const [categoria, setCategoria] = useState('Tela Inicial')
  const [busca, setBusca] = useState('')
  const [betPanel, setBetPanel] = useState<BetPanel | null>(null)
  const [betValue, setBetValue] = useState('10')
  const [user, setUser] = useState<any>(null)
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
    loadMarkets()
  }, [])

  function loadMarkets() {
    fetch(API + '/api/markets')
      .then(r => r.json())
      .then(data => { setMarkets(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  function toggleFav(id: string) {
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id])
  }

  function selectBet(market: Market, choice: 'yes' | 'no') {
    setBetPanel({ market, choice })
    setBetValue('10')
  }

  const filtrados = markets.filter(m => {
    const matchCat = categoria === 'Tela Inicial' || m.category === categoria
    const matchBusca = m.question.toLowerCase().includes(busca.toLowerCase())
    return matchCat && matchBusca
  })

  const liveMarkets = markets.filter(m => m.status === 'live' || m.status === 'open').slice(0, 3)

  return (
    <div style={{background: 'var(--background)', minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      {/* HEADER */}
      <header style={{
        background: 'rgba(25,25,25,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
        height: '60px', display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: '16px'
      }}>
        <Link href="/" style={{display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none'}}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(106,221,0,0.4)'
          }}>
            <span style={{color: '#0a0a0a', fontWeight: 800, fontSize: '14px'}}>P</span>
          </div>
          <span style={{color: 'var(--foreground)', fontWeight: 700, fontSize: '16px', letterSpacing: '0.02em'}}>
            Previmarket
          </span>
        </Link>

        <div style={{flex: 1, position: 'relative', maxWidth: '480px'}}>
          <Search style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', width: '16px', height: '16px'}}/>
          <input
            type="text"
            placeholder="Pesquisar por Mercados, Tópicos..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{
              width: '100%', background: 'var(--muted)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '8px 12px 8px 36px',
              color: 'var(--foreground)', fontSize: '14px', outline: 'none',
              fontFamily: 'Kanit, sans-serif'
            }}
          />
        </div>

        <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px'}}>
          {user ? (
            <>
              <span style={{color: 'var(--primary)', fontWeight: 600, fontSize: '14px'}}>
                Saldo: R$ 0,00
              </span>
              <button style={{
                background: 'var(--primary)', color: '#0a0a0a',
                border: 'none', borderRadius: '8px', padding: '8px 16px',
                fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                fontFamily: 'Kanit, sans-serif',
                boxShadow: '0 0 12px rgba(106,221,0,0.3)'
              }}>
                Depositar
              </button>
              <Link href="/admin" style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'var(--muted)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', textDecoration: 'none', color: 'var(--foreground)',
                fontSize: '14px', fontWeight: 700
              }}>
                {user.name?.[0]?.toUpperCase() || 'A'}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" style={{color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '14px', fontWeight: 500}}>
                Entrar
              </Link>
              <Link href="/cadastrar" style={{
                background: 'var(--primary)', color: '#0a0a0a',
                borderRadius: '8px', padding: '8px 16px',
                fontWeight: 700, fontSize: '14px', textDecoration: 'none',
                boxShadow: '0 0 12px rgba(106,221,0,0.3)'
              }}>
                Registrar
              </Link>
            </>
          )}
        </div>
      </header>

      <div style={{display: 'flex', flex: 1}}>
        {/* SIDEBAR */}
        <aside style={{
          width: '200px', flexShrink: 0,
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          padding: '20px 0',
          position: 'sticky', top: '60px', height: 'calc(100vh - 60px)',
          overflowY: 'auto', display: 'flex', flexDirection: 'column'
        }}>
          <p style={{color: 'var(--muted-foreground)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 16px 8px'}}>
            TEMAS
          </p>
          <nav style={{flex: 1}}>
            {CATEGORIAS.map(cat => {
              const Icon = cat.icon
              const isActive = categoria === cat.name
              return (
                <button key={cat.name} onClick={() => setCategoria(cat.name)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 16px', border: 'none', cursor: 'pointer',
                    background: isActive ? 'rgba(106,221,0,0.1)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                    color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
                    fontSize: '14px', fontWeight: isActive ? 600 : 400,
                    fontFamily: 'Kanit, sans-serif',
                    transition: 'all 0.15s'
                  }}>
                  <Icon style={{width: '16px', height: '16px', color: isActive ? 'var(--primary)' : 'inherit'}}/>
                  {cat.name}
                </button>
              )
            })}
          </nav>
          <div style={{padding: '16px', borderTop: '1px solid var(--border)'}}>
            <Link href="/duvidas" style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '13px'}}>
              📖 Dúvidas
            </Link>
          </div>
        </aside>

        {/* FEED CENTRAL */}
        <main style={{flex: 1, padding: '24px', overflowY: 'auto', minWidth: 0}}>
          {/* BANNER */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(106,221,0,0.15) 0%, rgba(20,20,20,0) 60%)',
            border: '1px solid rgba(106,221,0,0.2)',
            borderRadius: '12px', padding: '32px 40px', marginBottom: '32px',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{position: 'absolute', top: 0, right: 0, width: '300px', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(106,221,0,0.05))'}}/>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
              <div style={{width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', animation: 'live-dot 1s infinite'}}/>
              <span style={{color: 'var(--primary)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase'}}>AO VIVO</span>
            </div>
            <h1 style={{fontSize: '28px', fontWeight: 800, color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '8px'}}>
              VOTAÇÕES E PREVISÕES
            </h1>
            <p style={{color: 'var(--muted-foreground)', fontSize: '16px', fontWeight: 400}}>
              Sua opinião pode virar dinheiro — aposte agora
            </p>
            <Link href="/cadastrar" style={{
              display: 'inline-block', marginTop: '16px',
              background: 'var(--primary)', color: '#0a0a0a',
              borderRadius: '8px', padding: '10px 24px',
              fontWeight: 700, fontSize: '14px', textDecoration: 'none',
              boxShadow: '0 0 20px rgba(106,221,0,0.4)'
            }}>
              Começar agora →
            </Link>
          </div>

          {/* MERCADOS AO VIVO */}
          {liveMarkets.length > 0 && (
            <section style={{marginBottom: '32px'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <Zap style={{width: '18px', height: '18px', color: 'var(--primary)'}}/>
                  <h2 style={{fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em'}}>Ao Vivo</h2>
                </div>
              </div>
              <div style={{display: 'grid', gap: '12px'}}>
                {liveMarkets.map((m, i) => (
                  <MarketCard key={m.id} market={m} index={i} onBet={selectBet} isFav={favorites.includes(m.id)} onFav={toggleFav} isLive/>
                ))}
              </div>
            </section>
          )}

          {/* FEED PRINCIPAL */}
          <section>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <TrendingUp style={{width: '18px', height: '18px', color: 'var(--primary)'}}/>
                <h2 style={{fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                  {categoria === 'Tela Inicial' ? 'Em Alta' : categoria}
                </h2>
                {!loading && <span style={{color: 'var(--muted-foreground)', fontSize: '13px'}}>({filtrados.length})</span>}
              </div>
            </div>

            {loading ? (
              <div style={{display: 'grid', gap: '12px'}}>
                {[1,2,3].map(i => (
                  <div key={i} className="shimmer" style={{height: '120px', borderRadius: '12px'}}/>
                ))}
              </div>
            ) : filtrados.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '60px 20px',
                background: 'var(--surface)', borderRadius: '12px',
                border: '1px solid var(--border)'
              }}>
                <div style={{fontSize: '40px', marginBottom: '12px'}}>🔍</div>
                <p style={{color: 'var(--muted-foreground)'}}>Nenhum mercado encontrado</p>
              </div>
            ) : (
              <div style={{display: 'grid', gap: '12px'}}>
                {filtrados.map((m, i) => (
                  <MarketCard key={m.id} market={m} index={i} onBet={selectBet} isFav={favorites.includes(m.id)} onFav={toggleFav}/>
                ))}
              </div>
            )}
          </section>
        </main>

        {/* PAINEL DE APOSTA */}
        <aside style={{
          width: '300px', flexShrink: 0,
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
          padding: '20px', position: 'sticky',
          top: '60px', height: 'calc(100vh - 60px)',
          overflowY: 'auto'
        }}>
          {betPanel ? (
            <BetPanelComponent panel={betPanel} value={betValue} onChange={setBetValue} onClose={() => setBetPanel(null)} user={user}/>
          ) : (
            <div style={{textAlign: 'center', padding: '40px 16px'}}>
              <div style={{fontSize: '40px', marginBottom: '16px'}}>🎯</div>
              <p style={{color: 'var(--foreground)', fontWeight: 600, marginBottom: '8px'}}>Faça sua previsão</p>
              <p style={{color: 'var(--muted-foreground)', fontSize: '13px'}}>
                Clique em <span style={{color: 'var(--primary)', fontWeight: 700}}>SIM</span> ou <span style={{color: 'var(--destructive)', fontWeight: 700}}>NÃO</span> em qualquer mercado para começar
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

function MarketCard({ market, index, onBet, isFav, onFav, isLive }: {
  market: Market, index: number,
  onBet: (m: Market, c: 'yes'|'no') => void,
  isFav: boolean, onFav: (id: string) => void,
  isLive?: boolean
}) {
  const yes = Number(market.yes_odds) || 50
  const no = Number(market.no_odds) || 50
  const yesMult = (100 / yes).toFixed(2)
  const noMult = (100 / no).toFixed(2)
  const [hoverYes, setHoverYes] = useState(false)
  const [hoverNo, setHoverNo] = useState(false)

  return (
    <div className="animate-fade-up" style={{
      animationDelay: `${index * 0.05}s`,
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '16px',
      transition: 'border-color 0.2s',
    }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(106,221,0,0.3)')}
    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
      <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px'}}>
        <div style={{flex: 1}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px'}}>
            {market.category && (
              <span style={{
                background: 'rgba(106,221,0,0.1)', color: 'var(--primary)',
                fontSize: '11px', fontWeight: 600, padding: '2px 8px',
                borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>{market.category}</span>
            )}
            {isLive && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                background: 'rgba(239,68,68,0.15)', color: '#ef4444',
                fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px'
              }}>
                <span className="animate-live" style={{width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', display: 'inline-block'}}/>
                LIVE
              </span>
            )}
          </div>
          <p style={{color: 'var(--foreground)', fontSize: '14px', fontWeight: 500, lineHeight: 1.4}}>{market.question}</p>
        </div>
        <button onClick={() => onFav(market.id)} style={{background: 'none', border: 'none', cursor: 'pointer', padding: '4px', flexShrink: 0}}>
          <Star style={{width: '16px', height: '16px', color: isFav ? '#facc15' : 'var(--muted-foreground)', fill: isFav ? '#facc15' : 'none'}}/>
        </button>
      </div>

      {/* BARRA DE CHANCE */}
      <div style={{marginBottom: '12px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
          <span style={{fontSize: '12px', color: 'var(--primary)', fontWeight: 600}}>{yes}% SIM</span>
          <span style={{fontSize: '12px', color: 'var(--muted-foreground)'}}>Chance</span>
          <span style={{fontSize: '12px', color: '#ef4444', fontWeight: 600}}>{no}% NÃO</span>
        </div>
        <div style={{height: '6px', borderRadius: '3px', background: 'var(--muted)', overflow: 'hidden'}}>
          <div style={{
            height: '100%', borderRadius: '3px',
            background: 'linear-gradient(90deg, var(--primary), rgba(106,221,0,0.6))',
            width: `${yes}%`, transition: 'width 0.5s ease'
          }}/>
        </div>
      </div>

      <div style={{display: 'flex', gap: '8px'}}>
        <button
          onClick={() => onBet(market, 'yes')}
          onMouseEnter={() => setHoverYes(true)}
          onMouseLeave={() => setHoverYes(false)}
          style={{
            flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: hoverYes ? 'var(--primary)' : 'rgba(106,221,0,0.12)',
            color: hoverYes ? '#0a0a0a' : 'var(--primary)',
            fontWeight: 700, fontSize: '14px', fontFamily: 'Kanit, sans-serif',
            transition: 'all 0.15s',
            animation: hoverYes ? 'pulse-green 1s infinite' : 'none'
          }}>
          ✅ SIM {yesMult}x
        </button>
        <button
          onClick={() => onBet(market, 'no')}
          onMouseEnter={() => setHoverNo(true)}
          onMouseLeave={() => setHoverNo(false)}
          style={{
            flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: hoverNo ? 'var(--destructive)' : 'rgba(239,68,68,0.12)',
            color: hoverNo ? '#fff' : '#ef4444',
            fontWeight: 700, fontSize: '14px', fontFamily: 'Kanit, sans-serif',
            transition: 'all 0.15s',
            animation: hoverNo ? 'pulse-red 1s infinite' : 'none'
          }}>
          ❌ NÃO {noMult}x
        </button>
      </div>

      <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px'}}>
        <Clock style={{width: '12px', height: '12px', color: 'var(--muted-foreground)'}}/>
        <span style={{fontSize: '12px', color: 'var(--muted-foreground)'}}>
          {market.expires_at ? `Encerra em ${getTimeLeft(market.expires_at)}` : 'Aberto'}
        </span>
      </div>
    </div>
  )
}

function BetPanelComponent({ panel, value, onChange, onClose, user }: any) {
  const yes = Number(panel.market.yes_odds) || 50
  const no = Number(panel.market.no_odds) || 50
  const mult = panel.choice === 'yes' ? (100 / yes).toFixed(2) : (100 / no).toFixed(2)
  const gain = (Number(value) * Number(mult)).toFixed(2)
  const VALORES = ['5', '10', '20', '50', '100']

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'}}>
        <h3 style={{fontSize: '15px', fontWeight: 700}}>Sua Previsão</h3>
        <button onClick={onClose} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', fontSize: '18px'}}>✕</button>
      </div>

      <div style={{background: 'var(--muted)', borderRadius: '8px', padding: '12px', marginBottom: '16px'}}>
        <p style={{fontSize: '13px', color: 'var(--muted-foreground)', marginBottom: '4px', lineHeight: 1.4}}>{panel.market.question}</p>
        <span style={{
          display: 'inline-block', padding: '4px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 700,
          background: panel.choice === 'yes' ? 'rgba(106,221,0,0.2)' : 'rgba(239,68,68,0.2)',
          color: panel.choice === 'yes' ? 'var(--primary)' : '#ef4444'
        }}>
          {panel.choice === 'yes' ? '✅ SIM' : '❌ NÃO'} — {mult}x
        </span>
      </div>

      <div style={{marginBottom: '12px'}}>
        <label style={{fontSize: '13px', color: 'var(--muted-foreground)', display: 'block', marginBottom: '6px'}}>Valor a investir:</label>
        <div style={{position: 'relative'}}>
          <span style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', fontSize: '14px'}}>R$</span>
          <input
            type="number" value={value} onChange={e => onChange(e.target.value)}
            style={{
              width: '100%', background: 'var(--muted)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '12px 12px 12px 36px',
              color: 'var(--foreground)', fontSize: '18px', fontWeight: 700,
              outline: 'none', fontFamily: 'Kanit, sans-serif'
            }}
          />
        </div>
      </div>

      <div style={{display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap'}}>
        {VALORES.map(v => (
          <button key={v} onClick={() => onChange(v)} style={{
            flex: 1, minWidth: '40px', padding: '6px', borderRadius: '6px', border: 'none', cursor: 'pointer',
            background: value === v ? 'rgba(106,221,0,0.2)' : 'var(--muted)',
            color: value === v ? 'var(--primary)' : 'var(--muted-foreground)',
            fontSize: '12px', fontWeight: 600, fontFamily: 'Kanit, sans-serif'
          }}>
            R${v}
          </button>
        ))}
      </div>

      <div style={{
        background: 'rgba(106,221,0,0.08)', border: '1px solid rgba(106,221,0,0.2)',
        borderRadius: '8px', padding: '12px', marginBottom: '16px'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '6px'}}>
          <span style={{fontSize: '13px', color: 'var(--muted-foreground)'}}>Custo:</span>
          <span style={{fontSize: '13px', fontWeight: 600}}>R$ {Number(value).toFixed(2)}</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '6px'}}>
          <span style={{fontSize: '13px', color: 'var(--muted-foreground)'}}>Odd:</span>
          <span style={{fontSize: '13px', fontWeight: 600}}>{mult}x</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(106,221,0,0.2)', paddingTop: '8px'}}>
          <span style={{fontSize: '14px', fontWeight: 600}}>Se acertar:</span>
          <span style={{fontSize: '16px', fontWeight: 800, color: 'var(--primary)'}}>R$ {gain}</span>
        </div>
      </div>

      {user ? (
        <button style={{
          width: '100%', padding: '14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
          background: 'var(--primary)', color: '#0a0a0a',
          fontWeight: 800, fontSize: '16px', fontFamily: 'Kanit, sans-serif',
          boxShadow: '0 0 20px rgba(106,221,0,0.4)',
          letterSpacing: '0.02em'
        }}>
          Confirmar R$ {Number(value).toFixed(2)}
        </button>
      ) : (
        <Link href="/login" style={{
          display: 'block', textAlign: 'center', padding: '14px', borderRadius: '8px',
          background: 'var(--primary)', color: '#0a0a0a',
          fontWeight: 800, fontSize: '15px', textDecoration: 'none',
          fontFamily: 'Kanit, sans-serif'
        }}>
          Entrar para apostar
        </Link>
      )}

      <p style={{textAlign: 'center', fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '12px'}}>
        Ao realizar uma previsão você aceita os{' '}
        <Link href="/termos" style={{color: 'var(--primary)'}}>Termos de Serviço</Link>
      </p>
    </div>
  )
}

function getTimeLeft(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now()
  if (diff <= 0) return 'Encerrado'
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}
