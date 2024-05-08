import { apiSlice } from "../../redux/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserListings: builder.mutation({
      query: (id) => ({
        url: `user/listings/${id}`,
        validateStatus: (response) => {
          return response.status === 200;
        },
      }),
    }),
    getUser: builder.mutation({
      query: (id) => ({
        url: `user/get/${id}`,
      }),
    }),
    updateUser: builder.mutation({
      query: ({ userId, ...initialUserData }) => ({
        url: `user/update/${userId}`,
        method: "POST",
        body: initialUserData,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `user/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUserListingsMutation,
  useGetUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;
