import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const searchTermFromUrl = urlParams.get("searchTerm");

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl p-3 mx-auto">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Sahand</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className="bg-slate-100 rounded-lg flex items-center p-3">
          <input type="text" placeholder="Search..." className="bg-transparent focus:outline-none w-24 sm:w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button>
            <FaSearch />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="text-slate-700 hover:underline hidden sm:inline">Home</li>
          </Link>
          <Link to="/about">
            <li className="text-slate-700 hover:underline hidden sm:inline">About</li>
          </Link>
          <Link to="/profile">
            {currentUser ? <img className="rounded-full w-7 h-7 object-cover" src={currentUser.avatar} alt="profile" /> : <li className="text-slate-700 hover:underline hidden sm:inline">Sign In</li>}
          </Link>
        </ul>
      </div>
    </header>
  );
}
