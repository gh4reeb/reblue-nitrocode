const axios = require('axios');
const { GITEA_URL, GITEA_TOKEN, GITHUB_TOKEN } = require('../config');

exports.getRepositories = async (req, res) => {
  try {
    const source = req.query.source;
    let repos = [];

    if (source === 'gitea') {
      const response = await axios.get(`${GITEA_URL}/api/v1/user/repos`, {
        headers: { Authorization: `token ${GITEA_TOKEN}` },
      });
      repos = response.data;
    } else if (source === 'github') {
      const response = await axios.get(`https://api.github.com/user/repos`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` },
      });
      repos = response.data;
    } else {
      return res.status(400).json({ error: 'Invalid source' });
    }

    res.status(200).json(repos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
