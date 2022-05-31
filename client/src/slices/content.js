import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import contentService from "../services/contentService";
import { setMessage } from "./message";

export const loadAllContent = createAsyncThunk(
  "allContent",
  async ({ tripId, contentType }, thunkAPI) => {
    try {
        let content;
        switch(contentType) {
            case "event":
                content = await contentService.getAllEvents(tripId);
                break;
            case "housing":
                content = await contentService.getAllHousings(tripId);
                break;
            case "restaurant":
                content = await contentService.getAllRestaurants(tripId);
                break;
            case "attendee":
                content = await contentService.getAllAttendees(tripId);
                break;
            default:
                return thunkAPI.dispatch(emptyContent());
        }
        return { contentType, content };
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

export const loadContentAttendees = createAsyncThunk(
    "contentAttendees",
    async ({ tripId, contentId, contentType }, thunkAPI) => {
        try {
            const attendees = await contentService.getContentAttendees(tripId, contentId, contentType);
            return { attendees };
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

export const emptyContent = createAsyncThunk(
    "emptyContent",
    async ({}, thunkAPI) => {
        return { contentType: null, content: null };
    }
);

// Initial State
const initialState = { 
    contentType: null,
    content: null,
    attendees: null,
};

// Auth Slice
const contentSlice = createSlice({
  name: "content",
  initialState,
  extraReducers: {
    [loadAllContent.fulfilled]: (state, action) => {
        state.contentType = action.payload.contentType;
        state.content = action.payload.content;
    },
    [loadAllContent.rejected]: (state, action) => {
        state.contentType = null;
        state.content = null;
    },
    [emptyContent.fulfilled]: (state, action) => {
        state.contentType = null;
        state.content = null;
    },
    [loadContentAttendees.fulfilled]: (state, action) => {
        state.attendees = action.payload.attendees;
    },
    [loadContentAttendees.rejected]: (state, action) => {
        state.attendees = null;
    }
  }
});

const { reducer } = contentSlice;
export default reducer;