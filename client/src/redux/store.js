import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js";
import passwordReducer from "./password/passwordSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    password: passwordReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
