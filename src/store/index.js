import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./Login";
// import itemReducer from "./Item";
import categoryReducer from "./Categories"
import userReducer from "./User"
import locationReducer from "./Location"

const store = configureStore({

  reducer: {
    Login: loginReducer,
    // Items: itemReducer,
    Categories:categoryReducer,
    User:userReducer,
    Location:locationReducer
  },
 
  devTools: true,
});
export default store;
