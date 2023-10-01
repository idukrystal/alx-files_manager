const db = require('../utils/db');
const cache = require('../utils/redis');

class Controller {
  getStatus(req, res) {
    const dbIsAlive = db.isAlive();
    const cacheIsAlive = cache.isAlive();
    if (dbIsAlive && cacheIsAlive) {
      res.status(200);
    }
    else {
      
    }
    res.json({
      "redis": cacheIsAlive,
      "db": dbIsAlive
    });
  }

  async getStats(req, res) {
    const nUsers = await db.nbUsers();
    const nFiles = await db.nbFiles();
    res.status(200).json({
      "users": nUsers,
      "files": nFiles
    });
  }
}

module.exports = new Controller();
