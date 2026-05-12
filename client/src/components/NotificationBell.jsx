import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markAllRead, deleteNotification } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function NotificationBell() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (!user) return;
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to load notifications');
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAllRead = async () => {
    await markAllRead();
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    await deleteNotification(id);
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleClick = (notification) => {
    if (notification.link) {
      navigate(notification.link);
      setOpen(false);
    }
  };

  if (!user) return null;

  return (
    <div ref={ref} style={styles.container}>
      <button style={styles.bell} onClick={() => setOpen(!open)}>
        🔔
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div style={{ ...styles.dropdown, background: colors.card }}>
          <div style={styles.header}>
            <strong style={{ color: colors.text }}>🔔 Notifications</strong>
            {unreadCount > 0 && (
              <button style={styles.markAllBtn} onClick={handleMarkAllRead}>
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div style={styles.empty}>
              <p style={{ fontSize: '2rem' }}>🔕</p>
              <p style={{ color: colors.subtext }}>No notifications yet</p>
            </div>
          ) : (
            <div style={styles.list}>
              {notifications.map(n => (
                <div key={n.id}
                  style={{
                    ...styles.item,
                    background: n.is_read ? 'transparent' : 'rgba(233,69,96,0.08)',
                    cursor: n.link ? 'pointer' : 'default'
                  }}
                  onClick={() => handleClick(n)}>
                  <div style={styles.itemContent}>
                    {!n.is_read && <div style={styles.dot} />}
                    <div style={{ flex: 1 }}>
                      <p style={{ ...styles.message, color: colors.text }}>{n.message}</p>
                      <p style={{ ...styles.time, color: colors.subtext }}>
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button style={styles.deleteBtn}
                      onClick={(e) => handleDelete(n.id, e)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { position: 'relative' },
  bell: {
    background: 'transparent', border: '1px solid #fff',
    color: '#fff', fontSize: '1.1rem', padding: '0.4rem 0.6rem',
    borderRadius: '8px', cursor: 'pointer', position: 'relative'
  },
  badge: {
    position: 'absolute', top: '-8px', right: '-8px',
    background: '#e94560', color: '#fff', borderRadius: '50%',
    width: '18px', height: '18px', fontSize: '0.7rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 'bold'
  },
  dropdown: {
    position: 'absolute', right: 0, top: '110%',
    width: '320px', borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)', zIndex: 1000,
    overflow: 'hidden'
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)'
  },
  markAllBtn: {
    background: 'none', border: 'none', color: '#e94560',
    cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold'
  },
  list: { maxHeight: '400px', overflowY: 'auto' },
  item: { padding: '0.8rem 1rem', borderBottom: '1px solid rgba(0,0,0,0.05)' },
  itemContent: { display: 'flex', alignItems: 'flex-start', gap: '0.5rem' },
  dot: {
    width: '8px', height: '8px', borderRadius: '50%',
    background: '#e94560', marginTop: '5px', flexShrink: 0
  },
  message: { fontSize: '0.85rem', margin: 0, lineHeight: '1.4' },
  time: { fontSize: '0.75rem', margin: '0.2rem 0 0' },
  deleteBtn: {
    background: 'none', border: 'none', color: '#999',
    cursor: 'pointer', fontSize: '0.8rem', padding: '0 0.2rem'
  },
  empty: { padding: '2rem', textAlign: 'center' }
};