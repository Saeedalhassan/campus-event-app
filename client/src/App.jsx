import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CalendarView from './pages/CalendarView';
import EventAnalytics from './pages/EventAnalytics';
import Leaderboard from './pages/Leaderboard';
import About from './pages/About';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Navbar />
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/verify/:token" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/analytics/:id" element={<EventAnalytics />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;