const { Client, AccountId, PrivateKey, ContractUpdateTransaction } = require('@hashgraph/sdk');
require('dotenv').config();

console.clear();

const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_KEY);

// Init client
// const client = Client.forTestnet().setOperator(operatorId, operatorKey);
const client = Client.forMainnet().setOperator(operatorId, operatorKey);

async function main() {
  const contractId = '0.0.1325020';

  //Create the transaction
  const transaction = await new ContractUpdateTransaction()
    .setContractId(contractId)
    .setExpirationTime(1678193591)
    .freezeWith(client);

  //Sign the transaction with the client operator private key and submit to a Hedera network
  const txResponse = await transaction.execute(client);

  //Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Get the consensus status of the transaction
  const transactionStatus = receipt.status;

  console.log('The consensus status of the transaction is ' + transactionStatus);
}

main();
