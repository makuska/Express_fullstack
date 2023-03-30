# docker_mongo_react_express
### An app which is running on 3 docker containers
This app runs:
- ExpressJS for backend. On port **8080**
- MongoDB as noSQL database on port **27017**
- React App for frontend on port **3000**

### The database
To connect to MongoDB from backend/ExpressJS you have to use this connection link:
`mongodb://root:pass123@host.docker.internal:27017/?authMechanism=DEFAULT&authSource=admin`
You have to notice that we use `host.docker.internal` instead of `localhost`.
Create a database in MongoDB. On this case is **Stefan**. The basic structure for the data in MongoDB will be
![bilde](https://user-images.githubusercontent.com/20992080/228765734-cc8efad2-3099-44b7-bf43-f551d47c4500.png)


# Run the containers
To run the containers, go to root folder and run:

`docker-compose up`


**Ctrl+C** - to stop the Docker containers.
