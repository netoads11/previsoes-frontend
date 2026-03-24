'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const API = 'http://187.77.248.115:3001'

const ICONS: any = {
  dashboard: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  metrics: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  audit: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  settings: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  users: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  markets: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  deposits: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  withdrawals: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>,
  create: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
}

const NAV_SECTIONS = [
  { title: 'Principal', items: [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'audit', label: 'Auditoria', icon: 'audit' },
    { id: 'configs', label: 'Configuracoes', icon: 'settings' },
  ]},
  { title: 'Gerenciamento', items: [
    { id: 'users', label: 'Usuarios', icon: 'users' },
  ]},
  { title: 'Financeiro', items: [
    { id: 'withdrawals', label: 'Saques', icon: 'withdrawals' },
    { id: 'deposits', label: 'Depositos', icon: 'deposits' },
  ]},
  { title: 'Operacional', items: [
    { id: 'markets', label: 'Mercados', icon: 'markets' },
    { id: 'criar', label: 'Criar Mercado', icon: 'create' },
  ]},
]

const CATS = ['Entretenimento','Criptomoedas','Financeiro','Esportes','Politica','Clima','Celebridades']

export default function Admin() {
  const router = useRouter()
  const [tab, setTab] = useState('dashboard')
  const [token, setToken] = useState('')
  const [markets, setMarkets] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [deposits, setDeposits] = useState<any[]>([])
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [audit, setAudit] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<any>(null)
  const [confirm, setConfirm] = useState<any>(null)
  const [editMarket, setEditMarket] = useState<any>(null)
  const [editUser, setEditUser] = useState<any>(null)
  const [balanceModal, setBalanceModal] = useState<any>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [newMarket, setNewMarket] = useState({question:'',category:'Financeiro',yes_odds:'50',no_odds:'50',expires_at:''})

  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!u || !t) { router.push('/login'); return }
    if (!JSON.parse(u).is_admin) { router.push('/'); return }
    setToken(t)
    load(t)
    const onKey = (e: KeyboardEvent) => { if ((e.ctrlKey||e.metaKey) && e.key==='k') { e.preventDefault(); setSearchOpen(s=>!s) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function load(t: string) {
    setLoading(true)
    const h = {'Authorization':'Bearer '+t}
    const [m,u,d,w,a,s] = await Promise.all([
      fetch(API+'/api/markets').then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/users',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/deposits',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/withdrawals',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/audit',{headers:h}).then(r=>r.json()).catch(()=>[]),
      fetch(API+'/api/admin/settings',{headers:h}).then(r=>r.json()).catch(()=>({})),
    ])
    setMarkets(Array.isArray(m)?m:[])
    setUsers(Array.isArray(u)?u:[])
    setDeposits(Array.isArray(d)?d:[])
    setWithdrawals(Array.isArray(w)?w:[])
    setAudit(Array.isArray(a)?a:[])
    setSettings(s||{})
    setLoading(false)
  }

  function showToast(text: string, type='success') {
    setToast({text,type})
    setTimeout(()=>setToast(null),3500)
  }

  async function api(url: string, method='GET', body?: any) {
    const r = await fetch(API+url,{method,headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:body?JSON.stringify(body):undefined})
    return r.json()
  }

  function askConfirm(msg: string, action: ()=>Promise<void>) {
    setConfirm({msg,action})
  }

  async function createMarket(e: any) {
    e.preventDefault()
    const r = await api('/api/admin/markets','POST',{...newMarket,yes_odds:Number(newMarket.yes_odds),no_odds:Number(newMarket.no_odds),expires_at:newMarket.expires_at||null})
    if (r.id) { showToast('Mercado criado com sucesso!'); setNewMarket({question:'',category:'Financeiro',yes_odds:'50',no_odds:'50',expires_at:''}); load(token) }
    else showToast(r.error||'Erro ao criar mercado','error')
  }

  async function saveMarket() {
    const r = await api(`/api/admin/markets/${editMarket.id}`,'PUT',editMarket)
    if (r.id) { showToast('Mercado atualizado!'); setEditMarket(null); load(token) }
    else showToast(r.error||'Erro','error')
  }

  async function saveUser() {
    const r = await api(`/api/admin/users/${editUser.id}`,'PUT',editUser)
    if (r.id) { showToast('Usuario atualizado!'); setEditUser(null); load(token) }
    else showToast(r.error||'Erro','error')
  }

  async function adjustBalance() {
    const r = await api(`/api/admin/users/${balanceModal.id}/balance`,'POST',{amount:Number(balanceModal.amount),note:balanceModal.note})
    if (r.success) { showToast('Saldo ajustado!'); setBalanceModal(null); load(token) }
    else showToast(r.error||'Erro','error')
  }

  async function saveSettings(e: any) {
    e.preventDefault()
    const r = await api('/api/admin/settings','PUT',settings)
    if (r.success) showToast('Configuracoes salvas!')
    else showToast(r.error||'Erro','error')
  }

  const totalDep = deposits.filter((d:any)=>d.status==='completed').reduce((a:number,d:any)=>a+Number(d.amount),0)
  const totalWith = withdrawals.filter((w:any)=>w.status==='completed'||w.status==='paid').reduce((a:number,w:any)=>a+Number(w.amount),0)
  const lucro = totalDep - totalWith

  const currentTabLabel = NAV_SECTIONS.flatMap(s=>s.items).find(i=>i.id===tab)?.label || 'Admin'

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#0f0f0f',color:'#fff',fontFamily:"'Inter','Kanit',system-ui,sans-serif"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        input,select,textarea,button{font-family:inherit}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#333;border-radius:99px}
        .trow:hover td{background:rgba(255,255,255,0.025)!important}
        .nav-btn:hover{background:rgba(255,255,255,0.04)!important;color:#ccc!important}
        .action-btn:hover{opacity:0.8}
        @keyframes toastIn{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes skel{0%,100%{opacity:.4}50%{opacity:.8}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .skel{animation:skel 1.4s ease infinite;background:#1e1e1e;border-radius:6px}
        .metric-card:hover{border-color:#2a2a2a!important;transform:translateY(-1px)}
      `}</style>

      {/* SIDEBAR */}
      <aside style={{width:'220px',flexShrink:0,background:'#111',borderRight:'1px solid #1a1a1a',display:'flex',flexDirection:'column',position:'sticky',top:0,height:'100vh',zIndex:20}}>
        {/* Logo */}
        <div style={{padding:'18px 16px 14px',borderBottom:'1px solid #1a1a1a',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:'9px'}}>
            <div style={{width:'30px',height:'30px',borderRadius:'8px',background:'linear-gradient(135deg,#00e676,#00b248)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 0 12px rgba(0,230,118,0.3)'}}>
              <span style={{color:'#000',fontWeight:900,fontSize:'13px',letterSpacing:'-0.5px'}}>P</span>
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:'13px',color:'#fff',lineHeight:1.2}}>Previmarket</div>
              <div style={{fontSize:'10px',color:'#00e676',fontWeight:500}}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* NAV */}
        <nav style={{flex:1,overflowY:'auto',padding:'8px 0'}}>
          {NAV_SECTIONS.map(section=>(
            <div key={section.title} style={{marginBottom:'2px'}}>
              <p style={{fontSize:'9px',fontWeight:700,letterSpacing:'0.14em',color:'#3a3a3a',textTransform:'uppercase',padding:'10px 16px 5px'}}>{section.title}</p>
              {section.items.map(item=>(
                <button key={item.id} onClick={()=>setTab(item.id)} className="nav-btn"
                  style={{width:'100%',display:'flex',alignItems:'center',gap:'9px',padding:'8px 16px',border:'none',cursor:'pointer',background:tab===item.id?'rgba(0,230,118,0.08)':'transparent',borderLeft:tab===item.id?'2px solid #00e676':'2px solid transparent',color:tab===item.id?'#00e676':'#555',fontSize:'13px',fontWeight:tab===item.id?600:400,textAlign:'left',transition:'all 0.12s'}}>
                  <span style={{flexShrink:0,opacity:tab===item.id?1:0.6}}>{ICONS[item.icon]}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{padding:'12px',borderTop:'1px solid #1a1a1a',display:'flex',gap:'6px',flexShrink:0}}>
          <a href="/" target="_blank" style={{flex:1,textAlign:'center',padding:'7px 6px',borderRadius:'7px',background:'transparent',border:'1px solid #222',color:'#555',fontSize:'11px',textDecoration:'none',transition:'all 0.12s',cursor:'pointer'}}>
            Ver Site
          </a>
          <button onClick={()=>{localStorage.clear();router.push('/')}} style={{flex:1,padding:'7px 6px',borderRadius:'7px',background:'rgba(244,67,54,0.08)',border:'1px solid rgba(244,67,54,0.15)',color:'#f44336',fontSize:'11px',cursor:'pointer',transition:'all 0.12s'}}>
            Sair
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>

        {/* HEADER */}
        <header style={{background:'rgba(17,17,17,0.95)',backdropFilter:'blur(12px)',borderBottom:'1px solid #1a1a1a',height:'52px',display:'flex',alignItems:'center',padding:'0 20px',gap:'12px',position:'sticky',top:0,zIndex:10,flexShrink:0}}>
          <h1 style={{fontSize:'14px',fontWeight:600,color:'#fff',flex:1}}>{currentTabLabel}</h1>
          <button onClick={()=>setSearchOpen(true)} style={{display:'flex',alignItems:'center',gap:'8px',background:'#1a1a1a',border:'1px solid #222',borderRadius:'8px',padding:'6px 12px',color:'#555',fontSize:'12px',cursor:'pointer',transition:'all 0.12s'}}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            Buscar
            <span style={{background:'#222',border:'1px solid #333',borderRadius:'4px',padding:'1px 5px',fontSize:'10px',color:'#444'}}>⌘K</span>
          </button>
          <button onClick={()=>load(token)} style={{background:'transparent',border:'1px solid #222',borderRadius:'7px',padding:'6px 12px',color:'#555',fontSize:'12px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Atualizar
          </button>
          <div style={{width:'30px',height:'30px',borderRadius:'50%',background:'linear-gradient(135deg,#00e676,#00b248)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
            <span style={{color:'#000',fontWeight:700,fontSize:'12px'}}>A</span>
          </div>
        </header>

        {/* CONTENT */}
        <main style={{flex:1,padding:'20px',overflowY:'auto'}}>

          {/* ─── DASHBOARD ─── */}
          {tab==='dashboard'&&(
            <div>
              {loading?(
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px',marginBottom:'16px'}}>
                  {Array(8).fill(0).map((_,i)=><div key={i} className="skel" style={{height:'88px'}}/>)}
                </div>
              ):(
                <>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'10px',marginBottom:'10px'}}>
                    {[
                      {label:'Usuarios',value:users.length,sub:`${users.filter((u:any)=>u.status!=='blocked').length} ativos`,accent:'#818cf8',icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>},
                      {label:'Mercados Ativos',value:markets.filter((m:any)=>m.status==='open').length,sub:`${markets.length} total`,accent:'#00e676',icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/></svg>},
                      {label:'Total Depositos',value:`R$${totalDep.toFixed(0)}`,sub:`${deposits.filter((d:any)=>d.status==='completed').length} pagamentos`,accent:'#00e676',icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>},
                      {label:'Total Saques',value:`R$${totalWith.toFixed(0)}`,sub:`${withdrawals.filter((w:any)=>w.status==='paid'||w.status==='completed').length} pagos`,accent:'#f44336',icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>},
                    ].map(c=>(
                      <div key={c.label} className="metric-card" style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'12px',padding:'16px',transition:'all 0.2s',cursor:'default'}}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
                          <p style={{fontSize:'11px',color:'#555',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.06em'}}>{c.label}</p>
                          <span style={{color:c.accent,opacity:0.7}}>{c.icon}</span>
                        </div>
                        <p style={{fontSize:'24px',fontWeight:700,color:c.accent,marginBottom:'4px',letterSpacing:'-0.5px'}}>{c.value}</p>
                        <p style={{fontSize:'11px',color:'#444'}}>{c.sub}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'10px',marginBottom:'16px'}}>
                    {[
                      {label:'Pendentes Saque',value:withdrawals.filter((w:any)=>w.status==='pending').length,sub:'Aguardando aprovacao',accent:'#ffb300'},
                      {label:'Pendentes Deposito',value:deposits.filter((d:any)=>d.status==='pending').length,sub:'Aguardando confirmacao',accent:'#ffb300'},
                      {label:'Auditoria',value:audit.length,sub:'Registros totais',accent:'#64748b'},
                      {label:'Lucro Total',value:`R$${lucro.toFixed(0)}`,sub:'Depositos menos Saques',accent:lucro>=0?'#00e676':'#f44336'},
                    ].map(c=>(
                      <div key={c.label} className="metric-card" style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'12px',padding:'16px',transition:'all 0.2s'}}>
                        <p style={{fontSize:'11px',color:'#555',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'10px'}}>{c.label}</p>
                        <p style={{fontSize:'24px',fontWeight:700,color:c.accent,marginBottom:'4px',letterSpacing:'-0.5px'}}>{c.value}</p>
                        <p style={{fontSize:'11px',color:'#444'}}>{c.sub}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                    <div style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'12px',padding:'16px'}}>
                      <p style={{fontSize:'12px',fontWeight:600,color:'#ccc',marginBottom:'12px'}}>Ultimos Mercados</p>
                      {markets.length===0?<p style={{color:'#444',fontSize:'12px'}}>Nenhum mercado.</p>:markets.slice(0,6).map((m:any)=>(
                        <div key={m.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid #1e1e1e'}}>
                          <span style={{fontSize:'12px',color:'#888',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'200px'}}>{m.question}</span>
                          <StatusBadge status={m.status}/>
                        </div>
                      ))}
                    </div>
                    <div style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'12px',padding:'16px'}}>
                      <p style={{fontSize:'12px',fontWeight:600,color:'#ccc',marginBottom:'12px'}}>Ultimas Transacoes</p>
                      {[...deposits,...withdrawals].sort((a,b)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime()).slice(0,6).map((t:any,i)=>(
                        <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid #1e1e1e'}}>
                          <div>
                            <span style={{fontSize:'12px',color:'#888'}}>{t.name||'Usuario'}</span>
                            <span style={{fontSize:'10px',color:'#3a3a3a',marginLeft:'6px'}}>{t.type}</span>
                          </div>
                          <span style={{fontSize:'12px',fontWeight:600,color:t.type==='deposit'?'#00e676':'#f44336'}}>R${Number(t.amount).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ─── MERCADOS ─── */}
          {tab==='markets'&&(
            <div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px'}}>
                <span style={{fontSize:'12px',color:'#555'}}>{markets.length} mercados cadastrados</span>
                <ActionBtn color="green" onClick={()=>setTab('criar')}>+ Novo Mercado</ActionBtn>
              </div>
              <DataTable
                loading={loading}
                cols={['Pergunta','Categoria','SIM','NAO','Status','Encerra','Acoes']}
                rows={markets.map((m:any)=>[
                  <span style={{fontSize:'13px',color:'#ccc',maxWidth:'180px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',display:'block'}}>{m.question}</span>,
                  <span style={{fontSize:'12px',color:'#666'}}>{m.category||'—'}</span>,
                  <span style={{fontSize:'12px',fontWeight:600,color:'#00e676'}}>{m.yes_odds}%</span>,
                  <span style={{fontSize:'12px',fontWeight:600,color:'#f44336'}}>{m.no_odds}%</span>,
                  <StatusBadge status={m.status}/>,
                  <span style={{fontSize:'11px',color:'#555'}}>{m.expires_at?new Date(m.expires_at).toLocaleDateString('pt-BR'):'—'}</span>,
                  <div style={{display:'flex',gap:'5px'}}>
                    <SmBtn onClick={()=>setEditMarket({...m})}>Editar</SmBtn>
                    {m.status==='open'&&<>
                      <SmBtn color="green" onClick={()=>askConfirm('Resolver mercado como SIM?',async()=>{const r=await api(`/api/admin/markets/${m.id}/resolve`,'PUT',{result:'yes'});if(r.success){showToast('Resolvido!');load(token)}else showToast(r.error||'Erro','error')})}>SIM</SmBtn>
                      <SmBtn color="red" onClick={()=>askConfirm('Resolver mercado como NAO?',async()=>{const r=await api(`/api/admin/markets/${m.id}/resolve`,'PUT',{result:'no'});if(r.success){showToast('Resolvido!');load(token)}else showToast(r.error||'Erro','error')})}>NAO</SmBtn>
                      <SmBtn color="red" onClick={()=>askConfirm('Cancelar mercado e devolver apostas?',async()=>{const r=await api(`/api/admin/markets/${m.id}/cancel`,'PUT',{});if(r.success){showToast('Cancelado!');load(token)}else showToast(r.error||'Erro','error')})}>Cancelar</SmBtn>
                    </>}
                  </div>
                ])}
              />
            </div>
          )}

          {/* ─── CRIAR MERCADO ─── */}
          {tab==='criar'&&(
            <div style={{maxWidth:'540px'}}>
              <FormCard>
                <form onSubmit={createMarket} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                  <FormField label="Pergunta do mercado *">
                    <FormInput value={newMarket.question} onChange={(e:any)=>setNewMarket({...newMarket,question:e.target.value})} placeholder="Ex: Bitcoin vai superar $100k em 2026?" required/>
                  </FormField>
                  <FormField label="Categoria">
                    <FormSelect value={newMarket.category} onChange={(e:any)=>setNewMarket({...newMarket,category:e.target.value})}>
                      {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                    </FormSelect>
                  </FormField>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                    <FormField label="% Chance SIM">
                      <FormInput type="number" min="1" max="99" value={newMarket.yes_odds} style={{color:'#00e676',fontWeight:700}} onChange={(e:any)=>setNewMarket({...newMarket,yes_odds:e.target.value,no_odds:String(100-Number(e.target.value))})}/>
                    </FormField>
                    <FormField label="% Chance NAO">
                      <FormInput type="number" min="1" max="99" value={newMarket.no_odds} style={{color:'#f44336',fontWeight:700}} onChange={(e:any)=>setNewMarket({...newMarket,no_odds:e.target.value,yes_odds:String(100-Number(e.target.value))})}/>
                    </FormField>
                  </div>
                  <div style={{background:'#141414',border:'1px solid #222',borderRadius:'8px',padding:'14px',display:'flex',justifyContent:'space-around'}}>
                    <div style={{textAlign:'center'}}>
                      <p style={{fontSize:'10px',color:'#444',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.08em'}}>Mult. SIM</p>
                      <p style={{fontSize:'22px',fontWeight:700,color:'#00e676',letterSpacing:'-0.5px'}}>{(100/Number(newMarket.yes_odds||1)).toFixed(2)}x</p>
                    </div>
                    <div style={{width:'1px',background:'#222'}}/>
                    <div style={{textAlign:'center'}}>
                      <p style={{fontSize:'10px',color:'#444',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.08em'}}>Mult. NAO</p>
                      <p style={{fontSize:'22px',fontWeight:700,color:'#f44336',letterSpacing:'-0.5px'}}>{(100/Number(newMarket.no_odds||1)).toFixed(2)}x</p>
                    </div>
                  </div>
                  <div style={{height:'4px',borderRadius:'2px',overflow:'hidden',background:'#222'}}>
                    <div style={{height:'100%',background:'linear-gradient(90deg,#00e676,rgba(0,230,118,0.3))',width:`${newMarket.yes_odds}%`,transition:'width 0.3s'}}/>
                  </div>
                  <FormField label="Data de encerramento">
                    <FormInput type="datetime-local" value={newMarket.expires_at} onChange={(e:any)=>setNewMarket({...newMarket,expires_at:e.target.value})}/>
                  </FormField>
                  <button type="submit" style={{background:'#00e676',color:'#000',border:'none',borderRadius:'8px',padding:'13px',fontWeight:700,fontSize:'14px',cursor:'pointer',letterSpacing:'0.02em',marginTop:'4px',transition:'opacity 0.15s'}}
                    onMouseEnter={(e:any)=>e.target.style.opacity='0.85'} onMouseLeave={(e:any)=>e.target.style.opacity='1'}>
                    CRIAR MERCADO
                  </button>
                </form>
              </FormCard>
            </div>
          )}

          {/* ─── USUARIOS ─── */}
          {tab==='users'&&(
            <div>
              <div style={{marginBottom:'14px'}}>
                <span style={{fontSize:'12px',color:'#555'}}>{users.length} usuarios cadastrados</span>
              </div>
              <DataTable
                loading={loading}
                cols={['Nome','Email','Status','Tipo','Cadastro','Acoes']}
                rows={users.map((u:any)=>[
                  <span style={{fontSize:'13px',color:'#ccc',fontWeight:500}}>{u.name}</span>,
                  <span style={{fontSize:'12px',color:'#666'}}>{u.email}</span>,
                  <StatusBadge status={u.status||'active'}/>,
                  <StatusBadge status={u.is_admin?'admin':'user'}/>,
                  <span style={{fontSize:'11px',color:'#555'}}>{new Date(u.created_at).toLocaleDateString('pt-BR')}</span>,
                  <div style={{display:'flex',gap:'5px'}}>
                    <SmBtn onClick={()=>setEditUser({...u})}>Editar</SmBtn>
                    <SmBtn color="green" onClick={()=>setBalanceModal({id:u.id,name:u.name,amount:'',note:''})}>Saldo</SmBtn>
                  </div>
                ])}
              />
            </div>
          )}

          {/* ─── SAQUES ─── */}
          {tab==='withdrawals'&&(
            <div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'14px'}}>
                {[
                  {label:'Pendentes',value:withdrawals.filter((w:any)=>w.status==='pending').length,accent:'#ffb300'},
                  {label:'Pagos',value:withdrawals.filter((w:any)=>w.status==='paid'||w.status==='completed').length,accent:'#00e676'},
                  {label:'Total',value:`R$${totalWith.toFixed(2)}`,accent:'#f44336'},
                ].map(c=>(
                  <div key={c.label} style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'10px',padding:'14px'}}>
                    <p style={{fontSize:'10px',color:'#555',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.08em'}}>{c.label}</p>
                    <p style={{fontSize:'22px',fontWeight:700,color:c.accent,letterSpacing:'-0.5px'}}>{c.value}</p>
                  </div>
                ))}
              </div>
              <DataTable
                loading={loading}
                cols={['Usuario','Valor','Status','Data','Acoes']}
                rows={withdrawals.map((w:any)=>[
                  <span style={{fontSize:'13px',color:'#ccc',fontWeight:500}}>{w.name||'—'}</span>,
                  <span style={{fontSize:'13px',fontWeight:600,color:'#f44336'}}>R${Number(w.amount).toFixed(2)}</span>,
                  <StatusBadge status={w.status}/>,
                  <span style={{fontSize:'11px',color:'#555'}}>{new Date(w.created_at).toLocaleDateString('pt-BR')}</span>,
                  <div style={{display:'flex',gap:'5px'}}>
                    {w.status==='pending'&&<>
                      <SmBtn color="green" onClick={()=>askConfirm('Aprovar este saque?',async()=>{const r=await api(`/api/admin/withdrawals/${w.id}/approve`,'PUT',{});if(r.success){showToast('Aprovado!');load(token)}else showToast(r.error||'Erro','error')})}>Aprovar</SmBtn>
                      <SmBtn color="red" onClick={()=>askConfirm('Recusar este saque?',async()=>{const r=await api(`/api/admin/withdrawals/${w.id}/reject`,'PUT',{reason:'Recusado'});if(r.success){showToast('Recusado!');load(token)}else showToast(r.error||'Erro','error')})}>Recusar</SmBtn>
                    </>}
                    {(w.status==='approved')&&<SmBtn color="green" onClick={()=>askConfirm('Marcar como pago?',async()=>{const r=await api(`/api/admin/withdrawals/${w.id}/paid`,'PUT',{});if(r.success){showToast('Pago!');load(token)}else showToast(r.error||'Erro','error')})}>Pago</SmBtn>}
                  </div>
                ])}
              />
            </div>
          )}

          {/* ─── DEPOSITOS ─── */}
          {tab==='deposits'&&(
            <div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'14px'}}>
                {[
                  {label:'Pendentes',value:deposits.filter((d:any)=>d.status==='pending').length,accent:'#ffb300'},
                  {label:'Confirmados',value:deposits.filter((d:any)=>d.status==='completed').length,accent:'#00e676'},
                  {label:'Total',value:`R$${totalDep.toFixed(2)}`,accent:'#00e676'},
                ].map(c=>(
                  <div key={c.label} style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'10px',padding:'14px'}}>
                    <p style={{fontSize:'10px',color:'#555',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.08em'}}>{c.label}</p>
                    <p style={{fontSize:'22px',fontWeight:700,color:c.accent,letterSpacing:'-0.5px'}}>{c.value}</p>
                  </div>
                ))}
              </div>
              <DataTable
                loading={loading}
                cols={['Usuario','Valor','Status','Data','Acoes']}
                rows={deposits.map((d:any)=>[
                  <span style={{fontSize:'13px',color:'#ccc',fontWeight:500}}>{d.name||'—'}</span>,
                  <span style={{fontSize:'13px',fontWeight:600,color:'#00e676'}}>R${Number(d.amount).toFixed(2)}</span>,
                  <StatusBadge status={d.status}/>,
                  <span style={{fontSize:'11px',color:'#555'}}>{new Date(d.created_at).toLocaleDateString('pt-BR')}</span>,
                  <div style={{display:'flex',gap:'5px'}}>
                    {d.status==='pending'&&<SmBtn color="green" onClick={()=>askConfirm('Aprovar este deposito?',async()=>{const r=await api(`/api/admin/deposits/${d.id}/approve`,'PUT',{});if(r.success){showToast('Aprovado!');load(token)}else showToast(r.error||'Erro','error')})}>Aprovar</SmBtn>}
                    {d.status==='completed'&&<SmBtn color="red" onClick={()=>askConfirm('Estornar este deposito?',async()=>{const r=await api(`/api/admin/deposits/${d.id}/refund`,'PUT',{});if(r.success){showToast('Estornado!');load(token)}else showToast(r.error||'Erro','error')})}>Estornar</SmBtn>}
                  </div>
                ])}
              />
            </div>
          )}

          {/* ─── AUDITORIA ─── */}
          {tab==='audit'&&(
            <div>
              <div style={{marginBottom:'14px'}}>
                <span style={{fontSize:'12px',color:'#555'}}>{audit.length} registros no log</span>
              </div>
              <DataTable
                loading={loading}
                cols={['Admin','Acao','IP','Data/Hora']}
                rows={audit.map((a:any)=>[
                  <span style={{fontSize:'13px',color:'#ccc',fontWeight:500}}>{a.name||'—'}</span>,
                  <span style={{background:'rgba(99,102,241,0.1)',color:'#818cf8',fontSize:'11px',fontWeight:600,padding:'2px 8px',borderRadius:'4px'}}>{a.action}</span>,
                  <span style={{fontSize:'11px',color:'#555',fontFamily:'monospace'}}>{a.ip||'—'}</span>,
                  <span style={{fontSize:'11px',color:'#555'}}>{new Date(a.created_at).toLocaleString('pt-BR')}</span>,
                ])}
              />
            </div>
          )}

          {/* ─── CONFIGURACOES ─── */}
          {tab==='configs'&&(
            <div style={{maxWidth:'500px'}}>
              <FormCard>
                <p style={{fontSize:'12px',fontWeight:600,color:'#ccc',marginBottom:'16px',textTransform:'uppercase',letterSpacing:'0.08em'}}>Parametros Financeiros</p>
                <form onSubmit={saveSettings} style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                  {[
                    {key:'taxa_vitoria',label:'Taxa de vitoria (%)'},
                    {key:'taxa_deposito',label:'Taxa de deposito (%)'},
                    {key:'taxa_saque',label:'Taxa de saque (%)'},
                    {key:'saque_minimo',label:'Saque minimo (R$)'},
                    {key:'saque_maximo',label:'Saque maximo (R$)'},
                    {key:'saque_diario',label:'Limite saque diario (R$)'},
                    {key:'rollover',label:'Rollover base (multiplicador)'},
                  ].map(f=>(
                    <div key={f.key} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 0',borderBottom:'1px solid #1a1a1a'}}>
                      <label style={{fontSize:'12px',color:'#777',flex:1}}>{f.label}</label>
                      <FormInput type="number" step="0.01" value={settings[f.key]||''} style={{width:'120px',color:'#00e676',fontWeight:700,textAlign:'right'}} onChange={(e:any)=>setSettings({...settings,[f.key]:e.target.value})}/>
                    </div>
                  ))}
                  <button type="submit" style={{background:'#00e676',color:'#000',border:'none',borderRadius:'8px',padding:'12px',fontWeight:700,fontSize:'14px',cursor:'pointer',marginTop:'8px',transition:'opacity 0.15s'}}
                    onMouseEnter={(e:any)=>e.target.style.opacity='0.85'} onMouseLeave={(e:any)=>e.target.style.opacity='1'}>
                    SALVAR CONFIGURACOES
                  </button>
                </form>
              </FormCard>
            </div>
          )}
        </main>
      </div>

      {/* ─── MODAL EDITAR MERCADO ─── */}
      {editMarket&&(
        <Overlay onClose={()=>setEditMarket(null)}>
          <ModalBox title="Editar Mercado" onClose={()=>setEditMarket(null)}>
            <FormField label="Pergunta"><FormInput value={editMarket.question} onChange={(e:any)=>setEditMarket({...editMarket,question:e.target.value})}/></FormField>
            <FormField label="Categoria">
              <FormSelect value={editMarket.category||''} onChange={(e:any)=>setEditMarket({...editMarket,category:e.target.value})}>
                {CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </FormSelect>
            </FormField>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              <FormField label="% SIM"><FormInput type="number" min="1" max="99" style={{color:'#00e676',fontWeight:700}} value={editMarket.yes_odds} onChange={(e:any)=>setEditMarket({...editMarket,yes_odds:e.target.value,no_odds:100-Number(e.target.value)})}/></FormField>
              <FormField label="% NAO"><FormInput type="number" min="1" max="99" style={{color:'#f44336',fontWeight:700}} value={editMarket.no_odds} onChange={(e:any)=>setEditMarket({...editMarket,no_odds:e.target.value,yes_odds:100-Number(e.target.value)})}/></FormField>
            </div>
            <FormField label="Data encerramento"><FormInput type="datetime-local" value={editMarket.expires_at?String(editMarket.expires_at).slice(0,16):''} onChange={(e:any)=>setEditMarket({...editMarket,expires_at:e.target.value})}/></FormField>
            <FormField label="Status">
              <FormSelect value={editMarket.status} onChange={(e:any)=>setEditMarket({...editMarket,status:e.target.value})}>
                {['open','suspended','resolved','cancelled'].map(s=><option key={s} value={s}>{s}</option>)}
              </FormSelect>
            </FormField>
            <div style={{display:'flex',gap:'8px',paddingTop:'8px'}}>
              <ActionBtn color="green" onClick={saveMarket}>SALVAR ALTERACOES</ActionBtn>
              <ActionBtn onClick={()=>setEditMarket(null)}>Cancelar</ActionBtn>
            </div>
          </ModalBox>
        </Overlay>
      )}

      {/* ─── MODAL EDITAR USUARIO ─── */}
      {editUser&&(
        <Overlay onClose={()=>setEditUser(null)}>
          <ModalBox title="Editar Usuario" onClose={()=>setEditUser(null)}>
            <FormField label="Nome"><FormInput value={editUser.name} onChange={(e:any)=>setEditUser({...editUser,name:e.target.value})}/></FormField>
            <FormField label="Email"><FormInput value={editUser.email} onChange={(e:any)=>setEditUser({...editUser,email:e.target.value})}/></FormField>
            <FormField label="Status">
              <FormSelect value={editUser.status||'active'} onChange={(e:any)=>setEditUser({...editUser,status:e.target.value})}>
                {['active','blocked','suspended'].map(s=><option key={s} value={s}>{s}</option>)}
              </FormSelect>
            </FormField>
            <div style={{display:'flex',gap:'8px',paddingTop:'8px'}}>
              <ActionBtn color="green" onClick={saveUser}>SALVAR ALTERACOES</ActionBtn>
              <ActionBtn onClick={()=>setEditUser(null)}>Cancelar</ActionBtn>
            </div>
          </ModalBox>
        </Overlay>
      )}

      {/* ─── MODAL SALDO ─── */}
      {balanceModal&&(
        <Overlay onClose={()=>setBalanceModal(null)}>
          <ModalBox title={`Ajustar Saldo · ${balanceModal.name}`} onClose={()=>setBalanceModal(null)}>
            <p style={{fontSize:'12px',color:'#555',marginBottom:'4px'}}>Use valor negativo para remover saldo do usuario.</p>
            <FormField label="Valor (R$)"><FormInput type="number" step="0.01" placeholder="Ex: 100.00 ou -50.00" value={balanceModal.amount} onChange={(e:any)=>setBalanceModal({...balanceModal,amount:e.target.value})}/></FormField>
            <FormField label="Motivo / Observacao"><FormInput placeholder="Ex: Bonus de cadastro" value={balanceModal.note} onChange={(e:any)=>setBalanceModal({...balanceModal,note:e.target.value})}/></FormField>
            <div style={{display:'flex',gap:'8px',paddingTop:'8px'}}>
              <ActionBtn color="green" onClick={()=>askConfirm(`Ajustar saldo de ${balanceModal.name} em R$ ${balanceModal.amount}?`,adjustBalance)}>AJUSTAR SALDO</ActionBtn>
              <ActionBtn onClick={()=>setBalanceModal(null)}>Cancelar</ActionBtn>
            </div>
          </ModalBox>
        </Overlay>
      )}

      {/* ─── MODAL CONFIRMACAO ─── */}
      {confirm&&(
        <Overlay onClose={()=>setConfirm(null)}>
          <div style={{background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:'14px',padding:'28px 24px',maxWidth:'380px',width:'100%',textAlign:'center'}}>
            <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'rgba(255,179,0,0.1)',border:'1px solid rgba(255,179,0,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
              <svg width="20" height="20" fill="none" stroke="#ffb300" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <p style={{fontSize:'14px',color:'#ccc',lineHeight:1.6,marginBottom:'6px'}}>{confirm.msg}</p>
            <p style={{fontSize:'11px',color:'#444',marginBottom:'22px'}}>Esta acao sera registrada automaticamente na auditoria.</p>
            <div style={{display:'flex',gap:'8px'}}>
              <button onClick={async()=>{await confirm.action();setConfirm(null)}} style={{flex:1,background:'#00e676',color:'#000',border:'none',borderRadius:'8px',padding:'11px',fontWeight:700,fontSize:'13px',cursor:'pointer'}}>
                Confirmar
              </button>
              <button onClick={()=>setConfirm(null)} style={{flex:1,background:'transparent',color:'#666',border:'1px solid #2a2a2a',borderRadius:'8px',padding:'11px',fontSize:'13px',cursor:'pointer'}}>
                Cancelar
              </button>
            </div>
          </div>
        </Overlay>
      )}

      {/* ─── SEARCH MODAL ─── */}
      {searchOpen&&(
        <Overlay onClose={()=>setSearchOpen(false)}>
          <div style={{background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:'12px',width:'100%',maxWidth:'480px',overflow:'hidden'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'14px 16px',borderBottom:'1px solid #222'}}>
              <svg width="16" height="16" fill="none" stroke="#555" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input autoFocus placeholder="Navegar para..." style={{flex:1,background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'14px'}} onKeyDown={(e:any)=>{if(e.key==='Escape')setSearchOpen(false)}}/>
              <span style={{fontSize:'11px',color:'#444',background:'#222',padding:'2px 6px',borderRadius:'4px'}}>ESC</span>
            </div>
            <div style={{padding:'8px'}}>
              {NAV_SECTIONS.flatMap(s=>s.items).map(item=>(
                <button key={item.id} onClick={()=>{setTab(item.id);setSearchOpen(false)}} style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',border:'none',background:'transparent',cursor:'pointer',borderRadius:'7px',color:'#888',fontSize:'13px',textAlign:'left',transition:'all 0.1s'}}
                  onMouseEnter={(e:any)=>{e.currentTarget.style.background='#222';e.currentTarget.style.color='#fff'}}
                  onMouseLeave={(e:any)=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#888'}}>
                  <span style={{opacity:0.5}}>{ICONS[item.icon]}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </Overlay>
      )}

      {/* ─── TOAST ─── */}
      {toast&&(
        <div style={{position:'fixed',bottom:'20px',right:'20px',zIndex:999,animation:'toastIn 0.2s ease',display:'flex',alignItems:'center',gap:'10px',background:toast.type==='error'?'#1a0a0a':'#0a1a0f',border:`1px solid ${toast.type==='error'?'rgba(244,67,54,0.3)':'rgba(0,230,118,0.25)'}`,borderRadius:'10px',padding:'12px 16px',maxWidth:'320px',boxShadow:'0 8px 32px rgba(0,0,0,0.5)'}}>
          <div style={{width:'6px',height:'6px',borderRadius:'50%',background:toast.type==='error'?'#f44336':'#00e676',flexShrink:0}}/>
          <span style={{fontSize:'13px',color:toast.type==='error'?'#f44336':'#00e676',fontWeight:500}}>{toast.text}</span>
        </div>
      )}
    </div>
  )
}

function StatusBadge({status}:{status:string}) {
  const map:any={
    open:{bg:'rgba(0,230,118,0.08)',color:'#00e676',border:'rgba(0,230,118,0.2)'},
    active:{bg:'rgba(0,230,118,0.08)',color:'#00e676',border:'rgba(0,230,118,0.2)'},
    completed:{bg:'rgba(0,230,118,0.08)',color:'#00e676',border:'rgba(0,230,118,0.2)'},
    paid:{bg:'rgba(0,230,118,0.08)',color:'#00e676',border:'rgba(0,230,118,0.2)'},
    resolved:{bg:'rgba(99,102,241,0.08)',color:'#818cf8',border:'rgba(99,102,241,0.2)'},
    admin:{bg:'rgba(99,102,241,0.08)',color:'#818cf8',border:'rgba(99,102,241,0.2)'},
    pending:{bg:'rgba(255,179,0,0.08)',color:'#ffb300',border:'rgba(255,179,0,0.2)'},
    processing:{bg:'rgba(255,179,0,0.08)',color:'#ffb300',border:'rgba(255,179,0,0.2)'},
    suspended:{bg:'rgba(255,179,0,0.08)',color:'#ffb300',border:'rgba(255,179,0,0.2)'},
    cancelled:{bg:'rgba(244,67,54,0.08)',color:'#f44336',border:'rgba(244,67,54,0.2)'},
    blocked:{bg:'rgba(244,67,54,0.08)',color:'#f44336',border:'rgba(244,67,54,0.2)'},
    rejected:{bg:'rgba(244,67,54,0.08)',color:'#f44336',border:'rgba(244,67,54,0.2)'},
    refunded:{bg:'rgba(244,67,54,0.08)',color:'#f44336',border:'rgba(244,67,54,0.2)'},
    user:{bg:'rgba(255,255,255,0.04)',color:'#555',border:'rgba(255,255,255,0.08)'},
  }
  const st=map[status]||{bg:'rgba(255,255,255,0.04)',color:'#555',border:'rgba(255,255,255,0.08)'}
  return <span style={{display:'inline-block',padding:'2px 8px',borderRadius:'5px',fontSize:'11px',fontWeight:600,background:st.bg,color:st.color,border:`1px solid ${st.border}`}}>{status}</span>
}

function DataTable({cols,rows,loading}:{cols:string[],rows:any[][],loading:boolean}) {
  if (loading) return (
    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
      {Array(5).fill(0).map((_,i)=><div key={i} className="skel" style={{height:'42px'}}/>)}
    </div>
  )
  if (!rows.length) return (
    <div style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'12px',padding:'48px',textAlign:'center'}}>
      <p style={{color:'#444',fontSize:'13px'}}>Nenhum registro encontrado.</p>
    </div>
  )
  return (
    <div style={{overflowX:'auto',borderRadius:'12px',border:'1px solid #1e1e1e'}}>
      <table style={{width:'100%',borderCollapse:'collapse',background:'#1a1a1a'}}>
        <thead>
          <tr style={{background:'#141414'}}>
            {cols.map(c=><th key={c} style={{textAlign:'left',padding:'10px 14px',fontSize:'10px',fontWeight:700,color:'#444',textTransform:'uppercase',letterSpacing:'0.1em',borderBottom:'1px solid #1e1e1e',whiteSpace:'nowrap'}}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row,i)=>(
            <tr key={i} className="trow" style={{borderBottom:'1px solid #1e1e1e'}}>
              {row.map((cell,j)=><td key={j} style={{padding:'10px 14px',verticalAlign:'middle'}}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Overlay({children,onClose}:{children:any,onClose:()=>void}) {
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(4px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      {children}
    </div>
  )
}

function ModalBox({title,onClose,children}:{title:string,onClose:()=>void,children:any}) {
  return (
    <div style={{background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:'14px',padding:'24px',width:'100%',maxWidth:'480px',maxHeight:'90vh',overflowY:'auto'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
        <h3 style={{fontSize:'15px',fontWeight:600,color:'#fff'}}>{title}</h3>
        <button onClick={onClose} style={{background:'#222',border:'none',cursor:'pointer',color:'#666',width:'28px',height:'28px',borderRadius:'7px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',transition:'all 0.12s'}}
          onMouseEnter={(e:any)=>e.currentTarget.style.background='#2a2a2a'} onMouseLeave={(e:any)=>e.currentTarget.style.background='#222'}>×</button>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>{children}</div>
    </div>
  )
}

function FormCard({children}:{children:any}) {
  return <div style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'12px',padding:'20px'}}>{children}</div>
}

function FormField({label,children}:{label:string,children:any}) {
  return (
    <div>
      <label style={{fontSize:'10px',color:'#444',display:'block',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:600}}>{label}</label>
      {children}
    </div>
  )
}

function FormInput({style,...props}:any) {
  return <input {...props} style={{width:'100%',background:'#141414',border:'1px solid #222',borderRadius:'7px',padding:'9px 12px',color:'#ccc',fontSize:'13px',outline:'none',transition:'border-color 0.15s',...style}} onFocus={(e:any)=>e.target.style.borderColor='#00e676'} onBlur={(e:any)=>e.target.style.borderColor='#222'}/>
}

function FormSelect({style,...props}:any) {
  return <select {...props} style={{width:'100%',background:'#141414',border:'1px solid #222',borderRadius:'7px',padding:'9px 12px',color:'#ccc',fontSize:'13px',outline:'none',...style}}/>
}

function ActionBtn({children,onClick,color='gray'}:{children:any,onClick:()=>void,color?:string}) {
  const map:any={
    green:{background:'#00e676',color:'#000',border:'none'},
    red:{background:'rgba(244,67,54,0.1)',color:'#f44336',border:'1px solid rgba(244,67,54,0.2)'},
    gray:{background:'transparent',color:'#666',border:'1px solid #2a2a2a'},
  }
  return <button onClick={onClick} className="action-btn" style={{padding:'9px 18px',borderRadius:'8px',cursor:'pointer',fontSize:'13px',fontWeight:color==='green'?700:500,...map[color],transition:'opacity 0.15s'}}>{children}</button>
}

function SmBtn({children,onClick,color='gray'}:{children:any,onClick:()=>void,color?:string}) {
  const map:any={
    green:{background:'rgba(0,230,118,0.08)',color:'#00e676',border:'1px solid rgba(0,230,118,0.15)'},
    red:{background:'rgba(244,67,54,0.08)',color:'#f44336',border:'1px solid rgba(244,67,54,0.15)'},
    gray:{background:'rgba(255,255,255,0.04)',color:'#666',border:'1px solid #222'},
  }
  return <button onClick={onClick} style={{padding:'4px 10px',borderRadius:'5px',cursor:'pointer',fontSize:'11px',fontWeight:600,...map[color],transition:'all 0.12s'}}>{children}</button>
}
