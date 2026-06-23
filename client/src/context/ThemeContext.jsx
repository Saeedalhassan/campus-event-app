import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => setDarkMode(!darkMode);

  const theme = {
    darkMode,
    toggleTheme,
    colors: {
      background: darkMode ? '#0a0a0a' : '#f5f5f5',
      card: darkMode ? '#1a1a1a' : '#ffffff',
      text: darkMode ? '#ffffff' : '#1a1a1a',
      subtext: darkMode ? '#aaaaaa' : '#666666',
      border: darkMode ? '#2a2a2a' : '#dddddd',
      navbar: darkMode ? '#0d1f0d' : '#1B5E20',
      accent: '#2E7D32',
      accentLight: '#4CAF50',
      input: darkMode ? '#2a2a2a' : '#ffffff',
      hero: darkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div style={{ background: theme.colors.background, minHeight: '100vh', transition: 'all 0.3s ease' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);