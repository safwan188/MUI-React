import axios from 'axios';

class CustomerService {
  constructor() {
    this.apiClient = axios.create({
      baseURL:'http://localhost:5000' + '/api/customers',
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

  createCustomer(customerData) {
    return this.apiClient.post('', customerData);
  }

  getAllCustomers() {
    return this.apiClient.get('/');
  }

  getCustomerById(id) {
    return this.apiClient.get(`/${id}`);
  }

  getPropertiesForCustomer(customerId) {
    return this.apiClient.get(`/${customerId}/properties`);
  }

  createCustomerAndProperty(customerPropertyData) {
    return this.apiClient.post('/customerandproperty', customerPropertyData);
  }

  updateCustomer(id, updateData) {
    return this.apiClient.put(`/${id}`, updateData);
  }

  deleteCustomer(id) {
    return this.apiClient.delete(`/${id}`);
  }
}

export default new CustomerService();
