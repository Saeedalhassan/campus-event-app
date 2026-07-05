import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const { colors } = useTheme();
  const navigate = useNavigate();

  return (
    <div style={{ background: colors.background, minHeight: '100vh' }}>

      {/* HERO SECTION */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroContent}>
            <img
              src="https://res.cloudinary.com/difjtbnve/image/upload/v1782196514/uds-logo_ewm8w2.jpg"
              alt="UDS Logo" style={styles.heroLogo} />
            <h1 style={styles.heroTitle}>About CampusEvents UDS</h1>
            <p style={styles.heroSubtitle}>
              The official campus events platform for the University for Development Studies
            </p>
            <p style={styles.motto}>"Knowledge for Service"</p>
          </div>
        </div>
      </div>

      <div style={styles.container}>

        {/* APP DESCRIPTION */}
        <div style={{ ...styles.card, background: colors.card }}>
          <h2 style={{ color: colors.text, marginBottom: '1rem' }}>🎓 About The App</h2>
          <p style={{ color: colors.subtext, lineHeight: '1.8' }}>
            CampusEvents UDS is a comprehensive campus event management platform designed
            specifically for the University for Development Studies. It connects students,
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
            <div style={styles.devAvatarContainer}>
              <img
                src="https://res.cloudinary.com/difjtbnve/image/upload/v1783208730/P3_plarps.jpg"
                alt="Saeed Alhassan"
                style={styles.devAvatar}
              />
              <div style={styles.devBadge}>Developer</div>
            </div>
            <div style={styles.devInfo}>
              <h3 style={{ color: colors.text, fontSize: '1.5rem', margin: '0 0 0.3rem' }}>
                Saeed Alhassan
              </h3>
              <p style={{ color: '#4CAF50', fontWeight: 'bold', margin: '0 0 0.5rem' }}>
                Full Stack Developer
              </p>
              <p style={{ color: colors.subtext, margin: '0 0 0.3rem' }}>
                🎓 University of Development Studies
              </p>
              <p style={{ color: colors.subtext, margin: '0 0 0.3rem' }}>
                💻 Computer Science Student
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
                <a href="https://github.com/saeedalhassan"
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...styles.contactBtn, background: '#333' }}>
                  💻 GitHub
                </a>
                <a href="https://wa.me/+233539091313"
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
              { name: 'Express', icon: '🚀', color: '#4CAF50' },
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
              { label: 'Features', value: '76+', icon: '✨' },
              { label: 'Pages', value: '15+', icon: '📄' },
              { label: 'API Routes', value: '50+', icon: '🔌' },
              { label: 'Built For', value: 'UDS', icon: '🎓' }
            ].map(stat => (
              <div key={stat.label} style={{ ...styles.statItem, background: colors.background }}>
                <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
                <strong style={{ color: '#4CAF50', fontSize: '1.5rem' }}>{stat.value}</strong>
                <span style={{ color: colors.subtext, fontSize: '0.85rem' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div style={styles.footer}>
          <img
            src="https://res.cloudinary.com/difjtbnve/image/upload/v1782196514/uds-logo_ewm8w2.jpg"
            alt="UDS Logo" style={styles.footerLogo} />
          <p style={{ color: '#fff', margin: '0.5rem 0' }}>
            Made with ❤️ by <strong style={{ color: '#4CAF50' }}>Saeed Alhassan</strong> for UDS
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: '0.5rem 0' }}>
            © 2026 CampusEvents UDS. All rights reserved.
          </p>
          <p style={{ color: '#4CAF50', fontSize: '0.85rem', margin: '0.5rem 0' }}>
            "Knowledge for Development"
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
  hero: {
    backgroundImage: `url(https://res.cloudinary.com/difjtbnve/image/upload/v1782196731/uds-campus_pywq83.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '50vh',
    display: 'flex',
    alignItems: 'center'
  },
  heroOverlay: {
    width: '100%',
    minHeight: '50vh',
    background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(27,94,32,0.75) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 2rem'
  },
  heroContent: { maxWidth: '700px', textAlign: 'center' },
  heroLogo: { width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #4CAF50', objectFit: 'cover', marginBottom: '1rem' },
  heroTitle: { color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '800', margin: '0 0 1rem' },
  heroSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', lineHeight: '1.6', margin: '0 0 1rem' },
  motto: { color: '#4CAF50', fontStyle: 'italic', fontSize: '1.1rem', fontWeight: 'bold' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' },
  card: { borderRadius: '15px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.8rem', marginTop: '1.5rem' },
  featureItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', padding: '0.8rem', borderRadius: '10px', textAlign: 'center' },
  developerCard: { display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' },
  devAvatarContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' },
  devAvatar: { width: '150px', height: '150px', borderRadius: '50%', border: '4px solid #4CAF50', objectFit: 'cover', boxShadow: '0 4px 20px rgba(46,125,50,0.4)' },
  devBadge: { background: '#2E7D32', color: '#fff', padding: '0.3rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' },
  devInfo: { flex: 1, minWidth: '200px' },
  contactLinks: { display: 'flex', gap: '0.8rem', flexWrap: 'wrap' },
  contactBtn: { padding: '0.6rem 1.2rem', background: '#2E7D32', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold' },
  techGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' },
  techItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '10px', textAlign: 'center' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', padding: '1.5rem', borderRadius: '10px', textAlign: 'center' },
  footer: { backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.9), rgba(27,94,32,0.9)), url(https://res.cloudinary.com/difjtbnve/image/upload/v1782196731/uds-campus_pywq83.jpg)`, backgroundSize: 'cover', padding: '2rem', borderRadius: '15px', textAlign: 'center' },
  footerLogo: { width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #4CAF50', objectFit: 'cover' },
  homeBtn: { marginTop: '1rem', padding: '0.8rem 2rem', background: '#2E7D32', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }
};