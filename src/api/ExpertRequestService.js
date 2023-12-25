// ExpertRequestService.js
import axios from 'axios';

class ExpertRequestService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: 'http://localhost:5000/api/expertrequests', // Adjust the base URL as per your API endpoint
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.apiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });
  }

  getAllExpertRequests() {
    return this.apiClient.get('/');
  }

  getExpertRequestById(id) {
    return this.apiClient.get(`/${id}`);
  }

  createExpertRequest(requestData) {
    return this.apiClient.post('/', requestData);
  }

  updateExpertRequest(id, updateData) {
    return this.apiClient.put(`/${id}/assignexpert`, updateData);
  }

  deleteExpertRequest(id) {
    return this.apiClient.delete(`/${id}`);
  }

  // Additional methods for expert requests can be added here as needed
}

export default new ExpertRequestService();
