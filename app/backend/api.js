const express = require('express');
const axios = require('axios');
const router = express.Router();

// Get all repositories from Gitea
router.get('/repositories', async (req, res) => {
    try {
        const response = await axios.get('http://gitea:3000/api/v1/repos', {
            headers: { Authorization: `token YOUR_GITEA_TOKEN` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch repositories' });
    }
});

// Trigger Jenkins pipeline
router.post('/run-pipeline', async (req, res) => {
    try {
        const response = await axios.post(
            'http://jenkins:8080/job/DevSecOps/build',
            {},
            { auth: { username: 'admin', password: 'jenkins_password' } }
        );
        res.json({ message: 'Pipeline started successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to trigger Jenkins' });
    }
});

module.exports = router;
