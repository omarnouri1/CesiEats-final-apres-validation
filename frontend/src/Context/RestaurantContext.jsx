// RestaurantContext.js
import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const RestaurantContext = createContext(null);

const RestaurantContextProvider = (props) => {
    const url = "http://localhost:4000"
    const [restaurantList, setRestaurantList] = useState([]);

    const fetchRestaurantList = async () => {
        const response = await axios.get(url + "/api/restaurant/list");
        setRestaurantList(response.data.data);
    }

    useEffect(() => {
        fetchRestaurantList();
    }, [])

    const contextValue = {
        url,
        restaurantList,
    };

    return (
        <RestaurantContext.Provider value={contextValue}>
            {props.children}
        </RestaurantContext.Provider>
    );
}

export default RestaurantContextProvider;
