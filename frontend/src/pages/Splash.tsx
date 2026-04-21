import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Splash() {
  const { user } = useAuth();

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212', color: 'white', textAlign: 'center', padding: '20px' }}>
      <div className="logo" style={{ fontSize: '60px', marginBottom: '20px' }}>📷</div>
      
      <h1 style={{ background: 'linear-gradient(135deg, #ff7e5f, #feb47b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '4rem', marginBottom: '10px' }}>
        Welcome to StreetLens
      </h1>
      
      <p style={{ color: '#a0a0a0', fontSize: '1.2rem', marginBottom: '40px', maxWidth: '600px' }}>
        A community blog where photographers share real moments, vibrant sunsets, and the everyday stories of humanity.
      </p>
      
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/home" style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #ff7e5f, #feb47b)', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: '600' }}>
          Browse Posts
        </Link>
        
        {!user ? (
          <>
            <Link to="/register" style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>
              Create Account
            </Link>
            <Link to="/login" style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>
              Login
            </Link>
          </>
        ) : (
          <Link to="/create-post" style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>
            Write a Post
          </Link>
        )}
      </div>
    </div>
  );
}