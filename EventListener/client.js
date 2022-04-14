require('dotenv').config({path: __dirname + '/.env'})


const {BN, Long, bytes, units} = require('@zilliqa-js/util');
const {Zilliqa} = require('@zilliqa-js/zilliqa');
const {MessageType} = require('@zilliqa-js/subscriptions');
const {
    getAddressFromPrivateKey,
} = require('@zilliqa-js/crypto');

const websocket = "wss://dev-ws.zilliqa.com"
const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');

const chainId = 333; // chainId of the developer testnet

const msgVersion = 1; // current msgVersion
const VERSION = bytes.pack(chainId, msgVersion);


const privateKey = process.env.OWNER_WALLET_PRIVATEKEY;
zilliqa.wallet.addByPrivateKey(privateKey);
const address = getAddressFromPrivateKey(privateKey);
let minGasPrice = 0;
let balance = 0;
let myGasPrice = 0;
let isGasSufficient = false;

async function initializeNetwork() {
    // Get Balance
    balance = await zilliqa.blockchain.getBalance(address);
    // Get Minimum Gas Price from blockchain
    minGasPrice = await zilliqa.blockchain.getMinimumGasPrice();

    console.log(`Your account balance is:`);
    console.log(balance.result);
    console.log(`Current Minimum Gas Price: ${minGasPrice.result}`);

    myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
    console.log(`My Gas Price ${myLargeGasPrice.toString()}`);

    isGasSufficient = myLargeGasPrice.gte(new BN(minGasPrice.result)); // Checks if your gas price is less than the minimum gas price
    console.log(`Is the gas price sufficient? ${isGasSufficient}`);
}



// Listen for events from a contract - errors aren't caught
async function ListenForEvents(deployed_contract_base_16) {
    console.log(deployed_contract_base_16);
    const subscriber = zilliqa.subscriptionBuilder.buildEventLogSubscriptions(
        websocket,
        {
            addresses: [
                deployed_contract_base_16
            ],
        },
    );

    console.log("Listener started");

    subscriber.emitter.on(MessageType.EVENT_LOG, async (event) => {
        if (event["value"]) {
            if (event["value"][0]["event_logs"] && event["value"][0]["event_logs"][0]) {
                let eventObj = event["value"][0]["event_logs"][0];
                console.log("event name==============>", eventObj["_eventname"]);
                console.log("event param=============>", eventObj["params"]);

                // Listen for GetLatestTWAPHol Event
                if (eventObj["_eventname"] === "RequestedH13RandomNumber") {
                    let requestId = eventObj["params"][0]["value"];
                    let callerAddress = eventObj["params"][1]["value"];
                    pendingH13Requests.push({callerAddress, id: requestId});
                }

            }
        }
    });
    await subscriber.start();
}



async function getRandom() {
    // return uint256 random number
    let returnRand = '';
    for (let i = 0; i < 5 ; i++) {
        returnRand += (Math.floor(Math.random() * (2**32 - 1))).toString();
    }
    console.log(returnRand);
    return returnRand
}

(async () => {
    try {
        await initializeNetwork();
    } catch (e) {
        console.log("err while initializing====>", e);
    }
    try {
        await  ListenForEvents(process.env.RNG_ORACLE_ADDRESS);
    } catch (e) {
        console.log("err while listening events", e)
    }
})()
