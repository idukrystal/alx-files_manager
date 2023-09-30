import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient()
      .on('error', err => console.log('Redis Client Error', err
                                     ))
      .connect();
  }

  isAlive() {
    if (this.client.isReady)
      return true;
    return false;
  }
  async get(key) {
    const get = promisify(this.client.get).bind(this.client);
    value = await get(key);
    return value;
  }
  async set(key, value, duration) {
    const set = promisify(this.client.set).bind(this.client);
    await set(key, value);
    await this.client.expire(key, duration);
  }
  async del(key) {
    const del = promisify(this.client.set).bind(this.client);
    await del(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
