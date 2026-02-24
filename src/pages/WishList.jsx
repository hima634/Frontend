import { useEffect, useState } from "react";
import api from "../api/api";
import ItemCard from "../components/UI/ItemCard"; 
import SkeletonCard from "@/components/UI/SkeletonCard";

const WishList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchFavorites = async () => {
    try {
      setLoading(true);
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
  const handleRemoveItem = (id) => {
    setFavorites((prev) => prev.filter((item) => item._id !== id));
  };
  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 mt-10">
      <div className="flex items-center justify-between mb-10 border-b pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            ❤️ My Wishlist
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">
            {favorites.length} items saved for later
          </p>
        </div>
      </div>

      {loading ? (
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center">
          <h1 className="text-xl font-black text-slate-700">
            Your wishlist is empty
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Start exploring and save the tools you need!
          </p>
        </div>
      ) : (
       
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">
          {favorites.map((item) => (
            <ItemCard
              onFavoriteToggle={handleRemoveItem}
              item={item} key={item._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishList;
