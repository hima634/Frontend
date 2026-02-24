import api from "@/api/api";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import ItemCard from "./ItemCard";
import { getNearbyItems } from "@/services/itemService";
import { MapPin, Flame } from "lucide-react";
import SkeletonCard from "./SkeletonCard";

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


  return (
    <section className="max-w-7xl mx-auto mt-8 px-4 md:px-6 pb-10">
      {/* Header logic stays same */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-xl ${isLocationSelected ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'}`}>
          {isLocationSelected ? <MapPin size={20} /> : <Flame size={20} />}
        </div>
        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
          {isLocationSelected ? "Nearby Tools" : "Popular Gear"}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 auto-rows-fr">
        {loading ? (
          Array.from({ length: 10 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-slate-50 rounded-[2rem]">
            <p className="text-slate-500 font-bold">No tools found.</p>
          </div>
        ) : (
          items.map((item) => (
            <ItemCard item={item} key={item._id} />
          ))
        )}
      </div>
    </section>
  );
}

export default ItemsNearby;
