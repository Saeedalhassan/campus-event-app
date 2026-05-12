import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  const theme = {
    darkMode,
    toggleTheme,
    colors: {
      background: darkMode ? '#0f0f1a' : '#f5f5f5',
      card: darkMode ? '#1a1a2e' : '#ffffff',
      text: darkMode ? '#ffffff' : '#333333',
      subtext: darkMode ? '#aaaaaa' : '#666666',
      border: darkMode ? '#333355' : '#dddddd',
      navbar: darkMode ? '#0a0a15' : '#1a1a2e',
      accent: '#e94560',
      input: darkMode ? '#2a2a3e' : '#ffffff',
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