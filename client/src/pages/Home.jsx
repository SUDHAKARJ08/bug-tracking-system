import React, { useEffect, useState } from 'react'
import api from '../auth/api'
import { Link } from 'react-router-dom'

export default function Home() {
  const [stats, setStats] = useState({
    Backlog: [],
    'Selected for Development': [],
    'In Progress': [],
    Done: []
  })
  const [projects, setProjects] = useState({})
  const [projectsByStatus, setProjectsByStatus] = useState({
    Backlog: [],
    'Selected for Development': [],
    'In Progress': [],
    Done: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      setLoading(true)
      const bugsRes = await api.get('/bugs')
      const bugs = bugsRes.data
      
      // Fetch projects
      const projectsRes = await api.get('/projects')
      const projectsMap = {}
      projectsRes.data.forEach(p => {
        projectsMap[p._id] = p.name
      })
      setProjects(projectsMap)
      
      // Group bugs by status
      const grouped = {
        Backlog: [],
        'Selected for Development': [],
        'In Progress': [],
        Done: []
      }
      
      bugs.forEach(bug => {
        if (grouped[bug.status]) {
          grouped[bug.status].push(bug)
        }
      })
      
      // Group projects by status
      const projectsGrouped = {
        Backlog: [],
        'Selected for Development': [],
        'In Progress': [],
        Done: []
      }
      
      projectsRes.data.forEach(project => {
        const projectStatus = project.status || 'Backlog'
        if (projectsGrouped[projectStatus]) {
          projectsGrouped[projectStatus].push(project)
        }
      })
      
      setProjectsByStatus(projectsGrouped)
      setStats(grouped)
      setLoading(false)
    } catch (err) {
      console.error('Error loading dashboard', err)
      setLoading(false)
    }
  }

  function getProjectName(project) {
    if (!project) return 'Unknown Project'
    const projectId = typeof project === 'string' ? project : project._id || project
    return projects[projectId] || `Project-${projectId?.substring(0, 8) || 'N/A'}`
  }

  function getProjectId(project) {
    if (!project) return null
    return typeof project === 'string' ? project : project._id || project
  }

  const statusConfig = {
    'Backlog': {
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.15)',
      borderColor: 'rgba(139, 92, 246, 0.3)'
    },
    'Selected for Development': {
      color: '#6366f1',
      bgColor: 'rgba(99, 102, 241, 0.15)',
      borderColor: 'rgba(99, 102, 241, 0.3)'
    },
    'In Progress': {
      color: '#ec4899',
      bgColor: 'rgba(236, 72, 153, 0.15)',
      borderColor: 'rgba(236, 72, 153, 0.3)'
    },
    'Done': {
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'rgba(16, 185, 129, 0.3)'
    }
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <h1 className="home-title">Dashboard</h1>
        <p className="home-subtitle">Overview of Projects and Bugs by Status</p>
      </div>

      {loading ? (
        <div className="home-loading">Loading dashboard...</div>
      ) : (
        <div className="home-dashboard">
          {Object.keys(stats).map(status => {
            const config = statusConfig[status]
            const bugs = stats[status]
            
            return (
              <div 
                key={status} 
                className="home-status-box"
                style={{
                  borderColor: config.borderColor,
                  backgroundColor: config.bgColor
                }}
              >
                <div className="home-status-header">
                  <h3 
                    className="home-status-title"
                    style={{ color: config.color }}
                  >
                    {status.toUpperCase()}
                  </h3>
                  <span className="home-status-count" style={{ color: config.color }}>
                    {bugs.length + projectsByStatus[status].length}
                  </span>
                </div>
                
                <div className="home-status-content">
                  {(bugs.length === 0 && projectsByStatus[status].length === 0) ? (
                    <div className="home-empty-state">No items in this status</div>
                  ) : (
                    <div className="home-bugs-list">
                      {/* Show projects first */}
                      {projectsByStatus[status].slice(0, Math.min(5, projectsByStatus[status].length)).map(project => (
                        <Link 
                          key={project._id} 
                          to={`/projects/${project._id}`}
                          className="home-bug-card home-project-card"
                        >
                          <div className="home-bug-title">
                            <span className="home-project-icon">📁</span>
                            {project.name}
                          </div>
                          <div className="home-bug-meta">
                            <span className="home-bug-project">Project</span>
                            {project.files && project.files.length > 0 && (
                              <span className="home-bug-priority" style={{ color: '#818cf8' }}>
                                {project.files.length} file(s)
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                      
                      {/* Then show bugs */}
                      {bugs.slice(0, Math.max(0, 5 - projectsByStatus[status].length)).map(bug => {
                        const projectId = getProjectId(bug.project)
                        return (
                          <Link 
                            key={bug._id} 
                            to={projectId ? `/projects/${projectId}` : '#'}
                            className="home-bug-card"
                          >
                            <div className="home-bug-title">{bug.title}</div>
                            <div className="home-bug-meta">
                              <span className="home-bug-project">
                                {bug.project?.name || getProjectName(bug.project)}
                              </span>
                            <span 
                              className="home-bug-priority"
                              style={{
                                color: bug.priority === 'High' ? '#ef4444' : 
                                       bug.priority === 'Medium' ? '#f59e0b' : '#10b981'
                              }}
                            >
                              {bug.priority}
                            </span>
                            </div>
                          </Link>
                        )
                      })}
                      {(bugs.length + projectsByStatus[status].length) > 5 && (
                        <div className="home-more-bugs">
                          +{(bugs.length + projectsByStatus[status].length) - 5} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

