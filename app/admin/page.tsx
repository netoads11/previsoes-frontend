'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { LayoutDashboard, BarChart3, Shield, Settings, Users, UserCog, Wallet, ArrowDownToLine, ArrowUpFromLine, UserCheck, FileText, History, Calendar, TrendingUp, Palette, Image, LogOut, ChevronDown, Search, ExternalLink, Bell, DollarSign, QrCode, UserPlus, Briefcase, ChevronLeft, ChevronRight, AlertTriangle, X, Check, Edit, Plus } from 'lucide-react'

const API = 'http://187.77.248.115:3001'

const NAV_SECTIONS = [
  { title: 'Principal', items: [
    { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { label: 'Métricas', icon: BarChart3, id: 'metricas' },
    { label: 'Auditoria', icon: Shield, id: 'audit' },
    { label: 'Configurações', icon: Settings, id: 'configs' },
  ]},
  { title: 'Gerenciamento', items: [
    { label: 'Admins', icon: UserCog, id: 'admins' },
    { label: 'Usuários', icon: Users, id: 'users' },
  ]},
  { title: 'Financeiro', items: [
    { label: 'Saques', icon: ArrowUpFromLine, id: 'withdrawals' },
    { label: 'Depósitos', icon: ArrowDownToLine, id: 'deposits' },
  ]},
  { title: 'Área de Afiliados', items: [
    { label: 'Afiliados', icon: UserCheck, id: 'afiliados' },
    { label: 'Saques Afiliados', icon: Wallet, id: 'saques-afiliados' },
    { label: 'Relatório', icon: FileText, id: 'relatorio' },
  ]},
  { title: 'Operacional', items: [
    { label: 'Histórico', icon: History, id: 'historico' },
    { label: 'Eventos', icon: Calendar, id: 'eventos' },
    { label: 'Mercados', icon: TrendingUp, id: 'markets' },
  ]},
  { title: 'Customização', items: [
    { label: 'Estilo', icon: Palette, id: 'estilo' },
    { label: 'Banners', icon: Image, id: 'banners' },
  ]},
]

const CHART_DATA = [
  { date:'18/03', lucro:4200, depositos:8500, saques:4300 },
  { date:'19/03', lucro:3800, depositos:7200, saques:3400 },
  { date:'20/03', lucro:5100, depositos:9800, saques:4700 },
  { date:'21/03', lucro:4600, depositos:8100, saques:3500 },
  { date:'22/03', lucro:6200, depositos:11200, saques:5000 },
  { date:'23/03', lucro:5800, depositos:10500, saques:4700 },
  { date:'24/03', lucro:7100, depositos:12800, saques:5700 },
]

const CATS = ['Entretenimento','Criptomoedas','Financeiro','Esportes','Politica','Clima','Celebridades']

export default function Admin() {
  const router = useRouter()
  const [tab, setTab] = useState('dashboard')
  const [token, setToken] = useState('')
  const [adminName, setAdminName] = useState('SA')
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
  const [openSections, setOpenSections] = useState<any>({Principal:true,Gerenciamento:true,Financeiro:true,'Área de Afiliados':true,Operacional:true,Customização:true})
  const [chartPeriod, setChartPeriod] = useState('7d')
  const [newMarket, setNewMarket] = useState({question:'',category:'Financeiro',yes_odds:'50',no_odds:'50',expires_at:''})
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSearch, setFilterSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('user'), t = localStorage.getItem('token')
    if (!u||!t) { router.push('/login'); return }
    const p = JSON.parse(u)
    if (!p.is_admin) { router.push('/'); return }
    setAdminName(p.name?.slice(0,2).toUpperCase()||'SA')
    setToken(t); load(t)
    const k = (e: KeyboardEvent) => { if ((e.ctrlKey||e.metaKey)&&e.key==='k') { e.preventDefault(); setSearchOpen(s=>!s) } }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
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
    setMarkets(Array.isArray(m)?m:[]);setUsers(Array.isArray(u)?u:[])
    setDeposits(Array.isArray(d)?d:[]);setWithdrawals(Array.isArray(w)?w:[])
    setAudit(Array.isArray(a)?a:[]);setSettings(s||{});setLoading(false)
  }

  function showToast(text: string, type='success') { setToast({text,type}); setTimeout(()=>setToast(null),3500) }

  async function api(url: string, method='GET', body?: any) {
    const r = await fetch(API+url,{method,headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:body?JSON.stringify(body):undefined})
    return r.json()
  }

  async function createMarket(e: any) {
    e.preventDefault()
    const r = await api('/api/admin/markets','POST',{...newMarket,yes_odds:Number(newMarket.yes_odds),no_odds:Number(newMarket.no_odds),expires_at:newMarket.expires_at||null})
    if (r.id) { showToast('Mercado criado!'); setNewMarket({question:'',category:'Financeiro',yes_odds:'50',no_odds:'50',expires_at:''}); load(token) } else showToast(r.error||'Erro','error')
  }
  async function saveMarket() { const r = await api(`/api/admin/markets/${editMarket.id}`,'PUT',editMarket); if(r.id){showToast('Salvo!');setEditMarket(null);load(token)}else showToast(r.error||'Erro','error') }
  async function saveUser() { const r = await api(`/api/admin/users/${editUser.id}`,'PUT',editUser); if(r.id){showToast('Salvo!');setEditUser(null);load(token)}else showToast(r.error||'Erro','error') }
  async function adjBalance() { const r = await api(`/api/admin/users/${balanceModal.id}/balance`,'POST',{amount:Number(balanceModal.amount),note:balanceModal.note}); if(r.success){showToast('Saldo ajustado!');setBalanceModal(null);load(token)}else showToast(r.error||'Erro','error') }
  async function saveSettings(e: any) { e.preventDefault(); const r = await api('/api/admin/settings','PUT',settings); if(r.success){showToast('Configurações salvas!')}else{showToast(r.error||'Erro','error')} }

  const totalDep = deposits.filter((d:any)=>d.status==='completed').reduce((a:number,d:any)=>a+Number(d.amount),0)
  const totalWith = withdrawals.filter((w:any)=>w.status==='completed'||w.status==='paid').reduce((a:number,w:any)=>a+Number(w.amount),0)
  const lucro = totalDep - totalWith
  const fmt = (n: number) => `R$ ${n.toLocaleString('pt-BR',{minimumFractionDigits:2})}`

  const currentLabel = NAV_SECTIONS.flatMap(s=>s.items).find(i=>i.id===tab)?.label||'Dashboard'

  const filteredUsers = users.filter((u:any) => (!filterStatus||(u.status||'active')===filterStatus) && (!filterSearch||u.name?.toLowerCase().includes(filterSearch.toLowerCase())||u.email?.toLowerCase().includes(filterSearch.toLowerCase())))
  const filteredMarkets = markets.filter((m:any) => (!filterStatus||m.status===filterStatus) && (!filterSearch||m.question?.toLowerCase().includes(filterSearch.toLowerCase())))
  const filteredWithdrawals = withdrawals.filter((w:any) => (!filterStatus||w.status===filterStatus) && (!filterSearch||w.name?.toLowerCase().includes(filterSearch.toLowerCase())))
  const filteredDeposits = deposits.filter((d:any) => (!filterStatus||d.status===filterStatus) && (!filterSearch||d.name?.toLowerCase().includes(filterSearch.toLowerCase())))

  const V = {
    bg: '#0f0f0f',
    sidebar: '#111',
    card: '#1a1a1a',
    hover: '#222',
    border: '#222',
    green: '#00e676',
    red: '#f44336',
    yellow: '#ffb300',
    blue: '#3b82f6',
    text: '#fff',
    muted: '#888',
    label: '#555',
  }

  return (
    <div style={{display:'flex',minHeight:'100vh',background:V.bg,color:V.text,fontFamily:"'Inter',system-ui,sans-serif",fontSize:'14px'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input,select,textarea,button{font-family:inherit;font-size:13px}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#0f0f0f}
        ::-webkit-scrollbar-thumb{background:#222;border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:#333}
        .nav-item:hover{background:#1a1a1a!important;color:#fff!important}
        .trow:hover td{background:#1a1a1a!important}
        .metric-card:hover{background:#1f1f1f!important}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .skel{background:linear-gradient(90deg,#1a1a1a 25%,#222 50%,#1a1a1a 75%);background-size:200% 100%;animation:shimmer 1.6s ease infinite;border-radius:8px}
        .fade-in{animation:fadeIn 0.2s ease}
        .section-toggle{transition:transform 0.2s}
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{width:'240px',flexShrink:0,background:V.sidebar,borderRight:`1px solid ${V.border}`,display:'flex',flexDirection:'column',position:'fixed',top:0,left:0,height:'100vh',zIndex:40,overflowY:'auto'}}>
        {/* Logo */}
        <div style={{padding:'16px',borderBottom:`1px solid ${V.border}`,display:'flex',alignItems:'center',gap:'10px',height:'56px',flexShrink:0}}>
          <div style={{width:'32px',height:'32px',borderRadius:'8px',background:V.green,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <TrendingUp size={16} color="#000" strokeWidth={2.5}/>
          </div>
          <span style={{fontWeight:700,fontSize:'14px',color:V.text}}>Admin Panel</span>
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:'8px 12px',overflowY:'auto'}}>
          {NAV_SECTIONS.map(section => (
            <div key={section.title} style={{marginBottom:'4px'}}>
              <button onClick={()=>setOpenSections((p:any)=>({...p,[section.title]:!p[section.title]}))}
                style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 8px',background:'none',border:'none',cursor:'pointer',color:V.label,marginTop:'8px'}}>
                <span style={{fontSize:'10px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.12em'}}>{section.title}</span>
                <ChevronDown size={12} color={V.label} style={{transform:openSections[section.title]?'rotate(180deg)':'none',transition:'transform 0.2s'}}/>
              </button>
              {openSections[section.title] && section.items.map(item => {
                const active = tab === item.id
                return (
                  <button key={item.id} onClick={()=>{setTab(item.id);setFilterStatus('');setFilterSearch('');setPage(1)}} className="nav-item"
                    style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'8px 10px',borderRadius:'6px',border:'none',cursor:'pointer',background:active?`${V.green}15`:'transparent',color:active?V.green:V.muted,fontSize:'13px',fontWeight:active?600:400,textAlign:'left',marginBottom:'2px',position:'relative',transition:'all 0.1s'}}>
                    {active && <span style={{position:'absolute',left:0,top:'50%',transform:'translateY(-50%)',width:'3px',height:'20px',background:V.green,borderRadius:'0 2px 2px 0'}}/>}
                    <item.icon size={15} strokeWidth={1.75} style={{flexShrink:0}}/>
                    {item.label}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{padding:'12px',borderTop:`1px solid ${V.border}`,flexShrink:0}}>
          <button onClick={()=>{localStorage.clear();router.push('/')}} className="nav-item"
            style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'8px 10px',borderRadius:'6px',border:'none',cursor:'pointer',background:'transparent',color:V.muted,fontSize:'13px',textAlign:'left',transition:'all 0.1s'}}>
            <LogOut size={15} strokeWidth={1.75}/> Sair
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{marginLeft:'240px',flex:1,display:'flex',flexDirection:'column',minWidth:0}}>

        {/* HEADER */}
        <header style={{position:'sticky',top:0,zIndex:30,height:'56px',background:`${V.bg}cc`,backdropFilter:'blur(12px)',borderBottom:`1px solid ${V.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{position:'relative'}}>
              <Search size={15} color={V.muted} style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
              <input placeholder="Buscar... (Ctrl+K)" onClick={()=>setSearchOpen(true)} readOnly
                style={{width:'240px',height:'36px',background:V.card,border:`1px solid ${V.border}`,borderRadius:'8px',padding:'0 12px 0 34px',color:V.muted,cursor:'pointer',outline:'none'}}/>
              <kbd style={{position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)',background:V.hover,border:`1px solid #333`,borderRadius:'4px',padding:'1px 5px',fontSize:'10px',color:V.label}}>Ctrl+K</kbd>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <a href="/" target="_blank" style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 12px',borderRadius:'8px',border:`1px solid ${V.border}`,color:V.muted,fontSize:'12px',textDecoration:'none',background:'transparent',transition:'all 0.1s'}}>
              <ExternalLink size={13}/> Ver Site
            </a>
            <button style={{position:'relative',width:'36px',height:'36px',borderRadius:'8px',border:`1px solid ${V.border}`,background:'transparent',cursor:'pointer',color:V.muted,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Bell size={15}/>
              <span style={{position:'absolute',top:'8px',right:'8px',width:'6px',height:'6px',borderRadius:'50%',background:V.green}}/>
            </button>
            <div style={{width:'32px',height:'32px',borderRadius:'50%',background:V.green,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <span style={{color:'#000',fontWeight:700,fontSize:'11px'}}>{adminName}</span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main style={{flex:1,padding:'24px',overflowY:'auto'}}>

          {/* ═══ DASHBOARD ═══ */}
          {tab==='dashboard' && (
            <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:'24px'}}>
              <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Dashboard</h1>

              {loading ? (
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px'}}>
                  {Array(16).fill(0).map((_,i)=><div key={i} className="skel" style={{height:'88px'}}/>)}
                </div>
              ) : (
                <>
                  {/* ROW 1 */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px'}}>
                    <MCard title="Usuários Cadastrados" value={users.length.toLocaleString()} sub={`${users.filter((u:any)=>u.status!=='blocked').length} ativos`} icon={Users} color="blue"/>
                    <MCard title="Saldo dos Jogadores" value={fmt(totalDep)} sub={`${deposits.filter((d:any)=>d.status==='completed').length} com saldo`} icon={Wallet} color="green"/>
                    <MCard title="Saldo do Portfólio" value={fmt(lucro)} sub="Valor investido" icon={Briefcase} color="green"/>
                    <MCard title="Mercados Ativos" value={markets.filter((m:any)=>m.status==='open').length.toString()} sub={`${markets.length} total`} icon={TrendingUp} color="green"/>
                  </div>
                  {/* ROW 2 */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px'}}>
                    <MCard title="Depósitos Hoje" value={fmt(totalDep)} sub={`${deposits.length} pagamentos`} icon={ArrowDownToLine} color="green"/>
                    <MCard title="Saques Hoje" value={fmt(totalWith)} sub={`${withdrawals.length} pagamentos`} icon={ArrowUpFromLine} color="red"/>
                    <MCard title="Pix Gerados Hoje" value={deposits.length.toString()} sub="—% pagos" icon={QrCode} color="green"/>
                    <MCard title="Usuários Hoje" value={users.length.toString()} sub="—% depositaram" icon={UserPlus} color="blue"/>
                  </div>
                  {/* ROW 3 */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px'}}>
                    <MCard title="Depósitos Total" value={fmt(totalDep)} sub={`${deposits.filter((d:any)=>d.status==='completed').length} recebidos`} icon={ArrowDownToLine} color="green"/>
                    <MCard title="Saques Total" value={fmt(totalWith)} sub={`${withdrawals.filter((w:any)=>w.status==='paid').length} aprovados`} icon={ArrowUpFromLine} color="red"/>
                    <MCard title="Pix Gerados Total" value={deposits.length.toString()} sub="—% conversão" icon={QrCode} color="blue"/>
                    <MCard title="Lucro Total" value={fmt(lucro)} sub="Lucro acumulado" icon={DollarSign} color="green"/>
                  </div>
                  {/* ROW 4 */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px'}}>
                    <MCard title="Saques Usuários Geral" value={fmt(totalWith)} sub={`${withdrawals.length} aprovados`} icon={Wallet} color="green"/>
                    <MCard title="Saques Usuários Hoje" value={fmt(totalWith)} sub="hoje" icon={Wallet} color="yellow"/>
                    <MCard title="Saques Afiliados Geral" value="R$ 0,00" sub="0 aprovados" icon={Wallet} color="green"/>
                    <MCard title="Saques Afiliados Hoje" value="R$ 0,00" sub="0 hoje" icon={Wallet} color="yellow"/>
                  </div>

                  {/* CHARTS */}
                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    {['7d','30d','90d'].map(p=>(
                      <button key={p} onClick={()=>setChartPeriod(p)} style={{padding:'5px 14px',borderRadius:'6px',border:`1px solid ${chartPeriod===p?V.green:V.border}`,background:chartPeriod===p?`${V.green}15`:'transparent',color:chartPeriod===p?V.green:V.muted,fontSize:'12px',cursor:'pointer',fontWeight:chartPeriod===p?600:400,transition:'all 0.15s'}}>
                        {p}
                      </button>
                    ))}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
                    <div style={{background:V.card,borderRadius:'12px',border:`1px solid ${V.border}`,padding:'20px'}}>
                      <h3 style={{fontSize:'14px',fontWeight:600,marginBottom:'16px'}}>Lucros</h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={CHART_DATA}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f"/>
                          <XAxis dataKey="date" tick={{fill:V.muted,fontSize:11}} stroke="#1f1f1f"/>
                          <YAxis tick={{fill:V.muted,fontSize:11}} stroke="#1f1f1f"/>
                          <Tooltip contentStyle={{background:V.card,border:`1px solid ${V.border}`,borderRadius:'8px',fontSize:12}}/>
                          <Line type="monotone" dataKey="lucro" stroke={V.green} strokeWidth={2} dot={false}/>
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{background:V.card,borderRadius:'12px',border:`1px solid ${V.border}`,padding:'20px'}}>
                      <h3 style={{fontSize:'14px',fontWeight:600,marginBottom:'16px'}}>Depósitos e Saques</h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={CHART_DATA}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f"/>
                          <XAxis dataKey="date" tick={{fill:V.muted,fontSize:11}} stroke="#1f1f1f"/>
                          <YAxis tick={{fill:V.muted,fontSize:11}} stroke="#1f1f1f"/>
                          <Tooltip contentStyle={{background:V.card,border:`1px solid ${V.border}`,borderRadius:'8px',fontSize:12}}/>
                          <Legend wrapperStyle={{fontSize:11,color:V.muted}}/>
                          <Line type="monotone" dataKey="depositos" name="Depósitos" stroke={V.green} strokeWidth={2} dot={false}/>
                          <Line type="monotone" dataKey="saques" name="Saques" stroke={V.red} strokeWidth={2} dot={false}/>
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ═══ MERCADOS ═══ */}
          {tab==='markets' && (
            <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Mercados</h1>
                <PrimaryBtn onClick={()=>setTab('criar-mercado')}><Plus size={14}/> Criar Mercado</PrimaryBtn>
              </div>
              <FilterRow search={filterSearch} onSearch={setFilterSearch} status={filterStatus} onStatus={setFilterStatus} statusOpts={['open','suspended','resolved','cancelled']}/>
              <DataTbl loading={loading}
                cols={['Pergunta','Categoria','SIM%','NAO%','Status','Encerra','Ações']}
                rows={filteredMarkets.map((m:any)=>[
                  <span style={{color:'#ccc',fontSize:'13px',maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',display:'block'}}>{m.question}</span>,
                  <span style={{color:V.muted,fontSize:'12px'}}>{m.category||'—'}</span>,
                  <span style={{color:V.green,fontWeight:600,fontSize:'12px'}}>{m.yes_odds}%</span>,
                  <span style={{color:V.red,fontWeight:600,fontSize:'12px'}}>{m.no_odds}%</span>,
                  <SBadge status={m.status}/>,
                  <span style={{color:V.muted,fontSize:'11px'}}>{m.expires_at?new Date(m.expires_at).toLocaleDateString('pt-BR'):'—'}</span>,
                  <div style={{display:'flex',gap:'5px'}}>
                    <GhostBtn onClick={()=>setEditMarket({...m})}>Editar</GhostBtn>
                    {m.status==='open'&&<>
                      <GhostBtn color="green" onClick={()=>setConfirm({msg:'Resolver como SIM?',action:async()=>{const r=await api(`/api/admin/markets/${m.id}/resolve`,'PUT',{result:'yes'});if(r.success){showToast('Resolvido!');load(token)}else showToast(r.error,'error')}})}>SIM</GhostBtn>
                      <GhostBtn color="red" onClick={()=>setConfirm({msg:'Resolver como NAO?',action:async()=>{const r=await api(`/api/admin/markets/${m.id}/resolve`,'PUT',{result:'no'});if(r.success){showToast('Resolvido!');load(token)}else showToast(r.error,'error')}})}>NAO</GhostBtn>
                      <GhostBtn color="red" onClick={()=>setConfirm({msg:'Cancelar mercado?',action:async()=>{const r=await api(`/api/admin/markets/${m.id}/cancel`,'PUT',{});if(r.success){showToast('Cancelado!');load(token)}else showToast(r.error,'error')}})}>Cancelar</GhostBtn>
                    </>}
                  </div>
                ])}
                page={page} perPage={perPage} onPage={setPage} onPerPage={setPerPage}
              />
            </div>
          )}

          {/* ═══ CRIAR MERCADO ═══ */}
          {tab==='criar-mercado' && (
            <div className="fade-in" style={{maxWidth:'560px'}}>
              <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif",marginBottom:'20px'}}>Criar Mercado</h1>
              <div style={{background:V.card,borderRadius:'12px',border:`1px solid ${V.border}`,padding:'24px'}}>
                <form onSubmit={createMarket} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                  <FField label="Pergunta *"><FInput value={newMarket.question} onChange={(e:any)=>setNewMarket({...newMarket,question:e.target.value})} placeholder="Ex: Bitcoin vai superar $100k?" required/></FField>
                  <FField label="Categoria"><FSelect value={newMarket.category} onChange={(e:any)=>setNewMarket({...newMarket,category:e.target.value})}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</FSelect></FField>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                    <FField label="Chance SIM (%)"><FInput type="number" min="1" max="99" value={newMarket.yes_odds} style={{color:V.green,fontWeight:600}} onChange={(e:any)=>setNewMarket({...newMarket,yes_odds:e.target.value,no_odds:String(100-Number(e.target.value))})}/></FField>
                    <FField label="Chance NAO (%)"><FInput type="number" min="1" max="99" value={newMarket.no_odds} style={{color:V.red,fontWeight:600}} onChange={(e:any)=>setNewMarket({...newMarket,no_odds:e.target.value,yes_odds:String(100-Number(e.target.value))})}/></FField>
                  </div>
                  <div style={{background:'#141414',borderRadius:'8px',padding:'14px',display:'flex',justifyContent:'space-around'}}>
                    <div style={{textAlign:'center'}}>
                      <p style={{fontSize:'11px',color:V.muted,marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.08em'}}>Mult. SIM</p>
                      <p style={{fontSize:'24px',fontWeight:700,color:V.green,fontFamily:"'Manrope',sans-serif"}}>{(100/Number(newMarket.yes_odds||1)).toFixed(2)}x</p>
                    </div>
                    <div style={{width:'1px',background:V.border}}/>
                    <div style={{textAlign:'center'}}>
                      <p style={{fontSize:'11px',color:V.muted,marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.08em'}}>Mult. NAO</p>
                      <p style={{fontSize:'24px',fontWeight:700,color:V.red,fontFamily:"'Manrope',sans-serif"}}>{(100/Number(newMarket.no_odds||1)).toFixed(2)}x</p>
                    </div>
                  </div>
                  <div style={{height:'4px',borderRadius:'2px',background:V.border,overflow:'hidden'}}>
                    <div style={{height:'100%',background:`linear-gradient(90deg,${V.green},${V.green}60)`,width:`${newMarket.yes_odds}%`,transition:'width 0.3s',borderRadius:'2px'}}/>
                  </div>
                  <FField label="Data de encerramento"><FInput type="datetime-local" value={newMarket.expires_at} onChange={(e:any)=>setNewMarket({...newMarket,expires_at:e.target.value})}/></FField>
                  <PrimaryBtn type="submit">CRIAR MERCADO</PrimaryBtn>
                </form>
              </div>
            </div>
          )}

          {/* ═══ USUARIOS ═══ */}
          {tab==='users' && (
            <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Usuários</h1>
              <FilterRow search={filterSearch} onSearch={setFilterSearch} status={filterStatus} onStatus={setFilterStatus} statusOpts={['active','blocked','suspended']}/>
              <DataTbl loading={loading}
                cols={['Nome','E-mail','Status','Tipo','Cadastro','Ações']}
                rows={filteredUsers.map((u:any)=>[
                  <span style={{fontWeight:500,color:'#ccc'}}>{u.name}</span>,
                  <span style={{color:V.muted,fontSize:'12px'}}>{u.email}</span>,
                  <SBadge status={u.status||'active'}/>,
                  <SBadge status={u.is_admin?'admin':'user'}/>,
                  <span style={{color:V.muted,fontSize:'12px'}}>{new Date(u.created_at).toLocaleDateString('pt-BR')}</span>,
                  <div style={{display:'flex',gap:'5px'}}>
                    <GhostBtn onClick={()=>setEditUser({...u})}>Editar</GhostBtn>
                    <GhostBtn color="green" onClick={()=>setBalanceModal({id:u.id,name:u.name,amount:'',note:''})}>Saldo</GhostBtn>
                  </div>
                ])}
                page={page} perPage={perPage} onPage={setPage} onPerPage={setPerPage}
              />
            </div>
          )}

          {/* ═══ SAQUES ═══ */}
          {tab==='withdrawals' && (
            <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Saques</h1>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px'}}>
                <MCard title="Pendentes" value={withdrawals.filter((w:any)=>w.status==='pending').length.toString()} sub="Aguardando aprovação" icon={ArrowUpFromLine} color="yellow"/>
                <MCard title="Pagos" value={withdrawals.filter((w:any)=>w.status==='paid'||w.status==='completed').length.toString()} sub="Processados" icon={Check} color="green"/>
                <MCard title="Total Saques" value={fmt(totalWith)} sub="Volume total" icon={Wallet} color="red"/>
              </div>
              <FilterRow search={filterSearch} onSearch={setFilterSearch} status={filterStatus} onStatus={setFilterStatus} statusOpts={['pending','approved','paid','rejected']}/>
              <DataTbl loading={loading}
                cols={['Usuário','Valor','Status','Data','Ações']}
                rows={filteredWithdrawals.map((w:any)=>[
                  <span style={{fontWeight:500,color:'#ccc'}}>{w.name||'—'}</span>,
                  <span style={{color:V.red,fontWeight:600}}>{fmt(Number(w.amount))}</span>,
                  <SBadge status={w.status}/>,
                  <span style={{color:V.muted,fontSize:'12px'}}>{new Date(w.created_at).toLocaleDateString('pt-BR')}</span>,
                  <div style={{display:'flex',gap:'5px'}}>
                    {w.status==='pending'&&<>
                      <GhostBtn color="green" onClick={()=>setConfirm({msg:'Aprovar este saque?',action:async()=>{const r=await api(`/api/admin/withdrawals/${w.id}/approve`,'PUT',{});if(r.success){showToast('Aprovado!');load(token)}else showToast(r.error,'error')}})}>Aprovar</GhostBtn>
                      <GhostBtn color="red" onClick={()=>setConfirm({msg:'Recusar e devolver saldo?',action:async()=>{const r=await api(`/api/admin/withdrawals/${w.id}/reject`,'PUT',{reason:'Recusado'});if(r.success){showToast('Recusado!');load(token)}else showToast(r.error,'error')}})}>Recusar</GhostBtn>
                    </>}
                    {w.status==='approved'&&<GhostBtn color="green" onClick={()=>setConfirm({msg:'Marcar como pago?',action:async()=>{const r=await api(`/api/admin/withdrawals/${w.id}/paid`,'PUT',{});if(r.success){showToast('Pago!');load(token)}else showToast(r.error,'error')}})}>Pago</GhostBtn>}
                  </div>
                ])}
                page={page} perPage={perPage} onPage={setPage} onPerPage={setPerPage}
              />
            </div>
          )}

          {/* ═══ DEPOSITOS ═══ */}
          {tab==='deposits' && (
            <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Depósitos</h1>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px'}}>
                <MCard title="Pendentes" value={deposits.filter((d:any)=>d.status==='pending').length.toString()} sub="Aguardando confirmação" icon={ArrowDownToLine} color="yellow"/>
                <MCard title="Confirmados" value={deposits.filter((d:any)=>d.status==='completed').length.toString()} sub="Processados" icon={Check} color="green"/>
                <MCard title="Total Depósitos" value={fmt(totalDep)} sub="Volume total" icon={DollarSign} color="green"/>
              </div>
              <FilterRow search={filterSearch} onSearch={setFilterSearch} status={filterStatus} onStatus={setFilterStatus} statusOpts={['pending','completed','refunded']}/>
              <DataTbl loading={loading}
                cols={['Usuário','Valor','Status','Data','Ações']}
                rows={filteredDeposits.map((d:any)=>[
                  <span style={{fontWeight:500,color:'#ccc'}}>{d.name||'—'}</span>,
                  <span style={{color:V.green,fontWeight:600}}>{fmt(Number(d.amount))}</span>,
                  <SBadge status={d.status}/>,
                  <span style={{color:V.muted,fontSize:'12px'}}>{new Date(d.created_at).toLocaleDateString('pt-BR')}</span>,
                  <div style={{display:'flex',gap:'5px'}}>
                    {d.status==='pending'&&<GhostBtn color="green" onClick={()=>setConfirm({msg:'Aprovar este depósito?',action:async()=>{const r=await api(`/api/admin/deposits/${d.id}/approve`,'PUT',{});if(r.success){showToast('Aprovado!');load(token)}else showToast(r.error,'error')}})}>Aprovar</GhostBtn>}
                    {d.status==='completed'&&<GhostBtn color="red" onClick={()=>setConfirm({msg:'Estornar este depósito?',action:async()=>{const r=await api(`/api/admin/deposits/${d.id}/refund`,'PUT',{});if(r.success){showToast('Estornado!');load(token)}else showToast(r.error,'error')}})}>Estornar</GhostBtn>}
                  </div>
                ])}
                page={page} perPage={perPage} onPage={setPage} onPerPage={setPerPage}
              />
            </div>
          )}

          {/* ═══ AUDITORIA ═══ */}
          {tab==='audit' && (
            <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>Auditoria</h1>
              <DataTbl loading={loading}
                cols={['Admin','Ação','IP','Data/Hora']}
                rows={audit.map((a:any)=>[
                  <span style={{fontWeight:500,color:'#ccc'}}>{a.name||'—'}</span>,
                  <span style={{background:'rgba(99,102,241,0.1)',color:'#818cf8',fontSize:'11px',fontWeight:600,padding:'2px 8px',borderRadius:'4px'}}>{a.action}</span>,
                  <span style={{color:V.muted,fontSize:'12px'}}>{a.ip||'—'}</span>,
                  <span style={{color:V.muted,fontSize:'12px'}}>{new Date(a.created_at).toLocaleString('pt-BR')}</span>,
                ])}
                page={page} perPage={perPage} onPage={setPage} onPerPage={setPerPage}
              />
            </div>
          )}

          {/* ═══ CONFIGURAÇÕES ═══ */}
          {tab==='configs' && (
            <div className="fade-in" style={{maxWidth:'520px'}}>
              <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif",marginBottom:'20px'}}>Configurações</h1>
              <div style={{background:V.card,borderRadius:'12px',border:`1px solid ${V.border}`,padding:'24px'}}>
                <h3 style={{fontSize:'14px',fontWeight:600,marginBottom:'18px',color:'#ccc'}}>Parâmetros Financeiros</h3>
                <form onSubmit={saveSettings} style={{display:'flex',flexDirection:'column',gap:'4px'}}>
                  {[
                    {k:'taxa_vitoria',l:'Taxa de vitória (%)'},
                    {k:'taxa_deposito',l:'Taxa de depósito (%)'},
                    {k:'taxa_saque',l:'Taxa de saque (%)'},
                    {k:'saque_minimo',l:'Saque mínimo (R$)'},
                    {k:'saque_maximo',l:'Saque máximo (R$)'},
                    {k:'saque_diario',l:'Limite saque diário (R$)'},
                    {k:'rollover',l:'Rollover base (multiplicador)'},
                  ].map(f=>(
                    <div key={f.k} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 0',borderBottom:`1px solid #1a1a1a`}}>
                      <label style={{fontSize:'13px',color:'#888',flex:1}}>{f.l}</label>
                      <FInput type="number" step="0.01" value={settings[f.k]||''} style={{width:'120px',color:V.green,fontWeight:600,textAlign:'right'}} onChange={(e:any)=>setSettings({...settings,[f.k]:e.target.value})}/>
                    </div>
                  ))}
                  <PrimaryBtn type="submit" style={{marginTop:'16px'}}>SALVAR CONFIGURAÇÕES</PrimaryBtn>
                </form>
              </div>
            </div>
          )}

          {/* PÁGINAS PLACEHOLDER */}
          {['metricas','admins','afiliados','saques-afiliados','relatorio','historico','eventos','estilo','banners'].includes(tab) && (
            <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <h1 style={{fontSize:'20px',fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>{currentLabel}</h1>
              <div style={{background:V.card,borderRadius:'12px',border:`1px solid ${V.border}`,padding:'48px',textAlign:'center'}}>
                <p style={{color:V.muted,fontSize:'14px'}}>Em desenvolvimento...</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ══ MODAL EDITAR MERCADO ══ */}
      {editMarket && (
        <Overlay onClose={()=>setEditMarket(null)}>
          <Modal title="Editar Mercado" onClose={()=>setEditMarket(null)}>
            <FField label="Pergunta"><FInput value={editMarket.question} onChange={(e:any)=>setEditMarket({...editMarket,question:e.target.value})}/></FField>
            <FField label="Categoria"><FSelect value={editMarket.category||''} onChange={(e:any)=>setEditMarket({...editMarket,category:e.target.value})}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</FSelect></FField>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
              <FField label="SIM (%)"><FInput type="number" min="1" max="99" style={{color:V.green}} value={editMarket.yes_odds} onChange={(e:any)=>setEditMarket({...editMarket,yes_odds:e.target.value,no_odds:100-Number(e.target.value)})}/></FField>
              <FField label="NAO (%)"><FInput type="number" min="1" max="99" style={{color:V.red}} value={editMarket.no_odds} onChange={(e:any)=>setEditMarket({...editMarket,no_odds:e.target.value,yes_odds:100-Number(e.target.value)})}/></FField>
            </div>
            <FField label="Data encerramento"><FInput type="datetime-local" value={editMarket.expires_at?String(editMarket.expires_at).slice(0,16):''} onChange={(e:any)=>setEditMarket({...editMarket,expires_at:e.target.value})}/></FField>
            <FField label="Status"><FSelect value={editMarket.status} onChange={(e:any)=>setEditMarket({...editMarket,status:e.target.value})}>{['open','suspended','resolved','cancelled'].map(s=><option key={s} value={s}>{s}</option>)}</FSelect></FField>
            <p style={{fontSize:'11px',color:'#333',marginTop:'4px'}}>Esta alteração será registrada no log de auditoria com seu IP.</p>
            <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
              <PrimaryBtn onClick={saveMarket}>SALVAR</PrimaryBtn>
              <GhostBtn onClick={()=>setEditMarket(null)}>Cancelar</GhostBtn>
            </div>
          </Modal>
        </Overlay>
      )}

      {/* ══ MODAL EDITAR USUARIO ══ */}
      {editUser && (
        <Overlay onClose={()=>setEditUser(null)}>
          <Modal title="Editar Usuário" onClose={()=>setEditUser(null)}>
            <FField label="Nome"><FInput value={editUser.name} onChange={(e:any)=>setEditUser({...editUser,name:e.target.value})}/></FField>
            <FField label="E-mail"><FInput value={editUser.email} onChange={(e:any)=>setEditUser({...editUser,email:e.target.value})}/></FField>
            <FField label="Status"><FSelect value={editUser.status||'active'} onChange={(e:any)=>setEditUser({...editUser,status:e.target.value})}>{['active','blocked','suspended'].map(s=><option key={s} value={s}>{s}</option>)}</FSelect></FField>
            <p style={{fontSize:'11px',color:'#333',marginTop:'4px'}}>Esta alteração será registrada no log de auditoria com seu IP.</p>
            <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
              <PrimaryBtn onClick={saveUser}>SALVAR</PrimaryBtn>
              <GhostBtn onClick={()=>setEditUser(null)}>Cancelar</GhostBtn>
            </div>
          </Modal>
        </Overlay>
      )}

      {/* ══ MODAL SALDO ══ */}
      {balanceModal && (
        <Overlay onClose={()=>setBalanceModal(null)}>
          <Modal title={`Ajustar Saldo — ${balanceModal.name}`} onClose={()=>setBalanceModal(null)}>
            <p style={{fontSize:'12px',color:V.muted}}>Use valor negativo para remover saldo.</p>
            <FField label="Valor (R$)"><FInput type="number" step="0.01" placeholder="Ex: 100.00 ou -50.00" value={balanceModal.amount} onChange={(e:any)=>setBalanceModal({...balanceModal,amount:e.target.value})}/></FField>
            <FField label="Motivo"><FInput placeholder="Ex: Bônus de cadastro" value={balanceModal.note} onChange={(e:any)=>setBalanceModal({...balanceModal,note:e.target.value})}/></FField>
            <p style={{fontSize:'11px',color:'#333',marginTop:'4px'}}>Esta ação será registrada no log de auditoria com seu IP.</p>
            <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
              <PrimaryBtn onClick={()=>setConfirm({msg:`Ajustar saldo de ${balanceModal.name} em R$ ${balanceModal.amount}?`,action:adjBalance})}>AJUSTAR</PrimaryBtn>
              <GhostBtn onClick={()=>setBalanceModal(null)}>Cancelar</GhostBtn>
            </div>
          </Modal>
        </Overlay>
      )}

      {/* ══ MODAL CONFIRM ══ */}
      {confirm && (
        <Overlay onClose={()=>setConfirm(null)}>
          <div style={{background:V.card,borderRadius:'12px',border:`1px solid ${V.border}`,padding:'28px 24px',maxWidth:'400px',width:'100%',textAlign:'center'}}>
            <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'rgba(255,179,0,0.1)',border:'1px solid rgba(255,179,0,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
              <AlertTriangle size={20} color="#ffb300"/>
            </div>
            <p style={{fontSize:'14px',color:'#ccc',lineHeight:1.6,marginBottom:'6px'}}>{confirm.msg}</p>
            <p style={{fontSize:'11px',color:V.muted,marginBottom:'20px'}}>Esta ação será registrada na auditoria.</p>
            <div style={{display:'flex',gap:'8px'}}>
              <PrimaryBtn onClick={async()=>{await confirm.action();setConfirm(null)}}>Confirmar</PrimaryBtn>
              <GhostBtn onClick={()=>setConfirm(null)}>Cancelar</GhostBtn>
            </div>
          </div>
        </Overlay>
      )}

      {/* ══ SEARCH ══ */}
      {searchOpen && (
        <Overlay onClose={()=>setSearchOpen(false)}>
          <div style={{background:V.card,borderRadius:'12px',border:`1px solid ${V.border}`,width:'100%',maxWidth:'480px',overflow:'hidden'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'14px 16px',borderBottom:`1px solid ${V.border}`}}>
              <Search size={15} color={V.muted}/>
              <input autoFocus placeholder="Buscar página..." style={{flex:1,background:'transparent',border:'none',outline:'none',color:V.text,fontSize:'14px'}} onKeyDown={(e:any)=>{if(e.key==='Escape')setSearchOpen(false)}}/>
            </div>
            <div style={{padding:'6px'}}>
              {NAV_SECTIONS.flatMap(s=>s.items).map(item=>(
                <button key={item.id} onClick={()=>{setTab(item.id);setSearchOpen(false)}} style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',border:'none',background:'transparent',cursor:'pointer',borderRadius:'7px',color:V.muted,fontSize:'13px',textAlign:'left',transition:'all 0.08s'}}
                  onMouseEnter={(e:any)=>{e.currentTarget.style.background=V.hover;e.currentTarget.style.color=V.text}} onMouseLeave={(e:any)=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=V.muted}}>
                  <item.icon size={15} strokeWidth={1.75}/>{item.label}
                </button>
              ))}
            </div>
          </div>
        </Overlay>
      )}

      {/* ══ TOAST ══ */}
      {toast && (
        <div style={{position:'fixed',bottom:'20px',right:'20px',zIndex:999,display:'flex',alignItems:'center',gap:'10px',background:V.card,border:`1px solid ${toast.type==='error'?'rgba(244,67,54,0.3)':'rgba(0,230,118,0.3)'}`,borderRadius:'10px',padding:'12px 16px',boxShadow:'0 8px 32px rgba(0,0,0,0.5)',animation:'fadeIn 0.2s ease'}}>
          {toast.type==='error'?<X size={14} color={V.red}/>:<Check size={14} color={V.green}/>}
          <span style={{fontSize:'13px',color:toast.type==='error'?V.red:V.green,fontWeight:500}}>{toast.text}</span>
        </div>
      )}
    </div>
  )
}

// ── COMPONENTS ──

function MCard({title,value,sub,icon:Icon,color='green'}:{title:string,value:string,sub:string,icon:any,color?:string}) {
  const colors:any = {green:'#00e676',red:'#f44336',blue:'#3b82f6',yellow:'#ffb300'}
  const bgs:any = {green:'rgba(0,230,118,0.08)',red:'rgba(244,67,54,0.08)',blue:'rgba(59,130,246,0.08)',yellow:'rgba(255,179,0,0.08)'}
  const c = colors[color]||'#00e676', bg = bgs[color]||bgs.green
  return (
    <div className="metric-card" style={{background:'#1a1a1a',borderRadius:'10px',border:'1px solid #222',padding:'16px',transition:'all 0.2s',cursor:'default'}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'10px'}}>
        <p style={{fontSize:'11px',color:'#555',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',lineHeight:1.3}}>{title}</p>
        <div style={{width:'28px',height:'28px',borderRadius:'7px',background:bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <Icon size={14} color={c} strokeWidth={1.75}/>
        </div>
      </div>
      <p style={{fontSize:'22px',fontWeight:700,color:color==='red'?'#f44336':color==='blue'?'#3b82f6':color==='yellow'?'#ffb300':'#00e676',fontFamily:"'Manrope',sans-serif",letterSpacing:'-0.5px',marginBottom:'4px'}}>{value}</p>
      <p style={{fontSize:'11px',color:'#555'}}>{sub}</p>
    </div>
  )
}

function SBadge({status}:{status:string}) {
  const m:any = {
    open:{bg:'rgba(0,230,118,0.1)',c:'#00e676',b:'rgba(0,230,118,0.2)'},
    active:{bg:'rgba(0,230,118,0.1)',c:'#00e676',b:'rgba(0,230,118,0.2)'},
    completed:{bg:'rgba(0,230,118,0.1)',c:'#00e676',b:'rgba(0,230,118,0.2)'},
    paid:{bg:'rgba(0,230,118,0.1)',c:'#00e676',b:'rgba(0,230,118,0.2)'},
    resolved:{bg:'rgba(99,102,241,0.1)',c:'#818cf8',b:'rgba(99,102,241,0.2)'},
    admin:{bg:'rgba(59,130,246,0.1)',c:'#3b82f6',b:'rgba(59,130,246,0.2)'},
    pending:{bg:'rgba(255,179,0,0.1)',c:'#ffb300',b:'rgba(255,179,0,0.2)'},
    suspended:{bg:'rgba(255,179,0,0.1)',c:'#ffb300',b:'rgba(255,179,0,0.2)'},
    processing:{bg:'rgba(255,179,0,0.1)',c:'#ffb300',b:'rgba(255,179,0,0.2)'},
    cancelled:{bg:'rgba(244,67,54,0.1)',c:'#f44336',b:'rgba(244,67,54,0.2)'},
    blocked:{bg:'rgba(244,67,54,0.1)',c:'#f44336',b:'rgba(244,67,54,0.2)'},
    rejected:{bg:'rgba(244,67,54,0.1)',c:'#f44336',b:'rgba(244,67,54,0.2)'},
    refunded:{bg:'rgba(244,67,54,0.1)',c:'#f44336',b:'rgba(244,67,54,0.2)'},
    user:{bg:'rgba(255,255,255,0.05)',c:'#666',b:'rgba(255,255,255,0.1)'},
  }
  const s = m[status]||{bg:'rgba(255,255,255,0.05)',c:'#666',b:'rgba(255,255,255,0.1)'}
  const labels:any = {open:'Aberto',active:'Ativo',completed:'Confirmado',paid:'Pago',resolved:'Resolvido',pending:'Pendente',suspended:'Suspenso',processing:'Processando',cancelled:'Cancelado',blocked:'Bloqueado',rejected:'Recusado',refunded:'Estornado',admin:'Admin',user:'Usuário'}
  return <span style={{display:'inline-flex',alignItems:'center',padding:'2px 8px',borderRadius:'99px',fontSize:'11px',fontWeight:600,background:s.bg,color:s.c,border:`1px solid ${s.b}`}}>{labels[status]||status}</span>
}

function DataTbl({cols,rows,loading,page,perPage,onPage,onPerPage}:{cols:string[],rows:any[][],loading:boolean,page:number,perPage:number,onPage:(p:number)=>void,onPerPage:(p:number)=>void}) {
  if (loading) return <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>{Array(5).fill(0).map((_,i)=><div key={i} className="skel" style={{height:'44px'}}/>)}</div>
  const totalPages = Math.ceil(rows.length/perPage)
  const paged = rows.slice((page-1)*perPage, page*perPage)
  if (!paged.length) return <div style={{background:'#1a1a1a',borderRadius:'10px',border:'1px solid #222',padding:'48px',textAlign:'center'}}><p style={{color:'#555',fontSize:'13px'}}>Nenhum registro encontrado</p></div>
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
      <div style={{borderRadius:'10px',border:'1px solid #222',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',background:'#1a1a1a'}}>
          <thead>
            <tr style={{background:'#141414'}}>
              {cols.map(c=><th key={c} style={{textAlign:'left',padding:'10px 14px',fontSize:'11px',fontWeight:600,color:'#555',textTransform:'uppercase',letterSpacing:'0.1em',borderBottom:'1px solid #222',whiteSpace:'nowrap'}}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {paged.map((row,i)=>(
              <tr key={i} className="trow" style={{borderBottom:'1px solid #1e1e1e',transition:'background 0.1s'}}>
                {row.map((cell,j)=><td key={j} style={{padding:'11px 14px',verticalAlign:'middle'}}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:'12px',color:'#555'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <span>Itens por página:</span>
          <select value={perPage} onChange={(e:any)=>{onPerPage(Number(e.target.value));onPage(1)}} style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'6px',padding:'3px 6px',color:'#888',fontSize:'12px',outline:'none',cursor:'pointer'}}>
            <option value="10">10</option><option value="25">25</option><option value="50">50</option>
          </select>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
          <span>{(page-1)*perPage+1}–{Math.min(page*perPage,rows.length)} de {rows.length}</span>
          <button onClick={()=>onPage(page-1)} disabled={page<=1} style={{width:'26px',height:'26px',borderRadius:'6px',border:'1px solid #222',background:'transparent',cursor:page<=1?'not-allowed':'pointer',color:page<=1?'#333':'#888',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <ChevronLeft size={13}/>
          </button>
          <button onClick={()=>onPage(page+1)} disabled={page>=totalPages} style={{width:'26px',height:'26px',borderRadius:'6px',border:'1px solid #222',background:'transparent',cursor:page>=totalPages?'not-allowed':'pointer',color:page>=totalPages?'#333':'#888',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <ChevronRight size={13}/>
          </button>
        </div>
      </div>
    </div>
  )
}

function FilterRow({search,onSearch,status,onStatus,statusOpts}:any) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
      <div style={{position:'relative',flex:1,minWidth:'180px',maxWidth:'300px'}}>
        <Search size={13} color="#555" style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
        <input value={search} onChange={(e:any)=>onSearch(e.target.value)} placeholder="Filtrar..." style={{width:'100%',background:'#1a1a1a',border:'1px solid #222',borderRadius:'8px',padding:'7px 10px 7px 30px',color:'#888',fontSize:'12px',outline:'none',transition:'border-color 0.15s'}} onFocus={(e:any)=>e.target.style.borderColor='rgba(0,230,118,0.4)'} onBlur={(e:any)=>e.target.style.borderColor='#222'}/>
      </div>
      <select value={status} onChange={(e:any)=>onStatus(e.target.value)} style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'8px',padding:'7px 10px',color:status?'#ccc':'#555',fontSize:'12px',outline:'none',cursor:'pointer'}}>
        <option value="">Todos os status</option>
        {statusOpts.map((s:string)=><option key={s} value={s}>{s}</option>)}
      </select>
      {(search||status)&&<button onClick={()=>{onSearch('');onStatus('')}} style={{background:'transparent',border:'1px solid #222',borderRadius:'8px',padding:'7px 12px',color:'#555',fontSize:'12px',cursor:'pointer'}}>Limpar</button>}
    </div>
  )
}

function Overlay({children,onClose}:{children:any,onClose:()=>void}) {
  return <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',backdropFilter:'blur(6px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>{children}</div>
}

function Modal({title,onClose,children}:{title:string,onClose:()=>void,children:any}) {
  return (
    <div style={{background:'#1a1a1a',borderRadius:'12px',border:'1px solid #222',padding:'24px',width:'100%',maxWidth:'480px',maxHeight:'90vh',overflowY:'auto'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
        <h3 style={{fontSize:'15px',fontWeight:600,color:'#fff',fontFamily:"'Manrope',sans-serif"}}>{title}</h3>
        <button onClick={onClose} style={{background:'#222',border:'none',cursor:'pointer',color:'#666',width:'28px',height:'28px',borderRadius:'6px',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.1s'}} onMouseEnter={(e:any)=>e.currentTarget.style.color='#ccc'} onMouseLeave={(e:any)=>e.currentTarget.style.color='#666'}><X size={14}/></button>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>{children}</div>
    </div>
  )
}

function FField({label,children}:{label:string,children:any}) {
  return <div><label style={{fontSize:'11px',color:'#555',display:'block',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:600}}>{label}</label>{children}</div>
}

function FInput({style,...p}:any) {
  return <input {...p} style={{width:'100%',background:'#141414',border:'1px solid #222',borderRadius:'8px',padding:'9px 12px',color:'#ccc',fontSize:'13px',outline:'none',transition:'border-color 0.15s',...style}} onFocus={(e:any)=>e.target.style.borderColor='rgba(0,230,118,0.4)'} onBlur={(e:any)=>e.target.style.borderColor='#222'}/>
}

function FSelect({style,...p}:any) {
  return <select {...p} style={{width:'100%',background:'#141414',border:'1px solid #222',borderRadius:'8px',padding:'9px 12px',color:'#ccc',fontSize:'13px',outline:'none',cursor:'pointer',...style}}/>
}

function PrimaryBtn({children,onClick,type,style}:{children:any,onClick?:()=>void,type?:any,style?:any}) {
  return <button type={type||'button'} onClick={onClick} style={{background:'linear-gradient(135deg,#00e676,#00c853)',color:'#000',border:'none',borderRadius:'8px',padding:'10px 18px',fontWeight:700,fontSize:'13px',cursor:'pointer',transition:'opacity 0.15s',letterSpacing:'0.02em',display:'flex',alignItems:'center',gap:'6px',whiteSpace:'nowrap',...style}} onMouseEnter={(e:any)=>e.currentTarget.style.opacity='0.85'} onMouseLeave={(e:any)=>e.currentTarget.style.opacity='1'}>{children}</button>
}

function GhostBtn({children,onClick,color='gray'}:{children:any,onClick:()=>void,color?:string}) {
  const m:any={green:{bg:'rgba(0,230,118,0.08)',c:'#00e676',b:'rgba(0,230,118,0.2)'},red:{bg:'rgba(244,67,54,0.08)',c:'#f44336',b:'rgba(244,67,54,0.2)'},gray:{bg:'rgba(255,255,255,0.04)',c:'#888',b:'#222'}}
  const s=m[color]||m.gray
  return <button onClick={onClick} style={{padding:'5px 12px',borderRadius:'6px',cursor:'pointer',fontSize:'12px',fontWeight:500,background:s.bg,color:s.c,border:`1px solid ${s.b}`,transition:'opacity 0.12s',whiteSpace:'nowrap'}} onMouseEnter={(e:any)=>e.currentTarget.style.opacity='0.75'} onMouseLeave={(e:any)=>e.currentTarget.style.opacity='1'}>{children}</button>
}
