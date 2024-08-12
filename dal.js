var mongoose = require('mongoose');
const dotenv = require("dotenv")
dotenv.config();

const MongoClient = require('mongodb').MongoClient;
const url         = process.env.MONGODB_URI;
//const url = "mongodb+srv://tassneenbashir:mongopassword@cluster0.k8qfisw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
let db            = null;
 
// connect to mongo - my changes
MongoClient.connect(url)
    .then((client) => {
    console.log("connected to mongo");
    const dbName = 'banking_app';
    db = client.db(dbName);
    //console.log(db)
    })
    .catch((err) => {
        console.log("failed to connect", err)
    })

//connect to mongo, from starter code - DOESNT WORK???
    /*MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client) {
    console.log("Connected successfully to db server");
    // connect to  database
    db = client.db('banking_app');
});*/

// create user account
function create(name, email, uid) {
    console.log("inserting into db");
    return new Promise((resolve, reject) => {    
        const collection = db.collection('users');
        const doc = {name, email, uid, balance: 50};
        collection.insertOne(doc, {w:1}, function(err, result) {
            err ? reject(err) : resolve(doc);
        });    
    })
}

// find user account
async function find(email) {
    try {
        // Perform the query
        const docs = await db.collection('users').find({ email: email }).toArray();
        // Return the result
        return docs;
    } catch (err) {
        // Handle and log errors
        console.error('Error fetching users:', err);
        return { error: 'Failed to fetch users' };
    }
}


// find user account
async function findOne(email) {
    try {
        // Perform the query
        const docs = await db.collection('users').findOne({ email: email });
        // Return the result
        return docs;
    } catch (err) {
        // Handle and log errors
        console.error('Error fetching users:', err);
        return { error: 'Failed to fetch users' };
    }
}

// update - deposit/withdraw amount
async function update(email, amount) {
    try {
        const result = await db.collection('users').findOneAndUpdate(
            { email: email },
            { $inc: { balance: amount } },
        );
        console.log('result:', result);
        return result;
    } catch (error) {
        console.log('error:', error);
        throw error; // re-throw the error to handle it in calling code if needed
    }
}

// all users
function all() {
    return new Promise((resolve, reject) => {    
        const customers = db
            .collection('users')
            .find({})
            .toArray(function(err, docs) {
                err ? reject(err) : resolve(docs);
        });    
    })
}

module.exports = {create, findOne, find, update, all};
