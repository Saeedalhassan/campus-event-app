import { useState, useEffect } from 'react';
import { getEvents } from '../services/api';
import EventCard from '../components/EventCard';
import HeroSection from '../components/HeroSection';
import { useTheme } from '../context/ThemeContext';

const CATEGORIES = ['All', 'Tech', 'Sports', 'Arts', 'Music', 'Academic', 'Social'];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    loadEvents();
  }, [category]);

  const loadEvents = async () => {
    const params = {};
    if (category && category !== 'All') params.category = category;
    if (search) params.search = search;
    if (location) params.location = location;
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;
    setLoading(true);
    try {
      const res = await getEvents(params);
      setEvents(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadEvents();
  };

  const handleClear = () => {
    setSearch('');
    setLocation('');
    setDateFrom('');
    setDateTo('');
    setCategory('');
    setShowFilters(false);
    setTimeout(() => loadEvents(), 100);
  };

  const activeFilters = [search, location, dateFrom, dateTo].filter(Boolean).length;

  return (
    <div style={{ background: colors.background, minHeight: '100vh' }}>
      <HeroSection />

      <div id="events-section" style={styles.eventsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={{ color: colors.text, fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            🔥 Upcoming Events
          </h2>
          <p style={{ color: colors.subtext }}>Find and join events happening at UDS</p>
        </div>

        {/* SEARCH BAR */}
        <div style={styles.searchRow}>
          <div style={{ ...styles.searchBox, background: colors.card, borderColor: colors.border }}>
            <span>🔍</span>
            <input placeholder="Search events..."
              style={{ ...styles.searchInput, background: 'transparent', color: colors.text }}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button style={styles.searchBtn} onClick={handleSearch}>Search</button>
          <button
            style={{ ...styles.filterToggleBtn, background: showFilters ? '#e94560' : colors.card, color: showFilters ? '#fff' : colors.text }}
            onClick={() => setShowFilters(!showFilters)}>
            🔧 Filters {activeFilters > 0 && `(${activeFilters})`}
          </button>
        </div>

        {/* ADVANCED FILTERS */}
        {showFilters && (
          <div style={{ ...styles.filtersPanel, background: colors.card }}>
            <h4 style={{ color: colors.text, marginBottom: '1rem' }}>🔍 Advanced Filters</h4>
            <div style={styles.filtersGrid}>
              <div>
                <label style={{ color: colors.subtext, fontSize: '0.85rem' }}>📍 Location</label>
                <input placeholder="Filter by location..."
                  style={{ ...styles.filterInput, background: colors.input, color: colors.text, borderColor: colors.border }}
                  value={location} onChange={e => setLocation(e.target.value)} />
              </div>
              <div>
                <label style={{ color: colors.subtext, fontSize: '0.85rem' }}>📅 From Date</label>
                <input type="date"
                  style={{ ...styles.filterInput, background: colors.input, color: colors.text, borderColor: colors.border }}
                  value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
              </div>
              <div>
                <label style={{ color: colors.subtext, fontSize: '0.85rem' }}>📅 To Date</label>
                <input type="date"
                  style={{ ...styles.filterInput, background: colors.input, color: colors.text, borderColor: colors.border }}
                  value={dateTo} onChange={e => setDateTo(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button style={styles.applyBtn} onClick={handleSearch}>✅ Apply Filters</button>
              <button style={styles.clearBtn} onClick={handleClear}>🗑 Clear All</button>
            </div>
          </div>
        )}

        {/* CATEGORIES */}
        <div style={styles.categories}>
          {CATEGORIES.map(c => (
            <button key={c}
              onClick={() => setCategory(c === 'All' ? '' : c)}
              style={{
                ...styles.catBtn,
                background: (category === c || (c === 'All' && !category)) ? '#e94560' : colors.card,
                color: (category === c || (c === 'All' && !category)) ? '#fff' : colors.text,
                border: `1px solid ${(category === c || (c === 'All' && !category)) ? '#e94560' : colors.border}`
              }}>
              {c}
            </button>
          ))}
        </div>

        {/* RESULTS COUNT */}
        {!loading && (
          <p style={{ color: colors.subtext, marginBottom: '1rem', fontSize: '0.9rem' }}>
            Found <strong style={{ color: colors.text }}>{events.length}</strong> events
          </p>
        )}

        {/* EVENTS GRID */}
        {loading ? (
          <div style={styles.loading}>
            <p style={{ fontSize: '3rem' }}>⏳</p>
            <p style={{ color: colors.subtext }}>Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: '3rem' }}>📭</p>
            <h3 style={{ color: colors.text }}>No events found</h3>
            <p style={{ color: colors.subtext }}>Try different filters</p>
            <button style={styles.clearBtn} onClick={handleClear}>Clear Filters</button>
          </div>
        ) : (
          <div style={styles.grid}>
            {events.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  eventsSection: { padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' },
  sectionHeader: { textAlign: 'center', marginBottom: '2rem' },
  searchRow: { display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' },
  searchBox: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid', flex: 1, minWidth: '200px' },
  searchInput: { border: 'none', outline: 'none', fontSize: '1rem', flex: 1 },
  searchBtn: { padding: '0.8rem 1.5rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  filterToggleBtn: { padding: '0.8rem 1rem', border: '1px solid #ddd', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  filtersPanel: { padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  filtersGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' },
  filterInput: { width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid', fontSize: '0.9rem', boxSizing: 'border-box', marginTop: '0.3rem' },
  applyBtn: { padding: '0.6rem 1.2rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  clearBtn: { padding: '0.6rem 1.2rem', background: '#999', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  categories: { display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' },
  catBtn: { padding: '0.5rem 1.2rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
  loading: { textAlign: 'center', padding: '3rem' },
  empty: { textAlign: 'center', padding: '3rem' }
};