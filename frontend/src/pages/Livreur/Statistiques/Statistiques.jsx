import React, { useEffect, useState } from 'react';
import './Statistiques.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { url } from '../../../assets/assets';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Statistiques = () => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [ordersPerDay, setOrdersPerDay] = useState({});
  const [ordersPerProduct, setOrdersPerProduct] = useState({});
  const [ordersPerState, setOrdersPerState] = useState({}); // Estado para órdenes por estado
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('All');
  const [states, setStates] = useState([]); // Estado para los estados disponibles
  const [selectedState, setSelectedState] = useState('All'); // Estado para el estado seleccionado

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list2`);
      if (response.data.success) {
        setOrders(response.data.data.reverse());
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error fetching orders");
      console.error(error);
    }
  };

  const getTotalOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/livreur/statsOrder`, {
        params: { startDate, endDate, product: selectedProduct, state: selectedState }
      });
      if (response.data.success) {
        setTotalOrders(response.data.totalOrders);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error fetching total orders");
      console.error(error);
    }
  };

  const getTotalEarnings = async () => {
    try {
      const response = await axios.get(`${url}/api/livreur/statsEarning`, {
        params: { startDate, endDate, product: selectedProduct, state: selectedState }
      });
      if (response.data.success) {
        setTotalEarnings(response.data.totalEarnings);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error fetching total earnings");
      console.error(error);
    }
  };

  const getOrdersPerDay = async () => {
    try {
        const response = await axios.get(`${url}/api/livreur/ordersPerDay`, {
            params: { startDate, endDate, product: selectedProduct, state: selectedState }
        });
        if (response.data.success) {
            setOrdersPerDay(response.data.ordersPerDay);
        } else {
            toast.error("Error");
        }
    } catch (error) {
        toast.error("Error fetching orders per day");
        console.error(error);
    }
};

const getOrdersPerProduct = async () => {
  try {
      const response = await axios.get(`${url}/api/livreur/ordersPerProduct`, {
          params: { startDate, endDate, product: selectedProduct, state: selectedState }
      });
      if (response.data.success) {
          setOrdersPerProduct(response.data.ordersPerProduct);
      } else {
          toast.error("Error");
      }
  } catch (error) {
      toast.error("Error fetching orders per product");
      console.error(error);
  }
};

  const getOrdersPerState = async () => {
    try {
      const response = await axios.get(`${url}/api/livreur/ordersPerState`, {
        params: { startDate, endDate, product: selectedProduct, state: selectedState }
      });
      if (response.data.success) {
        setOrdersPerState(response.data.ordersPerState);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error fetching orders per state");
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error fetching products");
      console.error(error);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${url}/api/order/states`);
      if (response.data.success) {
        setStates(response.data.data);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error fetching states");
      console.error(error);
    }
  };

  const getTotalItems = async () => {
    try {
      const response = await axios.get(`${url}/api/livreur/statsTotalItems`, {
        params: { startDate, endDate, product: selectedProduct, state: selectedState }
      });
      if (response.data.success) {
        setTotalItems(response.data.totalItems);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error fetching total items");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
    getTotalOrders();
    getTotalEarnings();
    getOrdersPerDay();
    getOrdersPerProduct();
    getTotalItems();
    getOrdersPerState();
    fetchProducts();
    fetchStates();
}, [startDate, endDate, selectedProduct, selectedState]);

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    if (name === 'startDate') {
      setStartDate(value);
    } else if (name === 'endDate') {
      setEndDate(value);
    }
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
};

  const ordersPerDayLabels = Object.keys(ordersPerDay);
  const ordersPerDayData = Object.values(ordersPerDay);

  const ordersPerProductLabels = Object.keys(ordersPerProduct);
  const ordersPerProductData = Object.values(ordersPerProduct);

  const ordersPerStateLabels = Object.keys(ordersPerState); // Labels para órdenes por estado
  const ordersPerStateData = Object.values(ordersPerState); // Data para órdenes por estado

  const dataPerDay = {
    labels: ordersPerDayLabels,
    datasets: [
      {
	          label: 'Orders per Day',
        data: ordersPerDayData,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const dataPerProduct = {
    labels: ordersPerProductLabels,
    datasets: [
      {
        label: 'Orders per Product',
        data: ordersPerProductData,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const dataPerState = {
    labels: ordersPerStateLabels,
    datasets: [
      {
        label: 'Orders per State',
        data: ordersPerStateData,
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className='statistiques add'>
      <h3>Statistiques Page</h3>
      <h4>Statistiques</h4>
      <p>Total Orders: {totalOrders}</p>
      <p>Total Earnings: ${totalEarnings}</p>
      {/* Nuevo campo para mostrar el total de ítems */}
      {selectedProduct !== 'All' && <p>Total Items: {totalItems}</p>}
  
      {/* Cambios en el orden y ubicación de los elementos */}
      <div className="bottom-controls">
        <label htmlFor="product">Product:</label>
        <select id="product" name="product" value={selectedProduct} onChange={handleProductChange}>
          <option value="All">All</option>
          {products.map((product) => (
            <option key={product._id} value={product.name}>
              {product.name}
            </option>
          ))}
        </select>
  
        <label htmlFor="state">State:</label>
        <select id="state" name="state" value={selectedState} onChange={handleStateChange}>
          <option value="All">All</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
  
      <div className="date-controls">
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={startDate}
          onChange={handleDateChange}
        />
  
        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={endDate}
          onChange={handleDateChange}
        />
      </div>
  
      <div className="chart-container">
        <div className="chart">
          <Bar data={dataPerDay} options={options} />
        </div>
        <div className="chart">
          <Bar data={dataPerProduct} options={options} />
        </div>
      </div>
  
      <div className="chart-container">
        <div className="chart">
          <Bar data={dataPerState} options={options} />
        </div>
      </div>
    </div>
  );T  
};

export default Statistiques;