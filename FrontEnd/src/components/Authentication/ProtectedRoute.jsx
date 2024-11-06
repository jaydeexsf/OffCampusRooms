import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react"; 
import Loader from '../../pages/Loader'

const ProtectedRoute = ({ children, adminOnly }) => {
  const { isSignedIn, isLoaded, user } = useUser(); 

  if (!isLoaded) {
    return <div className="bg-gray-900 min-h-screen w-full"><Loader /></div>; 
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