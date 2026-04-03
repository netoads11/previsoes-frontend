'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '../components/BottomNav'
import DepositModalComp from '../components/DepositModal'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://ww5y7zdj6dn9y63m6zk4ec7r.187.77.248.115.sslip.io'

export default function Perfil() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [balance, setBalance] = useState(0)
  const [stats, setStats] = useState<any>(null)
  const [referrals, setReferrals] = useState<any>(null)
  const [bets, setBets] = useState<any[]>([])
  const [tab, setTab] = useState<'apostas'|'afiliados'>('apostas')
  const [depositModal, setDepositModal] = useState(false)
  const [minDeposit, setMinDeposit] = useState('10.00')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saqueModal, setSaqueModal] = useState(false)
  const [saqueValor, setSaqueValor] = useState('')
  const [saquePix, setSaquePix] = useState('')
  const [saqueLoading, setSaqueLoading] = useState(false)
  const [saqueMsg, setSaqueMsg] = useState('')

  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!u || !t) { router.push('/login'); return }
    const parsed = JSON.parse(u)
    setUser(parsed)
    const h = { 'Authorization': 'Bearer ' + t }
    Promise.all([
      fetch(API + '/api/wallet/balance', { headers: h }).then(r => r.json()).catch(() => ({})),
      fetch(API + '/api/user/stats', { headers: h }).then(r => r.json()).catch(() => ({})),
      fetch(API + '/api/user/referrals', { headers: h }).then(r => r.json()).catch(() => ({})),
      fetch(API + '/api/bets/my', { headers: h }).then(r => r.json()).catch(() => []),
      fetch(API + '/api/settings/public').then(r => r.json()).catch(() => ({})),
    ]).then(([bal, st, ref, b, sett]) => {
      setBalance(Number(bal.balance) || 0)
      setStats(st)
      setReferrals(ref)
      setBets(Array.isArray(b) ? b : [])
      if (sett.min_deposit) setMinDeposit(sett.min_deposit)
      setLoading(false)
    })
  }, [])

  function getInitials(name: string) {
    return name?.split(' ').filter(Boolean).map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() || '?'
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  function copyRef() {
    if (!referrals?.referral_code) return
    const link = window.location.origin + '/cadastrar?ref=' + referrals.referral_code
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
    } else {
      const el = document.createElement('textarea')
      el.value = link
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  async function handleSaqueAfiliado() {
    const t = localStorage.getItem('token')
    const amt = Number(saqueValor)
    if (!amt || amt <= 0) { setSaqueMsg('Valor inválido'); return }
    if (!saquePix.trim()) { setSaqueMsg('Informe a chave PIX'); return }
    setSaqueLoading(true)
    setSaqueMsg('')
    try {
      const r = await fetch(API + '/api/wallet/affiliate-withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t },
        body: JSON.stringify({ amount: amt, pix_key: saquePix.trim() }),
      })
      const data = await r.json()
      if (!r.ok) { setSaqueMsg(data.error || 'Erro ao solicitar saque'); return }
      setSaqueMsg('Saque solicitado! Aguarde aprovação.')
      setReferrals((prev: any) => prev ? { ...prev, balance_affiliate: Math.max(0, (prev.balance_affiliate || 0) - amt) } : prev)
      setSaqueValor('')
      setSaquePix('')
      setTimeout(() => { setSaqueModal(false); setSaqueMsg('') }, 2000)
    } catch {
      setSaqueMsg('Erro de conexão')
    } finally {
      setSaqueLoading(false)
    }
  }

  function getBetStatusColor(status: string) {
    if (status === 'won') return '#00e676'
    if (status === 'lost') return '#ef5350'
    return '#888'
  }

  function getBetStatusLabel(status: string) {
    if (status === 'won') return 'GANHOU'
    if (status === 'lost') return 'PERDEU'
    return 'ABERTO'
  }

  if (loading) return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>Carregando...</div>
    </div>
  )

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, Kanit, sans-serif', paddingBottom: '80px' }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        .tab-btn{background:none;border:none;cursor:pointer;padding:10px 20px;font-family:inherit;font-size:14px;font-weight:600;color:#555;border-bottom:2px solid transparent;transition:all 0.2s}
        .tab-btn.active{color:#00e676;border-bottom-color:#00e676}
        .stat-card{background:#1a1a1a;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px;text-align:center}
        .bet-row{background:#1a1a1a;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:12px 14px;margin-bottom:8px}
        .copy-btn{background:rgba(0,230,118,0.1);border:1px solid rgba(0,230,118,0.3);color:#00e676;border-radius:8px;padding:8px 16px;cursor:pointer;font-size:13px;font-weight:600;font-family:inherit;transition:all 0.2s}
        .copy-btn:hover{background:rgba(0,230,118,0.2)}
        .saque-btn{background:rgba(255,179,0,0.1);border:1px solid rgba(255,179,0,0.3);color:#ffb300;border-radius:8px;padding:8px 16px;cursor:pointer;font-size:13px;font-weight:600;font-family:inherit;transition:all 0.2s}
        .saque-btn:hover{background:rgba(255,179,0,0.2)}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px}
        .modal-box{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:14px;padding:24px;width:100%;max-width:360px}
        .modal-input{width:100%;background:#111;border:1px solid #333;border-radius:8px;padding:10px 12px;color:#fff;font-size:14px;font-family:inherit;outline:none;box-sizing:border-box}
        .modal-input:focus{border-color:#00e676}
      `}</style>

      <div style={{ padding: '20px 16px 0', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#00e676,#00b248)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px', color: '#000' }}>
              {getInitials(user?.name || '')}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '16px' }}>{user?.name}</p>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={{ background: 'rgba(239,83,80,0.1)', border: '1px solid rgba(239,83,80,0.3)', color: '#ef5350', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit' }}>
            Sair
          </button>
        </div>

        <div style={{ background: 'linear-gradient(135deg,#1a2a1a,#0d1a0d)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '4px' }}>Saldo disponivel</p>
          <p style={{ fontSize: '32px', fontWeight: 800, color: '#00e676' }}>R$ {balance.toFixed(2)}</p>
          <button onClick={() => setDepositModal(true)} style={{ marginTop: '14px', background: '#00e676', border: 'none', borderRadius: '8px', padding: '10px 20px', color: '#000', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
            + Depositar
          </button>
        </div>

        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '20px' }}>
            <div className="stat-card">
              <p style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>{stats.total_bets || 0}</p>
              <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '4px' }}>Apostas</p>
            </div>
            <div className="stat-card">
              <p style={{ fontSize: '22px', fontWeight: 800, color: '#00e676' }}>{stats.win_rate || 0}%</p>
              <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '4px' }}>Taxa Vitoria</p>
            </div>
            <div className="stat-card">
              <p style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>R${Number(stats.total_amount || 0).toFixed(0)}</p>
              <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '4px' }}>Total Apostado</p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
          <button className={'tab-btn' + (tab === 'apostas' ? ' active' : '')} onClick={() => setTab('apostas')}>Minhas Apostas</button>
          <button className={'tab-btn' + (tab === 'afiliados' ? ' active' : '')} onClick={() => setTab('afiliados')}>Afiliados</button>
        </div>

        {tab === 'apostas' && (
          <div>
            {bets.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: '40px 0', fontSize: '14px' }}>
                Nenhuma aposta ainda
              </div>
            ) : bets.map((b: any) => (
              <div key={b.id} className="bet-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, flex: 1, marginRight: '8px', lineHeight: 1.4 }}>
                    {b.question}
                    {b.option_title && <span style={{ color: '#00e676', fontSize: '11px', display: 'block', marginTop: '2px' }}>{b.option_title}</span>}
                  </p>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: getBetStatusColor(b.status), background: getBetStatusColor(b.status) + '22', padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                    {getBetStatusLabel(b.status)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: b.choice === 'yes' ? '#00c853' : '#ef5350', fontWeight: 600 }}>
                    {b.choice === 'yes' ? 'SIM' : 'NAO'}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>R$ {Number(b.amount).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'afiliados' && referrals && (
          <div>
            <div style={{ background: 'var(--card)', border: '1px solid rgba(0,230,118,0.15)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '8px' }}>Seu codigo de indicacao</p>
              <p style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '0.1em', color: '#00e676', marginBottom: '12px' }}>{referrals.referral_code || '...'}</p>
              {referrals.referral_code && (
                <button className="copy-btn" onClick={copyRef}>
                  {copied ? 'Copiado!' : 'Copiar link de indicacao'}
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '16px' }}>
              <div className="stat-card">
                <p style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>{referrals.total_referred || 0}</p>
                <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '4px' }}>Indicados</p>
              </div>
              <div className="stat-card">
                <p style={{ fontSize: '16px', fontWeight: 800, color: '#00e676' }}>R$ {Number(referrals.total_earned || 0).toFixed(2)}</p>
                <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '4px' }}>Total ganho</p>
              </div>
              <div className="stat-card">
                <p style={{ fontSize: '16px', fontWeight: 800, color: '#ffb300' }}>R$ {Number(referrals.balance_affiliate || 0).toFixed(2)}</p>
                <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '4px' }}>Disponível</p>
              </div>
            </div>

            {Number(referrals.balance_affiliate || 0) > 0 && (
              <button className="saque-btn" style={{ width: '100%', marginBottom: '16px', padding: '12px' }} onClick={() => setSaqueModal(true)}>
                Solicitar Saque de Comissão
              </button>
            )}

            <div style={{ background: 'rgba(0,230,118,0.05)', border: '1px solid rgba(0,230,118,0.1)', borderRadius: '10px', padding: '14px', fontSize: '13px', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
              <p style={{ color: '#00e676', fontWeight: 600, marginBottom: '6px' }}>Como funciona?</p>
              <p>Compartilhe seu link de indicacao. Quando alguem se cadastrar usando seu codigo, voce ganha comissao automatica sobre os depositos deles.</p>
            </div>
          </div>
        )}
      </div>

      {saqueModal && (
        <div className="modal-overlay" onClick={() => setSaqueModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <p style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>Saque de Comissão</p>
            <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '20px' }}>
              Disponível: <span style={{ color: '#ffb300', fontWeight: 700 }}>R$ {Number(referrals?.balance_affiliate || 0).toFixed(2)}</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '6px' }}>Valor (R$)</p>
                <input className="modal-input" type="number" min="1" step="0.01" placeholder="0,00" value={saqueValor} onChange={e => setSaqueValor(e.target.value)} />
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '6px' }}>Chave PIX</p>
                <input className="modal-input" type="text" placeholder="CPF, email, celular ou chave aleatória" value={saquePix} onChange={e => setSaquePix(e.target.value)} />
              </div>
              {saqueMsg && <p style={{ fontSize: '13px', color: saqueMsg.includes('solicitado') ? '#00e676' : '#ef5350' }}>{saqueMsg}</p>}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button onClick={handleSaqueAfiliado} disabled={saqueLoading} style={{ flex: 1, background: '#ffb300', border: 'none', borderRadius: '8px', padding: '12px', color: '#000', fontWeight: 700, fontSize: '14px', cursor: saqueLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saqueLoading ? 0.6 : 1 }}>
                  {saqueLoading ? 'Enviando...' : 'Solicitar'}
                </button>
                <button onClick={() => { setSaqueModal(false); setSaqueMsg('') }} style={{ padding: '12px 16px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--muted-foreground)', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {depositModal && <DepositModalComp
        onClose={() => setDepositModal(false)}
        balance={balance}
        setBalance={(b: any) => setBalance(typeof b === 'function' ? b(balance) : b)}
        minDeposit={minDeposit}
        API={API}
      />}

      <BottomNav activePage="perfil" onDeposit={() => setDepositModal(true)} />
    </div>
  )
}
