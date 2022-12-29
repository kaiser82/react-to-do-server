const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID, ObjectId } = require('bson');
require('dotenv').config();
const app = express()

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pyz6p0u.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
    try {

        const todosCollection = client.db('todoApp').collection('todos');

        app.post('/todos', async (req, res) => {
            const todo = req.body;
            const result = await todosCollection.insertOne(todo);
            res.send(result)
        })

        app.get('/todos/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await todosCollection.findOne(query);
            res.send(result);
        });

        app.get('/todos', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = todosCollection.find(query);
            const myTodos = await cursor.toArray();
            res.send(myTodos);
        });

        app.patch('/todos/:id', async (req, res) => {
            const id = req.params.id;
            const result = await todosCollection.updateOne({ _id: ObjectId(id) }, { $set: req.body });

            res.send(result);
        });

        app.delete('/todos/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await todosCollection.deleteOne(query);
            res.send(result);
        });

    }

    finally {

    }
}
run().catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('ToDo server running...')
})

app.listen(port, () => {
    console.log(`ToDo server is running on port:${port}`)
})
