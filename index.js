const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

/* Middleware */
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d0o34gr.mongodb.net/?appName=Cluster0`;
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


        const productCollection = client.db('productDB').collection('product');
        const cartCollection = client.db('productDB').collection('cart');

        /* for product collection */
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });

        app.get('/product', async (req, res) => {
            const newProduct = req.body;
            const cursor = productCollection.find(newProduct);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        });

        /* For update a product */
        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            console.log(query)
            const result = await productCollection.findOne(query);
            res.send(result);
        });
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            console.log(filter)
            const product = req.body;
            const updatedProduct = {
                $set: {
                    imageURL: product.imageURL,
                    name: product.name,
                    brand: product.brand,
                    type: product.type,
                    price: product.price,
                    rating: product.rating,
                    description: product.description,
                }
            }
            const result = await productCollection.updateOne(filter, updatedProduct, options);
            res.send(result);
        });

        /* for cart collection */
        app.post('/cart', async (req, res) => {
            const product = req.body;
            // console.log(product);
            const result = await cartCollection.insertOne(product);
            res.send(result);
        });

        app.get('/cart', async (req, res) => {
            const query = cartCollection.find();
            const result = await query.toArray();
            res.send(result);
        });
        /* Remove a cart from my cart */
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: id };
            const result = await cartCollection.deleteOne(query);
            res.send(result);
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


app.get('/', (req, res) => {
    res.send('Techtron Shop server is running');
});

app.listen(port, () => {
    console.log(`Techtron Shop server is running on ${port}`);
});