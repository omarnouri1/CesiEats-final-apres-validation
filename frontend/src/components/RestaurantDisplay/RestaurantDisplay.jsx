import React, { useContext, useState } from 'react';
import './RestaurantDisplay.css';
import { StoreContext } from '../../Context/StoreContext';
import { toast } from 'react-toastify';

const RestaurantDisplay = ({ onRestaurantClick, selectedRestaurant }) => {
  const { restaurant_list, url } = useContext(StoreContext);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleRestaurantClick = (restaurantName) => {
    const currentTime = new Date().getTime();
    const doubleClickThreshold = 300; // Threshold de tiempo para un doble clic en milisegundos

    // Si la diferencia entre el tiempo actual y el último clic es menor que el umbral, considerarlo un doble clic
    if (currentTime - lastClickTime < doubleClickThreshold) {
      // Deseleccionar restaurante
      onRestaurantClick("All");
     // toast.info("Restaurant deselected");
    } else {
      // Si no es un doble clic, actualizar el tiempo del último clic
      setLastClickTime(currentTime);
     // toast.info(`Restaurant "${restaurantName}" selected`);
      onRestaurantClick(restaurantName); // Llama a la función proporcionada desde Home
    }
  };

  return (
    <div className='restaurant-display' id='restaurant-display'>
      <h2>Top restaurants near you</h2>
      <div className='restaurant-display-list'>
        {restaurant_list.map((restaurant) => (
          <button 
            key={restaurant._id}
            className={`restaurant-button ${selectedRestaurant === restaurant.name ? 'selected' : ''}`}
            onClick={() => handleRestaurantClick(restaurant.name)} // Pasa el nombre del restaurante
          >
            <div>
              <img className='restaurant-item-image' src={`${url}/images/${restaurant.image}`} alt={restaurant.name} />  
              <p>{restaurant.name}</p>
              <p>{restaurant.localisation}</p>
              
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default RestaurantDisplay;
