const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const PORT = 8080;
const  ObjectId = require('mongodb').ObjectId;


const bodyParser = require('body-parser');
var cors = require("cors");

const app = express();
//Astea doua pe care le-am adus s-ar putea sa mearga, s-ar putea sa nu; le-am vazut intr-un video si le-am adaugat aici
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000'
})); // inspirat de aici: https://medium.com/zero-equals-false/using-cors-in-express-cac7e29b005b
/*
const url = 'mongodb://host.docker.internal:27017';
const dbName = 'Stefan'; */


async function connectare(){
  return await MongoClient.connect('mongodb://root:pass123@host.docker.internal:27017/?authMechanism=DEFAULT&authSource=admin',  { useNewUrlParser: true, useUnifiedTopology: true });
}

console.log("We are connected, bro!");

app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});


// ROUTES

app.get('/', (req, res)=>{
    let contentIndex = "<h1>Hello!</h1>Dette er REST API serveren, med Express. Test <a href='/usersbyclient'>here</a>!";
    contentIndex = contentIndex + "<p>The connection with MongoDB is up and running.</p>";
    res.set('Content-Type', 'text/html');
    res.send(contentIndex);
});


app.get('/users', async (req, res) => {
  /*
   * Requires the MongoDB Node.js Driver
   * https://mongodb.github.io/node-mongodb-native
   */
  const filter = {};
  const client = await connectare();
  const coll = client.db('Stefan').collection('User');
  const cursor = coll.find(filter);
  const result = await cursor.toArray();
  await client.close();
  res.json(result);
});


app.get('/user/search/:word', async (req, res) => {
  const filter = { 'name': new RegExp(req.params.word) };
  const projection = {
   _id: 0,
   name: 1,
 };
  const client = await connectare();
  const coll = client.db('Stefan').collection('User');
  const cursor = coll.find(filter).project(projection);
  //const cursor = coll.find(filter);
  const result = await cursor.toArray();
  await client.close();
  res.json(result);
});



app.get('/user/:id', async (req, res) => {
  const filter = {_id: new ObjectId(req.params.id)};
  const client = await connectare();
  const coll = client.db('Stefan').collection('User');
  const cursor = coll.find(filter);
  const result = await cursor.toArray();
  await client.close();
  res.json(result);
});


app.get('/user/name/:name', async (req, res) => {
  const filter = { 'name': req.params.name };
  const client = await connectare();
  const coll = client.db('Stefan').collection('User');
  const cursor = coll.find(filter);
  const result = await cursor;
  await client.close();
  res.json(result);
});



app.post('/user/add', async (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  const client = await connectare();
  const coll = client.db('Stefan').collection('User');
  try {
    await coll.insertOne({
      name: name,
      email: email
    });
    res.sendStatus(204);
  } catch (error){
    throw res.status(500).json({message: "Server error occured!"});
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
  const client = await connectare();
  const coll = client.db('Stefan').collection('User');
  try {
    console.log("Se modifica obiectul : " + query);
    console.log("Se aduc modificarile astea: " + JSON.stringify(updates));
    await coll.updateOne(query, updates);
    res.status(204).json({status:"Success", message: "The User was successfully updated."});
  } catch (error){
    throw res.status(500).json({message: "Server error occured!"});
  } finally {
    await client.close();
  }
});


app.delete('/user/delete/:id', async (req, res) => {
  const filter = {_id: new ObjectId(req.params.id)};
  const client = await connectare();
  const coll = client.db('Stefan').collection('User');
  try {
    await coll.deleteOne(filter);
    res.status(200).send({status: "Success", message: "The User has been deleted. User id: " + req.params.id + ". "});
  } catch (error){
    throw res.status(500).json({message: "Server error occured!"});
  } finally {
    await client.close();
  }
});



// ****************************************************************



// Sa vedem de unde facem rost de documentatie
// Asta ar fi una, care este cumva, grestia; la mine nu merge; dar poate sa imi dea idei:
// ***     https://www.mongodb.com/languages/express-mongodb-rest-api-tutorial
