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
app.get('/', (req,res)=> {
    res.send("Server is on")
})

app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})


