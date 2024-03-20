import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentListing: null,
};

const listingSlice = createSlice({
  name: "listing",
  initialState,
  reducers: {
    updateListing: (state, action) => {
      state.currentListing = action.payload;
    },
  },
});

export const { updateListing } = listingSlice.actions;

export default listingSlice.reducer;
