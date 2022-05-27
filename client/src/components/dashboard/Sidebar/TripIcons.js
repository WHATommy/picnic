import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

export const TripIcons = (props) => {
    const renderTooltip = () => (
        <Tooltip>{props.tripName}</Tooltip>
    );
    return (
        <OverlayTrigger placement="right" overlay={(renderTooltip())}>
            <button type="button" className="btn p-0 m-1">
                <img className="rounded" src={props.tripIcon} height="60" width="60" alt="tommy" />
            </button>
        </OverlayTrigger>
    )
}
