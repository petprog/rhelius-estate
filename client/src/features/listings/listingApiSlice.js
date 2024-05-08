/* eslint-disable no-unused-vars */
import { apiSlice } from "../../redux/api/apiSlice";

export const listingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchListings: builder.mutation({
      query: (searchQuery) => ({
        url: `listing/get?${searchQuery}`,
      }),
    }),
    getListing: builder.mutation({
      query: (id) => ({
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
      query: (id) => ({
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
  useSearchListingsMutation,
  useGetListingMutation,
  useAddNewListingMutation,
  useUpdateListingMutation,
  useDeleteListingMutation,
} = listingsApiSlice;
