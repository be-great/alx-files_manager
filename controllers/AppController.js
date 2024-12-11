const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

// GET /status

exports.getStatus = async (req, res) => {
    try {

    } catch (error) {
        console.error('Error checking status:', error);
        res.status(500).json({ message: 'Internal Server Error'});
    }
};

// GET /stats
exports.getStatus = async (req, res) => {
    try {
        // get count of users and files from db
        const usersCount = await dbClient.nbUsers();
        const filesCount = await dbClient.nbFiles();
        // Respond with stats
        res.status(200).json({
            users: usersCount,
            files: filesCount
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ message: 'Internal Server Error'});
    }
};