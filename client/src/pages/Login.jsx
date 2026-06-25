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
    <div style={{
      minHeight: '100vh',
      backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(27,94,32,0.75) 100%), url(https://res.cloudinary.com/difjtbnve/image/upload/v1782196731/uds-campus_pywq83.jpg)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem'
    }}>
      <div style={{ ...styles.card, background: colors.card }}>
        <div style={styles.logoSection}>
          <img
            src="https://res.cloudinary.com/difjtbnve/image/upload/v1782196514/uds-logo_ewm8w2.jpg"
            alt="UDS Logo" style={styles.logo} />
          <h2 style={{ color: colors.text, margin: '0.5rem 0 0' }}>CampusEvents UDS</h2>
          <p style={{ color: '#4CAF50', margin: '0.2rem 0 1rem', fontSize: '0.85rem' }}>
            University of Development Studies
          </p>
          <p style={{ color: colors.subtext, margin: 0 }}>
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {!isLogin && (
          <input placeholder="Full Name"
            style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        )}
        <input placeholder="Email" type="email"
          style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password"
          style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        {!isLogin && (
          <select
            style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
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
        <p style={{ ...styles.toggle, color: '#4CAF50' }}
          onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    width: '100%',
    maxWidth: '400px'
  },
  logoSection: { textAlign: 'center', marginBottom: '1.5rem' },
  logo: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '3px solid #4CAF50',
    objectFit: 'cover'
  },
  input: {
    width: '100%',
    padding: '0.9rem',
    margin: '0.4rem 0',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  btn: {
    width: '100%',
    padding: '0.9rem',
    background: '#2E7D32',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
    fontWeight: 'bold'
  },
  toggle: {
    textAlign: 'center',
    cursor: 'pointer',
    marginTop: '1rem',
    fontSize: '0.9rem'
  }
};