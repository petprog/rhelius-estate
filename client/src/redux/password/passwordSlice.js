import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showLoginPassword: false,
  showSignUpPassword: false,
  showProfilePassword: false,
};

const passwordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {
    toggleLoginPassword: (state) => {
      state.showLoginPassword = !state.showLoginPassword;
    },
    toggleSignUpPassword: (state) => {
      state.showSignUpPassword = !state.showSignUpPassword;
    },
    toggleProfilePassword: (state) => {
      state.showProfilePassword = !state.showProfilePassword;
    },
  },
});

export const {
  toggleLoginPassword,
  toggleSignUpPassword,
  toggleProfilePassword,
} = passwordSlice.actions;

export default passwordSlice.reducer;
