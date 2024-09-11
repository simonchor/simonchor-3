import { MongoClient } from 'mongodb';

// MongoDB connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'Card_search_users_info';

let db;

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
    if (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
    db = client.db(dbName);
    console.log('Connected to MongoDB');
});

export { db };
