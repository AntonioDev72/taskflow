import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const s = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' },
  card: { background:'#fff', border:'1px solid #e5e5e3', borderRadius:14, padding:'2rem', width:'100%', maxWidth:380 },
  logo: { display:'flex', alignItems:'center', gap:10, marginBottom:'1.5rem' },
  logoIcon: { width:34, height:34, borderRadius:9, background:'#185FA5', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700 },
  logoText: { fontSize:17, fontWeight:600 },
  tabs: { display:'flex', border:'1px solid #e5e5e3', borderRadius:8, overflow:'hidden', marginBottom:'1.5rem' },
  tab: { flex:1, padding:'8px', fontSize:13, background:'transparent', border:'none', color:'#888' },
  activeTab: { flex:1, padding:'8px', fontSize:13, background:'#185FA5', border:'none', color:'white', fontWeight:500 },
  field: { marginBottom:'1rem' },
  label: { display:'block', fontSize:13, color:'#666', marginBottom:5 },
  input: { width:'100%', padding:'9px 12px', fontSize:14, border:'1px solid #e5e5e3', borderRadius:8, outline:'none' },
  error: { fontSize:13, color:'#c0392b', marginBottom:'0.75rem', padding:'8px 10px', background:'#fdf0ef', borderRadius:6 },
  btn: { width:'100%', padding:10, background:'#185FA5', color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:500 },
}

export default function AuthPage() {
  const { login, register } = useAuth()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      if (tab === 'login') await login(form.email, form.password)
      else await register(form.name, form.email, form.password)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}><div style={s.logoIcon}>✓</div><span style={s.logoText}>TaskFlow</span></div>
        <div style={s.tabs}>
          <button style={tab==='login' ? s.activeTab : s.tab} onClick={() => setTab('login')}>Sign in</button>
          <button style={tab==='register' ? s.activeTab : s.tab} onClick={() => setTab('register')}>Create account</button>
        </div>
        <form onSubmit={handle}>
          {tab === 'register' && <div style={s.field}><label style={s.label}>Full name</label><input style={s.input} placeholder="Jane Doe" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required /></div>}
          <div style={s.field}><label style={s.label}>Email</label><input style={s.input} type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required /></div>
          <div style={s.field}><label style={s.label}>Password</label><input style={s.input} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password:e.target.value})} required /></div>
          {error && <p style={s.error}>{error}</p>}
          <button type="submit" style={s.btn} disabled={loading}>{loading ? 'Please wait...' : tab==='login' ? 'Sign in' : 'Create account'}</button>
        </form>
      </div>
    </div>
  )
}
