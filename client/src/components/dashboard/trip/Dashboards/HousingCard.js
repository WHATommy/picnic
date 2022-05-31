import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";

import { loadContentAttendees } from '../../../../slices/content';
import contentService from "../../../../services/contentService";
import { loadPersonalCost, loadTrip } from '../../../../slices/trip';
import { loadAttendingContent } from '../../../../slices/trip';

export const HousingCard = (props) => {
    const dispatch = useDispatch();
    const tripId = useSelector((state) => state.trip._id);
    const housingAttendee = useSelector((state) => state.content.attendees);
    const attendee = useSelector((state) => state.trip.attending);
    const isAttendingHousing = attendee.attending.housings.find(housing => housing._id === props.housing._id);

    // Loading state
    const [loading, setLoading] = useState(false);

    // Modal show state
    const [show, setShow] = useState(false);


    // Modal toggle
    const handleClose = () => {
        setShow(false);
    };
    const handleShow = (e) => {
        dispatch(loadContentAttendees({attendees: props.housing.attendees}));
        e.preventDefault();
        setShow(true);
    };

    const handleJoin = async () => {
        setLoading(true);
        await contentService.joinContent(tripId, props.housing._id, props.userId, "housing");
        dispatch(loadAttendingContent({ tripId: tripId, userId: props.userId }));
        dispatch(loadPersonalCost({ tripId: tripId, userId: props.userId }));
        dispatch(loadTrip({ tripId: tripId }));
        setLoading(false);
    }

    const handleLeave = async () => {
        setLoading(true);
        await contentService.leaveContent(tripId, props.housing._id, props.userId, "housing");
        dispatch(loadAttendingContent({ tripId: tripId, userId: props.userId }));
        dispatch(loadPersonalCost({ tripId: tripId, userId: props.userId }));
        dispatch(loadTrip({tripId: tripId}));
        setLoading(false);
    }

    const startDate = new Date(props.housing.startDate).toLocaleDateString(
        'en-US',
        {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        }
      );
      const endDate = new Date(props.housing.endDate).toLocaleDateString(
        'en-US',
        {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        }
    );
    return (
        <div className="card" style={{width: "18rem"}} key={props.housing.name}>
        {props.housing.image ? 
            <img
            className="rounded image-fluid"
            src="https://res.cloudinary.com/dkf1fcytw/image/upload/v1652914309/house_metmml.png"
            alt={props.housing.image.title}
            />
            :
            <img
            className="rounded image-fluid"
            src="https://res.cloudinary.com/dkf1fcytw/image/upload/v1652914309/house_metmml.png"
            alt="default housing"
            />
        }
        <div className="card-body">
            <h5 className="card-title"><i className="bi bi-card-text primary"></i> {props.housing.name}</h5>
        </div>
        <ul className="list-group list-group-flush">
            <li className="list-group-item"><i className="bi bi-geo-alt primary"></i> {props.housing.location}</li>
            <li className="list-group-item"><i className="bi bi-calendar-week primary"></i> {startDate} - {endDate}</li>
            <li className="list-group-item"><i className="bi bi-piggy-bank primary"></i> ${props.housing.cost}</li>
        </ul>
        <div className="card-body row">
            <div className="col-6">
                {
                    !(isAttendingHousing) ?
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
        <Modal
            show={show}
            onHide={handleClose}
            >
            <Modal.Header closeButton>
                <Modal.Title>{props.housing.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul className="list-group">
                    {
                        housingAttendee && (
                            housingAttendee.map(attendee => {
                                return (
                                    <li className="list-group-item d-flex flex-row flex-nowrap overflow-auto">
                                        <img className="rounded-circle" src={attendee.profilePic.image} height="65" width="65" alt={attendee.name} />
                                    </li>
                                )
                            })
                        )
                    }
                </ul>
            </Modal.Body>
        </Modal>
        </div> 
  )
}