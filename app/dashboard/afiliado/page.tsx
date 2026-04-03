'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Wallet, TrendingUp, UserCheck, Copy, LogOut, Check, ExternalLink, DollarSign } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://ww5y7zdj6dn9y63m6zk4ec7r.187.77.248.115.sslip.io'

export default function AffiliateDashboard() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState<any>(null)

  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!u || !t) { router.push('/login'); return }
    const parsed = JSON.parse(u)
    if (parsed.role !== 'affiliate' && !parsed.is_affiliate) { router.push('/'); return }
    load(t)
  }, [])

  async function load(t: string) {
    setLoading(true)
    try {
      const r = await fetch(API + '/api/affiliate/me', { headers: { 'Authorization': 'Bearer ' + t } })
      const d = await r.json()
      if (d.error) { router.push('/login'); return }
      setData(d)
    } catch { router.push('/login') }
    setLoading(false)
  }

  function showToast(text: string, type = 'success') {
    setToast({ text, type })
    setTimeout(() => setToast(null), 3500)
  }

  function copyLink() {
    if (!data?.referral_code) return
    const url = `${window.location.origin}/cadastrar?ref=${data.referral_code}`
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
      } else {
        const el = document.createElement('textarea')
        el.value = url
        el.style.position = 'fixed'
        el.style.opacity = '0'
        document.body.appendChild(el)
        el.focus()
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch { setCopied(false) }
  }

  const V = {
    bg: '#0f0f0f', card: '#1a1a1a', border: '#222', green: 'var(--primary)',
    red: '#f44336', yellow: '#ffb300', blue: '#3b82f6', text: '#fff', muted: '#888', label: '#555',
  }
  const fmt = (n: number) => `R$ ${Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

  if (loading) return (
    <div style={{ minHeight: '100vh', background: V.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: V.muted, fontSize: '14px' }}>Carregando...</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: V.bg, color: V.text, fontFamily: "'Inter',system-ui,sans-serif", fontSize: '14px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input,button{font-family:inherit;font-size:13px}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0f0f0f}::-webkit-scrollbar-thumb{background:#222;border-radius:3px}
        .trow:hover td{background:#1f1f1f!important}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        .fade-in{animation:fadeIn 0.2s ease}
        @media(max-width:768px){
          .g4{grid-template-columns:repeat(2,1fr)!important}
          .pad{padding:16px!important}
          .table-wrap{overflow-x:auto!important}
          .hide-mobile{display:none!important}
        }
      `}</style>

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 30, height: '56px', background: `${V.bg}ee`, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${V.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: V.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={15} color="#000" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '14px' }}>Painel do Afiliado</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '7px', border: `1px solid ${V.border}`, color: V.muted, fontSize: '12px', textDecoration: 'none' }}>
            <ExternalLink size={12} /> Ver site
          </a>
          <button onClick={() => { localStorage.clear(); router.push('/login') }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '7px', border: `1px solid ${V.border}`, background: 'transparent', color: V.muted, fontSize: '12px', cursor: 'pointer' }}>
            <LogOut size={13} /> Sair
          </button>
        </div>
      </header>

      <main style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }} className="pad fade-in">

        {/* Toast */}
        {toast && (
          <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '8px', background: toast.type === 'error' ? 'rgba(244,67,54,0.08)' : 'rgba(var(--primary-rgb, 0,230,118),0.08)', border: `1px solid ${toast.type === 'error' ? 'rgba(244,67,54,0.2)' : 'rgba(var(--primary-rgb, 0,230,118),0.2)'}`, color: toast.type === 'error' ? V.red : V.green, fontSize: '13px' }}>
            {toast.text}
          </div>
        )}

        {/* Saudação */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: "'Manrope',sans-serif", marginBottom: '4px' }}>
            Olá, {data?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: V.muted, fontSize: '13px' }}>Acompanhe seus indicados e comissões.</p>
        </div>

        {/* Cards de stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }} className="g4">
          <StatCard icon={UserCheck} color={V.muted} label="Indicados" value={String(data?.stats?.total_referred || 0)} sub="Cadastros pelo seu link" />
          <StatCard icon={Wallet} color={V.muted} label="Depósitos gerados" value={fmt(data?.stats?.total_deposits_generated || 0)} sub="Total de todos os status" />
          <StatCard icon={Users} color={V.green} label="Depósitos aprovados" value={fmt(data?.stats?.total_deposits_approved || 0)} sub="Apenas concluídos" />
          <StatCard icon={DollarSign} color={V.green} label="Comissão total" value={fmt(data?.stats?.total_commissions || 0)} sub="Acumulado até agora" />
        </div>

        {/* Sua negociação — readonly */}
        {(data?.my_commission?.cpa > 0 || data?.my_commission?.rev_share > 0) && (
          <div style={{ background: V.card, borderRadius: '12px', border: `1px solid ${V.border}`, padding: '20px', marginBottom: '24px' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, color: V.label, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>Sua negociação</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }} className="g4">
              <div style={{ background: 'var(--surface)', borderRadius: '10px', padding: '14px', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '10px', color: V.label, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>CPA</p>
                <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)' }}>{fmt(data.my_commission.cpa)}</p>
                <p style={{ fontSize: '11px', color: V.label, marginTop: '4px' }}>Valor fixo por 1º depósito</p>
              </div>
              <div style={{ background: 'var(--surface)', borderRadius: '10px', padding: '14px', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '10px', color: V.label, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>RevShare</p>
                <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)' }}>{data.my_commission.rev_share}%</p>
                <p style={{ fontSize: '11px', color: V.label, marginTop: '4px' }}>% sobre depósitos dos indicados</p>
              </div>
              {data.my_commission.baseline > 0 && (
                <div style={{ background: 'var(--surface)', borderRadius: '10px', padding: '14px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '10px', color: V.label, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Depósito mínimo</p>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)' }}>{fmt(data.my_commission.baseline)}</p>
                  <p style={{ fontSize: '11px', color: V.label, marginTop: '4px' }}>Para contabilizar comissão</p>
                </div>
              )}
            </div>
            <p style={{ fontSize: '11px', color: V.label, marginTop: '12px' }}>Negociação definida pelo seu gerente — entre em contato para alterar.</p>
          </div>
        )}

        {/* Seu link de afiliado */}
        <div style={{ background: V.card, borderRadius: '12px', border: `1px solid ${V.border}`, padding: '20px', marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: V.label, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Seu link de indicação</p>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <code style={{ flex: 1, background: 'var(--surface)', border: `1px solid ${V.border}`, borderRadius: '8px', padding: '10px 14px', color: V.green, fontSize: '13px', wordBreak: 'break-all' }}>
              {typeof window !== 'undefined' ? `${window.location.origin}/cadastrar?ref=${data?.referral_code}` : `/cadastrar?ref=${data?.referral_code}`}
            </code>
            <button onClick={copyLink} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px', border: `1px solid ${copied ? V.green : V.border}`, background: copied ? 'rgba(var(--primary-rgb, 0,230,118),0.1)' : 'transparent', color: copied ? V.green : V.muted, fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
              {copied ? <><Check size={13} /> Copiado!</> : <><Copy size={13} /> Copiar link</>}
            </button>
          </div>
          <p style={{ fontSize: '11px', color: V.label, marginTop: '8px' }}>
            Compartilhe este link — cada cadastro fica vinculado a você e gera comissão nos depósitos.
          </p>
        </div>

        {/* Tabela de indicados */}
        <div style={{ background: V.card, borderRadius: '12px', border: `1px solid ${V.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${V.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: '15px' }}>Meus Indicados</p>
              <p style={{ fontSize: '12px', color: V.muted, marginTop: '2px' }}>Usuários que se cadastraram pelo seu link</p>
            </div>
            <span style={{ background: 'rgba(var(--primary-rgb, 0,230,118),0.1)', color: V.green, border: '1px solid rgba(var(--primary-rgb, 0,230,118),0.2)', borderRadius: '99px', padding: '3px 10px', fontSize: '11px', fontWeight: 600 }}>
              {data?.referred?.length || 0} indicados
            </span>
          </div>
          <div className="table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#141414' }}>
                  {['Nome', 'Email', 'Depósitos gerados', 'Depósitos aprovados', 'Status', 'Cadastro'].map(c => (
                    <th key={c} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '11px', fontWeight: 600, color: V.label, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `1px solid ${V.border}`, whiteSpace: 'nowrap' }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(!data?.referred || data.referred.length === 0) ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: V.label, fontSize: '13px' }}>
                      <UserCheck size={32} color={V.border} style={{ display: 'block', margin: '0 auto 10px' }} />
                      Nenhum indicado ainda. Compartilhe seu link para começar.
                    </td>
                  </tr>
                ) : data.referred.map((r: any, i: number) => (
                  <tr key={i} className="trow" style={{ borderBottom: '1px solid #1e1e1e' }}>
                    <td style={{ padding: '12px 16px', color: '#ccc', fontWeight: 500 }}>{r.name}</td>
                    <td style={{ padding: '12px 16px', color: V.muted, fontSize: '12px' }}>{r.email}</td>
                    <td style={{ padding: '12px 16px', color: '#ccc' }}>{fmt(r.total_deposited || 0)}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--foreground)', fontWeight: 600 }}>{fmt(r.total_approved || 0)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                        background: r.status === 'active' ? 'rgba(var(--primary-rgb, 0,230,118),0.1)' : 'rgba(255,179,0,0.1)',
                        color: r.status === 'active' ? V.green : V.yellow,
                        border: `1px solid ${r.status === 'active' ? 'rgba(var(--primary-rgb, 0,230,118),0.2)' : 'rgba(255,179,0,0.2)'}`
                      }}>
                        {r.status === 'active' ? 'Ativo' : r.status || 'Pendente'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: V.muted, fontSize: '12px' }} className="hide-mobile">
                      {new Date(r.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon: Icon, color, label, value, sub }: any) {
  return (
    <div style={{ background: 'var(--card)', borderRadius: '14px', border: '1px solid var(--border)', padding: '20px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)' }}/>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>{label}</span>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color='rgba(255,255,255,0.3)' strokeWidth={1.75} />
        </div>
      </div>
      <p style={{ fontSize: '28px', fontWeight: 800, fontFamily: "'Manrope',sans-serif", color: '#ffffff', letterSpacing: '-1px', lineHeight: 1, marginBottom: '8px' }}>{value}</p>
      <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', lineHeight: 1.4 }}>{sub}</p>
    </div>
  )
}
