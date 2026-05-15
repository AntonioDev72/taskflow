import { createContext, useContext, useState, useEffect } from 'react'
const AuthContext = createContext(null)
const API = 'https://taskflow-jiw6.onrender.com/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => { if (data.user) setUser(data.user); else logout(); })
        .catch(logout)
        .finally(() => setLoading(false))
    } else { setLoading(false) }
  }, [])

  const login = async (email, password) => {
    const res = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    localStorage.setItem('token', data.token); setToken(data.token); setUser(data.user)
  }

  const register = async (name, email, password) => {
    const res = await fetch(`${API}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    localStorage.setItem('token', data.token); setToken(data.token); setUser(data.user)
  }

  const logout = () => { localStorage.removeItem('token'); setToken(null); setUser(null) }

  return <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
export { API }
