import React, { useEffect, useState, useRef } from "react";
import { FaLocationDot, FaCrosshairs } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addLocation } from "@/store/Location";
import { debounce, fetchItemSuggestions, getFrontendSuggestions } from "@/services/itemSuggestion";
import { setCategory, setSubItem } from "@/store/Categories";
import { useNavigate } from "react-router-dom";
import { normalize, slugify } from "@/services/itemService";

function EnterLocation() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [itemSuggestions, setItemSuggestions] = useState([]);
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [selectedMeta, setSelectedMeta] = useState({ cat: "", sub: "" });

  const categories = useSelector((state) => state.Categories.list);
  const location = useSelector((state) => state.Location);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const locationRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (location?.address_display) setQuery(location.address_display);
  }, [location.address_display]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowItemDropdown(false);
      if (locationRef.current && !locationRef.current.contains(event.target)) setSuggestions([]);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length < 3) { setSuggestions([]); return; }
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`, { headers: { "User-Agent": "location-app" } });
      const data = await response.json();
      setSuggestions(data);
    } catch (err) { console.error(err); }
  };

  const handleSelect = (place) => {
    const locationData = { lat: Number(place.lat), lng: Number(place.lon), address_display: place.display_name, city: place.name || "Unknown" };
    setQuery(place.display_name);
    setSuggestions([]);
    localStorage.setItem("userLocation", JSON.stringify(locationData));
    dispatch(addLocation(locationData));
  };

  const getLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`);
      const data = await response.json();
      const locData = { lat: coords.latitude, lng: coords.longitude, address_display: data.display_name,
       city: data.address.city || data.address.state_district || "" };
       localStorage.setItem("userLocation", JSON.stringify(locData));
      setQuery(data.display_name);
      dispatch(addLocation(locData));
    });
  };

  const handleSuggest = debounce(async (text) => {
    if (text.length < 3) return;
    const front = getFrontendSuggestions(text, categories);
    const back = await fetchItemSuggestions(text);
    setItemSuggestions([...front, ...back]);
    setShowItemDropdown(true);
  }, 400);

  const itemSuggestionOnClick = (s) => {
    setSearch(s.name);
    setSelectedMeta({ cat: s.category, sub: s.subItem });
    setShowItemDropdown(false);
  };

  const handleSearch = () => {
    if (!search) return;
    dispatch(setCategory(normalize(selectedMeta.cat)));
    dispatch(setSubItem(normalize(selectedMeta.sub)));
    navigate(`/${slugify(location.city || "city")}/${slugify(search)}`);
  };

  return (
    <div className="w-full flex items-center justify-center">
      {/* THE SEARCH PILL */}
      <div className="flex w-full bg-gray-50 border border-gray-200 rounded-xl md:rounded-full p-1 items-center transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
        
        {/* LOCATION SECTION */}
 
      <div ref={locationRef} className="relative flex-[1.2] md:flex-[0.6] min-w-0 border-r border-gray-200">
        <div className="flex items-center px-2 md:px-4 h-9">
          <FaLocationDot className="text-blue-600 shrink-0 text-xs md:text-sm " />
          
          <input 
            type="text" 
            value={query} 
            onChange={handleChange} 
            placeholder="City..." 
            className="w-full ml-1 md:ml-2 bg-transparent outline-none text-[11px] md:text-xs font-bold text-gray-700 truncate" 
          />
        
          <FaCrosshairs 
            onClick={getLocation} 
            className="text-gray-400 hover:text-blue-500 cursor-pointer ml-1 text-xs shrink-0" 
          />
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute top-11 left-0 w-64 md:w-80 bg-white rounded-xl shadow-xl border z-50 py-2">
            {suggestions.map((p) => (
              <li 
                key={p.place_id} 
                onClick={() => handleSelect(p)} 
                className="px-3 py-2 text-[11px] hover:bg-blue-50 cursor-pointer border-b last:border-none truncate"
              >
                {p.display_name}
              </li>
            ))}
          </ul>
        )}
       </div>
        {/* SEARCH SECTION */}
        <div ref={searchRef} className="relative md:flex-[0.4] flex-[0.8] min-w-0">
          <div className="flex items-center px-2 md:px-4 h-9">
            <FaSearch className="text-gray-400 shrink-0 text-xs md:text-sm" />
            <input 
              type="text" value={search} 
              onChange={(e) => { setSearch(e.target.value); handleSuggest(e.target.value); }} 
              onFocus={() => { if (search.length >= 3) setShowItemDropdown(true); }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search tools..." 
              className="w-full ml-1 md:ml-2 bg-transparent outline-none text-[11px] md:text-xs font-bold text-gray-700" 
            />
          </div>
          {showItemDropdown && itemSuggestions.length > 0 && (
            <ul className="absolute top-11 left-0 w-full bg-white rounded-xl shadow-xl border z-50 py-2 max-h-60 overflow-y-auto">
              {itemSuggestions.map((s, i) => (
                <li key={i} onClick={() => itemSuggestionOnClick(s)} className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b last:border-none">
                  <span className="text-xs font-bold">{s.name}</span>
                  <span className="text-[9px] text-blue-500 font-black uppercase tracking-tighter">{s.category}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* SEARCH BUTTON (Icon on mobile, text on desktop) */}
        <button 
          onClick={handleSearch} 
          className="bg-blue-600 text-white p-2 md:px-5 md:py-2 rounded-lg md:rounded-full font-bold text-xs hover:bg-blue-700 transition-colors shrink-0 flex items-center gap-2"
        >
          <FaSearch className="md:hidden" />
          <span className="hidden md:inline">Search</span>
        </button>
      </div>
    </div>
  );
}

export default EnterLocation;