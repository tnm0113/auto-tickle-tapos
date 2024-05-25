import { Aptos, Network, AptosConfig, Account, Ed25519PrivateKey, U64, Serializer } from "@aptos-labs/ts-sdk";

// put your PRIVATE KEY here
const PRIVATE_KEY = ''
// change to number you wish
const TOTAL_TX = 12500

const GAS_UNIT_PRICE = 100
const MAX_GAS_LIMIT = 2000//Max Gas Limit
////////////

const tickle_function = "0x7de3fea83cd5ca0e1def27c3f3803af619882db51f34abf30dd04ad12ee6af31::tapos::play"

const aptosConfig = new AptosConfig({ network: Network.MAINNET });
const aptos = new Aptos(aptosConfig);

function reStoreAccount(_privateKey: string) {
  const privateKey = new Ed25519PrivateKey(_privateKey);
  const account = Account.fromPrivateKey({ privateKey });
  return account;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(
      (resolve) => setTimeout(resolve, ms));
}

async function start() {
  for (let count = 0; count <= TOTAL_TX; count++) {
    const myAccount = reStoreAccount(PRIVATE_KEY);

    const transaction = await aptos.transaction.build.simple({
      sender: myAccount.accountAddress,
      data: {
        function: tickle_function,
        typeArguments: [],
        functionArguments: [], 
      },
      options: {
        maxGasAmount: MAX_GAS_LIMIT,
        gasUnitPrice: GAS_UNIT_PRICE,
      },
    });

    const sendTx = aptos.transaction.signAndSubmitTransaction({
      signer: myAccount,
      transaction: transaction,
    });

    console.log(`${count}. https://explorer.aptoslabs.com/txn/${(await sendTx).hash}`);
    const response = await aptos.waitForTransaction({
      transactionHash: (await sendTx).hash,
    });

    await sleep(1000);
  }

}

start();