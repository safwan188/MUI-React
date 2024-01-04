import axios from 'axios';
const apiurl=process.env.REACT_APP_API_URL

class UserService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: apiurl+'/api',
      // You can set common headers here if needed
    });
  }

  login(username, password) {
    const loginData = { username, password };
    return this.apiClient.post('/users/login', loginData)
      .then(response => response.data)
      .catch(error => {
        // Handle errors or rethrow them for handling at a higher level
        throw error;
      });
  }

  // Other user-related methods can be added here
}

export default new UserService();
