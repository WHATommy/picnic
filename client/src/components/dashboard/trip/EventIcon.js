import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

// Slices
import { emptyContent } from '../../../slices/content';

export const EventIcon = (props) => {
    let navigate = useNavigate();

    const dispatch = useDispatch();
    const renderTooltip = () => (
        <Tooltip>Events</Tooltip>
    );

    const handleGetHousing = () => {
        dispatch(emptyContent({}));
        const url = `/dashboard/${props.userId}/${props.tripId}/event`;
        navigate(url);
    }

    const inActive = "bi bi-balloon";
    const active = "bi bi-balloon primary";

    return (
        <OverlayTrigger placement="bottom" overlay={(renderTooltip())}>
            <button type="button" className="btn p-0 m-1" onClick={handleGetHousing}>
                <i className={props.contentType === "event" ? active : inActive} style={{fontSize: "40px"}}></i>
            </button>
        </OverlayTrigger>
    )
}
