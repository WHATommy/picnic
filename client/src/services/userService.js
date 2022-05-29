import axios from "axios";
import authHeader from "../util/authHeader";
import baseUrl from "../util/baseUrl";

const getUser = async (token) => {
    try {
        const authToken = token ? token : authHeader();
        const response = await axios.get(`${baseUrl}/user/`, { headers: { "token": authToken } });
        return response.data;
    } catch (error) {
        console.log(error);
    };
};

const getUserTrips = async (token) => {
    try {
        const authToken = token ? token : authHeader();
        const response = await axios.get(`${baseUrl}/trip/`, { headers: { "token": authToken } });
        return [...response.data];
    } catch (error) {
        console.log(error);
    };
};

const getUserInvitations = async (token) => {
    try {
        const authToken = token ? token : authHeader();
        const user = await axios.get(`${baseUrl}/user/`, { headers: { "token": authToken } });
        if (user.data.invitations.length === 0) {
            return [];
        }
        const list = user.data.invitations.map(invite => invite._id);
        const invitations = await axios.post(`${baseUrl}/trip/all`,{ tripIds: list }, { headers: { "token": authToken } });
        return invitations;
    } catch (error) {
        console.log(error);
    };
}

const userService = {
    getUser,
    getUserTrips,
    getUserInvitations
}
export default userService;

