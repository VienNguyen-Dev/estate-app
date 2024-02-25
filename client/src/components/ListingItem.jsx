import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  return (
    <div
      className="bg-white shadow-md sm:shadow-lg rounded-lg transition-shadow sm:w-[270px] overflow-hidden
    "
    >
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0] || "https://img.indiafilings.com/learn/wp-content/uploads/2015/10/12011006/Real-Estate-Agent-Business-India.jpg"}
          alt="listings cover"
          className="h-[320px] sm:h-[220px] object-cover w-full hover:scale-105 transition-scale duration-300"
        />
        <div className="flex flex-col gap-2 p-3 w-full">
          <p className=" font-semibold text-slate-700 text-lg truncate">{listing.name}</p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="text-green-900 w-4 h-4" />
            <p className="text-sm text-gray-600 truncate w-full">{listing.address}</p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 ">{listing.description}</p>
          <p className="font-semibold text-slate-500 mt-2">
            ${listing.offer ? `${listing.discountPrice.toLocaleString("en-Us")}` : `${listing.regularPrice.toLocaleString("en-Us")}`} {listing.type === "rent" && " / month"}
          </p>
          <div className="flex gap-4 text-slate-700">
            <p className="text-xs font-bold ">{listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}</p>
            <p className="text-xs font-bold ">{listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
