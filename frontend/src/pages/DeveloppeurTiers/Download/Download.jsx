import React from 'react';
import axios from 'axios';
import { url } from '../../../assets/assets'; // Ensure this is the correct path to your base URL

const App = () => {
  const handleDownload = async (endpoint) => {
    try {
      const response = await axios.get(`${url}/api/apis/download/${endpoint}`, {
        responseType: 'blob',
      });

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${endpoint}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(`Error al descargar ${endpoint}:`, error);
    }
  };

  return (
    <div>
      <h1>Download Composants</h1>
      <button onClick={() => handleDownload('controllers')}>Download Controllers</button>
      <button onClick={() => handleDownload('models')}>Download Models</button>
      <button onClick={() => handleDownload('routes')}>Download Routes</button>
    </div>
  );
};

export default App;
