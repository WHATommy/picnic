import axios from "axios";
import baseUrl from "../util/baseUrl";
import authHeader from "../util/authHeader";

const searchUsers = async (value) => {
    try {
        const authToken = authHeader();
        const response = await axios
            .get(`${baseUrl}/user/${value}`, { headers: { "token": authToken } });
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

const searchService = { searchUsers }
export default searchService;

