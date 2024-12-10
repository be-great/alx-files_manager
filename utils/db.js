const { MongoClient } = require('mongodb');

class DBClient {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';

        const url = `mongodb://${host}:${port}`;
        this.client = new MongoClient(url, { useUnifiedTopology: true });
        this.dbName = database;

        this.client.connect()
            .then(() => {
                this.db = this.client.db(this.dbName);
                console.log('Connected to MongoDB');
            })
            .catch((error) => {
                console.error(`MongoDB Client Error: ${error.message}`);
            });
    }

    /**
     * Check if the connection to MongoDB is alive
     * @returns {boolean} True if the connection is alive, false otherwise
     */
    isAlive() {
        return this.client && this.client.topology && this.client.topology.isConnected();
    }

    /**
     * Get the number of documents in the 'users' collection
     * @returns {Promise<number>} Number of documents in the collection
     */
    async nbUsers() {
        if (!this.isAlive()) return 0;
        return this.db.collection('users').countDocuments();
    }

    /**
     * Get the number of documents in the 'files' collection
     * @returns {Promise<number>} Number of documents in the collection
     */
    async nbFiles() {
        if (!this.isAlive()) return 0;
        return this.db.collection('files').countDocuments();
    }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
module.exports = dbClient;
