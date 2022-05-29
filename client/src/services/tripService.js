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
    }
};

const getTrip = async (tripId) => {
    try {
        const authToken = authHeader();
        console.log(tripId)
        const response = await axios
            .get(`${baseUrl}/trip/${tripId}`, { headers: { "token": authToken } } );
        return response.data;
    } catch (error) {
        console.log(error)
    }    
};

const tripService = { addTrip, getTrip }
export default tripService;

