import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";

// Components
import { TripIcons } from './TripIcons';
import { AddTrip } from './AddTrip';
import { Account } from './Account';
import { Logout } from './Logout';

export const Navbar = (props) => {
  const currentTrip = useSelector((state) => state.trip._id);

  return (
      <div className="bg-light overflow-auto d-flex flex-row flex-nowrap bg-light align-items-center sticky-top" style={{width: "100%"}}>
        <a href="/"><i className="m-2 bi bi-cloud" style={{fontSize: "50px"}}></i></a>
        <div className="vr m-2"></div>
        {
          props.user.trips.map(trip => {
            return (
              <TripIcons userId={props.user.info._id} currentTrip={currentTrip} tripId={trip._id} tripIcon={trip.icon.image} tripName={trip.name} key={trip._id}/>
            );
          })
        }
        <AddTrip />
        <div className="vr m-2"></div>
        <div className="ms-auto">
          <Account user={props.user.info} />
        </div>
        <Logout />
      </div>
  )
}

