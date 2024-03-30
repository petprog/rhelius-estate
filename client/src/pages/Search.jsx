import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListingLoading from "../components/ListingLoading";
import ListingTile from "../components/ListingTile";

export default function Search() {
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [, setError] = useState(null);
  const [filter, setFilter] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const limit = 9;

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, [e.target.id]: e.target.value });
    }
    if (
      e.target.id === "all" ||
      e.target.id === "sale" ||
      e.target.id === "rent"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    try {
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const resultData = await res.json();
      const data = resultData.data;
      if (data.length < limit) {
        setShowMore(false);
      } else {
        setShowMore(true);
      }
      setListings([...listings, ...data]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const offerFromUrl = urlParams.get("offer");
    const furnishedFromUrl = urlParams.get("furnished");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      sortFromUrl ||
      orderFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      setShowMore(false);
      try {
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.data.length >= limit) {
          setShowMore(true);
        }
        setError(null);
        setListings(data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    };

    fetchListings();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <div className=" min-h-[calc(100vh-72px)] flex flex-col gap-4 md:flex-row">
      {filter && (
        <aside className="p-7 max-md:border-b-2 sm:border-r-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            <div className="flex gap-4 items-center">
              <input
                className="
              border p-2 rounded-lg w-full  border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 h-10"
                type="text"
                id="searchTerm"
                placeholder="Search..."
                value={sidebarData.searchTerm}
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-4 flex-wrap items-center">
              <span className="font-medium whitespace-nowrap">Type:</span>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="all"
                  className="w-4 h-4"
                  onChange={handleChange}
                  checked={sidebarData.type === "all"}
                />
                <label className="whitespace-nowrap" htmlFor="all">
                  Rent & Sale
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-4 h-4"
                  checked={sidebarData.type === "rent"}
                  onChange={handleChange}
                />
                <label className="whitespace-nowrap" htmlFor="rent">
                  Rent
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-4 h-4"
                  checked={sidebarData.type === "sale"}
                  onChange={handleChange}
                />
                <label className="whitespace-nowrap" htmlFor="sale">
                  Sale
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-4 h-4"
                  checked={sidebarData.offer}
                  onChange={handleChange}
                />
                <label className="whitespace-nowrap" htmlFor="offer">
                  Offer
                </label>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap items-center">
              <span className="font-medium whitespace-nowrap">Amenities:</span>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-4 h-4"
                  checked={sidebarData.parking}
                  onChange={handleChange}
                />
                <label className="whitespace-nowrap" htmlFor="parking">
                  Parking
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-4 h-4"
                  checked={sidebarData.furnished}
                  onChange={handleChange}
                />
                <label className="whitespace-nowrap" htmlFor="furnished">
                  Furnished
                </label>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap items-center">
              <label
                htmlFor="sort_order"
                className="font-medium whitespace-nowrap"
              >
                Sort:
              </label>
              <select
                id="sort_order"
                className=" p-2 rounded-lg border"
                value={`${sidebarData.sort}_${sidebarData.order}`}
                onChange={handleChange}
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>
            <button className="bg-slate-700 text-white text-center p-2 rounded-lg uppercase hover:opacity-95 disabled:opacity-70">
              Search
            </button>
          </form>
        </aside>
      )}
      <main className="flex-1">
        <div className="flex justify-end p-3">
          {/* filter */}
          <button
            onClick={() => setFilter(!filter)}
            className="bg-slate-700 text-white text-center p-2 w-40 rounded-lg uppercase hover:opacity-95 disabled:opacity-70"
          >
            Filter
          </button>
        </div>

        <>
          {loading && <ListingLoading />}
          {!loading && listings.length === 0 && (
            <div className="">
              <p className="text-xl text-slate-700 text-center mt-16">
                No Listing found!
              </p>
            </div>
          )}
          <div className="p-7 flex flex-col gap-2">
            <div className="flex flex-wrap gap-4">
              {!loading &&
                listings.length > 0 &&
                listings.map((listing) => (
                  <ListingTile key={listing._id} listing={listing} />
                ))}
            </div>
            {showMore && (
              <button
                onClick={onShowMoreClick}
                className="text-green-700 hover:underline text-center w-full"
              >
                Show more
              </button>
            )}
          </div>
        </>
      </main>
    </div>
  );
}
