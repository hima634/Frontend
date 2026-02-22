import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { State, City } from "country-state-city";
import api from "../api/api";
import {
  FaCloudUploadAlt,
  FaTimes,
  FaInfoCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import LocationSelector from "@/components/UI/LocationSelector";

const MAX_IMAGES = 8;

const PostItem = () => {
  const { slugCategory, slugItem } = useParams();

  // ----------------------------
  // STATES
  // ----------------------------
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate=useNavigate();
  // Price Type Selector
  const [priceType, setPriceType] = useState("day");
  const [locationData,setLocationData]=useState();

   
  

  // ----------------------------
  // IMAGE HANDLING
  // ----------------------------
  const handleImageChange = (e) => {
    setErrorMsg("");

    const files = Array.from(e.target.files);

    if (images.length + files.length > MAX_IMAGES) {
      console.log("Max 8 images allowed");
      setErrorMsg("❌ You can upload maximum 8 images only.");
      return;
    }

    const previews = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (id) => {
    const img = images.find((i) => i.id === id);
    if (img) URL.revokeObjectURL(img.url);

    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  // ----------------------------
  // CLOUDINARY UPLOAD
  // ---------------------------

const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "rentImage");
  data.append("folder", "RENT_APP/Items");

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dir3lrclx/image/upload",
      data
    );

    return {
      url: res.data.secure_url,
      public_id: res.data.public_id,
    };
  } catch (error) {
    console.log("Cloudinary Upload Error:", error);
    throw error;
  }
};

  // ----------------------------
  // SUBMIT FORM
  // ----------------------------
  const handleFormSubmit = async (e) => {
    
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");

    if (images.length === 0) {
      setErrorMsg("❌ Please upload at least one image.");
      return;
    }
   
    if (!locationData.city || !locationData.zipcode) {
      setErrorMsg("❌ Please fill location details.");
      return;
    }

    setLoading(true);

    try {
      // Upload Images
      const uploads = await Promise.all(
        images.map((img) => uploadToCloudinary(img.file))
      );


      // Payload
      const payload = {
        title: e.target.title.value,
        description: e.target.description.value,

        price: {
          amount: e.target.price.value,
          type: priceType, // hour/day/week
        },

        category: slugCategory,
        subItem: slugItem,

        images: uploads,

        location: {
          state: locationData.state,
          stateCode:locationData.stateCode,
          city: locationData.city,
          zipcode: locationData.zipcode,
          neighbourhood: locationData.neighbourhood,
          lat:locationData.lat,
          lng:locationData.lng
        },
      };
      

     
      try {
        const res = await api.post("/item/add-item", payload);
        setSuccessMsg("✅ Item Posted Successfully!");

          navigate('/');

      } catch (err) {
        console.log("POST ITEM ERROR:", err.response?.data || err.message);
      }

      // Reset
      setImages([]);
      setLocationData({
        stateCode: "",
        city: "",
        zipcode: "",
        neighbourhood: "",
      });

      setShowLocationFields(false);
      e.target.reset();
    } catch (err) {
      console.log("POST ITEM ERROR:", err);
      setErrorMsg("❌ Something went wrong while posting item.");
    } finally {
      setLoading(false);
    }
  };
  // console.log(locationData)
  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <form
        onSubmit={handleFormSubmit}
        className="max-w-3xl mx-auto mt-8 px-4"
      >
        <h1 className="text-2xl font-bold mb-6">Post Your Rental Item</h1>

        {/* Messages */}
        {errorMsg && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {errorMsg}
          </p>
        )}

        {successMsg && (
          <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
            {successMsg}
          </p>
        )}

        <div className="bg-white rounded-2xl shadow border p-6 space-y-8">
          {/* Upload */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Upload Photos</h2>
            <p className="text-sm text-gray-500 flex items-center gap-2 mb-4">
              <FaInfoCircle /> Max 8 Images
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img) => (
                <div key={img.id} className="relative aspect-square">
                  <img
                    src={img.url}
                    className="w-full h-full object-cover rounded-lg"
                    alt=""
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}

              {images.length < MAX_IMAGES && (
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500">
                  <FaCloudUploadAlt className="text-2xl text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {images.length} / 8
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </section>

          {/* Item Details */}
          <section className="space-y-4">
            <input
              name="title"
              placeholder="Item Title"
              className="w-full p-3 border rounded-lg"
              required
            />

            <textarea
              name="description"
              placeholder="Item Description"
              rows="4"
              className="w-full p-3 border rounded-lg"
              required
            />

            {/* Price + Selector */}
            <div className="flex gap-3">
              <input
                name="price"
                type="number"
                placeholder="Price"
                className="w-full p-3 border rounded-lg"
                required
              />

              <select
                value={priceType}
                onChange={(e) => setPriceType(e.target.value)}
                className="p-3 border rounded-lg"
              >
                <option value="hour">Per Hour</option>
                <option value="day">Per Day</option>
                <option value="week">Per Week</option>
                <option value="month">Per Month</option>
              </select>
            </div>
          </section>

          {/* Location */}
          <LocationSelector
          onLocationChange={(loc) => {
           setLocationData(loc);
          }}
        />
          {/* Submit */}
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostItem;
