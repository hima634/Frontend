import { Heart, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { useState } from "react";
import api from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../../store/User";

const ItemCard = ({ item }) => {
  const { user } = useSelector(state => state.User);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const getItemUrl = (item) => {
    const slugCategory = item.category.toLowerCase().replace(/\s+/g, "-");
    const slugName = encodeURIComponent(item.title.toLowerCase().replace(/\s+/g, "-"));
    return `/items/${slugCategory}/${slugName}/${item._id}`;
  };

  const isFav = user?.wishlist?.includes(item._id);

  const toggleFavorite = async (id) => {
    if (!user) { window.location.href = "/login"; return; }
    try {
      setLoading(true);
      if (!isFav) {
        await api.post(`/user/favorite/${id}`);
        dispatch(addFavorite(id));
      } else {
        await api.delete(`/user/favorite/${id}`);
        dispatch(removeFavorite(id));
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  return (
    <div className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden">
      
      {/* ❤️ Wishlist Button - Minimalist Overlay */}
      <button
        disabled={loading}
        onClick={(e) => {
          e.preventDefault(); e.stopPropagation();
          toggleFavorite(item._id);
        }}
        className={`absolute top-4 right-4 z-20 p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 shadow-lg ${
          isFav ? "bg-red-500 text-white scale-110" : "bg-white/80 text-slate-400 hover:text-red-500"
        }`}
      >
        <Heart className={`h-5 w-5 ${isFav ? "fill-white" : ""}`} />
      </button>

      {/* Clickable Card Link */}
      <Link to={getItemUrl(item)} className="block">
        
        {/* Image Container with Zoom Effect */}
        <div className="h-56 w-full overflow-hidden bg-slate-100 relative">
          <img
            src={item.images?.[0]?.url}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Subtle Bottom Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Info Content Area */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-black text-slate-900 leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
              {item.title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 mb-4">
             <MapPin size={14} className="text-blue-500" />
             <span className="text-xs font-bold uppercase tracking-tighter">{item.location?.city}, {item.location?.state}</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            {/* Price Tag */}
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Price</span>
                <p className="text-xl font-black text-slate-900">
                  ₹{item.price.amount}
                  <span className="text-xs font-bold text-slate-400"> / {item.price.type}</span>
                </p>
            </div>

            {/* Time Ago */}
            <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg uppercase tracking-wider">
               <Clock size={12} />
               {format(item.createdAt)}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ItemCard;