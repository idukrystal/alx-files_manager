import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const name = process.env.DB_DATABASE || 'files_manager';
    this.client = MongoClient(
      `mongodb://${host}:${port}`,
      { useUnifiedTopology: true },
    );
    this.client.connect().then(
      () => {
        this.db = this.client.db(name);
      },
    ).catch(
      (err) => {
        console.log(err);
      },
    );
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const users = await this.db.collection('users');
    const count = await users.countDocuments();
    return count;
  }

  async nbFiles() {
    const files = await this.db.collection('files');
    const count = await files.countDocuments();
    return count;
  }

  async addUser(email, password) {
    
    const newId = await this.db.collection('users').insertOne(
      {
        "email": email,
        "password": password,
      },
    );
    
  }
  async getUser(email) {
    const users = await this.db.collection('users');
    const user = users.find({"email": email});
    console.log(user);
    if (user == undefined)
      return false;
    return true;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
