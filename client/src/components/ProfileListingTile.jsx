import { FaTrash, FaRegEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ProfileListingTile({
  listing,
  handleUpdateListing,
  handleDeleteListing,
}) {
  const { _id, imageUrls, name } = listing;
  return (
    <div className="flex items-center justify-between px-3 gap-4">
      <Link to={`/listings/${_id}`} className="flex items-center flex-1">
        <img
          src={imageUrls[0]}
          alt="listing cover"
          className="w-16 h-16 object-contain rounded-lg"
        />
        <p className="text-slate-700 font-semibold hover:underline truncate flex-1">
          {name}
        </p>
      </Link>

      <div className="flex w-20 justify-between ">
        <FaRegEdit
          onClick={() => handleUpdateListing(listing)}
          className="text-white font-semibold text-3xl p-2 rounded-lg bg-green-600"
        >
          Delete
        </FaRegEdit>
        <FaTrash
          onClick={() => handleDeleteListing(_id)}
          className="text-white font-semibold text-3xl p-2 rounded-lg bg-red-600"
        >
          Delete
        </FaTrash>
      </div>
    </div>
  );
}
