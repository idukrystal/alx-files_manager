import dbClient from '../utils/db';

class UsersController {
  static postNew(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    res.status(400);
    if (email == undefined)
      res.send('Missing email');
    else if (password == undefined)
      res.send('Missing password');
    else
      dbclient.addUser(email, password);
  }
}

module.exports = UsersController
