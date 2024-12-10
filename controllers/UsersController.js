const crypto = require('crypto');
const { MongoClient } = require('mongodb');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });

    try {
      await client.connect();
      const db = client.db('my_database');
      const usersCollection = db.collection('users');

      const existingUser = await usersCollection.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      const result = await usersCollection.insertOne({ email, password: hashedPassword });

      const newUser = {
        id: result.insertedId,
        email,
      };

      return res.status(201).json(newUser);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    } finally {
      await client.close();
    }
  }
}

module.exports = UsersController;
