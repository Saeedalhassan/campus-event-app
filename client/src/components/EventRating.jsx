import { useState, useEffect } from 'react';
import { getRatings, addRating, getMyRating } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

function StarRating({ value, onChange, readonly }) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '0.2rem' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star}
          style={{
            fontSize: '1.5rem', cursor: readonly ? 'default' : 'pointer',
            color: star <= (hover || value) ? '#f39c12' : '#ddd',
            transition: 'color 0.1s'
          }}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => !readonly && onChange && onChange(star)}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function EventRating({ eventId }) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState('');
  const [hasRated, setHasRated] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadRatings();
    if (user) {
      getMyRating(eventId).then(res => {
        if (res.data) {
          setMyRating(res.data.rating);
          setMyReview(res.data.review || '');
          setHasRated(true);
        }
      });
    }
    // eslint-disable-next-line
}, [eventId, user]);

  const loadRatings = async () => {
    const res = await getRatings(eventId);
    setRatings(res.data.ratings);
    setAverage(res.data.average);
    setTotal(res.data.total);
  };

  const handleSubmit = async () => {
    if (!myRating) return toast.error('Please select a rating');
    try {
      await addRating(eventId, myRating, myReview);
      toast.success(hasRated ? 'Rating updated!' : 'Rating submitted!');
      setHasRated(true);
      setShowForm(false);
      loadRatings();
    } catch (err) {
      toast.error('Failed to submit rating');
    }
  };

  return (
    <div style={{ ...styles.container, borderColor: colors.border }}>
      <h3 style={{ color: colors.text, marginBottom: '1rem' }}>⭐ Ratings & Reviews</h3>

      {/* AVERAGE RATING */}
      <div style={{ ...styles.averageSection, background: colors.background }}>
        <div style={styles.averageScore}>
          <span style={styles.averageNumber}>{average.toFixed(1)}</span>
          <StarRating value={Math.round(average)} readonly />
          <span style={{ color: colors.subtext, fontSize: '0.85rem' }}>{total} reviews</span>
        </div>
      </div>

      {/* USER RATING FORM */}
      {user && (
        <div style={{ marginBottom: '1.5rem' }}>
          {!showForm ? (
            <button style={styles.rateBtn} onClick={() => setShowForm(true)}>
              {hasRated ? '✏️ Update Your Rating' : '⭐ Rate This Event'}
            </button>
          ) : (
            <div style={{ ...styles.ratingForm, background: colors.background }}>
              <p style={{ color: colors.text, fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Your Rating:
              </p>
              <StarRating value={myRating} onChange={setMyRating} />
              <textarea
                placeholder="Write a review (optional)"
                style={{ ...styles.reviewInput, background: colors.input, color: colors.text, borderColor: colors.border }}
                value={myReview}
                onChange={e => setMyReview(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={styles.submitBtn} onClick={handleSubmit}>Submit</button>
                <button style={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RATINGS LIST */}
      {ratings.length === 0 ? (
        <p style={{ color: colors.subtext, textAlign: 'center', padding: '1rem' }}>
          No reviews yet. Be the first to rate!
        </p>
      ) : (
        ratings.map(r => (
          <div key={r.id} style={{ ...styles.ratingItem, background: colors.background }}>
            <div style={styles.ratingHeader}>
              <strong style={{ color: colors.text }}>{r.name}</strong>
              <StarRating value={r.rating} readonly />
            </div>
            {r.review && <p style={{ color: colors.subtext, margin: '0.3rem 0', fontSize: '0.9rem' }}>{r.review}</p>}
            <p style={{ color: colors.subtext, fontSize: '0.75rem' }}>
              {new Date(r.created_at).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid' },
  averageSection: { padding: '1rem', borderRadius: '10px', marginBottom: '1rem', textAlign: 'center' },
  averageScore: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' },
  averageNumber: { fontSize: '3rem', fontWeight: 'bold', color: '#f39c12' },
  rateBtn: { padding: '0.6rem 1.2rem', background: '#f39c12', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  ratingForm: { padding: '1rem', borderRadius: '10px', marginTop: '0.5rem' },
  reviewInput: { width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid', fontSize: '0.9rem', boxSizing: 'border-box', height: '80px', resize: 'vertical', margin: '0.5rem 0' },
  submitBtn: { padding: '0.5rem 1rem', background: '#f39c12', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn: { padding: '0.5rem 1rem', background: '#999', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  ratingItem: { padding: '1rem', borderRadius: '8px', marginBottom: '0.8rem' },
  ratingHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }
};