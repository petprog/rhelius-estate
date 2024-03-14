import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showPassword: false,
};

const passwordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {
    togglePassword: (state) => {
      state.showPassword = !state.showPassword;
    },
  },
});

export const { togglePassword } = passwordSlice.actions;

export default passwordSlice.reducer;
