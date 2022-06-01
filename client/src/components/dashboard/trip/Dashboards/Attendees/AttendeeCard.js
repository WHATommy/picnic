import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

export const AttendeeCard = (props) => {
    const dispatch = useDispatch();
    
    // Loading state
    const [loading, setLoading] = useState(false);

    return (
        <>
            <div className="text-center m-2 border border-primary rounded">
                <img className="rounded mt-2 border secondary-border" src={props.attendee.profilePic.image} width={70} height={70} alt={props.attendee.username} />
                <p className="mt-2">{props.attendee.username}</p>            
            </div>
        </>
  )
}