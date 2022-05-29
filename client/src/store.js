import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "./slices/message";
import authReducer from "./slices/auth";
import userReducer from "./slices/user";
import tripReducer from "./slices/trip";

const reducer = {
  auth: authReducer,
  message: messageReducer,
  user: userReducer,
  trip: tripReducer
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export default store;