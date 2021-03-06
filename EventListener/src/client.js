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
const {generateDLHeroesTrait, generateHeroesTrait, generateGearsTrait, getSpecificSubstat} = require("./traits");
const axios = require("axios");

const privateKey = process.env.OWNER_WALLET_PRIVATEKEY;
zilliqa.wallet.addByPrivateKey(privateKey);
const address = getAddressFromPrivateKey(privateKey);
let minGasPrice = 0;
let balance = 0;
let myGasPrice = 0;
let isGasSufficient = false;
let heroesEvolveCount = 0;
let dlHeroesEvolveCount = 0;
let gearsEvolveCount = 0;
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
    let heroesEvolutionAddress = process.env.HEROES_EVOLUTION_ADDRESS;
    let dlHeroesEvolutionAddress = process.env.DL_HEROES_EVOLUTION_ADDRESS;
    let gearsEvolutionAddress = process.env.GEARS_EVOLUTION_ADDRESS;

    const subscriber = zilliqa.subscriptionBuilder.buildEventLogSubscriptions(
        websocket,
        {
            addresses: [
                mintContractAddress,
                heroesEvolutionAddress,
                dlHeroesEvolutionAddress,
                gearsEvolutionAddress
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


                if (eventObj["_eventname"] === "MintSpecificHeroes") {
                    let token_id = eventObj["params"][0]["value"];
                    let to = eventObj["params"][1]["value"];
                    let rarity = eventObj["params"][2]["value"];
                    let type = eventObj["params"][3]["value"];
                    await heroesSpecificMint(token_id, to, rarity, type);
                }

                if (eventObj["_eventname"] === "MintSpecificGear") {
                    let token_id = eventObj["params"][0]["value"];
                    let to = eventObj["params"][1]["value"];
                    let rarity = eventObj["params"][2]["value"];
                    let type = eventObj["params"][3]["value"];
                    let mainstat = eventObj["params"][4]["value"];
                    let gearType = eventObj["params"][5]["value"];
                    await gearsSpecificMint(token_id, to, rarity, type, mainstat, gearType);
                }


                // Evolution Event Listener
                if (eventObj["_eventname"] === "EvolveHeroes") {
                    let max_token_uri = eventObj["params"][0]["value"]["arguments"][0];
                    let any_token_uri = eventObj["params"][1]["value"]["arguments"][0];
                    let to = eventObj["params"][2]["value"]["arguments"][0];
                    let id_lv_max = eventObj["params"][3]["value"];
                    let id_lv_any = eventObj["params"][4]["value"];
                    await heroesEvolve(max_token_uri, any_token_uri, to, id_lv_max, id_lv_any);
                }
                if (eventObj["_eventname"] === "EvolveGears") {
                    let max_token_uri = eventObj["params"][0]["value"]["arguments"][0];
                    let any_token_uri = eventObj["params"][1]["value"]["arguments"][0];
                    let to = eventObj["params"][2]["value"]["arguments"][0];
                    let id_lv_max = eventObj["params"][3]["value"];
                    let id_lv_any = eventObj["params"][4]["value"];
                    await gearsEvolve(max_token_uri, any_token_uri, to, id_lv_max, id_lv_any);
                }
                if (eventObj["_eventname"] === "EvolveDLHeroes") {
                    let max_token_uri = eventObj["params"][0]["value"]["arguments"][0];
                    let any_token_uri = eventObj["params"][1]["value"]["arguments"][0];
                    let to = eventObj["params"][2]["value"]["arguments"][0];
                    let id_lv_max = eventObj["params"][3]["value"];
                    let id_lv_any = eventObj["params"][4]["value"];
                    await dlHeroesEvolve(max_token_uri, any_token_uri, to, id_lv_max, id_lv_any);
                }
            }
        }
    });
    await subscriber.start();
}

function getConfig(data) {
    return {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        headers: {
            'pinata_api_key': `${process.env.PINATA_API_KEY}`,
            'pinata_secret_api_key': `${process.env.PINATA_SECURITY_API_KEY}`,
            'Content-Type': 'application/json'
        },
        data: data
    };
}

// Evolve NFTs
async function heroesEvolve(max_token_uri, any_token_uri, to, id_lv_max, id_lv_any) {
    console.log("original token uri==========>", max_token_uri);
    let config = {
        method: 'get',
        url: `https://gateway.pinata.cloud/ipfs/${max_token_uri}`,
      };
      heroesEvolveCount ++ ;
      axios(config)
      .then(function (response) {
        let metadata = response.data;
        let rarity = metadata.rarity;
        let newRarity = rarity + 1 ;
        metadata.rarity = newRarity;
        console.log("new metadata=============>", metadata);
        let data = JSON.stringify({
            "pinataMetadata": {
                "name": `heroes-evolve-${heroesEvolveCount}.metadata.json`
            },
            "pinataContent": metadata
        });
        let config = getConfig(data);
        axios(config).
        then(async res => {
            let IpfsHash = res.data["IpfsHash"];
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
                        value: IpfsHash,
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
            console.log("Evolving step 2===========>", callTx.id);
            const confirmedTxn = await callTx.confirm(callTx.id);
            console.log("Evolving step 3===========>", confirmedTxn.receipt);
            if (confirmedTxn.receipt.success === true) {
                console.log("==============Transaction is successful===============", IpfsHash)
            }
        }).catch(e => {
            console.log("======error from ipfs upload========")
        })
      })
      .catch(function (error) {
        console.log(error);
      });
}
async function gearsEvolve(max_token_uri, any_token_uri, to, id_lv_max, id_lv_any) {
    let config = {
        method: 'get',
        url: `https://gateway.pinata.cloud/ipfs/${max_token_uri}`,
    };
    gearsEvolveCount ++ ;
    axios(config)
        .then(function (response) {
            let metadata = response.data;
            let rarity = metadata.rarity;
            let newRarity = rarity + 1 ;
            metadata.rarity = newRarity;
            let sub_stats = metadata.sub_stats;
            let new_sub_stats = [];
            for (let substat of sub_stats) {
                let type = substat.split(" ")[0];
                let value = substat.split(" ")[1];
                if  (value === "Set") {
                    new_sub_stats.push(substat)
                } else {
                    if (type.indexOf("%") > -1) {
                        value = parseFloat(value.substring(1));
                        let newValue = (value * 1.1).toFixed(2);
                        new_sub_stats.push(`${type} +${newValue}`);
                    } else {
                        value = parseInt(value.substring(1));
                        let newValue = Math.floor(value * 1.1);
                        new_sub_stats.push(`${type} +${newValue}`);
                    }
                }
            }
            metadata.sub_stats = new_sub_stats;
            let data = JSON.stringify({
                "pinataMetadata": {
                    "name": `gears-evolve-${gearsEvolveCount}.metadata.json`
                },
                "pinataContent": metadata
            });
            let config = getConfig(data);
            axios(config).then(async res => {
                let IpfsHash = res.data["IpfsHash"];
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
                            value: IpfsHash,
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
                console.log("Evolving Number step 2===========>", callTx.id);
                const confirmedTxn = await callTx.confirm(callTx.id);
                console.log("Evolving step 3===========>", confirmedTxn.receipt);
                if (confirmedTxn.receipt.success === true) {
                    console.log("==============Transaction is successful===============", IpfsHash)
                }
            }).catch(e => {

            })
        })
        .catch(function (error) {
            console.log(error);
        });
}
async function dlHeroesEvolve(max_token_uri, any_token_uri, to, id_lv_max, id_lv_any) {
    let config = {
        method: 'get',
        url: `https://gateway.pinata.cloud/ipfs/${max_token_uri}`,
    };
    dlHeroesEvolveCount ++ ;
    axios(config)
        .then(function (response) {
            let metadata = response.data;
            let rarity = metadata.rarity;
            let newRarity = rarity + 1 ;
            metadata.rarity = newRarity;
            let data = JSON.stringify({
                "pinataMetadata": {
                    "name": `dl-heroes-evolve-${dlHeroesEvolveCount}.metadata.json`
                },
                "pinataContent": metadata
            });
            let config = getConfig(data);
            axios(config).then(async res => {
                let IpfsHash = res.data["IpfsHash"];
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
                            value: IpfsHash,
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
                console.log("Evolving step 2===========>", callTx.id);
                const confirmedTxn = await callTx.confirm(callTx.id);
                console.log("Evolving step 3===========>", confirmedTxn.receipt);
                if (confirmedTxn.receipt.success === true) {
                    console.log("==============Transaction is successful===============", IpfsHash)
                }
            }).catch(e => {

            })
        })
        .catch(function (error) {
            console.log(error);
        });
}
// Generate Single Random && Generate Trait && Upload to IFPS
async function dlHeroesSingleMint(token_id, to) {
    let random = await getSingleRandom();
    let [name, rarity] = await generateDLHeroesTrait(random);
    let data = JSON.stringify({
        "pinataMetadata": {
            "name": `dl-heroes-${token_id}.metadata.json`
        },
        "pinataContent": {
            "description": `Dark/Light Heroes NFT #${token_id}`,
            "name": `${name}`,
            "image": `ipfs://${process.env.DL_HEROES_ASSET_CID}/${name}.png`,
            "rarity": rarity
        }
    });

    let config = getConfig(data)

    axios(config)
        .then(async function (response) {
            console.log(JSON.stringify(response.data));
            let IpfsHash = response.data["IpfsHash"];
            let tokenUri = IpfsHash;
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
    let data = JSON.stringify({
        "pinataMetadata": {
            "name": `heroes-${token_id}.metadata.json`
        },
        "pinataContent": {
            "description": `Heroes NFT #${token_id}`,
            "name": `${name}`,
            "image": `ipfs://${process.env.HEROES_ASSET_CID}/${name}.png`,
            "rarity": rarity
        }
    });

    let config = getConfig(data)

    axios(config)
        .then(async function (response) {
            console.log(JSON.stringify(response.data));
            let IpfsHash = response.data["IpfsHash"];
            let tokenUri = IpfsHash;
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

async function heroesSpecificMint(token_id, to, _rarity, type) {
    let name = type;
    let rarity = parseInt(_rarity)
    let data = JSON.stringify({
        "pinataMetadata": {
            "name": `heroes-${token_id}.metadata.json`
        },
        "pinataContent": {
            "description": `Heroes NFT #${token_id}`,
            "name": `${name}`,
            "image": `ipfs://${process.env.HEROES_ASSET_CID}/${name}.png`,
            "rarity": rarity
        }
    });

    let config = getConfig(data)

    axios(config)
        .then(async function (response) {
            console.log(JSON.stringify(response.data));
            let IpfsHash = response.data["IpfsHash"];
            let tokenUri = IpfsHash;
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
        let formattedParam = "";
        if (value === "Set") {
            formattedParam = `${type} ${value}`;
        } else {
            formattedParam = `${type} +${value}`;
        }
        formattedSubstats.push(formattedParam);
    }
    let data = JSON.stringify({
        "pinataMetadata": {
            "name": `gears-${token_id}.metadata.json`
        },
        "pinataContent": {
            "description": `Gears NFT #${token_id}`,
            "name": `${name}`,
            "image": `ipfs://${process.env.GEARS_ASSET_CID}/${name}.png`,
            "rarity": rarity,
            "main_stat": `${main_stat}`,
            "sub_stats": formattedSubstats
        }
    });

    let config = getConfig(data)

    axios(config)
        .then(async function (response) {
            console.log(JSON.stringify(response.data));
            let IpfsHash = response.data["IpfsHash"];
            let tokenUri = IpfsHash;
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

async function gearsSpecificMint(token_id, to, _rarity, type, mainstat, gear_type) {
    let name = type;
    let rarity = parseInt(_rarity);
    let main_stat = mainstat;
    let random = await getSingleRandom();
    let substats = await getSpecificSubstat(random, gear_type, rarity);
    let formattedSubstats = [];
    for (let substat of substats) {
        let type = substat["type"];
        let value = substat["value"];
        let formattedParam = "";
        if (value === "Set") {
            formattedParam = `${type} ${value}`;
        } else {
            formattedParam = `${type} +${value}`;
        }
        formattedSubstats.push(formattedParam);
    }

    let data = JSON.stringify({
        "pinataMetadata": {
            "name": `gears-${token_id}.metadata.json`
        },
        "pinataContent": {
            "description": `Gears NFT #${token_id}`,
            "name": `${name}`,
            "image": `ipfs://${process.env.GEARS_ASSET_CID}/${name}.png`,
            "rarity": rarity,
            "main_stat": `${main_stat}`,
            "sub_stats": formattedSubstats
        }
    });

    let config = getConfig(data)

    axios(config)
        .then(async function (response) {
            console.log(JSON.stringify(response.data));
            let IpfsHash = response.data["IpfsHash"];
            let tokenUri = IpfsHash;
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

        let data = JSON.stringify({
            "pinataMetadata": {
                "name": `heroes-${parseInt(token_id) + i}.metadata.json`
            },
            "pinataContent": {
                "description": `Heroes NFT #${parseInt(token_id) + i}`,
                "name": `${name}`,
                "image": `ipfs://${process.env.HEROES_ASSET_CID}/${name}.png`,
                "rarity": rarity
            }
        });
        let config = getConfig(data)

        try {
            let response = await axios(config);
            let IpfsHash = response.data["IpfsHash"];
            let tokenUri = IpfsHash;
            tokenUris.push(tokenUri);
        } catch (e) {
            console.log(e);
        }
        // axios(config)
        //     .then(async function (response) {
        //         console.log(JSON.stringify(response.data));
        //         let IpfsHash = response.data["IpfsHash"];
        //         let tokenUri = IpfsHash;
        //         tokenUris.push(tokenUri);
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
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
        let data = JSON.stringify({
            "pinataMetadata": {
                "name": `gears-${parseInt(token_id) + i}.metadata.json`
            },
            "pinataContent": {
                "description": `Gears NFT #${parseInt(token_id) + i}`,
                "name": `${name}`,
                "image": `ipfs://${process.env.GEARS_ASSET_CID}/${name}.png`,
                "rarity": rarity,
                "main_stat": `${main_stat}`,
                "sub_stats": formattedSubstats
            }
        });

        try {
            let config = getConfig(data);
            let response = await  axios(config);
            let IpfsHash = response.data["IpfsHash"];
            let tokenUri = IpfsHash;
            tokenUris.push(tokenUri);
        } catch (e) {
            console.log(e)
        }
        // axios(config)
        //     .then(async function (response) {
        //         console.log(JSON.stringify(response.data));
        //         let IpfsHash = response.data["IpfsHash"];
        //         let tokenUri = IpfsHash;
        //         tokenUris.push(tokenUri);
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });

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
})()
