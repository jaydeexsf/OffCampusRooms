import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react"; 

const ProtectedRoute = ({ children, adminOnly }) => {
  const { isSignedIn, isLoaded, user } = useUser(); 

  if (!isLoaded) {
    return <div className="border-gray-600 border-t-black border-2 animate-spin"></div>; 
  }

  if (!isSignedIn) {
    return <Navigate to="/login" />;
  }

  const isAdmin = user?.publicMetadata?.role === "admin"; 

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;