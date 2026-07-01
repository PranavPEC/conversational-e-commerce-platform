import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reduxReducers";

const store = configureStore({
  reducer: rootReducer,
});

export default store;