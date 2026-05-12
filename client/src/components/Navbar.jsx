import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import MobileNav from './MobileNav';
import NotificationBell from './NotificationBell';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme, colors } = useTheme();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isMobile) return <MobileNav />;

  return (
    <nav style={{ ...styles.nav, background: colors.navbar }}>
      <Link to="/" style={styles.brand}>🎓 CampusEvents-UDS</Link>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/calendar" style={styles.link}>📅 Calendar</Link>
            <Link to="/leaderboard" style={styles.link}>🏆 Leaderboard</Link>
            <Link to="/about" style={styles.link}>ℹ️ About</Link>
            <Link to="/create-event" style={styles.link}>+ Create Event</Link>
            <Link to={`/profile/${user.id}`} style={styles.link}>👤 {user.name}</Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ ...styles.link, color: '#e94560', fontWeight: 'bold' }}>🛡️ Admin</Link>
            )}
            <NotificationBell />
          </>
        ) : (
          <Link to="/login" style={styles.link}>Login</Link>
        )}
        <button onClick={toggleTheme} style={styles.themeBtn}>
          {darkMode ? '☀️' : '🌙'}
        </button>
        {user && (
          <button onClick={handleLogout} style={styles.btn}>Logout</button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', color: '#fff', flexWrap: 'wrap', gap: '1rem' },
  brand: { color: '#e94560', fontSize: '1.4rem', fontWeight: 'bold', textDecoration: 'none' },
  links: { display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' },
  link: { color: '#fff', textDecoration: 'none' },
  btn: { background: '#e94560', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' },
  themeBtn: { background: 'transparent', color: '#fff', border: '1px solid #fff', padding: '0.5rem', borderRadius: '5px', cursor: 'pointer' }
};