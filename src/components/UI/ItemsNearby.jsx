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
    <section className="max-w-7xl mx-auto mt-20 px-6 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl shadow-sm ${isLocationSelected ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'}`}>
            {isLocationSelected ? <MapPin size={24} /> : <Flame size={24} />}
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {isLocationSelected ? "Tools Available Nearby" : "Trending Popular Tools"}
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              {isLocationSelected ? `Found ${items.length} gear ready to rent near you` : "Top-rated equipment from around the community"}
            </p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
           <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <MapPin className="text-slate-300" />
           </div>
           <p className="text-slate-500 font-bold italic tracking-tight">No tools listed in this area yet.</p>
           <button className="mt-4 text-blue-600 font-black text-sm uppercase tracking-widest">Be the first to list →</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <ItemCard item={item} key={item._id || Math.random()} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ItemsNearby;