import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

export const RestaurantCard = (props) => {
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
        <div className="card" style={{width: "18rem"}}>
        {props.restaurant.image ? 
            <img
            className="rounded image-fluid"
            src="https://res.cloudinary.com/dkf1fcytw/image/upload/v1652914309/house_metmml.png"
            alt={props.restaurant.image.title}
            />
            :
            <img
            className="rounded image-fluid"
            src="https://res.cloudinary.com/dkf1fcytw/image/upload/v1652914309/house_metmml.png"
            alt="default housing"
            />
        }
        <div className="card-body">
            <h5 className="card-title"><i class="bi bi-card-text primary"></i> {props.restaurant.name}</h5>
        </div>
        <ul className="list-group list-group-flush">
            <li className="list-group-item"><i class="bi bi-geo-alt primary"></i> {props.restaurant.location}</li>
            <li className="list-group-item"><i class="bi bi-calendar-week primary"></i> {startDate} - {endDate}</li>
            <li className="list-group-item"><i class="bi bi-piggy-bank primary"></i> ${props.restaurant.cost}</li>
        </ul>
        <div className="card-body row">
            <div className="col-6">
            <button className="btn btn-success">Join</button>
            </div>
            <div className="col-6 text-end">
            <button className="btn btn-primary" onClick={handleShow}>Details</button>
            </div>
        </div>
        <Modal
            show={show}
            onHide={handleClose}
            >
            <Modal.Header closeButton>
                <Modal.Title>{props.restaurant.name}</Modal.Title>
            </Modal.Header>
        </Modal>
        </div> 
  )
}
