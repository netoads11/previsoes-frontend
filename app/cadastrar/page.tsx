'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Eye, EyeOff, X } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://187.77.248.115:3001'

export default function Cadastrar() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [refCode, setRefCode] = useState('')

  useEffect(() => {
    if (localStorage.getItem('token')) { router.push('/'); return }
    const p = new URLSearchParams(window.location.search)
    const r = p.get('ref')
    if (r) setRefCode(r.toUpperCase())
  }, [])

  async function handleCadastro(e: any) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(API + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, ...(refCode ? { ref: refCode } : {}) })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .auth-container {
          display: flex;
          min-height: 100vh;
          background: #0d0d0d;
          font-family: Kanit, sans-serif;
        }
        .auth-left {
          flex: 1;
          background: linear-gradient(135deg, #0a0a0a 0%, #0d1a00 50%, #0a0f00 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }
        .auth-right {
          width: 480px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px;
          border-left: 1px solid rgba(255,255,255,0.06);
        }
        @media (max-width: 768px) {
          .auth-container { flex-direction: column; }
          .auth-left { display: none; }
          .auth-right {
            width: 100%;
            padding: 40px 24px;
            border-left: none;
            justify-content: flex-start;
            padding-top: 60px;
          }
        }
      `}</style>
      <div className="auth-container">
        <button
          onClick={() => router.push('/')}
          style={{position:'fixed',top:'16px',right:'16px',width:'36px',height:'36px',borderRadius:'50%',background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.18)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',zIndex:50}}
        >
          <X style={{width:'18px',height:'18px',color:'#fff'}}/>
        </button>
        <div className="auth-left">
          <div style={{position:'absolute',top:'-80px',right:'-80px',width:'300px',height:'300px',borderRadius:'50%',background:'radial-gradient(circle,rgba(106,221,0,0.15) 0%,transparent 70%)'}}/>
          <div style={{position:'absolute',bottom:'-60px',left:'-60px',width:'250px',height:'250px',borderRadius:'50%',background:'radial-gradient(circle,rgba(106,221,0,0.08) 0%,transparent 70%)'}}/>
          <div style={{display:'flex',alignItems:'center',gap:'10px',position:'relative'}}>
            <div style={{width:'36px',height:'36px',borderRadius:'8px',background:'#6ADD00',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 16px rgba(106,221,0,0.5)'}}>
              <span style={{color:'#0a0a0a',fontWeight:800,fontSize:'16px'}}>P</span>
            </div>
            <span style={{color:'#fff',fontWeight:700,fontSize:'18px'}}>Previmarket</span>
          </div>
          <div style={{position:'relative'}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'rgba(106,221,0,0.1)',border:'1px solid rgba(106,221,0,0.2)',borderRadius:'20px',padding:'6px 14px',marginBottom:'24px'}}>
              <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#6ADD00'}}/>
              <span style={{color:'#6ADD00',fontSize:'12px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em'}}>Plataforma ao vivo</span>
            </div>
            <h1 style={{fontSize:'40px',fontWeight:800,color:'#fff',lineHeight:1.2,marginBottom:'16px',textTransform:'uppercase'}}>
              PREVEJA O<br/>
              <span style={{color:'#6ADD00',textShadow:'0 0 30px rgba(106,221,0,0.4)'}}>FUTURO</span><br/>
              E GANHE
            </h1>
            <p style={{color:'rgba(255,255,255,0.5)',fontSize:'16px',lineHeight:1.6,maxWidth:'360px'}}>
              Aposte em eventos reais com dinheiro real via PIX.
            </p>
            <div style={{display:'flex',gap:'32px',marginTop:'40px'}}>
              {[{label:'Mercados ativos',value:'100+'},{label:'Usuarios',value:'5k+'},{label:'Pagamentos',value:'R$1M+'}].map(stat=>(
                <div key={stat.label}>
                  <div style={{fontSize:'22px',fontWeight:800,color:'#fff',marginBottom:'4px'}}>{stat.value}</div>
                  <span style={{fontSize:'12px',color:'rgba(255,255,255,0.4)'}}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <p style={{color:'rgba(255,255,255,0.2)',fontSize:'12px',position:'relative'}}>© 2026 Previmarket</p>
        </div>

        <div className="auth-right">
          <div style={{marginBottom:'32px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'24px'}}>
              <div style={{width:'30px',height:'30px',borderRadius:'7px',background:'#6ADD00',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <span style={{color:'#0a0a0a',fontWeight:800,fontSize:'13px'}}>P</span>
              </div>
              <span style={{color:'#fff',fontWeight:700,fontSize:'16px'}}>Previmarket</span>
            </div>
            <h2 style={{fontSize:'26px',fontWeight:800,color:'#fff',marginBottom:'6px'}}>Crie sua conta!</h2>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:'14px'}}>Comece a concorrer a premios hoje!</p>
          </div>

          {refCode && (
            <div style={{background:'rgba(106,221,0,0.08)',border:'1px solid rgba(106,221,0,0.2)',borderRadius:'8px',padding:'10px 14px',marginBottom:'16px',display:'flex',alignItems:'center',gap:'8px'}}>
              <span style={{color:'#6ADD00',fontSize:'13px'}}>Indicado por: <strong>{refCode}</strong></span>
            </div>
          )}

          {error && (
            <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'8px',padding:'12px 16px',marginBottom:'20px',color:'#f87171',fontSize:'14px'}}>
              {error}
            </div>
          )}

          <form onSubmit={handleCadastro} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div>
              <label style={{fontSize:'12px',color:'rgba(255,255,255,0.5)',display:'block',marginBottom:'6px'}}>Nome completo</label>
              <div style={{position:'relative'}}>
                <User style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',width:'15px',height:'15px',color:'rgba(255,255,255,0.3)'}}/>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} required placeholder="Seu nome"
                  style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'13px 13px 13px 40px',color:'#fff',fontSize:'14px',outline:'none',fontFamily:'Kanit,sans-serif'}}
                  onFocus={e=>e.target.style.borderColor='rgba(106,221,0,0.5)'}
                  onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
              </div>
            </div>
            <div>
              <label style={{fontSize:'12px',color:'rgba(255,255,255,0.5)',display:'block',marginBottom:'6px'}}>Email</label>
              <div style={{position:'relative'}}>
                <Mail style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',width:'15px',height:'15px',color:'rgba(255,255,255,0.3)'}}/>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="exemplo@gmail.com"
                  style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'13px 13px 13px 40px',color:'#fff',fontSize:'14px',outline:'none',fontFamily:'Kanit,sans-serif'}}
                  onFocus={e=>e.target.style.borderColor='rgba(106,221,0,0.5)'}
                  onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
              </div>
            </div>
            <div>
              <label style={{fontSize:'12px',color:'rgba(255,255,255,0.5)',display:'block',marginBottom:'6px'}}>Senha</label>
              <div style={{position:'relative'}}>
                <Lock style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',width:'15px',height:'15px',color:'rgba(255,255,255,0.3)'}}/>
                <input type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} placeholder="Minimo 8 caracteres"
                  style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'13px 40px 13px 40px',color:'#fff',fontSize:'14px',outline:'none',fontFamily:'Kanit,sans-serif'}}
                  onFocus={e=>e.target.style.borderColor='rgba(106,221,0,0.5)'}
                  onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
                <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:'absolute',right:'13px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.3)',padding:'0'}}>
                  {showPass?<EyeOff style={{width:'15px',height:'15px'}}/>:<Eye style={{width:'15px',height:'15px'}}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              style={{width:'100%',padding:'15px',borderRadius:'10px',border:'none',cursor:loading?'not-allowed':'pointer',background:'#6ADD00',color:'#0a0a0a',fontWeight:800,fontSize:'15px',fontFamily:'Kanit,sans-serif',boxShadow:'0 0 24px rgba(106,221,0,0.35)',opacity:loading?0.7:1,marginTop:'6px',letterSpacing:'0.02em'}}>
              {loading?'Criando conta...':'CRIAR CONTA'}
            </button>
          </form>

          <div style={{display:'flex',alignItems:'center',gap:'12px',margin:'20px 0'}}>
            <div style={{flex:1,height:'1px',background:'rgba(255,255,255,0.06)'}}/>
            <span style={{color:'rgba(255,255,255,0.3)',fontSize:'13px'}}>ou</span>
            <div style={{flex:1,height:'1px',background:'rgba(255,255,255,0.06)'}}/>
          </div>

          <p style={{textAlign:'center',color:'rgba(255,255,255,0.4)',fontSize:'14px'}}>
            Ja tem uma conta?{' '}
            <Link href="/login" style={{color:'#6ADD00',fontWeight:600,textDecoration:'none'}}>Entrar</Link>
          </p>
        </div>
      </div>
    </>
  )
}
