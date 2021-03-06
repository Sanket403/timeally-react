import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Button } from 'react-bootstrap';

import { network } from '../../env';
import axios from 'axios';

const ethers = require('ethers');

class UsingMetamask extends Component {
  state = {
    displayText: '',
  }
  componentDidMount = async () => {
    this.setState({ displayText: 'Please wait connecting to metamask...' });
    if(window.ethereum) {
      await window.ethereum.enable();
      console.log(window.web3.currentProvider);

      const onCorrectNetwork = window.web3.currentProvider.networkVersion === (network === 'homestead' ? '1' : '42');
      console.log('onCorrectNetwork', onCorrectNetwork);
      if(!onCorrectNetwork) {
        this.setState({ displayText: `You are on different network in MetaMask. Please select ${network === 'homestead' ? 'Mainnet' : network}` });
      } else {
        const metamaskWeb3Provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
        this.props.dispatch({ type: 'LOAD-WALLET-INSTANCE', payload: metamaskWeb3Provider.getSigner() });

        setTimeout(async() => {
          this.setState({ displayText: `Connected to Metamask! Your address is ${this.props.store.walletInstance.address}` });
          window.connectedToMetamask = true;

          /// sending user address to
          try {
            await axios.get('https://apis.dayswappers.com/graph/first_time', {
              params: {
                address: this.props.store.walletInstance.address.toLowerCase()
              }
            });
          } catch (error) {
            console.log(error.message);
          }
        }, 300);
      }
    } else {
      this.setState({ displayText: 'Metamask is not found. If you have Metamask installed, you can try updating it. EIP 1102 proposed a communication protocol between dApps and Ethereum-enabled DOM environments like Metamask.' });
    }
  }

  render() {
    return (
      <Card>
        <h3>Using Metamask to login</h3>
        <p>{this.state.displayText}</p>
        {this.state.displayText.slice(0,9) === 'Connected' && window.returnLocationAfterLoadWallet ? <Button onClick={() => {
          this.props.history.push(window.returnLocationAfterLoadWallet&&window.returnLocationAfterLoadWallet.location);
          window.returnLocationAfterLoadWallet = null;
        }}>Click here to proceed to: {window.returnLocationAfterLoadWallet && window.returnLocationAfterLoadWallet.name}</Button> : null}
      </Card>
    );
  }
}

export default connect(state => {return{store: state}})(UsingMetamask);
