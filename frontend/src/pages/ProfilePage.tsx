import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

interface Message { _id: string; body: string; reply: string; status: string; createdAt: string; }

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [pic, setPic] = useState<File | null>(null);
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });
  const [pwMsg, setPwMsg] = useState({ text: '', type: '' });
  
  const [myMessages, setMyMessages] = useState<Message[]>([]);

  useEffect(() => {
    API.get('/messages/my-messages').then(res => setMyMessages(res.data)).catch(() => {});
  }, []);

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg({ text: '', type: '' });
    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    if (pic) fd.append('profilePic', pic);

    try {
      const { data } = await API.put('/auth/profile', fd);
      setUser(data);
      setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error) { 
      // Fix: Cast error instead of using 'any'
      const err = error as { response?: { data?: { message?: string } } };
      setProfileMsg({ text: err.response?.data?.message || 'Error updating profile', type: 'error' }); 
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg({ text: '', type: '' });
    try {
      await API.put('/auth/change-password', { currentPassword: curPw, newPassword: newPw });
      setPwMsg({ text: 'Password changed successfully!', type: 'success' });
      setCurPw(''); setNewPw('');
    } catch (error) { 
      // Fix: Cast error instead of using 'any'
      const err = error as { response?: { data?: { message?: string } } };
      setPwMsg({ text: err.response?.data?.message || 'Error changing password', type: 'error' }); 
    }
  };

  const picSrc = user?.profilePic ? `http://localhost:5000/uploads/${user.profilePic}` : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  const inputStyle = { width: '100%', padding: '12px 15px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' };
  const fileLabelStyle = { width: '100%', display: 'inline-block', padding: '12px 15px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '1rem', cursor: 'pointer', textAlign: 'center' as const };

  return (
    <section className="page-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh', paddingTop: '120px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--accent, #ff7e5f)', fontSize: '2.5rem' }}>My Profile</h2>
      </div>

      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        <form className="form-box" onSubmit={handleProfile}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
            <img src={picSrc} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
            <h3 style={{ margin: 0 }}>Edit Details</h3>
          </div>

          {profileMsg.text && <div style={{ color: profileMsg.type === 'error' ? '#ff4c4c' : '#4BB543', backgroundColor: profileMsg.type === 'error' ? 'rgba(255, 76, 76, 0.1)' : 'rgba(75, 181, 67, 0.1)', padding: '10px', borderRadius: '6px', marginBottom: '15px', textAlign: 'center' }}>{profileMsg.text}</div>}

          <div className="form-group">
            <label>Display Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
          </div>

          <div className="form-group">
            <label>Short Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '5px' }}>Change Profile Picture</label>
            <label style={fileLabelStyle}>
              {pic ? pic.name : 'Browse... No file selected'}
              <input type="file" accept="image/*" onChange={e => { if (e.target.files) setPic(e.target.files[0]) }} style={{ display: 'none' }} />
            </label>
          </div>

          <button type="submit" style={{ marginTop: '10px', width: '100%' }}>Save Profile</button>
        </form>

        <form className="form-box" onSubmit={handlePassword}>
          <h3 style={{ marginBottom: '20px' }}>Change Password</h3>
          {pwMsg.text && <div style={{ color: pwMsg.type === 'error' ? '#ff4c4c' : '#4BB543', backgroundColor: pwMsg.type === 'error' ? 'rgba(255, 76, 76, 0.1)' : 'rgba(75, 181, 67, 0.1)', padding: '10px', borderRadius: '6px', marginBottom: '15px', textAlign: 'center' }}>{pwMsg.text}</div>}

          <div className="form-group">
            <label>Current Password</label>
            <input type="password" value={curPw} onChange={e => setCurPw(e.target.value)} required style={inputStyle} />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input type="password" placeholder="Min. 6 characters" value={newPw} onChange={e => setNewPw(e.target.value)} required minLength={6} style={inputStyle} />
          </div>

          <button type="submit" style={{ marginTop: '10px', width: '100%' }}>Update Password</button>
        </form>

        <div className="form-box">
          <h3 style={{ marginBottom: '20px', color: 'var(--accent)' }}>Contact Inbox</h3>
          {myMessages.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>You haven't sent any messages to the Admin.</p>
          ) : (
            myMessages.map(msg => (
              <div key={msg._id} style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ marginBottom: '15px', color: 'var(--text-muted)' }}><strong>You:</strong> {msg.body}</p>
                {msg.status === 'replied' ? (
                  <div style={{ padding: '15px', background: 'rgba(75, 181, 67, 0.1)', borderLeft: '3px solid #4BB543', borderRadius: '4px' }}>
                    <strong style={{ color: '#4BB543', display: 'block', marginBottom: '5px' }}>Admin Reply:</strong> {msg.reply}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.85rem', background: 'rgba(255,126,95,0.2)', color: 'var(--accent)', padding: '5px 10px', borderRadius: '20px' }}>Pending reply...</span>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}