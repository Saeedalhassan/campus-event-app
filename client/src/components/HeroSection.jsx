import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HeroSection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={styles.hero}>
      <div style={styles.overlay}>
        <div style={styles.content}>
          <div style={styles.badge}>🎓 University For Development Studies</div>
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
            <button style={{ ...styles.secondaryBtn, borderColor: '#e94560', color: '#e94560' }}
              onClick={() => navigate('/about')}>
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
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #e94560 100%)',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  overlay: {
    width: '100%',
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    maxWidth: '700px',
    textAlign: 'center',
    animation: 'fadeIn 1s ease'
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(233, 69, 96, 0.2)',
    border: '1px solid #e94560',
    color: '#e94560',
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    marginBottom: '1.5rem',
    fontWeight: 'bold'
  },
  title: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    color: '#ffffff',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '1rem'
  },
  highlight: {
    color: '#e94560',
    display: 'block'
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: '1.6',
    marginBottom: '2rem',
    maxWidth: '500px',
    margin: '0 auto 2rem'
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '3rem'
  },
  primaryBtn: {
    padding: '0.9rem 2rem',
    background: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(233,69,96,0.4)'
  },
  secondaryBtn: {
    padding: '0.9rem 2rem',
    background: 'transparent',
    color: '#fff',
    border: '2px solid #fff',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2rem',
    flexWrap: 'wrap'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  statNum: {
    fontSize: '2rem',
    color: '#e94560',
    fontWeight: '800'
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.85rem'
  },
  statDivider: {
    width: '1px',
    height: '40px',
    background: 'rgba(255,255,255,0.2)'
  }
};