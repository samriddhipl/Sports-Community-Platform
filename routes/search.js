const express = require('express');
const { handleSearchEvents } = require('../controllers/search/search');
const router = express.Router();

router.get('/', handleSearchEvents);


module.exports = router;
