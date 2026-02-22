import React, { useState } from 'react';
// Import necessary icons
import { FaChevronRight,FaArrowLeft  } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Icons from "react-icons/fa";



const CategorySelector = () => {
  const ALL_CATEGORIES = useSelector(store => store.Categories.list);
  const navigate = useNavigate();
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);

  const selectedCategory = ALL_CATEGORIES.find(
    (cat) => cat.name === selectedCategoryName
  );

  const onSelectCategory = (categoryName, subItem) => {
    const slugCategory = categoryName.toLowerCase().replace(/\s+/g, '-');
    const slugItem = encodeURIComponent(subItem.toLowerCase().replace(/\s+/g, '-'));
    navigate(`/rent-item/${slugCategory}/${slugItem}`);
  };

  const handleBack = () => setSelectedCategoryName(null);

  return (
    <div className="max-w-4xl mx-auto my-12 bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="flex">
        {/* Main Categories Panel */}
        <div className={`w-full md:w-1/2 transition-transform duration-300 ${selectedCategory ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
          <div className="p-5 border-b">
            <h2 className="text-md md:text-2xl font-bold text-gray-600 uppercase tracking-wider">CHOOSE A CATEGORY</h2>
          </div>
          {ALL_CATEGORIES.map((cat,i) => {
            const IconComponent = Icons[cat.icon]; 
            return (
              <div
                key={i}
                onClick={() => setSelectedCategoryName(cat.name)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  {IconComponent ? (
                    <IconComponent className="text-gray-500 w-5 h-5" />
                  ) : (
                    <div className="w-5 h-5 bg-gray-200 rounded-full" />
                  )}
                  <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                </div>
                <FaChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            );
          })}
        </div> {/* <--- Added this missing closing div */}

        {/* Sub Categories (Items) Panel */}
        <div className={`w-full md:w-1/2 transition-transform duration-300 ${selectedCategory ? 'translate-x-0' : 'translate-x-full'} absolute md:relative top-0 right-0 bg-white h-full`}>
          {selectedCategory && (
            <>
              <div className="p-5 border-b bg-gray-50 flex items-center justify-between">
                <button onClick={handleBack} className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm font-medium">
                  <FaArrowLeft className="w-4 h-4" /> Back
                </button>
                <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider">{selectedCategory.name}</h2>
              </div>
              <div className="overflow-y-auto max-h-125">
                {selectedCategory.subItems.length > 0 ? (
                  selectedCategory.subItems.map((subItem,i) => (
                    <div
                      key={i}
                      onClick={() => onSelectCategory(selectedCategory.name, subItem.name)}
                      className="p-4 cursor-pointer hover:bg-green-50 transition-colors border-b last:border-b-0 text-sm font-medium text-gray-700"
                    >
                      {subItem.name}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No specific subcategories.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;

