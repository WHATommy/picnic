import axios from "axios";
import authHeader from "../util/authHeader";
import baseUrl from "../util/baseUrl";

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
        const invitations = await user.data.invitations.reduce(async (list, tripId) => {
            let trip = axios.get(`${baseUrl}/trip/${tripId}`, { headers: { "token": await authHeader() } });
            return list.push( { icon: trip.icon, _id: trip._id, name: trip.name, location: trip.location, startDate: trip.startDate, endDate: trip.endDate } );
        });
        return invitations;
    } catch (error) {
        console.log(error);
    };
}

const userService = {
    getUserTrips,
    getUserInvitations
}
export default userService;

