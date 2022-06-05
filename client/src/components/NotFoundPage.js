import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
    let navigate = useNavigate();
    const handleGetHousing = () => {
        const url = `/dashboard`;
        navigate(url);
    }
    return (
        <>
            <button type="button" className="btn p-0 m-1" onClick={handleGetHousing}>
                Home
            </button>
        </>
    )
}
