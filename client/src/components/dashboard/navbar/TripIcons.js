import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { emptyContent } from '../../../slices/content';

// Slices
import { loadTrip, loadAttendingContent, loadPersonalCost } from "../../../slices/trip";

export const TripIcons = (props) => {
    const dispatch = useDispatch();
    const renderTooltip = () => (
        <Tooltip>{props.tripName}</Tooltip>
    );

    const handleGetTrip = (e) => {
        dispatch(loadAttendingContent({ tripId: e.target.id, userId: props.userId }));
        dispatch(loadPersonalCost({tripId: e.target.id, userId: props.userId}));
        dispatch(loadTrip({tripId: e.target.id}));
        dispatch(emptyContent({}));
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
