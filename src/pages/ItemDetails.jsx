import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CircleUserRound, Heart, ChevronLeft, Share2, MapPin, Calendar, ShieldCheck, MessageCircle } from "lucide-react";
import { Map, MapControls, MapMarker, MarkerContent, MarkerTooltip } from "../components/UI/map.jsx";
import Loading from "../components/UI/Loading.jsx";
import api from "../api/api.js";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../store/User.js";
import { createRoom } from "@/services/chatService.js";

const ItemDetails = () => {
  const dispatch = useDispatch();
  const { slugId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const { user, authLoading } = useSelector(state => state.User);

  const getItem = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/item/getItemById/${slugId}`);
      if (res.data.success) setItem(res.data.item);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getItem(); }, [slugId]);

  const handleChat = async () => {
    if (!user) return navigate("/login");
    const res = await createRoom({ sellerId: item.ownerId._id, itemId: item._id });
    if (res.success) navigate(`/chat/${res.room._id}`);
  };

  const isFav = user?.wishlist?.includes(item?._id);

  const toggleFavorite = async () => {
    if (!user) return navigate("/login");
    try {
      if (!isFav) {
        await api.post(`/user/favorite/${slugId}`);
        dispatch(addFavorite(slugId));
      } else {
        await api.delete(`/user/favorite/${slugId}`);
        dispatch(removeFavorite(slugId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (authLoading || loading) return <Loading />;
  if (!item) return <NotFound navigate={navigate} />;

  const owner = item.ownerId;
  const images = Array.isArray(item.images) ? item.images : [];

  return (
    <div className="bg-[#fafafa] min-h-screen pb-20">
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-all">
          <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-slate-50 transition-colors">
            <ChevronLeft size={20} />
          </div>
          Back to Search
        </button>
        <div className="flex gap-3">
          <button className="p-3 bg-white rounded-xl shadow-sm text-slate-500 hover:text-blue-600 transition-all">
            <Share2 size={20} />
          </button>
          <button onClick={toggleFavorite} className={`p-3 rounded-xl shadow-sm transition-all ${isFav ? "bg-red-500 text-white" : "bg-white text-slate-400"}`}>
            <Heart size={20} className={isFav ? "fill-white" : ""} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* LEFT COLUMN: Media & Description (Span 8) */}
        <div className="lg:col-span-8 space-y-10">

          {/* Gallery Component */}
          <div className="space-y-4">
            <div className="relative aspect-16/10 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-white">
              <img src={images[activeImage]?.url} className="w-full h-full object-cover" alt={item.title} />
              <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black text-slate-900 shadow-sm border border-white">
                {activeImage + 1} / {images.length} Photos
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {images.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImage(idx)} className={`relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx ? "border-blue-600 scale-95" : "border-transparent opacity-60"}`}>
                  <img src={img.url} className="w-full h-full object-cover" alt="thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* Details Content */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest mb-4">
                <ShieldCheck size={14} /> Verified Tool
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">{item.title}</h1>
              <div className="flex items-center gap-4 text-slate-400 font-bold text-sm">
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-blue-500" /> {item.location.city}</span>
                <span className="flex items-center gap-1.5"><Calendar size={16} /> Listed {formatDate(item.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-black text-slate-900">Description</h3>
              <p className="text-slate-600 leading-relaxed text-lg font-medium">{item.description}</p>
            </div>

            {/* Map Section */}
            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-black text-slate-900">Pickup Location</h3>
              <div className="h-80 rounded-[2rem] overflow-hidden border border-slate-100 shadow-inner">
                <Map center={[item.location.geo.coordinates[0], item.location.geo.coordinates[1]]} zoom={14} className="w-full h-full">
                  <MapMarker longitude={item.location.geo.coordinates[0]} latitude={item.location.geo.coordinates[1]}>
                    <MarkerContent>
                      <div className="p-2 bg-blue-600 rounded-full border-4 border-white shadow-2xl animate-pulse" />
                    </MarkerContent>
                  </MapMarker>
                  <MapControls position="bottom-right" showZoom />
                </Map>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Action Sidebar (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">

            {/* Price & Primary Action Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200/20">
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black tracking-tighter">₹{item.price.amount}</span>
                <span className="text-slate-400 font-bold uppercase text-sm tracking-widest">/ {item.price.type}</span>
              </div>

              <button onClick={handleChat} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3">
                <MessageCircle size={22} /> Start Chatting
              </button>

              <p className="text-center text-slate-500 text-xs font-bold mt-6 uppercase tracking-widest">
                Safe payment & insurance included
              </p>
            </div>

            {/* Seller Profile Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm group">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 overflow-hidden">
                    <CircleUserRound size={40} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{owner?.firstName} {owner?.lastName}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Member since {owner?.createdAt?.split("-")[0]}</p>
                </div>
              </div>
              <Link to={`/profile/${owner?._id}`} className="block w-full text-center py-4 border-2 border-slate-100 hover:border-blue-100 hover:bg-blue-50/50 rounded-2xl font-black text-sm text-slate-600 transition-all">
                View Public Profile
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

// Helper Components
const NotFound = ({ navigate }) => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
    <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
      <CircleUserRound size={48} />
    </div>
    <h2 className="text-3xl font-black text-slate-900">Item not found</h2>
    <p className="text-slate-500 font-medium mt-2">The listing might have been removed or moved.</p>
    <button onClick={() => navigate(-1)} className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">Go Back</button>
  </div>
);

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default ItemDetails;