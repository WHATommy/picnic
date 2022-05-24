import axios from "axios";
import baseUrl from "../../../server/util/baseUrl";

// Register action
const register = (image, username, email, password, confirmPassword) => {
    return axios
        .post(`${baseUrl}/signup`, { image, username, email, password, confirmPassword })
        .then(response => {
            if(!response.data) {
                console.log("Register API failed")
            }
            setToken(response.data);
        })
        .error(err => {
            console.log(err);
        });

};

// Login action
const login = (email, password) => {
    return axios.post(`${baseUrl}/auth`, { email, password })
    .then(response => {
        if(!response.data) {
            console.log("Register API failed")
        }
        setToken(response.data);
    })
    .error(err => {
        console.log(err);
    });
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

const authService = { register, login, logout }
export default authService;

