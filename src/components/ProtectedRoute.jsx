import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "./UI/Loading";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn,authLoading } = useSelector((state) => state.User);
  
  if (authLoading) {
    return <div><Loading/></div>;  
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
