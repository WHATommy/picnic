import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";

// Slices
import { loadAllContent } from '../../../slices/content';
import { loadUser } from '../../../slices/user';

export const EventIcon = (props) => {
    const dispatch = useDispatch();
    const renderTooltip = () => (
        <Tooltip>Events</Tooltip>
    );

    const handleGetHousing = () => {
        dispatch(loadAllContent({ tripId: props.tripId, contentType: "event" }));
        dispatch(loadUser({}));
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
