# TODO list
since the auth is very broken, here's a list of things that need to be finished in order
2. ~~The `verifyRefreshToken` endpoint is broken, the useEffect inside the `useAuth` hook might have logic errors. **TODOs** are written above the function.~~ ==**SOLVED**== This is caused by the browser.
4. ~~`logout` doesn't work either, the request hangs and the cookie is also `undefined`. **==EDIT==** Logout doesn't work because of the `revokeToken` function, which doesn't correctly revoke tokens (it did in the past), but goes straight to the `catch error` code block.~~ Didn't send the request back to the client ==**SOLVED**==
5. ~~Throwing errors inside the `tokenRepository` seems kind of odd, at some instances maybe it stops the entire code flow, but instead it should handle errors more elegantly.~~ ==**SOLVED**== Returns error messages instead.
6. ~~`Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client` Error on both backend auth endpoints.~~ ==**SOLVED**== rewrote the logic and error handling. `tokenRotation` and middleware both returned headers.


1. When the user logs in and is redirected to authenticated route and then navigates to NON-auth route the user is 'logged out'. Although the refreshToken is still available in the cookie.
3. The `user` is always undefined inside the `AuthenticatedRoute`, and since it's undefined, it is impossible to navigate back to authenticated routes. This should also be the reason why the user is always navigated to the `/login` page after he goes from the dashboard to NON-auth route and tries to navigate back to the auth route. This is a followup to the first issue.
7. The user should be automatically logged in when he has a valid refreshToken. ==**EDIT**== this might be a future task since frontend code/logic needs to be rewritten. There shouldn't be a separate dashboard component.