import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const { login } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = isLogin ? await loginUser(form) : await registerUser(form);
      login(res.data.token, res.data.user);
      toast.success('Welcome!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ ...styles.page, background: colors.background }}>
      <div style={{ ...styles.card, background: colors.card }}>
        <div style={styles.logoSection}>
          <span style={styles.logo}>🎓</span>
          <h2 style={{ color: colors.text, margin: '0.5rem 0' }}>CampusEvents-UDS</h2>
          <p style={{ color: colors.subtext }}>{isLogin ? 'Welcome back!' : 'Create your account'}</p>
        </div>

        {!isLogin && (
          <input placeholder="Full Name" style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        )}
        <input placeholder="Email" style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
          type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
          type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        {!isLogin && (
          <select style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
            value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="student">Student</option>
            <option value="organizer">Organizer</option>
          </select>
        )}
       <button style={styles.btn} onClick={handleSubmit}>
  {isLogin ? '🔑 Login' : '✅ Register'}
</button>
{isLogin && (
  <p style={{ ...styles.toggle, color: colors.subtext, fontSize: '0.85rem' }}
    onClick={() => navigate('/forgot-password')}>
    Forgot password?
  </p>
)}
<p style={{ ...styles.toggle, color: '#e94560' }} onClick={() => setIsLogin(!isLogin)}>
  {isLogin ? "Don't have an account? Register" : "Already have an account? Login Forgot password?"}
</p> 
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1rem' },
  card: { padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', width: '100%', maxWidth: '400px' },
  logoSection: { textAlign: 'center', marginBottom: '1.5rem' },
  logo: { fontSize: '3rem' },
  input: { width: '100%', padding: '0.9rem', margin: '0.4rem 0', borderRadius: '8px', border: '1px solid', fontSize: '1rem', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '0.9rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem', fontWeight: 'bold' },
  toggle: { textAlign: 'center', cursor: 'pointer', marginTop: '1rem', fontSize: '0.9rem' }
};