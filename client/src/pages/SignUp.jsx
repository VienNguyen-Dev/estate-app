import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const hanldeChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      toast.success("Create successfully!");
      setLoading(false);
      navigate("/sign-in");
      setError(null);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="font-semibold text-3xl text-center my-6">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input className="p-3 rounded-lg border" type="text" name="username" id="username" placeholder="Username" onChange={hanldeChange} />
        <input className="p-3 rounded-lg border" type="email" name="email" id="email" placeholder="Email" onChange={hanldeChange} />
        <input className="p-3 rounded-lg border" type="password" name="password" id="password" placeholder="Password" onChange={hanldeChange} />
        <button disabled={loading} className="bg-blue-700 rounded-lg p-3 hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-4">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-slate-500 hover:underline">Sign In</span>
        </Link>
      </div>
      <div>{error && <p className="text-red-600">{error}</p>}</div>
    </div>
  );
}
