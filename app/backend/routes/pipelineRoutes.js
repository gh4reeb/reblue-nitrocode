const express = require('express');
const { runPipeline } = require('../controllers/pipelineController');

const router = express.Router();

router.post('/run', runPipeline);

module.exports = router;
