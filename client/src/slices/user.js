import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setTrips: (state, action) => {
            return { trips: action.payload };
        },
        setInvitations: (state, action) => {
            return { invitiation: action.payload };
        },
    },
});

const { reducer, actions } = userSlice;

export const { setTrips, setInvitations } = actions;
export default reducer;