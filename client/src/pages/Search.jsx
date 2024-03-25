export default function Search() {
  return (
    <main className="min-h-[calc(100vh-72px)]">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="p-7 max-md:border-b-2 sm:border-r-2 min-h-[calc(100vh-72px)]">
          <form className="flex flex-col gap-7">
            <div className="flex gap-4 items-center">
              <input
                className="
              border p-2 rounded-lg w-full  border-gray-300 outline-none focus:border-slate-700  focus:border-x-2 focus:border-y-2 h-10"
                type="text"
                id="searchTerm"
                placeholder="Search..."
              />
            </div>
            <div className="flex gap-4 flex-wrap items-center">
              <span className="font-medium whitespace-nowrap">Type:</span>
              <div className="flex gap-2 items-center">
                <input type="checkbox" id="all" className="w-4 h-4" />
                <label className="whitespace-nowrap" htmlFor="all">
                  Rent & Sale
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input type="checkbox" id="rent" className="w-4 h-4" />
                <label className="whitespace-nowrap" htmlFor="rent">
                  Rent
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input type="checkbox" id="sale" className="w-4 h-4" />
                <label className="whitespace-nowrap" htmlFor="sale">
                  Sale
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input type="checkbox" id="offer" className="w-4 h-4" />
                <label className="whitespace-nowrap" htmlFor="offer">
                  Offer
                </label>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap items-center">
              <span className="font-medium whitespace-nowrap">Amenities:</span>
              <div className="flex gap-2 items-center">
                <input type="checkbox" id="parking" className="w-4 h-4" />
                <label className="whitespace-nowrap" htmlFor="parking">
                  Parking
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input type="checkbox" id="furnished" className="w-4 h-4" />
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
              <select id="sort_order" className=" p-2 rounded-lg border">
                <option>Price high to low</option>
                <option>Price low to high</option>
                <option>Latest</option>
                <option>Oldest</option>
              </select>
            </div>
            <button className="bg-slate-700 text-white text-center p-2 rounded-lg uppercase hover:opacity-95 disabled:opacity-70">
              Search
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-semibold p-3 text-slate-700">
            Listing Results
          </h2>
        </div>
      </div>
    </main>
  );
}
