import { useState, useEffect } from 'react';
import { getAnnouncements, addAnnouncement, deleteAnnouncement } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

export default function Announcements({ eventId, organizerId }) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getAnnouncements(eventId).then(res => setAnnouncements(res.data));
  }, [eventId]);

  const handleAdd = async () => {
    if (!message.trim()) return toast.error('Please write a message');
    try {
      const res = await addAnnouncement(eventId, message);
      setAnnouncements([res.data, ...announcements]);
      setMessage('');
      setShowForm(false);
      toast.success('Announcement sent to all attendees!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send announcement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    await deleteAnnouncement(id);
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast.success('Announcement deleted');
  };

  const isOrganizer = user && user.id === organizerId;

  return (
    <div style={{ ...styles.container, borderColor: colors.border }}>
      <div style={styles.header}>
        <h3 style={{ color: colors.text }}>📢 Announcements ({announcements.length})</h3>
        {isOrganizer && (
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Announcement'}
          </button>
        )}
      </div>

      {isOrganizer && showForm && (
        <div style={{ ...styles.form, background: colors.background }}>
          <p style={{ color: colors.subtext, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            📣 This will notify all attendees who RSVPed as "Going"
          </p>
          <textarea
            placeholder="Write your announcement..."
            style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <button style={styles.sendBtn} onClick={handleAdd}>
            📢 Send to All Attendees
          </button>
        </div>
      )}

      {announcements.length === 0 ? (
        <p style={{ color: colors.subtext, textAlign: 'center', padding: '1rem' }}>
          No announcements yet
        </p>
      ) : (
        announcements.map(a => (
          <div key={a.id} style={{ ...styles.announcement, background: colors.background }}>
            <div style={styles.announcementHeader}>
              <div style={styles.announcementIcon}>📢</div>
              <div style={{ flex: 1 }}>
                <strong style={{ color: colors.text }}>{a.organizer_name}</strong>
                <p style={{ color: colors.subtext, fontSize: '0.75rem', margin: 0 }}>
                  {new Date(a.created_at).toLocaleString()}
                </p>
              </div>
              {isOrganizer && (
                <button style={styles.deleteBtn} onClick={() => handleDelete(a.id)}>🗑</button>
              )}
            </div>
            <p style={{ color: colors.text, margin: '0.5rem 0 0', lineHeight: '1.5' }}>{a.message}</p>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  addBtn: { padding: '0.5rem 1rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' },
  form: { padding: '1rem', borderRadius: '10px', marginBottom: '1rem' },
  input: { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid', fontSize: '0.95rem', boxSizing: 'border-box', height: '100px', resize: 'vertical', marginBottom: '0.5rem' },
  sendBtn: { padding: '0.7rem 1.5rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  announcement: { padding: '1rem', borderRadius: '10px', marginBottom: '0.8rem', borderLeft: '4px solid #e94560' },
  announcementHeader: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  announcementIcon: { fontSize: '1.5rem' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }
};