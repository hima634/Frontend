import React from "react";

const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>

      {/* Text */}
      <p className="mt-3 text-gray-600 font-medium">{text}</p>
    </div>
  );
};

export default Loading;
