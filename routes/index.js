const express = require('express');

const router = express.Router();
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');

// define the routes and map them to controller
router.get('/status', AppController.getStats);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);

module.exports = router;
