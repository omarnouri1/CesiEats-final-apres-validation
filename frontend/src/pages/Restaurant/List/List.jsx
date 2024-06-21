import React, { useEffect, useState } from 'react';
import './List.css';
import { url } from '../../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {
  const [list, setList] = useState([]);
  const [editItem, setEditItem] = useState(null); // Estado para el artículo en edición
  const [formData, setFormData] = useState({}); // Estado para los datos del formulario
  const useremail = localStorage.getItem('email'); 
  const userename = localStorage.getItem('restaurantname');

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`, {
      params: { name: userename }
    });
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, {
      id: foodId
    });
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  const editFood = (item) => {
    setEditItem(item);
    setFormData(item);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const updateFood = async () => {
    toast.error(formData.name);
    const response = await axios.put(`${url}/api/food/update`, formData);
    toast.error(formData.name);
    if (response.data.success) {
      toast.success(response.data.message);
      setEditItem(null);
      await fetchList();
    } else {
      toast.error("Error");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Restaurant</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className='list-table-format'>
            <img src={`${url}/images/` + item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <p>{item.restaurant}</p>
            <p className='cursor' onClick={() => removeFood(item._id)}>x</p>
            <button className="edit-button" onClick={() => editFood(item)}>Edit</button>
          </div>
        ))}
      </div>
      {editItem && (
        <div className='edit-form'>
          <h3>Edit Food</h3>
          <form onSubmit={(e) => { e.preventDefault(); updateFood(); }}>
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
            <label>Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleInputChange} />
            <label>Price</label>
            <input type="number" name="price" value={formData.price} onChange={handleInputChange} />
            <label>Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleInputChange} />
            <button type="submit">Update</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default List;
