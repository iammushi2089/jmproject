import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <h1 style={{ color: 'var(--accent)' }}>StreetLens</h1>
      <nav>
        <ul style={{ alignItems: 'center' }}>
          <li><NavLink to="/home">Home</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>

          {!user ? (
            <>
              <li><NavLink to="/login">Login</NavLink></li>
              <li><NavLink to="/register">Register</NavLink></li>
            </>
          ) : (
            <>
              <li><NavLink to="/create-post">Write Post</NavLink></li>
              <li><NavLink to="/profile">Profile</NavLink></li>
              {user.role === 'admin' && (
                <li><NavLink to="/admin" style={{ color: 'var(--accent)' }}>Admin</NavLink></li>
              )}
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a></li>
            </>
          )}

          <li style={{ display: 'flex', alignItems: 'center' }}>
            <label className="theme-switch" title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
              <input 
                type="checkbox" 
                checked={theme === 'light'} 
                onChange={toggleTheme} 
              />
              <span className="theme-slider"></span>
            </label>
          </li>
        </ul>
      </nav>
    </header>
  );
}