import { createSlice } from "@reduxjs/toolkit";

const payload=[ 
  {  
    name: "Power Tools",
    img: "/images/drill.jpg",
    subItems: [
       {name:'Drilling & Driving',
       img:"/images/drill.jpg"
       },
      {name: 'Heat Gun',
       img:"/images/heatgun.jpg"
     },
      {name:'Pressure Washer',
        img:"/images/pressure.jpg"
      }, 
      {name: 'Chainsaw',
        img:"/images/chainsaw.jpg"
      },
       {name:'Generator',
          img:"/images/generator.jpg"
       },
     ],
    icon:"FaTools"
  },
 { 
   name: "Electronics",
   img: "/images/electronics.jpg",
   subItems:[
     {name:'Camera',
        img:"/images/camera.jpg"
     }, 
     {name:'Lens',
        img:"/images/lens.jpg"
     },
     { name: 'Laptop',
        img:"/images/laptop.jpg"
     },
      {name:'VR',
        img:"/images/vr.jpg"
      }],
    icon: "FaLaptop"
  },
 { 
   name: "Construction", 
   img: "/images/ladder.jpg",
  subItems: [
  { name:'Ladder',
    img:"/images/ladder.jpg"
  }, 
  {name:'Concrete Mixer',
    img:"/images/concretemixture.jpg"
  },
   {name:'Rock Breaker',
      img:"/images/rockbreaker.jpg"
   }
 ],
   icon: "FaBuilding"
 },
 { 
   name: "Home Tools",
   img: "/images/hometools.jpg",
   subItems: [
    {name: "Hammer", 
     img:"/images/hammer.jpg"}, 
     {name:"Utility Knife",
        img:"/images/utilityknife.jpg"
     },
      {name:"Tape Measure",
        img:"/images/tapemeasure.jpg"
      }, 
     { name:"Screwdriver",
        img:"/images/screwdriver.jpg"
     }, 
     {name: "Cordless Drill",
        img:"/images/drill.jpg"
     }],
   icon:"FaTools"
  },
 { name: "Medical Devices",
   img: "/images/medical-device.jpg",
   subItems: [
   { name: 'Blood Pressure',
      img:"/images/bloodpressure.jpg"
   },
    {name:'Pulse Oximeter',
      img:"/images/pulseoximeter.jpg"
    }, 
    {name:'Glucometer',
      img:"/images/glucometer.jpg"
    }
   ],
   icon:"FaHeartbeat"
 }, 
 { name: "Vehicle",
   img: "/images/bike.jpg",
   subItems: [
   { name: "Car",
      img:"/images/car.jpg"
   },
   {name :"Bike",
      img:"/images/bike.jpg"
   }, 
  { name:"Cycle",
    img:"/images/cycle.jpg"
  }],
   icon:"FaCar"
 }, 
 ];

const categorySlice = createSlice({
  name: "Categories",
  initialState: {
    list: payload,          // all categories
    selectedCategory: null, // for filter
    selectedSubItem: null,  // for filter
  },
  reducers: {
    getCategory: (state) => {
      return state;
    },
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.selectedSubItem = "";
    },

    setSubItem: (state, action) => {
      state.selectedSubItem = action.payload;
    },

    clearFilter: (state) => {
      state.selectedCategory = null;
      state.selectedSubItem = null;
    },
  },
});
export default categorySlice.reducer;
export const { setCategory, setSubItem, clearFilter } = categorySlice.actions;
