import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { setCategory, setSubItem } from "../store/Categories";
import { fetchFilteredItems, normalize, slugify } from "../services/itemService";
import ItemCard from "../components/UI/ItemCard";

const Category = ({ viewMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { itemTitle } = useParams(); 
 
  const { lat, lng, city } = useSelector((s) => s.Location);
  const { selectedCategory, selectedSubItem, list } = useSelector((s) => s.Categories);

  // ================= LOCAL STATE =================
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter states are LOCAL. Changing these will NOT trigger the useEffect API call.
  const [localSub, setLocalSub] = useState(selectedSubItem || "");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [distance, setDistance] = useState(10); // <--- Added back as Local State
  const [sortOrder, setSortOrder] = useState("asc");

  // Sync local dropdown if the Global Search Bar (Header) updates Redux
  useEffect(() => {
    setLocalSub(selectedSubItem || "");
  }, [selectedSubItem]);

  const currentCategory = list.find(
    (c) => normalize(c.name) === normalize(selectedCategory)
  );
  const subItemsList = currentCategory?.subItems || [];

  // ================= THE FETCH FUNCTION =================
  const loadItems = useCallback(async (overrideSub) => {
    if (!lat || !lng || !selectedCategory) return;

    setLoading(true);
    try {
      // Use overrideSub if provided (from useEffect), otherwise use the current local slider state
      const subToFetch = overrideSub !== undefined ? overrideSub : localSub;
      
      const validItemTitle =
        viewMode === "single" && itemTitle !== "view-all"
          ? normalize(itemTitle)
          : "";

      const res = await fetchFilteredItems({
        lat,
        lng,
        radius: distance,
        category: slugify(selectedCategory),
        subItem: slugify(subToFetch), 
        itemTitle: validItemTitle,
        maxPrice,
        sort: sortOrder,
      });

      if (res?.success) {
        setItems(res.items || []);
      }
    } catch (err) {
      console.error("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
    // Note: distance and maxPrice are NOT in this dependency array to keep loadItems stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, selectedCategory, viewMode, itemTitle]);

  // ================= 1. AUTO-FETCH (Only for Major Changes) =================
  // This runs when you first arrive or when you search from the Top Header bar.
  useEffect(() => {
    loadItems(selectedSubItem);
    // We DO NOT include 'distance' or 'maxPrice' here. 
    // This stops the "automatic" calling while sliding.
  }, [lat, lng, selectedCategory, selectedSubItem, itemTitle, loadItems]); 

  // ================= 2. MANUAL APPLY (The Button Trigger) =================
  const handleApply = () => {
    // 1. Update global Redux & URL to match our sliders/dropdowns
    dispatch(setSubItem(localSub));
    navigate(`/${slugify(city)}/${slugify(localSub) || "view-all"}`);
    
    // 2. Explicitly trigger the API with the current slider values
    loadItems(localSub);
  };

  const handleReset = () => {
    setLocalSub("");
    setMaxPrice(5000);
    setDistance(10);
    setSortOrder("asc");
    dispatch(setSubItem(""));
    navigate(`/${slugify(city)}/view-all`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-1/4 w-full shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sticky top-20">
            <h2 className="text-lg font-bold border-b pb-3 mb-4 text-gray-800">Filters</h2>

            {/* Sub Category */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sub Category</label>
              <select
                value={localSub}
                onChange={(e) => setLocalSub(e.target.value)}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sub-categories</option>
                {subItemsList.map((sub) => (
                  <option key={sub.name} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>

            {/* DISTANCE SLIDER (Manual Only) */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Distance</label>
                <span className="font-bold text-green-600">{distance} km</span>
              </div>
              <input
                type="range" min="1" max="100" step="1"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>

            {/* PRICE SLIDER (Manual Only) */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Max Price</label>
                <span className="font-bold text-blue-600">₹{maxPrice}</span>
              </div>
              <input
                type="range" min="0" max="10000" step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <button
              onClick={handleApply}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {loading ? "Searching..." : "Apply Filters"}
            </button>
            
            <button onClick={handleReset} className="w-full mt-3 py-2 text-gray-400 text-sm hover:text-gray-600">
              Reset Filters
            </button>
          </div>
        </aside>

        <main className="md:w-3/4 w-full">
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                 <div className="col-span-full text-center py-20">Loading results...</div>
              ) : items.length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-400">No items found.</div>
              ) : (
                items.map(item => <ItemCard key={item._id} item={item} />)
              )}
           </div>
        </main>
      </div>
    </div>
  );
};

export default Category;