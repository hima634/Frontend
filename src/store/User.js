import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "User",
  initialState:{
    user:null,
    isLoggedIn:false,
    showProfile:false,
    authLoading: true,
   },
  reducers: {
     loginUser:(state,action)=>{
      state.user = action.payload;
      state.isLoggedIn=true;
      state.authLoading = false;
     },
     logoutUser: (state) => {
      state.user = null;
      state.isLoggedIn=false;
      state.showProfile=false;
      state.authLoading = false;
    },
    updateUser: (state, action) => {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
    },
    toggleProfile: (state) => {
      state.showProfile = !state.showProfile;
    },
    addFavorite:(state,action)=>{
      if (!state.user.wishlist.includes(action.payload)) {
        state.user.wishlist.push(action.payload);
      }
    },
    removeFavorite:(state,action)=>{
      state.user.wishlist=state.user.wishlist.filter(id=> id!==action.payload);
    }
  },
});
export default userSlice.reducer;
export const {logoutUser,updateUser,
  loginUser,toggleProfile,authLoading,addFavorite,removeFavorite} = userSlice.actions;
