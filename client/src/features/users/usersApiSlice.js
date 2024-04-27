import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../redux/api/apiSlice";

const userListingsAdapter = createEntityAdapter({});
const userAdapter = createEntityAdapter({});

const initialUserListingsState = userListingsAdapter.getInitialState();
const initialUserState = userAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserListings: builder.query({
      query: ({ id }) => ({
        url: `user/listings/${id}`,
        validateStatus: (response) => {
          return response.status === 200;
        },
      }),
      transformResponse: (responseData) => {
        const loadedListing = responseData.data.map((listing) => ({
          ...listing,
          id: listing._id,
        }));
        return userListingsAdapter.setAll(
          initialUserListingsState,
          loadedListing
        );
      },
      providesTags: (result) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else {
          return [{ type: "User", id: "LIST" }];
        }
      },
    }),
    getUser: builder.mutation({
      query: ({ id }) => ({
        url: `user/get/${id}`,
      }),
      transformResponse: (responseData) => {
        const loadedUser = { ...responseData.data, id: responseData.data._id };
        return userAdapter.setOne(initialUserState, loadedUser);
      },
    }),
    updateUser: builder.mutation({
      query: ({ userId, ...initialUserData }) => ({
        url: `user/update/${userId}`,
        method: "POST",
        body: initialUserData,
      }),
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `user/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUserListingsQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;

export const selectUserListingsResult =
  usersApiSlice.endpoints.getUserListings.select();

const selectUserListingData = createSelector(
  selectUserListingsResult,
  (usersResult) => usersResult.data
);

export const {
  selectAll: selectAllListings,
  selectById: selectListingById,
  selectIds: selectListingIds,
} = userListingsAdapter.getSelectors(
  (state) => selectUserListingData(state) ?? initialUserListingsState
);

export const selectUserResult = usersApiSlice.endpoints.getUser.select();

const selectUserData = createSelector(
  selectUserResult,
  (userResult) => userResult.data
);

export const { selectById: selectUserById } = userAdapter.getSelectors(
  (state) => selectUserData(state) ?? initialUserState
);
