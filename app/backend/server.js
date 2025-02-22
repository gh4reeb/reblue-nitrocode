// File: app/backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pipelineRoutes = require('./routes/pipelineRoutes');
const repoRoutes = require('./routes/repoRoutes');
const vaultHelper = require('./utils/vaultHelper');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Routes
app.use('/api/pipeline', pipelineRoutes); // Handles DevSecOps pipeline execution
app.use('/api/repos', repoRoutes); // Fetch repositories from GitHub/Gitea

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is running' });
});

// Fetch Secrets from Vault (example usage)
app.get('/api/secrets/:key', async (req, res) => {
    try {
        const secret = await vaultHelper.getSecret(req.params.key);
        res.json({ secret });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve secret' });
    }
});

// Start Server on Available Port (between 7071 - 7079)
const PORT = Math.floor(Math.random() * (7079 - 7071 + 1)) + 7071;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

