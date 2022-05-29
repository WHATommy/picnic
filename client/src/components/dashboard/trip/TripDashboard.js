import React from 'react'
import { TripNavbar } from './TripNavbar'

export const TripDashboard = (props) => {
    return (
        <div className="navbar navbar-expand-lg">
            <TripNavbar icon={props.trip.icon.image} name={props.trip.name} cost={props.trip.cost}/>
        </div>
    )
}
