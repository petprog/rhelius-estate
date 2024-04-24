import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { app } from "../../firebase";
import {
  updateUserSuccess,
  signOutSuccess,
  deleteUserSuccess,
} from "../../redux/user/userSlice";
import { updateListing } from "../../redux/listing/listingSlice";
import { toggleProfilePassword } from "../../redux/password/passwordSlice";
import { Link, useNavigate } from "react-router-dom";

import ProfileListingLoading from "../../components/ProfileListingLoading";
import ProfileListingTile from "../../components/ProfileListingTile";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";

import { useLogoutMutation } from "../auth/authApiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useInternetStatus from "../../hooks/useInternetStatus";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const { showProfilePassword } = useSelector((state) => state.password);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const fileRef = useRef(null);
  const [showListingsError, setShowListingsError] = useState(null);
  const [loadingListings, setLoadingListings] = useState(false);
  const dispatch = useDispatch();
  const [userListings, setUserListings] = useState([]);
  const navigate = useNavigate();
  const isOnline = useInternetStatus();

  const [updateUser, { isLoading: loading }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [logout] = useLogoutMutation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOnline) {
      toast.error("No Internet", {
        position: "top-right",
      });
      return;
    }
    try {
      const data = await updateUser({
        ...formData,
        userId: currentUser._id,
      }).unwrap();
      dispatch(updateUserSuccess(data));
      toast.success("Profile Updated", {
        position: "top-right",
      });
    } catch (err) {
      console.log(err.data?.message);
      toast.error("Not successful", {
        position: "top-right",
      });
    }
  };

  const togglePasswordVisibility = () => {
    dispatch(toggleProfilePassword());
  };

  const handleFileUpload = (file) => {
    try {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, `avatars/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePerc(Math.round(progress));
        },
        () => {
          setFileUploadError(true);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData({ ...formData, avatar: downloadURL });
        }
      );
    } catch (error) {
      setFileUploadError(true);
    }
  };

  const handleDeleteAccount = async () => {
    if (!isOnline) {
      toast.error("No Internet", {
        position: "top-right",
      });
      return;
    }
    try {
      await deleteUser({
        id: currentUser._id,
      }).unwrap();
      dispatch(deleteUserSuccess());
      toast.success("Account Deleted", {
        position: "top-right",
      });
      navigate("/");
    } catch (err) {
      console.log(err.data?.message);
      toast.error(`Not successful`, {
        position: "top-right",
      });
    }
  };

  const handleSignout = async () => {
    if (!isOnline) {
      toast.error("No Internet", {
        position: "top-right",
      });
      return;
    }
    logout;
    dispatch(signOutSuccess());
    navigate("/");
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleShowListings = async () => {
    setUserListings([]);
    setLoadingListings(true);
    setShowListingsError(null);
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success) {
        setUserListings(data.data);
        setLoadingListings(false);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setShowListingsError(error.message);
      setLoadingListings(false);
    }
  };

  const handleDeleteListing = async (listingId) => {
    setShowListingsError(null);
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setUserListings((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setShowListingsError(error.message);
    }
  };

  const handleUpdateListing = (listing) => {
    dispatch(updateListing(listing));
    navigate(`/listing/${listing._id}`);
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center  mt-4 mb-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          hidden
          accept="image/*"
        />
        {!formData.avatar && !currentUser.avatar ? (
          <FaUser
            onClick={() => fileRef.current.click()}
            className="h-20 w-20 self-center text-slate-700"
          />
        ) : (
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar || ""}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          />
        )}
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Upload (image must be less than 2mb)
            </span>
          ) : null}
          {filePerc > 0 && filePerc < 100 && (
            <span className="text-slate-700">Uploading {filePerc}% done</span>
          )}
          {filePerc === 100 && (
            <span className="text-green-700">Image successfully uploaded</span>
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg w-full  border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 "
          id="username"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="fullname"
          defaultValue={currentUser.displayName || ""}
          className="border p-3 rounded-lg w-full  border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 "
          id="displayName"
          onChange={handleChange}
        />
        <input
          type="email"
          disabled
          placeholder="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg w-full  border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 "
          id="email"
          onChange={handleChange}
        />
        <div className="relative">
          <input
            type={showProfilePassword ? "text" : "password"}
            placeholder="password"
            className="border p-3 rounded-lg w-full  border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 "
            id="password"
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-600"
            onClick={togglePasswordVisibility}
          >
            {showProfilePassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button
          disabled={loading}
          className="bg-slate-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          disabled={loading}
          className="bg-green-700  text-white text-center p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70"
          to="/listing/new"
        >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-3 font-semibold">
        <span
          onClick={handleDeleteAccount}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignout} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>

      <button
        type="button"
        onClick={handleShowListings}
        className="text-green-700 mt-2 font-semibold w-full"
      >
        Show Listings
      </button>
      {showListingsError && (
        <p className="text-red-500 mt-5">{showListingsError}</p>
      )}
      {loadingListings && <ProfileListingLoading />}
      {userListings.length > 0 && (
        <div>
          <h2 className="mt-5 mb-2 text-xl text-center font-semibold">
            Your Listings
          </h2>
          {userListings.map((listing) => (
            <ProfileListingTile
              key={listing._id}
              listing={listing}
              handleUpdateListing={handleUpdateListing}
              handleDeleteListing={handleDeleteListing}
            />
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
