import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { IoRestaurantOutline } from "react-icons/io5"

// Slices
import { loadTrip } from "../../../slices/trip";

export const RestaurantIcon = (props) => {
    const dispatch = useDispatch();
    const renderTooltip = () => (
        <Tooltip>Restaurants</Tooltip>
    );

    const handleGetHousing = (e) => {
        //dispatch(loadTrip({tripId: e.target.id}))
    }

    return (
        <OverlayTrigger placement="bottom" overlay={(renderTooltip())}>
            <button type="button" className="btn p-0 m-1" onClick={handleGetHousing}>
                <i class="bi bi-shop" style={{fontSize: "40px"}}></i>
            </button>
        </OverlayTrigger>
    )
}
