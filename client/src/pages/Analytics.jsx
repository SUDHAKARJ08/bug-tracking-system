import React, { useEffect, useState } from 'react'
import api from '../auth/api'
import { Pie, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function Analytics(){
  const [statusCounts, setStatusCounts] = useState([])
  const [byUser, setByUser] = useState([])
  const [byProject, setByProject] = useState([])
  const [totalProjects, setTotalProjects] = useState(0)

  useEffect(()=>{ load() }, [])

  async function load(){
    const s = await api.get('/analytics/status-counts')
    setStatusCounts(s.data)
    const u = await api.get('/analytics/by-user')
    setByUser(u.data)
    const p = await api.get('/analytics/by-project')
    setByProject(p.data)
    const projects = await api.get('/projects')
    setTotalProjects(projects.data.length)
  }

  const pieData = {
    labels: statusCounts.map(x=>x._id || 'Unknown'),
    datasets: [{ 
      data: statusCounts.map(x=>x.count), 
      backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#10b981'],
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 2
    }]
  }

  const barData = {
    labels: statusCounts.map(x=>x._id || 'Unknown'),
    datasets: [{ 
      label: 'Bugs', 
      data: statusCounts.map(x=>x.count), 
      backgroundColor: '#4f46e5',
      borderColor: 'rgba(79, 70, 229, 0.8)',
      borderWidth: 1
    }]
  }

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
          font: {
            size: 10
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        titleFont: {
          size: 10
        },
        bodyFont: {
          size: 10
        }
      }
    },
    scales: {
      y: {
        ticks: {
          color: '#ffffff',
          font: {
            size: 10
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#ffffff',
          font: {
            size: 10
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  }

  return (
    <div className="analytics-page">
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3 className="analytics-card-title">Bugs by Status</h3>
          <div className="analytics-chart">
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>
        <div className="analytics-card">
          <h3 className="analytics-card-title">Bugs by Status (Bar Chart)</h3>
          <div className="analytics-chart">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        <div className="analytics-card analytics-card-wide">
          <h3 className="analytics-card-title">By User / Project (Raw Data)</h3>
          <div className="analytics-raw-data">
            <div className="analytics-data-section">
              <h4 className="analytics-data-title">Users</h4>
              <pre className="analytics-json">{JSON.stringify(byUser, null, 2)}</pre>
            </div>
            <div className="analytics-data-section">
              <h4 className="analytics-data-title">Projects</h4>
              <div className="analytics-project-info">
                <div className="analytics-project-count">
                  <span className="analytics-label">Total Projects Created:</span>
                  <span className="analytics-value">{totalProjects}</span>
                </div>
              </div>
              <pre className="analytics-json">{JSON.stringify(byProject, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
