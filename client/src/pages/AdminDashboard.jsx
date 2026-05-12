import { useEffect, useState } from 'react';
import { getAdminStats, getAdminUsers, getAdminEvents, deleteAdminUser, deleteAdminEvent, changeUserRole } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      const [statsRes, usersRes, eventsRes] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getAdminEvents()
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
    } catch (err) {
      toast.error('Failed to load admin data');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user and all their data?')) return;
    try {
      await deleteAdminUser(id);
      setUsers(users.filter(u => u.id !== id));
      toast.success('User deleted');
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await deleteAdminEvent(id);
      setEvents(events.filter(e => e.id !== id));
      toast.success('Event deleted');
    } catch (err) {
      toast.error('Failed to delete event');
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await changeUserRole(id, role);
      setUsers(users.map(u => u.id === id ? { ...u, role } : u));
      toast.success('Role updated');
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div style={{ ...styles.page, background: colors.background }}>
      <div style={styles.container}>
        <h1 style={{ color: colors.text, marginBottom: '1.5rem' }}>🛡️ Admin Dashboard</h1>

        {/* TABS */}
        <div style={styles.tabs}>
          {['stats', 'users', 'events'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ ...styles.tab, background: activeTab === tab ? '#e94560' : colors.card, color: activeTab === tab ? '#fff' : colors.text }}>
              {tab === 'stats' ? '📊 Statistics' : tab === 'users' ? '👥 Users' : '📅 Events'}
            </button>
          ))}
        </div>

        {/* STATS TAB */}
        {activeTab === 'stats' && stats && (
          <div style={styles.statsGrid}>
            <div style={{ ...styles.statCard, background: colors.card }}>
              <div style={styles.statNumber}>{stats.totalUsers}</div>
              <div style={{ color: colors.subtext }}>Total Users</div>
            </div>
            <div style={{ ...styles.statCard, background: colors.card }}>
              <div style={styles.statNumber}>{stats.totalEvents}</div>
              <div style={{ color: colors.subtext }}>Total Events</div>
            </div>
            <div style={{ ...styles.statCard, background: colors.card }}>
              <div style={styles.statNumber}>{stats.totalRsvps}</div>
              <div style={{ color: colors.subtext }}>Total RSVPs</div>
            </div>
            <div style={{ ...styles.statCard, background: colors.card }}>
              <div style={styles.statNumber}>{stats.totalComments}</div>
              <div style={{ color: colors.subtext }}>Total Comments</div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div>
            <h3 style={{ color: colors.text, marginBottom: '1rem' }}>All Users ({users.length})</h3>
            {users.map(u => (
              <div key={u.id} style={{ ...styles.row, background: colors.card }}>
                <div>
                  <strong style={{ color: '#e94560', cursor: 'pointer' }}
                    onClick={() => navigate(`/profile/${u.id}`)}>
                    {u.name}
                  </strong>
                  <p style={{ color: colors.subtext, margin: 0, fontSize: '0.85rem' }}>{u.email}</p>
                  <p style={{ color: colors.subtext, margin: 0, fontSize: '0.85rem' }}>
                    Joined: {new Date(u.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={styles.rowActions}>
                  <select
                    value={u.role}
                    onChange={e => handleRoleChange(u.id, e.target.value)}
                    style={{ ...styles.select, background: colors.input, color: colors.text }}>
                    <option value="student">Student</option>
                    <option value="organizer">Organizer</option>
                    <option value="admin">Admin</option>
                  </select>
                  {u.id !== user.id && (
                    <button style={styles.deleteBtn} onClick={() => handleDeleteUser(u.id)}>
                      🗑 Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <div>
            <h3 style={{ color: colors.text, marginBottom: '1rem' }}>All Events ({events.length})</h3>
            {events.map(e => (
              <div key={e.id} style={{ ...styles.row, background: colors.card }}>
                <div>
                 <strong style={{ color: '#e94560', cursor: 'pointer' }}
                   onClick={() => navigate(`/profile/${e.organizer_id}`)}>
                   {e.organizer_namename}
                 </strong>
                  <p style={{ color: colors.subtext, margin: 0, fontSize: '0.85rem' }}>
                    By {e.organizer_name} — 📍 {e.location}
                  </p>
                  <p style={{ color: colors.subtext, margin: 0, fontSize: '0.85rem' }}>
                    🗓 {new Date(e.start_time).toLocaleDateString()}
                  </p>
                </div>
                <div style={styles.rowActions}>
                  <button style={styles.viewBtn} onClick={() => navigate(`/events/${e.id}`)}>
                    👁 View
                  </button>
                  <button style={styles.deleteBtn} onClick={() => handleDeleteEvent(e.id)}>
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', padding: '2rem' },
  container: { maxWidth: '900px', margin: '0 auto' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  tab: { padding: '0.6rem 1.2rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' },
  statCard: { padding: '1.5rem', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  statNumber: { fontSize: '2.5rem', fontWeight: 'bold', color: '#e94560' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: '8px', marginBottom: '0.8rem', boxShadow: '0 1px 5px rgba(0,0,0,0.1)', flexWrap: 'wrap', gap: '0.5rem' },
  rowActions: { display: 'flex', gap: '0.5rem', alignItems: 'center' },
  select: { padding: '0.4rem', borderRadius: '5px', border: '1px solid #ddd' },
  viewBtn: { padding: '0.4rem 0.8rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  deleteBtn: { padding: '0.4rem 0.8rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};