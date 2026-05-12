import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventAnalytics, getEvent } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function StatCard({ icon, label, value, color }) {
  const { colors } = useTheme();
  return (
    <div style={{ ...styles.statCard, background: colors.card }}>
      <div style={{ fontSize: '2rem' }}>{icon}</div>
      <div style={{ ...styles.statValue, color }}>{value}</div>
      <div style={{ color: colors.subtext, fontSize: '0.85rem' }}>{label}</div>
    </div>
  );
}

export default function EventAnalytics() {
  const { id } = useParams();
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (!user) return navigate('/login');
    getEvent(id).then(res => setEvent(res.data));
    getEventAnalytics(id)
      .then(res => setAnalytics(res.data))
      .catch(() => {
        toast.error('Not authorized to view analytics');
        navigate('/dashboard');
      });
      // eslint-disable-next-line
  }, [id, user]);

  if (!analytics || !event) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p style={{ color: colors.text, fontSize: '1.5rem' }}>⏳ Loading analytics...</p>
    </div>
  );

  const totalRsvps = analytics.going + analytics.maybe + analytics.not_going;

  return (
    <div style={{ ...styles.page, background: colors.background }}>
      <div style={styles.container}>

        <button style={{ ...styles.backBtn, color: colors.subtext }}
          onClick={() => navigate(`/events/${id}`)}>
          ← Back to Event
        </button>

        <div style={styles.header}>
          <h2 style={{ color: colors.text }}>📊 Event Analytics</h2>
          <h3 style={{ color: colors.subtext, fontWeight: 'normal' }}>{event.title}</h3>
        </div>

        {/* MAIN STATS */}
        <div style={styles.statsGrid}>
          <StatCard icon="👁️" label="Total Views" value={analytics.views} color="#3498db" />
          <StatCard icon="👤" label="Unique Viewers" value={analytics.uniqueViews} color="#9b59b6" />
          <StatCard icon="✅" label="Going" value={analytics.going} color="#2ecc71" />
          <StatCard icon="🤔" label="Maybe" value={analytics.maybe} color="#f39c12" />
          <StatCard icon="❌" label="Not Going" value={analytics.not_going} color="#e74c3c" />
          <StatCard icon="❤️" label="Likes" value={analytics.likes} color="#e94560" />
          <StatCard icon="🔖" label="Saves" value={analytics.saves} color="#f39c12" />
          <StatCard icon="💬" label="Comments" value={analytics.comments} color="#1abc9c" />
          <StatCard icon="⭐" label="Avg Rating" value={analytics.avgRating.toFixed(1)} color="#f39c12" />
        </div>

        {/* RSVP BREAKDOWN */}
        <div style={{ ...styles.section, background: colors.card }}>
          <h3 style={{ color: colors.text, marginBottom: '1rem' }}>📋 RSVP Breakdown</h3>
          {totalRsvps === 0 ? (
            <p style={{ color: colors.subtext }}>No RSVPs yet</p>
          ) : (
            <>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${(analytics.going / totalRsvps) * 100}%`, background: '#2ecc71' }} />
                <div style={{ ...styles.progressFill, width: `${(analytics.maybe / totalRsvps) * 100}%`, background: '#f39c12' }} />
                <div style={{ ...styles.progressFill, width: `${(analytics.not_going / totalRsvps) * 100}%`, background: '#e74c3c' }} />
              </div>
              <div style={styles.rsvpLegend}>
                <span style={{ color: '#2ecc71' }}>✅ Going: {analytics.going}</span>
                <span style={{ color: '#f39c12' }}>🤔 Maybe: {analytics.maybe}</span>
                <span style={{ color: '#e74c3c' }}>❌ Not Going: {analytics.not_going}</span>
              </div>
            </>
          )}
        </div>

        {/* VIEWS BY DAY */}
        <div style={{ ...styles.section, background: colors.card }}>
          <h3 style={{ color: colors.text, marginBottom: '1rem' }}>📈 Views Last 7 Days</h3>
          {analytics.viewsByDay.length === 0 ? (
            <p style={{ color: colors.subtext }}>No view data yet</p>
          ) : (
            <div style={styles.chart}>
              {analytics.viewsByDay.map(day => {
                const maxViews = Math.max(...analytics.viewsByDay.map(d => parseInt(d.count)));
                const height = maxViews > 0 ? (parseInt(day.count) / maxViews) * 100 : 0;
                return (
                  <div key={day.date} style={styles.chartBar}>
                    <div style={styles.barValue}>
                      <span style={{ color: colors.text, fontSize: '0.75rem' }}>{day.count}</span>
                    </div>
                    <div style={{ ...styles.bar, height: `${height}%`, background: '#e94560' }} />
                    <div style={{ color: colors.subtext, fontSize: '0.7rem', marginTop: '0.3rem' }}>
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ENGAGEMENT SCORE */}
        <div style={{ ...styles.section, background: colors.card }}>
          <h3 style={{ color: colors.text, marginBottom: '0.5rem' }}>🏆 Engagement Score</h3>
          <p style={{ color: colors.subtext, fontSize: '0.85rem', marginBottom: '1rem' }}>
            Based on views, likes, comments and RSVPs
          </p>
          <div style={styles.scoreContainer}>
            <div style={styles.score}>
              {Math.min(100, Math.round(
                (analytics.views * 1) +
                (analytics.likes * 3) +
                (analytics.comments * 2) +
                (analytics.going * 4)
              ))}
            </div>
            <div style={{ color: colors.subtext }}>Engagement Points</div>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', padding: '1.5rem 1rem' },
  container: { maxWidth: '900px', margin: '0 auto' },
  backBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', marginBottom: '1rem' },
  header: { textAlign: 'center', marginBottom: '2rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  statCard: { padding: '1.2rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  statValue: { fontSize: '2rem', fontWeight: 'bold', margin: '0.3rem 0' },
  section: { padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  progressBar: { display: 'flex', height: '20px', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.5rem' },
  progressFill: { height: '100%', transition: 'width 0.3s' },
  rsvpLegend: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
  chart: { display: 'flex', gap: '0.5rem', alignItems: 'flex-end', height: '150px', padding: '0.5rem 0' },
  chartBar: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barValue: { marginBottom: '0.2rem' },
  bar: { width: '100%', borderRadius: '4px 4px 0 0', minHeight: '4px' },
  scoreContainer: { textAlign: 'center' },
  score: { fontSize: '4rem', fontWeight: 'bold', color: '#e94560' }
};