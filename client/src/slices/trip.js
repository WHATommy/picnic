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
      const attendingContent = await tripService.getUserAttendingContent(tripId, userId);
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

export const loadPendingAttendees = createAsyncThunk(
  "pendingAttendee",
  async ({ userIds }, thunkAPI) => {
    try {
      const pendingAttendees = await tripService.loadPendingUsers(userIds);
      return { pendingAttendees };
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

export const loadUserRole = createAsyncThunk(
  "userRole",
  async ({ tripId }, thunkAPI) => {
    try {
      const isMod = await tripService.loadRole(tripId);
      return { isMod };
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
  attendeesInfo: null,
  pendingUsers: null,
  personalCost: 0,
  attending: null,
  pendingAttendees: [],
  isMod: false
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
    },
    [loadPendingAttendees.fulfilled]: (state, action) => {
      state.pendingAttendees = action.payload.pendingAttendees;
    },
    [loadPendingAttendees.rejected]: (state, action) => {
      state.pendingAttendees = []
    },
    [loadUserRole.fulfilled]: (state, action) => {
      state.isMod = action.payload.isMod
    },
    [loadUserRole.rejected]: (state, action) => {
      state.isMod = false;
    }
  }
});

const { reducer } = tripSlice;
export default reducer;