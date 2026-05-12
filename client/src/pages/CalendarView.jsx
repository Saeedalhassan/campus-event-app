import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { getEvents } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { colors } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    getEvents().then(res => {
      const formatted = res.data.map(e => ({
        id: e.id,
        title: e.title,
        start: new Date(e.start_time),
        end: e.end_time ? new Date(e.end_time) : new Date(new Date(e.start_time).getTime() + 3600000),
        resource: e
      }));
      setEvents(formatted);
    });
  }, []);

  const eventStyleGetter = (event) => {
    const categoryColors = {
      Tech: '#3498db',
      Sports: '#2ecc71',
      Arts: '#9b59b6',
      Music: '#e74c3c',
      Academic: '#f39c12',
      Social: '#1abc9c'
    };
    const color = categoryColors[event.resource.category] || '#e94560';
    return {
      style: {
        background: color,
        borderRadius: '5px',
        border: 'none',
        color: '#fff',
        fontSize: '0.8rem'
      }
    };
  };

  return (
    <div style={{ ...styles.page, background: colors.background }}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={{ color: colors.text }}>📅 Events Calendar</h2>
          <p style={{ color: colors.subtext }}>View all campus events in calendar format</p>
        </div>

        {/* LEGEND */}
        <div style={styles.legend}>
          {[
            { name: 'Tech', color: '#3498db' },
            { name: 'Sports', color: '#2ecc71' },
            { name: 'Arts', color: '#9b59b6' },
            { name: 'Music', color: '#e74c3c' },
            { name: 'Academic', color: '#f39c12' },
            { name: 'Social', color: '#1abc9c' }
          ].map(cat => (
            <div key={cat.name} style={styles.legendItem}>
              <div style={{ ...styles.legendDot, background: cat.color }} />
              <span style={{ color: colors.subtext, fontSize: '0.8rem' }}>{cat.name}</span>
            </div>
          ))}
        </div>

        {/* CALENDAR */}
        <div style={{ ...styles.calendarWrapper, background: colors.card }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={(event) => setSelectedEvent(event)}
            views={['month', 'week', 'day', 'agenda']}
            defaultView="month"
          />
        </div>

        {/* EVENT POPUP */}
        {selectedEvent && (
          <div style={styles.overlay} onClick={() => setSelectedEvent(null)}>
            <div style={{ ...styles.popup, background: colors.card }}
              onClick={e => e.stopPropagation()}>
              <button style={styles.closeBtn} onClick={() => setSelectedEvent(null)}>✕</button>
              {selectedEvent.resource.image_url && (
                <img src={selectedEvent.resource.image_url} alt={selectedEvent.title}
                  style={styles.popupImg} />
              )}
              <div style={styles.popupContent}>
                <span style={styles.category}>{selectedEvent.resource.category}</span>
                <h3 style={{ color: colors.text, margin: '0.5rem 0' }}>{selectedEvent.title}</h3>
                <p style={{ color: colors.subtext }}>📍 {selectedEvent.resource.location}</p>
                <p style={{ color: colors.subtext }}>
                  🗓 {moment(selectedEvent.start).format('MMMM Do YYYY, h:mm a')}
                </p>
                <p style={{ color: colors.subtext }}>
                  👤 By {selectedEvent.resource.organizer_name}
                </p>
                <button style={styles.viewBtn}
                  onClick={() => navigate(`/events/${selectedEvent.id}`)}>
                  View Event →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', padding: '1.5rem 1rem' },
  container: { maxWidth: '1100px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '1.5rem' },
  legend: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', justifyContent: 'center' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '0.3rem' },
  legendDot: { width: '12px', height: '12px', borderRadius: '50%' },
  calendarWrapper: { padding: '1rem', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  popup: { borderRadius: '15px', maxWidth: '400px', width: '90%', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.3)', position: 'relative' },
  closeBtn: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', zIndex: 1 },
  popupImg: { width: '100%', height: '150px', objectFit: 'cover' },
  popupContent: { padding: '1rem' },
  category: { background: '#e94560', color: '#fff', padding: '3px 8px', borderRadius: '20px', fontSize: '0.75rem' },
  viewBtn: { marginTop: '1rem', padding: '0.7rem 1.5rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }
};