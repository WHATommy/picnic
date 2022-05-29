import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";

// Slices
import { loadTrip } from "../../../slices/trip";

export const EventIcon = (props) => {
    const dispatch = useDispatch();
    const renderTooltip = () => (
        <Tooltip>Event</Tooltip>
    );

    const handleGetHousing = (e) => {
        //dispatch(loadTrip({tripId: e.target.id}))
    }

    return (
        <OverlayTrigger placement="bottom" overlay={(renderTooltip())}>
            <button type="button" className="btn p-0 m-1" onClick={handleGetHousing}>
                <i class="bi bi-balloon" style={{fontSize: "40px"}}></i>
            </button>
        </OverlayTrigger>
    )
}
