import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from './NotificationBell';

export default function MobileNav() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme,} = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <>
      <nav style={{ ...styles.nav, background: '#0d1f0d' }}>
        <Link to="/" style={styles.brand}>🎓 CampusEvents-UDS</Link>
        <div style={styles.rightSide}>
          {user && <NotificationBell />}
          <button onClick={toggleTheme} style={styles.iconBtn}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={styles.iconBtn}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <div style={styles.overlay} onClick={() => setMenuOpen(false)} />
          <div style={{ ...styles.drawer, background: '#0d1f0d' }}>
            <div style={styles.drawerHeader}>
              {user ? (
                <div style={styles.userInfo}>
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=e94560&color=fff`}
                    alt={user.name} style={styles.userAvatar} />
                  <div>
                    <p style={styles.userName}>{user.name}</p>
                    <p style={styles.userRole}>🎓 {user.role}</p>
                  </div>
                </div>
              ) : (
                <p style={styles.userName}>Welcome to CampusEvents</p>
              )}
            </div>

            <div style={styles.menuItems}>
              <Link to="/" style={styles.menuItem} onClick={() => setMenuOpen(false)}>
                <span style={styles.menuIcon}>🏠</span>
                <span>Home</span>
              </Link>
              <Link to="/calendar" style={styles.menuItem} onClick={() => setMenuOpen(false)}>
                <span style={styles.menuIcon}>📅</span>
                <span>Calendar</span>
              </Link>
              <Link to="/leaderboard" style={styles.menuItem} onClick={() => setMenuOpen(false)}>
                <span style={styles.menuIcon}>🏆</span>
                <span>Leaderboard</span>
              </Link>
              <Link to="/about" style={styles.menuItem} onClick={() => setMenuOpen(false)}>
                <span style={styles.menuIcon}>ℹ️</span>
                <span>About</span>
              </Link>

              {user ? (
                <>
                  <div style={styles.divider} />
                  <Link to="/dashboard" style={styles.menuItem} onClick={() => setMenuOpen(false)}>
                    <span style={styles.menuIcon}>📊</span>
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/create-event" style={styles.menuItem} onClick={() => setMenuOpen(false)}>
                    <span style={styles.menuIcon}>➕</span>
                    <span>Create Event</span>
                  </Link>
                  <Link to={`/profile/${user.id}`} style={styles.menuItem} onClick={() => setMenuOpen(false)}>
                    <span style={styles.menuIcon}>👤</span>
                    <span>My Profile</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" style={{ ...styles.menuItem, color: '#e94560' }} onClick={() => setMenuOpen(false)}>
                      <span style={styles.menuIcon}>🛡️</span>
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  <div style={styles.divider} />
                  <button onClick={handleLogout} style={styles.logoutBtn}>
                    <span style={styles.menuIcon}>🚪</span>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <div style={styles.divider} />
                  <Link to="/login" style={styles.loginBtn} onClick={() => setMenuOpen(false)}>
                    🔑 Login / Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
  },
  brand: {
    color: '#e94560',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    textDecoration: 'none'
  },
  rightSide: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  },
  iconBtn: {
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 0.7rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 1001
  },
  drawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '280px',
    zIndex: 1002,
    overflowY: 'auto',
    boxShadow: '-4px 0 20px rgba(0,0,0,0.3)'
  },
  drawerHeader: {
    padding: '2rem 1.5rem 1rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  userAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '2px solid #e94560'
  },
  userName: {
    color: '#fff',
    fontWeight: 'bold',
    margin: 0,
    fontSize: '1rem'
  },
  userRole: {
    color: '#e94560',
    margin: 0,
    fontSize: '0.8rem'
  },
  menuItems: {
    padding: '1rem 0'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.9rem 1.5rem',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'background 0.2s'
  },
  menuIcon: {
    fontSize: '1.2rem',
    width: '25px'
  },
  divider: {
    height: '1px',
    background: 'rgba(255,255,255,0.1)',
    margin: '0.5rem 0'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.9rem 1.5rem',
    color: '#e94560',
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%'
  },
  loginBtn: {
    display: 'block',
    margin: '1rem',
    padding: '0.9rem',
    background: '#e94560',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1rem'
  }
};