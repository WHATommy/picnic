import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import authService from "../services/authService";
import { setMessage } from "./message";

const token = localStorage.getItem("token");

// Register Action
export const register = createAsyncThunk(
  "signup",
  async ({ image, username, email, password, confirmPassword }, thunkAPI) => {
    try {
      // Send request to api for user registration
      const response = await authService.register(image, username, email, password, confirmPassword);
      // If response contains errors, set message to errors
      if(response.data.error) {
          thunkAPI.dispatch(setMessage(response.data.error));
          return thunkAPI.rejectWithValue();
      } 
      return authService.setToken(token);
      // Set local storage token to "token" if successful
      localStorage.setItem("token", response.data);
    } catch (error) {
      const message =
        (error.response &&
        error.response.data &&
        error.response.data.error) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
)

// Login Action
export const login = createAsyncThunk(
  "login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await authService.login(email, password);
      // If response contains errors, set message to errors
      console.log(response)
      //return authService.setToken(response);
    } catch (error) {
      console.log(error)
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

// Logout Action
export const logout = createAsyncThunk(
  "logout",
  async () => {
    await authService.logout();
  }
);

// Initial State
const initialState = token ? { isAuthenticated: true, token: token } : { isAuthenticated: false, token: null };

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: {
    [register.fulfilled]: (state, action) => {
      state.isAuthenticated = true;
    },
    [register.rejected]: (state, action) => {
      state.isAuthenticated = false;
    },
    [login.fulfilled]: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload
    },
    [login.rejected]: (state, action) => {
      state.isAuthenticated = false;
      state.token = null;
    },
    [logout.fulfilled]: (state, action) => {
      state.isAuthenticated = false;
      state.token = null;
    }
  }
});

const { reducer } = authSlice;
export default reducer;