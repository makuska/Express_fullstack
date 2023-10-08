import {Navigate} from "react-router-dom";
import useAuth from "../hooks/useAuth.tsx";

// @ts-ignore
function AuthenticatedRoute({ children }) {
  const {user} = useAuth()
  console.log(`Authenticated route, user details: ${user}`)
  if (!user) {
    return <Navigate to='/login' />;
  }
  return children;
}

export default AuthenticatedRoute