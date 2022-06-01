import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

export const AttendeeCard = (props) => {
    const dispatch = useDispatch();
    
    // Loading state
    const [loading, setLoading] = useState(false);

    const user = useSelector((state) => state.user && state.user);
    const isMod = useSelector((state) => state.trip.isMod);
    const ownerId = useSelector((state) => state.trip.owner);

    const handleMod = () => {

    }
    
    return (
        <>
            <div className="text-center m-2 border border-primary rounded">
                <img className="rounded mt-2 border secondary-border" src={props.attendee.profilePic.image} width={70} height={70} alt={props.attendee.username} />
                <p className="mt-2">{props.attendee.username}</p>   
                {
                    !(user.info._id === props.attendee._id) && (props.type === "attendee") && (
                        <>
                            {((ownerId === user.info._id)) && 
                                <button type="button" className="btn btn-outline-primary m-2" onClick={handleMod}>Mod</button>
                            }
                            {((ownerId === user.info._id)) &&
                                <button type="button" className="btn btn-outline-danger m-2" onClick={handleMod}>Unmod</button>
                            }
                            {(ownerId === user.info._id || isMod) &&
                                <button type="button" className="btn btn-outline-danger m-2">Kick</button> 
                            }
                        </> 
                    )
                }        
            </div>
        </>
  )
}