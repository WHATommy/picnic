import React from 'react';
import { AttendeeIcon } from './AttendeeIcon';
import { EventIcon } from './EventIcon';
import { HousingIcon } from './HousingIcon';
import { RestaurantIcon } from './RestaurantIcon';
import { LeaveIcon } from './LeaveIcon';

export const TripNavbar = (props) => {
    return (
        <div className="bg-light overflow-auto d-flex flex-row flex-nowrap bg-light align-items-center sticky-top" style={{width: "100%"}}>
            <button type="button" className="btn p-0 m-1">
                <img className="rounded" src={props.icon} height="60" width="60" alt="Trip" />
            </button>
            <div className="vr m-1"></div>
            <h1 className="m-1 fw-light fs-2 text-center">{props.name}</h1>
            <div className="vr m-1"></div>
            <div className="text-center">
                <HousingIcon userId={props.userId} tripId={props.tripId} contentType={props.contentType} />
                <EventIcon userId={props.userId} tripId={props.tripId} contentType={props.contentType} />
                <RestaurantIcon userId={props.userId} tripId={props.tripId} contentType={props.contentType} />
                <AttendeeIcon userId={props.userId} tripId={props.tripId} contentType={props.contentType} />
            </div>
            <div className="vr m-1"></div>
            <div>
                <p className="m-1"><span className="fw-light"><i className="bi bi-geo-alt-fill primary"></i> {props.location}</span></p>
                <p className="m-1"><span className="fw-light"><i className="bi bi-calendar-check-fill primary"></i> {props.startDate} - {props.endDate}</span></p>
            </div>
            <div>
                <p className="m-1"><span className="fw-light"><i className="bi bi-cash-stack primary"></i> Trip Cost: ${props.cost}</span></p>
                <p className="m-1"><span className="fw-light"><i className="bi bi-cash primary"></i> Personal Cost: ${props.personalCost}</span></p>
            </div>
            <div className="ms-auto">
                <LeaveIcon tripId={props.tripId} />
            </div>
        </div>
    )
}
