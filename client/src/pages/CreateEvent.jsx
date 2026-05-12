import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent, uploadImage } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const CATEGORIES = ['Tech', 'Sports', 'Arts', 'Music', 'Academic', 'Social'];

export default function CreateEvent() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [form, setForm] = useState({ title: '', description: '', location: '', start_time: '', end_time: '', category: 'Tech', image_url: '' });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.location || !form.start_time) {
      return toast.error('Please fill in all required fields');
    }
    try {
      let image_url = form.image_url;
      if (imageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', imageFile);
        const res = await uploadImage(formData);
        image_url = res.data.url;
        setUploading(false);
      }
      const res = await createEvent({ ...form, image_url });
      toast.success('Event created!');
      navigate(`/events/${res.data.id}`);
    } catch (err) {
      setUploading(false);
      toast.error(err.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <div style={{ ...styles.page, background: colors.background }}>
      <div style={{ ...styles.card, background: colors.card }}>
        <h2 style={{ color: colors.text, marginBottom: '1rem' }}>📅 Create New Event</h2>

        <label style={{ ...styles.label, color: colors.text }}>Event Title *</label>
        <input style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
          value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="Enter event title" />

        <label style={{ ...styles.label, color: colors.text }}>Location *</label>
        <input style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
          value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
          placeholder="Enter location" />

        <label style={{ ...styles.label, color: colors.text }}>Start Time *</label>
        <input type="datetime-local" style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
          value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} />

        <label style={{ ...styles.label, color: colors.text }}>End Time</label>
        <input type="datetime-local" style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
          value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} />

        <label style={{ ...styles.label, color: colors.text }}>Category</label>
        <select style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
          value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label style={{ ...styles.label, color: colors.text }}>Event Image</label>
        <input type="file" accept="image/*" style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border }}
          onChange={handleImageChange} />
        {preview && <img src={preview} alt="preview" style={styles.preview} />}

        <label style={{ ...styles.label, color: colors.text }}>Description</label>
        <textarea style={{ ...styles.input, background: colors.input, color: colors.text, borderColor: colors.border, height: '120px', resize: 'vertical' }}
          value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Describe your event..." />

        <button style={styles.btn} onClick={handleSubmit} disabled={uploading}>
          {uploading ? '⏳ Uploading...' : '🚀 Publish Event'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', padding: '1rem' },
  card: { maxWidth: '600px', margin: '0 auto', padding: '1.5rem', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  label: { display: 'block', marginBottom: '0.3rem', fontWeight: 'bold', marginTop: '1rem', fontSize: '0.9rem' },
  input: { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid', fontSize: '1rem', boxSizing: 'border-box' },
  preview: { width: '100%', borderRadius: '8px', marginTop: '0.5rem', maxHeight: '200px', objectFit: 'cover' },
  btn: { width: '100%', padding: '1rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', marginTop: '1.5rem', fontWeight: 'bold' }
};