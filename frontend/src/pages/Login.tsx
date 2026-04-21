import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const user = await login(email, password);
      // Redirect based on role (Admins go to admin dashboard, members to home)
      navigate(user.role === 'admin' ? '/admin' : '/home');
    } catch (error) {
      // Cast the error to an object that might contain our backend's message
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <section 
      className="register-container"
      style={{ 
        paddingTop: '120px', 
        paddingBottom: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--accent, #ff7e5f)', fontSize: '2.5rem' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-muted, #a0a0a0)' }}>Login to continue to StreetLens.</p>
      </div>

      <form 
        className="form-box" 
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '450px',
          background: 'var(--bg-card, #1e1e1e)',
          padding: '2.5rem',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}
      >
        {error && (
          <div style={{ color: '#ff4c4c', backgroundColor: 'rgba(255, 76, 76, 0.1)', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            placeholder="john@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            placeholder="Enter your password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" style={{ marginTop: '10px' }}>Login</button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Register here</Link>
        </p>
      </form>
    </section>
  );
}