import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/User";
import api from "../api/api";
import { addLocation, setLocationLoaded } from "../store/Location";


const AuthAutoLogin = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/user/me");
        dispatch(loginUser(res.data.user));
      } catch (err) {
        // dispatch(logoutUser());
      }
      const savedLocation = localStorage.getItem("userLocation");

      if (savedLocation) {
        dispatch(addLocation(JSON.parse(savedLocation)));
      }

      // 3️⃣ Mark location ready (VERY IMPORTANT)
      dispatch(setLocationLoaded());
  
    };

    loadUser();
  }, []);

  return null;
};

export default AuthAutoLogin;
