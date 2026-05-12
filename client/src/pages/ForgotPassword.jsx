import { useState } from 'react';
import { forgotPassword } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { colors } = useTheme();

  const handleSubmit = async () => {
    if (!email) return toast.error('Please enter your email');
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success('Reset email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ ...styles.page, background: colors.background }}>
      <div style={{ ...styles.card, background: colors.card }}>
        <div style={styles.icon}>🔐</div>
        <h2 style={{ color: colors.text, marginBottom: '0.5rem' }}>Forgot Password?</h2>
        <p style={{ color: colors.subtext, marginBottom: '1.5rem' }}>
          Enter your email and we will send you a reset link
        </p>

        {sent ? (
          <div style={styles.successBox}>
            <p style={{ fontSize: '2rem' }}>📧</p>
            <p style={{ color: colors.text, fontWeight: 'bold' }}>Check your email!</p>
            <p style={{ color: colors.subtext, fontSize: '0.9rem' }}>
              We sent a password reset link to {email}
            </p>
          </div>
        ) : (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button style={styles.btn} onClick={handleSubmit}>
              📧 Send Reset Link
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  card: { padding: '2rem', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' },
  icon: { fontSize: '3rem', marginBottom: '1rem' },
  input: { width: '100%', padding: '0.9rem', borderRadius: '8px', border: '1px solid', fontSize: '1rem', boxSizing: 'border-box', marginBottom: '1rem' },
  btn: { width: '100%', padding: '0.9rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' },
  successBox: { padding: '1.5rem', background: 'rgba(46,204,113,0.1)', borderRadius: '10px', border: '1px solid #2ecc71' }
};