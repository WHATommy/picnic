import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "./slices/message";
import authReducer from "./slices/auth";
import userReducer from "./slices/user";
import tripReducer from "./slices/trip";
import contentReducer from "./slices/content";
import searchReducer from "./slices/search";

const reducer = {
  auth: authReducer,
  message: messageReducer,
  user: userReducer,
  trip: tripReducer,
  content: contentReducer,
  search: searchReducer
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export default store;