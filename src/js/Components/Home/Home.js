import React, { Component } from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Proposal from '../../../../build/contracts/Proposal.json'
import OwnerToken from '../../../../build/contracts/OwnerToken.json'
import { withRouter } from 'react-router-dom'


class Home extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
          isBank: false,
          proposalSelected: false,
        }
        
        if (typeof web3 != 'undefined') {
            this.web3Provider = web3.currentProvider
          } else {
            this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
          }
      
          this.web3 = new Web3(this.web3Provider)
          this.proposal = TruffleContract(Proposal)
          this.proposal.setProvider(this.web3Provider)
          this.ownertoken = TruffleContract(OwnerToken)
          this.ownertoken.setProvider(this.web3Provider)
          
    }

    componentDidMount() {
        this.web3.eth.getCoinbase((err, account) => {
          this.ownertoken.deployed().then((tokenInstance) => {
            this.tokenInstance = tokenInstance;
            return this.tokenInstance.bank();
        }).then((bankAccount) => {
            console.log(bankAccount);
            if(account == bankAccount) {
              console.log("is bank");
              this.setState({isBank: true});
            }
            else {
              console.log("is not bank");
              this.setState({isBank: false});
            }
        });
        this.proposal.deployed().then((proposalInstance) => {
            this.proposalInstance = proposalInstance;
            return this.proposalInstance.voters(account);
            }).then((voter) => {
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

      /*
      this.proposal.deployed().then((proposalInstance) => {
        this.proposalInstance = proposalInstance;
        return this.proposalInstance.selectedProposal()
      }).then((selection) => {
        if(selection[1] == "") {
          console.log("proposal not selected");
          this.setState({proposalSelected: false});
        }
        else {
          console.log("proposal selected");
          this.setState({proposalSelected: true});
        }
      });
      */
    }

    

  render() {

    return (
      <div>
        { !this.state.isBank ? 
        <div>
          <h1>Ownertoken</h1>
          <h2>Owner Menu</h2>
          {!this.state.proposalSelected ?
          <div>
            <a href="/madlibs">Ya making decisions?</a><br />
            <a href="/selection">Before you vote, you need to select what you are voting on</a><br />
          </div> :
          <div>
            <a href="/motion">Ya voting?</a><br />
            <a href="/madlibs">Ya making more decisions?</a><br />
            <a href="/selection">Before you vote, you need to select what you are voting on</a><br />
            <a href="/voter_entry">Ya giving tokens to ya buds?</a>
          </div>
          }
        </div>
        : 
        <div >
          <h1>Ownertoken</h1>
          <h2>Bank Menu</h2>
          <a href="/bank_entry">Hey bank, gonna mint?</a> <br />
          <a href="/voter_entry">Ya giving tokens to ya buds?</a>
        </div> }
      </div>
    )
  }
}

export default withRouter(Home);