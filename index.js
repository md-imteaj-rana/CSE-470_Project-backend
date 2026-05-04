const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = 3000;


const app = express();
app.use(cors());
app.use(express.json())


// Mongodb connect


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://campusbazar470:CampusBazarCse470@pawmarta10.t0jzost.mongodb.net/?appName=PawMartA10";

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
    // All the backend wroks will start from here. 

    // Creating database
    const database = client.db('CampusBazar-CSE470-DB')

    // creating collections
    const userCollections = database.collection('user');

    // ================= FAHIM'S COLLECTIONS START =================
    // Feature: My Cart and My Orders
    const cartCollections = database.collection('cart');
    const orderCollections = database.collection('orders');
    // ================= FAHIM'S COLLECTIONS END =================

    const listingCollections = database.collection('listings');


    // saving the user to db
    app.post('/users', async (req, res) => {
      const userInfo = req.body;
      userInfo.role = "general user";
      userInfo.createdAt = new Date();

      const result = await userCollections.insertOne(userInfo);
      res.send(result);
    });

    // Getting role of the current user
    app.get('/users/role/:email', async (req, res) => {
      const { email } = req.params;

      const query = { email: email };
      const result = await userCollections.findOne(query);
      res.send(result);
    });

    // Get all users
    app.get('/users', async (req, res) => {
      const result = await userCollections.find().toArray();
      res.send(result);
    });

    // Update user role
    const { ObjectId } = require('mongodb');

    app.patch('/users/:id', async (req, res) => {
      const { id } = req.params;
      const { role } = req.body;

      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: { role } };

      const result = await userCollections.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Delete a user
    app.delete('/users/:id', async (req, res) => {
      const { id } = req.params;

      const filter = { _id: new ObjectId(id) };
      const result = await userCollections.deleteOne(filter);

      res.send(result);
    });

    // ================= LISTINGS ROUTES =================
    // Get all listings
    app.get('/listings', async (req, res) => {
      const result = await listingCollections.find().sort({ createdAt: -1 }).toArray();
      res.send(result);
    });

    // Get listings by user email
    app.get('/listings/:email', async (req, res) => {
      const { email } = req.params;
      const query = { email: email };
      const result = await listingCollections.find(query).sort({ createdAt: -1 }).toArray();
      res.send(result);
    });

    // Get a single listing by ID
    app.get('/listing/:id', async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: 'Invalid ID format' });
        }
        const filter = { _id: new ObjectId(id) };
        const result = await listingCollections.findOne(filter);
        res.send(result);
      } catch (error) {
        console.error('Error fetching listing by ID:', error);
        res.status(500).send({ error: 'Internal server error' });
      }
    });

    // Create a new listing
    app.post('/listings', async (req, res) => {
      const listingData = req.body;
      listingData.createdAt = new Date();
      
      const result = await listingCollections.insertOne(listingData);
      res.send(result);
    });
    // ================= END LISTINGS ROUTES =================


    // ================= FAHIM'S PART START =================
    // Feature: My Cart and My Orders backend


    // ================= CART ROUTES - FAHIM =================

    // Add item to cart
    app.post('/cart', async (req, res) => {
      const cartItem = req.body;

      cartItem.createdAt = new Date();

      const result = await cartCollections.insertOne(cartItem);
      res.send(result);
    });

    // Get cart items by user email
    app.get('/cart/:email', async (req, res) => {
      const { email } = req.params;

      const query = { email: email };
      const result = await cartCollections.find(query).toArray();

      res.send(result);
    });

    // Update cart item quantity
    app.patch('/cart/:id', async (req, res) => {
      const { id } = req.params;
      const { quantity } = req.body;

      const filter = { _id: new ObjectId(id) };

      const updateDoc = {
        $set: {
          quantity: quantity
        }
      };

      const result = await cartCollections.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Clear all cart items for a user
    app.delete('/cart/clear/:email', async (req, res) => {
      const { email } = req.params;

      const query = { email: email };
      const result = await cartCollections.deleteMany(query);

      res.send(result);
    });

    // Remove single cart item
    app.delete('/cart/:id', async (req, res) => {
      const { id } = req.params;

      const filter = { _id: new ObjectId(id) };
      const result = await cartCollections.deleteOne(filter);

      res.send(result);
    });


    // ================= ORDER ROUTES - FAHIM =================

    // Place order
    app.post('/orders', async (req, res) => {
      const orderInfo = req.body;

      orderInfo.createdAt = new Date();
      orderInfo.status = "pending";

      const result = await orderCollections.insertOne(orderInfo);
      res.send(result);
    });

    // Get orders by user email
    app.get('/orders/:email', async (req, res) => {
      const { email } = req.params;

      const query = { email: email };
      const result = await orderCollections.find(query).toArray();

      res.send(result);
    });

    // Delete order
    app.delete('/orders/:id', async (req, res) => {
      const { id } = req.params;

      const filter = { _id: new ObjectId(id) };
      const result = await orderCollections.deleteOne(filter);

      res.send(result);
    });

    // ================= FAHIM'S PART END =================  

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