import axios from "axios";
import baseUrl from "../util/baseUrl";
import authHeader from "../util/authHeader";

// Accept invitation
const acceptInvite = async (tripId) => {
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
const declineInvite = async tripId => {
    try {
        const authToken = authHeader();
        const response = await axios
            .put(`${baseUrl}/invite/${tripId}/decline`, {}, { headers: { "token": authToken } });
        return response;
    } catch (error) {
        console.log(error);
    }
};

const inviteService = { acceptInvite, declineInvite }
export default inviteService;

