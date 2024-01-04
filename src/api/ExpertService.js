import axios from 'axios';
const apiurl=process.env.REACT_APP_API_URL

class ExpertService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: apiurl + '/api/experts',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor to add the auth token to request headers
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

  createExpert(expertData) {
    return this.apiClient.post('', expertData);
  }

  getAllExperts() {
    return this.apiClient.get('/');
  }

  getExpertById(id) {
    return this.apiClient.get(`/${id}`);
  }

  updateExpert(id, updateData) {
    return this.apiClient.put(`/${id}`, updateData);
  }

  deleteExpert(id) {
    return this.apiClient.delete(`/${id}`);
  }
async createExpertData(expertData) {
    try {
      const response = await this.apiClient.post('', expertData);
      return response.data; // Return the data directly
    } catch (error) {
      console.error('Error creating expert:', error);
      throw error; // Rethrow to handle it in the component
    }
  }
  
  async loadExperts() {
    try {
      const response = await this.apiClient.get('/');
      return response.data; // Return the data directly
    } catch (error) {
      console.error('Error fetching experts:', error);
      throw error; // Rethrow to handle it in the component
    }
  }

  async updateExpertData(id, updateData) {
    try {
      await this.apiClient.put(`/${id}`, updateData);
    } catch (error) {
      console.error('Error updating expert:', error);
      throw error; // Rethrow to handle it in the component
    }
  }

  async deleteExpertData(id) {
    try {
      await this.apiClient.delete(`/${id}`);
    } catch (error) {
      console.error('Error deleting expert:', error);
      throw error; // Rethrow to handle it in the component
    }
  }
}

export default new ExpertService();