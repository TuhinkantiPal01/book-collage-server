const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//*? MiddleWare

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ue4cbab.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const collageCollection = client.db("bookMyCollage").collection("collages");
    const usersCollections = client.db("bookMyCollage").collection("users");
    const admissionCollections = client.db("bookMyCollage").collection("admission");

    // Users DB

    app.get("/users", async (req, res) => {
      const result = await usersCollections.find().toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollections.insertOne(newUser);
      res.send(result);
    });

    // collages DB

    app.get("/collages", async (req, res) => {
      const result = await collageCollection.find().toArray();
      res.send(result);
    });

    app.get("/collages/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collageCollection.findOne(query);
      res.send(result);
    });

    // Admission DB

    app.get("/admission", async (req, res) => {
      const result = await admissionCollections.find().toArray();
      res.send(result);
    });

    app.get("/admission/email", async (req, res) =>{
     
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email}
      }
      const result = await admissionCollections.find(query).toArray();
      res.send(result);
    });

    app.post("/admission", async (req, res) => {
      const admission = req.body;
      const result = await admissionCollections.insertOne(admission);
      res.send(result);
    });

    // Review DB

    


    app.get("/", (req, res) => {
      res.send("App is running");
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
