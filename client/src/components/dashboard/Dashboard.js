import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../slices/user";

// Components
import { Sidebar } from "./Sidebar";

const Dashboard = (props) => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadUser);
    }, [dispatch]);
  

    return (
        <div className="">
            <Sidebar />
        </div>
    );
};

export default Dashboard;