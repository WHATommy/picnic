import React, { useState, useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../slices/user";
import { useParams } from "react-router-dom";

// Components
import { Navbar } from "./navbar/Navbar";
import { TripDashboard } from "./trip/TripDashboard";
import { InvitationList } from "./home/InvitationList";


import { loadAllContent } from "../../slices/content";
import { loadTrip, loadAttendingContent, loadPersonalCost } from "../../slices/trip";

const Dashboard = () => {
    // Check if user has token
    if (localStorage.token) {
        localStorage.setItem("token", localStorage.token);
    };

    let params = useParams();
    
    // Load user information into state
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadUser({}));
        if(params.tripId) {
            dispatch(loadTrip({tripId: params.tripId}));
            dispatch(loadAttendingContent({ tripId: params.tripId, userId: params.userId }));
            dispatch(loadPersonalCost({tripId: params.tripId, userId: params.userId}));
        }
        if(params.tripId && params.contentType) {
            dispatch(loadAllContent({ tripId: params.tripId, contentType: params.contentType }));
        }
    }, [dispatch, params]);

    // Redux states
    const user = useSelector((state) => state.user);
    const trip = useSelector((state) => state.trip);
    
    return (
        <div className="container-fluid">
            <div className="navbar navbar-expand-lg">
                {user.trips && 
                    <Navbar user={user} />
                }
            </div>
            <div>
                {!(trip._id) &&
                    (user.invitations ? 
                        <InvitationList invitations={user.invitations} />
                        : 
                        (
                            <>
                                <h2>Invitations</h2>
                                <hr />
                                <p>No one has invited you to a trip yet...</p> 
                            </>
                        )
                    )
                }
                {(trip._id && params.userId) && (
                        <TripDashboard trip={trip} userId={params.userId} />
                    )
                }
            </div>
        </div>
    );
};

export default Dashboard;