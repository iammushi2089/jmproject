import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function EditPostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        
        // Security check: If they aren't the author or admin, kick them out
        if (user && data.author._id !== user.id && user._id !== data.author._id && user.role !== 'admin') {
          navigate('/home');
          return;
        }

        setTitle(data.title);
        setBody(data.body);
        setCurrentImage(data.image || '');
      } catch {
        setError('Post not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (image) fd.append('image', image);

    try {
      await API.put(`/posts/${id}`, fd);
      navigate(`/posts/${id}`);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Failed to update post');
    }
  };

  if (loading) return <div style={{ paddingTop: '150px', textAlign: 'center' }}>Loading post...</div>;

  return (
    <section className="page-section" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '120px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '3rem', color: 'var(--text-main)' }}>Edit Post</h2>
      </div>

      <form className="form-box" onSubmit={handleSubmit} style={{ padding: '3.5rem', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {error && <div style={{ color: 'var(--error)', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

        {currentImage && (
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '10px', fontSize: '0.9rem' }}>Current cover image:</p>
            <img src={`http://localhost:5000/uploads/${currentImage}`} alt="Current cover" style={{ maxWidth: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border)' }} />
          </div>
        )}

        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Post Title</label>
          <input 
            value={title} onChange={e => setTitle(e.target.value)} 
            required 
            style={{ width: '100%', padding: '18px', background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '1.3rem', fontWeight: '600', outline: 'none' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Your Story</label>
          <textarea 
            value={body} onChange={e => setBody(e.target.value)} 
            required 
            style={{ width: '100%', minHeight: '350px', padding: '18px', background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', lineHeight: '1.6', fontSize: '1.05rem', resize: 'vertical', outline: 'none' }}
          />
        </div>

        <div className="form-group" style={{ background: 'var(--bg-main)', padding: '20px', borderRadius: '12px', border: '1px dashed var(--border)', marginBottom: '1.5rem' }}>
          <label style={{ marginBottom: '10px', display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Replace Cover Image</label>
          <label style={{ display: 'block', padding: '12px', background: 'var(--bg-card)', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', border: '1px solid var(--border)', color: 'var(--text-main)' }}>
            {image ? `Selected: ${image.name}` : 'Click to Browse Gallery'}
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImage(e.target.files?.[0] || null)} 
              style={{ display: 'none' }} 
            />
          </label>
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', marginTop: '20px', height: '60px', fontSize: '1.2rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.3s' }}
        >
          Update Post
        </button>
      </form>
    </section>
  );
}