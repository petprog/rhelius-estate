import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { FaTrash, FaAngleDown, FaAngleRight } from "react-icons/fa";

export default function CreateListing() {
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [loading, setLoading] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleImageSubmit = () => {
    setImageUploadError(null);
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      setImageUploadLoading(true);
      Promise.all(promises)
        .then((urls) => {
          setImageUploadLoading(false);
          setImageUploadError(null);
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
        })
        .catch(() => {
          setImageUploadLoading(false);
          setImageUploadError("Image upload failed (2mb max per image)");
        });
    } else {
      if (!files.length) {
        setImageUploadError("Select an image to upload");
      } else {
        setImageUploadError("You can only upload 6 images per listing");
      }
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, `listings/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleShowOrHideImages = () => {
    setShowImages(!showImages);
  };
  return (
    <main className="p-3 mx-auto max-w-4xl">
      <h1 className="text-3xl font-semibold text-center mt-4 mb-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-7">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            maxLength="62"
            minLength="10"
            className="border p-3 rounded-lg w-full  border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 "
            onChange={handleChange}
            required
          />
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg w-full  border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 "
            onChange={handleChange}
            required
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="border p-3 rounded-lg w-full  border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 "
            onChange={handleChange}
          />
          <div className="flex gap-5 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
              />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
              />
              <span>Parking spot</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
              />
              <span>offer</span>
            </div>
          </div>
          <div className="flex gap-7 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                className="p-2 border borderborder-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 rounded-lg"
                onChange={handleChange}
                required
              />
              <p>Bed</p>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                className="p-2 border borderborder-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 rounded-lg"
                onChange={handleChange}
                required
              />
              <p>Baths</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="10"
                className="p-2 border borderborder-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 rounded-lg"
                onChange={handleChange}
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="disountPrice"
                min="1"
                max="10"
                className="p-2 border border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 rounded-lg"
                onChange={handleChange}
                required
              />
              <div className="flex flex-col items-center">
                <p>Disounted price</p>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex justify-between items-center gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="border border-gray-300 bg-white p-3 rounded w-full"
              type="file"
              id="file"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="bg-transparent border-2 border-green-500 uppercase text-green-500 rounded p-3 hover:shadow-lg disabled:opacity-80 font-semibold"
            >
              Upload
            </button>
          </div>
          {imageUploadError && (
            <p className="text-red-600">{imageUploadError}</p>
          )}
          {imageUploadLoading && <p className="text-green-600">Uploading...</p>}

          <div className="bg-gray-100">
            {formData.imageUrls.length > 0 && (
              <div
                onClick={handleShowOrHideImages}
                className="flex justify-between bg-white p-2"
              >
                <p>
                  {showImages ? "Hide" : "Show"} Uploaded{" "}
                  {formData.imageUrls.length == 1 ? "Image" : "Images"}
                </p>
                {showImages ? (
                  <FaAngleDown className="text-3xl text-gray-500 " />
                ) : (
                  <FaAngleRight className="text-3xl text-gray-500 " />
                )}
              </div>
            )}
            {showImages &&
              formData.imageUrls.map((imageUrl, index) => (
                <div
                  key={imageUrl}
                  className="flex justify-between items-center py-3 px-3  mb-3  rounded"
                >
                  <img
                    src={imageUrl}
                    alt="listing image"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <FaTrash
                    onClick={() => handleDeleteImage(index)}
                    className="text-white font-semibold text-4xl p-2 rounded-lg bg-red-600"
                  >
                    Delete
                  </FaTrash>
                </div>
              ))}
          </div>
          <button
            disabled={loading}
            className="bg-slate-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70"
          >
            {loading ? "Loading..." : "Create Listing"}
          </button>
        </div>
      </form>
    </main>
  );
}
