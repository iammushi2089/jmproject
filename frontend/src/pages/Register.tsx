import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios'; // We import our new API client

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState(''); // Handles errors from the backend


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    
    // --- Frontend Validation ---
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.name.trim()) { newErrors.name = "Full name is required."; isValid = false; }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) { newErrors.email = "Email is required."; isValid = false; } 
    else if (!emailRegex.test(formData.email)) { newErrors.email = "Please enter a valid email format."; isValid = false; }

    if (!formData.password) { newErrors.password = "Password is required."; isValid = false; } 
    else if (formData.password.length < 6) { newErrors.password = "Password must be at least 6 characters."; isValid = false; }

    if (!formData.confirmPassword) { newErrors.confirmPassword = "Confirm password."; isValid = false; } 
    else if (formData.password !== formData.confirmPassword) { newErrors.confirmPassword = "Passwords do not match."; isValid = false; }

    if (!formData.dob) { newErrors.dob = "Date of birth is required."; isValid = false; }
    if (!formData.terms) { newErrors.terms = "You must agree to the terms."; isValid = false; }

    setErrors(newErrors);

    // --- Backend API Call ---
    if (isValid) {
      try {
        // Send the specific fields the backend expects
        const { data } = await API.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        // Save token and redirect
        localStorage.setItem('token', data.token);
        
        // Force a page reload so the AuthContext picks up the new token immediately
        window.location.href = '/home'; 
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <section 
      className="register-container"
      style={{ 
        paddingTop: '120px', paddingBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--accent, #ff7e5f)', fontSize: '2.5rem' }}>Create an Account</h2>
        <p style={{ color: 'var(--text-muted, #a0a0a0)' }}>Join StreetLens to share your perspective.</p>
      </div>

      <form 
        className="form-box" 
        onSubmit={handleSubmit}
        style={{
          width: '100%', maxWidth: '500px', background: 'var(--bg-card, #1e1e1e)', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}
      >
        {serverError && (
          <div style={{ color: '#ff4c4c', backgroundColor: 'rgba(255, 76, 76, 0.1)', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center' }}>
            {serverError}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} />
          <span className="error-message">{errors.name}</span>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="text" id="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
          <span className="error-message">{errors.email}</span>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} />
          <span className="error-message">{errors.password}</span>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" placeholder="Retype password" value={formData.confirmPassword} onChange={handleChange} />
          <span className="error-message">{errors.confirmPassword}</span>
        </div>

        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input type="date" id="dob" value={formData.dob} onChange={handleChange} />
          <span className="error-message">{errors.dob}</span>
        </div>

        <div className="form-group">
          <div className="checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
            <input type="checkbox" id="terms" checked={formData.terms} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent)' }}/>
            <label htmlFor="terms" style={{ marginBottom: 0, fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>I agree to the Terms and Agreement</label>
          </div>
          <span className="error-message">{errors.terms}</span>
        </div>

        <button type="submit">Register</button>
        
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Login</Link>
        </p>
      </form>
    </section>
  );
}