# SOLVED!
Database connection error!

Error when refreshing/rotating refreshTokens:

console.log:
```bash
docker_mongo_react_express-backend-1        | Error while rotating refresh token: Error: Error: TypeError: Cannot read properties of undefined (reading 'collection')
docker_mongo_react_express-backend-1        |     at checkIfRefreshTokenIsRevoked (file:///app/repository/tokenRepository.js:20:15)
docker_mongo_react_express-backend-1        |     at rotateRefreshToken (file:///app/services/tokenRotation.js:32:50)
docker_mongo_react_express-backend-1        |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
docker_mongo_react_express-backend-1        |     at async file:///app/middleware/authJWT.js:28:48
```

request:
```bash
➜  components git:(main) curl -i -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MDJlMzY1NGFhZmQ4NGYwODBlNzY4YiIsInJvbGUiOiJhZG1pbiIsInRva2VuX2lkIjoiMDNjMjRlMDctOWQ4My00MmM4LWJjNDYtZDRlOWM1MjVkZWNlIiwiaWF0IjoxNjk3MjI0ODkxLCJleHAiOjE2OTcyMjUwMTF9.RYwvS31WgBsklNH6tuUdzkDeUk0IURPdjLar7p2GACA" -b "refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MmQ4MzM3Y2FlMWY4MTdmNDg5YTI3NSIsInJvbGUiOiJ1c2VyIiwidG9rZW5faWQiOiI4OTlmNmNkYi04YjMwLTQ2YmYtODg0YS1hMzBiMWJiODExNDUiLCJpYXQiOjE2OTc0ODE1ODAsImV4cCI6MTY5ODY5MTE4MH0.dzFANLORUMIavP7Y3Gt60x9y1oqAXc5hmZyB0pjmLR8" localhost:8080/isUser
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Access-Control-Allow-Credentials: true
Content-Type: application/json; charset=utf-8
Content-Length: 48
ETag: W/"30-VIV76xNYmK1cHI3jrOyvSquGIi4"
Date: Wed, 18 Oct 2023 10:31:31 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"Unable to verify the refresh token"}% 
```
