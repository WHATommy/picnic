import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import authService from '../../../services/authService';
import { Navigate } from "react-router-dom";

export const Logout = () => {
    const renderTooltip = () => (
        <Tooltip>Logout</Tooltip>
    );

    const logout = async () => {
        try {
            authService.logout();
            return window.location.reload();
        } catch (error) {
            console.log(error)
        }
    }

    
    return (
        <div>
            <OverlayTrigger placement="left" overlay={(renderTooltip())}>
                <button id="logout" type="button" className="btn p-0 m-1" onClick={logout}>
                    <i className="bi bi-arrow-left-square" style={{fontSize: 40, color: "#e63737"}}></i>
                </button>
            </OverlayTrigger>
        </div>
    )
}
