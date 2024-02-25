import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInFalure, signInStart, signInSuccess } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFalure(data.message));
        toast.error("Something went wrong.");
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
      toast.success("Success");
    } catch (error) {
      dispatch(signInFalure(error.message));
      toast.error("Something went wrong.");
    }
  };
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="font-semibold text-center  my-6 text-3xl">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="email" name="email" id="email" placeholder="Email" className="p-3 rounded-lg" onChange={handleChange} />
        <input type="password" name="password" id="password" placeholder="Password" className="p-3 rounded-lg" onChange={handleChange} />
        <button className="p-3 rounded-xl uppercase bg-blue-700 text-white  hover:opacity-95 disabled:opacity-80">Sign In</button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-3">
        <p>Don't have an account?</p>
        <Link to={"/sign-up"}>
          <span className="hover:underline">{loading ? "Loading..." : "Sign Up"}</span>
        </Link>
      </div>
      {error && <p className="text-red-700">{error}</p>}
    </div>
  );
}
