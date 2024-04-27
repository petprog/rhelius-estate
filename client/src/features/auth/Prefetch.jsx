import { store } from "../../redux/store";
import { listingsApiSlice } from "../listings/listingApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function Prefetch() {
  useEffect(() => {
    store.dispatch(
      listingsApiSlice.util.prefetch("getListings", "listingsList", {
        force: true,
      })
    );
    store.dispatch(
      usersApiSlice.util.prefetch("getUsers", "usersList", { force: true })
    );
  }, []);

  return <Outlet />;
}
