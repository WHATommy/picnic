import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { IoRestaurantOutline } from "react-icons/io5"

// Slices
import { loadAllContent } from '../../../slices/content';
import { loadUser } from '../../../slices/user';

export const RestaurantIcon = (props) => {
    const dispatch = useDispatch();
    const renderTooltip = () => (
        <Tooltip>Restaurants</Tooltip>
    );

    const handleGetHousing = (e) => {
        dispatch(loadAllContent({ tripId: props.tripId, contentType: "restaurant" }));
        dispatch(loadUser({}));
    }

    const inActive = "bi bi-shop";
    const active = "bi bi-shop primary";

    return (
        <OverlayTrigger placement="bottom" overlay={(renderTooltip())}>
            <button type="button" className="btn p-0 m-1" onClick={handleGetHousing}>
                <i className={props.contentType === "restaurant" ? active : inActive} style={{fontSize: "40px"}}></i>
            </button>
        </OverlayTrigger>
    )
}
