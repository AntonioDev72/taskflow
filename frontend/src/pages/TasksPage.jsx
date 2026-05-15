import { useState, useEffect } from 'react'
import { useAuth, API } from '../context/AuthContext'

export default function TasksPage() {
  const { user, token, logout } = useAuth()
  const [tasks, setTasks] = useState([])
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [filter, setFilter] = useState('all')
  const [editTask, setEditTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    const res = await fetch(`${API}/tasks`, { headers })
    const data = await res.json()
    setTasks(data.tasks || []); setLoading(false)
  }

  const addTask = async (e) => {
    e.preventDefault(); if (!text.trim()) return
    const res = await fetch(`${API}/tasks`, { method:'POST', headers, body: JSON.stringify({ text, priority }) })
    const data = await res.json()
    setTasks([data.task, ...tasks]); setText('')
  }

  const toggleTask = async (task) => {
    const res = await fetch(`${API}/tasks/${task._id}`, { method:'PUT', headers, body: JSON.stringify({ done: !task.done }) })
    const data = await res.json()
    setTasks(tasks.map(t => t._id === task._id ? data.task : t))
  }

  const deleteTask = async (id) => {
    await fetch(`${API}/tasks/${id}`, { method:'DELETE', headers })
    setTasks(tasks.filter(t => t._id !== id))
  }

  const saveEdit = async () => {
    const res = await fetch(`${API}/tasks/${editTask._id}`, { method:'PUT', headers, body: JSON.stringify({ text: editTask.text, priority: editTask.priority }) })
    const data = await res.json()
    setTasks(tasks.map(t => t._id === editTask._id ? data.task : t)); setEditTask(null)
  }

  const filtered = tasks.filter(t => {
    if (filter === 'active') return !t.done
    if (filter === 'done') return t.done
    if (['high','medium','low'].includes(filter)) return t.priority === filter
    return true
  })

  const initials = user?.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)
  const done = tasks.filter(t => t.done).length

  const btn = (label, f) => ({
    padding:'5px 12px', fontSize:12, borderRadius:100, border:'1px solid #e5e5e3',
    background: filter===f ? '#185FA5' : '#fff', color: filter===f ? 'white' : '#666', cursor:'pointer'
  })

  return (
    <div style={{minHeight:'100vh', background:'#f5f5f4'}}>
      <header style={{background:'#fff', borderBottom:'1px solid #e5e5e3', padding:'0 1.5rem', height:52, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          <div style={{width:28, height:28, background:'#185FA5', color:'white', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700}}>✓</div>
          <span style={{fontSize:15, fontWeight:600}}>TaskFlow</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{width:30, height:30, borderRadius:'50%', background:'#dbeafe', color:'#1e40af', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:600}}>{initials}</div>
          <span style={{fontSize:13, color:'#555'}}>{user?.name?.split(' ')[0]}</span>
          <button onClick={logout} style={{fontSize:12, color:'#888', background:'none', border:'1px solid #e5e5e3', padding:'4px 10px', borderRadius:6}}>Sign out</button>
        </div>
      </header>

      <main style={{maxWidth:720, margin:'0 auto', padding:'1.5rem'}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:'1.5rem'}}>
          {[['Total', tasks.length], ['Completed', done], ['Active', tasks.length-done]].map(([label, val]) => (
            <div key={label} style={{background:'#fff', border:'1px solid #e5e5e3', borderRadius:10, padding:'1rem'}}>
              <div style={{fontSize:12, color:'#888', marginBottom:4}}>{label}</div>
              <div style={{fontSize:24, fontWeight:600}}>{val}</div>
            </div>
          ))}
        </div>

        <form onSubmit={addTask} style={{display:'flex', gap:8, marginBottom:'1rem'}}>
          <input style={{flex:1, padding:'9px 12px', fontSize:14, border:'1px solid #e5e5e3', borderRadius:8, outline:'none'}} placeholder="Add a new task..." value={text} onChange={e => setText(e.target.value)} />
          <select style={{padding:'9px 10px', fontSize:13, border:'1px solid #e5e5e3', borderRadius:8}} value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button type="submit" style={{padding:'9px 18px', background:'#185FA5', color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:500}}>Add</button>
        </form>

        <div style={{display:'flex', gap:6, marginBottom:'1rem', flexWrap:'wrap'}}>
          {['all','active','done','high','medium','low'].map(f => (
            <button key={f} style={btn(f,f)} onClick={() => setFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>
          ))}
        </div>

        {loading ? <p style={{textAlign:'center', padding:'3rem', color:'#999'}}>Loading...</p> :
         filtered.length === 0 ? <p style={{textAlign:'center', padding:'3rem', color:'#999'}}>No tasks here. Add one above!</p> :
         <div style={{display:'flex', flexDirection:'column', gap:6}}>
           {filtered.map(task => (
             <div key={task._id} style={{background:'#fff', border:'1px solid #e5e5e3', borderRadius:10, padding:'10px 14px', display:'flex', alignItems:'center', gap:10, opacity: task.done ? 0.5 : 1}}>
               <button onClick={() => toggleTask(task)} style={{width:20, height:20, borderRadius:'50%', border: task.done ? 'none' : '2px solid #ccc', background: task.done ? '#16a34a' : 'transparent', color:'white', fontSize:11, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                 {task.done && '✓'}
               </button>
               <span style={{flex:1, fontSize:14, textDecoration: task.done ? 'line-through' : 'none'}}>{task.text}</span>
               <span style={{fontSize:11, padding:'2px 8px', borderRadius:100, fontWeight:500, background: task.priority==='high' ? '#fee2e2' : task.priority==='medium' ? '#fef3c7' : '#dcfce7', color: task.priority==='high' ? '#991b1b' : task.priority==='medium' ? '#92400e' : '#166534'}}>{task.priority}</span>
               <button onClick={() => setEditTask({...task})} style={{background:'none', border:'none', fontSize:14, opacity:0.4}}>✏️</button>
               <button onClick={() => deleteTask(task._id)} style={{background:'none', border:'none', fontSize:14, opacity:0.4}}>🗑️</button>
             </div>
           ))}
         </div>
        }
      </main>

      {editTask && (
        <div onClick={() => setEditTask(null)} style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100}}>
          <div onClick={e => e.stopPropagation()} style={{background:'#fff', borderRadius:14, padding:'1.5rem', width:360}}>
            <h3 style={{fontSize:15, fontWeight:600, marginBottom:'1rem'}}>Edit task</h3>
            <div style={{marginBottom:'1rem'}}><label style={{display:'block', fontSize:13, color:'#666', marginBottom:5}}>Task name</label><input style={{width:'100%', padding:'9px 12px', fontSize:14, border:'1px solid #e5e5e3', borderRadius:8, outline:'none'}} value={editTask.text} onChange={e => setEditTask({...editTask, text:e.target.value})} /></div>
            <div style={{marginBottom:'1rem'}}><label style={{display:'block', fontSize:13, color:'#666', marginBottom:5}}>Priority</label><select style={{width:'100%', padding:'9px 12px', fontSize:14, border:'1px solid #e5e5e3', borderRadius:8}} value={editTask.priority} onChange={e => setEditTask({...editTask, priority:e.target.value})}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div>
            <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
              <button onClick={() => setEditTask(null)} style={{padding:'8px 14px', background:'transparent', border:'1px solid #e5e5e3', borderRadius:8, fontSize:13}}>Cancel</button>
              <button onClick={saveEdit} style={{padding:'8px 14px', background:'#185FA5', color:'white', border:'none', borderRadius:8, fontSize:13, fontWeight:500}}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
