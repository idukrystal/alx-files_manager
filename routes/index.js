import {Router, json} from 'express';

import AppController from '../controllers/AppController';

import UsersController from '../controllers/UsersController';

const router = Router();

router.use(json());

router.get('/status', AppController.getStatus);

router.get('/stats', AppController.getStats);

router.post('/users', UsersController.postNew);

module.exports = router;
