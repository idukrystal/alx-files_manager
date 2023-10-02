import sha1 from 'sha1';

import { ObjectId } from 'mongodb'

import cache from '../utils/redis';

import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    res.status(400);
    if (email === undefined) {
      res.send({ error: 'Missing email' });
    } else if (password === undefined) {
      res.send({ error: 'Missing password' });
    } else if (await dbClient.userExists(email)) {
      res.json({ error: 'Already exist' });
    } else {
      res.status(201);
      const newId = await dbClient.addUser(email, sha1(password));
      res.json({
        id: newId,
        email,
      });
    }
  }


  static async getMe(req, res) {
    const token = req.get('X-Token');
    if (token !== undefined) {
      const userId = await cache.get(token);
      if (userId !== undefined) {
        const user = await dbClient.getUser(
          { _id: ObjectId(userId) }
        );
        if (user !== null) {
          res.status(200).json(
            { id: user._id.toString(), email: user.email}
          );
          return;
        }
      }
    }
    res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = UsersController;
