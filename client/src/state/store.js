import { configureStore, combineReducers } from "@reduxjs/toolkit";
import alertSlice from "./alertSlice";
import usersSlice from "./usersSlice";

const rootReducer = combineReducers({
  alerts: alertSlice,
  users: usersSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
