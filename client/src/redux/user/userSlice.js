import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  updateSuccess: false,
  deleteSuccess: false,
  signOutSuccess: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.error = null;
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.updateSuccess = false;
      state.error = null;
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      state.updateSuccess = true;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.updateSuccess = false;
    },
    deleteUserStart: (state) => {
      state.deleteSuccess = false;
      state.error = null;
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
      state.deleteSuccess = true;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.deleteSuccess = false;
    },
    resetUser: (state) => {
      state.loading = false;
      state.error = null;
      state.updateSuccess = false;
      state.deleteSuccess = false;
      state.signOutSuccess = false;
    },
    signOutStart: (state) => {
      state.signOutSuccess = false;
      state.error = null;
      state.loading = true;
    },
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
      state.signOutSuccess = true;
    },
    signOutFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.signOutSuccess = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  resetUser,
  signOutStart,
  signOutSuccess,
  signOutFailure,
} = userSlice.actions;

export default userSlice.reducer;
