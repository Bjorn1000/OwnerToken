import React, { Component } from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import OwnerToken from '../../../../build/contracts/OwnerToken.json'

export default class BankEntry extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      value: '', 
      totalSupply: 0,
      bankBalance: 0,
    }
    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }

    this.web3 = new Web3(this.web3Provider)
    this.ownertoken = TruffleContract(OwnerToken)
    this.ownertoken.setProvider(this.web3Provider)
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  componentDidMount() {
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account: account })
    });

    this.ownertoken.deployed().then((tokenInstance) => {
      this.tokenInstance = tokenInstance;
      this.tokenInstance.totalSupply().then((supply) => {
        this.setState({ totalSupply: supply});
        console.log(this.state.account);
        return this.tokenInstance.balanceOf(this.state.account);
      }).then((balance) => {
        console.log(balance.toNumber());
        this.setState({bankBalance: balance.toNumber()})
      });
    });
    
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    this.ownertoken.defaults({
      from:this.web3.eth.accounts[0]
    })
    event.preventDefault();
    this.ownertoken.deployed().then((tokenInstance) => {
      this.tokenInstance = tokenInstance;
      this.tokenInstance.mint(this.state.value);
      return tokenInstance.bank();
    }).then(function(ts) {
      console.log(ts);
    });
  }
  render() {
    return (
      <div>

          <h1>Welcome to the minting menu</h1>
          <form onSubmit={this.handleSubmit} role="form">
          <label>
          How much do you want to mint:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label> <br />
            <input type="submit" value="Submit"/>
          </form>
          Bank's balance: <input type="text" readonly="true" value={this.state.bankBalance}/> <br />
          Total Supply: <input type="text" readonly="true" value={this.state.totalSupply}></input>
      </div>
    )
  }
}
