import api from "@/api/api";

/**
 * Get items near a location (Geo search)
 * @param {number} lat
 * @param {number} lng
 * @param {number} radius (optional, in KM)
 */
export const getNearbyItems = async (lat, lng, radius) => {
  try {
    if (!lat || !lng) {
      throw new Error("Latitude and Longitude required");
    }

    const res = await api.get("/item/nearby", {
      params: { lat, lng, radius }, // cleaner than query string
    });

    return {
      success: true,
      items: res.data.items || [],
      total: res.data.total || 0,
    };
  } catch (error) {
    console.log("Nearby Items API Error:", error?.response?.data || error.message);

    return {
      success: false,
      items: [],
      total: 0,
    };
  }
};

export const slugify = (text) =>{
  return text.toLowerCase().replace(/\s+/g, '-');
}


export const fetchFilteredItems = async ({
  lat,
  lng,
  radius,
  category,
  subItem,
  itemTitle,
  maxPrice,
  sort,
}) => {
  try {
    const res = await api.get("/item/filter", {
      params: {
        lat,
        lng,
        radius,
        category,
        subItem,
        itemTitle,
        maxPrice,
        sort,
      },
    });

    return res.data;
  } catch (err) {
    console.error("FILTER API ERROR:", err);
    return { success: false, items: [] };
  }
};



export const normalize = (t) => {
  if(!t) return "";
  return String(t)
  .trim()
  .replace(/[-_]+/g, " ")
  .replace(/\s+/g, " ")
  .toLowerCase()
  .replace(/\b\w/g, (c) => c.toUpperCase());
};
