import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

interface Post {
  _id: string; 
  title: string; 
  body: string; 
  image?: string;
  author?: { _id: string; name: string; profilePic?: string }; 
  createdAt: string;
}

interface Comment {
  _id: string; body: string; author?: { _id: string; name: string; profilePic?: string }; createdAt: string;
}

export default function PostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBody, setCommentBody] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, commentRes] = await Promise.all([
          API.get(`/posts/${id}`),
          API.get(`/comments/${id}`)
        ]);
        setPost(postRes.data);
        setComments(commentRes.data);
      } catch { 
        navigate('/home'); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    try {
      const { data } = await API.post(`/comments/${id}`, { body: commentBody });
      setComments([...comments, data]);
      setCommentBody('');
    } catch { alert("Failed to post comment"); }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await API.delete(`/posts/${id}`);
      navigate('/home');
    } catch {
      alert('Failed to delete post');
    }
  };

  if (loading) return <div style={{ paddingTop: '150px', textAlign: 'center' }}>Loading Post...</div>;
  if (!post) return null;

  // Check if the current logged-in user owns this post, or is an admin
  const isOwner = user && post.author && (user.id === post.author._id || user._id === post.author._id);
  const isAdmin = user && user.role === 'admin';

  return (
    <section className="page-section" style={{ maxWidth: '850px', margin: '0 auto', paddingTop: '120px', textAlign: 'left' }}>
      <Link to="/home" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'block', marginBottom: '20px' }}>← Back to Gallery</Link>
      
      {post.image && (
        <img src={`http://localhost:5000/uploads/${post.image}`} alt={post.title} style={{ width: '100%', borderRadius: '16px', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} />
      )}
      
      <h1 style={{ fontSize: '3.5rem', marginBottom: '15px', lineHeight: '1.2' }}>{post.title}</h1>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src={post.author?.profilePic ? `http://localhost:5000/uploads/${post.author.profilePic}` : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
          <div>
            <p style={{ margin: 0, fontWeight: '600' }}>{post.author?.name}</p>
            <small style={{ color: 'var(--text-muted)' }}>{new Date(post.createdAt).toLocaleDateString()}</small>
          </div>
        </div>

        {/* Action Buttons for Owner / Admin */}
        {(isOwner || isAdmin) && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to={`/edit-post/${post._id}`} style={{ padding: '8px 16px', background: 'var(--input-bg)', color: 'var(--text-main)', border: '1px solid var(--border)', textDecoration: 'none', borderRadius: '6px', fontSize: '0.9rem', transition: 'background 0.3s' }}>Edit</Link>
            <button onClick={handleDeletePost} style={{ padding: '8px 16px', background: 'rgba(255, 76, 76, 0.1)', color: '#ff4c4c', border: '1px solid rgba(255, 76, 76, 0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', transition: 'background 0.3s' }}>Delete</button>
          </div>
        )}
      </div>

      <div style={{ fontSize: '1.2rem', lineHeight: '1.8', whiteSpace: 'pre-wrap', marginBottom: '60px' }}>{post.body}</div>

      {/* --- Comments Section --- */}
      <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <h3 style={{ marginBottom: '20px' }}>Comments ({comments.length})</h3>
        
        {user ? (
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: '40px' }}>
            <textarea 
              value={commentBody} onChange={(e) => setCommentBody(e.target.value)}
              placeholder="Add to the story..." required
              style={{ width: '100%', padding: '15px', borderRadius: '8px', minHeight: '100px', marginBottom: '10px', background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text-main)', outline: 'none' }}
            />
            <button type="submit" style={{ width: 'auto', padding: '10px 30px' }}>Post Comment</button>
          </form>
        ) : <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Please <Link to="/login" style={{ color: 'var(--accent)' }}>Login</Link> to join the conversation.</p>}

        {comments.map(c => (
          <div key={c._id} style={{ display: 'flex', gap: '15px', marginBottom: '25px', borderLeft: '3px solid var(--accent)', paddingLeft: '15px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem', color: 'var(--accent)' }}>{c.author?.name}</p>
              <p style={{ margin: '5px 0' }}>{c.body}</p>
              <small style={{ color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}