import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../auth/api'
import Comments from '../components/Comments'

function BugForm({ projectId, onSaved, initial }){
  const [title, setTitle] = useState(initial?.title||'')
  const [description, setDescription] = useState(initial?.description||'')
  const [priority, setPriority] = useState(initial?.priority||'Medium')
  const [status, setStatus] = useState(initial?.status||'Backlog')

  async function submit(e){
    e.preventDefault()
    if(initial){
      await api.put(`/bugs/${initial._id}`, { title, description, priority, status })
    } else {
      await api.post('/bugs', { project: projectId, title, description, priority, status })
    }
    onSaved()
  }

  return (
    <form onSubmit={submit} className="card space-y-3">
      <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="input" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <select className="input" value={priority} onChange={e=>setPriority(e.target.value)}>
          <option>Low</option><option>Medium</option><option>High</option>
        </select>
        <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
          <option>Backlog</option><option>Selected for Development</option><option>In Progress</option><option>Done</option>
        </select>
      </div>
      <div className="flex justify-end">
        <button className="btn" type="submit">{initial?'Save':'Add Bug'}</button>
      </div>
    </form>
  )
}

export default function ProjectDetail(){
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [bugs, setBugs] = useState([])
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const statuses = ['Backlog', 'Selected for Development', 'In Progress', 'Done']

  useEffect(()=>{ fetchProject() }, [])

  async function fetchProject(){
    const res = await api.get(`/projects/${id}`)
    setProject(res.data.project)
    const bugsRes = await api.get(`/bugs?project=${id}`)
    setBugs(bugsRes.data)
  }

  function getBugsByStatus(status){
    return bugs.filter(b => b.status === status)
  }

  function getPriorityColor(priority){
    if(priority === 'High') return '#ef4444'
    if(priority === 'Medium') return '#f59e0b'
    return '#10b981'
  }

  async function updateBugStatus(bugId, newStatus){
    try {
      await api.put(`/bugs/${bugId}`, { status: newStatus })
      fetchProject()
    } catch(err) {
      console.error('Update status error', err)
      alert('Failed to update status')
    }
  }

  function startEdit(b){ setEditing(b); setShowForm(true) }

  async function del(b){ 
    if(!confirm('Delete bug?')) return
    try {
      await api.delete(`/bugs/${b._id}`)
      fetchProject()
    } catch(err) {
      console.error('Delete error', err)
      alert('Failed to delete bug')
    }
  }

  function getBugId(bug){
    const projectPrefix = project?.name?.substring(0, 4).toUpperCase().replace(/\s/g, '') || 'BUG'
    const bugIndex = bugs.findIndex(b => b._id === bug._id) + 1
    return `${projectPrefix}-${bugIndex}`
  }

  return (
    <div className="kanban-container">
      <div className="kanban-header">
        <div>
          <h1 className="kanban-title">{project?.name} board</h1>
          <p className="kanban-subtitle">Kanban board</p>
        </div>
        <div className="kanban-actions">
          <button className="kanban-btn-secondary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Hide' : 'Add Bug'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="kanban-form-container">
          <BugForm projectId={id} initial={editing} onSaved={()=>{ setEditing(null); setShowForm(false); fetchProject(); }} />
          {editing && <button className="kanban-btn-cancel" onClick={()=>{setEditing(null); setShowForm(false)}}>Cancel</button>}
        </div>
      )}

      <div className="kanban-board">
        {statuses.map(status => (
          <div className="kanban-column" key={status}>
            <div className="kanban-column-header">
              <h3 className="kanban-column-title">{status.toUpperCase()}</h3>
              <span className="kanban-column-count">{getBugsByStatus(status).length}</span>
            </div>
            <div className="kanban-column-content">
              {getBugsByStatus(status).map((bug, idx) => (
                <div className="kanban-card" key={bug._id}>
                  <div className="kanban-card-header">
                    <div 
                      className="kanban-priority-indicator" 
                      style={{ backgroundColor: getPriorityColor(bug.priority) }}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M4 0L4.70711 3.29289L8 4L4.70711 4.70711L4 8L3.29289 4.70711L0 4L3.29289 3.29289L4 0Z" fill="white"/>
                      </svg>
                    </div>
                    <div className="kanban-card-actions">
                      <button className="kanban-icon-btn" onClick={()=>startEdit(bug)} title="Edit">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M1 11L3 13L11 5L9 3L1 11Z" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                      </button>
                      <button className="kanban-icon-btn" onClick={()=>del(bug)} title="Delete">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="kanban-card-title">{bug.title}</div>
                  {bug.description && <div className="kanban-card-description">{bug.description}</div>}
                  <div className="kanban-card-footer">
                    <div className="kanban-card-id">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1C3.79086 1 2 2.79086 2 5C2 7.20914 3.79086 9 6 9C8.20914 9 10 7.20914 10 5C10 2.79086 8.20914 1 6 1ZM6 7C4.89543 7 4 6.10457 4 5C4 3.89543 4.89543 3 6 3C7.10457 3 8 3.89543 8 5C8 6.10457 7.10457 7 6 7Z" fill="currentColor"/>
                      </svg>
                      {getBugId(bug)}
                    </div>
                  </div>
                  <select 
                    className="kanban-status-select"
                    value={bug.status}
                    onChange={(e) => updateBugStatus(bug._id, e.target.value)}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="kanban-card-comments">
                    <Comments bugId={bug._id} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
