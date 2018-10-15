import React, { Component } from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Proposal from '../../../../build/contracts/Proposal.json'
import { withRouter } from 'react-router-dom'

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      value: '', 
      naming: false,
    }
    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }
    this.web3 = new Web3(this.web3Provider)
    this.proposal = TruffleContract(Proposal)
    this.proposal.setProvider(this.web3Provider)
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.watchEvents = this.watchEvents.bind(this);
  }
  
  componentDidMount() {
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account: account })

      this.proposal.deployed().then((proposalInstance) => {
        this.proposalInstance = proposalInstance;
        return this.proposalInstance.voters(this.state.account);
      }).then((voter) => {
        console.log(voter);
        if(voter[0] == "") {
          console.log("route to register");
          this.props.history.push('/register');
        }
        else {
          console.log("no routing");
          this.props.history.push('/');
        }
      });
    });  
  }
  

  watchEvents() {
    this.proposalInstance.nameAssignEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch((error, event) => {
      this.props.history.push('/');
    })
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    this.proposal.defaults({
      from:this.web3.eth.accounts[0]
    });
    console.log(this.state.value);
    var value = this.state.value;
    event.preventDefault();
    this.proposal.deployed().then((proposalInstance) => {
      this.proposalInstance = proposalInstance;
      this.watchEvents();
      this.proposalInstance.assignVoterName(value);
      
      
    });
    


  }
  render() {
    return (
      <div>
        <h1>Welcome to ownertoken!</h1>
        <form role="form" onSubmit={this.handleSubmit}>
          <label>Please enter your name:</label>
          <input type="text" value={this.state.value} onChange={this.handleChange}/>
          <input type="submit" value="Submit"/>
        </form>
      </div>
    )
  }
}

export default withRouter(Register);
