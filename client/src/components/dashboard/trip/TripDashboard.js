import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { TripNavbar } from './TripNavbar';
import { HousingDashboard } from './Dashboards/HousingDashboard';
import { EventDashboard } from './Dashboards/EventDashboard';
import { RestaurantDashboard } from './Dashboards/RestaurantDashboard';

import { loadAttendingContent } from '../../../slices/trip';

export const TripDashboard = (props) => {
    const dispatch = useDispatch();
    useEffect(() => {
        
    }, [dispatch]);

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
                />
            </div>
            <div className="">
                <div className="row row-cols-1 row-cols-md-2 g-4">
                    {(content.contentType === "housing") &&
                        <HousingDashboard housings={content.content} />
                    }
                    {(content.contentType === "event") &&
                        <EventDashboard events={content.content} />
                    }
                    {(content.contentType === "restaurant") &&
                        <RestaurantDashboard restaurants={content.content} />
                    }
                </div>
            </div>
        </div>
    )
}
