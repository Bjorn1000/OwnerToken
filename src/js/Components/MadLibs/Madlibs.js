import React, { Component } from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Proposal from '../../../../build/contracts/Proposal.json'

export default class Madlibs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      choice: '',
      value: 0,
      receivingAccount: '',
      voters: []
    }
    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }

    this.web3 = new Web3(this.web3Provider)
    this.proposal = TruffleContract(Proposal)
    this.proposal.setProvider(this.web3Provider)
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
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
          console.log(voters);
          this.setState({voters: voters })
        });
      }
    });

    this.proposal.deployed().then((proposalInstance) => {
      this.proposalInstance = proposalInstance;
      this.proposalInstance.mintProposalCount().then((propCount) => {
        
        for (var i = 1; i <= propCount; i++) {
          this.proposalInstance.mintMotions(i).then((motion) => {
            console.log("id " + motion[0]);
            console.log("amount " + motion[1]);
            console.log("status " + motion[2]);
          });
        }
      }); 
    });

    this.proposal.deployed().then((proposalInstance) => {
      this.proposalInstance = proposalInstance;
      this.proposalInstance.transferProposalCount().then((propCount) => {
        
        for (var i = 1; i <= propCount; i++) {
          this.proposalInstance.transferMotions(i).then((motion) => {
            console.log("id " + motion[0]);
            console.log("amount " + motion[1]);
            console.log("address " + motion[2]);
            console.log("status " + motion[3]);
          });
        }
      }); 
    });
  }
  setChoice(event) {
    console.log(event.target.value);
    this.setState({ choice: event.target.value});
  }

  setValue(event) {
    console.log(event.target.value);
    this.setState({ value: event.target.value});
  }

  setAccount(event) {
    console.log(event.target.value);
    this.setState({ receivingAccount: event.target.value});
  }

  handleSubmit(event) {
    this.proposal.defaults({
      from:this.web3.eth.accounts[0]
    });
    event.preventDefault();
    this.proposal.deployed().then((proposalInstance) => {
      this.proposalInstance = proposalInstance;
      if(this.state.choice == "hey") {
        console.log("mint");
        this.proposalInstance.createMintProposal(this.state.value);
        
      }
      if(this.state.choice == "now") {
        console.log("transfer");
        this.proposalInstance.createTransferProposal(this.state.value, this.state.receivingAccount);
      }
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} role="form">
        <label>
          <input type="radio" name="a" value="hey" onChange={this.setChoice.bind(this)}/>
          We the people elect to mint <input type="number" onChange={this.setValue.bind(this)}/> coins
        </label>
        
        <label>
          <input type="radio" name="a" value="now" onChange={this.setChoice.bind(this)}/>
          We the people elect to distribute <input type="number" onChange={this.setValue.bind(this)} /> coins to this account: 
          <select onChange={this.setAccount.bind(this)}>
            <option disabled selected value> -- select an option -- </option>
            {this.state.voters.map((voter) => {
              return(
                <option value={voter.address}>{voter.name}</option>
              )
            })}

          </select>
        </label>
          <input type="submit" value="Submit"/>
          </form>
      </div>
    )
  }
}
