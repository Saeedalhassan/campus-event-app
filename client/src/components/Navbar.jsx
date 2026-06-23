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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isMobile) return <MobileNav />;

  return (
    <nav style={{
      ...styles.nav,
      background: scrolled ? 'rgba(13,31,13,0.98)' : '#0d1f0d',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.5)' : 'none'
    }}>
      <Link to="/" style={styles.brand}>
        <img src="https://res.cloudinary.com/difjtbnve/image/upload/v1782196514/uds-logo_ewm8w2.jpg"
          alt="UDS Logo" style={styles.logo} />
        <span style={styles.brandText}>CampusEvents <span style={styles.brandUDS}>UDS</span></span>
      </Link>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/calendar" style={styles.link}>📅 Calendar</Link>
            <Link to="/leaderboard" style={styles.link}>🏆 Leaderboard</Link>
            <Link to="/create-event" style={styles.createBtn}>+ Create Event</Link>
            <Link to={`/profile/${user.id}`} style={styles.link}>👤 {user.name}</Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ ...styles.link, color: '#4CAF50', fontWeight: 'bold' }}>🛡️ Admin</Link>
            )}
            <NotificationBell />
          </>
        ) : (
          <>
            <Link to="/about" style={styles.link}>About</Link>
            <Link to="/leaderboard" style={styles.link}>🏆 Leaderboard</Link>
            <Link to="/login" style={styles.loginBtn}>Login</Link>
          </>
        )}
        <button onClick={toggleTheme} style={styles.themeBtn}>
          {darkMode ? '☀️' : '🌙'}
        </button>
        {user && (
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 2rem', color: '#fff', flexWrap: 'wrap', gap: '1rem', position: 'sticky', top: 0, zIndex: 1000, transition: 'all 0.3s ease' },
  brand: { display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none' },
  logo: { width: '45px', height: '45px', borderRadius: '50%', border: '2px solid #4CAF50', objectFit: 'cover' },
  brandText: { color: '#fff', fontSize: '1.3rem', fontWeight: 'bold' },
  brandUDS: { color: '#4CAF50' },
  links: { display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' },
  link: { color: '#fff', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' },
  createBtn: { background: '#2E7D32', color: '#fff', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' },
  loginBtn: { background: 'transparent', color: '#4CAF50', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid #4CAF50', fontWeight: 'bold' },
  logoutBtn: { background: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b', padding: '0.4rem 0.8rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' },
  themeBtn: { background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '0.4rem 0.6rem', borderRadius: '8px', cursor: 'pointer' }
};