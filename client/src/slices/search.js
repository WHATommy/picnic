import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";

import searchService from "../services/searchService";

export const isLoading = createAsyncThunk(
    "loading",
    async ({}, thunkAPI) => {
        return true;
    }
);

export const loadSearchResult = createAsyncThunk(
    "loadSearch",
    async ({ value }, thunkAPI) => {
        try {
            await thunkAPI.dispatch(isLoading({}));
            const users = await searchService.searchUsers(value);
            return { users };
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

// Initial State
const initialState = { 
    loading: true,
    users: []
};
  
  // Auth Slice
  const searchSlice = createSlice({
    name: "search",
    initialState,
    extraReducers: {
        [loadSearchResult.fulfilled]: (state, action) => {
            Array.isArray(action.payload.users) ?
                state.users = [...action.payload.users]
            :
                state.users = [];
            state.loading = false;
        },
        [loadSearchResult.rejected]: (state, action) => {
            state.loading = false;
            state.users = [];
        },
        [isLoading.fulfilled]: (state, action) => {
            state.loading = true;
        }
    }
});

const { reducer } = searchSlice;
export default reducer;