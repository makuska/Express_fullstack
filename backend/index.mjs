import express from 'express'
import { config as dotenvConfig } from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import cookieParser from 'cookie-parser'

// Routes
import postsRouter from "./routes/posts.mjs";
import usersRouter from "./routes/users.mjs";
import userRoute from "./routes/user.js";
// Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger-config.mjs';

// Utils
import cors from 'cors';

const app = express();
dotenvConfig();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser())
app.use(cors({
  origin: `http://localhost:${process.env.FRONTEND_PORT}`,
  credentials: true
}));

const dbName = 'Database';


async function connectToDB(){
  return await MongoClient.connect(process.env.MONGO_URI,  { useNewUrlParser: true, useUnifiedTopology: true });
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); //currently empty

app.use(process.env.POSTS_API, postsRouter)
app.use(process.env.USERS_API, usersRouter)
app.use(userRoute)

app.listen(process.env.BACKEND_PORT, () => {
  console.info('Server listening on port ' + process.env.BACKEND_PORT);
});


app.get('/', (req, res)=>{
    let contentIndex = "<p>The connection with MongoDB is up and running.</p>";
    contentIndex += `<br>Go to the frontend <a href="http://localhost:${process.env.FRONTEND_PORT}/">UI</a>`
    res.set('Content-Type', 'text/html');
    res.send(contentIndex);
});


app.get('/user/search/:word', async (req, res) => {
  const filter = { 'name': new RegExp(req.params.word) };
  const projection = {
   _id: 0,
   name: 1,
 };
  const client = await connectToDB();
  const coll = client.db(dbName).collection('User');
  const cursor = coll.find(filter).project(projection);
  //const cursor = coll.find(filter);
  const result = await cursor.toArray();
  await client.close();
  res.json(result);
});



app.post('/user/add', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const client = await connectToDB();
  const coll = client.db(dbName).collection('User');
  try {
    await coll.insertOne({
      name: name,
      email: email
    });
    res.sendStatus(204);
  } catch (error){
    throw res.status(500).json({message: "Server error occurred!"});
  } finally {
    await client.close();
  }
});


app.patch('/user/update/:id', async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  var name = req.body.name;
  var email = req.body.email;
  const updates = {
    $set: { name: name, email: email }
  };
  const client = await connectToDB();
  const coll = client.db(dbName).collection('User');
  try {
    console.log("Se modifica obiectul : " + query);
    console.log("Se aduc modificarile astea: " + JSON.stringify(updates));
    await coll.updateOne(query, updates);
    res.status(204).json({status:"Success", message: "The User was successfully updated."});
  } catch (error){
    throw res.status(500).json({message: "Server error occurred!"});
  } finally {
    await client.close();
  }
});


app.delete('/user/delete/:id', async (req, res) => {
  const filter = {_id: new ObjectId(req.params.id)};
  const client = await connectToDB();
  const coll = client.db(dbName).collection('User');
  try {
    await coll.deleteOne(filter);
    res.status(200).send({status: "Success", message: "The User has been deleted. User id: " + req.params.id + ". "});
  } catch (error){
    throw res.status(500).json({message: "Server error occurred!"});
  } finally {
    await client.close();
  }
});

