# docker_mongo_react_express
### An app which is running on 3 docker containers
This app runs:
- Express.js for backend. On port **8080**
- MongoDB as noSQL database on port **27017**
- React App for frontend on port **5173**

### The database
To connect to MongoDB from backend/ExpressJS you have to use this connection link:
`mongodb://root:pass123@host.docker.internal:27017/?authMechanism=DEFAULT&authSource=admin`
Because the mongodb is running inside Linux container, `localhost` needs to be replaced with `host.docker.internal`.


To connect to the mongoDB, install the mongo GUI or CLI.
For CLI to connect to the database, use the command:
`./mongosh "mongodb://root:pass123@localhost:27017/?authMechanism=DEFAULT&authSource=admin"`

<br>[link to the CLI docs](https://www.mongodb.com/docs/mongodb-shell/connect/#std-label-mdb-shell-connect)

### Test the running mongo database
This request works for /user endpoint
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "johndoe@example.com"
  }' \
  http://localhost:8080/user/add
```

This request works for /api/v1/posts endpoint
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "postTitle": "Test Post Title",
    "postAuthor": "John Doe", 
    "postBody": "lorem ipsum is the new language of the future world"         
  }' \
  http://localhost:8080/api/v1/posts/
```

#### Express mongo REST API tutorial
https://www.mongodb.com/languages/express-mongodb-rest-api-tutorial

#### `app.get()` vs express `router.get()`
https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get

#### Mongoose vs Mongodb Driver
https://www.mongodb.com/developer/languages/javascript/mongoose-versus-nodejs-driver/

#### Schema validation
https://www.mongodb.com/community/forums/t/schema-validation-good-practice-or-not/122231/6

#### Schema validation using Joi
https://dev.to/jeffsalive/the-right-way-to-use-joi-validator-in-your-nodejs-express-application-147g

#### Docker `<none>:<none>` images
https://projectatomic.io/blog/2015/07/what-are-docker-none-none-images/

#### Express project structure
https://blog.logrocket.com/organizing-express-js-project-structure-better-productivity/

#### The importance of Data Validation (express, Joi example)
https://www.youtube.com/watch?v=bfqCQFD9L6k

#### Joi vs Mongoose (or both together?)
You don't have to use a schema validation package like Joi.

But it would be good to use both of them. They compliment each other.

Joi is used for APIs to make sure that the data the client sends is valid. And mongoose schema is used to ensure that our data is in right shape.

A scenario where API validation with Joi makes sense:

We generally hash the user password, so in our user schema the maxlength option of the password can much bigger than the actual password length. So with Joi we can validate the password field so that it can't be greater than for example 10 characters in a login route.

A scenario where mongoose schema validation makes sense:

Let's say the client sent a valid data, it is possible that we forgot to set a property when we create a document. If we hadn't a required: true option in the mongoose schema for that field, the document would be created without that field.

Also validating the client data as soon as possible is good for security and performance before hitting the database.

The only downside of using both is some validation duplication. But it seems they created a package called joigoose to create a mongoose schema from a Joi schema.


### `return res.send()...` vs `res.send()...`
https://dev.to/adamkatora/why-you-should-always-use-return-before-ressend-in-express-apis-and-applications-k9k
In Express, calling the `res.send()` method only sends a response to the client, it does not exit the current function.

In an application of this size, it's very easy to spot the error before it occurs. But, in larger more complex applications it's very easy to imagine a situation where this could get overlooked leading to errors in the code.

Fortunately, in this case the fix is simple. I even included it in the title. The only update we'd need to make to our code is to append a `return` statement before the `res.send()` calls.

#### Token authentication
https://www.youtube.com/watch?v=6ZCU4QetVTs

### jwt `decode()` vs `verify()`
https://community.auth0.com/t/does-jwt-decode-functionality-verify-the-token-or-only-decode-the-token-if-yes-what-all-does-the-decode-function-do/9509/2
`decode` pretty much just decodes the token, it doesn't verify the signature, and should only be used on trusted messages (**sync**)

`verify` on the other hand decodes the token and verifies the signature (**async**)

curl token:
```bash
curl -i -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MDJlMzY1NGFhZmQ4NGYwODBlNzY4YiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5NTI4ODMwMywiZXhwIjoxNjk1Mjg4NDIzfQ.9T-39WCqaPj076Vta7JjDF1n5rjLbPykHmdqhovzlHg" -b "refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MDJlMzY1NGFhZmQ4NGYwODBlNzY4YiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5NTI4ODMwMywiZXhwIjoxNjk2NDk3OTAzfQ.mtgj_B2M5W6OTRt_x-NNVKWWDRs1pMr2Jmib8AAkhDY" localhost:8080/isAdmin2
```

### Deep dive into react hooks
https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/

### React `useContext` hook in auth
https://dev.to/dayvster/use-react-context-for-auth-288g

### Multithreading vs asynchronous coding Spring example
If you're asking in a webdev context, the Spring framework (which is a very popular Java web framework) is inherently multi-threaded. Each request to the controller will spawn a thread. Explicit multi-threading can be done via the @Async annotated method. It is very rare to explicitly code the multi-threading stuff manually.

However, if you're not using the Spring framework, then it might be a different story.

I can give you 2 example use-cases where I did multi-threading recently (#1 is using Futures, #2 is using @Async method):

Client UI calls a search API; backend master thread spawn 4 child threads to call 4 different search provider in parallel, which will return the search results from different modules; when all 4 threads are completed, master thread will combine the search results and respond back to frontend.

Client UI uploads an excel file for importing data; backend master thread stores the file, spawn a child thread to process the file data, then immediately returns a response to UI without waiting for the file to be fully processed. The child thread will continue to process the file into the DB in the background.