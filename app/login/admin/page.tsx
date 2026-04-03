'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Shield, BarChart3, Users, Settings } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://ww5y7zdj6dn9y63m6zk4ec7r.187.77.248.115.sslip.io'

export default function LoginAdmin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')
  const [siteName, setSiteName] = useState('Previmarket')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) {
      try {
        const u = JSON.parse(user)
        if (u.is_admin) { router.push('/admin'); return }
      } catch {}
    }
    fetch(API + '/api/admin/branding')
      .then(r => r.json())
      .then(d => {
        if (d.logo_url) setLogoUrl(API + d.logo_url)
        if (d.platform_name || d.site_name) setSiteName(d.platform_name || d.site_name)
      })
      .catch(() => {})
  }, [])

  async function handleLogin(e: any) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(API + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (!data.user?.is_admin) {
        throw new Error('Acesso negado. Esta área é exclusiva para administradores.')
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/admin')
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const red = '#ef4444'
  const redGlow = 'rgba(239,68,68,0.3)'
  const redBg = 'rgba(239,68,68,0.08)'
  const redBorder = 'rgba(239,68,68,0.2)'

  function Logo({ size = 36 }: { size?: number }) {
    if (logoUrl) return (
      <img src={logoUrl} alt="logo" style={{ height: size + 'px', maxWidth: '160px', objectFit: 'contain' }}
        onError={() => setLogoUrl('')} />
    )
    return (
      <div style={{ width: size + 'px', height: size + 'px', borderRadius: '8px', background: '#1a1a1a', border: `1px solid ${redBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Shield size={Math.round(size * 0.45)} color={red} strokeWidth={2} />
      </div>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#0a0a0a}
        .pc{display:flex;min-height:100vh;background:#0a0a0a;font-family:'Inter',system-ui,sans-serif}
        .pl{flex:1;background:linear-gradient(135deg,#0a0a0a 0%,#130a0a 50%,#0f0808 100%);display:flex;flex-direction:column;justify-content:space-between;padding:48px;position:relative;overflow:hidden}
        .pr{width:480px;flex-shrink:0;display:flex;flex-direction:column;justify-content:center;padding:48px;border-left:1px solid rgba(255,255,255,0.05)}
        input{font-family:'Inter',system-ui,sans-serif}
        .inp{width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:13px 13px 13px 40px;color:#fff;font-size:14px;outline:none;transition:border-color 0.2s}
        .inp:focus{border-color:rgba(239,68,68,0.4)}
        .inp-r{padding:13px 40px}
        .btn{width:100%;padding:15px;border-radius:10px;border:none;cursor:pointer;background:#ef4444;color:#fff;font-weight:800;font-size:15px;font-family:'Inter',system-ui,sans-serif;box-shadow:0 0 24px rgba(239,68,68,0.25);transition:opacity 0.2s}
        .btn:disabled{opacity:0.6;cursor:not-allowed}
        .feat{display:flex;align-items:center;gap:12px;padding:12px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px}
        @media(max-width:768px){
          .pl{display:none}
          .pr{width:100%;padding:40px 24px;border-left:none;justify-content:flex-start;padding-top:60px}
        }
      `}</style>

      <div className="pc">
        {/* LEFT */}
        <div className="pl">
          <div style={{position:'absolute',top:'-100px',right:'-100px',width:'360px',height:'360px',borderRadius:'50%',background:'radial-gradient(circle,rgba(239,68,68,0.08) 0%,transparent 70%)',pointerEvents:'none'}}/>
          <div style={{position:'absolute',bottom:'-80px',left:'-80px',width:'280px',height:'280px',borderRadius:'50%',background:'radial-gradient(circle,rgba(239,68,68,0.05) 0%,transparent 70%)',pointerEvents:'none'}}/>

          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:'10px',position:'relative'}}>
            <Logo size={36} />
            {!logoUrl && <span style={{color:'#fff',fontWeight:700,fontSize:'18px'}}>{siteName}</span>}
            <span style={{marginLeft:'4px',padding:'2px 8px',borderRadius:'6px',background:redBg,border:`1px solid ${redBorder}`,color:red,fontSize:'11px',fontWeight:600,letterSpacing:'0.05em'}}>Admin</span>
          </div>

          {/* Hero */}
          <div style={{position:'relative'}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:redBg,border:`1px solid ${redBorder}`,borderRadius:'20px',padding:'6px 14px',marginBottom:'24px'}}>
              <Shield size={11} color={red}/>
              <span style={{color:red,fontSize:'12px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em'}}>Acesso restrito</span>
            </div>
            <h1 style={{fontSize:'40px',fontWeight:800,color:'#fff',lineHeight:1.2,marginBottom:'16px',fontFamily:"'Manrope',sans-serif"}}>
              PAINEL DE<br/>ADMINISTRAÇÃO<br/>
              <span style={{color:red,textShadow:`0 0 30px ${redGlow}`}}>{siteName.toUpperCase()}</span>
            </h1>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:'15px',lineHeight:1.6,maxWidth:'360px'}}>
              Área restrita. Apenas administradores autorizados podem acessar este painel.
            </p>

            <div style={{display:'flex',flexDirection:'column',gap:'10px',marginTop:'40px',maxWidth:'340px'}}>
              {[
                {icon:BarChart3,label:'Dashboard completo',desc:'Visão geral de depósitos, saques e apostas'},
                {icon:Users,label:'Gestão de usuários',desc:'Gerenciar jogadores, gerentes e afiliados'},
                {icon:Settings,label:'Configurações da plataforma',desc:'Taxas, odds, estilo e integrações'},
              ].map(({icon:Icon,label,desc})=>(
                <div key={label} className="feat">
                  <div style={{width:'32px',height:'32px',borderRadius:'8px',background:redBg,border:`1px solid ${redBorder}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <Icon size={15} color={red}/>
                  </div>
                  <div>
                    <p style={{color:'#ccc',fontWeight:600,fontSize:'13px'}}>{label}</p>
                    <p style={{color:'rgba(255,255,255,0.3)',fontSize:'11px',marginTop:'1px'}}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p style={{color:'rgba(255,255,255,0.15)',fontSize:'12px',position:'relative'}}>© 2026 {siteName} — Painel Administrativo</p>
        </div>

        {/* RIGHT */}
        <div className="pr">
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'32px'}}>
            <Logo size={30} />
            {!logoUrl && <span style={{color:'#fff',fontWeight:700,fontSize:'15px'}}>{siteName}</span>}
            <span style={{padding:'2px 7px',borderRadius:'5px',background:redBg,border:`1px solid ${redBorder}`,color:red,fontSize:'10px',fontWeight:600}}>Admin</span>
          </div>

          <div style={{marginBottom:'28px'}}>
            <h2 style={{fontSize:'26px',fontWeight:800,color:'#fff',marginBottom:'6px',fontFamily:"'Manrope',sans-serif"}}>Acesso administrativo</h2>
            <p style={{color:'rgba(255,255,255,0.35)',fontSize:'14px'}}>Entre com suas credenciais de administrador</p>
          </div>

          {error && (
            <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:'8px',padding:'12px 16px',marginBottom:'20px',color:'#f87171',fontSize:'14px',lineHeight:1.4,display:'flex',gap:'8px',alignItems:'flex-start'}}>
              <Shield size={14} color="#f87171" style={{marginTop:'1px',flexShrink:0}}/>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div>
              <label style={{fontSize:'12px',color:'rgba(255,255,255,0.4)',display:'block',marginBottom:'6px'}}>Email</label>
              <div style={{position:'relative'}}>
                <Mail style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',width:'15px',height:'15px',color:'rgba(255,255,255,0.25)'}}/>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="admin@email.com" className="inp"/>
              </div>
            </div>
            <div>
              <label style={{fontSize:'12px',color:'rgba(255,255,255,0.4)',display:'block',marginBottom:'6px'}}>Senha</label>
              <div style={{position:'relative'}}>
                <Lock style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',width:'15px',height:'15px',color:'rgba(255,255,255,0.25)'}}/>
                <input type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Sua senha" className="inp inp-r"/>
                <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:'absolute',right:'13px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.25)',padding:0}}>
                  {showPass?<EyeOff style={{width:'15px',height:'15px'}}/>:<Eye style={{width:'15px',height:'15px'}}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn" style={{marginTop:'6px'}}>
              {loading ? 'Verificando...' : 'ACESSAR PAINEL'}
            </button>
          </form>

          <div style={{marginTop:'28px',padding:'14px 16px',background:'rgba(239,68,68,0.04)',border:'1px solid rgba(239,68,68,0.1)',borderRadius:'10px',display:'flex',gap:'10px',alignItems:'flex-start'}}>
            <Shield size={13} color="rgba(239,68,68,0.5)" style={{marginTop:'1px',flexShrink:0}}/>
            <p style={{color:'rgba(255,255,255,0.25)',fontSize:'12px',lineHeight:1.6}}>
              Acesso monitorado e registrado. Não compartilhe suas credenciais.<br/>
              Não é admin? <a href="/login" style={{color:'rgba(255,255,255,0.4)',textDecoration:'none',fontWeight:600}}>Voltar ao login</a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
