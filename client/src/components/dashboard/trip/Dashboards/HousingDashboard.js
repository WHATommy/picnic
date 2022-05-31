import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { HousingCard } from './HousingCard';

export const HousingDashboard = (props) => {
  return (
    <>
      {
        props.housings.map(housing => {
          return (
            <>
              <HousingCard housing={housing}/>
            </>
          )
        })
      };
    </>
  )
}
