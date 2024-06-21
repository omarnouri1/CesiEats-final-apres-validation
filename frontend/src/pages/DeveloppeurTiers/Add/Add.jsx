import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { url } from '../../../assets/assets';
import { toast } from 'react-toastify';

const List = () => {
  const [apis, setApis] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    secretKey: '',
    iddevelop: ''
  });
  const [selectedApi, setSelectedApi] = useState(null);

  // Función para obtener la lista de APIs
  const fetchApis = async () => {
    try {
      const response = await axios.get(`${url}/api/apis/getall`);
      if (response.data.success) {
        setApis(response.data.data);
      } else {
        toast.error("Error al obtener la lista de APIs");
      }
    } catch (error) {
      console.error('Error fetching APIs:', error);
      toast.error("Error al obtener la lista de APIs");
    }
  };

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para enviar el formulario y agregar un nuevo API
  const addApi = async () => {
  try {
    const formDataWithId = { ...formData, iddevelop: localStorage.getItem('developid') || '' };
    const response = await axios.post(`${url}/api/apis/createapis`, formDataWithId);
    if (response.data.success) {
      // Llamar a la nueva ruta para escribir en el archivo .env
      
      const envResponse = await axios.post(`${url}/api/apis/writeenv`, {
        name: formData.name,
        secretKey: formData.secretKey,
      });
      
      if (envResponse.data.success) {
        toast.success(envResponse.data.message);
      } else {
        toast.error(envResponse.data.message || 'Error writing to .env file');
      }

      toast.success(response.data.message);
      setFormData({ name: '', secretKey: '', iddevelop: localStorage.getItem('developid') || '' });
      fetchApis();
    } else {
      toast.error(response.data.message || 'Error al agregar el API');
    }
  } catch (error) {
    console.error('Error adding API:', error);
    toast.error('Error al agregar el API');
  }
};


  // Función para manejar el clic en un API de la lista
  const handleApiClick = (api) => {
    setSelectedApi(api);
    setFormData({
      name: api.name,
      secretKey: api.secretKey,
      iddevelop: api.iddevelop
    });
  };

  // Función para manejar el clic en el botón Upgrade
  const upgradeApi = async () => {
    try {


      //toast.success(`${url}/api/apis/updateapis/${selectedApi._id}`);

      const response = await axios.put(`${url}/api/apis/updateapis/${selectedApi._id}`, formData);
      
      if (response.data.success) {
        toast.success(response.data.message);
        fetchApis(); // Recargar la lista de APIs actualizada
      } else {
        toast.error(response.data.message || 'Error al actualizar el API');
      }
    } catch (error) {
      console.error('Error upgrading API:', error);
      toast.error('Error al actualizar el API');
    }
  };

  // Cargar la lista de APIs al montar el componente
  useEffect(() => {
    fetchApis();
  }, []);

  return (
    <div className='list add flex-col'>
      <h1>All APIs List</h1>

      <div className='add-form'>
        <h2>Add New API</h2>
        <input
          type='text'
          placeholder='Name'
          name='name'
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type='text'
          placeholder='Secret Key'
          name='secretKey'
          value={formData.secretKey}
          onChange={handleInputChange}
        />
        <button onClick={addApi}>Add API</button>
      </div>

      <div className='list-table'>
        <div className="list-table-format title">
          <b>Name</b>
          <b>Secret Key</b>
          <b>Development ID</b>
        </div>
        {apis.map(api => (
          <div key={api._id} className='list-table-format' onClick={() => handleApiClick(api)}>
            <p>{api.name}</p>
            <p>{api.secretKey}</p>
            <p>{api.iddevelop}</p>
          </div>
        ))}
      </div>

      {/* Mostrar detalles del API seleccionado */}
      {selectedApi && (
        <div className='selected-api'>
          <h2>Selected API Details</h2>
          <p>Name: {selectedApi.name}</p>
          <p>Secret Key: {selectedApi.secretKey}</p>
          <p>Development ID: {selectedApi.iddevelop}</p>
          <button onClick={upgradeApi}>Upgrade</button>
        </div>
      )}

    </div>
  );
};

export default List;

