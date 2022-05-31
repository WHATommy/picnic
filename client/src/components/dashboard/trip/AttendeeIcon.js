import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

// Slices
import { emptyContent } from '../../../slices/content';

export const AttendeeIcon = (props) => {
    let navigate = useNavigate();

    const dispatch = useDispatch();
    const renderTooltip = () => (
        <Tooltip>Attendees</Tooltip>
    );

    const handleGetAttendee = () => {
        dispatch(emptyContent({}));
        const url = `/dashboard/${props.userId}/${props.tripId}/attendee`;
        navigate(url);
    }

    const inActive = "bi bi-people";
    const active = "bi bi-people primary";

    return (
        <OverlayTrigger placement="bottom" overlay={(renderTooltip())}>
            <button type="button" className="btn p-0 m-1" onClick={handleGetAttendee}>
                <i className={props.contentType === "attendee" ? active : inActive} style={{fontSize: "40px"}}></i>
            </button>
        </OverlayTrigger>
    )
}
