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
const axios = require("axios");

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

                // Mint Event Listener
                if (eventObj["_eventname"] === "Mint13Heroes") {
                    let token_id = eventObj["params"][0]["value"];
                    let to = eventObj["params"][1]["value"];
                    await heroesSingleMint(token_id, false, to);
                }
                if (eventObj["_eventname"] === "Mint35Heroes") {
                    let token_id = eventObj["params"][0]["value"];
                    let to = eventObj["params"][1]["value"];
                    await heroesSingleMint(token_id, true, to);
                }
                if (eventObj["_eventname"] === "MintDLHeroes") {
                    let token_id = eventObj["params"][0]["value"];
                    let to = eventObj["params"][1]["value"];
                    await dlHeroesSingleMint(token_id, to);
                }
                if (eventObj["_eventname"] === "Mint13Gears") {
                    let token_id = eventObj["params"][0]["value"];
                    let to = eventObj["params"][1]["value"];
                    await gearsSingleMint(token_id, false, to);
                }
                if (eventObj["_eventname"] === "Mint35Gears") {
                    let token_id = eventObj["params"][0]["value"];
                    let to = eventObj["params"][1]["value"];
                    await gearsSingleMint(token_id, true, to);
                }
                if (eventObj["_eventname"] === "BatchMint13Heroes") {
                    let token_id = eventObj["params"][0]["value"];
                    let to = eventObj["params"][1]["value"];
                    await heroesBatchMint(token_id, false, to);
                }
                if (eventObj["_eventname"] === "BatchMint35Heroes") {
                    let token_id = eventObj["params"][0]["value"];
                    let to = eventObj["params"][1]["value"];
                    await heroesBatchMint(token_id, true, to);
                }
                if (eventObj["_eventname"] === "BatchMint13Gears") {
                    let token_id = eventObj["params"][0]["value"];
                    let to = eventObj["params"][1]["value"];
                    await gearsBatchMint(token_id, false, to);
                }
                if (eventObj["_eventname"] === "BatchMint35Gears") {
                    let token_id = eventObj["params"][0]["value"];
                    let to = eventObj["params"][1]["value"];
                    await gearsBatchMint(token_id, true, to);
                }

                // Evolution Event Listener
                if (eventObj["_eventname"] === "EvolveHeroes") {
                    let max_token_uri = eventObj["params"][0]["value"];
                    let any_token_uri = eventObj["params"][1]["value"];
                    let to = eventObj["params"][2]["value"];
                    await heroesEvolve(max_token_uri, any_token_uri, to);
                }
                if (eventObj["_eventname"] === "EvolveGears") {
                    let max_token_uri = eventObj["params"][0]["value"];
                    let any_token_uri = eventObj["params"][1]["value"];
                    let to = eventObj["params"][2]["value"];
                    await gearsEvolve(max_token_uri, any_token_uri, to);
                }
                if (eventObj["_eventname"] === "EvolveDLHeroes") {
                    let max_token_uri = eventObj["params"][0]["value"];
                    let any_token_uri = eventObj["params"][1]["value"];
                    let to = eventObj["params"][2]["value"];
                    await dlHeroesEvolve(max_token_uri, any_token_uri, to);
                }
            }
        }
    });
    await subscriber.start();
}

// Generate Single Random && Generate Trait && Upload to IFPS
async function dlHeroesSingleMint(token_id, to) {
    let random = await getSingleRandom();
    let [name, rarity] = await generateDLHeroesTrait(random);
    var data = JSON.stringify({
        "pinataMetadata": {
            "name": `dl-heroes-${token_id}.metadata.json`
        },
        "pinataContent": {
            "description": `Dark/Light Heroes NFT #${token_id}`,
            "tokenId": `${token_id}`,
            "name": `${name}`,
            "image": `ipfs://${process.env.DL_HEROES_ASSET_CID}/${name}.png`,
            "rarity": `${rarity}`
        }
    });

    var config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        headers: {
            'pinata_api_key': `${process.env.PINATA_API_KEY}`,
            'pinata_secret_api_key': `${process.env.PINATA_SECURITY_API_KEY}`,
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios(config)
        .then(async function (response) {
            console.log(JSON.stringify(response.data));
            let IpfsHash = response.data["IpfsHash"];
            let tokenUri = "ipfs://" + IpfsHash;
            // call mint function with tokenURI
            const dlHeroesNFTContract = zilliqa.contracts.at(process.env.DL_HEROES_NFT_ADDRESS);
            const callTx = await dlHeroesNFTContract.callWithoutConfirm(
                'Mint',
                [
                    {
                        vname: 'to',
                        type: 'ByStr20',
                        value: to,
                    },
                    {
                        vname: 'token_uri',
                        type: 'String',
                        value: tokenUri,
                    }
                ],
                {
                    // amount, gasPrice and gasLimit must be explicitly provided
                    version: VERSION,
                    amount: new BN(0),
                    gasPrice: myGasPrice,
                    gasLimit: Long.fromNumber(8000),
                },
                false,
            );
            console.log("setting Random Number step 2===========>", callTx.id);
            const confirmedTxn = await callTx.confirm(callTx.id);
            console.log("setting Random Number step 3===========>", confirmedTxn.receipt);
            if (confirmedTxn.receipt.success === true) {
                console.log("==============Transaction is successful===============")
            }
        })
        .catch(function (error) {
            console.log(error);
        });

}

async function heroesSingleMint(token_id, is_high_level, to) {
    let random = await getSingleRandom();
    let [name, rarity] = await generateHeroesTrait(random, is_high_level);
    var data = JSON.stringify({
        "pinataMetadata": {
            "name": `heroes-${token_id}.metadata.json`
        },
        "pinataContent": {
            "description": `Heroes NFT #${token_id}`,
            "tokenId": `${token_id}`,
            "name": `${name}`,
            "image": `ipfs://${process.env.HEROES_ASSET_CID}/${name}.png`,
            "rarity": `${rarity}`
        }
    });

    var config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        headers: {
            'pinata_api_key': `${process.env.PINATA_API_KEY}`,
            'pinata_secret_api_key': `${process.env.PINATA_SECURITY_API_KEY}`,
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios(config)
        .then(async function (response) {
            console.log(JSON.stringify(response.data));
            let IpfsHash = response.data["IpfsHash"];
            let tokenUri = "ipfs://" + IpfsHash;
            // call mint function with tokenURI
            const heroesNFTContract = zilliqa.contracts.at(process.env.HEROES_NFT_ADDRESS);
            const callTx = await heroesNFTContract.callWithoutConfirm(
                'Mint',
                [
                    {
                        vname: 'to',
                        type: 'ByStr20',
                        value: to,
                    },
                    {
                        vname: 'token_uri',
                        type: 'String',
                        value: tokenUri,
                    }
                ],
                {
                    // amount, gasPrice and gasLimit must be explicitly provided
                    version: VERSION,
                    amount: new BN(0),
                    gasPrice: myGasPrice,
                    gasLimit: Long.fromNumber(8000),
                },
                false,
            );
            console.log("setting Random Number step 2===========>", callTx.id);
            const confirmedTxn = await callTx.confirm(callTx.id);
            console.log("setting Random Number step 3===========>", confirmedTxn.receipt);
            if (confirmedTxn.receipt.success === true) {
                console.log("==============Transaction is successful===============")
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

async function gearsSingleMint(token_id, is_high_level, to) {
    let random = await getSingleRandom();
    let [name, rarity, main_stat, substats] = await generateGearsTrait(random, is_high_level);
    let formattedSubstats = [];
    for (let substat of substats) {
        let type = substat["type"];
        let value = substat["value"];
        let formattedParam = `${type} +${value}`;
        formattedSubstats.push(formattedParam);
    }
    var data = JSON.stringify({
        "pinataMetadata": {
            "name": `gears-${token_id}.metadata.json`
        },
        "pinataContent": {
            "description": `Gears NFT #${token_id}`,
            "tokenId": `${token_id}`,
            "name": `${name}`,
            "image": `ipfs://${process.env.GEARS_ASSET_CID}/${name}.png`,
            "rarity": `${rarity}`,
            "main_stat": `${main_stat}`,
            "sub_stats": formattedSubstats
        }
    });

    var config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        headers: {
            'pinata_api_key': `${process.env.PINATA_API_KEY}`,
            'pinata_secret_api_key': `${process.env.PINATA_SECURITY_API_KEY}`,
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios(config)
        .then(async function (response) {
            console.log(JSON.stringify(response.data));
            let IpfsHash = response.data["IpfsHash"];
            let tokenUri = "ipfs://" + IpfsHash;
            // call mint function with tokenURI
            const gearsNFTContract = zilliqa.contracts.at(process.env.GEARS_NFT_ADDRESS);
            const callTx = await gearsNFTContract.callWithoutConfirm(
                'Mint',
                [
                    {
                        vname: 'to',
                        type: 'ByStr20',
                        value: to,
                    },
                    {
                        vname: 'token_uri',
                        type: 'String',
                        value: tokenUri,
                    }
                ],
                {
                    // amount, gasPrice and gasLimit must be explicitly provided
                    version: VERSION,
                    amount: new BN(0),
                    gasPrice: myGasPrice,
                    gasLimit: Long.fromNumber(8000),
                },
                false,
            );
            console.log("setting Random Number step 2===========>", callTx.id);
            const confirmedTxn = await callTx.confirm(callTx.id);
            console.log("setting Random Number step 3===========>", confirmedTxn.receipt);
            if (confirmedTxn.receipt.success === true) {
                console.log("==============Transaction is successful===============")
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

async function heroesBatchMint(token_id, is_high_level, to) {
    let randoms;
    if (is_high_level) {
        randoms = await get35BatchRandom();
    } else {
        randoms = await get13BatchRandom();
    }
    let tokenUris = [];
    let to_token_uri_pair = [];
    for (let i = 0; i < 10; i++) {
        let [name, rarity] = await generateHeroesTrait(randoms[i], is_high_level);

        var data = JSON.stringify({
            "pinataMetadata": {
                "name": `heroes-${token_id}.metadata.json`
            },
            "pinataContent": {
                "description": `Heroes NFT #${token_id}`,
                "tokenId": `${token_id}`,
                "name": `${name}`,
                "image": `ipfs://${process.env.HEROES_ASSET_CID}/${name}.png`,
                "rarity": `${rarity}`
            }
        });
        var config = {
            method: 'post',
            url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            headers: {
                'pinata_api_key': `${process.env.PINATA_API_KEY}`,
                'pinata_secret_api_key': `${process.env.PINATA_SECURITY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(async function (response) {
                console.log(JSON.stringify(response.data));
                let IpfsHash = response.data["IpfsHash"];
                let tokenUri = "ipfs://" + IpfsHash;
                tokenUris.push(tokenUri);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    for (let uri of tokenUris) {
        to_token_uri_pair.push({
            "constructor": "Pair",
            "argtypes": ["ByStr20", "String"],
            "arguments": [to, uri]
        })
    }
    const heroesNFTContract = zilliqa.contracts.at(process.env.HEROES_NFT_ADDRESS);
    const callTx = await heroesNFTContract.callWithoutConfirm(
        'BatchMint',
        [
            {
                vname: 'to_token_uri_pair_list',
                type: 'List (Pair ByStr20 String)',
                value: to_token_uri_pair,
            }
        ],
        {
            // amount, gasPrice and gasLimit must be explicitly provided
            version: VERSION,
            amount: new BN(0),
            gasPrice: myGasPrice,
            gasLimit: Long.fromNumber(8000),
        },
        false,
    );
    console.log("setting Random Number step 2===========>", callTx.id);
    const confirmedTxn = await callTx.confirm(callTx.id);
    console.log("setting Random Number step 3===========>", confirmedTxn.receipt);
    if (confirmedTxn.receipt.success === true) {
        console.log("==============Transaction is successful===============")
    }
}

async function gearsBatchMint(token_id, is_high_level, to) {
    let randoms;
    if (is_high_level) {
        randoms = await get35BatchRandom();
    } else {
        randoms = await get13BatchRandom();
    }
    let tokenUris = [];
    let to_token_uri_pair = [];
    for (let i = 0; i < 10; i++) {
        let [name, rarity, main_stat, substats] = await generateGearsTrait(randoms[i], is_high_level);
        let formattedSubstats = [];
        for (let substat of substats) {
            let type = substat["type"];
            let value = substat["value"];
            let formattedParam = `${type} +${value}`;
            formattedSubstats.push(formattedParam);
        }
        var data = JSON.stringify({
            "pinataMetadata": {
                "name": `gears-${token_id}.metadata.json`
            },
            "pinataContent": {
                "description": `Gears NFT #${token_id}`,
                "tokenId": `${token_id}`,
                "name": `${name}`,
                "image": `ipfs://${process.env.GEARS_ASSET_CID}/${name}.png`,
                "rarity": `${rarity}`,
                "main_stat": `${main_stat}`,
                "sub_stats": formattedSubstats
            }
        });

        var config = {
            method: 'post',
            url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            headers: {
                'pinata_api_key': `${process.env.PINATA_API_KEY}`,
                'pinata_secret_api_key': `${process.env.PINATA_SECURITY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            data: data
        };
        axios(config)
            .then(async function (response) {
                console.log(JSON.stringify(response.data));
                let IpfsHash = response.data["IpfsHash"];
                let tokenUri = "ipfs://" + IpfsHash;
                tokenUris.push(tokenUri);
            })
            .catch(function (error) {
                console.log(error);
            });

    }
    for (let uri of tokenUris) {
        to_token_uri_pair.push({
            "constructor": "Pair",
            "argtypes": ["ByStr20", "String"],
            "arguments": [to, uri]
        })
    }
    const gearsNFTContract = zilliqa.contracts.at(process.env.GEARS_NFT_ADDRESS);
    const callTx = await gearsNFTContract.callWithoutConfirm(
        'BatchMint',
        [
            {
                vname: 'to_token_uri_pair_list',
                type: 'List (Pair ByStr20 String)',
                value: to_token_uri_pair,
            }
        ],
        {
            // amount, gasPrice and gasLimit must be explicitly provided
            version: VERSION,
            amount: new BN(0),
            gasPrice: myGasPrice,
            gasLimit: Long.fromNumber(8000),
        },
        false,
    );
    console.log("setting Random Number step 2===========>", callTx.id);
    const confirmedTxn = await callTx.confirm(callTx.id);
    console.log("setting Random Number step 3===========>", confirmedTxn.receipt);
    if (confirmedTxn.receipt.success === true) {
        console.log("==============Transaction is successful===============")
    }
}

(async () => {
    try {
        await initializeNetwork();
    } catch (e) {
        console.log("err while initializing====>", e);
    }
    try {
        await ListenForEvents();
    } catch (e) {
        console.log("err while listening events", e)
    }
    try {
        await dlHeroesSingleMint(1, true);
    } catch (e) {
        console.log(e)
    }
})()
