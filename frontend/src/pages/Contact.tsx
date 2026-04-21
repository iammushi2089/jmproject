import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import type { User } from '../types/auth'; // Import the specific type to fix the 'any' error

export default function Contact() {
  const { user } = useAuth();
  
  // The 'key' ensures that if a user logs in or out, the state resets 
  // to the correct initial values automatically, preventing cascading renders.
  return (
    <section className="page-section" style={{ minHeight: '85vh', paddingTop: '120px' }}>
      <h2 style={{ color: 'var(--accent, #ff7e5f)', textAlign: 'center' }}>Get in Touch</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted, #a0a0a0)' }}>
        Have a project in mind or just want to say hi? Send me a message.
      </p>
      
      <ContactForm key={user ? user.id : 'guest'} user={user} />
    </section>
  );
}

// Sub-component to manage the form state cleanly. 
// Added User | null to fix the "Unexpected any" error.
function ContactForm({ user }: { user: User | null }) {
  const [formData, setFormData] = useState({
    contactName: user?.name || '',
    contactEmail: user?.email || '',
    contactMessage: ''
  });
  
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg({ text: '', type: '' });
    
    try {
      await API.post('/messages', {
        name: formData.contactName,
        email: formData.contactEmail,
        body: formData.contactMessage,
        role: user ? 'Member' : 'Guest',
        user: user ? user.id : null
      });
      
      setStatusMsg({ text: 'Message sent successfully!', type: 'success' });
      setFormData(prev => ({ ...prev, contactMessage: '' }));
      
      if (!user) {
        setFormData({ contactName: '', contactEmail: '', contactMessage: '' });
      }
    } catch (error) {
      // Cast error to a specific shape for strict TypeScript compliance
      const err = error as { response?: { data?: { message?: string } } };
      setStatusMsg({ text: err.response?.data?.message || 'Failed to send message', type: 'error' });
    }
  };

  return (
    <form className="form-box" onSubmit={handleSubmit} style={{ margin: '2rem auto', maxWidth: '600px', background: 'var(--bg-card, #1e1e1e)', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
      {statusMsg.text && (
        <div style={{ 
          color: statusMsg.type === 'error' ? '#ff4c4c' : '#4BB543', 
          backgroundColor: statusMsg.type === 'error' ? 'rgba(255, 76, 76, 0.1)' : 'rgba(75, 181, 67, 0.1)', 
          padding: '10px', 
          borderRadius: '6px', 
          marginBottom: '15px', 
          textAlign: 'center' 
        }}>
          {statusMsg.text}
        </div>
      )}

      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="contactName" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          Name 
          <span style={{ color: user ? 'var(--accent)' : 'var(--text-muted)', fontSize: '0.8rem' }}>{user ? 'Member' : 'Guest'}</span>
        </label>
        <input 
          type="text" 
          id="contactName" 
          placeholder="John Doe" 
          value={formData.contactName} 
          onChange={handleChange} 
          required 
          readOnly={!!user} 
          style={{ 
            width: '100%', 
            padding: '12px 15px', 
            background: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: '8px', 
            color: 'var(--text-main, #f5f5f5)', 
            fontSize: '1rem', 
            opacity: user ? 0.7 : 1, 
            cursor: user ? 'not-allowed' : 'text',
            outline: 'none'
          }} 
        />
      </div>
      
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="contactEmail" style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Email Address</label>
        <input 
          type="email" 
          id="contactEmail" 
          placeholder="john@example.com" 
          value={formData.contactEmail} 
          onChange={handleChange} 
          required 
          readOnly={!!user} 
          style={{ 
            width: '100%', 
            padding: '12px 15px', 
            background: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: '8px', 
            color: 'var(--text-main, #f5f5f5)', 
            fontSize: '1rem', 
            opacity: user ? 0.7 : 1, 
            cursor: user ? 'not-allowed' : 'text',
            outline: 'none'
          }} 
        />
      </div>
      
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="contactMessage" style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Message</label>
        <textarea 
          id="contactMessage" 
          rows={5} 
          placeholder="Tell me about your idea..." 
          value={formData.contactMessage} 
          onChange={handleChange} 
          required 
          style={{ 
            width: '100%', 
            padding: '12px 15px', 
            background: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: '8px', 
            color: 'var(--text-main, #f5f5f5)', 
            fontSize: '1rem', 
            resize: 'vertical',
            outline: 'none'
          }} 
        />
      </div>
      
      <button type="submit" style={{ width: '100%', padding: '15px', background: 'var(--accent, #ff7e5f)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer' }}>Send Message</button>
    </form>
  );
}