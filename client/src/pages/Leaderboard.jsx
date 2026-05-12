import { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

function Medal({ rank }) {
  if (rank === 1) return <span style={{ fontSize: '1.5rem' }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: '1.5rem' }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: '1.5rem' }}>🥉</span>;
  return <span style={{ color: '#999', fontWeight: 'bold', fontSize: '1rem' }}>#{rank}</span>;
}

export default function Leaderboard() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('organizers');

  useEffect(() => {
    getLeaderboard().then(res => setData(res.data));
  }, []);

  if (!data) return (
    <div style={{ padding: '3rem', textAlign: 'center' }}>
      <p style={{ fontSize: '2rem' }}>⏳</p>
      <p style={{ color: colors.subtext }}>Loading leaderboard...</p>
    </div>
  );

  const list = activeTab === 'organizers' ? data.topOrganizers : data.topAttendees;

  return (
    <div style={{ ...styles.page, background: colors.background }}>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <h2 style={{ color: colors.text, fontSize: '2rem' }}>🏆 Leaderboard</h2>
          <p style={{ color: colors.subtext }}>Most active members of CampusEvents UDS</p>
        </div>

        {/* TABS */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, background: activeTab === 'organizers' ? '#e94560' : colors.card, color: activeTab === 'organizers' ? '#fff' : colors.text }}
            onClick={() => setActiveTab('organizers')}>
            🎯 Top Organizers
          </button>
          <button
            style={{ ...styles.tab, background: activeTab === 'attendees' ? '#e94560' : colors.card, color: activeTab === 'attendees' ? '#fff' : colors.text }}
            onClick={() => setActiveTab('attendees')}>
            ⭐ Top Attendees
          </button>
        </div>

        {/* TOP 3 PODIUM */}
        {list.length >= 3 && (
          <div style={styles.podium}>
            {/* 2nd place */}
            <div style={styles.podiumItem} onClick={() => navigate(`/profile/${list[1].id}`)}>
              <img src={list[1].avatar_url || `https://ui-avatars.com/api/?name=${list[1].name}&background=C0C0C0&color=fff`}
                alt={list[1].name} style={{ ...styles.podiumAvatar, border: '3px solid #C0C0C0' }} />
              <div style={{ ...styles.podiumBase, background: '#C0C0C0', height: '80px' }}>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>🥈</span>
              </div>
              <p style={{ color: colors.text, fontWeight: 'bold', fontSize: '0.85rem', textAlign: 'center' }}>{list[1].name}</p>
            </div>

            {/* 1st place */}
            <div style={styles.podiumItem} onClick={() => navigate(`/profile/${list[0].id}`)}>
              <div style={styles.crown}>👑</div>
              <img src={list[0].avatar_url || `https://ui-avatars.com/api/?name=${list[0].name}&background=FFD700&color=fff`}
                alt={list[0].name} style={{ ...styles.podiumAvatar, width: '80px', height: '80px', border: '3px solid #FFD700' }} />
              <div style={{ ...styles.podiumBase, background: '#FFD700', height: '110px' }}>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>🥇</span>
              </div>
              <p style={{ color: colors.text, fontWeight: 'bold', textAlign: 'center' }}>{list[0].name}</p>
            </div>

            {/* 3rd place */}
            <div style={styles.podiumItem} onClick={() => navigate(`/profile/${list[2].id}`)}>
              <img src={list[2].avatar_url || `https://ui-avatars.com/api/?name=${list[2].name}&background=CD7F32&color=fff`}
                alt={list[2].name} style={{ ...styles.podiumAvatar, border: '3px solid #CD7F32' }} />
              <div style={{ ...styles.podiumBase, background: '#CD7F32', height: '60px' }}>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>🥉</span>
              </div>
              <p style={{ color: colors.text, fontWeight: 'bold', fontSize: '0.85rem', textAlign: 'center' }}>{list[2].name}</p>
            </div>
          </div>
        )}

        {/* FULL LIST */}
        <div style={{ ...styles.listCard, background: colors.card }}>
          {list.map((person, index) => (
            <div key={person.id} style={{ ...styles.listItem, borderColor: colors.border }}
              onClick={() => navigate(`/profile/${person.id}`)}>
              <div style={styles.rank}>
                <Medal rank={index + 1} />
              </div>
              <img src={person.avatar_url || `https://ui-avatars.com/api/?name=${person.name}&background=e94560&color=fff`}
                alt={person.name} style={styles.avatar} />
              <div style={styles.info}>
                <strong style={{ color: colors.text }}>{person.name}</strong>
                <p style={{ color: colors.subtext, margin: 0, fontSize: '0.8rem' }}>🎓 {person.role}</p>
              </div>
              <div style={styles.statsRow}>
                {activeTab === 'organizers' ? (
                  <>
                    <div style={styles.miniStat}>
                      <strong style={{ color: '#e94560' }}>{person.events_created}</strong>
                      <span style={{ color: colors.subtext, fontSize: '0.7rem' }}>Events</span>
                    </div>
                    <div style={styles.miniStat}>
                      <strong style={{ color: '#2ecc71' }}>{person.total_rsvps}</strong>
                      <span style={{ color: colors.subtext, fontSize: '0.7rem' }}>RSVPs</span>
                    </div>
                    <div style={styles.miniStat}>
                      <strong style={{ color: '#e74c3c' }}>{person.total_likes}</strong>
                      <span style={{ color: colors.subtext, fontSize: '0.7rem' }}>Likes</span>
                    </div>
                    <div style={styles.miniStat}>
                      <strong style={{ color: '#9b59b6' }}>{person.total_followers}</strong>
                      <span style={{ color: colors.subtext, fontSize: '0.7rem' }}>Followers</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={styles.miniStat}>
                      <strong style={{ color: '#2ecc71' }}>{person.events_attended}</strong>
                      <span style={{ color: colors.subtext, fontSize: '0.7rem' }}>Attended</span>
                    </div>
                    <div style={styles.miniStat}>
                      <strong style={{ color: '#3498db' }}>{person.total_comments}</strong>
                      <span style={{ color: colors.subtext, fontSize: '0.7rem' }}>Comments</span>
                    </div>
                    <div style={styles.miniStat}>
                      <strong style={{ color: '#e74c3c' }}>{person.total_likes_given}</strong>
                      <span style={{ color: colors.subtext, fontSize: '0.7rem' }}>Likes</span>
                    </div>
                    <div style={styles.miniStat}>
                      <strong style={{ color: '#9b59b6' }}>{person.total_following}</strong>
                      <span style={{ color: colors.subtext, fontSize: '0.7rem' }}>Following</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', padding: '1.5rem 1rem' },
  container: { maxWidth: '800px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '1.5rem' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center' },
  tab: { padding: '0.7rem 1.5rem', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' },
  podium: { display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1rem', marginBottom: '2rem', padding: '1rem' },
  podiumItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' },
  crown: { fontSize: '1.5rem', marginBottom: '0.3rem' },
  podiumAvatar: { width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.5rem' },
  podiumBase: { width: '80px', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  listCard: { borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  listItem: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderBottom: '1px solid', cursor: 'pointer' },
  rank: { width: '35px', textAlign: 'center' },
  avatar: { width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' },
  info: { flex: 1 },
  statsRow: { display: 'flex', gap: '0.8rem', flexWrap: 'wrap' },
  miniStat: { display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '40px' }
};