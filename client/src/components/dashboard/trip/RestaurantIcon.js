import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

// Slices
import { emptyContent } from '../../../slices/content';

export const RestaurantIcon = (props) => {
    let navigate = useNavigate();

    const dispatch = useDispatch();
    const renderTooltip = () => (
        <Tooltip>Restaurants</Tooltip>
    );

    const handleGetRestaurant = () => {
        dispatch(emptyContent({}));
        const url = `/dashboard/${props.userId}/${props.tripId}/restaurant`;
        navigate(url);
    }

    const inActive = "bi bi-shop";
    const active = "bi bi-shop primary";

    return (
        <OverlayTrigger placement="bottom" overlay={(renderTooltip())}>
            <button type="button" className="btn p-0 m-1" onClick={handleGetRestaurant}>
                <i className={props.contentType === "restaurant" ? active : inActive} style={{fontSize: "40px"}}></i>
            </button>
        </OverlayTrigger>
    )
}
