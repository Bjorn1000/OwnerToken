import React, { Component } from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import OwnerToken from '../../../../build/contracts/OwnerToken.json'
import Proposal from '../../../../build/contracts/Proposal.json'
export default class VoterEntry extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      value: '', 
      yourBalance: 10,
      receivingAccount: '',
      bankAddress: "0x0",
      voters: []
    }
    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }

    this.web3 = new Web3(this.web3Provider)
    this.ownertoken = TruffleContract(OwnerToken)
    this.ownertoken.setProvider(this.web3Provider)
    this.proposal = TruffleContract(Proposal)
    this.proposal.setProvider(this.web3Provider)
    
    
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  componentDidMount() {
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account: account })
    });

    
    this.proposal.deployed().then((propInstance) => {
      this.propInstance = propInstance;
      return this.propInstance.voterCount();
    }).then((count) => {
      for(var i = 1; i <= count.toNumber(); i++) {
        this.propInstance.votersByIndex(i).then((voter) => {
          const voters = [...this.state.voters]
          voters.push({
            address: voter[0],
            name: voter[1]
          });
          this.setState({voters: voters })
        });
      }
    });

    this.ownertoken.deployed().then((tokenInstance) => {
      this.tokenInstance = tokenInstance;
      return tokenInstance.bank();
    }).then((bank) => {
      console.log(bank + " inital assignment");
      this.setState({ bankAddress: bank });
      this.tokenInstance.balanceOf(bank).then((supply) => {
      this.setState({ bankBalance: supply.toNumber()});
      console.log(this.state.account);
      return this.tokenInstance.balanceOf(this.state.account);
    }).then((balance) => {
      console.log(balance.toNumber());
      this.setState({yourBalance: balance.toNumber()});
      });
    });
    
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }
  setAccount(event) {
    console.log(event.target.value);
    this.setState({ receivingAccount: event.target.value});
  }

  handleSubmit(event) {
    
    var value = this.state.value;
    var myAccount = this.state.account;

    this.ownertoken.defaults({
      from:this.web3.eth.coinbase
    });
    event.preventDefault();
    this.ownertoken.deployed().then((tokenInstance) => {
      this.tokenInstance = tokenInstance;
      this.tokenInstance.transfer('0x651d9BbBB118f0d0d52Bc11d65D0C7Ea393d9421', value);
    });
  }
  render() {
    return (
    <div>

        <h1>Send some tokens to your friends</h1>
        <form onSubmit={this.handleSubmit} role="form">
          <label>
          How much do you want to transfer:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label> <br />
          <label>
            Who do you want to transfer to:
          <select onChange={this.setAccount.bind(this)}>
            <option disabled selected value> -- select an option -- </option>
            {this.state.voters.map((voter) => {
              return(
                <option value={voter.address}>{voter.name}</option>
              )
            })}
            {/*
            <option value="0x85C5ED75A276Dbc908dDAAfD83D3Fb442441DcEa">Ozzy</option>
            <option value="0x651d9BbBB118f0d0d52Bc11d65D0C7Ea393d9421">Nik</option>
            <option value="0x1e209198167a73DC52FC6115eD4aaa2C23b56C32">Diana</option>
          
            */}
            
          </select>
          </label>
          <input type="submit" value="Submit"/>
        </form>
        Your balance: <input type="text" readonly="true" value={this.state.yourBalance}/>
    </div>
    )
  }
}
