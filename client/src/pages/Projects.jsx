import React, { useEffect, useState } from 'react'
import api from '../auth/api'
import { Link } from 'react-router-dom'
// import logo_white from './image/logo_white.png'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('Backlog')
  const [files, setFiles] = useState([])
  const [editing, setEditing] = useState(null)

  useEffect(()=>{ fetchProjects() }, [])

  async function fetchProjects(){
    const res = await api.get('/projects')
    setProjects(res.data)
  }

  async function submit(e){
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('status', status)
      
      // Append files if any
      files.forEach(file => {
        formData.append('files', file)
      })

      if(editing) {
        await api.put(`/projects/${editing._id}`, formData)
      } else {
        await api.post('/projects', formData)
      }
      
      setName(''); setDescription(''); setStatus('Backlog'); setFiles([]); setEditing(null)
      fetchProjects()
    } catch (err) {
      console.error('project error', err.response ? err.response.data : err.message)
      alert(err.response?.data?.message || (editing ? 'Failed to update project' : 'Failed to create project'))
    }
  }

  function handleFileChange(e){
    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)
  }

  function removeFile(index){
    setFiles(files.filter((_, i) => i !== index))
  }

  function startEdit(project){
    setEditing(project)
    setName(project.name)
    setDescription(project.description || '')
    setStatus(project.status || 'Backlog')
    setFiles([]) // Reset file selection when editing
  }

  function cancelEdit(){
    setEditing(null)
    setName('')
    setDescription('')
    setStatus('Backlog')
    setFiles([])
  }

  async function remove(id){
    if(!confirm('Delete project?')) return
    try {
      await api.delete(`/projects/${id}`)
      fetchProjects()
    } catch (err) {
      console.error('delete project error', err.response ? err.response.data : err.message)
      alert(err.response?.data?.message || 'Failed to delete project')
    }
  }

  function formatDate(dateString){
    if(!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div className="projects-logo-container">
          {/* <img src={logo_white} alt="pavakie logo" className="projects-logo" /> */}
        </div>
        <h1 className="projects-title">Projects</h1>
      </div>

      <div className="projects-container">
        <div className="project-form-card">
          <div className="project-form-header">
            <h3 className="project-form-title">{editing ? 'Edit Project' : 'Create Project'}</h3>
            {editing && (
              <div className="project-form-date">
                Created: {formatDate(editing.createdAt)}
              </div>
            )}
          </div>
          <form className="project-form" onSubmit={submit}>
            <div className="project-input-group">
              <input 
                className="project-input" 
                placeholder="Name" 
                value={name} 
                onChange={e=>setName(e.target.value)} 
                required
              />
            </div>
            <div className="project-input-group">
              <input 
                className="project-input" 
                placeholder="Description" 
                value={description} 
                onChange={e=>setDescription(e.target.value)} 
              />
            </div>
            <div className="project-input-group">
              <label className="project-status-label">Project Status</label>
              <div className="project-status-options">
                <button
                  type="button"
                  className={`project-status-option ${status === 'Backlog' ? 'active' : ''}`}
                  onClick={() => setStatus('Backlog')}
                  style={{
                    borderColor: status === 'Backlog' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.15)',
                    backgroundColor: status === 'Backlog' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                    color: status === 'Backlog' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  Backlog
                </button>
                <button
                  type="button"
                  className={`project-status-option ${status === 'Selected for Development' ? 'active' : ''}`}
                  onClick={() => setStatus('Selected for Development')}
                  style={{
                    borderColor: status === 'Selected for Development' ? '#6366f1' : 'rgba(255, 255, 255, 0.15)',
                    backgroundColor: status === 'Selected for Development' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    color: status === 'Selected for Development' ? '#6366f1' : 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  Selected for Development
                </button>
                <button
                  type="button"
                  className={`project-status-option ${status === 'In Progress' ? 'active' : ''}`}
                  onClick={() => setStatus('In Progress')}
                  style={{
                    borderColor: status === 'In Progress' ? '#ec4899' : 'rgba(255, 255, 255, 0.15)',
                    backgroundColor: status === 'In Progress' ? 'rgba(236, 72, 153, 0.15)' : 'transparent',
                    color: status === 'In Progress' ? '#ec4899' : 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  In Progress
                </button>
                <button
                  type="button"
                  className={`project-status-option ${status === 'Done' ? 'active' : ''}`}
                  onClick={() => setStatus('Done')}
                  style={{
                    borderColor: status === 'Done' ? '#10b981' : 'rgba(255, 255, 255, 0.15)',
                    backgroundColor: status === 'Done' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                    color: status === 'Done' ? '#10b981' : 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  Done
                </button>
              </div>
            </div>
            <div className="project-input-group">
              <label className="project-file-label">
                <input 
                  type="file" 
                  className="project-file-input" 
                  multiple
                  onChange={handleFileChange}
                />
                <span className="project-file-button">Choose Files / Folders</span>
              </label>
              {files.length > 0 && (
                <div className="project-files-list">
                  {files.map((file, idx) => (
                    <div key={idx} className="project-file-item">
                      <span className="project-file-name">{file.name}</span>
                      <button 
                        type="button"
                        className="project-file-remove"
                        onClick={() => removeFile(idx)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="project-form-actions">
              {editing && (
                <button 
                  type="button" 
                  className="project-btn-cancel" 
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
              <button className="project-btn-submit" type="submit">
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>

        <div className="project-grid">
          {projects.map(p=> (
            <div className="project-item-card" key={p._id}>
              <div className="project-item-content">
                <Link to={`/projects/${p._id}`} className="project-item-name">{p.name}</Link>
                <p className="project-item-description">{p.description || 'No description'}</p>
                <div className="project-item-meta">
                  <span className="project-item-status" style={{
                    color: p.status === 'Done' ? '#10b981' : 
                           p.status === 'In Progress' ? '#ec4899' :
                           p.status === 'Selected for Development' ? '#6366f1' : '#8b5cf6'
                  }}>
                    {p.status || 'Backlog'}
                  </span>
                  <span className="project-item-date">Created: {formatDate(p.createdAt)}</span>
                  {p.files && p.files.length > 0 && (
                    <span className="project-item-files">{p.files.length} file(s)</span>
                  )}
                </div>
              </div>
              <div className="project-item-actions">
                <button className="project-item-btn-edit" onClick={()=>startEdit(p)} title="Edit">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M11.333 2a2.828 2.828 0 1 1 4 4L6.667 14.667 2 16l1.333-4.667L11.333 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="project-item-btn-delete" onClick={()=>remove(p._id)} title="Delete">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h12M6 4V2a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2m3 0v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
