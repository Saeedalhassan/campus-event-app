import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function VerifyEmail() {
  const { token } = useParams();
  const { login } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    verifyEmail(token)
      .then(res => {
        login(res.data.token, res.data.user);
        setStatus('success');
        setTimeout(() => navigate('/'), 3000);
      })
      .catch(() => setStatus('error'));
  }, [token, login, navigate]);

  return (
    <div style={{ ...styles.page, background: colors.background }}>
      <div style={{ ...styles.card, background: colors.card }}>
        {status === 'verifying' && (
          <>
            <div style={styles.icon}>⏳</div>
            <h2 style={{ color: colors.text }}>Verifying your email...</h2>
            <p style={{ color: colors.subtext }}>Please wait</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={styles.icon}>✅</div>
            <h2 style={{ color: colors.text }}>Email Verified!</h2>
            <p style={{ color: colors.subtext }}>Welcome to CampusEvents UDS!</p>
            <p style={{ color: colors.subtext }}>Redirecting you to home...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={styles.icon}>❌</div>
            <h2 style={{ color: colors.text }}>Verification Failed</h2>
            <p style={{ color: colors.subtext }}>Invalid or expired link.</p>
            <button style={styles.btn} onClick={() => navigate('/login')}>
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  card: { padding: '3rem', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' },
  icon: { fontSize: '4rem', marginBottom: '1rem' },
  btn: { marginTop: '1rem', padding: '0.8rem 2rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};