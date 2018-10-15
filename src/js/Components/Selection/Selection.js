import React, { Component } from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Proposal from '../../../../build/contracts/Proposal.json'


export default class Selection extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
          choice: '',
          value: '',
          transferProposals: [],
          mintProposals: []
        }
        
        if (typeof web3 != 'undefined') {
            this.web3Provider = web3.currentProvider
          } else {
            this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
          }
      
          this.web3 = new Web3(this.web3Provider)
          this.proposal = TruffleContract(Proposal)
          this.proposal.setProvider(this.web3Provider)
          this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentWillMount() {
        this.proposal.deployed().then((proposalInstance) => {
            this.proposalInstance = proposalInstance
            return this.proposalInstance.transferProposalCount();
          }).then((count) => {
            for(var i = 1; i <= count.toNumber(); i++) {
              this.proposalInstance.transferMotions(i).then((proposal) => {
                
                const transferProposals = [...this.state.transferProposals];
                transferProposals.push({
                  id: proposal[0].toNumber(),
                  amount: proposal[1].toNumber(),
                  receivingAccount: proposal[2],
                  completed: proposal[3]
                });
                this.setState({transferProposals: transferProposals })
              });
            }
          });
      
          this.proposal.deployed().then((proposalInstance) => {
            this.proposalInstance = proposalInstance
            return this.proposalInstance.mintProposalCount();
          }).then((count) => {
            for(var i = 1; i <= count.toNumber(); i++) {
              this.proposalInstance.mintMotions(i).then((proposal) => {
                
                const mintProposals = [...this.state.mintProposals];
                mintProposals.push({
                  id: proposal[0].toNumber(),
                  amount: proposal[1].toNumber(),
                  completed: proposal[2]
                });
                this.setState({mintProposals: mintProposals });
              });
            }
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
    
      handleSubmit(event) {
        this.proposal.defaults({
          from:this.web3.eth.accounts[0]
        });
        event.preventDefault();
        this.proposal.deployed().then((proposalInstance) => {
          this.proposalInstance = proposalInstance;
          this.proposalInstance.assignProposalSelection(this.state.value,this.state.choice);
        });
      }
  render() {
    return (
      <div>
          <h1>Selection Menu</h1>
        <form onSubmit={this.handleSubmit} role="form">
        <input type="radio" name="a" value="mint" onChange={this.setChoice.bind(this)}/>
          <select onChange={this.setValue.bind(this)}>
          <option disabled selected value> -- select an option -- </option>
            {this.state.mintProposals.map((mintProp) => {
              return <option value={mintProp.id}>Decision to mint {mintProp.amount}</option>
            })}
          </select><br />
          <input type="radio" name="a" value="transfer" onChange={this.setChoice.bind(this)}/>
          <select onChange={this.setValue.bind(this)}>
          <option disabled selected value> -- select an option -- </option>
            {this.state.transferProposals.map((transProp) => {
              return <option value={transProp.id}>Transfering {transProp.amount} to address: {transProp.receivingAccount}</option>
            })}
          </select>
          <input type="submit" value="Submit"/>
        </form>
      </div>
    )
  }
}
