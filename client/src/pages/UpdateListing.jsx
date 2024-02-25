import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
      }
      setFormData(data);
    };

    fetchListing();
  }, []);

  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload fail(2 MB max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only update max 6 image per listing");
      setUploading(false);
    }
  };

  const storeImage = (file) => {
    return new Promise((resolve, inject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Image upload ${progress} done`);
        },
        (error) => {
          inject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (e.target.type === "text" || e.target.type === "textarea" || e.target.type === "number") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
    if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) return setError("You have must upload at least one image");
      if (formData.regularPrice < formData.discountPrice) return setError("Discount price have must lowwer than regular price");
      setLoading(true);
      setError(false);

      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      navigate(`/listing/${data._id}`);
      toast.success("Update listing successfully!");
      if (data.success === false) {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold my-7 text-center">Create Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-col flex-1 gap-4">
          <input type="text" name="name" id="name" placeholder="Name" className="p-3 border rounded-xl" required minLength={10} maxLength={62} value={formData.name} onChange={handleChange} />
          <textarea type="text" name="description" id="description" placeholder="Description" className="p-3 border rounded-xl" value={formData.description} onChange={handleChange} />

          <input type="text" name="address" id="address" placeholder="Address" className="p-3 border rounded-xl" required value={formData.address} onChange={handleChange} />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" name="sale" id="sale" className="w-5" onChange={handleChange} checked={formData.type === "sale"} />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="rent" className="w-5" id="rent" onChange={handleChange} checked={formData.type === "rent"} />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="parking" id="parking" className="w-5" onChange={handleChange} checked={formData.parking} />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="furnished" id="furnished" className="w-5" onChange={handleChange} checked={formData.furnished} />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="offer" id="offer" className="w-5" onChange={handleChange} checked={formData.offer} />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2 items-center">
              <input className="p-3 border rounded-xl border-gray-300" type="number" name="bedrooms" id="bedrooms" min={1} max={10} required value={formData.bedrooms} onChange={handleChange} />
              <p>Beds</p>
            </div>
            <div className="flex gap-2 items-center">
              <input className="p-3 border rounded-xl border-gray-300" type="number" name="bahtrooms" id="bathrooms" min={1} max={10} required value={formData.bathrooms} onChange={handleChange} />
              <p>Baths</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                className="p-3 border rounded-xl border-gray-300"
                type="number"
                name="regularPrice"
                id="regularPrice"
                min={50}
                max={1000000}
                required
                value={formData.regularPrice}
                onChange={handleChange}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / months)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex gap-2 items-center">
                <input
                  className="p-3 border rounded-xl border-gray-300"
                  type="number"
                  name="discountPrice"
                  id="discountPrice"
                  min={0}
                  max={1000000}
                  required
                  value={formData.discountPrice}
                  onChange={handleChange}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <span className="text-xs">($ / months)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="text-gray-700 font-normal ml-2">The first image will be cover (max 6)</span>
          </p>
          <div className="flex gap-4">
            <input onChange={(e) => setFiles(e.target.files)} type="file" name="images" id="images" accept="image/*" multiple className="p-3 border border-gray-400 rounded" />
            <button type="button" onClick={handleImageSubmit} className="uppercase p-3 border border-green-700 text-green-700 rounded hover:shadow-xl disabled:opacity-80">
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div key={url} className="flex justify-between items-center p-3 rounded-lg border">
                <img src={url} alt="image listing" className="w-20 h-20 object-contain rounded-lg" />
                <button type="button" onClick={() => handleRemoveImage(index)} className="text-red-700 uppercase hover:opacity-75">
                  Delete
                </button>
              </div>
            ))}
          <button disabled={uploading || loading} className="uppercase p-3 bg-slate-700 text-white rounded-xl hover:opacity-95 disabled:opacity-80">
            {loading ? "Updating" : "Update listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
