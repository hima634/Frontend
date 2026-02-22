import {
  IoPersonOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoHelpCircleOutline,
  IoChevronForward,
} from "react-icons/io5";
import { FiTool } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser, toggleProfile } from "../../store/User";
import axios from "axios";
import api from "../../api/api";

const ShowProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.User);

  const handleLogout = async () => {
    try {
      await api.post(
        "/user/logout");
      dispatch(logoutUser());
      localStorage.removeItem("accessToken");
      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error.response?.data?.msg);
      alert("Logout failed. Please try again.");
    }
  };

  const closeProfile = () => {
    dispatch(toggleProfile());
  };

  return (
    <div className="w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      
      {/* Profile Header */}
      <div className="p-5 bg-linear-to-br from-blue-50 to-white border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={user?.profilePic || "/images/profile.jpg"} 
              alt="Profile" 
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-gray-900 truncate">
              {user?.firstName} {user?.lastName || ""}
            </h2>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <MenuItem
          icon={<IoPersonOutline />}
          label="View & Edit Profile"
          to="/profile"
          onClick={closeProfile}
        />
        <MenuItem
          icon={<FiTool/>}
          label="Rent Item"
          to="/rent-item"
          onClick={closeProfile}
        />
        
        <MenuItem
          icon={<IoSettingsOutline />}
          label="Settings"
          to="/settings"
          onClick={closeProfile}
        />
        <MenuItem
          icon={<IoHelpCircleOutline />}
          label="Help & Support"
          to="/help"
          onClick={closeProfile}
        />
      </div>

      {/* Logout Section */}
      <div className="p-2 border-t border-gray-100 bg-gray-50/50">
        <button
          className="w-full flex items-center justify-between px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-3">
            <IoLogOutOutline className="text-xl group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-bold">Logout</span>
          </div>
          <IoChevronForward className="text-gray-300" />
        </button>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, label, to, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
  >
    <div className="flex items-center gap-3">
      <span className="text-xl opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
      <span className="text-sm font-semibold">{label}</span>
    </div>
    <IoChevronForward className="text-gray-300 group-hover:text-blue-400 transition-colors" />
  </Link>
);

export default ShowProfile;