import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import type { User } from '../types/auth'; 

export default function Contact() {
  const { user } = useAuth();
  
  return (
    <section className="page-section" style={{ minHeight: '85vh', paddingTop: '120px' }}>
      <h2 style={{ color: 'var(--accent)', textAlign: 'center' }}>Get in Touch</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        Have a project in mind or just want to say hi? Send me a message.
      </p>
      
      {/* The key prop is the magic fix here! 
        When user.id changes (login/logout), React destroys the old form 
        and builds a fresh one with the new default values. No useEffect needed.
      */}
      <ContactForm key={user ? user.id : 'guest'} user={user} />
    </section>
  );
}

// Sub-component to manage the form state cleanly
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
        user: user ? (user._id || user.id) : null 
      });
      
      setStatusMsg({ text: 'Message sent successfully!', type: 'success' });
      setFormData(prev => ({ ...prev, contactMessage: '' }));
      
      if (!user) {
        setFormData({ contactName: '', contactEmail: '', contactMessage: '' });
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      setStatusMsg({ text: err.response?.data?.message || 'Failed to send message', type: 'error' });
    }
  };

  return (
    <form className="form-box" onSubmit={handleSubmit} style={{ margin: '2rem auto', maxWidth: '600px', background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
      {statusMsg.text && (
        <div style={{ 
          color: statusMsg.type === 'error' ? 'var(--error)' : '#4BB543', 
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
            background: 'var(--input-bg)', 
            border: '1px solid var(--border)', 
            borderRadius: '8px', 
            color: 'var(--text-main)', 
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
            background: 'var(--input-bg)', 
            border: '1px solid var(--border)', 
            borderRadius: '8px', 
            color: 'var(--text-main)', 
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
            background: 'var(--input-bg)', 
            border: '1px solid var(--border)', 
            borderRadius: '8px', 
            color: 'var(--text-main)', 
            fontSize: '1rem', 
            resize: 'vertical',
            outline: 'none'
          }} 
        />
      </div>
      
      <button type="submit" style={{ width: '100%', padding: '15px', background: 'var(--accent)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer' }}>Send Message</button>
    </form>
  );
}