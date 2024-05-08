import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { FaTrash, FaAngleDown, FaAngleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetListingMutation,
  useAddNewListingMutation,
  useUpdateListingMutation,
} from "./listingApiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useInternetStatus from "../../hooks/useInternetStatus";

export default function CreateOrUpdateListing() {
  const navigate = useNavigate();
  const params = useParams();
  const isOnline = useInternetStatus();

  const [addNewListing, { isLoading: loading }] = useAddNewListingMutation();
  const [getListing] = useGetListingMutation();
  const [updateListing, { isLoading: updateLoading }] =
    useUpdateListingMutation();

  const { currentUser } = useSelector((state) => state.user);
  const isNewListing = params.listingId === "new";
  const [validPath, setValidPath] = useState(isNewListing);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [success, setSuccess] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [rent, setRent] = useState(true);

  useEffect(() => {
    const fetchingListing = async () => {
      const listingId = params.listingId;
      try {
        const result = await getListing(listingId);
        const data = result.data.data;
        if (data.userRef === currentUser._id) {
          setValidPath(true);
          setFormData(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (!isNewListing) {
      fetchingListing();
    }
  }, [isNewListing, params.listingId, currentUser._id, getListing]);

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setRent(e.target.id === "rent");
      setFormData({ ...formData, type: e.target.id });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleImagesUpload = () => {
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

  const handleListing = async (isNewListing, listingId) => {
    setSuccess(false);
    if (!isOnline) {
      toast.error("No Internet", {
        position: "top-right",
      });
      return;
    }
    try {
      if (formData.imageUrls.length === 0) {
        toast.error(`Upload an image`, {
          position: "top-right",
        });
        return;
      }
      if (+formData.regularPrice < +formData.discountPrice) {
        toast.error(`Discount price must be lower than regular price`, {
          position: "top-right",
        });
        return;
      }

      if (isNewListing) {
        const data = await addNewListing({
          ...formData,
          userRef: currentUser._id,
        }).unwrap();
        navigate(`/listings/${data.data._id}`);
      } else {
        await updateListing({
          ...formData,
          id: listingId,
        }).unwrap();
        navigate(`/profile`);
      }
    } catch (error) {
      console.log(error.data?.message);
      toast.error(`Not successful`, {
        position: "top-right",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleListing(isNewListing, params.listingId);
  };

  return (
    <>
      {validPath && (
        <main className="p-3 mx-auto max-w-4xl">
          <h1 className="text-3xl font-semibold text-center mt-4 mb-7">
            {isNewListing ? "Create" : "Update"} Listing
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-7"
          >
            <div className="flex flex-col gap-4 flex-1">
              <input
                type="text"
                id="name"
                placeholder="Name"
                maxLength="62"
                minLength="10"
                className="border p-3 rounded-lg w-full  border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 "
                onChange={handleChange}
                value={formData.name}
                required
              />
              <textarea
                type="text"
                id="description"
                placeholder="Description"
                className="border p-3 rounded-lg w-full  border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 "
                onChange={handleChange}
                value={formData.description}
                required
              />
              <input
                type="text"
                id="address"
                placeholder="Address"
                className="border p-3 rounded-lg w-full  border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 "
                onChange={handleChange}
                value={formData.address}
              />
              <div className="flex gap-5 flex-wrap">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="sale"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.type === "sale"}
                  />
                  <span>Sell</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="rent"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.type === "rent"}
                  />
                  <span>Rent</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="parking"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.parking}
                  />
                  <span>Parking spot</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="furnished"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.furnished}
                  />
                  <span>Furnished</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="offer"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.offer}
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
                    value={formData.bedrooms}
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
                    value={formData.bathrooms}
                    required
                  />
                  <p>Baths</p>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    id="regularPrice"
                    min="50"
                    max="1000000"
                    className="p-2 border borderborder-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 rounded-lg"
                    onChange={handleChange}
                    required
                    value={formData.regularPrice}
                  />
                  <div className="flex flex-col items-center">
                    <p>Regular price</p>
                    {rent && <span className="text-xs">($ / Month)</span>}
                  </div>
                </div>
                {formData.offer && (
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      id="discountPrice"
                      min="0"
                      max={formData.regularPrice}
                      className="p-2 border border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 rounded-lg"
                      onChange={handleChange}
                      required
                      value={formData.discountPrice}
                    />
                    <div className="flex flex-col items-center">
                      <p>Disounted price</p>
                      {rent && <span className="text-xs">($ / Month)</span>}
                    </div>
                  </div>
                )}
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
                  disabled={loading || imageUploadLoading}
                  type="button"
                  onClick={handleImagesUpload}
                  className="bg-transparent border-2 border-green-500 uppercase text-green-500 rounded p-3 hover:shadow-lg disabled:opacity-80 font-semibold"
                >
                  Upload
                </button>
              </div>
              {imageUploadError && (
                <p className="text-red-600">{imageUploadError}</p>
              )}
              {imageUploadLoading && (
                <p className="text-green-600">Uploading...</p>
              )}

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
                disabled={loading || updateLoading || imageUploadLoading}
                className="bg-slate-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70"
              >
                {loading || updateLoading
                  ? "Loading..."
                  : isNewListing
                  ? "Create Listing"
                  : "Update Listing"}
              </button>
              {success && (
                <p className="text-green-700 mt-2">
                  A listing is added successfully!
                </p>
              )}
            </div>
          </form>
          <ToastContainer />
        </main>
      )}
    </>
  );
}
