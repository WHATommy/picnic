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
      console.log(response)
      return authService.setToken(response);
    } catch (error) {
      const message = error.response.data
      console.log(message)
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
      return authService.setToken(response);
    } catch (error) {
      const message = error.response.data
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