import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleSearch = async () => {
    await fetch("/api/listing/get");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, []);

  return (
    <header className="bg-slate-200 shadow-md w-full">
      <div className="flex justify-between items-center max-w-6xl mx-auto py-3 px-4 ">
        {/* Brand name */}
        <Link to="/">
          <h1 className="font-bold text-lg sm:text-xl flex flex-wrap">
            <span className="text-slate-500 text-nowrap">Rhelius</span>
            <span className="text-slate-700 text-nowrap">Estate</span>
          </h1>
        </Link>
        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          action=""
          className="bg-slate-100 p-3 rounded-lg flex items-center "
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className=" flex sm:gap-4 items-center">
          <li className="hidden sm:inline text-slate-700 hover:underline">
            <Link to="/">Home</Link>
          </li>
          <li className=" hidden sm:inline text-slate-700 hover:underline">
            <Link to="/about">About</Link>
          </li>
          {!currentUser && (
            <li className="text-slate-700 hover:underline">
              <Link to="/profile">Login</Link>
            </li>
          )}
          {currentUser && (
            <Link to="/profile">
              {!currentUser.avatar ? (
                <FaUser className="h-5 w-5 self-center text-slate-700" />
              ) : (
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={currentUser.avatar}
                  alt="profile"
                />
              )}
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
