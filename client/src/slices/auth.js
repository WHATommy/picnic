import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import authService from "../services/authService";
import { setMessage } from "./message";

const token = localStorage.getItem("token");

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
            // Set local storage token to "token" if successful
            localStorage.setItem("token", response.data);
        } catch (error) {
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
)

export const login = createAsyncThunk(
    "login",
    async ({ email, password }, thunkAPI) => {
      try {
        const response = await authService.login(email, password);
        // Set local storage token to "token" if successful
        localStorage.setItem("token", response.data);
      } catch (error) {
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