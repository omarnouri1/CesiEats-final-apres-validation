// List.jsx (o el nombre que prefieras para tu archivo)

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../../assets/assets';
import { toast } from 'react-toastify';

const List = () => {
    const [apis, setApis] = useState([]);
  
    // Función para obtener la lista de APIs
    const fetchApis = async () => {
      try { 
        const response = await axios.get(`${url}/api/apis/getall`); // Ajusta la URL según tu configuración de servidor
        
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
  
    // Cargar la lista de APIs al montar el componente
    useEffect(() => {
      fetchApis();
    }, []);
  
    return (
      <div className='list add flex-col'>
        <h1>All APIs List</h1>
        <div className='list-table'>
          <div className="list-table-format title">
            <b>Name</b>
            <b>Secret Key</b>
            <b>Development ID</b>
          </div>
          {apis.map(api => (
            <div key={api._id} className='list-table-format'>
              <p>{api.name}</p>
              <p>{api.secretKey}</p>
              <p>{api.iddevelop}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default List;
