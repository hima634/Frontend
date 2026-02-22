import { useSelector } from "react-redux";
import CategoryPopup from "./CategoryPopup";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const BrowseCategory = () => {
  const categories = useSelector((store) => store.Categories.list) || [];
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <>
      <section className="max-w-7xl mx-auto mt-24 px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-slate-500 font-medium mt-2">Professional gear for every project.</p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
            See All <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              onClick={() => setActiveCategory(cat)}
              className="group relative h-48 bg-white rounded-[2.5rem] p-6 text-center border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.15)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col items-center justify-between overflow-hidden"
            >
              {/* Decorative Background Circle */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-[3] transition-transform duration-700 opacity-50" />

              <div className="relative z-10 h-20 w-20 mb-2 flex items-center justify-center">
                <img
                  src={cat.img}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-contain drop-shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.src = "https://placehold.co/100x100?text=Tool"; }}
                />
              </div>

              <p className="relative z-10 text-sm font-black text-slate-800 tracking-wide uppercase group-hover:text-blue-600 transition-colors">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {activeCategory && (
        <CategoryPopup
          category={activeCategory}
          onClose={() => setActiveCategory(null)}
        />
      )}
    </>
  );
};

export default BrowseCategory;