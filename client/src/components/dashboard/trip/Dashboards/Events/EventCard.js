import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";

import { loadContentAttendees, removeContent, loadAllContent } from '../../../../../slices/content';
import contentService from "../../../../../services/contentService";
import { loadPersonalCost, loadTrip } from '../../../../../slices/trip';
import { loadAttendingContent } from '../../../../../slices/trip';
import { EventEditModal } from './EventEditModal';

export const EventCard = (props) => {
    const dispatch = useDispatch();
    const tripId = useSelector((state) => state.trip._id);
    const eventAttendee = useSelector((state) => state.content.attendees);
    const attendee = useSelector((state) => state.trip.attending);
    const isAttendingEvent = attendee.attending.events.find(event => event._id === props.event._id);
    const ownerId = useSelector((state) => state.trip.owner);
    const moderators = useSelector((state) => state.trip.moderators);

    // Loading state
    const [loading, setLoading] = useState(false);
    // Loading state
    const [loadingRemove, setLoadingRemove] = useState(false);

    // Modal show state
    const [show, setShow] = useState(false);
    // Modal toggle
    const handleClose = () => {
        setShow(false);
    };
    const handleShow = (e) => {
        dispatch(loadContentAttendees({ tripId: tripId, contentId: props.event._id, contentType: "event" }));
        e.preventDefault();
        setShow(true);
    };

    // Modal show state
    const [showEdit, setShowEdit] = useState(false);
    // Modal toggle
    const handleCloseEdit = () => {
        setShowEdit(false);
    };
    const handleShowEdit = (e) => {
        dispatch(loadContentAttendees({ tripId: tripId, contentId: props.event._id, contentType: "event" }));
        e.preventDefault();
        setShowEdit(true);
    };

    // Modal show state
    const [showRemove, setShowRemove] = useState(false);
    // Modal toggle
    const handleCloseRemove = () => {
        setShowRemove(false);
    };
    const handleShowRemove = (e) => {
        dispatch(loadContentAttendees({ tripId: tripId, contentId: props.event._id, contentType: "event" }));
        e.preventDefault();
        setShowRemove(true);
    };

    const handleJoin = async () => {
        setLoading(true);
        await contentService.joinContent(tripId, props.event._id, props.userId, "event");
        dispatch(loadAttendingContent({ tripId: tripId, userId: props.userId }));
        dispatch(loadContentAttendees({ tripId: tripId, contentId: props.event._id, contentType: "event" }));
        dispatch(loadPersonalCost({ tripId: tripId, userId: props.userId }));
        dispatch(loadTrip({ tripId: tripId }));
        setLoading(false);
    }

    const handleLeave = async () => {
        setLoading(true);
        await contentService.leaveContent(tripId, props.event._id, props.userId, "event");
        dispatch(loadAttendingContent({ tripId: tripId, userId: props.userId }));
        dispatch(loadContentAttendees({ tripId: tripId, contentId: props.event._id, contentType: "event" }));
        dispatch(loadPersonalCost({ tripId: tripId, userId: props.userId }));
        dispatch(loadTrip({tripId: tripId}));
        setLoading(false);
    }

    const handleRemove = async () => {
        setLoadingRemove(true);
        await dispatch(removeContent({ 
            tripId: tripId, 
            contentId: props.event._id, 
            contentType: "event" 
        }));
        await dispatch(loadAllContent({tripId: tripId, contentType: "event"}));
        await dispatch(loadPersonalCost({tripId: tripId, userId: props.userId}));
        setLoadingRemove(false);
    }

    const startDate = new Date(props.event.startDate).toLocaleDateString(
        'en-US',
        {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        }
    );
    const endDate = new Date(props.event.endDate).toLocaleDateString(
        'en-US',
        {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        }
    );

    return (
        <div className="card" style={{width: "18rem"}} key={props.event.name}>
        {props.event.image ? 
            <img
                className="rounded image-fluid"
                src={props.event.image.src}
                alt={props.event.image.title}
            />
            :
            <img
                className="rounded image-fluid"
                src="https://res.cloudinary.com/dkf1fcytw/image/upload/v1652914309/event_y8bwaz.png"
                alt="default event"
            />
        }
        <div className="card-body">
            <h5 className="card-title"><i className="bi bi-card-text primary"></i> {props.event.name}</h5>
        </div>
        <ul className="list-group list-group-flush">
            <li className="list-group-item"><i className="bi bi-geo-alt primary"></i> {props.event.location}</li>
            <li className="list-group-item"><i className="bi bi-calendar-week primary"></i> {startDate} - {endDate}</li>
            <li className="list-group-item"><i className="bi bi-piggy-bank primary"></i> ${props.event.cost}</li>
        </ul>
        <div className="card-body row">
            <div className="col-6">
                {
                    !(isAttendingEvent) ?
                        <button className="btn btn-success" onClick={handleJoin} disabled={loading}>
                            {loading && (
                                <span className="spinner-border spinner-border-sm"></span>
                            )}
                            Join
                        </button>
                    :
                        <button className="btn btn-danger" onClick={handleLeave} disabled={loading}>
                            {loading && (
                                <span className="spinner-border spinner-border-sm"></span>
                            )}
                            Leave
                        </button>
                }
            </div>
            <div className="col-6 text-end">
                <button className="btn btn-primary" onClick={handleShow}>Attendees</button>
            </div>
        </div>
        { ((ownerId === props.userId) || (moderators.includes(props.userId))) &&
            <div className="card-body row">
                <div className="col-6">
                    <button className="btn btn-secondary" onClick={handleShowEdit}>Edit</button>
                </div>
                <div className="col-6 text-end">
                    <button className="btn btn-danger" onClick={handleShowRemove}>Remove</button>
                </div>
            </div>
        }
        <Modal
            show={show}
            onHide={handleClose}
            >
            <Modal.Header closeButton>
                <Modal.Title>{props.event.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul className="list-group">
                    {
                        eventAttendee && (
                            eventAttendee.map(attendee => {
                                return (
                                    <li className="list-group-item d-flex flex-row flex-nowrap overflow-auto">
                                        <img className="rounded-circle" src={attendee.profilePic.image} height="65" width="65" alt={attendee.name} />
                                        <h3 className="mt-2 ms-3">{attendee.username}</h3>
                                    </li>
                                )
                            })
                        )
                    }
                </ul>
            </Modal.Body>
        </Modal>
        <Modal
            show={showEdit}
            onHide={handleCloseEdit}
        >
            <EventEditModal userId={props.userId} event={props.event} tripId={tripId} handleCloseEdit={handleCloseEdit} />
        </Modal>
        <Modal
            show={showRemove}
            onHide={handleCloseRemove}
        >
            <Modal.Header closeButton>
                <Modal.Title>Remove {props.event.name}?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    <div className="row">
                        <div className="col-6">
                            <button className="btn btn-primary" onClick={handleRemove}>
                                {loadingRemove && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                Confirm
                            </button>
                        </div>
                        <div className="col-6 text-end">
                            <button className="btn btn-danger" onClick={handleShowRemove}>Cancel</button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </div> 
  )
}
