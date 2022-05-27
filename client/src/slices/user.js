import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import userService from "../services/userService";
import { setMessage } from "./message";

export const loadUser = createAsyncThunk(
    "user",
    async ({ token }, thunkAPI) => {
        try {
            const trips = await userService.getUserTrips(token);
            const invitations = await userService.getUserInvitations(token);
            return { trips, invitations };
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

const initialState = { trips: null, invitations: null };

const userSlice = createSlice({
    name: "user",
    initialState,
    extraReducers: {
        [loadUser.fulfilled]: (state, action) => {
            state.trips = action.payload.trips;
            state.invitations = action.payload.invitations;
        }
    }
});

const { reducer } = userSlice;  
export default reducer;