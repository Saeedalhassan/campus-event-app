import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const { colors } = useTheme();
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.page, background: colors.background }}>

      {/* HERO SECTION */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>About CampusEvents UDS</h1>
          <p style={styles.heroSubtitle}>
            The official campus events platform for the University For Development Studies
          </p>
        </div>
      </div>

      <div style={styles.container}>

        {/* APP DESCRIPTION */}
        <div style={{ ...styles.card, background: colors.card }}>
          <h2 style={{ color: colors.text, marginBottom: '1rem' }}>🎓 About The App</h2>
          <p style={{ color: colors.subtext, lineHeight: '1.8' }}>
            CampusEvents UDS is a comprehensive campus event management platform designed 
            specifically for the University For Development Studies. It connects students, 
            organizers and the university community by making it easy to discover, create 
            and manage campus events.
          </p>
          <div style={styles.featuresGrid}>
            {[
              { icon: '📅', text: 'Discover Events' },
              { icon: '🎟️', text: 'RSVP System' },
              { icon: '📢', text: 'Announcements' },
              { icon: '💬', text: 'Comments' },
              { icon: '🔔', text: 'Notifications' },
              { icon: '📊', text: 'Analytics' },
              { icon: '🏆', text: 'Leaderboard' },
              { icon: '📱', text: 'Mobile Friendly' }
            ].map(f => (
              <div key={f.text} style={{ ...styles.featureItem, background: colors.background }}>
                <span style={{ fontSize: '1.5rem' }}>{f.icon}</span>
                <span style={{ color: colors.text, fontSize: '0.85rem' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DEVELOPER SECTION */}
        <div style={{ ...styles.card, background: colors.card }}>
          <h2 style={{ color: colors.text, marginBottom: '1.5rem' }}>👨‍💻 Meet The Developer</h2>
          <div style={styles.developerCard}>
            <img
              src="http://localhost:5000/uploads/developer.jpg"
              alt="Saeed Alhassan"
              style={styles.devAvatar}
            />
            <div style={styles.devInfo}>
              <h3 style={{ color: colors.text, fontSize: '1.5rem', margin: '0 0 0.3rem' }}>
                Saeed Alhassan
              </h3>
              <p style={{ color: '#e94560', fontWeight: 'bold', margin: '0 0 0.5rem' }}>
                Full Stack Developer
              </p>
              <p style={{ color: colors.subtext, margin: '0 0 0.3rem' }}>
                🎓 University For Development Studies
              </p>
              <p style={{ color: colors.subtext, margin: '0 0 1rem', lineHeight: '1.6' }}>
                A passionate Computer Science student at UDS who built this platform 
                to solve the problem of students missing out on campus events. 
                This app was built with love for the UDS community.
              </p>
              <div style={styles.contactLinks}>
                <a href="mailto:alhassansaeed2005@gmail.com"
                  style={styles.contactBtn}>
                  📧 Email Me
                </a>
                <a href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...styles.contactBtn, background: '#333' }}>
                  💻 GitHub
                </a>
                <a href="https://wa.me/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...styles.contactBtn, background: '#25D366' }}>
                  📱 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* TECH STACK */}
        <div style={{ ...styles.card, background: colors.card }}>
          <h2 style={{ color: colors.text, marginBottom: '1rem' }}>⚙️ Built With</h2>
          <div style={styles.techGrid}>
            {[
              { name: 'React', icon: '⚛️', color: '#61DAFB' },
              { name: 'Node.js', icon: '🟢', color: '#339933' },
              { name: 'Express', icon: '🚀', color: '#000000' },
              { name: 'PostgreSQL', icon: '🐘', color: '#336791' },
              { name: 'JavaScript', icon: '🟨', color: '#F7DF1E' },
              { name: 'HTML/CSS', icon: '🎨', color: '#E34F26' }
            ].map(tech => (
              <div key={tech.name}
                style={{ ...styles.techItem, background: colors.background, border: `2px solid ${tech.color}` }}>
                <span style={{ fontSize: '1.5rem' }}>{tech.icon}</span>
                <span style={{ color: colors.text, fontSize: '0.85rem', fontWeight: 'bold' }}>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div style={{ ...styles.card, background: colors.card }}>
          <h2 style={{ color: colors.text, marginBottom: '1rem' }}>📊 App Statistics</h2>
          <div style={styles.statsGrid}>
            {[
              { label: 'Features', value: '25+', icon: '✨' },
              { label: 'Pages', value: '15+', icon: '📄' },
              { label: 'API Routes', value: '50+', icon: '🔌' },
              { label: 'Built For', value: 'UDS', icon: '🎓' }
            ].map(stat => (
              <div key={stat.label} style={{ ...styles.statItem, background: colors.background }}>
                <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
                <strong style={{ color: '#e94560', fontSize: '1.5rem' }}>{stat.value}</strong>
                <span style={{ color: colors.subtext, fontSize: '0.85rem' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ ...styles.footer, background: '#1a1a2e' }}>
          <p style={{ color: '#fff', margin: 0 }}>
            Made with ❤️ by <strong style={{ color: '#e94560' }}>Saeed Alhassan</strong> for UDS
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: '0.5rem 0 0' }}>
            © 2026 CampusEvents UDS. All rights reserved.
          </p>
          <button style={styles.homeBtn} onClick={() => navigate('/')}>
            🏠 Go to Home
          </button>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh' },
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)',
    padding: '4rem 2rem',
    textAlign: 'center'
  },
  heroContent: { maxWidth: '600px', margin: '0 auto' },
  heroTitle: { color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '800', margin: '0 0 1rem' },
  heroSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', lineHeight: '1.6' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' },
  card: { borderRadius: '15px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.8rem', marginTop: '1.5rem' },
  featureItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', padding: '0.8rem', borderRadius: '10px', textAlign: 'center' },
  developerCard: { display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' },
  devAvatar: { width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #e94560', objectFit: 'cover' },
  devInfo: { flex: 1, minWidth: '200px' },
  contactLinks: { display: 'flex', gap: '0.8rem', flexWrap: 'wrap' },
  contactBtn: { padding: '0.6rem 1.2rem', background: '#e94560', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold' },
  techGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' },
  techItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '10px', textAlign: 'center' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', padding: '1.5rem', borderRadius: '10px', textAlign: 'center' },
  footer: { padding: '2rem', borderRadius: '15px', textAlign: 'center' },
  homeBtn: { marginTop: '1rem', padding: '0.8rem 2rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }
};