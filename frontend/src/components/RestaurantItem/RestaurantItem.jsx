import React from 'react';
import './RestaurantItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';

const RestaurantItem = ({ name, email, localisation, phone, id }) => {
    const { url } = useContext(StoreContext);

    return (
        <div className='restaurant-item'>
            <div className='restaurant-item-img-container'>
                <img className='restaurant-item-image' src={url + "/images/" + image} alt="" />
            </div>
            <div className="restaurant-item-info">
                <div className="restaurant-item-name">
                    <p>{name}</p>
                </div>
                <p className="restaurant-item-email">{email}</p>
                <p className="restaurant-item-localisation">{localisation}</p>
                <p className="restaurant-item-phone">{phone}</p>
            </div>
        </div>
    );
}

export default RestaurantItem;
