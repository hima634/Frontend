import api from "@/api/api";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Loading from "./Loading";
import ItemCard from "./ItemCard";
import { getNearbyItems } from "@/services/itemService";
import { MapPin, Flame } from "lucide-react";

function ItemsNearby() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { lat, lng, isLocationSelected, isLocationLoaded } = useSelector((state) => state.Location);

  const fetchItemsByLocation = useCallback(async (latitude, longitude) => {
    try {
      setLoading(true);
      const data = await getNearbyItems(latitude, longitude);
      if (data.success) setItems(data.items || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  const fetchPopularItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/item/getAll");
      if (res.data.success) setItems(res.data.items || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!isLocationLoaded) return;
    if (isLocationSelected && lat && lng) fetchItemsByLocation(lat, lng);
    else fetchPopularItems();
  }, [lat, lng, isLocationSelected, isLocationLoaded, fetchItemsByLocation, fetchPopularItems]);

  if (loading) return <div className="py-20"><Loading /></div>;

  return (
    <section className="max-w-7xl mx-auto mt-10 px-4 md:px-6 pb-10">
      {/* Tighter Header Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2.5 rounded-xl shadow-sm ${isLocationSelected ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'}`}>
          {isLocationSelected ? <MapPin size={20} /> : <Flame size={20} />}
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">
            {isLocationSelected ? "Nearby Gear" : "Trending Now"}
          </h2>
          <p className="text-slate-500 font-bold text-[11px] uppercase tracking-wider mt-1">
             {items.length} tools found
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
           <MapPin className="text-slate-300 mx-auto mb-2" size={32} />
           <p className="text-slate-500 font-bold text-sm">No tools listed here yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 auto-rows-fr">
          {items.map((item) => (
            <ItemCard item={item} key={item._id} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ItemsNearby;
