import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  console.log(formData.avatar);
  const fileRef = useRef(null);
  // const navigate = useNavigate();
  // const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    // setError(null);
    // try {
    //   const res = await fetch("/api/auth/signup", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   });
    //   const data = await res.json();
    //   console.log(data);
    //   if (data.success) {
    //     navigate("/login");
    //   } else {
    //     throw new Error(data.message);
    //   }
    // } catch (error) {
    //   setError(error.message);
    // }
    // setLoading(false);
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
        (error) => {
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

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={
            formData.avatar
              ? formData.avatar
              : currentUser.avatar
              ? currentUser.avatar
              : ""
          }
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className=" text-red-700">
              Error Image Uploa (image must be less than 2mb)
            </span>
          ) : (
            <span></span>
          )}
          {filePerc > 0 && filePerc < 100 && (
            <span className=" text-slate-700">Uploading {filePerc}% done</span>
          )}
          {filePerc === 100 && (
            <span className="  text-green-700">
              Image successfully uploaded
            </span>
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          value={currentUser.username}
          className="border p-3 rounded-lg w-full  border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 "
          id="email"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="fullname"
          value={currentUser.displayName ?? ""}
          className="border p-3 rounded-lg w-full  border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 "
          id="name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          disabled
          placeholder="email"
          value={currentUser.email}
          className="border p-3 rounded-lg w-full  border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 "
          id="email"
          onChange={handleChange}
          required
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70"
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-5">{error}</p>}
      <button
        disabled={loading}
        className="bg-green-700 w-full text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70 mt-5"
      >
        {loading ? "Loading..." : "Create Listing"}
      </button>
      <div className="flex justify-between mt-3">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
