import { Link } from "react-router-dom";
import { MdLocationOn, MdBathroom, MdBed, MdHome } from "react-icons/md";

export default function ListingTile({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded w-full sm:w-[330px]">
      <Link to={`/listings/${listing._id}`}>
        {listing.imageUrls.length > 0 ? (
          <img
            src={listing.imageUrls[0]}
            alt="listing cover"
            className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <MdHome className=" text-center text-[320px] sm:text-[220px]" />
        )}
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg truncate font-semibold text-slate-700">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 w-full truncate">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <div className="flex items-center gap-4">
            <p className="text-slate-500 text-xl font-semibold">
              $
              {listing.offer
                ? listing.discountPrice
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            {listing.offer && (
              <div className="flex gap-3 items-center">
                <span className="line-through text-gray-400">
                  ${listing.regularPrice.toLocaleString("en-US")}
                </span>
                <p className="bg-green-100 font-semibold text-base text-green-600 p-0.5 rounded">
                  -
                  {Math.floor(
                    ((+listing.regularPrice - +listing.discountPrice) /
                      +listing.regularPrice) *
                      100
                  )}
                  %
                </p>
              </div>
            )}
          </div>
          <div className="text-slate-700 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 whitespace-nowrap ">
              <MdBathroom className="text-lg" />
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap ">
              <MdBed className="text-lg" />
              {listing.bathrooms > 1
                ? `${listing.bathrooms} beds `
                : `${listing.bathrooms} bed `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
