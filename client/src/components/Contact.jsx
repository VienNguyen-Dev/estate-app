import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [messgae, setMessgae] = useState("");
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    console.log(landlord);
    fetchLandlord();
  }, [listing.userRef]);

  const onChange = (e) => {
    setMessgae(e.target.value);
  };
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p className="">
            Contact <span className="font-semibold">{landlord.username}</span> for <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea className="w-full rounded-lg border p-3" name="message" id="message" rows="2" placeholder="Enter your message here..." onChange={onChange} value={messgae}></textarea>
          <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${messgae}`} className="p-3 rounded-lg bg-slate-700 text-white text-center uppercase hover:opacity-95">
            Send message
          </Link>
        </div>
      )}
    </>
  );
}
