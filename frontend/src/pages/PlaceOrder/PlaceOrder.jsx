import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingScreen from '../LoadingScreen/LoadingScreen';

const PlaceOrder = () => {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    });

    const [loading, setLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState('');

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems,discount } = useContext(StoreContext);
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const checkOrderStatus = async (orderId) => {
        try {
            const response = await axios.get(`${url}/api/orders/${orderId}`, { headers: { token } });
            setOrderStatus(response.data.status);
        } catch (error) {
            console.error('Error fetching order status', error);
        }
    };

    const createNotification = async (restaurantId) => {
        const notificationData = {
            message: "You have received a new order",
            role: "restaurant",
            userid: restaurantId,
            status: "new"
        };
        try {
            await axios.post(`${url}/api/notification/createNotification`, notificationData);
            toast.success("Notification sent successfully");
        } catch (error) {
            console.error('Error sending notification:', error);
            toast.error("Error sending notification");
        }
    };

    const placeOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        let orderItems = [];
        let restaurantId = null;

        food_list.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        });
        await createNotification(restaurantId);
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalWithDiscount() + 5,
        };

        try {
            let response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });
            if (response.data.success) {
                const { orderId, session_url } = response.data;
               // await createNotification(restaurantId);
                window.location.replace(session_url);

                const interval = setInterval(async () => {
                    await checkOrderStatus(orderId);
                    if (orderStatus === 'on our way') {
                        clearInterval(interval);
                        setLoading(false);
                        toast.success('Your order is on its way');
                         // Send notification after placing order
                    }
                }, 5000); // Check every 5 seconds
            } else {
                setLoading(false);
                toast.error("Something Went Wrong");
            }
        } catch (error) {
            setLoading(false);
            toast.error("Something Went Wrong");
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error("To place an order sign in first");
            navigate('/cart');
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token]);

    const getTotalWithDiscount = () => {
        const total = getTotalCartAmount();
        return total - total * discount;
    };

    return (
        <div>
            {loading && <LoadingScreen />}
            {!loading && (
                <form onSubmit={placeOrder} className='place-order'>
                    <div className="place-order-left">
                        <p className='title'>Delivery Information</p>
                        <div className="multi-field">
                            <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
                            <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required />
                        </div>
                        <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required />
                        <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' required />
                        <div className="multi-field">
                            <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='City' required />
                            <input type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='State' required />
                        </div>
                        <div className="multi-field">
                            <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' required />
                            <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' required />
                        </div>
                        <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />
                    </div>
                    <div className="place-order-right">
                        <div className="cart-total">
                            <h2>Cart Totals</h2>
                            <div>
                                <div className="cart-total-details"><p>Subtotal</p><p>${getTotalCartAmount()}</p></div>
                                <hr />
                                <div className="cart-total-details"><p>Discount</p><p>{discount > 0 ? `-${(discount * 100).toFixed(0)}%` : '-'}</p></div>
                                <hr />
                                <div className="cart-total-details"><p>Delivery Fee</p><p>${getTotalCartAmount() === 0 ? 0 : 5}</p></div>
                                <hr />
                                <div className="cart-total-details"><b>Total</b><b>${getTotalCartAmount() === 0 ? 0 : (getTotalWithDiscount() + 5).toFixed(2)}</b></div>
                            </div>
                        </div>
                        <button className='place-order-submit' type='submit'>Proceed To Payment</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default PlaceOrder;
