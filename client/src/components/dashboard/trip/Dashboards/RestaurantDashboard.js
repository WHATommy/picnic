import React from 'react'
import { RestaurantCard } from "./RestaurantCard";

export const RestaurantDashboard = (props) => {
  return (
    <>
      {
        props.restaurants.map(restaurant => {
          return (
            <>
              <RestaurantCard restaurant={restaurant} userId={props.userId}/>
            </>
          )
        })
      };
    </>
  )
}
