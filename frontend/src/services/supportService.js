import api from './api';

export const supportService = {
  // Submit general contact form
  submitContact: async (data) => {
    const res = await api.post('/support/contact', data);
    return res.data;
  },

  // Submit problem or safety incident report
  submitReport: async (data) => {
    const res = await api.post('/support/report', data);
    return res.data;
  },

  // Get user's own reports (if authenticated)
  getMyReports: async () => {
    const res = await api.get('/support/my-reports');
    return res.data;
  },

  // Submit product feedback
  submitFeedback: async (data) => {
    const res = await api.post('/support/feedback', data);
    return res.data;
  },
};

export default supportService;
