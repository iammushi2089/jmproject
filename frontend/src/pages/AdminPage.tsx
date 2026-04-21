import { useState, useEffect } from 'react';
import API from '../api/axios';

interface Member { _id: string; name: string; email: string; status: string; }
interface Post { _id: string; title: string; author?: { name: string; email: string }; status: string; }
interface Message { _id: string; name: string; email: string; body: string; role: string; reply: string; status: string; createdAt: string; }

export default function AdminPage() {
  const [users, setUsers] = useState<Member[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tab, setTab] = useState<'users' | 'posts' | 'messages'>('users');
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    API.get('/admin/users').then(r => setUsers(r.data));
    API.get('/admin/posts').then(r => setPosts(r.data));
    API.get('/admin/messages').then(r => setMessages(r.data));
  }, []);

  const toggleStatus = async (id: string) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/status`);
      setUsers(users.map(u => u._id === id ? data.user : u));
    } catch { alert('Failed to toggle user status'); }
  };

  const removePost = async (id: string) => {
    if (!window.confirm('Delete this post permanently?')) return;
    try {
      await API.delete(`/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
    } catch { alert('Failed to delete post'); }
  };

  const sendReply = async (id: string) => {
    if (!replyText[id]?.trim()) return;
    try {
      const { data } = await API.put(`/admin/messages/${id}/reply`, { reply: replyText[id] });
      setMessages(messages.map(m => m._id === id ? data.msg : m));
      setReplyText(prev => ({ ...prev, [id]: '' }));
    } catch { alert('Failed to send reply'); }
  };

  const thStyle = { padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' as const, color: 'var(--accent)' };
  const tdStyle = { padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' as const };
  const tableStyle = { width: '100%', borderCollapse: 'collapse' as const, tableLayout: 'fixed' as const };

  return (
    <section className="page-section" style={{ minHeight: '85vh', paddingTop: '120px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--accent, #ff7e5f)', fontSize: '2.5rem' }}>Admin Dashboard</h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button onClick={() => setTab('users')} style={{ padding: '10px 20px', background: tab === 'users' ? 'var(--accent)' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Members ({users.length})</button>
        <button onClick={() => setTab('posts')} style={{ padding: '10px 20px', background: tab === 'posts' ? 'var(--accent)' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>All Posts ({posts.length})</button>
        <button onClick={() => setTab('messages')} style={{ padding: '10px 20px', background: tab === 'messages' ? 'var(--accent)' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Messages ({messages.length})</button>
      </div>

      {tab === 'users' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: '12px', overflowX: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <table style={tableStyle}>
            <thead><tr><th style={thStyle}>Name</th><th style={thStyle}>Email</th><th style={thStyle}>Status</th><th style={thStyle}>Action</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={tdStyle}>{u.name}</td><td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}><span style={{ padding: '5px 10px', borderRadius: '20px', fontSize: '0.85rem', background: u.status === 'active' ? 'rgba(75, 181, 67, 0.2)' : 'rgba(255, 76, 76, 0.2)', color: u.status === 'active' ? '#4BB543' : '#ff4c4c' }}>{u.status}</span></td>
                  <td style={tdStyle}><button onClick={() => toggleStatus(u._id)} style={{ padding: '6px 12px', background: u.status === 'active' ? 'rgba(255, 76, 76, 0.2)' : 'rgba(75, 181, 67, 0.2)', color: u.status === 'active' ? '#ff4c4c' : '#4BB543', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{u.status === 'active' ? 'Deactivate' : 'Activate'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'posts' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: '12px', overflowX: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <table style={tableStyle}>
            <thead><tr><th style={thStyle}>Title</th><th style={thStyle}>Author</th><th style={thStyle}>Status</th><th style={thStyle}>Action</th></tr></thead>
            <tbody>
              {posts.map(p => (
                <tr key={p._id}>
                  <td style={tdStyle}>{p.title}</td><td style={tdStyle}>{p.author?.name}</td>
                  <td style={tdStyle}><span style={{ padding: '5px 10px', borderRadius: '20px', fontSize: '0.85rem', background: p.status === 'published' ? 'rgba(75, 181, 67, 0.2)' : 'rgba(255, 76, 76, 0.2)', color: p.status === 'published' ? '#4BB543' : '#ff4c4c' }}>{p.status}</span></td>
                  <td style={tdStyle}>
                    <button onClick={() => removePost(p._id)} style={{ padding: '6px 12px', background: 'rgba(255, 76, 76, 0.2)', color: '#ff4c4c', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'messages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No messages received.</p>}
          {messages.map(m => (
            <div key={m._id} style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', borderLeft: m.status === 'unread' ? '4px solid #ff7e5f' : '4px solid #4BB543' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <h4 style={{ color: 'var(--accent)', margin: 0 }}>{m.name} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({m.role})</span></h4>
                  <small style={{ color: 'var(--text-muted)' }}>{m.email}</small>
                </div>
                <small style={{ color: 'var(--text-muted)' }}>{new Date(m.createdAt).toLocaleDateString()}</small>
              </div>
              <p style={{ marginBottom: '15px', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>{m.body}</p>
              
              {m.status === 'replied' ? (
                <div style={{ padding: '15px', background: 'rgba(75, 181, 67, 0.1)', borderLeft: '3px solid #4BB543', borderRadius: '4px' }}>
                  <strong style={{ color: '#4BB543' }}>Your Reply:</strong> {m.reply}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="Write a reply..." value={replyText[m._id] || ''} onChange={e => setReplyText({ ...replyText, [m._id]: e.target.value })} style={{ flexGrow: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', outline: 'none' }} />
                  <button onClick={() => sendReply(m._id)} style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Send Reply</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}