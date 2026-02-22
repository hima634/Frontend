import { Check, ShieldCheck, DollarSign, Search } from "lucide-react";

function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto mt-20 px-6">
      {/* Container with background image */}
      <div 
        className="relative overflow-hidden rounded-[2rem] border border-gray-100 bg-blue-50/50 shadow-sm"
        style={{ 
          backgroundImage: "url('/images/HowItWorks.png')",
          backgroundPosition: 'bottom right',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '40%' // Keeps the image contained to the right side
        }}
      >
        {/* Gradient Overlay: ensures text is readable on the left */}
        <div className="absolute inset-0 bg-linear-to-r from-white via-white/95 to-transparent"></div>

        <div className="relative z-10 grid md:grid-cols-2 gap-8 p-10 md:p-14">
          
          {/* Section 1: Renters */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-lg">
                <Search size={22} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">How to Rent</h2>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                {/* This container prevents the icon from stretching */}
                <div className="mt-1 bg-green-100 rounded-full p-1 shrink-0 flex items-center justify-center w-6 h-6">
                  <Check className="text-green-600" size={14} strokeWidth={4} />
                </div>
                <p className="text-gray-600 leading-tight">
                  Browse thousands of tools from neighbors.
                </p>
              </li>

              <li className="flex items-start gap-3">
                <div className="mt-1 bg-green-100 rounded-full p-1 shrink-0 flex items-center justify-center w-6 h-6">
                  <Check className="text-green-600" size={14} strokeWidth={4} />
                </div>
                <p className="text-gray-600 leading-tight">
                  Chat with owners to arrange pickup times.
                </p>
              </li>

              <li className="flex items-start gap-3">
                <div className="mt-1 bg-green-100 rounded-full p-1 shrink-0 flex items-center justify-center w-6 h-6">
                  <Check className="text-green-600" size={14} strokeWidth={4} />
                </div>
                <p className="text-gray-600 leading-tight">
                  Pay securely and get the job done.
                </p>
              </li>
            </ul>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-md">
              Start Borrowing
            </button>
          </div>

          {/* Section 2: Owners */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 text-white rounded-lg">
                <DollarSign size={22} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Earn Money</h3>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                
                <ShieldCheck className="text-blue-600 mt-1" size={18} />
                <p className="text-gray-600"><strong>Verified Users:</strong> Rent with peace of mind.</p>
              </li>

              <li className="flex items-start gap-3">
              <div className="mt-1 bg-green-100 rounded-full p-1 shrink-0 flex items-center justify-center w-6 h-6">
                <Check className="text-green-600" size={14} strokeWidth={4} />
            </div>
                <p className="text-gray-600 leading-tight">Turn idle tools into consistent extra income.</p>
              </li>

              <li className="flex gap-3">
              <div className="mt-1 bg-green-100 rounded-full p-1 shrink-0 flex items-center justify-center w-6 h-6">
              <Check className="text-green-600" size={14} strokeWidth={4} />
            </div>
                <p className="text-gray-600 leading-tight">You control the price, rules, and availability.</p>
              </li>
            </ul>

            <button className="bg-gray-900 hover:bg-black text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-md">
              List Your Item
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;