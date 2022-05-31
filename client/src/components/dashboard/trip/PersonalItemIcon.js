import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";

// Slices
import { loadAllContent } from '../../../slices/content';
import { loadUser } from '../../../slices/user';

export const PersonalItemIcon = (props) => {
    const dispatch = useDispatch();
    const renderTooltip = () => (
        <Tooltip>Personal Items</Tooltip>
    );

    const handleGetPersonalItem = () => {
        dispatch(loadAllContent({ tripId: props.tripId, contentType: "personalItem" }));
        dispatch(loadUser({}));
    }

    const inActive = "bi bi bi-bag";
    const active = "bi bi bi-bag primary";

    return (
        <OverlayTrigger placement="bottom" overlay={(renderTooltip())}>
            <button type="button" className="btn p-0 m-1" onClick={handleGetPersonalItem}>
                <i className={props.contentType === "personalItem" ? active : inActive} style={{fontSize: "40px"}}></i>
            </button>
        </OverlayTrigger>
    )
}
