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
const {generateDLHeroesTrait, generateHeroesTrait, generateGearsTrait} = require("./traits");

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
    let mintContractAddress = process.env.MINT_CONTRACT_ADDRESS;
    const subscriber = zilliqa.subscriptionBuilder.buildEventLogSubscriptions(
        websocket,
        {
            addresses: [
                mintContractAddress
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

                if (eventObj["_eventname"] === "Mint13Heroes") {
                    let token_id = eventObj["params"][0]["value"];
                    await heroesSingleMint(token_id, false);
                }
                if (eventObj["_eventname"] === "Mint35Heroes") {
                    let token_id = eventObj["params"][0]["value"];
                    await heroesSingleMint(token_id, true);
                }
                if (eventObj["_eventname"] === "MintDLHeroes") {
                    let token_id = eventObj["params"][0]["value"];
                    await dlHeroesSingleMint(token_id);
                }
                if (eventObj["_eventname"] === "Mint13Gears") {
                    let token_id = eventObj["params"][0]["value"];
                    await gearsSingleMint(token_id, false);
                }
                if (eventObj["_eventname"] === "Mint35Gears") {
                    let token_id = eventObj["params"][0]["value"];
                    await gearsSingleMint(token_id, true);
                }
                if (eventObj["_eventname"] === "BatchMint13Heroes") {
                    let token_id = eventObj["params"][0]["value"];
                    await heroesBatchMint(token_id, false);
                }
                if (eventObj["_eventname"] === "BatchMint35Heroes") {
                    let token_id = eventObj["params"][0]["value"];
                    await heroesBatchMint(token_id, true);
                }
                if (eventObj["_eventname"] === "BatchMint13Gears") {
                    let token_id = eventObj["params"][0]["value"];
                    await gearsBatchMint(token_id, false);
                }
                if (eventObj["_eventname"] === "BatchMint35Gears") {
                    let token_id = eventObj["params"][0]["value"];
                    await gearsBatchMint(token_id, true);
                }
            }
        }
    });
    await subscriber.start();
}

// Generate Single Random && Generate Trait && Upload to IFPS
async function dlHeroesSingleMint(token_id) {
    let random = await getSingleRandom();
    let [name, rarity] = await generateDLHeroesTrait(random);
}
async function heroesSingleMint(token_id, is_high_level) {
    let random = await getSingleRandom();
    let [name, rarity] = await generateHeroesTrait(random, is_high_level);
}
async function gearsSingleMint(token_id, is_high_level) {
    let random = await getSingleRandom();
    let [name, rarity, main_stat, substats] = await generateGearsTrait(random, is_high_level);
}

async function heroesBatchMint(token_id, is_high_level) {
    let randoms;
    if (is_high_level) {
        randoms = await get35BatchRandom();
    } else {
        randoms = await get13BatchRandom();
    }
    for (let i = 0; i < 10; i ++) {
        let [name, rarity] = await generateHeroesTrait(randoms[i], is_high_level);
        console.log("name===>", name);
        console.log("rarity===>", rarity);
        console.log("=============")
    }
}
async function gearsBatchMint(token_id, is_high_level) {
    let randoms;
    if (is_high_level) {
        randoms = await get35BatchRandom();
    } else {
        randoms = await get13BatchRandom();
    }
    for (let i = 0; i < 10; i ++) {
        let [name, rarity, main_stat, substats] = await generateGearsTrait(randoms[i], is_high_level);
        console.log("name===>", name);
        console.log("rarity===>", rarity);
        console.log("main_stat===>", main_stat);
        console.log("substats===>", substats);
        console.log("====================");
    }
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
/*    try {
        await heroesBatchMint(1, true);
    } catch (e) {
        console.log(e)
    }*/
})()
