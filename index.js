const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = 3000;


const app = express();
app.use(cors());
app.use(express.json())


// Mongodb connect


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://127.0.0.1:27017";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // All the backend wroks will start from here. 

    // Creating database
    const database = client.db('CampusBazar-CSE470-DB')


    // creating collections for users
    const userCollections = database.collection('user')
    // creating collections for listings
    const listingCollections = database.collection('listings')
    // saving the user to db
    app.post('/users', async (req, res) => {
      const userInfo = req.body;
      userInfo.role = "general user"
      userInfo.createdAt = new Date();


      const result = await userCollections.insertOne(userInfo);

      res.send(result)
    })

    // Getting role of the current user
    app.get('/users/role/:email', async (req, res) => {
      const { email } = req.params

      const query = { email: email }
      const result = await userCollections.findOne(query)
      res.send(result)
    })

    // Get all users
    app.get('/users', async (req, res) => {
      const result = await userCollections.find().toArray();
      res.send(result);
    })

    // Update user role
    const { ObjectId } = require('mongodb');

    app.patch('/users/:id', async (req, res) => {
      const { id } = req.params;
      const { role } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: { role } };
      const result = await userCollections.updateOne(filter, updateDoc);
      res.send(result);
    })

    // Delete a user
    app.delete('/users/:id', async (req, res) => {
      const { id } = req.params;
      const filter = { _id: new ObjectId(id) };
      const result = await userCollections.deleteOne(filter);
      res.send(result);
    })

    // Listings routes
    // Add a new listing
    app.post('/listings', async (req, res) => {
      const listingInfo = req.body;
      listingInfo.createdAt = new Date();

      const result = await listingCollections.insertOne(listingInfo);
      res.send(result);
    })

    // Get all listings
    app.get('/listings', async (req, res) => {
      const result = await listingCollections.find().toArray();
      res.send(result);
    })

    // Get listings by email (user's listings)
    app.get('/listings/:email', async (req, res) => {
      const { email } = req.params;
      const query = { email: email };
      const result = await listingCollections.find(query).toArray();
      res.send(result);
    })

    // Get single listing by ID
    app.get('/listing/:id', async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await listingCollections.findOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


// check server
app.get('/', (req, res) => {
  res.send("Server is on")
})

app.listen(port, () => {
  console.log(`server is running on ${port}`);
})


