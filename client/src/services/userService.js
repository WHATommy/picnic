import axios from "axios";
import authHeader from "../util/authHeader";
import baseUrl from "../util/baseUrl";

const getUserTrips = async () => {
    try {
        const response = await axios.get(`${baseUrl}/trip/`, {}, { header: { token: authHeader } });
        return response;
    } catch (error) {
        console.log(error);
    };
};

const getUserInvitations = async () => {
    try {
        const user = axios.get(`${baseUrl}/user/`, {}, { header: { token: authHeader } });
        const invitations = await user.invitations.reduce(async (list, tripId) => {
            let trip = axios.get(`${baseUrl}/trip/${tripId}`, {}, { header: { token: authHeader } });
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

