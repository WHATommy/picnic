import React, { useState, useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../slices/user";

// Components
import { Sidebar } from "./Sidebar/Sidebar";

// Utility
import authHeader from "../../util/authHeader";

const Dashboard = () => {
    // Check if user has token
    if (localStorage.token) {
        localStorage.setItem("token", localStorage.token);
    }
    
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadUser({}));
    }, [dispatch]);

    const user = useSelector((state) => state.user);

    return (
        <div>
            {user.trips && 
                <Suspense fallback={<></>}>
                    <div className="">
                        <Sidebar trips={user.trips} />
                    </div>
                </Suspense>
            }
        </div>
    );
};

export default Dashboard;