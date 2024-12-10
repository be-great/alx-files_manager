const bcrypt = require('bcrypt');
const redisClient = require('../utils/redis'); // Assuming you have a redisClient setup
const User = require('../models/User'); // Assuming you have a User model to interact with the database
const uuidv4 = require('uuid').v4;

// GET /connect - Sign in and generate an authentication token
exports.getConnect = async (req, res) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const base64Credentials = authorization.slice(6);
  const [email, password] = Buffer.from(base64Credentials, 'base64').toString().split(':');

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Generate a random token
    const token = uuidv4();
    const key = `auth_${token}`;

    // Store the user ID in Redis for 24 hours
    await redisClient.setex(key, 86400, user.id);

    // Return the token
    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /disconnect - Sign out by deleting the token
exports.getDisconnect = async (req, res) => {
  const token = req.headers['x-token'];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const key = `auth_${token}`;

  try {
    // Retrieve the user based on the token
    const userId = await redisClient.get(key);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Delete the token from Redis
    await redisClient.del(key);

    // Return no content (204)
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
