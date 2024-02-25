import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

export default function Listing() {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [listing, setListing] = useState(null);
  const [copied, setCopied] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    SwiperCore.use([Navigation]);
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);
  return (
    <main>
      {loading && <p className="text-center text-2xl py-7">Loading...</p>}
      {error && <p className="text-center py-7 text-2xl">Something went wrong!</p>}
      {listing && !loading && !error && (
        <div className="">
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div className="h-[550px]" style={{ background: `url(${url}) center no-repeat`, backgroundSize: "cover" }}></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed z-10 top-[13%] right-[3%] cursor-pointer rounded-full bg-slate-100 w-12 h-12 flex items-center justify-center">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
            {copied && <p className=" z-10 fixed top-[23%] right-[5%] rounded-md bg-slate-100 p-2">Link copied!</p>}
          </div>
          <div className="max-w-4xl mx-auto my-7 flex flex-col gap-4 p-3">
            <p className="text-2xl font-semibold">
              {listing.name} - $ {listing.offer ? `${listing.discountPrice.toLocaleString("en-Us")}` : `${listing.regularPrice.toLocaleString("en-Us")}`}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center gap-1 text-slate-700 mt-6 text-sm">
              <FaMapMarkerAlt className="text-green-900" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 p-1 text-white text-center rounded-md w-full max-w-[200px]">{listing.type === "rent" ? "For rent" : "For sale"}</p>
              {listing.offer && (
                <p className="bg-green-900 p-1 rounded-md text-white text-center w-full max-w-[200px]">${(+listing.regularPrice - +listing.discountPrice).toLocaleString("en-Us")} OFF</p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 flex gap-4 sm:gap-6 text-sm font-semibold">
              <li className=" flex gap-1 whitespace-nowrap items-center">
                <FaBed className="text-sm" />
                {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
              </li>
              <li className=" flex gap-1 whitespace-nowrap items-center">
                <FaBath className="text-sm" />
                {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
              </li>
              <li className=" flex gap-1 whitespace-nowrap items-center">
                <FaParking className="text-sm" />
                {listing.parking ? `Parking spot` : `No parking`}
              </li>
              <li className=" flex gap-1 whitespace-nowrap items-center">
                <FaChair className="text-sm" />
                {listing.furnished ? `Furnished` : `Unfurnished`}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => {
                  setContact(true);
                }}
                className="uppercase p-3 bg-slate-700 text-white rounded-lg hover:opacity-95"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
