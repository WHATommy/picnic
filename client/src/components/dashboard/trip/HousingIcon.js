import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

// Slices
import { emptyContent } from '../../../slices/content';

export const HousingIcon = (props) => {
    let navigate = useNavigate();

    const dispatch = useDispatch();
    const renderTooltip = () => (
        <Tooltip>Housings</Tooltip>
    );

    const handleGetHousing = () => {
        dispatch(emptyContent({}));
        const url = `/dashboard/${props.userId}/${props.tripId}/housing`;
        navigate(url);
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
