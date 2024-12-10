const redis = require('redis');

class RedisClient {
  constructor() {
    // create redis client
    this.client = redis.createClient();

    // listen for error events
    this.client.on('error', (error) => {
      console.error(`Redis Client Error: ${error.message}`);
    });
  }

  /**
     * check if You can now use redisClient in your application to interact with Redis.
 connection is alive
     * @returns {boolean} True if the connection is alive, flase otherwise
     */
  isAlive() {
    return this.client.connected;
  }

  /**
     * Get the value of a key from Redis
     */
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) {
          return reject(err);
        }
        resolve(value);
      });
    });
  }

  /**
     * Set a key-value pair in Redis with an
     * expiration time
     */
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'Ex', duration, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  /**
     * Delete a key from redis
     */
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
}
// create and export an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;
