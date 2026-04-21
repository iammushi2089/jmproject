import aboutImage from '../assets/about_phography.avif';

export default function About() {
  return (
    <section 
      className="page-section" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        minHeight: '85vh', // Forces the section to be tall enough to push the footer down
        paddingTop: '120px'
      }}
    >
      <h2 style={{ color: 'var(--accent, #ff7e5f)', marginBottom: '2rem' }}>About The StreetLens</h2>
      
      {/* Imported local image placed neatly here */}
      <img 
        src={aboutImage} 
        alt="Photographer" 
        style={{ 
          width: '100%', 
          maxWidth: '800px',
          maxHeight: '400px', 
          objectFit: 'cover', 
          borderRadius: '12px', 
          marginBottom: '2.5rem', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)' 
        }} 
      />
      
      <div style={{ maxWidth: '700px', textAlign: 'center', color: 'var(--text-muted, #a0a0a0)', fontSize: '1.1rem' }}>
        <p style={{ marginBottom: '1.5rem' }}>
          I am passionate about street photography because it captures real emotions, 
          unplanned moments, and the profound beauty of everyday life.
        </p>
        <p>
          My focus includes urban sunsets, bustling city streets, and the human stories that often go unnoticed in the rush of the modern world.
        </p>
      </div>
    </section>
  );
}