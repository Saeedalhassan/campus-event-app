import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const categoryColors = {
    Tech: '#3498db',
    Sports: '#2ecc71',
    Arts: '#9b59b6',
    Music: '#e74c3c',
    Academic: '#f39c12',
    Social: '#1abc9c',
    Default: '#e94560'
  };

  const catColor = categoryColors[event.category] || categoryColors.Default;

  return (
    <div style={{ ...styles.card, background: colors.card }}
      onClick={() => navigate(`/events/${event.id}`)}>
      <div style={styles.imageContainer}>
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} style={styles.img} />
        ) : (
          <div style={{ ...styles.placeholder, background: `linear-gradient(135deg, ${catColor}, #1a1a2e)` }}>
            <span style={styles.placeholderIcon}>🎓</span>
          </div>
        )}
        <div style={{ ...styles.categoryBadge, background: catColor }}>
          {event.category}
        </div>
      </div>
      <div style={styles.body}>
        <h3 style={{ ...styles.title, color: colors.text }}>{event.title}</h3>
        <div style={styles.details}>
          <p style={{ ...styles.detail, color: colors.subtext }}>
            📍 {event.location}
          </p>
          <p style={{ ...styles.detail, color: colors.subtext }}>
            🗓 {new Date(event.start_time).toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric'
            })}
          </p>
          <p style={{ ...styles.detail, color: colors.subtext }}>
            ⏰ {new Date(event.start_time).toLocaleTimeString('en-US', {
              hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
        <div style={styles.footer}>
         <span style={{ ...styles.organizer, color: colors.subtext }}>
           👤 <span
            style={{ color: '#e94560', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={e => { e.stopPropagation(); navigate(`/profile/${event.organizer_id}`); }}>
            {event.organizer_name}
           </span>
          </span>
          <button style={{ ...styles.viewBtn, background: catColor }}>
            View →
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  imageContainer: { position: 'relative' },
  img: { width: '100%', height: '200px', objectFit: 'cover' },
  placeholder: {
    width: '100%', height: '200px',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  placeholderIcon: { fontSize: '4rem' },
  categoryBadge: {
    position: 'absolute', top: '10px', right: '10px',
    color: '#fff', padding: '3px 10px', borderRadius: '20px',
    fontSize: '0.75rem', fontWeight: 'bold'
  },
  body: { padding: '1.2rem' },
  title: { fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.8rem', lineHeight: '1.4' },
  details: { marginBottom: '1rem' },
  detail: { fontSize: '0.85rem', margin: '0.2rem 0' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  organizer: { fontSize: '0.8rem' },
  viewBtn: {
    color: '#fff', border: 'none', padding: '0.4rem 0.8rem',
    borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold'
  }
};