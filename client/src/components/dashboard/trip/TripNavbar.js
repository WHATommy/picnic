import React from 'react'
import { EventIcon } from './EventIcon'
import { HousingIcon } from './HousingIcon'
import { RestaurantIcon } from './RestaurantIcon'

export const TripNavbar = (props) => {
    return (
        <div className="bg-light overflow-auto d-flex flex-row flex-nowrap bg-light align-items-center sticky-top" style={{width: "100%"}}>
            <button type="button" className="btn p-0 m-1">
                <img className="rounded" src={props.icon} height="60" width="60" alt="Trip" />
            </button>
            <div className="vr m-1"></div>
            <h1 className="m-1 fw-light fs-2 text-center">{props.name}</h1>
            <div className="vr m-1"></div>
            <div className="text-center">
                <HousingIcon />
                <EventIcon />
                <RestaurantIcon />
            </div>
            <div className="vr m-1"></div>
            <div className="ms-auto">
                <p className="m-0">Trip Cost: <span className="fw-light">${props.cost}</span></p>
                <p className="m-0">Personal Cost: <span className="fw-light">${props.cost}</span></p>
            </div>
        </div>
    )
}
