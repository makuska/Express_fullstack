import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {useNavigate, useLocation, NavigateFunction} from "react-router-dom";
import {User} from "../types/authTypes.ts";
import {frontendUserLogin, frontendUserLogout} from "../services/authService.ts";
import {useLocalStorage} from "./useLocalStorage.ts";

interface AuthContextType {
  user?: User;
  loading: boolean;
  error?: any;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext: React.Context<AuthContextType> = createContext<AuthContextType>(
  {} as AuthContextType
);

// Export the provider as we need to wrap the entire app with it
export function AuthProvider({children}: { children: ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  const navigate: NavigateFunction = useNavigate();
  const location = useLocation();
  const {getItem} = useLocalStorage()

  // Reset the error state if we change page
  useEffect(() => {
    if (error) setError(undefined);
  }, [location.pathname]);

  // Check if there is a currently active session
  // when the provider is mounted for the first time.
  //
  // If there is an error, it means there is no session.
  //
  // Finally, just signal the component that the initial load
  // is over.
  useEffect(() => {
    let user: string | null = getItem('user')
      if(user) {
        setUser(JSON.parse(user))
      }
      else {
        ((_error: any) => {})
      }
      setLoadingInitial(false);
  }, []);

  // Flags the component loading state and posts the login
  // data to the server.
  //
  // An error means that the email/password combination is
  // not valid.
  //
  // Finally, just signal the component that loading the
  // loading state is over.
  function login(username: string, password: string) {
    setLoading(true);

    frontendUserLogin(username, password)
      .then((resUser: User | null) => {
        if (resUser) {
          // console.log(resUser)
          setUser(resUser);
          navigate("/dashboard");
        } else {
          setError("Login failed. Please check your credentials.");
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  // // Sends sign up details to the server. On success we just apply
  // // the created user to the state.
  // function signUp(email: string, name: string, password: string) {
  //   setLoading(true);
  //
  //   usersApi.signUp({ email, name, password })
  //     .then((user) => {
  //       setUser(user);
  //       history.push("/");
  //     })
  //     .catch((error) => setError(error))
  //     .finally(() => setLoading(false));
  // }

  // Call the logout endpoint and then remove the user
  // from the state.
  function logout() {
    frontendUserLogout().then(() => setUser(undefined));
  }

  // Make the provider update only when it should.
  // We only want to force re-renders if the user,
  // loading or error states change.
  //
  // Whenever the `value` passed into a provider changes,
  // the whole tree under the provider re-renders, and
  // that can be very costly! Even in this case, where
  // you only get re-renders when logging in and out
  // we want to keep things very performant.
  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
    }),
    [user, loading, error]
  );

  // We only want to render the underlying app after we
  // assert for the presence of a current user.
  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
}

// Let's only export the `useAuth` hook instead of the context.
// We only want to use the hook directly and never the context component.
export default function useAuth() {
  return useContext(AuthContext);
}