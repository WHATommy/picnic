import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";

// Slices
import { loadTrip } from "../../../slices/trip";

export const TripIcons = (props) => {
    const dispatch = useDispatch();
    const renderTooltip = () => (
        <Tooltip>{props.tripName}</Tooltip>
    );

    const handleGetTrip = (e) => {
        dispatch(loadTrip({tripId: e.target.id}))
    }

    return (
        <OverlayTrigger placement="bottom" overlay={(renderTooltip())}>
            <button type="button" className="btn p-0 m-1" onClick={handleGetTrip}>
                <img id={props.tripId} className="rounded" src={props.tripIcon} height="60" width="60" alt="Trip" />
            </button>
        </OverlayTrigger>
    )
}