import React, { useState } from 'react'
import { AttendeeCard } from "./AttendeeCard";
import { Modal } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from "formik";
import { SearchUser } from './SearchUser';

export const AttendeeDashboard = (props) => {
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
    <div className="row mb-3">
      {
        props.attendees.map(attendee => {
          return (
            <div className="col-md-3 col-12">
              <AttendeeCard attendee={attendee} userId={props.userId} />
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
      <Modal
          show={show}
          onHide={handleClose}
      >
          <Modal.Header closeButton>
              <Modal.Title>Search for a user</Modal.Title>
          </Modal.Header>
          <div className="p-3">
            <SearchUser />
          </div>
      </Modal>
    </div>
  )
}
