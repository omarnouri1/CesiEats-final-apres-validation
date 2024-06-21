import React, { useEffect, useState } from 'react';
import './Accept.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url } from '../../../assets/assets';
import QRCode from 'qrcode.react';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list3`);
      const livreurid = localStorage.getItem("livreurid");
      
      if (response.data.success) {
        const allOrders = response.data.data.reverse();
        const filteredOrders = allOrders.filter(order => order.livreurid === livreurid || order.livreurid === "false");
        setOrders(filteredOrders);
      } else {
        toast.error("Error");
      }
      
    } catch (error) {
      toast.error('Error fetching orders');
      console.error(error);
    }
  };

  const createNotification = async (message, role, userId) => {
    const notificationData = {
      message,
      role,
      userid: userId,
      status: 'new'
    };
    try {
      await axios.post(`${url}/api/notification/createNotification`, notificationData);
      toast.success("Notification sent successfully");
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error("Error sending notification");
    }
  };

  const updateOrderStatus = async (orderId, status, userId, restaurantName) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status,
      });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success(`Order ${orderId} ${status === 'Waiting for Livreur' ? 'Accepted' : 'Rejected'}`);
        if (status === 'Food Processing2') {
          setSelectedOrder(orderId); // Set the selected order after accepting it
          // Send notification to restaurant
          await createNotification('A Deliverer has accepted your order', 'restaurant', restaurantName);
          // Send notification to user
          await createNotification('A Deliverer has accepted your order', 'user', userId);
        }
        if (status === 'On our way') {
          // Send notification to user
          await createNotification('On our way to you our dear costumer', 'user', userId);
        }
        if (status === 'Delivered') {
          // Send notification to user
          await createNotification('The order has been delivered to the user', 'user', userId);
        }
      } else {
        toast.error(`Error updating order ${orderId}`);
      }
    } catch (error) {
      toast.error(`Error updating order ${orderId}`);
      console.error(error);
    }
  };

  const updateLivreurId = async (orderId) => {
    try {
      const livreurid = localStorage.getItem("livreurid");
      const response = await axios.post(`${url}/api/order/update-livreur`, {
        orderId,
        livreurid: livreurid || 'default_livreurid', // Include livreurid in the request
      });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success(`Livreur ID updated for order ${orderId}`);
      } else {
        toast.error(`Error updating livreur ID for order ${orderId}`);
      }
    } catch (error) {
      toast.error(`Error updating livreur ID for order ${orderId}`);
      console.error(error);
    }
  };

  const receiveOrder = async (orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/receive`, { orderId });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success('Order received successfully');
      } else {
        toast.error('Error receiving order');
      }
    } catch (error) {
      toast.error('Error receiving order');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const getQRCodeValue = (order) => {
    const items = order.items.map(item => item.name).join(', ');
    return `${order._id} ${order.address.firstName} ${order.address.lastName}, ${order.address.city} - Items: ${items}`;
  };

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className='order-list'>
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, index) => (
                  <span key={index}>
                    {item.name} x {item.quantity}
                    {index < order.items.length - 1 && ", "}
                  </span>
                ))}
              </p>
              <p className='order-item-name'>
                {order.address.firstName} {order.address.lastName}
              </p>
              <div className='order-item-address'>
                <p>{order.address.street},</p>
                <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>${order.amount}</p>
            <div className='order-actions'>
              {order.status === 'Waiting for Livreur' && (
                <>
                  <button
                    className='custom-btn accept-btn'
                    onClick={() => {
                      const restaurantName = localStorage.getItem('restaurantname');
                      updateOrderStatus(order._id, 'Food Processing2', order.userId, restaurantName);
                      updateLivreurId(order._id);
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className='custom-btn reject-btn'
                    onClick={() => updateOrderStatus(order._id, 'Rejected by Restaurant')}
                  >
                    Reject
                  </button>
                </>
              )}
              {order.status === 'Food Processing2' && (
                <button
                  className='custom-btn receive-btn'
                  onClick={() => updateOrderStatus(order._id, 'On our way', order.userId)}
                >
                  Received
                </button>
              )}
              {order.status === 'On our way' && (
                <button
                  className='custom-btn ouw-btn'
                  onClick={() => updateOrderStatus(order._id, 'Delivered', order.userId)}
                >
                  Delivered
                </button>
              )}
            </div>
            {/* Show QR if the order is in "Food Processing2" or "On our way" */}
            {(order.status === 'Food Processing2' || order.status === 'On our way') && (
              <div className='qr-container'>
                <h4>QR Code</h4>
                <QRCode value={getQRCodeValue(order)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
