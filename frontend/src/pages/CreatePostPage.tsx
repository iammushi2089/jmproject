import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (image) fd.append('image', image);

    try {
      const { data } = await API.post('/posts', fd);
      navigate(`/posts/${data._id}`);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Failed to publish post');
    }
  };

  return (
    <section className="page-section" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '120px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '3rem', color: 'var(--accent)' }}>Write a New Story</h2>
        <p style={{ color: 'var(--text-muted)' }}>Your perspective matters. Share it with the world.</p>
      </div>

      <form className="form-box" onSubmit={handleSubmit} style={{ padding: '3.5rem', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {error && <div style={{ color: 'var(--error)', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Post Title</label>
          <input 
            value={title} onChange={e => setTitle(e.target.value)} 
            placeholder="Give your story a title..." required 
            style={{ 
              width: '100%', 
              padding: '18px', 
              background: 'var(--input-bg)', 
              border: '1px solid var(--border)', 
              borderRadius: '8px', 
              color: 'var(--text-main)', 
              fontSize: '1.3rem', 
              fontWeight: '600',
              outline: 'none'
            }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Your Story</label>
          <textarea 
            value={body} onChange={e => setBody(e.target.value)} 
            placeholder="Once upon a time in the streets..." required 
            style={{ 
              width: '100%', 
              minHeight: '350px', 
              padding: '18px', 
              background: 'var(--input-bg)', 
              border: '1px solid var(--border)', 
              borderRadius: '8px', 
              color: 'var(--text-main)', 
              lineHeight: '1.6', 
              fontSize: '1.05rem',
              resize: 'vertical',
              outline: 'none'
            }}
          />
        </div>

        <div className="form-group" style={{ background: 'var(--bg-main)', padding: '20px', borderRadius: '12px', border: '1px dashed var(--border)', marginBottom: '1.5rem' }}>
          <label style={{ marginBottom: '10px', display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Add Cover Image</label>
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
          style={{ 
            width: '100%', 
            marginTop: '20px', 
            height: '60px', 
            fontSize: '1.2rem', 
            background: 'var(--accent)', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px', 
            fontWeight: '600', 
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}
        >
          Publish Post
        </button>
      </form>
    </section>
  );
}