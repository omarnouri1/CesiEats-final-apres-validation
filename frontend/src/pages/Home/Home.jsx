import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import RestaurantDisplay from '../../components/RestaurantDisplay/RestaurantDisplay'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'

const Home = () => {

  const [category,setCategory] = useState("All")
  const [restaurant,setRestaurant] = useState("All")

  return (
    <>
      <Header/>
      <ExploreMenu setCategory={setCategory} category={category}/>
      <RestaurantDisplay onRestaurantClick={setRestaurant} selectedRestaurant={restaurant}/>
      <FoodDisplay category={category} restaurant={restaurant}/>
      <AppDownload/>
    </>
  )
}

export default Home
