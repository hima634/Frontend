import api from "@/api/api";

// ---------- FRONTEND CATEGORY + SUBITEM ----------
export const getFrontendSuggestions = (text, categories) => {
  const q = text.toLowerCase();
  const results = [];

  categories.forEach((cat) => {
   
    // SubItem match
    cat.subItems.forEach((sub) => {
      if (sub.name.toLowerCase().includes(q)) {
        results.push({
          name: sub.name,
          subItem:sub.name,
          category: cat.name,
        });
      }
    });
  });

  return results;
};

// ---------- BACKEND ITEM TITLE ----------
export const fetchItemSuggestions = async (text) => {
  try {
    const res = await api.get(`/item/suggest?q=${text}`);
    return res.data.success ? res.data.suggestions : [];
  } catch(err) {
    console.log("suggestion error",err?.response?.data);
    return [];
  }
};

export const debounce = (func, delay = 400) => {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

