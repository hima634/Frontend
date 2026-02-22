// import { createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../api/api"; // axios instance

// // ✅ Fetch All Items
// export const fetchItemsThunk = createAsyncThunk(
//   "Items/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get("/item/getAll");

//       return res.data.items; // return only items array
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.msg || "Failed to fetch items"
//       );
//     }
//   }
// );
