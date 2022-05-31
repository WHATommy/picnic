import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

import { emptyContent } from '../../../slices/content';

export const TripIcons = (props) => {
    let navigate = useNavigate();
    
    const dispatch = useDispatch();
    const renderTooltip = () => (
        <Tooltip>{props.tripName}</Tooltip>
    );

    const handleGetTrip = (e) => {
        dispatch(emptyContent({}));
        const url = `/dashboard/${props.userId}/${e.target.id}`;
        navigate(url);
    }

    const inActive = "rounded";
    const active = "rounded border border-3 border-primary"

    return (
        <OverlayTrigger placement="bottom" overlay={(renderTooltip())}>
            <button type="button" className="btn p-0 m-1" onClick={handleGetTrip}>
                <img id={props.tripId} className={props.tripId === props.currentTrip ? active : inActive} src={props.tripIcon} height="60" width="60" alt="Trip" />
            </button>
        </OverlayTrigger>
    )
}
