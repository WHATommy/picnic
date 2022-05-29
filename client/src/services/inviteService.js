import axios from "axios";
import baseUrl from "../util/baseUrl";
import authHeader from "../util/authHeader";

// Accept invitation
const accept = async (tripId) => {
    try {
        const authToken = authHeader();
        const response = await axios
            .put(`${baseUrl}/invite/${tripId}/accept`, {}, { headers: { "token": authToken } });
        return response;
    } catch (error) {
        console.log(error);
    }
};

// Decline invitation
const decline = async tripId => {
    try {
        const authToken = authHeader();
        const response = await axios
            .put(`${baseUrl}/invite/${tripId}/decline`, {}, { headers: { "token": authToken } });
        return response;
    } catch (error) {
        console.log(error);
    }
};

const inviteService = { accept, decline }
export default inviteService;

