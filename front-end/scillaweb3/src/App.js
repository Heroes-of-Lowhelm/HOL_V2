import './main.css';
import React from "react";
import {Container, Row, Col} from 'react-grid-system';
import ReactLoading from 'react-loading';


const {Zilliqa} = require('@zilliqa-js/zilliqa');
const {BN, Long, units} = require('@zilliqa-js/util');

const mintContractAddress = "0x3f81cc88109d7f27bb82ddb1eabf2d06b7d3655a";

const {
    StatusType,
    MessageType,
} = require('@zilliqa-js/subscriptions');

class App extends React.Component {
    //---------------
    //* constructor *
    //---------------
    constructor(props) {
        super(props);
        // init the state variables

        this.state = {
            isLoadingH13Mint: false,
            isLoadingH35Mint: false,
            isLoadingHDLMint: false,
            isLoadingG13Mint: false,
            isLoadingG35Mint: false,
            isLoadingH13BatchMint: false,
            isLoadingH35BatchMint: false,
            isLoadingG13BatchMint: false,
            isLoadingG35BatchMint: false,
            document: "",
            walletConnected: false
        };

    }

    //-------------------------------------
    //* Get the current account in ZilPay *
    //-------------------------------------
    getCurrentAccount = () => {
        window.zilPay.wallet.connect()
            .then(
                function (connected) {
                    console.log(connected)
                    console.log(window.zilPay.wallet.net);
                    console.log(window.zilPay.wallet.defaultAccount);
                    // subscribe to network changes
                    window.zilPay.wallet.observableNetwork().subscribe(
                        function (network) {
                            console.log("Network has been changed to " + network);
                        });
                    // subscribe to user account changes
                    window.zilPay.wallet.observableAccount().subscribe(
                        function (account) {
                            console.log("Account has been changed to " +
                                account.base16 + " (" + account.bech32 + ")");
                            window.zilPay.blockchain.getBalance(account.bech32)
                                .then(function (resp) {
                                    console.log(resp);
                                })
                        })
                }
            )
    }
    //-----------------------------------------------
    //* Check if ZilPay is installed on the browser *
    //-----------------------------------------------
    connectZilPay = () => {
        if (window.zilPay) {
            console.log("ZilPay Present")
            this.getCurrentAccount()
            this.setState({walletConnected: true})
            this.subscribeToEvents();
        } else {
            console.log("Cannot Find ZilPay")
            this.setState({walletConnected: false})
        }
    }

    subscribeToEvents = () => {
        // use https://api.zilliqa.com/ for Mainnet
        const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
        const subscriber =
            zilliqa.subscriptionBuilder.buildEventLogSubscriptions(
                'wss://dev-ws.zilliqa.com', // use wss://api-ws.zilliqa.com
                // for Mainnet
                {
                    addresses: [mintContractAddress],
                }
            );
        // subscribed successfully
        subscriber.emitter.on(StatusType.SUBSCRIBE_EVENT_LOG,
            (event) => {
                console.log('Subscribed: ', event);
            });
        // fired when an event is received
        subscriber.emitter.on(MessageType.EVENT_LOG,
            (event) => {
                console.log('get new event log: ', JSON.stringify(event));
                if ("value" in event) {
                    let eventObj = event["value"][0]["event_logs"][0];
                        if (eventObj["_eventname"] === "Mint13Heroes") {
                            this.setState({isLoadingH13Mint: false});
                        } else if (eventObj["_eventname"] === "Mint35Heroes") {
                            this.setState({isLoadingH35Mint: false});
                        } else if (eventObj["_eventname"] === "MintDLHeroes") {
                            this.setState({isLoadingHDLMint: false});
                        } else if (eventObj["_eventname"] === "Mint13Gears") {
                            this.setState({isLoadingG13Mint: false});
                        } else if (eventObj["_eventname"] === "Mint35Gears") {
                            this.setState({isLoadingG35Mint: false});
                        } else if (eventObj["_eventname"] === "BatchMint13Heroes") {
                            this.setState({isLoadingH13BatchMint: false});
                        } else if (eventObj["_eventname"] === "BatchMint35Heroes") {
                            this.setState({isLoadingH35BatchMint: false});
                        } else if (eventObj["_eventname"] === "BatchMint13Gears") {
                            this.setState({isLoadingG13BatchMint: false});
                        } else if (eventObj["_eventname"] === "BatchMint35Gears") {
                            this.setState({isLoadingG13BatchMint: false});
                        }
                }
            });
        // unsubscribed successfully
        subscriber.emitter.on(MessageType.UNSUBSCRIBE, (event) => {
            console.log('Unsubscribed: ', event);
        });
        subscriber.start();
    }

    //-----------------------
    //* Call Mint transition *
    //-----------------------
    mint13Heroes = () => {
        this.setState({isLoadingH13Mint: true})
        const mintContract =
            window.zilPay.contracts.at(mintContractAddress);
        try {
            mintContract.call(
                'Mint13Heroes',
                [],
                {
                    version: 21823489,   // For mainnet, it is 65537
                                         // For testnet, it is 21823489
                    amount: new BN(0),
                    gasPrice: units.toQa('2000', units.Units.Li),
                    gasLimit: Long.fromNumber(8000)
                }
            );
        } catch (err) {
            console.log(err);
        }
    }

    mint35Heroes = () => {
        this.setState({isLoadingH35Mint: true})
        const mintContract =
            window.zilPay.contracts.at(mintContractAddress);
        try {
            mintContract.call(
                'Mint35Heroes',
                [],
                {
                    version: 21823489,   // For mainnet, it is 65537
                                         // For testnet, it is 21823489
                    amount: new BN(0),
                    gasPrice: units.toQa('2000', units.Units.Li),
                    gasLimit: Long.fromNumber(8000)
                }
            );
        } catch (err) {
            console.log(err);
        }
    }

    mintDLHeroes = () => {
        this.setState({isLoadingHDLMint: true})
        const mintContract =
            window.zilPay.contracts.at(mintContractAddress);
        try {
            mintContract.call(
                'MintDLHeroes',
                [],
                {
                    version: 21823489,   // For mainnet, it is 65537
                                         // For testnet, it is 21823489
                    amount: new BN(0),
                    gasPrice: units.toQa('2000', units.Units.Li),
                    gasLimit: Long.fromNumber(8000)
                }
            );
        } catch (err) {
            console.log(err);
        }
    }

    mint13Gears = () => {
        this.setState({isLoadingG13Mint: true})
        const mintContract =
            window.zilPay.contracts.at(mintContractAddress);
        try {
            mintContract.call(
                'Mint13Gears',
                [],
                {
                    version: 21823489,   // For mainnet, it is 65537
                                         // For testnet, it is 21823489
                    amount: new BN(0),
                    gasPrice: units.toQa('2000', units.Units.Li),
                    gasLimit: Long.fromNumber(8000)
                }
            );
        } catch (err) {
            console.log(err);
        }
    }

    mint35Gears = () => {
        this.setState({isLoadingG35Mint: true})
        const mintContract =
            window.zilPay.contracts.at(mintContractAddress);
        try {
            mintContract.call(
                'Mint35Gears',
                [],
                {
                    version: 21823489,   // For mainnet, it is 65537
                                         // For testnet, it is 21823489
                    amount: new BN(0),
                    gasPrice: units.toQa('2000', units.Units.Li),
                    gasLimit: Long.fromNumber(8000)
                }
            );
        } catch (err) {
            console.log(err);
        }
    }

    batchMint13Heroes = () => {
        this.setState({isLoadingH13BatchMint: true})
        const mintContract =
            window.zilPay.contracts.at(mintContractAddress);
        try {
            mintContract.call(
                'BatchMint13Heroes',
                [],
                {
                    version: 21823489,   // For mainnet, it is 65537
                                         // For testnet, it is 21823489
                    amount: new BN(0),
                    gasPrice: units.toQa('2000', units.Units.Li),
                    gasLimit: Long.fromNumber(8000)
                }
            );
        } catch (err) {
            console.log(err);
        }
    }

    batchMint35Heroes = () => {
        this.setState({isLoadingH35BatchMint: true})
        const mintContract =
            window.zilPay.contracts.at(mintContractAddress);
        try {
            mintContract.call(
                'BatchMint35Heroes',
                [],
                {
                    version: 21823489,   // For mainnet, it is 65537
                                         // For testnet, it is 21823489
                    amount: new BN(0),
                    gasPrice: units.toQa('2000', units.Units.Li),
                    gasLimit: Long.fromNumber(8000)
                }
            );
        } catch (err) {
            console.log(err);
        }
    }


    batchMint13Gears = () => {
        this.setState({isLoadingG13BatchMint: true})
        const mintContract =
            window.zilPay.contracts.at(mintContractAddress);
        try {
            mintContract.call(
                'BatchMint13Gears',
                [],
                {
                    version: 21823489,   // For mainnet, it is 65537
                                         // For testnet, it is 21823489
                    amount: new BN(0),
                    gasPrice: units.toQa('2000', units.Units.Li),
                    gasLimit: Long.fromNumber(8000)
                }
            );
        } catch (err) {
            console.log(err);
        }
    }

    batchMint35Gears = () => {
        this.setState({isLoadingG35BatchMint: true})
        const mintContract =
            window.zilPay.contracts.at(mintContractAddress);
        try {
            mintContract.call(
                'BatchMint35Gears',
                [],
                {
                    version: 21823489,   // For mainnet, it is 65537
                                         // For testnet, it is 21823489
                    amount: new BN(0),
                    gasPrice: units.toQa('2000', units.Units.Li),
                    gasLimit: Long.fromNumber(8000)
                }
            );
        } catch (err) {
            console.log(err);
        }
    }


    render() {
        return (
            <div className="container">
                <div className="headerContainer">
                    <h1>Test Mint/Evolve of HOL</h1>
                    {!this.state.walletConnected ?
                        <button id="btnConnectZilPay" onClick={this.connectZilPay}>Connect ZilPay</button> : <></>}
                </div>
                {this.state.walletConnected ? <Container>
                    <Row>
                        <Col sm={12}>
                            <h2>Mint Testing</h2>
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            {
                                this.state.isLoadingH13Mint ?
                                    <ReactLoading type={"balls"} color={'gray'}></ReactLoading> :
                                    <button id="btnNotarize" onClick={this.mint13Heroes}>Mint 1* ~ 3* Heroes</button>
                            }
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            {
                                this.state.isLoadingH35Mint ?
                                    <ReactLoading type={"balls"} color={'gray'}></ReactLoading> :
                                    <button id="btnNotarize" onClick={this.mint35Heroes}>Mint 3* ~ 5* Heroes</button>
                            }
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            {
                                this.state.isLoadingHDLMint ?
                                    <ReactLoading type={"balls"} color={'gray'}></ReactLoading> :
                                    <button id="btnNotarize" onClick={this.mintDLHeroes}>Mint Dark/Light Heroes</button>
                            }
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            {
                                this.state.isLoadingG13Mint ?
                                    <ReactLoading type={"balls"} color={'gray'}></ReactLoading> :
                                    <button id="btnNotarize" onClick={this.mint13Gears}>Mint 1* ~ 3* Gears</button>
                            }

                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            {
                                this.state.isLoadingG35Mint ?
                                    <ReactLoading type={"balls"} color={'gray'}></ReactLoading> :
                                    <button id="btnNotarize" onClick={this.mint35Gears}>Mint 3* ~ 5* Gears</button>
                            }

                        </Col>


                        <Col sm={12} md={6} lg={4}>
                            {
                                this.state.isLoadingH13BatchMint ?
                                    <ReactLoading type={"balls"} color={'gray'}></ReactLoading> :
                                    <button id="btnNotarize" onClick={this.batchMint13Heroes}>Batch Mint 1* ~ 3* Heroes</button>
                            }

                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            {
                                this.state.isLoadingH35BatchMint ?
                                    <ReactLoading type={"balls"} color={'gray'}></ReactLoading> :
                                    <button id="btnNotarize" onClick={this.batchMint35Heroes}>Batch Mint 3* ~ 5* Heroes</button>
                            }
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            {
                                this.state.isLoadingG13BatchMint ?
                                    <ReactLoading type={"balls"} color={'gray'}></ReactLoading> :
                                    <button id="btnNotarize" onClick={this.batchMint13Gears}>Batch Mint 1* ~ 3* Gears</button>
                            }
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            {
                                this.state.isLoadingG35BatchMint ?
                                    <ReactLoading type={"balls"} color={'gray'}></ReactLoading> :
                                    <button id="btnNotarize" onClick={this.batchMint35Gears}>Batch Mint 3* ~ 5* Gears</button>
                            }
                        </Col>
                    </Row>
                </Container> : <></>}
            </div>
        );
    }
}

export default App;