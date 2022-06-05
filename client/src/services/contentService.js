import axios from "axios";
import baseUrl from "../util/baseUrl";
import authHeader from "../util/authHeader";

// Retrieve all events from a trip
const getAllEvents = async (tripId) => {
    try {
        const authToken = authHeader();
        const response = await axios
            .get(`${baseUrl}/event/${tripId}`, { headers: { "token": authToken } } );
        return response.data;
    } catch (error) {
        console.log(error);
    };
};

// Retrieve all housings from a trip
const getAllHousings = async (tripId) => {
    try {
        const authToken = authHeader();
        const response = await axios
            .get(`${baseUrl}/housing/${tripId}`, { headers: { "token": authToken } } );
        return response.data;
    } catch (error) {
        console.log(error);
    };
};

// Retrieve all restaurants from a trip
const getAllRestaurants = async (tripId) => {
    try {
        const authToken = authHeader();
        const response = await axios
            .get(`${baseUrl}/restaurant/${tripId}`, { headers: { "token": authToken } } );
        return response.data;
    } catch (error) {
        console.log(error);
    };
};

// Retrieve all attendees from a trip
const getAllAttendees = async (tripId) => {
    try {
        const authToken = authHeader();
        const attendees = await axios
            .get(`${baseUrl}/attendee/${tripId}`, { headers: { "token": authToken } } );
        const userIds = attendees.data.map(attendee => {
            return attendee.userId
        })
        const response = await axios
            .post(`${baseUrl}/user/list`, { userIds }, { headers: { "token": authToken } } );
        return response.data;
    } catch (error) {
        console.log(error);
    };
};

const getContentAttendees = async (tripId, contentId, contentType) => {
    try {
        const authToken = authHeader();
        const content = await axios
            .get(`${baseUrl}/${contentType}/${tripId}/${contentId}`, { headers: { "token": authToken } });
        const response = await axios
            .post(`${baseUrl}/user/list`, { userIds: content.data.attendees }, { headers: { "token": authToken } });
        return response.data;
    } catch (error) {
        console.log(error);
    };
};

const joinContent = async (tripId, contentId, userId, content) => {
    try {
        const authToken = authHeader();
        const response = await axios
            .put(`${baseUrl}/${content}/${tripId}/${contentId}/${userId}/join`, {}, { headers: { "token": authToken } });
        return response.data;
    } catch (error) {
        return false;
    };
};

const leaveContent = async (tripId, contentId, userId, content) => {
    try {
        const authToken = authHeader();
        const response = await axios
            .put(`${baseUrl}/${content}/${tripId}/${contentId}/${userId}/leave`, {}, { headers: { "token": authToken } });
        return response.data;
    } catch (error) {
        console.log(error);
        return false;
    };
};

const addContent = async (tripId, contentInfo, contentType) => {
    try {
        const authToken = authHeader();
        console.log(tripId, contentType, contentInfo)
        await axios
            .post(`${baseUrl}/${contentType}/${tripId}`, contentInfo, { headers: { "token": authToken } });
    } catch (error) {
        console.log(error);
    }
}

const editContent = async (tripId, contentInfo, contentType) => {
    try {
        const authToken = authHeader();
        await axios
            .put(`${baseUrl}/${contentType}/${tripId}/${contentInfo._id}`, contentInfo, { headers: { "token": authToken } });
    } catch (error) {
        console.log(error);
    }
}

const removeContent = async (tripId, contentId, contentType) => {
    try {
        const authToken = authHeader();
        await axios
            .delete(`${baseUrl}/${contentType}/${tripId}/${contentId}`, { headers: { "token": authToken } });
    } catch (error) {
        console.log(error);
    }
}

const contentService = { 
    getAllEvents, 
    getAllHousings, 
    getAllRestaurants, 
    getAllAttendees, 
    getContentAttendees, 
    joinContent, 
    leaveContent,
    addContent,
    editContent,
    removeContent
};

export default contentService;

