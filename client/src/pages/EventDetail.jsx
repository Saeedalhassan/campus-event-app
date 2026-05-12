import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEvent, rsvpEvent, getEventRsvps, getComments, addComment, deleteComment, toggleLike, toggleSave, getLikeStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import ImageGallery from '../components/ImageGallery';
import Announcements from '../components/Announcements';
import ExportAttendees from '../components/ExportAttendees';
import EventRating from '../components/EventRating';

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [event, setEvent] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    getEvent(id).then(res => setEvent(res.data));
    getEventRsvps(id).then(res => setRsvps(res.data));
    getComments(id).then(res => setComments(res.data));
    if (user) {
      getLikeStatus(id).then(res => {
        setLiked(res.data.liked);
        setSaved(res.data.saved);
        setLikeCount(res.data.likeCount);
      });
    }
  }, [id, user]);

  const handleRsvp = async (status) => {
    if (!user) return toast.error('Please login first');
    await rsvpEvent(id, status);
    toast.success(`You are ${status}!`);
    getEventRsvps(id).then(res => setRsvps(res.data));
  };

  const handleLike = async () => {
    if (!user) return toast.error('Please login first');
    const res = await toggleLike(id);
    setLiked(res.data.liked);
    setLikeCount(prev => res.data.liked ? prev + 1 : prev - 1);
    toast.success(res.data.liked ? '❤️ Liked!' : 'Like removed');
  };

  const handleSave = async () => {
    if (!user) return toast.error('Please login first');
    const res = await toggleSave(id);
    setSaved(res.data.saved);
    toast.success(res.data.saved ? '🔖 Event saved!' : 'Event unsaved');
  };

 const handleAddComment = async (content, parentId = null) => {
    if (!user) return toast.error('Please login first');
    if (!content.trim()) return toast.error('Comment cannot be empty');
    try {
      const res = await addComment(id, content, parentId);
      setComments(prev => [...prev, res.data]);
      if (!parentId) setNewComment('');
      toast.success('Comment added!');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
      toast.success('Comment deleted');
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  if (!event) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div style={{ ...styles.page, background: colors.background }}>
      <div style={{ ...styles.container, background: colors.card }}>
        {event.image_url && <img src={event.image_url} alt={event.title} style={styles.img} />}
        <div style={styles.content}>
          <div style={styles.topRow}>
            <span style={styles.category}>{event.category}</span>
            <div style={styles.actions}>
              <button style={{ ...styles.actionBtn, color: liked ? '#e94560' : colors.subtext }}
                onClick={handleLike}>
                {liked ? '❤️' : '🤍'} {likeCount}
              </button>
              <button style={{ ...styles.actionBtn, color: saved ? '#f39c12' : colors.subtext }}
                onClick={handleSave}>
                {saved ? '🔖' : '📌'} {saved ? 'Saved' : 'Save'}
              </button>
              <button style={{ ...styles.actionBtn, color: colors.subtext }}
                onClick={() => {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({
      title: event.title,
      text: `Check out this event: ${event.title}`,
      url: url
    }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url);
    toast.success('Link copied!');
  } else {
    const input = document.createElement('input');
    input.value = url;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    toast.success('Link copied!');
  }
}}>
                
                📤 Share
              </button>
            </div>
          </div>

          <h1 style={{ color: colors.text, margin: '1rem 0' }}>{event.title}</h1>
          <p style={{ color: colors.subtext }}>📍 {event.location}</p>
          <p style={{ color: colors.subtext }}>🗓 {new Date(event.start_time).toLocaleString()}</p>
          <p style={{ color: colors.subtext }}>👤 Organized by <strong style={{ color: colors.text }}>{event.organizer_name}</strong></p>
          <p style={{ ...styles.description, color: colors.subtext }}>{event.description}</p>

          <div style={styles.rsvpButtons}>
            <button style={{ ...styles.rsvpBtn, background: '#2ecc71' }} onClick={() => handleRsvp('going')}>✅ Going</button>
            <button style={{ ...styles.rsvpBtn, background: '#f39c12' }} onClick={() => handleRsvp('maybe')}>🤔 Maybe</button>
            <button style={{ ...styles.rsvpBtn, background: '#e74c3c' }} onClick={() => handleRsvp('not_going')}>❌ Not Going</button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ color: colors.text }}>{rsvps.length} Attendees</h3>
            <ExportAttendees eventId={id} eventTitle={event.title} organizerId={event.organizer_id} />
          </div>
          {rsvps.map(r => <p key={r.id} style={{ color: colors.subtext }}>👤 {r.name} — {r.status}</p>)}

          {/* GALLERY */}
          <ImageGallery eventId={id} organizerId={event.organizer_id} />

          {/* ANNOUNCEMENTS */}
          <Announcements eventId={id} organizerId={event.organizer_id} />

         {/* RATINGS */}
          <EventRating eventId={id} />

          {/* COMMENTS */}
          <div style={{ ...styles.commentsSection, borderColor: colors.border }}>
            <h3 style={{ color: colors.text }}>💬 Comments ({comments.filter(c => !c.parent_id).length})</h3>

            {comments.filter(c => !c.parent_id).map(c => (
              <CommentItem
                key={c.id}
                comment={c}
                replies={comments.filter(r => r.parent_id === c.id)}
                user={user}
                colors={colors}
                onDelete={handleDeleteComment}
                onReply={(parentId, content) => handleAddComment(content, parentId)}
              />
            ))}

            {user ? (
              <div style={styles.addComment}>
                <textarea placeholder="Write a comment..."
                  style={{ ...styles.commentInput, background: colors.input, color: colors.text, borderColor: colors.border }}
                  value={newComment} onChange={e => setNewComment(e.target.value)} />
                <button style={styles.submitComment} onClick={() => handleAddComment(newComment)}>
                  Post Comment
                </button>
              </div>
            ) : (
              <p style={{ color: colors.subtext }}>Login to leave a comment</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentItem({ comment, replies, user, colors, onDelete, onReply }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReply = () => {
    if (!replyText.trim()) return;
    onReply(comment.id, replyText);
    setReplyText('');
    setShowReply(false);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ ...styles.comment, background: colors.background }}>
        <div style={styles.commentHeader}>
          <strong style={{ color: colors.text }}>{comment.name}</strong>
          <span style={{ color: colors.subtext, fontSize: '0.8rem' }}>
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
        <p style={{ color: colors.subtext, margin: '0.3rem 0' }}>{comment.content}</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {user && (
            <button style={styles.replyBtn} onClick={() => setShowReply(!showReply)}>
              💬 Reply
            </button>
          )}
          {user && user.id === comment.user_id && (
            <button style={styles.deleteComment} onClick={() => onDelete(comment.id)}>
              🗑 Delete
            </button>
          )}
        </div>

        {showReply && (
          <div style={{ marginTop: '0.5rem' }}>
            <textarea
              placeholder={`Reply to ${comment.name}...`}
              style={{ ...styles.commentInput, background: colors.input, color: colors.text, borderColor: colors.border, height: '60px' }}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
              <button style={styles.submitComment} onClick={handleReply}>Reply</button>
              <button style={{ ...styles.submitComment, background: '#999' }} onClick={() => setShowReply(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {replies.length > 0 && (
        <div style={{ marginLeft: '1.5rem', borderLeft: '2px solid #e94560', paddingLeft: '1rem' }}>
          {replies.map(reply => (
            <div key={reply.id} style={{ ...styles.comment, background: colors.background, marginTop: '0.5rem' }}>
              <div style={styles.commentHeader}>
                <strong style={{ color: colors.text }}>{reply.name}</strong>
                <span style={{ color: colors.subtext, fontSize: '0.75rem' }}>
                  {new Date(reply.created_at).toLocaleString()}
                </span>
              </div>
              <p style={{ color: colors.subtext, margin: '0.3rem 0' }}>{reply.content}</p>
              {user && user.id === reply.user_id && (
                <button style={styles.deleteComment} onClick={() => onDelete(reply.id)}>
                  🗑 Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', padding: '1.5rem 1rem' },
  container: { maxWidth: '800px', margin: '0 auto', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  img: { width: '100%', height: '300px', objectFit: 'cover' },
  content: { padding: '1.5rem' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' },
  category: { background: '#e94560', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem' },
  actions: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  actionBtn: { background: 'none', border: '1px solid #ddd', padding: '0.4rem 0.8rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' },
  description: { margin: '1rem 0', lineHeight: '1.6' },
  rsvpButtons: { display: 'flex', gap: '0.8rem', margin: '1rem 0', flexWrap: 'wrap' },
  rsvpBtn: { padding: '0.6rem 1.2rem', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  commentsSection: { marginTop: '2rem', borderTop: '2px solid', paddingTop: '1rem' },
  comment: { padding: '1rem', borderRadius: '8px', marginBottom: '0.8rem' },
  commentHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' },
  deleteComment: { background: 'none', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: '0.8rem' },
  replyBtn: { background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' },
  addComment: { marginTop: '1rem' },
  commentInput: { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid', fontSize: '1rem', boxSizing: 'border-box', height: '80px', resize: 'vertical' },
  submitComment: { marginTop: '0.5rem', padding: '0.6rem 1.5rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};