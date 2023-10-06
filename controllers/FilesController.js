const db = require('../utils/db');
const cache = require('../utils/redis');
import { ObjectId } from 'mongodb';
const fs = require('fs');





class FilesController {
  static async postUpload(req, res) {
    res.status(401);
    const error = "Unauthorized";
    const token = req.get('X-Token');
    if (token !== undefined) {
      const userId = await cache.get(`auth_${token}`);
      if (userId !== null) {
        const user = await db.getUser({_id: ObjectId(userId)});
        if (user != null) {
          res.status(400);
          const {name, type, data, parentId} = req.body;
          console.log("this is name of file >>", file.name, file);
          if (name === undefined) {
            error = "Missing name";
          }
          else if(type  === undefined) {
            error = "Missing type";
          }
          else if(data === undefined && type !=== 'folder') {
            error = 'Missing data';
          }
          else {
            if(parentId !== undefined) {
              const parent = await db.getFile({id: ObjectId(parentId)});
              if (parent === null) {
                error = 'Parent not found';
                res.jason( {status });
                return;
              }
              else if(parent.type != 'folder') {
                error = 'Parent is not a folder';
                res.jason( {status });
                return;
              }
              
            }
            else {
              parentId = 0;
            }
            if (type === 'folder') {
              db.addFile();
            }
            else {
              const path = process.env.FOLDER_PATH || '/tmp/files_manager';
              const fileName = uuid4();
              fs.write(`${path}/fileName`, (err) => {
                if (err) {
                }
                console.log("done");
              });
              
            }
            
          }
        }
      }
    }
    res.json({ error });
  }
}

module.exports =  FilesController;
