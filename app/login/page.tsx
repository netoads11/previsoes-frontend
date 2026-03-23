'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, TrendingUp } from 'lucide-react'

const API = 'http://187.77.248.115:3001'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      if (data.user.is_admin) router.push('/admin')
      else router.push('/')
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'var(--background)',fontFamily:'Kanit,sans-serif'}}>
      <div style={{flex:1,background:'linear-gradient(135deg,#0a0a0a 0%,#0d1a00 50%,#0a0f00 100%)',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'48px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-80px',right:'-80px',width:'300px',height:'300px',borderRadius:'50%',background:'radial-gradient(circle,rgba(106,221,0,0.15) 0%,transparent 70%)'}}/>
        <div style={{position:'absolute',bottom:'-60px',left:'-60px',width:'250px',height:'250px',borderRadius:'50%',background:'radial-gradient(circle,rgba(106,221,0,0.08) 0%,transparent 70%)'}}/>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'36px',height:'36px',borderRadius:'8px',background:'var(--primary)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 16px rgba(106,221,0,0.5)'}}>
            <span style={{color:'#0a0a0a',fontWeight:800,fontSize:'16px'}}>P</span>
          </div>
          <span style={{color:'var(--foreground)',fontWeight:700,fontSize:'18px'}}>Previmarket</span>
        </div>
        <div>
          <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'rgba(106,221,0,0.1)',border:'1px solid rgba(106,221,0,0.2)',borderRadius:'20px',padding:'6px 14px',marginBottom:'24px'}}>
            <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--primary)'}}/>
            <span style={{color:'var(--primary)',fontSize:'12px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em'}}>Plataforma ao vivo</span>
          </div>
          <h1 style={{fontSize:'40px',fontWeight:800,color:'var(--foreground)',lineHeight:1.2,marginBottom:'16px',textTransform:'uppercase'}}>
            BEM VINDO<br/>DE VOLTA AO<br/>
            <span style={{color:'var(--primary)',textShadow:'0 0 30px rgba(106,221,0,0.4)'}}>PREVIMARKET</span>
          </h1>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:'16px',lineHeight:1.6,maxWidth:'360px'}}>
            Acesse sua conta e continue apostando nos melhores mercados de previsao.
          </p>
          <div style={{display:'flex',gap:'32px',marginTop:'40px'}}>
            {[{label:'Mercados ativos',value:'100+'},{label:'Usuarios',value:'5k+'},{label:'Pagamentos',value:'R$1M+'}].map(stat=>(
              <div key={stat.label}>
                <div style={{fontSize:'22px',fontWeight:800,color:'var(--foreground)',marginBottom:'4px'}}>{stat.value}</div>
                <span style={{fontSize:'12px',color:'rgba(255,255,255,0.4)'}}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{color:'rgba(255,255,255,0.2)',fontSize:'12px'}}>© 2026 Previmarket</p>
      </div>
      <div style={{width:'480px',flexShrink:0,display:'flex',flexDirection:'column',justifyContent:'center',padding:'48px',borderLeft:'1px solid var(--border)'}}>
        <div style={{marginBottom:'40px'}}>
          <h2 style={{fontSize:'28px',fontWeight:800,color:'var(--foreground)',marginBottom:'8px'}}>Bem vindo de volta!</h2>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:'15px'}}>Entre na sua conta para continuar</p>
        </div>
        {error && (
          <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'8px',padding:'12px 16px',marginBottom:'20px',color:'#f87171',fontSize:'14px'}}>
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          <div>
            <label style={{fontSize:'13px',color:'rgba(255,255,255,0.5)',display:'block',marginBottom:'6px'}}>Email</label>
            <div style={{position:'relative'}}>
              <Mail style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',width:'16px',height:'16px',color:'rgba(255,255,255,0.3)'}}/>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="exemplo@gmail.com" style={{width:'100%',background:'var(--muted)',border:'1px solid var(--border)',borderRadius:'10px',padding:'14px 14px 14px 42px',color:'var(--foreground)',fontSize:'15px',outline:'none',fontFamily:'Kanit,sans-serif'}} onFocus={e=>e.target.style.borderColor='rgba(106,221,0,0.5)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
            </div>
          </div>
          <div>
            <label style={{fontSize:'13px',color:'rgba(255,255,255,0.5)',display:'block',marginBottom:'6px'}}>Senha</label>
            <div style={{position:'relative'}}>
              <Lock style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',width:'16px',height:'16px',color:'rgba(255,255,255,0.3)'}}/>
              <input type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Sua senha" style={{width:'100%',background:'var(--muted)',border:'1px solid var(--border)',borderRadius:'10px',padding:'14px 42px 14px 42px',color:'var(--foreground)',fontSize:'15px',outline:'none',fontFamily:'Kanit,sans-serif'}} onFocus={e=>e.target.style.borderColor='rgba(106,221,0,0.5)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
              <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:'absolute',right:'14px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.3)',padding:'0'}}>
                {showPass?<EyeOff style={{width:'16px',height:'16px'}}/>:<Eye style={{width:'16px',height:'16px'}}/>}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{width:'100%',padding:'16px',borderRadius:'10px',border:'none',cursor:loading?'not-allowed':'pointer',background:'var(--primary)',color:'#0a0a0a',fontWeight:800,fontSize:'16px',fontFamily:'Kanit,sans-serif',boxShadow:'0 0 24px rgba(106,221,0,0.35)',opacity:loading?0.7:1,marginTop:'8px'}}>
            {loading?'Entrando...':'ENTRAR'}
          </button>
        </form>
        <div style={{display:'flex',alignItems:'center',gap:'12px',margin:'24px 0'}}>
          <div style={{flex:1,height:'1px',background:'var(--border)'}}/>
          <span style={{color:'rgba(255,255,255,0.3)',fontSize:'13px'}}>ou</span>
          <div style={{flex:1,height:'1px',background:'var(--border)'}}/>
        </div>
        <p style={{textAlign:'center',color:'rgba(255,255,255,0.4)',fontSize:'14px'}}>
          Nao tem conta? <Link href="/cadastrar" style={{color:'var(--primary)',fontWeight:600,textDecoration:'none'}}>Criar conta gratis</Link>
        </p>
      </div>
    </div>
  )
}
