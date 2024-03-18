import { useState } from "react";

export default function CreateListing() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  return (
    <main className="p-3 mx-auto max-w-4xl">
      <h1 className="text-3xl font-semibold text-center mt-4 mb-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-7">
        <div className="flex flex-col gap-4 sm:flex-1">
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
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spot</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
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
                required
              />
              <div className="flex flex-col items-center">
                <p>Disounted price</p>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-1">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex justify-between items-center gap-4">
            <input
              className="border border-gray-300 bg-white p-3 rounded flex-1"
              type="file"
              id="file"
            />
            <button className="bg-transparent border border-green-500 uppercase text-green-500 rounded p-3 hover:shadow-lg disabled:opacity-80">
              Upload
            </button>
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
