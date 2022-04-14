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
const {getSingleRandom, get13BatchRandom, get35BatchRandom} = require("./randomizer");

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
    console.log(`My Gas Price ${myGasPrice.toString()}`);

    isGasSufficient = myGasPrice.gte(new BN(minGasPrice.result)); // Checks if your gas price is less than the minimum gas price
    console.log(`Is the gas price sufficient? ${isGasSufficient}`);
}



// Listen for events from a contract - errors aren't caught
async function ListenForEvents() {
    let heroesAddr = process.env.HEROES_NFT_ADDRESS;
    let dlHeroesAddr = process.env.DL_HEROES_NFT_ADDRESS;
    let gearsAddr = process.env.GEARS_NFT_ADDRESS;
    const subscriber = zilliqa.subscriptionBuilder.buildEventLogSubscriptions(
        websocket,
        {
            addresses: [
                heroesAddr,
                dlHeroesAddr,
                gearsAddr
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

                // Listen for DLHeroesMint Event
                if (eventObj["_eventname"] === "DLHeroesNFTMint") {
                    let token_id = eventObj["params"][1]["value"];
                    await dlHeroesSingleMint(token_id);
                    // Do sth here
                }
                
                if (eventObj["_eventname"] === "DLHeroesNFTBatchMint") {
                    let start_id = eventObj["params"][1]["value"];
                    let end_id = eventObj["params"][2]["value"];
                    await dlHeroesBatchMint(start_id, end_id);
                    // Do sth here
                }

                if (eventObj["_eventname"] === "GearsNFTMint") {
                    let token_id = eventObj["params"][1]["value"];
                    // Do sth here
                }

                if (eventObj["_eventname"] === "GearsNFTBatchMint") {
                    let start_id = eventObj["params"][1]["value"];
                    let end_id = eventObj["params"][2]["value"];
                    // Do sth here
                }

                
                
                if (eventObj["_eventname"] === "HeroesNFTMint") {
                    let token_id = eventObj["params"][1]["value"];
                    // Do sth here
                }


                if (eventObj["_eventname"] === "HeroesNFTBatchMint") {
                    let start_id = eventObj["params"][1]["value"];
                    let end_id = eventObj["params"][2]["value"];
                    // Do sth here
                }
            }
        }
    });
    await subscriber.start();
}

// Generate Single Random && Generate Trait && Upload to IFPS
async function dlHeroesSingleMint(token_id) {
    let random = await getSingleRandom();
    // let token_trait = await generateTrait(random);
}


(async () => {
    try {
        await initializeNetwork();
    } catch (e) {
        console.log("err while initializing====>", e);
    }
    try {
        await  ListenForEvents();
    } catch (e) {
        console.log("err while listening events", e)
    }
})()
