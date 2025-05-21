import api from './api';

export const getClientObjectives = async (clientId) => {
  const response = await api.get(`/objectives/client/${clientId}`);
  return response.data;
};

export const addObjective = async (objective) => {
  const response = await api.post('/objectives', objective);
  return response.data;
};

export const updateObjective = async (id, objective) => {
  const response = await api.put(`/objectives/${id}`, objective);
  return response.data;
};

export const deleteObjective = async (id) => {
  const response = await api.delete(`/objectives/${id}`);
  return response.data;
};

export const addSubObjective = async (objectiveId, subObjective) => {
  const response = await api.post(`/objectives/${objectiveId}/sub-objectives`, subObjective);
  return response.data;
};

export const updateSubObjective = async (objectiveId, subObjectiveId, subObjective) => {
  const response = await api.put(`/objectives/${objectiveId}/sub-objectives/${subObjectiveId}`, subObjective);
  return response.data;
};

export const toggleSubObjective = async (objectiveId, subObjectiveId, completed) => {
  const response = await api.patch(`/objectives/${objectiveId}/sub-objectives/${subObjectiveId}/toggle`, { completed });
  return response.data;
};

export const deleteSubObjective = async (objectiveId, subObjectiveId) => {
  const response = await api.delete(`/objectives/${objectiveId}/sub-objectives/${subObjectiveId}`);
  return response.data;
};