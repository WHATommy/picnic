import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import userService from "../services/userService";
import { setMessage } from "./message";

export const loadUser = createAsyncThunk(
    "user",
    async ({}, thunkAPI) => {
        try {
            const info = await userService.getUser();
            const trips = await userService.getUserTrips();
            const invitations = await userService.getUserInvitations();
            return { info, trips, invitations: invitations.data };
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

const initialState = { info: null, trips: null, invitations: null };

const userSlice = createSlice({
    name: "user",
    initialState,
    extraReducers: {
        [loadUser.fulfilled]: (state, action) => {
            state.info = action.payload.info;
            state.trips = action.payload.trips;
            state.invitations = action.payload.invitations;
        }
    }
});

const { reducer } = userSlice;  
export default reducer;