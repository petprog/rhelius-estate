import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";
export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
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
          action=""
          className="bg-slate-100 p-3 rounded-lg flex items-center "
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
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
