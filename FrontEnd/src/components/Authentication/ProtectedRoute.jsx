import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react"; // Import Clerk's useUser hook

const ProtectedRoute = ({ children, adminOnly }) => {
  const { isSignedIn, isLoaded, user } = useUser(); // Use Clerk's useUser to get authentication status and user

  // Wait until the user data is fully loaded
  if (!isLoaded) {
    return <div>Loading...</div>; // You can add a better loading spinner or animation here
  }

  // If the user is not signed in, redirect to login
  if (!isSignedIn) {
    return <Navigate to="/login" />;
  }

  // Check if the user is an admin
  const isAdmin = user?.publicMetadata?.role === "admin"; // Fetch the admin role from public metadata

  // Redirect non-admin users if this is an admin-only route
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  // If the user is an admin, you can redirect to the admin panel or just let them access the route
  // Comment out this part if you don't want this specific redirect
//   if (isAdmin && adminOnly) {
//     return <Navigate to="/admin" />;
//   }

  // If the user is authorized, render the children components
  return children;
};

export default ProtectedRoute;