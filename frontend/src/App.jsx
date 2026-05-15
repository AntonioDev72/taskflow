import { AuthProvider, useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import TasksPage from './pages/TasksPage'

function AppContent() {
  const { user, loading } = useAuth()
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',color:'#888'}}>Loading...</div>
  return user ? <TasksPage /> : <AuthPage />
}

export default function App() {
  return <AuthProvider><AppContent /></AuthProvider>
}
