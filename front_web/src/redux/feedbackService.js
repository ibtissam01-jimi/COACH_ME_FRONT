import api from './api';

export const getPastSessions = async (clientId) => {
  const response = await api.get(`/sessions/client/${clientId}/past`);
  return response.data;
};

export const getSubmittedFeedbacks = async (clientId) => {
  const response = await api.get(`/feedbacks/client/${clientId}`);
  return response.data;
};

export const submitFeedback = async (feedback) => {
  const response = await api.post('/feedbacks', feedback);
  return response.data;
};