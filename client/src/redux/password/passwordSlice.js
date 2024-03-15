import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showLoginPassword: false,
  showSignUpPassword: false,
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
  },
});

export const { toggleLoginPassword, toggleSignUpPassword } =
  passwordSlice.actions;

export default passwordSlice.reducer;
