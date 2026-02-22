import api from '../api/api'
import Loading from '../components/UI/Loading';
import  { useEffect, useState } from 'react';
import { FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FaSquareInstagram } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'timeago.js';

 
const Profile = () => {
  const [myListing,setMyListing]=useState([]);
  const [loading,setLoading]=useState(false);
  const {user}=useSelector(state=>state.User);

  useEffect(()=>{
    const getMyListing=async()=>{
      try {
        setLoading(true);
      const res =await api.get(`/item/my-list`);

       if(res.data.success){
         setMyListing(res.data.items);
       }

      } catch (err) {
        console.log("error:",err.response?.data?.msg );
      }finally{
        setLoading(false);
      }
    }
     getMyListing();
   },[])
 
   const deleteItem=async(id)=>{
    if (!window.confirm("Are you sure you want to delete this?")) return;
     try {
     const res= await api.delete(`/item/delete-item/${id}`)
     if(res.data.success){
      setMyListing(prev=> 
        prev.filter((item)=> item._id !== id));
     }

     } catch (error) {
       console.log(error.response?.data);
     }
   }

   const Name=user?.firstName?`${user.firstName} ${user.lastName}`: "Guest User";
   const memberSince = user?.createdAt ? new
   Date(user.createdAt).getFullYear()
  : "N/A";
  const navigate = useNavigate();
  if(loading) return <Loading/>

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      {/* Sidebar Profile Info */}
      <div className="md:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center h-fit">
        <div className="w-32 h-32 rounded-full border-4 border-blue-50 overflow-hidden mb-4 shadow-inner">
          <img src={user?user.profilePic :`/images/profile.jpg`} alt="profile" className="w-full h-full object-cover" />
        </div>
        <div className="content">
          <h1 className="text-2xl font-bold text-gray-800">{Name}</h1>
          <p className="text-gray-500 mb-4">Member since {memberSince}</p>
          <Link 
            to="/profile/edit" 
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </Link>
             {/* Social Media */}
        <div className='mt-2'>
          <h3 className=" font-semibold mb-4 uppercase tracking-wider text-sm">Connect With Us</h3>
          <div className="flex justify-center md:justify-start gap-4">
            <a href="#" className="p-2 rounded-full bg-blue-600 text-white ">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="p-2 bg-blue-400 rounded-full text-white">
              <FaLinkedin size={20} />
            </a>
            <a href="#" className="p-2 rounded-full bg-pink-600 text-white">
              <FaSquareInstagram size={20} />
            </a>
            <a href="#" className="p-2 rounded-full bg-sky-500 text-white">
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
              
        </div>
      </div>
    
      {/* Main Content Area: Listings */}
     
     <div className="md:w-2/3">
        <h2 className="text-xl font-bold mb-6 text-gray-800">My Listings</h2>
        
        {myListing.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
            <h1 className="text-lg font-semibold text-gray-700 mb-2">You haven't listed anything yet</h1>
            <p className="text-gray-500 mb-6">Let go of what you don't use anymore.</p>
            <button 
              onClick={() => navigate('/rent-items')}
              className="bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-black transition-all"
            >
              Start Renting
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {myListing.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <img src={item.images[0].url} alt={item.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-blue-600 font-bold">₹{item.price.amount}<span className="text-gray-400 text-sm font-normal"> /{item.price.type}</span></p>
                    <p className="text-gray-500 text-sm flex items-center">
                     {format(item.createdAt)}
                    </p>
                  </div>
                  <div className='text-xl text-center mt-3  text-gray-100 flex justify-around'>
                  <button type="submit"
                  className='px-4 py-1 cursor-pointer rounded-2xl bg-blue-500'>Edit</button>

                   <button onClick={()=>deleteItem(item._id)}
                   
                  className='px-4 py-1 cursor-pointer rounded-2xl bg-red-500'>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
       
      
   
    </div>
  );
};

export default Profile;
