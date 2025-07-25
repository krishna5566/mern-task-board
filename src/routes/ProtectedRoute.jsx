// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/NewContext";

// const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();
//   console.log("user", user)
//   return user ? children : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;


import { Navigate } from "react-router-dom";
import { useAuth } from "../context/NewContext"; 

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; 

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
