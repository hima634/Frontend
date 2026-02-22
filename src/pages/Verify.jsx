import React from "react";

const Verify = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-100 px-4">
      <div className="bg-white max-w-md w-full text-center p-8 rounded-2xl shadow-lg">
        
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          ✅ Check Your Email
        </h2>

        <p className="text-gray-700 text-sm leading-relaxed">
          We've sent you a verification email.  
          Please check your inbox  and click the verification
          link to activate your account.
        </p>

        <p className="mt-4 text-gray-500 text-xs">
          After verification, you can login normally.
        </p>
      </div>
    </div>
  );
};

export default Verify;
