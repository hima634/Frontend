import { AiFillTool } from "react-icons/ai";
import { Sparkles, ArrowRight, Shield, Zap, Globe } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-[#fafafa] overflow-hidden pt-20">
      {/* Background Decorative Shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 -skew-x-12 translate-x-20 z-0" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Typography */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
            <Sparkles size={16} className="text-blue-600" />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">The Future of Ownership</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter">
            Don't Buy it. <br />
            <span className="text-blue-600 relative">
              Rent it.
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9C118.957 4.47226 235.043 1.02774 355 3" stroke="#2563EB" strokeWidth="6" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-md font-medium leading-relaxed">
            Join the circular economy. Rent professional-grade tools from verified neighbors in your city.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95">
              Explore Catalog <ArrowRight size={20} />
            </button>
            <button className="flex items-center justify-center gap-3 bg-white text-slate-900 border-2 border-slate-200 px-8 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
              <AiFillTool className="text-blue-600" /> List a Tool
            </button>
          </div>

          {/* Quick Stats/Trust Marks */}
          <div className="pt-8 flex items-center gap-8 border-t border-gray-200">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900">2.4k+</span>
              <span className="text-xs font-bold text-gray-400 uppercase">Verified Tools</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900">12min</span>
              <span className="text-xs font-bold text-gray-400 uppercase">Avg. Pickup</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900">4.9/5</span>
              <span className="text-xs font-bold text-gray-400 uppercase">User Rating</span>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Image Aesthetic */}
        <div className="relative hidden md:block">
          {/* Main Floating Card */}
          <div className="relative z-20 bg-white p-4 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-100 rotate-3 hover:rotate-0 transition-transform duration-500">
            <img 
              src="/src/assets/hero-bg.png" 
              alt="Tool Display" 
              className="rounded-[2rem] w-full h-125 object-cover"
            />
            {/* Overlay Info Card */}
            <div className="absolute -bottom-6 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-gray-50 flex items-center gap-4 animate-bounce-slow">
              <div className="bg-green-100 p-3 rounded-2xl">
                <Zap className="text-green-600" fill="currentColor" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">New Listing</p>
                <p className="text-sm font-black text-slate-900">Hilti Rotary Drill</p>
                <p className="text-blue-600 font-bold">$15/day</p>
              </div>
            </div>
          </div>

          {/* Background Secondary Cards */}
          <div className="absolute top-10 -right-4 w-64 h-80 bg-blue-600 rounded-[2.5rem] -rotate-6 z-10" />
          <div className="absolute -top-10 left-20">
            <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-xl flex items-center gap-2 border border-white">
               <Shield className="text-blue-600" size={18} />
               <span className="text-sm font-bold text-slate-800">100% Insured Rentals</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;