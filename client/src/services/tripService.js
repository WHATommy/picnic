import axios from "axios";
import baseUrl from "../util/baseUrl";
import authHeader from "../util/authHeader";

// Add new trip
const addTrip = async (image, name, location, startDate, endDate) => {
    try {
        const authToken = authHeader();
        const response = await axios
            .post(`${baseUrl}/trip`, { image, name, location, startDate, endDate}, { headers: { "token": authToken } })
        return response;
    } catch (error) {
        console.log(error);
    };
};

// Get trip
const getTrip = async (tripId) => {
    try {
        const authToken = authHeader();
        const response = await axios
            .get(`${baseUrl}/trip/${tripId}`, { headers: { "token": authToken } } );
        return response.data;
    } catch (error) {
        console.log(error);
    };
};

// Get user's personal cost for a trip
const getPersonalCost = async (tripId, userId) => {
    try {
        const authToken = authHeader();
        const response = await axios
            .get(`${baseUrl}/attendee/${tripId}/${userId}`, { headers: { "token": authToken } } );
        return response.data.personalCost;
    } catch (error) {
        console.log(error);
    };
}

// Get user's list of contents they are attending
const getUserAttendingContent = async (tripId, userId) => {
    try {
        const authToken = authHeader();
        const response = await axios
            .get(`${baseUrl}/attendee/${tripId}/${userId}`, { headers: { "token": authToken } } );
        return response.data;
    } catch (error) {
        console.log(error);
    };
}

// Get trip's pending user's data
const loadPendingUsers = async (userIds) => {
    try {
        const authToken = authHeader();
        const response = await axios
            .post(`${baseUrl}/user/list`, { userIds: userIds }, { headers: { "token": authToken } });
        return response.data;
    } catch (error) {
        console.log(error);
    };
}

// Invite a user
const inviteUser = async (tripId, userId) => {
    try {
        const authToken = authHeader();
        await axios
            .put(`${baseUrl}/invite/${tripId}/${userId}/send`, {},  { headers: { "token": authToken } } );
        return true;
    } catch (error) {
        console.log(error);
    };
}

// Get user role of a trip
const getRole = async (tripId, userId) => {
    try {
        const authToken = authHeader();
        const response = await axios
            .get(`${baseUrl}/attendee/${tripId}/${userId}/role`, { headers: { "token": authToken } } );
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.log(error);
    };
}

const tripService = { addTrip, getTrip, getPersonalCost, getUserAttendingContent, loadPendingUsers, inviteUser, getRole }
export default tripService;

