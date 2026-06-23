import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HeroSection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={styles.hero}>
      <div style={styles.overlay}>
        <div style={styles.content}>
          <img
            src="https://res.cloudinary.com/difjtbnve/image/upload/v1782196514/uds-logo_ewm8w2.jpg"
            alt="UDS Logo" style={styles.logo} />
          <div style={styles.badge}>🎓 University of Development Studies</div>
          <h1 style={styles.title}>
            Discover & Join
            <span style={styles.highlight}> Campus Events</span>
          </h1>
          <p style={styles.subtitle}>
            Stay connected with everything happening at UDS.
            Find events, RSVP, and never miss out again.
          </p>
          <div style={styles.buttons}>
            <button style={styles.primaryBtn} onClick={() => navigate(user ? '/create-event' : '/login')}>
              {user ? '➕ Create Event' : '🚀 Get Started'}
            </button>
            <button style={styles.secondaryBtn} onClick={() => {
              document.getElementById('events-section').scrollIntoView({ behavior: 'smooth' });
            }}>
              📅 Browse Events
            </button>
            <button style={styles.outlineBtn} onClick={() => navigate('/about')}>
              ℹ️ About
            </button>
          </div>
          <div style={styles.stats}>
            <div style={styles.stat}>
              <strong style={styles.statNum}>100+</strong>
              <span style={styles.statLabel}>Events</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <strong style={styles.statNum}>500+</strong>
              <span style={styles.statLabel}>Students</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <strong style={styles.statNum}>10+</strong>
              <span style={styles.statLabel}>Categories</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  hero: {
    backgroundImage: `url(https://res.cloudinary.com/difjtbnve/image/upload/v1782196731/uds-campus_pywq83.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(27,94,32,0.75) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  },
  content: { maxWidth: '700px', textAlign: 'center', animation: 'fadeIn 1s ease' },
  logo: { width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #4CAF50', marginBottom: '1rem', objectFit: 'cover' },
  badge: { display: 'inline-block', background: 'rgba(46,125,50,0.4)', border: '1px solid #4CAF50', color: '#4CAF50', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 'bold' },
  title: { fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#ffffff', fontWeight: '800', lineHeight: '1.2', marginBottom: '1rem' },
  highlight: { color: '#4CAF50', display: 'block' },
  subtitle: { fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' },
  buttons: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' },
  primaryBtn: { padding: '0.9rem 2rem', background: '#2E7D32', color: '#fff', border: 'none', borderRadius: '30px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(46,125,50,0.5)' },
  secondaryBtn: { padding: '0.9rem 2rem', background: 'transparent', color: '#fff', border: '2px solid #fff', borderRadius: '30px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
  outlineBtn: { padding: '0.9rem 2rem', background: 'transparent', color: '#4CAF50', border: '2px solid #4CAF50', borderRadius: '30px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
  stats: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { fontSize: '2rem', color: '#4CAF50', fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' },
  statDivider: { width: '1px', height: '40px', background: 'rgba(255,255,255,0.2)' }
};