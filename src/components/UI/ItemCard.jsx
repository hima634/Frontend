import { Heart, MapPin, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "timeago.js";
import { useState } from "react";
import api from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../../store/User";

const ItemCard = ({ item }) => {
  const { user } = useSelector(state => state.User);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isFav = user?.wishlist?.includes(item._id);
  const itemUrl = `/items/${item.category?.toLowerCase() || 'item'}/${item._id}`;

  const toggleFavorite = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) return navigate("/login");
    if (loading) return;
    try {
      setLoading(true);
      if (!isFav) {
        await api.post(`/user/favorite/${item._id}`);
        dispatch(addFavorite(item._id));
      } else {
        await api.delete(`/user/favorite/${item._id}`);
        dispatch(removeFavorite(item._id));
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <button
        disabled={loading}
        onClick={toggleFavorite}
        className={`absolute top-2 right-2 z-20 p-1.5 rounded-lg backdrop-blur-md transition-all ${
          isFav ? "bg-red-500 text-white" : "bg-white/80 text-slate-400"
        }`}
      >
        <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-white" : ""}`} />
      </button>

      <Link to={itemUrl} className="flex flex-col h-full">
        <div className="aspect-video w-full overflow-hidden bg-slate-100 relative rounded-t-2xl">
          <img
            src={item.images?.[0]?.url}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-3 flex flex-col grow justify-between">
          <div className="mb-2">
            <h3 className="text-[13px] font-black text-slate-900 leading-tight line-clamp-1 group-hover:text-blue-600">
              {item.title}
            </h3>
            <div className="flex items-center gap-1 text-slate-400 mt-0.5">
              <MapPin size={10} className="text-blue-500 shrink-0" />
              <span className="text-[9px] font-bold uppercase truncate">{item.location?.city}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
            <p className="text-sm font-black text-slate-900">
              ₹{item.price?.amount}
              <span className="text-[10px] text-slate-400 font-bold tracking-tighter">
                /{item.price?.type}
              </span>
            </p>
            <div className="flex items-center gap-1 text-[8px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
              <Clock size={10} />
              {format(item.createdAt).replace(' ago', '')}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ItemCard;
