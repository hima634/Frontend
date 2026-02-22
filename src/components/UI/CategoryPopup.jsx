import { slugify } from "@/services/itemService";
import { setCategory, setSubItem } from "@/store/Categories";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X, ArrowRight, Layers } from "lucide-react";

const CategoryPopup = ({ category, onClose }) => {
  const location = useSelector(state => state.Location);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const city = slugify(location.city || "city");

  const handleItemClick = (item) => {
    dispatch(setCategory(category.name));
    dispatch(setSubItem(item));
    navigate(`/${city}/${slugify(item)}`);
    onClose();
  };

  const handleViewAll = () => {
    dispatch(setCategory(category.name));
    navigate(`/${city}/view-all`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

      {/* Popup Content */}
      <div className="relative bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        
        {/* Header Section */}
        <div className="bg-slate-50 p-8 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
              <Layers size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">{category.name}</h2>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Select Sub-Category</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white hover:bg-red-50 hover:text-red-500 rounded-full shadow-sm transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Sub-Items Area */}
        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            {category.subItems.map((item, i) => (
              <button
                key={i}
                onClick={() => handleItemClick(item.name)}
                className="flex flex-col items-center gap-4 p-5 rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-50 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <img src={item.img} alt={item.name} className="w-full h-full object-contain p-2" />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </span>
              </button>
            ))}

            {/* View All Option */}
            <button
              onClick={handleViewAll}
              className="flex flex-col items-center justify-center gap-2 p-5 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:scale-110 transition-all">
                <ArrowRight size={20} />
              </div>
              <span className="text-sm font-black text-slate-900">View All</span>
            </button>
          </div>
        </div>

        {/* Bottom Decorative Hint */}
        <div className="p-4 bg-slate-50 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Click to see available items in {location.city || 'your area'}</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryPopup;