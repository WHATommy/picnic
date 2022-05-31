import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";

import { loadContentAttendees } from '../../../../slices/content';
import contentService from "../../../../services/contentService";
import { loadPersonalCost, loadTrip } from '../../../../slices/trip';
import { loadAttendingContent } from '../../../../slices/trip';

export const RestaurantCard = (props) => {
    const dispatch = useDispatch();
    const tripId = useSelector((state) => state.trip._id);
    const restaurantAttendee = useSelector((state) => state.content.attendees);
    const attendee = useSelector((state) => state.trip.attending);
    const isAttendingRestaurant = attendee.attending.restaurants.find(restaurant => restaurant._id === props.restaurant._id);

    // Loading state
    const [loading, setLoading] = useState(false);

    // Modal show state
    const [show, setShow] = useState(false);


    // Modal toggle
    const handleClose = () => {
        setShow(false);
    };
    const handleShow = (e) => {
        dispatch(loadContentAttendees({ tripId: tripId, contentId: props.restaurant._id, contentType: "restaurant" }));
        e.preventDefault();
        setShow(true);
    };

    const handleJoin = async () => {
        setLoading(true);
        await contentService.joinContent(tripId, props.restaurant._id, props.userId, "restaurant");
        dispatch(loadAttendingContent({ tripId: tripId, userId: props.userId }));
        dispatch(loadContentAttendees({ tripId: tripId, contentId: props.restaurant._id, contentType: "restaurant" }));
        dispatch(loadPersonalCost({ tripId: tripId, userId: props.userId }));
        dispatch(loadTrip({ tripId: tripId }));
        setLoading(false);
    }

    const handleLeave = async () => {
        setLoading(true);
        await contentService.leaveContent(tripId, props.restaurant._id, props.userId, "restaurant");
        dispatch(loadAttendingContent({ tripId: tripId, userId: props.userId }));
        dispatch(loadContentAttendees({ tripId: tripId, contentId: props.restaurant._id, contentType: "restaurant" }));
        dispatch(loadPersonalCost({ tripId: tripId, userId: props.userId }));
        dispatch(loadTrip({tripId: tripId}));
        setLoading(false);
    }

    const startDate = new Date(props.restaurant.startDate).toLocaleDateString(
        'en-US',
        {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        }
      );
      const endDate = new Date(props.restaurant.endDate).toLocaleDateString(
        'en-US',
        {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        }
    );
    return (
        <div className="card" style={{width: "18rem"}} key={props.restaurant.name}>
        {props.restaurant.image ? 
            <img
            className="rounded image-fluid"
            src={props.restaurant.image.src}
            alt={props.restaurant.image.title}
            />
            :
            <img
            className="rounded image-fluid"
            src="https://res.cloudinary.com/dkf1fcytw/image/upload/v1652914309/restaurant_ldnzgt.png"
            alt="default restaurant"
            />
        }
        <div className="card-body">
            <h5 className="card-title"><i className="bi bi-card-text primary"></i> {props.restaurant.name}</h5>
        </div>
        <ul className="list-group list-group-flush">
            <li className="list-group-item"><i className="bi bi-geo-alt primary"></i> {props.restaurant.location}</li>
            <li className="list-group-item"><i className="bi bi-calendar-week primary"></i> {startDate} - {endDate}</li>
            <li className="list-group-item"><i className="bi bi-piggy-bank primary"></i> ${props.restaurant.cost}</li>
        </ul>
        <div className="card-body row">
            <div className="col-6">
                {
                    !(isAttendingRestaurant) ?
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
                <Modal.Title>{props.restaurant.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul className="list-group">
                    {
                        restaurantAttendee && (
                            restaurantAttendee.map(attendee => {
                                return (
                                    <li className="list-group-item d-flex flex-row flex-nowrap overflow-auto">
                                        <img className="rounded-circle" src={attendee.profilePic.image} height="65" width="65" alt={attendee.name} />
                                        <h3 className="mt-3 ms-3">{attendee.username}</h3>
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
