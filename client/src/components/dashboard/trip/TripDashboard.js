import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { TripNavbar } from './TripNavbar';
import { HousingDashboard } from './Dashboards/Housings/HousingDashboard';
import { EventDashboard } from './Dashboards/Events/EventDashboard';
import { RestaurantDashboard } from './Dashboards/Restaurants/RestaurantDashboard';
import { AttendeeDashboard } from './Dashboards/Attendees/AttendeeDashboard';

export const TripDashboard = (props) => {
    const content = useSelector((state) => state.content);
    const personalCost = useSelector((state) => state.trip.personalCost);

    const startDate = new Date(props.trip.startDate).toLocaleDateString(
        'en-US',
        {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        }
      );
    const endDate = new Date(props.trip.endDate).toLocaleDateString(
        'en-US',
        {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        }
    );

    return (
        <div>
            <div className="navbar navbar-expand-lg">
                <TripNavbar 
                    tripId={props.trip._id} 
                    icon={props.trip.icon.image} 
                    name={props.trip.name} 
                    location={props.trip.location} 
                    cost={props.trip.cost} 
                    personalCost={personalCost} 
                    startDate={startDate} 
                    endDate={endDate} 
                    contentType={content.contentType}
                    userId={props.userId}
                />
            </div>
            <div className="">
                {
                    
                    (content.contentType === "attendee") ? 
                    (
                        <div className="container">
                            <AttendeeDashboard userId={props.userId} attendees={content.content} />
                        </div>
                    )
                    :
                    (
                        <div className="row row-cols-1 row-cols-md-2 g-4">
                            {(content.contentType === "housing") &&
                                <HousingDashboard userId={props.userId} housings={content.content} />
                            }
                            {(content.contentType === "event") &&
                                <EventDashboard userId={props.userId} events={content.content} />
                            }
                            {(content.contentType === "restaurant") &&
                                <RestaurantDashboard userId={props.userId} restaurants={content.content} />
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}
