import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";

// Slices
import { loadAllContent } from '../../../slices/content';
import { loadUser } from '../../../slices/user';

export const HousingIcon = (props) => {
    const dispatch = useDispatch();
    const renderTooltip = () => (
        <Tooltip>Housings</Tooltip>
    );

    const handleGetHousing = (e) => {
        dispatch(loadAllContent({ tripId: props.tripId, contentType: "housing" }));
        dispatch(loadUser({}));
    }

    const inActive = "bi bi-house";
    const active = "bi bi-house primary";

    return (
        <OverlayTrigger placement="bottom" overlay={(renderTooltip())}>
            <button type="button" className="btn p-0 m-1" onClick={handleGetHousing}>
                <i className={props.contentType === "housing" ? active : inActive} style={{fontSize: "40px"}}></i>
            </button>
        </OverlayTrigger>
    )
}
