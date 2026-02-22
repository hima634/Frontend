
import ItemCard from '../components/UI/ItemCard';
import Loading from '../components/UI/Loading';
import { FlagOff, Share2Icon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams,Link } from 'react-router-dom'
import api from "../api/api"


const OwnerProfile = () => {
  const [Open,setOpen]=useState(false);
  const {slugId}=useParams();
  const [loading,setLoading]=useState(false);
  
  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/profile/${slugId}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      alert("Profile link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  
  const [ownerList,setOwnerList]=useState([]);

  const owner = ownerList.length > 0 ? ownerList[0].ownerId : null;
  const OwnerName = owner
    ? `${owner.firstName} ${owner.lastName}`
    : "Unknown";

  const memberSince = owner?.createdAt
    ? owner.createdAt.split("-")[0]
    : "N/A";

   useEffect(()=>{
    const getOwnerListing=async()=>{
      try {
        setLoading(true);
      const res =await api.get(`/item/owner/${slugId}`);
       if(res.data.success){
         setOwnerList(res.data.items);
       }

      } catch (err) {
        console.log("error:",err.response?.data?.msg);
      }finally{
        setLoading(false);
      }
    }
     getOwnerListing();
   },[])

   if(loading) return <Loading/>

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      {/* Sidebar Profile Info */}
      <div className="md:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center h-fit">
        <div className="w-32 h-32 rounded-full border-4 border-blue-50 overflow-hidden mb-4 shadow-inner">
        <img
          src={owner?.profilePic || "/images/profile.jpg"}
          alt="profile"
          className="w-full h-full object-cover"
        />

        </div>
        <div className="content">
          <h1 className="text-2xl font-bold text-gray-800">{OwnerName}</h1>
          <p className="text-gray-500 mb-4">Member since {memberSince}</p>
          
        </div>
        <button onClick={handleShare}
          className="inline-flex items-center gap-2 px-6 py-3 mt-5 border rounded-xl
          border-blue-500 bg-blue-500
           text-white font-medium
          hover:bg-white hover:text-blue-500
          transition-all duration-200"
          >
          <Share2Icon className="h-4 w-4" />
          Share Profile
        </button>

        <button onClick={()=>setOpen(true)}
            className="flex items-center gap-2 px-6 py-3 mt-5  text-blue-500 rounded-xl
            border-blue-400 border font-medium hover:border-2 transition-all"
          > <FlagOff strokeWidth={1.75} />
            Report User
          </button>
        
      </div>
       {/* Report Modal */}
       {Open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[90%] max-w-md p-5 relative">
            
            {/* Close Icon */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X />
            </button>

            <h2 className="text-lg font-semibold mb-3">Report User</h2>

            <p className="text-sm text-gray-600 mb-4">
              Please tell us why you are reporting this user.
            </p>

            {/* Example content */}
            <textarea
              placeholder="Describe the issue..."
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Submit Report
            </button>
          </div>
        </div>
       )}

      {/* Main Content Area: Listings */}
      <div className="md:w-2/3">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Seller Listings</h2>
        
        {ownerList.length === 0 ? (
           <div>List hasn't anything</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {ownerList.map((item) => (
              <ItemCard item={item} key={item._id}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerProfile