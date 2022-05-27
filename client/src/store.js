import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "./slices/message";
import authReducer from "./slices/auth";
import userReducer from "./slices/user";

const reducer = {
  auth: authReducer,
  message: messageReducer,
  user: userReducer
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export default store;