import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const env = process.env;
    const url = env.DB_HOST ? env.DB_HOST : 'localhost';
    const port = env.DB_PORT ? env.DB_PORT : 27017;
    const name = env.DB_DATABASE? env.DB_DATABASE: files_manager;
    this.client = MongoClient(`mongodb://${url}:${port}`);
    this.client.connect();
    this.client.db(name);
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const users = await db.collections('users');
    return users.length;
  }

  async nbFiles() {
    const users = await db.collections('files');
    return users.length;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
