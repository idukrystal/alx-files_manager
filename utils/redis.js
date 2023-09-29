import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient()
      .on('error', err => console.log('Redis Client Error', err
                                     ))
      .connect();
  }
}
