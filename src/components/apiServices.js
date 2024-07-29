import axios from 'axios';
const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Replace with your API base URL
    timeout: 10000, // Optional: set a timeout for requests
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const getKdclData = () => {
    return api.get('/chuankdcl') // Endpoint for KDCL data
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching KDCL data:', error);
        throw error;
      });
  };
  
  // Fetch CTDT data
  export const getCtdtData = () => {
    return api.get('/ctdt/grouped') // Endpoint for CTDT data
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching CTDT data:', error);
        throw error;
      });
  };


