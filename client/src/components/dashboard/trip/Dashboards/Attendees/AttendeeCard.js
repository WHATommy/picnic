import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { changeModeratorStatus, kickUserFromTrip } from '../../../../../slices/trip';

import { useNavigate } from 'react-router-dom';

export const AttendeeCard = (props) => {
    const dispatch = useDispatch();
    let navigate = useNavigate();

    // Loading state
    const [loading, setLoading] = useState(false);
    const [loadingKick, setLoadingKick] = useState(false);

    // Modal show state
    const [show, setShow] = useState(false);

    // Modal toggle
    const handleClose = () => {
        setShow(false);
    };
    const handleShow = (e) => {
        e.preventDefault();
        setShow(true);
    };

    const tripId = useSelector((state) => state.trip._id)
    const ownerId = useSelector((state) => state.trip.owner);
    const moderators = useSelector((state) => state.trip.moderators);

    const handleMod = async (e) => {
        setLoading(true);
        await dispatch(changeModeratorStatus({tripId, userId: e.target.value}));
        setLoading(false);
    }

    const handleKick = async (e) => {
        setLoadingKick(true);
        await dispatch(kickUserFromTrip({tripId, userId: e.target.value}));
        setLoadingKick(false);
        const url = `/dashboard/${props.userId}/${tripId}/attendee`;
        navigate(url);
    }
    
    return (
        <>
            <div className="text-center m-2 border border-primary rounded">
                <img className="rounded mt-2 border secondary-border" src={props.attendee.profilePic.image} width={70} height={70} alt={props.attendee.username} />
                <p>
                {
                    moderators.includes(props.attendee._id) && "Moderator"
                }
                </p>
                <p>
                {
                    (ownerId === props.attendee._id) && "Owner"
                }
                </p>
                <p className="mt-2">{props.attendee.username}</p>   
                {
                    !(props.userId === props.attendee._id) && (props.type === "attendee") && (
                        <>
                            {((ownerId === props.userId)) && !(moderators.includes(props.attendee._id)) &&
                                <button disabled={loading} type="button" className="btn btn-outline-primary m-2" value={props.attendee._id} onClick={handleMod}>
                                    {loading && (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    )}
                                    Mod
                                </button>
                            }
                            {((ownerId === props.userId)) && (moderators.includes(props.attendee._id)) &&
                                <button disabled={loading} type="button" className="btn btn-outline-danger m-2" value={props.attendee._id}  onClick={handleMod}>
                                    {loading && (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    )}
                                    Unmod
                                </button>
                            }
                            {((ownerId === props.userId) || (moderators.includes(props.userId))) && (ownerId !== props.attendee._id) &&
                                <button type="button" className="btn btn-outline-danger m-2" onClick={handleShow}>Kick</button> 
                            }
                        </> 
                    )
                }        
            </div>
            <Modal
                show={show}
                onHide={handleClose}
                >
                <Modal.Header closeButton>
                    <Modal.Title>Remove {props.attendee.username}?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <button value={props.attendee._id} type="button" className="btn btn-outline-primary m-2" onClick={handleKick}>
                        {loadingKick && (
                            <span className="spinner-border spinner-border-sm"></span>
                        )}
                        Confirm
                    </button> 
                    <button type="button" className="btn btn-outline-danger m-2" onClick={handleClose}>Cancel</button> 
                </Modal.Body>
            </Modal>
        </>
  )
}