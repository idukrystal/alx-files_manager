import dbClient from '../utils/db';
import cache  from '../utils/redis';
import sha1 from 'sha1';
import { ObjectId } from 'mongodb'
import {v4 as uuid4} from 'uuid';

class AuthController {
  static async basicAuth (req) {
    const auth = req.get('Authorization');
    if (auth !== undefined && auth.indexOf('Basic ') === 0) {
      const base64Credentials = auth.split(' ')[1];
      if (base64Credentials !== undefined) {
        const credentials = Buffer.from(
          base64Credentials, 'base64'
        ).toString('ascii');
        const [ name, password ] = credentials.split(':');
        if (name !== undefined && password !== undefined) {
          const userID = await dbClient.validateLogin(
            name, sha1(password)
          );
          return userID;
        }
      }
    }
    return null;
  }
  
  static async getConnect(req, res) {
    const userId = await AuthController.basicAuth(req);
    if (userId === null) {
      res.status(401).json({error: 'Unauthorized'});
    }
    else {
      const authToken = uuid4();
      cache.set(`auth_${authToken}`, userId, 60 * 60 *24);
      res.status(200).json({token: authToken});
    }
  }

  static async getDisconnect(req, res) {
    const token = req.get('X-Token');
    if (token !== undefined) {
      const userId = await cache.get(`auth_${token}`);
      if (userId !== null) {
        const user = await dbClient.getUser({_id: ObjectId(userId)});
        if (user !== null) {
          cache.del(`auth_${token}`);
          res.status(204).send();
          return;
        }
      }
    }
    res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = AuthController
