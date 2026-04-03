'use client'
import { useState } from 'react'

export default function DepositModal({onClose, balance, setBalance, minDeposit, API}: {
  onClose: ()=>void
  balance: number
  setBalance: (fn:(b:number)=>number)=>void
  minDeposit: string
  API: string
}) {
  const [step, setStep] = useState<'amount'|'pix'|'done'>('amount')
  const [amount, setAmount] = useState<string>('')
  const [pixCode, setPixCode] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)

  const num = Number(amount) || 0
  const min = Number(minDeposit) || 10
  const QUICK = ['5','10','30','50','100']

  async function requestDeposit() {
    if (num < min) { setError(`Valor mínimo: R$ ${Number(min).toFixed(2).replace('.',',')}`) ; return }
    setError('')
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(API + '/api/wallet/deposit', {
        method: 'POST',
        headers: {'Content-Type':'application/json', 'Authorization':'Bearer '+(token||'')},
        body: JSON.stringify({ amount: num })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar depósito')
      setPixCode(data.pix_code || data.code || `PIX-${Date.now()}`)
      setStep('pix')
    } catch(e:any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function copyPix() {
    navigator.clipboard.writeText(pixCode).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2500) }).catch(()=>{})
  }

  function simulateConfirm() {
    setBalance((b:number) => b + num)
    setStep('done')
  }

  return (
    <div style={{
      position:'fixed',inset:0,zIndex:9999,
      background:'#0f0f0f',overflowY:'auto',
      WebkitOverflowScrolling:'touch' as any,
    }}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 20px 0'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{width:'3px',height:'22px',background:'#00e676',borderRadius:'2px',flexShrink:0}}/>
          <span style={{fontSize:'18px',fontWeight:800,color:'#fff',letterSpacing:'-0.01em'}}>Depositar</span>
        </div>
        <button onClick={onClose} style={{width:'32px',height:'32px',borderRadius:'50%',background:'var(--card)',border:'1px solid rgba(255,255,255,0.1)',color:'var(--muted-foreground)',fontSize:'18px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>×</button>
      </div>

      <p style={{margin:'10px 20px 0',fontSize:'12px',color:'var(--muted-foreground)'}}>
        Saldo atual: <span style={{color:'#fff',fontWeight:600}}>R$ {balance.toFixed(2).replace('.',',')}</span>
      </p>

      {step === 'amount' && (
        <div style={{padding:'0 20px'}}>
          <div style={{marginTop:'20px',display:'flex',alignItems:'center',gap:'14px',background:'#161616',border:'1px solid var(--border)',borderRadius:'14px',padding:'14px 16px'}}>
            <div style={{width:'44px',height:'44px',borderRadius:'10px',background:'var(--muted)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M6.5 17.5L2 13l4.5-4.5 1.06 1.06L4.12 13l3.44 3.44L6.5 17.5z" fill="#00e676"/>
                <path d="M17.5 17.5l4.5-4.5-4.5-4.5-1.06 1.06L19.88 13l-3.44 3.44L17.5 17.5z" fill="#00e676"/>
                <path d="M10.07 17.01L8.5 15.44l4.93-4.93 1.57 1.57-4.93 4.93z" fill="#00e676"/>
                <path d="M13.93 6.99L15.5 8.56l-4.93 4.93-1.57-1.57 4.93-4.93z" fill="#00e676"/>
              </svg>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:'15px',fontWeight:700,color:'#fff',lineHeight:1.2}}>Pix</div>
              <div style={{fontSize:'11px',color:'var(--muted-foreground)',marginTop:'2px'}}>Depósito Real brasileiro</div>
            </div>
            <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'20px',padding:'4px 10px',fontSize:'11px',fontWeight:600,color:'var(--muted-foreground)',flexShrink:0}}>5 minutos</div>
          </div>

          <p style={{fontSize:'11px',color:'var(--muted-foreground)',margin:'18px 0 8px',fontWeight:500}}>Valor a ser depositado:</p>

          <div style={{display:'flex',alignItems:'center',background:'var(--card)',border:'1px solid var(--border)',borderRadius:'10px',overflow:'hidden',transition:'border-color 0.15s, box-shadow 0.15s'}}>
            <span style={{padding:'0 14px',fontSize:'15px',fontWeight:700,color:'var(--muted-foreground)',borderRight:'1px solid var(--border)',height:'48px',display:'flex',alignItems:'center',flexShrink:0}}>R$</span>
            <input
              type="number" min={min} step="1" placeholder="0,00" value={amount}
              onChange={e=>{setAmount(e.target.value);setError('')}}
              style={{flex:1,padding:'0 14px',height:'48px',background:'transparent',border:'none',color:'#fff',fontSize:'18px',fontWeight:700,outline:'none',appearance:'none' as any}}
              onFocus={e=>{const w=e.target.parentElement as HTMLElement;if(w){w.style.borderColor='#00e676';w.style.boxShadow='0 0 0 2px rgba(0,230,118,0.15)'}}}
              onBlur={e=>{const w=e.target.parentElement as HTMLElement;if(w){w.style.borderColor='#333';w.style.boxShadow='none'}}}
            />
          </div>

          <div style={{display:'flex',overflowX:'auto',gap:'8px',marginTop:'12px',paddingBottom:'2px',scrollbarWidth:'none' as any}}>
            {QUICK.map(v=>(
              <button key={v} onClick={()=>{setAmount(v);setError('')}} style={{
                padding:'7px 18px',borderRadius:'9999px',fontSize:'13px',fontWeight:700,cursor:'pointer',flexShrink:0,
                border:`1.5px solid ${amount===v?'#00e676':'rgba(0,230,118,0.35)'}`,
                background:amount===v?'#00e676':'transparent',color:amount===v?'#000':'#00e676',transition:'all 0.12s',
              }}>R${v}</button>
            ))}
          </div>

          <p style={{fontSize:'11px',color:'var(--muted-foreground)',margin:'10px 0 0'}}>Depósito mínimo: R$ {Number(min).toFixed(2).replace('.',',')}</p>

          {error && (
            <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'10px',padding:'10px 14px',marginTop:'12px',textAlign:'center'}}>
              <p style={{color:'#ef4444',fontSize:'13px',fontWeight:600}}>{error}</p>
            </div>
          )}

          <button disabled={num < min || loading} onClick={requestDeposit}
            style={{marginTop:'20px',width:'100%',height:'52px',borderRadius:'10px',border:'none',background:num>=min?'#00e676':'#1e1e1e',color:num>=min?'#000':'#333',fontWeight:900,fontSize:'15px',letterSpacing:'0.04em',cursor:num>=min?'pointer':'not-allowed',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',boxShadow:num>=min?'0 0 24px rgba(0,230,118,0.25)':'none',transition:'all 0.2s'}}
            onMouseEnter={e=>{if(num>=min)(e.currentTarget as HTMLButtonElement).style.background='#33eb91'}}
            onMouseLeave={e=>{if(num>=min)(e.currentTarget as HTMLButtonElement).style.background='#00e676'}}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="5" y="5" width="4" height="4" rx="0.5" fill="currentColor"/>
              <rect x="15" y="5" width="4" height="4" rx="0.5" fill="currentColor"/>
              <rect x="5" y="15" width="4" height="4" rx="0.5" fill="currentColor"/>
              <rect x="13" y="13" width="2" height="2" fill="currentColor"/>
              <rect x="17" y="13" width="2" height="2" fill="currentColor"/>
              <rect x="13" y="17" width="2" height="2" fill="currentColor"/>
              <rect x="17" y="17" width="4" height="4" rx="0.5" fill="currentColor"/>
            </svg>
            {loading ? 'Gerando...' : 'GERAR QR CODE'}
          </button>
        </div>
      )}

      {step === 'pix' && (
        <div style={{padding:'0 20px'}}>
          <div style={{marginTop:'24px',textAlign:'center'}}>
            <div style={{width:'180px',height:'180px',borderRadius:'16px',margin:'0 auto 16px',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 40px rgba(0,230,118,0.15)'}}>
              <div style={{textAlign:'center'}}><div style={{fontSize:'48px'}}>📱</div><div style={{fontSize:'10px',color:'#333',fontWeight:700,marginTop:'4px'}}>QR CODE PIX</div></div>
            </div>
            <p style={{fontSize:'13px',color:'var(--muted-foreground)',marginBottom:'6px'}}>Valor: <span style={{color:'#fff',fontWeight:700}}>R$ {num.toFixed(2).replace('.',',')}</span></p>
            <p style={{fontSize:'11px',color:'#444',marginBottom:'16px'}}>Escaneie o QR ou copie o código abaixo</p>
          </div>
          <div style={{background:'#161616',borderRadius:'12px',padding:'14px 16px',border:'1px solid var(--border)',marginBottom:'12px'}}>
            <p style={{fontSize:'9px',color:'var(--muted-foreground)',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'6px'}}>CÓDIGO PIX COPIA E COLA</p>
            <p style={{fontSize:'12px',color:'#ccc',wordBreak:'break-all',fontFamily:'monospace',lineHeight:1.5}}>{pixCode}</p>
          </div>
          <button onClick={copyPix} style={{width:'100%',padding:'15px',borderRadius:'12px',border:'none',background:copied?'rgba(0,230,118,0.15)':'#00e676',color:copied?'#00e676':'#000',fontWeight:900,fontSize:'15px',cursor:'pointer',marginBottom:'10px',outline:copied?'1px solid rgba(0,230,118,0.4)':'none',transition:'all 0.2s'}}>
            {copied ? '✓ CÓDIGO COPIADO!' : '📋 COPIAR CÓDIGO PIX'}
          </button>
          <button onClick={simulateConfirm} style={{width:'100%',padding:'13px',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'var(--muted-foreground)',fontWeight:600,fontSize:'13px',cursor:'pointer'}}>
            Já paguei — confirmar depósito
          </button>
          <p style={{fontSize:'10px',color:'#333',textAlign:'center',marginTop:'12px'}}>O saldo será creditado automaticamente após confirmação do pagamento</p>
        </div>
      )}

      {step === 'done' && (
        <div style={{padding:'40px 20px',textAlign:'center'}}>
          <div style={{fontSize:'72px',marginBottom:'16px'}}>🎉</div>
          <h3 style={{fontSize:'22px',fontWeight:900,color:'#fff',marginBottom:'8px'}}>Depósito adicionado!</h3>
          <p style={{fontSize:'14px',color:'var(--muted-foreground)',marginBottom:'8px'}}>R$ <span style={{color:'#00e676',fontWeight:700}}>{num.toFixed(2).replace('.',',')}</span> creditados na sua conta</p>
          <p style={{fontSize:'13px',color:'#444',marginBottom:'32px'}}>Novo saldo: <span style={{color:'#00e676',fontWeight:700}}>R$ {balance.toFixed(2).replace('.',',')}</span></p>
          <button onClick={onClose} style={{width:'100%',padding:'17px',borderRadius:'14px',border:'none',background:'#00e676',color:'#000',fontWeight:900,fontSize:'16px',cursor:'pointer',boxShadow:'0 0 28px rgba(0,230,118,0.3)'}}>
            APOSTAR AGORA
          </button>
        </div>
      )}

      <div style={{height:'40px'}}/>
    </div>
  )
}
