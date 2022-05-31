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
        console.log(error)
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
        console.log(error)
    }    ;
};

// Get user's personal cost for a trip
const getPersonalCost = async (tripId, userId) => {
    try {
        const authToken = authHeader();
        const response = await axios
            .get(`${baseUrl}/attendee/${tripId}/${userId}`, { headers: { "token": authToken } } );
        return response.data.personalCost;
    } catch (error) {
        console.log(error)
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
        console.log(error)
    };
}

const tripService = { addTrip, getTrip, getPersonalCost, getUserAttendingContent }
export default tripService;

