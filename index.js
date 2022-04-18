const { Client, AccountId, PrivateKey } = require('@hashgraph/sdk');
const { hethers } = require('@hashgraph/hethers');
require('dotenv').config();

console.clear();

const operatorId = AccountId.fromString(process.env.ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.PRIVATE_KEY);

if (operatorId == null || operatorKey == null) {
  throw new Error('Environment variables ACCOUNT_ID and PRIVATE_KEY must be present');
}

// Init client
const client = Client.forTestnet().setOperator(operatorId, operatorKey);

console.log('client', client);

async function main() {
  // Get provider
  const defaultProvider = hethers.providers.getDefaultProvider('testnet');

  console.log('defaultProvider', defaultProvider);
}

main();
