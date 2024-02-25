import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "create_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setshowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
      setSidebardata({
        ...sidebardata,
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "create_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      const urlParams = new URLSearchParams(location.search);
      const searchQuery = urlParams.toString();
      setLoading(true);
      setshowMore(false);
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setshowMore(true);
      } else {
        setshowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);
  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (e.target.id === "all" || e.target.id === "rent" || e.target.id === "sale") {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
      setSidebardata({ ...sidebardata, [e.target.id]: e.target.checked || e.target.checked === "true" ? true : false });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "create_at";
      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const urlParams = new URLSearchParams(location.search);
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();

    if (data.length < 9) {
      setshowMore(false);
      setListings([...listings, ...data]);
    }
  };
  return (
    <div className=" flex flex-col md:flex-row gap-2">
      <div className="flex flex-col border-b-2 md:border-r-2 md:min-h-screen p-7">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className=" font-semibold whitespace-nowrap">Search term:</label>
            <input type="text" name="searchTerm" id="searchTerm" placeholder="Search..." className="p-3 rounded-lg border" value={sidebardata.searchTerm} onChange={handleChange} />
          </div>
          <div className=" flex flex-wrap items-center gap-2">
            <label className=" font-semibold">Type:</label>
            <div className="flex gap-2">
              <input type="checkbox" name="all" id="all" className="w-5" checked={sidebardata.type === "all"} onChange={handleChange} />
              <span>Rent & Sale </span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="rent" id="rent" className="w-5" checked={sidebardata.type === "rent"} onChange={handleChange} />
              <span>Rent </span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="sale" id="sale" className="w-5" checked={sidebardata.type === "sale"} onChange={handleChange} />
              <span>Sale </span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="offer" id="offer" className="w-5" checked={sidebardata.offer} onChange={handleChange} />
              <span>Offer </span>
            </div>
          </div>
          <div className=" flex flex-wrap items-center gap-2">
            <label className=" font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input type="checkbox" name="parking" id="parking" className="w-5" checked={sidebardata.parking} onChange={handleChange} />
              <span>Parking </span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="furnished" id="furnished" className="w-5" checked={sidebardata.furnished} onChange={handleChange} />
              <span>Furnished </span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <label className=" font-semibold">Sort: </label>
            <select name="sort_order" id="sort_order" defaultValue={"create_at_desc"} className="p-3 rounded-lg border" onChange={handleChange}>
              <option value={"regularPrice_desc"}>Price hight to low</option>
              <option value={"regularPrice_asc"}>Price low to hight</option>
              <option value={"createAt_desc"}>Lastest</option>
              <option value={"CreateAt_asc"}>Oldest</option>
            </select>
          </div>
          <button className=" uppercase rounded-lg bg-slate-700 hover:opacity-95 text-white p-3">Search</button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold rounded-lg border p-3 mt-5">Listing Result: </h1>
        <div className="flex flex-wrap gap-4 p-7">
          {!loading && listings.length === 0 && <p className="text-xl text-slate-700">No listings found!</p>}
          {loading && <p className=" text-center text-xl  text-slate-700 w-full">Loading...</p>}
          {!loading && listings && listings.map((listing) => <ListingItem key={listing._id} listing={listing} />)}
          {showMore && (
            <button onClick={onShowMoreClick} className="text-green-700 text-center hover:underline w-full">
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
