const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb')
const bodyparser = require('body-parser')
const cors = require('cors')

dotenv.config()

// Conection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url)

// Database name
const dbName = 'keyguard'
const app = express()
const port = 3000

app.use(bodyparser.json())
app.use(cors())

client.connect()

// Get all passwords
app.get('/', async (req, res) => {
    const db = client.db(dbName)
    const collection = db.collection('passwords')
    const findResult = await collection.find({}).toArray()
    res.json(findResult)
})

// Save a password
app.post('/', async (req, res)=>{
    const password = req.body
    const db = client.db(dbName)
    const collection = db.collection('passwords')
    const findResult = await collection.insertOne(password)
    res.send({ success: true, result: findResult })
})

// Delete a password
app.delete('/', async (req, res)=>{
    const password = req.body
    const db = client.db(dbName)
    const collection = db.collection('passwords')
    const findResult = await collection.deleteOne({ id: password.id })
    res.send({ success: true, result: findResult })
})

// Update a password
app.put('/', async (req, res)=>{
    const { id, site, username, password } = req.body
    const db = client.db(dbName)
    const collection = db.collection('passwords')
    const findResult = await collection.updateOne(
        { id: id }, 
        { $set: { site, username, password } }
    )

    if (findResult.matchedCount === 0) {
        return res.status(404).json({ error: 'Password not found' })
    }

    res.json({ success: true, result: findResult })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})