import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AttendeeCard } from "./AttendeeCard";
import { Modal } from 'react-bootstrap';
import { SearchUser } from './SearchUser';
import { loadPendingAttendees } from '../../../../../slices/trip';

export const AttendeeDashboard = (props) => {
  const dispatch = useDispatch();
  const pendingUsers = useSelector((state) => state.trip.pendingUsers);
  const pendingAttendees = useSelector((state) => state.trip.pendingAttendees);
  
  useEffect(() => {
    const userIds = pendingUsers.map(user => user._id);
    dispatch(loadPendingAttendees({ userIds }))
  }, [dispatch, pendingUsers]);


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
  
  return (
    <div className="container">
      <div className="row mb-3">
        <h3>Attendees</h3>
        <hr />
        {
          props.attendees.map(attendee => {
            return (
              <div className="col-md-3 col-12">
                <AttendeeCard attendee={attendee} userId={props.userId} type="attendee" />
              </div>
            )
          })
        };
      </div>
      <div className="row mb-3">
        <h3>Pending</h3>
        <hr />
        {
          (pendingAttendees.length !== 0) &&
            pendingAttendees.map(attendee => {
              return (
                <div className="col-md-3 col-12">
                  <AttendeeCard attendee={attendee} userId={props.userId} type="pending"/>
                </div>
              )
            })
        };
        <div className="col-md-3 col-12">
          <div className="text-center m-2">
            <button id="addAttendee" type="button" className="btn mt-4" onClick={handleShow}>
                <i className="bi bi-person-plus-fill primary" style={{fontSize: "50px"}}></i>
            </button> 
          </div>
        </div>
      </div>
      <Modal
          show={show}
          onHide={handleClose}
      >
        <Modal.Header closeButton>
            <Modal.Title>Create Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SearchUser />
        </Modal.Body>
      </Modal>
    </div>
  )
}
