import { useEffect, useState } from "react";
import { Trash2, MapPin } from "lucide-react";
import api from "../api/api"; // axios instance
import Loading from "../components/UI/Loading";
import { Link } from "react-router-dom";
import { removeFavorite } from "../store/User";
import { useDispatch } from "react-redux";

const WishList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
   const dispatch=useDispatch();
  // ----------------------------
  // Fetch Wishlist Items
  // ----------------------------
  const fetchFavorites = async () => {
    try {
      const res = await api.get("/user/favorites");

      if (res.data.success) {
        setFavorites(res.data.wishlist);
      }
    } catch (err) {
      console.log("Fetch Wishlist Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Remove Favorite
  // ----------------------------
  const deleteFavorite = async (id) => {
    try {
      await api.delete(`/user/favorite/${id}`);
      
   dispatch(removeFavorite(id));
  setFavorites((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log("Remove Favorite Error:", err.message);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);
   // getUrl

   const getItemUrl = (item) => {
    const slugCategory = item.category.toLowerCase().replace(/\s+/g, "-");
    const slugName = encodeURIComponent(
      item.title.toLowerCase().replace(/\s+/g, "-")
    );
    return `/items/${slugCategory}/${slugName}/${item._id}`;
  };


  // ----------------------------
  // Loading UI
  // ----------------------------
  if (loading) {
    return (
      <div className="text-center mt-20 text-lg font-semibold text-gray-600">
        <Loading/>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-10 border-b pb-4">
        ❤️ My Wishlist
      </h2>

      {/* Empty Wishlist */}
      {favorites.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed rounded-2xl p-16 text-center">
          <h1 className="text-xl font-semibold text-gray-700">
            Wishlist is Empty
          </h1>
          <p className="text-gray-500 mt-2">
            Add some items to wishlist ❤️
          </p>
        </div>
      ) : (
        // Wishlist Items
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {favorites.map((item) => (
            <div
              key={item._id}
              className="relative bg-white rounded-2xl shadow border hover:shadow-lg transition overflow-hidden"
            >
              {/* Remove Button */}
              <button
                onClick={() => deleteFavorite(item._id)}
                className="absolute top-3 z-10 right-3 bg-white/80 p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition cursor-pointer"
              >
                <Trash2 size={18} />
              </button>

              {/* Image */}
              <Link to={getItemUrl(item)}>
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.images[0]?.url}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500 cursor-pointer"
                />
              </div>
              </Link>
              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
                  {item.title}
                </h3>

                <p className="text-blue-600 font-bold mt-2">
                  ₹{item.price.amount} / {item.price.type}
                </p>

                {/* Location */}
                <div className="flex items-center text-gray-500 text-sm mt-2">
                  <MapPin size={14} className="mr-1" />
                  {item.location.city}, {item.location.state}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishList;
