import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "./slices/message";
import authReducer from "./slices/auth";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    message: messageReducer
  },
});