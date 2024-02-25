import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);
  return (
    <div className="">
      {/* Top */}
      <div className=" max-w-6xl mx-auto py-28 px-3 flex flex-col gap-6">
        <h1 className=" text-4xl text-slate-700 font-bold lg:text-6xl">
          Find your next <span className=" text-slate-500">perfect</span>
          <br />
          palce with ease
        </h1>
        <div className=" text-gray-400 text-xs sm:text-sm">
          Sahand Estate is the nest place to find your next perfect place to lice.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link to={`/search`} className=" text-blue-800 font-bold hover:underline ">
          let's get started...
        </Link>
      </div>
      {/* Swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: "cover" }} key={listing._id} className="h-[550px]"></div>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* Listing results for offer rent and sale*/}
      <div className=" max-w-6xl flex flex-col gap-8 my-10 p-3 mx-auto">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-700">Recent offers</h2>
              <Link to={"/search?offer=true"} className=" text-sm hover:underline text-blue-800">
                Show more offers
              </Link>
            </div>
            <div className="flex gap-4 flex-wrap">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-700">Recent pace for rents</h2>
              <Link to={"/search?type=rent"} className=" text-sm hover:underline text-blue-800">
                Show more place for rents
              </Link>
            </div>
            <div className="flex gap-4 flex-wrap">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
              {saleListings && saleListings.length > 0 && (
                <div className="">
                  <div className="my-3">
                    <h2 className="text-2xl font-semibold text-slate-700">Recent place for sales</h2>
                    <Link to={"/search?type=sale"} className=" text-sm hover:underline text-blue-800">
                      Show more place for sale
                    </Link>
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    {saleListings.map((listing) => (
                      <ListingItem listing={listing} key={listing._id} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
