import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "Login",
  initialState: { isLogIn: true, showProfile: false },
  reducers: {
    getLogin: (state) => {
      state.isLogIn = !state.isLogIn;
    },
    getShowProfile: (state) => {
      state.showProfile = !state.showProfile;
    },
  },
});
export default loginSlice.reducer;
export const loginActoin = loginSlice.actions;
