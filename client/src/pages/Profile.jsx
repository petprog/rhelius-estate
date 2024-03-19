import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { app } from "../firebase";
import {
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
} from "../redux/user/userSlice";
import { toggleProfilePassword } from "../redux/password/passwordSlice";
import { Link } from "react-router-dom";
import { FaTrash, FaRegEdit } from "react-icons/fa";

export default function Profile() {
  const { currentUser, loading, error, updateSuccess } = useSelector(
    (state) => state.user
  );
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    dispatch(resetUser());
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        dispatch(updateUserSuccess(data));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
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
    dispatch(deleteUserStart());
    dispatch(resetUser());
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        dispatch(deleteUserSuccess());
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    dispatch(signOutStart());
    dispatch(resetUser());
    try {
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success) {
        dispatch(signOutSuccess());
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleShowListings = async () => {
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
              Error Image Uploa (image must be less than 2mb)
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
          to="/create-listing"
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
      {error && <p className="text-red-500 mt-5">{error}</p>}
      {updateSuccess && (
        <p className="text-green-700 mt-5">User is updated successfully!</p>
      )}
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
      {loadingListings && (
        <div className="h-20 w-full flex items-center justify-center">
          Loading...
        </div>
      )}
      {userListings.length > 0 && (
        <div>
          <h2 className="mt-5 mb-2 text-xl text-center font-semibold">
            Your Listings
          </h2>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="flex items-center justify-between py-3 px-3 mb-3 gap-4"
            >
              <Link
                to={`/listing/${listing._id}`}
                className="flex items-center"
              >
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <p className="font-semibold">{listing.name}</p>
              </Link>

              <div className="flex w-20 justify-between ">
                <FaRegEdit
                  // onClick={() => handleEditListing(listing._id)}
                  className="text-white font-semibold text-4xl p-2 rounded-lg bg-green-600"
                >
                  Delete
                </FaRegEdit>
                <FaTrash
                  // onClick={() => handleDeleteListing(index)}
                  className="text-white font-semibold text-4xl p-2 rounded-lg bg-red-600"
                >
                  Delete
                </FaTrash>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
