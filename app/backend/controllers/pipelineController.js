const axios = require('axios');
const { JENKINS_URL, JENKINS_USER, JENKINS_TOKEN } = require('../config');

exports.runPipeline = async (req, res) => {
  try {
    const jobName = req.body.jobName;
    if (!jobName) return res.status(400).json({ error: 'Job name is required' });

    const url = `${JENKINS_URL}/job/${jobName}/build`;
    const auth = { username: JENKINS_USER, password: JENKINS_TOKEN };

    await axios.post(url, {}, { auth });

    res.status(200).json({ message: `Pipeline ${jobName} triggered successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
