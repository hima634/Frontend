import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
  name: "Location",
  initialState: {
    lat: null,
    lng: null,
    address_display: "",
    city: "",
    isLocationSelected: false,
    isLocationLoaded: false,
  },
  reducers: {
    addLocation: (state, action) => {
      state.lat = action.payload.lat;
      state.lng = action.payload.lng;
      state.address_display = action.payload.address_display || "";
      state.city=action.payload.city,
      state.isLocationSelected = true;
      state.isLocationLoaded = true;
    },

    clearLocation: (state) => {
      state.lat = null;
      state.lng = null;
      state.address_display = "";
      state.city="",
      state.isLocationSelected = false;
    },
    setLocationLoaded: (state) => {
      state.isLocationLoaded = true;
    },
  },
});

export default locationSlice.reducer;
export const { addLocation, clearLocation,setLocationLoaded } = locationSlice.actions;
