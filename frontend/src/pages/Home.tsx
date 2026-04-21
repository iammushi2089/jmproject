import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

interface Post {
  _id: string;
  title: string;
  body: string;
  image: string;
  author?: { name: string; profilePic?: string };
  createdAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/posts')
      .then(res => setPosts(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h2>Capturing Life on the Streets</h2>
          <p>Real moments, vibrant sunsets, and the everyday stories of humanity.</p>
        </div>
      </section>

      <section className="container">
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '50px' }}>Loading posts...</div>
        ) : (
          <>
            {posts.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '50px' }}>
                <h3>No posts yet.</h3>
                <p>Be the first to share your perspective!</p>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', width: '100%', alignItems: 'start' }}>
              {posts.map(post => (
                <div key={post._id} style={{ background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', transition: 'transform 0.3s ease', display: 'flex', flexDirection: 'column' }} className="post-card">
                  
                  <Link to={`/posts/${post._id}`} style={{ display: 'block', textDecoration: 'none' }}>
                    {post.image ? (
                      <img 
                        src={`https://jmproject-dwe9.onrender.com/uploads/${post.image}`} 
                        alt={post.title} 
                        style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '250px', background: 'linear-gradient(135deg, #2a2a2a, #1a1a1a)' }}></div>
                    )}
                  </Link>
                  
                  <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '10px' }}>
                      <Link to={`/posts/${post._id}`} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
                        {post.title}
                      </Link>
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '15px', flexGrow: 1 }}>
                      {post.body.substring(0, 100)}...
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <img 
                        src={post.author?.profilePic ? `https://jmproject-dwe9.onrender.com/uploads/${post.author.profilePic}` : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
                        alt="Author" 
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--accent)' }}
                      />
                      <small style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        By <strong style={{ color: 'var(--text-main)' }}>{post.author?.name}</strong> <br/> 
                        {new Date(post.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}