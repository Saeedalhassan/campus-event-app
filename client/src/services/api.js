import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

export const getEvents = (params) => API.get('/events', { params });
export const getEvent = (id) => API.get(`/events/${id}`);
export const createEvent = (data) => API.post('/events', data);
export const updateEvent = (id, data) => API.put(`/events/${id}`, data);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

export const rsvpEvent = (eventId, status) => API.post(`/rsvps/${eventId}`, { status });
export const getEventRsvps = (eventId) => API.get(`/rsvps/${eventId}`);
export const uploadImage = (formData) => API.post('/upload', formData);

export const getComments = (eventId) => API.get(`/comments/${eventId}`);
export const addComment = (eventId, content, parent_id = null) => API.post(`/comments/${eventId}`, { content, parent_id });
export const deleteComment = (commentId) => API.delete(`/comments/${commentId}`);

export const getUserProfile = (id) => API.get(`/users/${id}`);
export const updateProfile = (data) => API.put('/users/update', data);

export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');
export const getAdminEvents = () => API.get('/admin/events');
export const deleteAdminUser = (id) => API.delete(`/admin/users/${id}`);
export const deleteAdminEvent = (id) => API.delete(`/admin/events/${id}`);
export const changeUserRole = (id, role) => API.put(`/admin/users/${id}/role`, { role });

export const verifyEmail = (token) => API.get(`/auth/verify/${token}`);
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => API.post(`/auth/reset-password/${token}`, { password });

export const getNotifications = () => API.get('/notifications');
export const markAllRead = () => API.put('/notifications/read-all');
export const markOneRead = (id) => API.put(`/notifications/${id}/read`);
export const deleteNotification = (id) => API.delete(`/notifications/${id}`);

export const getGallery = (eventId) => API.get(`/gallery/${eventId}`);
export const addGalleryImage = (eventId, formData) => API.post(`/gallery/${eventId}`, formData);
export const deleteGalleryImage = (imageId) => API.delete(`/gallery/${imageId}`);

export const toggleLike = (eventId) => API.post(`/likes/like/${eventId}`);
export const toggleSave = (eventId) => API.post(`/likes/save/${eventId}`);
export const getLikeStatus = (eventId) => API.get(`/likes/status/${eventId}`);
export const getSavedEvents = () => API.get('/likes/saved');

export const getRatings = (eventId) => API.get(`/ratings/${eventId}`);
export const addRating = (eventId, rating, review) => API.post(`/ratings/${eventId}`, { rating, review });
export const getMyRating = (eventId) => API.get(`/ratings/${eventId}/my-rating`);

export const getAnnouncements = (eventId) => API.get(`/announcements/${eventId}`);
export const addAnnouncement = (eventId, message) => API.post(`/announcements/${eventId}`, { message });
export const deleteAnnouncement = (id) => API.delete(`/announcements/${id}`);

export const getEventAnalytics = (eventId) => API.get(`/analytics/${eventId}`);

export const getAttendees = (eventId) => API.get(`/rsvps/${eventId}`);

export const toggleFollow = (userId) => API.post(`/follows/${userId}`);
export const getFollowStatus = (userId) => API.get(`/follows/status/${userId}`);
export const getFollowers = (userId) => API.get(`/follows/followers/${userId}`);
export const getFollowing = (userId) => API.get(`/follows/following/${userId}`);

export const getLeaderboard = () => API.get('/leaderboard');