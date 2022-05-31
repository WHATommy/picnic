import React, { useState, useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../slices/user";

// Components
import { Navbar } from "./navbar/Navbar";
import { TripDashboard } from "./trip/TripDashboard";
import { InvitationList } from "./home/InvitationList";

const Dashboard = () => {
    // Check if user has token
    if (localStorage.token) {
        localStorage.setItem("token", localStorage.token);
    }
    
    // Load user information into state
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadUser({}));
    }, [dispatch]);

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
                {trip._id && user.info._id && (
                        <TripDashboard trip={trip} userId={user.info._id} />
                    )
                }
            </div>
        </div>
    );
};

export default Dashboard;