// import { createSlice } from "@reduxjs/toolkit";
// import { fetchItemsThunk } from "./itemsThunk";

// const itemSlice = createSlice({
//   name: "Items",

//   initialState: {
//     items: [],
//     loading: false,
//     error: null,
//   },

//   reducers: {
//     removeItem: (state, action) => {
//       state.items = state.items.filter(
//         (item) => item._id !== action.payload
//       );
//     },

//     clearItems: (state) => {
//       state.items = [];
//     },
//   },

//   extraReducers: (builder) => {
//     builder

//       // ✅ Loading Start
//       .addCase(fetchItemsThunk.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })

//       // ✅ Success
//       .addCase(fetchItemsThunk.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload;
//       })

//       // ❌ Failed
//       .addCase(fetchItemsThunk.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default itemSlice.reducer;

// export const { removeItem, clearItems } = itemSlice.actions;
