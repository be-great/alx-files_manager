const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');

// define the routes and map them to controller
router.get('/status', AppController.getStats);
router.get('/stats', AppController.getStats);

module.exports = router;