import axios from "axios";
import baseUrl from "../util/baseUrl";

// Register action
const register = (image, username, email, password, confirmPassword) => {
    return axios
        .post(`${baseUrl}/signup`, { image, username, email, password, confirmPassword })
        .then(response => {
            return response.data;
        });
};

// Login action
const login = (email, password) => {
    return axios.post(`${baseUrl}/auth`, { email, password })
    .then(response => {
        return response.data;
    })
};

// Set token
// TODO: Might need to add user redirect after setting token
const setToken = (token) => {
    localStorage.setItem("token", JSON.stringify(token));
}

// Logout
const logout = () => {
    localStorage.removeItem("token");
}

const authService = { register, login, setToken, logout }
export default authService;

