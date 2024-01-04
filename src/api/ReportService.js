import axios from 'axios';

class ReportService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: 'http://localhost:5000' + '/api/reports', // Adjust the base URL to your reports API endpoint
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

  createReport(reportData) {
    return this.apiClient.post('', reportData,{
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  getAllReports() {
    return this.apiClient.get('/');
  }

  getReportById(id) {
    return this.apiClient.get(`/${id}`);
  } 
  assignExpert(id,updateData) {
    return this.apiClient.put(`/updatestatus/${id}`,  updateData);
  }
  updateReportPhotos(reportId, newClientPhotos, removedClientPhotoUrls, newFindingsPhotos, removedFindingsPhotoUrls, availableStartingDates, subject, description,findings) {
    const formData = new FormData();
  
    // Append new client photos
    newClientPhotos.forEach(photo => {
      formData.append('clientPhotos', photo, photo.name);
    });
  
    // Append new findings photos
    newFindingsPhotos.forEach(photo => {
      formData.append('findingsPhotos', photo, photo.name);
    });
  
    // Append removed client photos as a JSON string
    if (removedClientPhotoUrls.length > 0) {
      formData.append('removedClientPhotos', JSON.stringify(removedClientPhotoUrls));
    }
  
    // Append removed findings photos as a JSON string
    if (removedFindingsPhotoUrls.length > 0) {
      formData.append('removedFindingsPhotos', JSON.stringify(removedFindingsPhotoUrls));
    }
    formData.append('availableStartingDates', JSON.stringify(availableStartingDates));
    formData.append('subject', subject);
    formData.append('description', description);
    formData.append('findings', findings);
    return this.apiClient.put(`/reportPhotos/${reportId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  
  getreportrequests(id) {
    return this.apiClient.get('/reportrequests/' + id);     
  }
  updateReport(updateData) {
    const  id  = updateData.id;
    console.log(id);
    return this.apiClient.put(`/${id}`, updateData,  {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  deleteReport(id) {
    return this.apiClient.delete(`/${id}`);
  }

  // Additional methods specific to reports can be added here
  // Example: generateReport, downloadReport, etc.
}

export default new ReportService();
