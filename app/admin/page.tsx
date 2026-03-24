'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const API = 'http://187.77.248.115:3001'

const NAV = [
  { section: 'Principal', items: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'audit', label: 'Auditoria' },
    { id: 'configs', label: 'Configuracoes' },
  ]},
  { section: 'Gerenciamento', items: [
    { id: 'users', label: 'Usuarios' },
  ]},
  { section: 'Financeiro', items: [
    { id: 'withdrawals', label: 'Saques' },
    { id: 'deposits', label: 'Depositos' },
  ]},
  { section: 'Operacional', items: [
    { id: 'markets', label: 'Mercados' },
    { id: 'criar', label: 'Criar Mercado' },
  ]},
]

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
  const [toast, setToast] = useState<any>(null)
  const [confirm, setConfirm] = useState<any>(null)
  const [editMarket, setEditMarket] = useState<any>(null)
  const [editUser, setEditUser] = useState<any>(null)
  const [balanceModal, setBalanceModal] = useState<any>(null)
  const [newMarket, setNewMarket] = useState({question:'',category:'Financeiro',yes_odds:'50',no_odds:'50',expires_at:''})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!u || !t) { router.push('/login'); return }
    if (!JSON.parse(u).is_admin) { router.push('/'); return }
    setToken(t)
    load(t)
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
    setTimeout(()=>setToast(null),3000)
  }

  async function api(url: string, method='GET', body?: any) {
    const r = await fetch(API+url,{method,headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:body?JSON.stringify(body):undefined})
    return r.json()
  }

  function askConfirm(msg: string, action: ()=>void) {
    setConfirm({msg,action})
  }

  async function createMarket(e: any) {
    e.preventDefault()
    const r = await api('/api/admin/markets','POST',{...newMarket,yes_odds:Number(newMarket.yes_odds),no_odds:Number(newMarket.no_odds),expires_at:newMarket.expires_at||null})
    if (r.id) { showToast('Mercado criado!'); setNewMarket({question:'',category:'Financeiro',yes_odds:'50',no_odds:'50',expires_at:''}); load(token) }
    else showToast(r.error||'Erro','error')
  }

  async function saveMarket() {
    const r = await api(`/api/admin/markets/${editMarket.id}`,'PUT',editMarket)
    if (r.id) { showToast('Mercado salvo!'); setEditMarket(null); load(token) }
    else showToast(r.error||'Erro','error')
  }

  async function saveUser() {
    const r = await api(`/api/admin/users/${editUser.id}`,'PUT',editUser)
    if (r.id) { showToast('Usuario salvo!'); setEditUser(null); load(token) }
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

  const CATS = ['Entretenimento','Criptomoedas','Financeiro','Esportes','Politica','Clima','Celebridades']
  const totalDeposits = deposits.filter(d=>d.status==='completed').reduce((a:number,d:any)=>a+Number(d.amount),0)
  const totalWithdrawals = withdrawals.filter(w=>w.status==='completed'||w.status==='paid').reduce((a:number,w:any)=>a+Number(w.amount),0)
  const lucro = totalDeposits - totalWithdrawals

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#0f0f0f',color:'#fff',fontFamily:'Inter,Kanit,sans-serif'}}>
      <style>{`
        *{box-sizing:border-box}
        input,select,textarea,button{font-family:Inter,Kanit,sans-serif}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:#333;border-radius:2px}
        .row:hover td{background:rgba(255,255,255,0.02)}
        .nav-item:hover{background:rgba(255,255,255,0.04);color:#fff}
        @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes skeleton{0%{opacity:0.4}50%{opacity:0.8}100%{opacity:0.4}}
        .skel{animation:skeleton 1.2s infinite;background:#222;border-radius:6px}
      `}</style>

      {/* SIDEBAR */}
      <aside style={{width:'220px',flexShrink:0,background:'#111',borderRight:'1px solid #1a1a1a',display:'flex',flexDirection:'column',position:'sticky',top:0,height:'100vh',overflowY:'auto'}}>
        <div style={{padding:'20px 16px 16px',borderBottom:'1px solid #1a1a1a'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <div style={{width:'28px',height:'28px',borderRadius:'6px',background:'#00e676',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{color:'#000',fontWeight:900,fontSize:'12px'}}>P</span>
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:'13px',color:'#fff'}}>Previmarket</div>
              <div style={{fontSize:'10px',color:'#00e676'}}>Admin Panel</div>
            </div>
          </div>
        </div>

        <nav style={{flex:1,padding:'8px 0',overflowY:'auto'}}>
          {NAV.map(section=>(
            <div key={section.section} style={{marginBottom:'4px'}}>
              <p style={{fontSize:'9px',fontWeight:700,letterSpacing:'0.12em',color:'#444',textTransform:'uppercase',padding:'8px 16px 4px'}}>{section.section}</p>
              {section.items.map(item=>(
                <button key={item.id} onClick={()=>setTab(item.id)} className="nav-item"
                  style={{width:'100%',padding:'8px 16px',border:'none',cursor:'pointer',background:tab===item.id?'rgba(0,230,118,0.08)':'transparent',borderLeft:tab===item.id?'2px solid #00e676':'2px solid transparent',color:tab===item.id?'#00e676':'#666',fontSize:'13px',fontWeight:tab===item.id?600:400,textAlign:'left',transition:'all 0.15s'}}>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div style={{padding:'12px 16px',borderTop:'1px solid #1a1a1a',display:'flex',gap:'8px'}}>
          <a href="/" target="_blank" style={{flex:1,textAlign:'center',padding:'7px',borderRadius:'7px',background:'#1a1a1a',color:'#888',fontSize:'12px',textDecoration:'none',border:'1px solid #222'}}>Ver Site</a>
          <button onClick={()=>{localStorage.clear();router.push('/')}} style={{flex:1,padding:'7px',borderRadius:'7px',background:'rgba(244,67,54,0.1)',color:'#f44336',fontSize:'12px',border:'1px solid rgba(244,67,54,0.2)',cursor:'pointer'}}>Sair</button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>

        {/* HEADER */}
        <header style={{background:'#111',borderBottom:'1px solid #1a1a1a',height:'52px',display:'flex',alignItems:'center',padding:'0 24px',gap:'12px',position:'sticky',top:0,zIndex:10}}>
          <h1 style={{fontSize:'15px',fontWeight:700,flex:1,color:'#fff'}}>
            {NAV.flatMap(s=>s.items).find(i=>i.id===tab)?.label||'Admin'}
          </h1>
          <button onClick={()=>load(token)} style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'7px',padding:'6px 14px',color:'#888',fontSize:'12px',cursor:'pointer'}}>
            Atualizar
          </button>
        </header>

        <main style={{flex:1,padding:'20px 24px',overflowY:'auto'}}>

          {/* DASHBOARD */}
          {tab==='dashboard'&&(
            <div>
              {loading?(
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px'}}>
                  {Array(8).fill(0).map((_,i)=><div key={i} className="skel" style={{height:'90px'}}/>)}
                </div>
              ):(
                <>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'12px',marginBottom:'12px'}}>
                    {[
                      {label:'Usuarios',value:users.length,sub:`${users.filter(u=>u.status!=='blocked').length} ativos`,color:'#818cf8'},
                      {label:'Mercados Ativos',value:markets.filter(m=>m.status==='open').length,sub:`${markets.length} total`,color:'#00e676'},
                      {label:'Total Depositos',value:`R$ ${totalDeposits.toFixed(2)}`,sub:`${deposits.filter(d=>d.status==='completed').length} pagamentos`,color:'#00e676'},
                      {label:'Total Saques',value:`R$ ${totalWithdrawals.toFixed(2)}`,sub:`${withdrawals.filter(w=>w.status==='completed'||w.status==='paid').length} pagos`,color:'#f44336'},
                      {label:'Saques Pendentes',value:withdrawals.filter(w=>w.status==='pending').length,sub:'Aguardando aprovacao',color:'#ffb300'},
                      {label:'Depositos Pendentes',value:deposits.filter(d=>d.status==='pending').length,sub:'Aguardando confirmacao',color:'#ffb300'},
                      {label:'Auditoria',value:audit.length,sub:'Registros totais',color:'#64748b'},
                      {label:'Lucro Total',value:`R$ ${lucro.toFixed(2)}`,sub:'Depositos - Saques',color:lucro>=0?'#00e676':'#f44336'},
                    ].map(c=>(
                      <div key={c.label} style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'12px',padding:'16px'}}>
                        <p style={{fontSize:'11px',color:'#666',marginBottom:'6px'}}>{c.label}</p>
                        <p style={{fontSize:'22px',fontWeight:800,color:c.color,marginBottom:'3px'}}>{c.value}</p>
                        <p style={{fontSize:'11px',color:'#555'}}>{c.sub}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                    <div style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'12px',padding:'16px'}}>
                      <h3 style={{fontSize:'13px',fontWeight:700,marginBottom:'12px',color:'#fff'}}>Ultimos Mercados</h3>
                      {markets.slice(0,5).map(m=>(
                        <div key={m.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid #1f1f1f'}}>
                          <span style={{fontSize:'12px',color:'#ccc',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'200px'}}>{m.question}</span>
                          <Badge status={m.status}/>
                        </div>
                      ))}
                    </div>
                    <div style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'12px',padding:'16px'}}>
                      <h3 style={{fontSize:'13px',fontWeight:700,marginBottom:'12px',color:'#fff'}}>Ultimas Transacoes</h3>
                      {[...deposits,...withdrawals].sort((a,b)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime()).slice(0,5).map((t:any)=>(
                        <div key={t.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid #1f1f1f'}}>
                          <div>
                            <span style={{fontSize:'12px',color:'#ccc'}}>{t.name||'Usuario'}</span>
                            <span style={{fontSize:'10px',color:'#555',marginLeft:'6px'}}>{t.type}</span>
                          </div>
                          <span style={{fontSize:'12px',fontWeight:600,color:t.type==='deposit'?'#00e676':'#f44336'}}>R$ {Number(t.amount).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* MERCADOS */}
          {tab==='markets'&&(
            <div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
                <p style={{color:'#666',fontSize:'13px'}}>{markets.length} mercados</p>
                <button onClick={()=>setTab('criar')} style={{background:'#00e676',color:'#000',border:'none',borderRadius:'7px',padding:'8px 16px',fontWeight:700,fontSize:'13px',cursor:'pointer'}}>+ Novo Mercado</button>
              </div>
              <Table
                cols={['Pergunta','Categoria','SIM','NAO','Status','Encerra','Acoes']}
                rows={markets.map(m=>[
                  <span style={{maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',display:'block'}}>{m.question}</span>,
                  <span style={{color:'#888',fontSize:'12px'}}>{m.category||'-'}</span>,
                  <span style={{color:'#00e676',fontWeight:600}}>{m.yes_odds}%</span>,
                  <span style={{color:'#f44336',fontWeight:600}}>{m.no_odds}%</span>,
                  <Badge status={m.status}/>,
                  <span style={{color:'#888',fontSize:'11px'}}>{m.expires_at?new Date(m.expires_at).toLocaleDateString('pt-BR'):'-'}</span>,
                  <div style={{display:'flex',gap:'4px'}}>
                    <Btn onClick={()=>setEditMarket({...m})}>Editar</Btn>
                    {m.status==='open'&&<>
                      <Btn color="green" onClick={()=>askConfirm('Resolver como SIM?',async()=>{const r=await api(`/api/admin/markets/${m.id}/resolve`,'PUT',{result:'yes'});if(r.success){showToast('Resolvido!');load(token)}else showToast(r.error,'error')})}>SIM</Btn>
                      <Btn color="red" onClick={()=>askConfirm('Resolver como NAO?',async()=>{const r=await api(`/api/admin/markets/${m.id}/resolve`,'PUT',{result:'no'});if(r.success){showToast('Resolvido!');load(token)}else showToast(r.error,'error')})}>NAO</Btn>
                      <Btn color="red" onClick={()=>askConfirm('Cancelar mercado e devolver apostas?',async()=>{const r=await api(`/api/admin/markets/${m.id}/cancel`,'PUT',{});if(r.success){showToast('Cancelado!');load(token)}else showToast(r.error,'error')})}>Cancelar</Btn>
                    </>}
                  </div>
                ])}
              />
            </div>
          )}

          {/* CRIAR MERCADO */}
          {tab==='criar'&&(
            <div style={{maxWidth:'560px'}}>
              <Card>
                <form onSubmit={createMarket} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                  <Field label="Pergunta *"><Input value={newMarket.question} onChange={e=>setNewMarket({...newMarket,question:e.target.value})} placeholder="Ex: Bitcoin vai superar $100k?" required/></Field>
                  <Field label="Categoria">
                    <Select value={newMarket.category} onChange={e=>setNewMarket({...newMarket,category:e.target.value})}>
                      {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                    </Select>
                  </Field>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                    <Field label="% Chance SIM">
                      <Input type="number" min="1" max="99" value={newMarket.yes_odds} style={{color:'#00e676'}} onChange={e=>setNewMarket({...newMarket,yes_odds:e.target.value,no_odds:String(100-Number(e.target.value))})}/>
                    </Field>
                    <Field label="% Chance NAO">
                      <Input type="number" min="1" max="99" value={newMarket.no_odds} style={{color:'#f44336'}} onChange={e=>setNewMarket({...newMarket,no_odds:e.target.value,yes_odds:String(100-Number(e.target.value))})}/>
                    </Field>
                  </div>
                  <div style={{background:'#222',borderRadius:'8px',padding:'12px',display:'flex',gap:'24px',justifyContent:'center'}}>
                    <div style={{textAlign:'center'}}>
                      <p style={{fontSize:'10px',color:'#555',marginBottom:'3px'}}>MULTIPLICADOR SIM</p>
                      <p style={{fontSize:'20px',fontWeight:800,color:'#00e676'}}>{(100/Number(newMarket.yes_odds||1)).toFixed(2)}x</p>
                    </div>
                    <div style={{textAlign:'center'}}>
                      <p style={{fontSize:'10px',color:'#555',marginBottom:'3px'}}>MULTIPLICADOR NAO</p>
                      <p style={{fontSize:'20px',fontWeight:800,color:'#f44336'}}>{(100/Number(newMarket.no_odds||1)).toFixed(2)}x</p>
                    </div>
                  </div>
                  <Field label="Data de encerramento"><Input type="datetime-local" value={newMarket.expires_at} onChange={e=>setNewMarket({...newMarket,expires_at:e.target.value})}/></Field>
                  <button type="submit" style={{background:'#00e676',color:'#000',border:'none',borderRadius:'8px',padding:'13px',fontWeight:800,fontSize:'14px',cursor:'pointer',marginTop:'4px'}}>CRIAR MERCADO</button>
                </form>
              </Card>
            </div>
          )}

          {/* USUARIOS */}
          {tab==='users'&&(
            <div>
              <p style={{color:'#666',fontSize:'13px',marginBottom:'16px'}}>{users.length} usuarios cadastrados</p>
              <Table
                cols={['Nome','Email','Status','Tipo','Cadastro','Acoes']}
                rows={users.map(u=>[
                  <span style={{fontWeight:500}}>{u.name}</span>,
                  <span style={{color:'#888',fontSize:'12px'}}>{u.email}</span>,
                  <Badge status={u.status||'active'}/>,
                  <Badge status={u.is_admin?'admin':'user'}/>,
                  <span style={{color:'#888',fontSize:'11px'}}>{new Date(u.created_at).toLocaleDateString('pt-BR')}</span>,
                  <div style={{display:'flex',gap:'4px'}}>
                    <Btn onClick={()=>setEditUser({...u})}>Editar</Btn>
                    <Btn color="green" onClick={()=>setBalanceModal({id:u.id,name:u.name,amount:'',note:''})}>Saldo</Btn>
                  </div>
                ])}
              />
            </div>
          )}

          {/* SAQUES */}
          {tab==='withdrawals'&&(
            <div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'12px',marginBottom:'16px'}}>
                {[
                  {label:'Pendentes',value:withdrawals.filter(w=>w.status==='pending').length,color:'#ffb300'},
                  {label:'Pagos',value:withdrawals.filter(w=>w.status==='paid'||w.status==='completed').length,color:'#00e676'},
                  {label:'Total',value:`R$ ${totalWithdrawals.toFixed(2)}`,color:'#f44336'},
                ].map(c=>(
                  <div key={c.label} style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'10px',padding:'14px'}}>
                    <p style={{fontSize:'11px',color:'#555',marginBottom:'4px'}}>{c.label}</p>
                    <p style={{fontSize:'20px',fontWeight:700,color:c.color}}>{c.value}</p>
                  </div>
                ))}
              </div>
              <Table
                cols={['Usuario','Valor','Status','Data','Acoes']}
                rows={withdrawals.map((w:any)=>[
                  <span style={{fontWeight:500}}>{w.name||'-'}</span>,
                  <span style={{color:'#f44336',fontWeight:600}}>R$ {Number(w.amount).toFixed(2)}</span>,
                  <Badge status={w.status}/>,
                  <span style={{color:'#888',fontSize:'11px'}}>{new Date(w.created_at).toLocaleDateString('pt-BR')}</span>,
                  <div style={{display:'flex',gap:'4px'}}>
                    {w.status==='pending'&&<>
                      <Btn color="green" onClick={()=>askConfirm('Aprovar este saque?',async()=>{const r=await api(`/api/admin/withdrawals/${w.id}/approve`,'PUT',{});if(r.success){showToast('Aprovado!');load(token)}else showToast(r.error,'error')})}>Aprovar</Btn>
                      <Btn color="red" onClick={()=>askConfirm('Recusar este saque?',async()=>{const r=await api(`/api/admin/withdrawals/${w.id}/reject`,'PUT',{reason:'Recusado pelo admin'});if(r.success){showToast('Recusado!');load(token)}else showToast(r.error,'error')})}>Recusar</Btn>
                    </>}
                    {(w.status==='approved'||w.status==='processing')&&<Btn color="green" onClick={()=>askConfirm('Marcar como pago?',async()=>{const r=await api(`/api/admin/withdrawals/${w.id}/paid`,'PUT',{});if(r.success){showToast('Marcado como pago!');load(token)}else showToast(r.error,'error')})}>Pago</Btn>}
                  </div>
                ])}
              />
            </div>
          )}

          {/* DEPOSITOS */}
          {tab==='deposits'&&(
            <div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'12px',marginBottom:'16px'}}>
                {[
                  {label:'Pendentes',value:deposits.filter(d=>d.status==='pending').length,color:'#ffb300'},
                  {label:'Confirmados',value:deposits.filter(d=>d.status==='completed').length,color:'#00e676'},
                  {label:'Total',value:`R$ ${totalDeposits.toFixed(2)}`,color:'#00e676'},
                ].map(c=>(
                  <div key={c.label} style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'10px',padding:'14px'}}>
                    <p style={{fontSize:'11px',color:'#555',marginBottom:'4px'}}>{c.label}</p>
                    <p style={{fontSize:'20px',fontWeight:700,color:c.color}}>{c.value}</p>
                  </div>
                ))}
              </div>
              <Table
                cols={['Usuario','Valor','Status','Data','Acoes']}
                rows={deposits.map((d:any)=>[
                  <span style={{fontWeight:500}}>{d.name||'-'}</span>,
                  <span style={{color:'#00e676',fontWeight:600}}>R$ {Number(d.amount).toFixed(2)}</span>,
                  <Badge status={d.status}/>,
                  <span style={{color:'#888',fontSize:'11px'}}>{new Date(d.created_at).toLocaleDateString('pt-BR')}</span>,
                  <div style={{display:'flex',gap:'4px'}}>
                    {d.status==='pending'&&<Btn color="green" onClick={()=>askConfirm('Aprovar este deposito?',async()=>{const r=await api(`/api/admin/deposits/${d.id}/approve`,'PUT',{});if(r.success){showToast('Aprovado!');load(token)}else showToast(r.error,'error')})}>Aprovar</Btn>}
                    {d.status==='completed'&&<Btn color="red" onClick={()=>askConfirm('Estornar este deposito?',async()=>{const r=await api(`/api/admin/deposits/${d.id}/refund`,'PUT',{});if(r.success){showToast('Estornado!');load(token)}else showToast(r.error,'error')})}>Estornar</Btn>}
                  </div>
                ])}
              />
            </div>
          )}

          {/* AUDITORIA */}
          {tab==='audit'&&(
            <div>
              <p style={{color:'#666',fontSize:'13px',marginBottom:'16px'}}>{audit.length} registros</p>
              <Table
                cols={['Admin','Acao','IP','Data']}
                rows={audit.map((a:any)=>[
                  <span style={{fontWeight:500}}>{a.name||'-'}</span>,
                  <span style={{background:'rgba(99,102,241,0.12)',color:'#818cf8',fontSize:'11px',fontWeight:600,padding:'2px 8px',borderRadius:'4px'}}>{a.action}</span>,
                  <span style={{color:'#888',fontSize:'11px'}}>{a.ip||'-'}</span>,
                  <span style={{color:'#888',fontSize:'11px'}}>{new Date(a.created_at).toLocaleString('pt-BR')}</span>,
                ])}
              />
            </div>
          )}

          {/* CONFIGS */}
          {tab==='configs'&&(
            <div style={{maxWidth:'520px'}}>
              <Card>
                <h3 style={{fontSize:'14px',fontWeight:700,marginBottom:'16px'}}>Configuracoes Financeiras</h3>
                <form onSubmit={saveSettings} style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                  {[
                    {key:'taxa_vitoria',label:'Taxa de vitoria (%)'},
                    {key:'taxa_deposito',label:'Taxa de deposito (%)'},
                    {key:'taxa_saque',label:'Taxa de saque (%)'},
                    {key:'saque_minimo',label:'Saque minimo (R$)'},
                    {key:'saque_maximo',label:'Saque maximo (R$)'},
                    {key:'saque_diario',label:'Limite saque diario (R$)'},
                    {key:'rollover',label:'Rollover base (x)'},
                  ].map(f=>(
                    <div key={f.key} style={{display:'flex',alignItems:'center',gap:'12px'}}>
                      <label style={{fontSize:'12px',color:'#888',flex:1,minWidth:0}}>{f.label}</label>
                      <Input type="number" step="0.01" value={settings[f.key]||''} style={{width:'140px',color:'#00e676',fontWeight:700}} onChange={e=>setSettings({...settings,[f.key]:e.target.value})}/>
                    </div>
                  ))}
                  <button type="submit" style={{background:'#00e676',color:'#000',border:'none',borderRadius:'8px',padding:'12px',fontWeight:800,fontSize:'14px',cursor:'pointer',marginTop:'8px'}}>SALVAR</button>
                </form>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* MODAL EDITAR MERCADO */}
      {editMarket&&(
        <Modal title="Editar Mercado" onClose={()=>setEditMarket(null)}>
          <Field label="Pergunta"><Input value={editMarket.question} onChange={e=>setEditMarket({...editMarket,question:e.target.value})}/></Field>
          <Field label="Categoria">
            <Select value={editMarket.category||''} onChange={e=>setEditMarket({...editMarket,category:e.target.value})}>
              {CATS.map(c=><option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            <Field label="% SIM"><Input type="number" min="1" max="99" style={{color:'#00e676'}} value={editMarket.yes_odds} onChange={e=>setEditMarket({...editMarket,yes_odds:e.target.value,no_odds:100-Number(e.target.value)})}/></Field>
            <Field label="% NAO"><Input type="number" min="1" max="99" style={{color:'#f44336'}} value={editMarket.no_odds} onChange={e=>setEditMarket({...editMarket,no_odds:e.target.value,yes_odds:100-Number(e.target.value)})}/></Field>
          </div>
          <Field label="Data encerramento"><Input type="datetime-local" value={editMarket.expires_at?editMarket.expires_at.slice(0,16):''} onChange={e=>setEditMarket({...editMarket,expires_at:e.target.value})}/></Field>
          <Field label="Status">
            <Select value={editMarket.status} onChange={e=>setEditMarket({...editMarket,status:e.target.value})}>
              {['open','suspended','resolved','cancelled'].map(s=><option key={s} value={s}>{s}</option>)}
            </Select>
          </Field>
          <div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
            <button onClick={saveMarket} style={{flex:1,background:'#00e676',color:'#000',border:'none',borderRadius:'8px',padding:'11px',fontWeight:700,cursor:'pointer'}}>SALVAR</button>
            <button onClick={()=>setEditMarket(null)} style={{flex:1,background:'#222',color:'#888',border:'1px solid #333',borderRadius:'8px',padding:'11px',cursor:'pointer'}}>Cancelar</button>
          </div>
        </Modal>
      )}

      {/* MODAL EDITAR USUARIO */}
      {editUser&&(
        <Modal title="Editar Usuario" onClose={()=>setEditUser(null)}>
          <Field label="Nome"><Input value={editUser.name} onChange={e=>setEditUser({...editUser,name:e.target.value})}/></Field>
          <Field label="Email"><Input value={editUser.email} onChange={e=>setEditUser({...editUser,email:e.target.value})}/></Field>
          <Field label="Status">
            <Select value={editUser.status||'active'} onChange={e=>setEditUser({...editUser,status:e.target.value})}>
              {['active','blocked','suspended'].map(s=><option key={s} value={s}>{s}</option>)}
            </Select>
          </Field>
          <div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
            <button onClick={saveUser} style={{flex:1,background:'#00e676',color:'#000',border:'none',borderRadius:'8px',padding:'11px',fontWeight:700,cursor:'pointer'}}>SALVAR</button>
            <button onClick={()=>setEditUser(null)} style={{flex:1,background:'#222',color:'#888',border:'1px solid #333',borderRadius:'8px',padding:'11px',cursor:'pointer'}}>Cancelar</button>
          </div>
        </Modal>
      )}

      {/* MODAL SALDO */}
      {balanceModal&&(
        <Modal title={`Ajustar Saldo — ${balanceModal.name}`} onClose={()=>setBalanceModal(null)}>
          <p style={{fontSize:'12px',color:'#555',marginBottom:'12px'}}>Use valor negativo para remover saldo.</p>
          <Field label="Valor (R$)"><Input type="number" step="0.01" placeholder="Ex: 100 ou -50" value={balanceModal.amount} onChange={e=>setBalanceModal({...balanceModal,amount:e.target.value})}/></Field>
          <Field label="Motivo"><Input placeholder="Ex: Bonus de cadastro" value={balanceModal.note} onChange={e=>setBalanceModal({...balanceModal,note:e.target.value})}/></Field>
          <div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
            <button onClick={()=>askConfirm(`Ajustar saldo de ${balanceModal.name} em R$ ${balanceModal.amount}?`,adjustBalance)} style={{flex:1,background:'#00e676',color:'#000',border:'none',borderRadius:'8px',padding:'11px',fontWeight:700,cursor:'pointer'}}>AJUSTAR</button>
            <button onClick={()=>setBalanceModal(null)} style={{flex:1,background:'#222',color:'#888',border:'1px solid #333',borderRadius:'8px',padding:'11px',cursor:'pointer'}}>Cancelar</button>
          </div>
        </Modal>
      )}

      {/* MODAL CONFIRMACAO */}
      {confirm&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
          <div style={{background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'24px',maxWidth:'380px',width:'100%',textAlign:'center'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'50%',background:'rgba(255,179,0,0.12)',border:'1px solid rgba(255,179,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
              <svg width="18" height="18" fill="none" stroke="#ffb300" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <p style={{fontSize:'14px',lineHeight:1.6,marginBottom:'6px'}}>{confirm.msg}</p>
            <p style={{fontSize:'11px',color:'#555',marginBottom:'20px'}}>Esta acao sera registrada na auditoria.</p>
            <div style={{display:'flex',gap:'8px'}}>
              <button onClick={async()=>{await confirm.action();setConfirm(null)}} style={{flex:1,background:'#00e676',color:'#000',border:'none',borderRadius:'8px',padding:'11px',fontWeight:700,cursor:'pointer'}}>Confirmar</button>
              <button onClick={()=>setConfirm(null)} style={{flex:1,background:'#222',color:'#888',border:'1px solid #333',borderRadius:'8px',padding:'11px',cursor:'pointer'}}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast&&(
        <div style={{position:'fixed',bottom:'24px',right:'24px',background:toast.type==='error'?'#f44336':'#00e676',color:toast.type==='error'?'#fff':'#000',padding:'12px 20px',borderRadius:'8px',fontSize:'13px',fontWeight:600,zIndex:999,animation:'slideIn 0.2s ease',boxShadow:'0 4px 20px rgba(0,0,0,0.4)'}}>
          {toast.text}
        </div>
      )}
    </div>
  )
}

function Badge({status}:{status:string}) {
  const map: any = {
    open:{bg:'rgba(0,200,83,0.12)',color:'#00c853'},
    active:{bg:'rgba(0,200,83,0.12)',color:'#00c853'},
    completed:{bg:'rgba(0,200,83,0.12)',color:'#00c853'},
    paid:{bg:'rgba(0,200,83,0.12)',color:'#00c853'},
    resolved:{bg:'rgba(99,102,241,0.12)',color:'#818cf8'},
    pending:{bg:'rgba(255,179,0,0.12)',color:'#ffb300'},
    processing:{bg:'rgba(255,179,0,0.12)',color:'#ffb300'},
    suspended:{bg:'rgba(255,179,0,0.12)',color:'#ffb300'},
    cancelled:{bg:'rgba(244,67,54,0.12)',color:'#f44336'},
    blocked:{bg:'rgba(244,67,54,0.12)',color:'#f44336'},
    rejected:{bg:'rgba(244,67,54,0.12)',color:'#f44336'},
    refunded:{bg:'rgba(244,67,54,0.12)',color:'#f44336'},
    admin:{bg:'rgba(99,102,241,0.12)',color:'#818cf8'},
    user:{bg:'rgba(255,255,255,0.06)',color:'#888'},
  }
  const st = map[status]||{bg:'rgba(255,255,255,0.06)',color:'#888'}
  return <span style={{display:'inline-block',padding:'2px 8px',borderRadius:'4px',fontSize:'11px',fontWeight:600,...st}}>{status}</span>
}

function Table({cols,rows}:{cols:string[],rows:any[][]}) {
  if (!rows.length) return (
    <div style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'12px',padding:'48px',textAlign:'center',color:'#555',fontSize:'13px'}}>
      Nenhum registro encontrado.
    </div>
  )
  return (
    <div style={{overflowX:'auto'}}>
      <table style={{width:'100%',borderCollapse:'collapse',background:'#1a1a1a',borderRadius:'12px',overflow:'hidden'}}>
        <thead>
          <tr>
            {cols.map(c=><th key={c} style={{textAlign:'left',padding:'10px 14px',fontSize:'10px',fontWeight:700,color:'#555',textTransform:'uppercase',letterSpacing:'0.08em',borderBottom:'1px solid #222'}}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row,i)=>(
            <tr key={i} className="row">
              {row.map((cell,j)=><td key={j} style={{padding:'10px 14px',borderBottom:'1px solid #1a1a1a',fontSize:'13px'}}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Modal({title,onClose,children}:{title:string,onClose:()=>void,children:any}) {
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
      <div style={{background:'#1a1a1a',border:'1px solid #333',borderRadius:'12px',padding:'24px',width:'100%',maxWidth:'480px',maxHeight:'90vh',overflowY:'auto'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
          <h3 style={{fontSize:'15px',fontWeight:700}}>{title}</h3>
          <button onClick={onClose} style={{background:'#222',border:'none',cursor:'pointer',color:'#888',width:'28px',height:'28px',borderRadius:'6px',fontSize:'16px',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>{children}</div>
      </div>
    </div>
  )
}

function Card({children}:{children:any}) {
  return <div style={{background:'#1a1a1a',border:'1px solid #222',borderRadius:'12px',padding:'20px'}}>{children}</div>
}

function Field({label,children}:{label:string,children:any}) {
  return (
    <div>
      <label style={{fontSize:'11px',color:'#555',display:'block',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.08em'}}>{label}</label>
      {children}
    </div>
  )
}

function Input({style,...props}:any) {
  return <input {...props} style={{width:'100%',background:'#222',border:'1px solid #2a2a2a',borderRadius:'7px',padding:'9px 12px',color:'#fff',fontSize:'13px',outline:'none',...style}} onFocus={(e:any)=>{e.target.style.borderColor='#00e676'}} onBlur={(e:any)=>{e.target.style.borderColor='#2a2a2a'}}/>
}

function Select({style,...props}:any) {
  return <select {...props} style={{width:'100%',background:'#222',border:'1px solid #2a2a2a',borderRadius:'7px',padding:'9px 12px',color:'#fff',fontSize:'13px',outline:'none',...style}}/>
}

function Btn({children,onClick,color='gray'}:{children:any,onClick:()=>void,color?:string}) {
  const map: any = {
    green:{background:'rgba(0,230,118,0.1)',color:'#00e676',border:'1px solid rgba(0,230,118,0.2)'},
    red:{background:'rgba(244,67,54,0.1)',color:'#f44336',border:'1px solid rgba(244,67,54,0.2)'},
    gray:{background:'#222',color:'#888',border:'1px solid #2a2a2a'},
  }
  return <button onClick={onClick} style={{padding:'5px 12px',borderRadius:'6px',cursor:'pointer',fontSize:'12px',fontWeight:600,fontFamily:'inherit',...map[color]}}>{children}</button>
}
