import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = async () => {
    if (!password || !confirm) return toast.error('Please fill in all fields');
    if (password !== confirm) return toast.error('Passwords do not match');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');

    try {
      await resetPassword(token, password);
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ ...styles.page, background: colors.background }}>
      <div style={{ ...styles.card, background: colors.card }}>
        <div style={styles.icon}>🔐</div>
        <h2 style={{ color: colors.text, marginBottom: '0.5rem' }}>Reset Password</h2>
        <p style={{ color: colors.subtext, marginBottom: '1.5rem' }}>Enter your new password</p>

        <input
          type="password"
          placeholder="New password"
          style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />
        <button style={styles.btn} onClick={handleSubmit}>
          ✅ Reset Password
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  card: { padding: '2rem', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' },
  icon: { fontSize: '3rem', marginBottom: '1rem' },
  input: { width: '100%', padding: '0.9rem', borderRadius: '8px', border: '1px solid', fontSize: '1rem', boxSizing: 'border-box', marginBottom: '1rem' },
  btn: { width: '100%', padding: '0.9rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }
};