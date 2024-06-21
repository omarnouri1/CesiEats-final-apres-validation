import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, promoCode, setPromoCode, discount, setDiscount } = useContext(StoreContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handlePromoCodeChange = (event) => {
        setPromoCode(event.target.value);
    };

    const handleApplyPromoCode = async () => {
        try {
            const response = await fetch(`${url}/api/promocode/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: promoCode }),
            });
            const data = await response.json();

            if (data.success) {
                setDiscount(0.25); // 25% discount
                await createDiscountInBackend(); // Llama a la función para crear el descuento en el backend
                setError('');
            } else {
                setError('Invalid promo code');
                setDiscount(0);
            }
        } catch (error) {
            setError('Error validating promo code');
            setDiscount(0);
        }
    };

    const createDiscountInBackend = async () => {
        try {
            const email = localStorage.getItem('email');
           
            const response = await fetch(`${url}/api/discount/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    percentage: 25
                }),
            });
            const data = await response.json();
            console.log('Discount created:', data); // Opcional: para verificar en la consola del navegador
        } catch (error) {
            console.error('Error creating discount:', error);
        }
    };

    const getTotalWithDiscount = () => {
        const total = getTotalCartAmount();
        return total - total * discount;
    };

    return (
        <div className='cart'>
            <div className="cart-items">
                <div className="cart-items-title">
                    <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Remove</p>
                </div>
                <br />
                <hr />
                {food_list.map((item) => {
                    if (cartItems[item._id] > 0) {
                        return (
                            <div key={item._id}>
                                <div className="cart-items-title cart-items-item">
                                    <img src={`${url}/images/${item.image}`} alt={item.name} />
                                    <p>{item.name}</p>
                                    <p>${item.price.toFixed(2)}</p>
                                    <div>{cartItems[item._id]}</div>
                                    <p>${(item.price * cartItems[item._id]).toFixed(2)}</p>
                                    <p className='cart-items-remove-icon' onClick={() => removeFromCart(item._id)}>x</p>
                                </div>
                                <hr />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
            <div className="cart-bottom">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>${getTotalCartAmount().toFixed(2)}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Discount</p><p>{discount > 0 ? `-${(discount * 100).toFixed(0)}%` : '-'}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Delivery Fee</p><p>${getTotalCartAmount() === 0 ? 0 : 5}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>${getTotalCartAmount() === 0 ? 0 : (getTotalWithDiscount() + 5).toFixed(2)}</b></div>
                    </div>
                    <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
                </div>
                <div className="cart-promocode">
                    <div>
                        <p>If you have a promo code, Enter it here</p>
                        <div className='cart-promocode-input'>
                            <input type="text" value={promoCode} onChange={handlePromoCodeChange} placeholder='promo code' />
                            <button onClick={handleApplyPromoCode}>Submit</button>
                        </div>
                        {error && <p className="cart-promocode-error">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;