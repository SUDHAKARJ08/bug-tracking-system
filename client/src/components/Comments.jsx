import React, { useEffect, useState } from 'react'
import api from '../auth/api'

function Comment({ c }){
  return (
    <div className="border-l pl-3">
      <div className="text-sm font-medium">{c.author?.name}</div>
      <div className="muted text-sm">{new Date(c.createdAt).toLocaleString()}</div>
      <div className="mt-1">{c.commentText}</div>
    </div>
  )
}

export default function Comments({ bugId }){
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')

  useEffect(()=>{ load() }, [])

  async function load(){
    const res = await api.get(`/comments/bug/${bugId}`)
    setComments(res.data)
  }

  async function post(e){
    e.preventDefault()
    await api.post('/comments', { bug: bugId, commentText: text })
    setText('')
    load()
  }

  return (
    <div>
      <div className="mt-2">
        {comments.map(c=> <Comment c={c} key={c._id} />)}
      </div>
      <form onSubmit={post} className="mt-3 flex gap-2">
        <input className="input" value={text} onChange={e=>setText(e.target.value)} placeholder="Write a comment" />
        <button className="btn" type="submit">Comment</button>
      </form>
    </div>
  )
}
