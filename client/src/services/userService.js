import axios from "axios";
import authHeader from "../util/authHeader";
import baseUrl from "../util/baseUrl";

const getUser = async () => {
    try {
        const authToken = authHeader();
        const response = await axios.get(`${baseUrl}/user/`, { headers: { "token": authToken } });
        return response.data;
    } catch (error) {
        console.log(error);
    };
};

const getUserTrips = async () => {
    try {
        const authToken = authHeader();
        const response = await axios.get(`${baseUrl}/trip/`, { headers: { "token": authToken } });
        return [...response.data];
    } catch (error) {
        console.log(error);
    };
};

const getUserInvitations = async () => {
    try {
        const authToken = authHeader();
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

const updateAccount = async ({username, email}) => {
    try {
        const authToken = authHeader();
        await axios.put(`${baseUrl}/user/`, {username, email}, { headers: { "token": authToken } });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const userService = {
    getUser,
    getUserTrips,
    getUserInvitations,
    updateAccount
}
export default userService;

