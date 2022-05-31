import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";

// Slices
import { loadAllContent } from '../../../slices/content';
import { loadUser } from '../../../slices/user';

export const AttendeeIcon = (props) => {
    const dispatch = useDispatch();
    const renderTooltip = () => (
        <Tooltip>Attendees</Tooltip>
    );

    const handleGetAttendee = () => {
        dispatch(loadAllContent({ tripId: props.tripId, contentType: "attendee" }));
        dispatch(loadUser({}));
    };

    const inActive = "bi bi-people";
    const active = "bi bi-people primary";

    return (
        <OverlayTrigger placement="bottom" overlay={(renderTooltip())}>
            <button type="button" className="btn p-0 m-1" onClick={handleGetAttendee}>
                <i className={props.contentType === "attendee" ? active : inActive} style={{fontSize: "40px"}}></i>
            </button>
        </OverlayTrigger>
    );
}
