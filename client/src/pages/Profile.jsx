import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile, updateProfile, toggleFollow, getFollowStatus, getFollowers, getFollowing } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

export default function Profile() {
  const { id } = useParams();
  const { user, login } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', avatar_url: '' });
  const [following, setFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    getUserProfile(id).then(res => {
      setProfile(res.data.user);
      setEvents(res.data.events);
      setRsvps(res.data.rsvps);
      setForm({ name: res.data.user.name || '', bio: res.data.user.bio || '', avatar_url: res.data.user.avatar_url || '' });
    }).catch(() => toast.error('Profile not found'));

    if (user && user.id !== id) {
      getFollowStatus(id).then(res => {
        setFollowing(res.data.following);
        setFollowers(res.data.followers);
        setFollowingCount(res.data.following_count);
      });
    }

    getFollowers(id).then(res => setFollowersList(res.data));
    getFollowing(id).then(res => setFollowingList(res.data));
  }, [id, user]);

  const handleFollow = async () => {
    if (!user) return toast.error('Please login first');
    const res = await toggleFollow(id);
    setFollowing(res.data.following);
    setFollowers(prev => res.data.following ? prev + 1 : prev - 1);
    toast.success(res.data.following ? '👥 Following!' : 'Unfollowed');
  };

  const handleUpdate = async () => {
    try {
      const res = await updateProfile(form);
      setProfile(res.data);
      setEditing(false);
      toast.success('Profile updated!');
      const token = localStorage.getItem('token');
      login(token, res.data);
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (!profile) return <p style={{ padding: '2rem' }}>Loading...</p>;

  const isOwner = user && user.id === profile.id;

  return (
    <div style={{ ...styles.page, background: colors.background }}>
      <div style={{ ...styles.card, background: colors.card }}>

        {/* PROFILE HEADER */}
        <div style={styles.header}>
          <img
            src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.name}&background=e94560&color=fff&size=100`}
            alt={profile.name} style={styles.avatar} />
          <div style={styles.headerInfo}>
            {editing ? (
              <>
                <input style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name" />
                <input style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
                  value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })}
                  placeholder="Avatar URL (optional)" />
                <textarea style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border, height: '80px' }}
                  value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell us about yourself..." />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={styles.saveBtn} onClick={handleUpdate}>Save</button>
                  <button style={styles.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h2 style={{ color: colors.text }}>{profile.name}</h2>
                <p style={{ color: '#e94560', fontWeight: 'bold' }}>🎓 {profile.role}</p>
                <p style={{ color: colors.subtext }}>{profile.bio || 'No bio yet'}</p>
                <p style={{ color: colors.subtext, fontSize: '0.85rem' }}>
                  Joined {new Date(profile.created_at).toLocaleDateString()}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {isOwner && (
                    <button style={styles.editBtn} onClick={() => setEditing(true)}>✏️ Edit Profile</button>
                  )}
                  {!isOwner && user && (
                    <button style={{ ...styles.followBtn, background: following ? '#999' : '#e94560' }}
                      onClick={handleFollow}>
                      {following ? '✓ Following' : '+ Follow'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* STATS */}
        <div style={styles.stats}>
          <div style={styles.stat}>
            <strong style={{ color: colors.text, fontSize: '1.5rem' }}>{events.length}</strong>
            <span style={{ color: colors.subtext, fontSize: '0.85rem' }}>Events</span>
          </div>
          <div style={styles.stat}>
            <strong style={{ color: colors.text, fontSize: '1.5rem' }}>{followers}</strong>
            <span style={{ color: colors.subtext, fontSize: '0.85rem' }}>Followers</span>
          </div>
          <div style={styles.stat}>
            <strong style={{ color: colors.text, fontSize: '1.5rem' }}>{followingCount}</strong>
            <span style={{ color: colors.subtext, fontSize: '0.85rem' }}>Following</span>
          </div>
          <div style={styles.stat}>
            <strong style={{ color: colors.text, fontSize: '1.5rem' }}>{rsvps.length}</strong>
            <span style={{ color: colors.subtext, fontSize: '0.85rem' }}>Attending</span>
          </div>
        </div>

        {/* TABS */}
        <div style={styles.tabs}>
          {['events', 'attending', 'followers', 'following'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ ...styles.tab, background: activeTab === tab ? '#e94560' : colors.background, color: activeTab === tab ? '#fff' : colors.text }}>
              {tab === 'events' ? '📅 Events' : tab === 'attending' ? '✅ Attending' : tab === 'followers' ? '👥 Followers' : '👤 Following'}
            </button>
          ))}
        </div>

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <div>
            {events.length === 0 && <p style={{ color: colors.subtext, textAlign: 'center', padding: '1rem' }}>No events created yet</p>}
            {events.map(e => (
              <div key={e.id} style={{ ...styles.eventRow, background: colors.background }}
                onClick={() => navigate(`/events/${e.id}`)}>
                <strong style={{ color: colors.text }}>{e.title}</strong>
                <p style={{ color: colors.subtext, margin: '0.2rem 0 0', fontSize: '0.85rem' }}>
                  📍 {e.location} — 🗓 {new Date(e.start_time).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ATTENDING TAB */}
        {activeTab === 'attending' && (
          <div>
            {rsvps.length === 0 && <p style={{ color: colors.subtext, textAlign: 'center', padding: '1rem' }}>Not attending any events yet</p>}
            {rsvps.map(e => (
              <div key={e.id} style={{ ...styles.eventRow, background: colors.background }}
                onClick={() => navigate(`/events/${e.id}`)}>
                <strong style={{ color: colors.text }}>{e.title}</strong>
                <p style={{ color: colors.subtext, margin: '0.2rem 0 0', fontSize: '0.85rem' }}>
                  📍 {e.location} — 🗓 {new Date(e.start_time).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* FOLLOWERS TAB */}
        {activeTab === 'followers' && (
          <div>
            {followersList.length === 0 && <p style={{ color: colors.subtext, textAlign: 'center', padding: '1rem' }}>No followers yet</p>}
            {followersList.map(f => (
              <div key={f.id} style={{ ...styles.userRow, background: colors.background }}
                onClick={() => navigate(`/profile/${f.id}`)}>
                <img src={f.avatar_url || `https://ui-avatars.com/api/?name=${f.name}&background=e94560&color=fff`}
                  alt={f.name} style={styles.miniAvatar} />
                <div>
                  <strong style={{ color: colors.text }}>{f.name}</strong>
                  <p style={{ color: colors.subtext, margin: 0, fontSize: '0.8rem' }}>🎓 {f.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOLLOWING TAB */}
        {activeTab === 'following' && (
          <div>
            {followingList.length === 0 && <p style={{ color: colors.subtext, textAlign: 'center', padding: '1rem' }}>Not following anyone yet</p>}
            {followingList.map(f => (
              <div key={f.id} style={{ ...styles.userRow, background: colors.background }}
                onClick={() => navigate(`/profile/${f.id}`)}>
                <img src={f.avatar_url || `https://ui-avatars.com/api/?name=${f.name}&background=e94560&color=fff`}
                  alt={f.name} style={styles.miniAvatar} />
                <div>
                  <strong style={{ color: colors.text }}>{f.name}</strong>
                  <p style={{ color: colors.subtext, margin: 0, fontSize: '0.8rem' }}>🎓 {f.role}</p>
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
  page: { padding: '1.5rem 1rem', minHeight: '100vh' },
  card: { maxWidth: '800px', margin: '0 auto', borderRadius: '15px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  header: { display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap' },
  avatar: { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e94560' },
  headerInfo: { flex: 1 },
  input: { width: '100%', padding: '0.6rem', borderRadius: '5px', border: '1px solid', marginBottom: '0.5rem', boxSizing: 'border-box' },
  editBtn: { background: '#1a1a2e', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' },
  followBtn: { color: '#fff', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' },
  saveBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' },
  cancelBtn: { background: '#999', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' },
  stats: { display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(233,69,96,0.05)', borderRadius: '10px', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'space-around' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  tab: { padding: '0.5rem 1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' },
  eventRow: { padding: '0.8rem', borderRadius: '8px', marginBottom: '0.5rem', cursor: 'pointer' },
  userRow: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', borderRadius: '8px', marginBottom: '0.5rem', cursor: 'pointer' },
  miniAvatar: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }
};