import { Link } from 'react-router-dom';
// Import your background image from the assets folder
import bgImage from '../assets/backgroundforsplashpage.jpg';

export default function Splash() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      // Apply the image with a dark gradient overlay for text readability
      background: `url(${bgImage}) center/cover no-repeat`,
      textAlign: 'center',
      padding: '20px'
    }}>
      
      <h1 style={{ fontSize: '4.5rem', color: 'var(--accent)', marginBottom: '1rem', letterSpacing: '2px' }}>
        StreetLens
      </h1>
      
      <p style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)', fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', marginBottom: '3rem', maxWidth: '600px', lineHeight: '1.6' }}>
        Real moments, vibrant sunsets, and the everyday stories of humanity. Join our community to share your perspective.
      </p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link 
          to="/login" 
          style={{ padding: '15px 40px', background: 'var(--accent)', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '600', boxShadow: '0 4px 15px rgba(255, 126, 95, 0.3)' }}
        >
          Login
        </Link>
        <Link 
          to="/register" 
          style={{ padding: '15px 40px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '600', backdropFilter: 'blur(5px)' }}
        >
          Register
        </Link>
      </div>
      
    </section>
  );
}