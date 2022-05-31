import React from 'react';
import { HousingCard } from './HousingCard';

export const HousingDashboard = (props) => {
  return (
    <>
      {
        props.housings.map(housing => {
          return (
            <>
              <HousingCard housing={housing} userId={props.userId}/>
            </>
          )
        })
      };
    </>
  )
}
