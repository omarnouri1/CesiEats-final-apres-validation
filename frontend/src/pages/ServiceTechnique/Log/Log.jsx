import React, { useEffect, useState } from 'react';
import './Log.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { url } from '../../../assets/assets';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [downloadedLogs, setDownloadedLogs] = useState([]);

  // Función para cargar todos los logs y logs descargados
  const fetchAllLogs = async () => {
    try {
      // Obtener registros de logs
      const logsResponse = await axios.get(`${url}/api/log/logs`);
      if (logsResponse.data.success) {
        setLogs(logsResponse.data.data.reverse());
      } else {
        toast.error("Error fetching logs");
      }

      // Obtener registros de logs descargados
      const downloadedLogsResponse = await axios.get(`${url}/api/log/downloads`);
      if (downloadedLogsResponse.data.success) {
        setDownloadedLogs(downloadedLogsResponse.data.data.reverse());
      } else {
        toast.error("Error fetching downloaded logs");
      }
    } catch (error) {
      toast.error("Error fetching logs");
    }
  };

  // Función para descargar logs como archivo de texto
  const downloadLogs = () => {
    const logString = logs.map(log => JSON.stringify(log)).join('\n');
    const blob = new Blob([logString], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Función para descargar logs descargados como archivo de texto
  const downloadDownloadedLogs = () => {
    const logString = downloadedLogs.map(log => JSON.stringify(log)).join('\n');
    const blob = new Blob([logString], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `downloaded_logs_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    fetchAllLogs();
  }, []);

  return (
    <div className='logs'>
      <h3>Logs Page</h3>
      <div className="logs-actions">
        <button onClick={downloadLogs}>Download Logs</button>
        <button onClick={downloadDownloadedLogs}>Download Downloaded Logs</button>
      </div>
      <div className="logs-table-container">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Role</th>
              <th>Email</th>
              <th>User ID</th>
              <th>Success</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.action}</td>
                <td>{log.role}</td>
                <td>{log.email}</td>
                <td>{log.user_id || 'N/A'}</td>
                <td>{log.success ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="downloaded-logs-table-container">
        <h3>Downloaded Logs</h3>
        <table className="logs-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Directory</th>
            </tr>
          </thead>
          <tbody>
            {downloadedLogs.map((log, index) => (
              <tr key={index}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.directory}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Logs;
