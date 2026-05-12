import { useState, useEffect } from 'react';
import { getGallery, addGalleryImage, deleteGalleryImage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

export default function ImageGallery({ eventId, organizerId }) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    getGallery(eventId).then(res => setImages(res.data));
  }, [eventId]);

  const handleUpload = async () => {
    if (!imageFile) return toast.error('Please select an image');
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('caption', caption);
      const res = await addGalleryImage(eventId, formData);
      setImages([...images, res.data]);
      setCaption('');
      setImageFile(null);
      toast.success('Image added to gallery!');
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await deleteGalleryImage(imageId);
      setImages(images.filter(img => img.id !== imageId));
      if (selectedImage?.id === imageId) setSelectedImage(null);
      toast.success('Image deleted');
    } catch (err) {
      toast.error('Failed to delete image');
    }
  };

  const isOrganizer = user && user.id === organizerId;

  return (
    <div style={styles.container}>
      <h3 style={{ color: colors.text, marginBottom: '1rem' }}>
        🖼️ Photo Gallery ({images.length})
      </h3>

      {/* UPLOAD SECTION - only for organizer */}
      {isOrganizer && (
        <div style={{ ...styles.uploadSection, background: colors.card, border: `1px solid ${colors.border}` }}>
          <h4 style={{ color: colors.text, marginBottom: '0.8rem' }}>Add Photo</h4>
          <input type="file" accept="image/*"
            onChange={e => setImageFile(e.target.files[0])}
            style={{ ...styles.fileInput, color: colors.text }} />
          <input
            placeholder="Caption (optional)"
            style={{ ...styles.captionInput, background: colors.input, color: colors.text, borderColor: colors.border }}
            value={caption}
            onChange={e => setCaption(e.target.value)}
          />
          <button style={styles.uploadBtn} onClick={handleUpload} disabled={uploading}>
            {uploading ? '⏳ Uploading...' : '📤 Add to Gallery'}
          </button>
        </div>
      )}

      {/* GALLERY GRID */}
      {images.length === 0 ? (
        <div style={styles.empty}>
          <p style={{ fontSize: '2rem' }}>📷</p>
          <p style={{ color: colors.subtext }}>No photos yet</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {images.map((img, index) => (
            <div key={img.id} style={styles.imageWrapper}
              onClick={() => setSelectedImage(img)}>
              <img src={img.image_url} alt={img.caption || `Photo ${index + 1}`}
                style={styles.thumbnail} />
              {img.caption && (
                <div style={styles.captionOverlay}>
                  <p style={styles.captionText}>{img.caption}</p>
                </div>
              )}
              {isOrganizer && (
                <button style={styles.deleteImgBtn}
                  onClick={e => { e.stopPropagation(); handleDelete(img.id); }}>
                  🗑
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX */}
      {selectedImage && (
        <div style={styles.lightbox} onClick={() => setSelectedImage(null)}>
          <div style={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setSelectedImage(null)}>✕</button>
            <img src={selectedImage.image_url} alt={selectedImage.caption}
              style={styles.lightboxImg} />
            {selectedImage.caption && (
              <p style={styles.lightboxCaption}>{selectedImage.caption}</p>
            )}
            <div style={styles.lightboxNav}>
              <button style={styles.navBtn} onClick={() => {
                const idx = images.findIndex(i => i.id === selectedImage.id);
                if (idx > 0) setSelectedImage(images[idx - 1]);
              }}>← Prev</button>
              <span style={{ color: '#fff', fontSize: '0.85rem' }}>
                {images.findIndex(i => i.id === selectedImage.id) + 1} / {images.length}
              </span>
              <button style={styles.navBtn} onClick={() => {
                const idx = images.findIndex(i => i.id === selectedImage.id);
                if (idx < images.length - 1) setSelectedImage(images[idx + 1]);
              }}>Next →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { marginTop: '2rem' },
  uploadSection: { padding: '1rem', borderRadius: '10px', marginBottom: '1rem' },
  fileInput: { width: '100%', marginBottom: '0.5rem' },
  captionInput: {
    width: '100%', padding: '0.6rem', borderRadius: '5px',
    border: '1px solid', marginBottom: '0.5rem',
    fontSize: '0.9rem', boxSizing: 'border-box'
  },
  uploadBtn: {
    padding: '0.6rem 1.2rem', background: '#e94560',
    color: '#fff', border: 'none', borderRadius: '5px',
    cursor: 'pointer', fontWeight: 'bold'
  },
  empty: { textAlign: 'center', padding: '2rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '0.8rem'
  },
  imageWrapper: {
    position: 'relative', borderRadius: '8px',
    overflow: 'hidden', cursor: 'pointer',
    aspectRatio: '1'
  },
  thumbnail: { width: '100%', height: '100%', objectFit: 'cover' },
  captionOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    background: 'rgba(0,0,0,0.6)', padding: '0.3rem'
  },
  captionText: { color: '#fff', fontSize: '0.7rem', margin: 0 },
  deleteImgBtn: {
    position: 'absolute', top: '5px', right: '5px',
    background: 'rgba(233,69,96,0.9)', border: 'none',
    color: '#fff', borderRadius: '5px', cursor: 'pointer',
    padding: '2px 6px', fontSize: '0.8rem'
  },
  lightbox: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.9)', zIndex: 9999,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  lightboxContent: {
    position: 'relative', maxWidth: '90vw', maxHeight: '90vh',
    display: 'flex', flexDirection: 'column', alignItems: 'center'
  },
  closeBtn: {
    position: 'absolute', top: '-40px', right: 0,
    background: 'none', border: 'none', color: '#fff',
    fontSize: '1.5rem', cursor: 'pointer'
  },
  lightboxImg: {
    maxWidth: '90vw', maxHeight: '70vh',
    objectFit: 'contain', borderRadius: '8px'
  },
  lightboxCaption: { color: '#fff', marginTop: '0.5rem', textAlign: 'center' },
  lightboxNav: {
    display: 'flex', gap: '1rem', alignItems: 'center',
    marginTop: '1rem'
  },
  navBtn: {
    background: 'rgba(255,255,255,0.2)', border: 'none',
    color: '#fff', padding: '0.5rem 1rem', borderRadius: '5px',
    cursor: 'pointer', fontWeight: 'bold'
  }
};