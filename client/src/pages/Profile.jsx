import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { deleteUserSuccess, deleteUserfailure, signOutUserFalure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  console.log(file);
  console.log(filePerc);
  console.log(fileUploadError);
  console.log(formData);
  console.log(currentUser);

  useEffect(() => {
    if (file) {
      handleUploadFile(file);
    }
  }, [file]);

  const handleUploadFile = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setUpdateSuccess(false);
        return;
      }
      dispatch(updateUserSuccess(data));
      toast.success("Update user successfully!");
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error("Something went wrong");
      setUpdateSuccess(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserfailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
      toast.success("User have been deleted!");
    } catch (error) {
      dispatch(deleteUserfailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFalure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      toast.success("User have been logged out!");
    } catch (error) {
      dispatch(signOutUserFalure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
      }
      setUserListings(data);
      setShowListingsError(false);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="mx-auto p-3 max-w-xl">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="Profile" className="rounded-full w-24 h-24 object-cover self-center cursor-pointer" />
        <p className="font-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error image upload (File upoad must be less than 2MB)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image upload successfuly!</span>
          ) : (
            ""
          )}
        </p>
        <input type="text" placeholder="Username" id="username" className="rounded-xl p-3" defaultValue={currentUser.username} onChange={handleChange} />
        <input type="email" placeholder="Email" id="email" className="rounded-xl p-3" defaultValue={currentUser.email} onChange={handleChange} />
        <input type="password" placeholder="Password" id="password" className="rounded-xl p-3" onChange={handleChange} />
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-xl hover:opacity-95 disabled:opacity-80 uppercase">
          {loading ? "Loading" : "Update"}
        </button>
        <Link className="p-3 bg-green-700 text-white text-center uppercase hover:opacity-95" to={"/create-listing"}>
          Create listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <div>
        <p className="text-red-700 mt-5">{error ? error : ""}</p>
        <p className="text-green-700">{updateSuccess ? "User update successfuly" : ""}</p>
      </div>
      <button onClick={handleShowListings} className="text-green-700 w-full hover:underline">
        Show listings
      </button>
      <p>{showListingsError ? "Error show listing" : ""}</p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-3xl mt-3">Your listing</h1>
          {userListings.map((listing) => (
            <div key={listing._id} className="flex justify-between gap-4 rounded-lg border p-3 items-center">
              <Link to={`/listing/${listing._id}`} className="w-16 h-16 object-contain rounded-lg">
                <img src={listing.imageUrls[0]} alt="user listing" />
              </Link>
              <Link to={`/listing/${listing._id}`} className="font-semibold text-xl hover:underline">
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button onClick={() => handleListingDelete(listing._id)} type="button" className="text-red-700 uppercase hover:underline">
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase hover:underline">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
