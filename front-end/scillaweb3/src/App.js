import './main.css';
import React from "react";
import { Container, Row, Col } from 'react-grid-system';
const {Zilliqa} = require('@zilliqa-js/zilliqa');
const {BN, Long, units} = require('@zilliqa-js/util');

const mintContractAddress = "0x3f81cc88109d7f27bb82ddb1eabf2d06b7d3655a";
console.log("Minting Contract address===========>", mintContractAddress);
class App extends React.Component {
    //---------------
    //* constructor *
    //---------------
    constructor(props) {
        super(props);
        // init the state variables

        this.state = {
            status: "[Status]",
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
        } else {
            console.log("Cannot Find ZilPay")
            this.setState({walletConnected: false})
        }
    }


    //-----------------------
    //* Call Mint transition *
    //-----------------------
    mintNFT = () => {
        this.setState({status: "Please wait..."})
        const mintContract =
            window.zilPay.contracts.at(mintContractAddress);
        try {
            mintContract.call(
                'notarize',
                [
                    {
                        vname: 'document',
                        type: 'String',
                        value: this.state.document
                    },
                ],
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
                    {!this.state.walletConnected ? <button id="btnConnectZilPay" onClick={this.connectZilPay}>Connect ZilPay</button> : <></>}
                </div>
                {this.state.walletConnected ?  <Container>
                    <Row>
                        <Col sm={12} md={6} lg={4}>
                            <button id="btnNotarize" onClick={this.mintNFT}>Mint 1* ~ 3* Heroes</button>
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            <button id="btnNotarize" onClick={this.mintNFT}>Mint 3* ~ 5* Heroes</button>
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            <button id="btnNotarize" onClick={this.mintNFT}>Mint Dark/Light Heroes</button>
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            <button id="btnNotarize" onClick={this.mintNFT}>Mint 1* ~ 3* Gears</button>
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            <button id="btnNotarize" onClick={this.mintNFT}>Mint 3* ~ 5* Gears</button>
                        </Col>
                    </Row>
                </Container> : <></>}

                <center><h3 id="result">{this.state.status}</h3></center>
            </div>
        );
    }
}

export default App;