const axios = require('axios');
const { VAULT_ADDR, VAULT_TOKEN } = require('../config');

exports.getSecret = async (secretPath) => {
  try {
    const response = await axios.get(`${VAULT_ADDR}/v1/${secretPath}`, {
      headers: { 'X-Vault-Token': VAULT_TOKEN },
    });
    return response.data.data;
  } catch (error) {
    throw new Error(`Vault error: ${error.message}`);
  }
};
