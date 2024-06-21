import React, { useState } from 'react';
import './Composan.css'; // Asegúrate de tener tu archivo de estilos CSS adecuadamente configurado

const ComponentPage = () => {
  const [components, setComponents] = useState([
    { id: 1, name: 'Models' },
    { id: 2, name: 'Controllers' },
    { id: 3, name: 'Routes' }
  ]);

  const addComponent = () => {
    const newId = components.length + 1;
    const newComponent = { id: newId, name: `Component ${newId}` };
    setComponents([...components, newComponent]);
  };

  const deleteComponent = (id) => {
    const updatedComponents = components.filter(component => component.id !== id);
    setComponents(updatedComponents);
  };

  return (
    <div className='components'>
      <h3>Component Management</h3>
      <div className="components-actions">
        <button onClick={addComponent}>Ajouter Composant</button>
        <button onClick={() => deleteComponent(components[components.length - 1].id)}>Supprimer Composant</button>
      </div>
      <div className="components-table-container">
        <table className="components-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {components.map((component, index) => (
              <tr key={index}>
                <td>{component.id}</td>
                <td>{component.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ComponentPage;
