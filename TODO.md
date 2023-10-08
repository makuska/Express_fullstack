# TODO list
since the auth is very broken, here's a list of things that need to be finished in order
1. When the user logs in and is redirected to authenticated route and then navigates to NON-auth route the user is 'logged out'. Although the refreshToken is still available in the cookie.
2. The `verifyRefreshToken` route is broken, the useEffect inside the `useAuth` hook might not seem the best option. **TODOs** are written above the function.