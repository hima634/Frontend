import { FaTools, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import ShowProfile from "./ShowProfile";
import { useDispatch, useSelector } from "react-redux";
import { toggleProfile } from "../../store/User";
import { useRef, useEffect, useState } from "react";
import { Menu, MessageCircleMore, X, ChevronRight, PlusCircle, Heart, Info } from "lucide-react";
import EnterLocation from "./EnterLocation";

const Header = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, showProfile, user } = useSelector((store) => store.User);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profileRef = useRef();

  const onProfileClick = () => dispatch(toggleProfile());

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        if (showProfile) dispatch(toggleProfile());
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfile, dispatch]);

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* MAIN HEADER ROW */}
          <div className="relative flex items-center justify-between h-16 md:h-20 gap-2 md:gap-4">
            
            {/* 1. MOBILE: MENU ICON (Left) | TABLET/LAPTOP: LOGO (First) */}
            <div className="flex items-center shrink-0">
              <button 
                onClick={() => setIsMenuOpen(true)} 
                className="md:hidden p-2 hover:bg-blue-50 rounded-full text-blue-600 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              {/* Logo: Absolute center on mobile, normal flow on tablet+ */}
              <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 ">
                <Link to="/" className="flex items-center gap-2 text-lg md:text-xl font-black text-blue-600">
                  <div className="bg-blue-600 p-1 md:p-1.5 rounded-lg text-white">
                    <FaTools className="text-sm md:text-lg" />
                  </div>
                  <span className="tracking-tighter">ToolRent</span>
                </Link>
              </div>
            </div>

            {/* 2. TABLET/LAPTOP: ENTER LOCATION (Middle) */}
            <div className="hidden md:flex flex-1 justify-center max-w-xl px-4">
              <EnterLocation />
            </div>

            {/* 3. TABLET/LAPTOP: NAV LINKS (Rent, Wishlist, Message) */}
            <div className="hidden md:flex items-center gap-5 lg:gap-8 shrink-0">
              <Link to="/rent-item" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">
                Rent Item
              </Link>
              <Link to="/wishlist" className="text-gray-500 hover:text-blue-600 transition-transform hover:scale-110">
                <FaRegHeart className="text-xl" />
              </Link>
              {isLoggedIn && (
                <Link to="/chat" className="text-gray-500 hover:text-blue-600 transition-transform hover:scale-110">
                  <MessageCircleMore className="w-6 h-6" />
                </Link>
              )}
            </div>

            {/* 4. AUTH SECTION (Far Right) */}
            <div className="flex items-center justify-end shrink-0 min-w-20">
              {isLoggedIn ? (
                <div className="relative" ref={profileRef}>
                  <button onClick={onProfileClick} className="flex items-center rounded-full ring-2 ring-transparent hover:ring-blue-100 transition-all">
                    <img 
                      src={user?.profilePic || `/images/profile.jpg`}
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                      alt="profile"
                    />
                  </button>
                  {showProfile && (
                    <div className="absolute top-12 right-0 z-50">
                      <ShowProfile />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {/* Show login only on tablet+ to keep mobile trio clean */}
                  <Link to="/login" className="hidden md:block text-sm font-bold text-gray-600 hover:text-blue-600 px-2">
                    Login
                  </Link>
                  <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-xs md:text-sm hover:bg-blue-700 transition-all active:scale-95">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE SEARCH (Second row on small screens only) */}
          <div className="md:hidden pb-3">
            <EnterLocation />
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR (Drawer) */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMenuOpen(false)}
      />
      
      <div className={`fixed inset-y-0 left-0 w-80 bg-white z-110 shadow-2xl transform transition-transform duration-500 ease-out md:hidden flex flex-col ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        <div className="p-6 border-b flex justify-between items-center bg-blue-50/30">
          <button  onClick={() => setIsMenuOpen(false)}>
            <div className="flex items-center gap-2 text-blue-600 font-black text-xl">
              
              <FaTools /> ToolRent
              </div>
            </button>
         
          <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white rounded-full">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <SidebarLink to="/rent-item" icon={<PlusCircle size={20}/>} label="Rent Item" onClick={() => setIsMenuOpen(false)} />
          <SidebarLink to="/wishlist" icon={<Heart size={20}/>} label="My Wishlist" onClick={() => setIsMenuOpen(false)} />
          <SidebarLink to="/works" icon={<Info size={20}/>} label="How it Works" onClick={() => setIsMenuOpen(false)} />
          {isLoggedIn && (
            <SidebarLink to="/chat" icon={<MessageCircleMore size={20}/>} label="Messages" onClick={() => setIsMenuOpen(false)} />
          )}
        </div>

        {!isLoggedIn && (
          <div className="p-6 border-t bg-gray-50 space-y-3">
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-3.5 font-bold text-gray-700 bg-white border border-gray-200 rounded-2xl">
              Login
            </Link>
            <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-3.5 font-bold text-white bg-blue-600 rounded-2xl shadow-lg">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

const SidebarLink = ({ to, icon, label, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick} 
    className="flex items-center justify-between p-4 rounded-2xl font-bold text-gray-700 hover:bg-blue-50 transition-all group"
  >
    <div className="flex items-center gap-3">
      <span className="text-blue-500 group-hover:scale-110 transition-transform">{icon}</span>
      {label}
    </div>
    <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100" />
  </Link>
);

export default Header;