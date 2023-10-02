import sha1 from 'sha1';

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
}

module.exports = UsersController;
