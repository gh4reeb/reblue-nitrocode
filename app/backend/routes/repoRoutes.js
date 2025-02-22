const express = require('express');
const { getRepositories } = require('../controllers/repoController');

const router = express.Router();

router.get('/', getRepositories);

module.exports = router;
