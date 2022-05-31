import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import tripService from "../services/tripService";
import { setMessage } from "./message";

export const loadTrip = createAsyncThunk(
  "trip",
  async ({ tripId }, thunkAPI) => {
    try {
      const trip = await tripService.getTrip(tripId);
      return { trip }
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

export const loadPersonalCost = createAsyncThunk(
  "personalCost",
  async ({ tripId, userId }, thunkAPI) => {
    try {
      const personalCost = await tripService.getPersonalCost(tripId, userId);
      return { personalCost };
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

export const loadAttendingContent = createAsyncThunk(
  "contentAttendee",
  async ({ tripId, userId }, thunkAPI) => {
    try {
      const attendingContent = await tripService.getAttendingContent(tripId, userId);
      return { attendingContent };
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

// Initial State
const initialState = { 
  _id: null,
  icon: null,
  owner: null,
  name: null,
  location: null,
  startDate: null,
  endDate: null,
  cost: null,
  events: null,
  restaurants: null,
  housings: null,
  attendees: null,
  pendingUsers: null,
  personalCost: 0,
  attending: null
};

// Auth Slice
const tripSlice = createSlice({
  name: "trip",
  initialState,
  extraReducers: {
    [loadTrip.fulfilled]: (state, action) => {
      state._id = action.payload.trip._id;
      state.icon = action.payload.trip.icon;
      state.owner = action.payload.trip.owner;
      state.name = action.payload.trip.name;
      state.location = action.payload.trip.location;
      state.startDate = action.payload.trip.startDate;
      state.endDate = action.payload.trip.endDate;
      state.cost = action.payload.trip.cost;
      state.events = action.payload.trip.events;
      state.restaurants = action.payload.trip.restaurants;
      state.housings = action.payload.trip.housings;
      state.attendees = action.payload.trip.attendees;
      state.pendingUsers = action.payload.trip.pendingUsers;
    },
    [loadTrip.rejected]: (state, action) => {
      state._id = null;
      state.icon = null;
      state.owner = null;
      state.name = null;
      state.location = null;
      state.startDate = null;
      state.endDate = null;
      state.cost = null;
      state.events = null;
      state.restaurants = null;
      state.housings = null;
      state.attendees = null;
      state.pendingUsers = null;
    },
    [loadPersonalCost.fulfilled]: (state, action) => {
      state.personalCost = action.payload.personalCost;
    },
    [loadPersonalCost.rejected]: (state, action) => {
      state.personalCost = 0;
    },
    [loadAttendingContent.fulfilled]: (state, action) => {
      state.attending = action.payload.attendingContent;
    },
    [loadAttendingContent.rejected]: (state, action) => {
      state.attending = null;
    }
  }
});

const { reducer } = tripSlice;
export default reducer;