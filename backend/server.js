const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb')
const bodyparser = require('body-parser')
const cors = require('cors')

dotenv.config()

// MongoDB connection configuration
const url = 'mongodb://localhost:27017'; // MongoDB connection URL
const client = new MongoClient(url) // Create MongoDB client instance

// Database and server configuration
const dbName = 'keyguard' // Name of the database
const app = express() // Create Express application instance
const port = 3000 // Port number for the server

// Middleware setup
app.use(bodyparser.json()) // Parse JSON bodies in requests
app.use(cors()) // Enable Cross-Origin Resource Sharing for frontend communication

// Connect to MongoDB database
client.connect()

// API Routes

// GET route - Retrieve all passwords from database
app.get('/', async (req, res) => {
    try {
        const db = client.db(dbName) // Connect to keyguard database
        const collection = db.collection('passwords') // Access passwords collection
        const findResult = await collection.find({}).toArray() // Fetch all password documents
        res.json(findResult) // Send passwords as JSON response
    } catch (error) {
        console.error('Error fetching passwords:', error)
        res.status(500).json({ error: 'Failed to fetch passwords' })
    }
})

// POST route - Create a new password entry
app.post('/', async (req, res) => {
    try {
        const password = req.body // Extract password data from request body
        const db = client.db(dbName) // Connect to keyguard database
        const collection = db.collection('passwords') // Access passwords collection
        const findResult = await collection.insertOne(password) // Insert new password document
        res.send({ success: true, result: findResult }) // Send success response
    } catch (error) {
        console.error('Error creating password:', error)
        res.status(500).json({ error: 'Failed to create password' })
    }
})

// DELETE route - Remove a password entry
app.delete('/', async (req, res) => {
    try {
        const password = req.body // Extract password data from request body
        const db = client.db(dbName) // Connect to keyguard database
        const collection = db.collection('passwords') // Access passwords collection
        const findResult = await collection.deleteOne({ id: password.id }) // Delete password by matching ID

        // Check if any document was actually deleted
        if (findResult.deletedCount === 0) {
            return res.status(404).json({ error: 'Password not found' })
        }

        res.send({ success: true, result: findResult })
    } catch (error) {
        console.error('Error deleting password:', error)
        res.status(500).json({ error: 'Failed to delete password' })
    }
})

// PUT route - Update an existing password entry
app.put('/', async (req, res) => {
    try {
        const { id, site, username, password } = req.body // Extract updated data from request body
        const db = client.db(dbName) // Connect to keyguard database
        const collection = db.collection('passwords') // Access passwords collection

        // Update password document matching the provided ID
        const findResult = await collection.updateOne(
            { id: id }, // Find document with matching ID
            { $set: { site, username, password } } // Update these fields
        )

        // Check if any document was found and updated
        if (findResult.matchedCount === 0) {
            return res.status(404).json({ error: 'Password not found' })
        }

        res.json({ success: true, result: findResult })
    } catch (error) {
        console.error('Error updating password:', error)
        res.status(500).json({ error: 'Failed to update password' })
    }
})

// Start the server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// Graceful shutdown handling
process.on('SIGINT', async()=>{
    console.log('\nSutting down server...')
    await client.close() // Close MongoDB connection
    process.exit(0)
})