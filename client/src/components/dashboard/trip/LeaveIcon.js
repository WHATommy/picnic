import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";

// Slices
import { loadAllContent } from '../../../slices/content';
import { loadUser } from '../../../slices/user';

export const LeaveIcon = (props) => {
    const dispatch = useDispatch();
    const renderTooltip = () => (
        <Tooltip>Leave trip</Tooltip>
    );

    const handleLeaveTrip = (e) => {
        dispatch(loadAllContent({}));
        dispatch(loadUser({}));
    }

    return (
        <OverlayTrigger placement="bottom" overlay={(renderTooltip())}>
            <button type="button" className="btn p-0 m-1" onClick={handleLeaveTrip}>
                <i className="bi bi-arrow-left-square" style={{fontSize: "40px", color: "#e63737"}}></i>
            </button>
        </OverlayTrigger>
    )
}
