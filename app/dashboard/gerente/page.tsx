'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Wallet, TrendingUp, UserCheck, Copy, LogOut, Pencil, ChevronLeft, X, Check, ExternalLink } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://ww5y7zdj6dn9y63m6zk4ec7r.187.77.248.115.sslip.io'

export default function GerenteDashboard() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editAff, setEditAff] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [token, setToken] = useState('')

  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!u || !t) { router.push('/login'); return }
    const parsed = JSON.parse(u)
    if (parsed.role !== 'manager') { router.push('/'); return }
    setToken(t)
    load(t)
  }, [])

  async function load(t: string) {
    setLoading(true)
    try {
      const r = await fetch(API + '/api/manager/me', { headers: { 'Authorization': 'Bearer ' + t } })
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

  async function saveCommission() {
    if (!editAff) return
    setSaving(true)
    try {
      const r = await fetch(API + `/api/manager/affiliates/${editAff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ cpa: Number(editAff.cpa || 0), rev_share: Number(editAff.rev_share || 0), baseline: Number(editAff.baseline || 0) })
      })
      const d = await r.json()
      if (d.success) { showToast('Comissão salva!'); setEditAff(null); load(token) }
      else showToast(d.error || 'Erro', 'error')
    } catch { showToast('Erro de conexão', 'error') }
    setSaving(false)
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
    bg: '#0f0f0f', card: '#1a1a1a', border: '#222', green: '#00e676',
    red: '#f44336', yellow: '#ffb300', blue: '#3b82f6', text: '#fff', muted: '#888', label: '#555',
  }
  const fmt = (n: number) => `R$ ${Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  const InputStyle = { width: '100%', background: '#141414', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px', color: '#ccc', fontSize: '13px', outline: 'none' }
  const LabelStyle = { fontSize: '11px', color: V.label, display: 'block' as any, marginBottom: '5px', textTransform: 'uppercase' as any, letterSpacing: '0.1em', fontWeight: 600 }

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
          .g3{grid-template-columns:repeat(2,1fr)!important}
          .g2{grid-template-columns:1fr!important}
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
          <span style={{ fontWeight: 700, fontSize: '14px' }}>Painel do Gerente</span>
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
          <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '8px', background: toast.type === 'error' ? 'rgba(244,67,54,0.08)' : 'rgba(0,230,118,0.08)', border: `1px solid ${toast.type === 'error' ? 'rgba(244,67,54,0.2)' : 'rgba(0,230,118,0.2)'}`, color: toast.type === 'error' ? V.red : V.green, fontSize: '13px' }}>
            {toast.text}
          </div>
        )}

        {/* Saudação */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: "'Manrope',sans-serif", marginBottom: '4px' }}>
            Olá, {data?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: V.muted, fontSize: '13px' }}>Gerencie seus afiliados e acompanhe as comissões.</p>
        </div>

        {/* Cards de stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '16px' }} className="g3">
          <StatCard icon={UserCheck} color={V.green} label="Afiliados" value={String(data?.stats?.total_affiliates || 0)} sub="Vinculados ao seu link" />
          <StatCard icon={Users} color={V.blue} label="Indicados pelos afiliados" value={String(data?.stats?.total_referred || 0)} sub="Total de usuários captados" />
          <StatCard icon={Wallet} color={V.green} label="Comissões geradas" value={fmt(data?.stats?.total_commissions || 0)} sub="Total acumulado" />
        </div>

        {/* Painel de comissão — teto + distribuição + margem */}
        {data?.my_commission && (
          <div style={{ background: V.card, borderRadius: '12px', border: `1px solid ${V.border}`, padding: '20px', marginBottom: '24px' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, color: V.label, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>Sua comissão</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }} className="g3">
              {/* Teto */}
              <div style={{ background: 'var(--surface)', borderRadius: '10px', padding: '14px', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '10px', color: V.label, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Seu teto (admin)</p>
                <p style={{ fontSize: '20px', fontWeight: 700, color: V.blue }}>CPA: {fmt(data.my_commission.cpa)}</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: V.blue, marginTop: '2px' }}>RevShare: {data.my_commission.rev_share}%</p>
                <p style={{ fontSize: '11px', color: V.label, marginTop: '4px' }}>Máximo que pode distribuir</p>
              </div>
              {/* Distribuído */}
              <div style={{ background: 'var(--surface)', borderRadius: '10px', padding: '14px', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '10px', color: V.label, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Distribuído (média)</p>
                <p style={{ fontSize: '20px', fontWeight: 700, color: V.yellow }}>RevShare: {data.stats.avg_affiliate_rev_share}%</p>
                <p style={{ fontSize: '11px', color: V.label, marginTop: '4px' }}>Média dos seus afiliados</p>
              </div>
              {/* Sua margem */}
              <div style={{ background: 'rgba(0,230,118,0.04)', borderRadius: '10px', padding: '14px', border: `1px solid rgba(0,230,118,0.15)` }}>
                <p style={{ fontSize: '10px', color: V.label, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Sua margem</p>
                <p style={{ fontSize: '20px', fontWeight: 700, color: V.green }}>{data.stats.my_margin > 0 ? data.stats.my_margin : 0}%</p>
                <p style={{ fontSize: '11px', color: V.label, marginTop: '4px' }}>Teto − média distribuída</p>
              </div>
            </div>
          </div>
        )}

        {/* Link de recrutamento */}
        <div style={{ background: V.card, borderRadius: '12px', border: `1px solid ${V.border}`, padding: '20px', marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: V.label, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Seu link de recrutamento de afiliados</p>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <code style={{ flex: 1, background: 'var(--surface)', border: `1px solid ${V.border}`, borderRadius: '8px', padding: '10px 14px', color: V.green, fontSize: '13px', wordBreak: 'break-all' }}>
              {typeof window !== 'undefined' ? `${window.location.origin}/cadastrar?ref=${data?.referral_code}` : `/cadastrar?ref=${data?.referral_code}`}
            </code>
            <button onClick={copyLink} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px', border: `1px solid ${copied ? V.green : V.border}`, background: copied ? 'rgba(0,230,118,0.1)' : 'transparent', color: copied ? V.green : V.muted, fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
              {copied ? <><Check size={13} /> Copiado!</> : <><Copy size={13} /> Copiar link</>}
            </button>
          </div>
          <p style={{ fontSize: '11px', color: V.label, marginTop: '8px' }}>
            Quando um afiliado se cadastrar usando este link, ele ficará vinculado a você e você poderá configurar a comissão dele.
          </p>
        </div>

        {/* Tabela de afiliados */}
        <div style={{ background: V.card, borderRadius: '12px', border: `1px solid ${V.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${V.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: '15px' }}>Meus Afiliados</p>
              <p style={{ fontSize: '12px', color: V.muted, marginTop: '2px' }}>Configure a comissão de cada afiliado</p>
            </div>
            <span style={{ background: 'rgba(0,230,118,0.1)', color: V.green, border: '1px solid rgba(0,230,118,0.2)', borderRadius: '99px', padding: '3px 10px', fontSize: '11px', fontWeight: 600 }}>
              {data?.affiliates?.length || 0} afiliados
            </span>
          </div>
          <div className="table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#141414' }}>
                  {['Nome', 'Email', 'CPA (R$)', 'RevShare (%)', 'Sua margem', 'Indicados', 'Comissões', 'Ações'].map(c => (
                    <th key={c} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '11px', fontWeight: 600, color: V.label, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `1px solid ${V.border}`, whiteSpace: 'nowrap' }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(!data?.affiliates || data.affiliates.length === 0) ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: V.label, fontSize: '13px' }}>
                      <UserCheck size={32} color={V.border} style={{ display: 'block', margin: '0 auto 10px' }} />
                      Nenhum afiliado ainda. Compartilhe seu link para começar.
                    </td>
                  </tr>
                ) : data.affiliates.map((a: any, i: number) => (
                  <tr key={i} className="trow" style={{ borderBottom: `1px solid #1e1e1e` }}>
                    <td style={{ padding: '12px 16px', color: '#ccc', fontWeight: 500 }}>{a.name}</td>
                    <td style={{ padding: '12px 16px', color: V.muted, fontSize: '12px' }}>{a.email}</td>
                    <td style={{ padding: '12px 16px', color: '#ccc' }}>R$ {Number(a.cpa || 0).toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', color: '#ccc' }}>{Number(a.rev_share || 0).toFixed(1)}%</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ color: V.green, fontWeight: 600 }}>
                        {Math.max(0, (data?.my_commission?.rev_share || 0) - Number(a.rev_share || 0)).toFixed(1)}%
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#ccc' }}>{a.total_referred}</td>
                    <td style={{ padding: '12px 16px', color: V.green, fontWeight: 600 }}>{fmt(a.total_earned || 0)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => setEditAff({ ...a })} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', border: `1px solid ${V.border}`, background: 'transparent', color: '#ccc', fontSize: '12px', cursor: 'pointer' }}>
                        <Pencil size={12} /> Comissão
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal editar comissão */}
      {editAff && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'var(--card)', borderRadius: '14px', border: `1px solid ${V.border}`, padding: '24px', width: '100%', maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '15px' }}>Configurar comissão</p>
                <p style={{ fontSize: '12px', color: V.muted, marginTop: '2px' }}>{editAff.name}</p>
              </div>
              <button onClick={() => setEditAff(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: V.muted }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Resumo teto + margem em tempo real */}
              <div style={{ background: 'var(--surface)', borderRadius: '8px', padding: '12px 14px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontSize: '10px', color: V.label, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Seu teto RevShare</p>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: V.blue }}>{data?.my_commission?.rev_share || 0}%</p>
                </div>
                <div>
                  <p style={{ fontSize: '10px', color: V.label, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Afiliado recebe</p>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: V.yellow }}>{Number(editAff.rev_share || 0).toFixed(1)}%</p>
                </div>
                <div>
                  <p style={{ fontSize: '10px', color: V.label, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sua margem</p>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: V.green }}>
                    {Math.max(0, (data?.my_commission?.rev_share || 0) - Number(editAff.rev_share || 0)).toFixed(1)}%
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={LabelStyle}>CPA (R$) — máx: R$ {(data?.my_commission?.cpa || 0).toFixed(2)}</label>
                  <input type="number" step="0.01" min="0" max={data?.my_commission?.cpa || 0} style={InputStyle} value={editAff.cpa || 0} onChange={(e: any) => setEditAff({ ...editAff, cpa: e.target.value })} />
                  <p style={{ fontSize: '10px', color: V.label, marginTop: '4px' }}>Valor fixo por 1º depósito</p>
                </div>
                <div>
                  <label style={LabelStyle}>RevShare (%) — máx: {data?.my_commission?.rev_share || 0}%</label>
                  <input type="number" step="0.1" min="0" max={data?.my_commission?.rev_share || 0} style={InputStyle} value={editAff.rev_share || 0} onChange={(e: any) => setEditAff({ ...editAff, rev_share: e.target.value })} />
                  <p style={{ fontSize: '10px', color: V.label, marginTop: '4px' }}>% sobre depósitos dos indicados</p>
                </div>
              </div>
              <div>
                <label style={LabelStyle}>Depósito mínimo para comissão (R$)</label>
                <input type="number" step="0.01" min="0" style={InputStyle} value={editAff.baseline || 0} onChange={(e: any) => setEditAff({ ...editAff, baseline: e.target.value })} />
                <p style={{ fontSize: '10px', color: V.label, marginTop: '4px' }}>Indicado precisa depositar ao menos este valor</p>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button onClick={() => setEditAff(null)} style={{ padding: '9px 18px', borderRadius: '8px', border: `1px solid ${V.border}`, background: 'transparent', color: V.muted, fontSize: '13px', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button onClick={saveCommission} disabled={saving} style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', background: V.green, color: '#000', fontWeight: 700, fontSize: '13px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, color, label, value, sub }: any) {
  return (
    <div style={{ background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} color={color} strokeWidth={2} />
        </div>
      </div>
      <p style={{ fontSize: '22px', fontWeight: 700, fontFamily: "'Manrope',sans-serif", color: '#fff' }}>{value}</p>
      <p style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{sub}</p>
    </div>
  )
}
