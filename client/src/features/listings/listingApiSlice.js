/* eslint-disable no-unused-vars */
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../redux/api/apiSlice";

const listingsAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = listingsAdapter.getInitialState();

export const listingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListings: builder.query({
      query: () => ({
        url: "listing/get",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedListings = responseData.map((listing) => {
          listing.id = listing._id;
          return listing;
        });
        return listingsAdapter.setAll(initialState, loadedListings);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Listing", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Listing", id })),
          ];
        } else return [{ type: "Listing", id: "LIST" }];
      },
    }),
    getListing: builder.mutation({
      query: ({ id }) => ({
        url: `listing/get/${id}`,
      }),
    }),
    addNewListing: builder.mutation({
      query: (initialListing) => ({
        url: "listing/create",
        method: "POST",
        body: {
          ...initialListing,
        },
      }),
      invalidatesTags: [{ type: "Listing", id: "LIST" }],
    }),
    updateListing: builder.mutation({
      query: (initialListing) => ({
        url: `listing/update/${initialListing.id}`,
        method: "POST",
        body: {
          ...initialListing,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Listing", id: arg.id },
      ],
    }),
    deleteListing: builder.mutation({
      query: ({ id }) => ({
        url: `listing/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Listing", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetListingsQuery,
  useGetListingMutation,
  useAddNewListingMutation,
  useUpdateListingMutation,
  useDeleteListingMutation,
} = listingsApiSlice;

// returns the query result object
export const selectListingsResult =
  listingsApiSlice.endpoints.getListings.select();

// creates memoized selector
const selectListingsData = createSelector(
  selectListingsResult,
  (listingsResult) => listingsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllListings,
  selectIds: selectListingIds,
  // Pass in a selector that returns the listings slice of state
} = listingsAdapter.getSelectors(
  (state) => selectListingsData(state) ?? initialState
);
