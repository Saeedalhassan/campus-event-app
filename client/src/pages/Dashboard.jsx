import { useEffect, useState } from 'react';
import { getEvents, deleteEvent, getSavedEvents } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [myEvents, setMyEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('my-events');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    getEvents().then(res => {
      setMyEvents(res.data.filter(e => String(e.organizer_id) === String(user.id)));
    });
    getSavedEvents().then(res => setSavedEvents(res.data));
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await deleteEvent(id);
    setMyEvents(myEvents.filter(e => e.id !== id));
    toast.success('Event deleted');
  };

  if (!user) return <p style={{ padding: '2rem', color: colors.text }}>Please login first.</p>;

  return (
    <div style={{ ...styles.page, background: colors.background }}>
      <div style={styles.container}>
        <h2 style={{ color: colors.text, marginBottom: '0.5rem' }}>Welcome, {user.name} 👋</h2>

        <div style={styles.statsRow}>
          <div style={{ ...styles.statBox, background: colors.card }}>
            <strong style={{ color: '#e94560', fontSize: '1.8rem' }}>{myEvents.length}</strong>
            <span style={{ color: colors.subtext }}>Events Created</span>
          </div>
          <div style={{ ...styles.statBox, background: colors.card }}>
            <strong style={{ color: '#f39c12', fontSize: '1.8rem' }}>{savedEvents.length}</strong>
            <span style={{ color: colors.subtext }}>Saved Events</span>
          </div>
        </div>

        <div style={styles.tabs}>
          <button onClick={() => setActiveTab('my-events')}
            style={{ ...styles.tab, background: activeTab === 'my-events' ? '#e94560' : colors.card, color: activeTab === 'my-events' ? '#fff' : colors.text }}>
            📅 My Events ({myEvents.length})
          </button>
          <button onClick={() => setActiveTab('saved')}
            style={{ ...styles.tab, background: activeTab === 'saved' ? '#f39c12' : colors.card, color: activeTab === 'saved' ? '#fff' : colors.text }}>
            🔖 Saved ({savedEvents.length})
          </button>
        </div>

        {activeTab === 'my-events' && (
          <>
            {myEvents.length === 0 && (
              <div style={{ ...styles.emptyState, background: colors.card }}>
                <p style={{ fontSize: '3rem' }}>📅</p>
                <p style={{ color: colors.text, fontWeight: 'bold' }}>No events yet</p>
                <button style={styles.createBtn} onClick={() => navigate('/create-event')}>
                  + Create Event
                </button>
              </div>
            )}
            {myEvents.map(event => (
              <div key={event.id} style={{ ...styles.row, background: colors.card }}>
                {event.image_url && <img src={event.image_url} alt={event.title} style={styles.eventImg} />}
                <div style={styles.eventInfo}>
                  <strong style={{ color: colors.text }}>{event.title}</strong>
                  <p style={{ color: colors.subtext, fontSize: '0.85rem' }}>📍 {event.location}</p>
                  <p style={{ color: colors.subtext, fontSize: '0.85rem' }}>🗓 {new Date(event.start_time).toLocaleDateString()}</p>
                </div>
                <div style={styles.rowActions}>
                <button style={styles.viewBtn} onClick={() => navigate(`/events/${event.id}`)}>View</button>
                <button style={styles.analyticsBtn} onClick={() => navigate(`/analytics/${event.id}`)}>📊</button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(event.id)}>Delete</button>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'saved' && (
          <>
            {savedEvents.length === 0 && (
              <div style={{ ...styles.emptyState, background: colors.card }}>
                <p style={{ fontSize: '3rem' }}>🔖</p>
                <p style={{ color: colors.text, fontWeight: 'bold' }}>No saved events yet</p>
                <p style={{ color: colors.subtext }}>Click 📌 on any event to save it</p>
              </div>
            )}
            {savedEvents.map(event => (
              <div key={event.id} style={{ ...styles.row, background: colors.card }}
                onClick={() => navigate(`/events/${event.id}`)}>
                {event.image_url && <img src={event.image_url} alt={event.title} style={styles.eventImg} />}
                <div style={styles.eventInfo}>
                  <strong style={{ color: colors.text }}>{event.title}</strong>
                  <p style={{ color: colors.subtext, fontSize: '0.85rem' }}>📍 {event.location}</p>
                  <p style={{ color: colors.subtext, fontSize: '0.85rem' }}>🗓 {new Date(event.start_time).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', padding: '1.5rem 1rem' },
  container: { maxWidth: '800px', margin: '0 auto' },
  statsRow: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  statBox: { padding: '1rem 1.5rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flex: 1 },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  tab: { padding: '0.6rem 1.2rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  emptyState: { padding: '2rem', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  createBtn: { marginTop: '1rem', padding: '0.7rem 1.5rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  row: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '10px', marginBottom: '0.8rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flexWrap: 'wrap', cursor: 'pointer' },
  eventImg: { width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' },
  eventInfo: { flex: 1 },
  rowActions: { display: 'flex', gap: '0.5rem' },
  analyticsBtn: { padding: '0.4rem 0.8rem', background: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  viewBtn: { padding: '0.4rem 0.8rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  deleteBtn: { padding: '0.4rem 0.8rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};