import React from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Proposal from '../../../../build/contracts/Proposal.json'
import Content from './Content'
import 'bootstrap/dist/css/bootstrap.css'

class Motion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      options: [],
      hasVoted: false,
      loading: true,
      voting: false,
      count: 0,
      proposalNumber: 0,
      proposalAmount: 0,
      proposalComplete: false,
      proposalAccount: '', 
      kind: '',
      voterCount: 0

    }

    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }

    this.web3 = new Web3(this.web3Provider)

    this.proposal = TruffleContract(Proposal)
    this.proposal.setProvider(this.web3Provider)

    this.castVote = this.castVote.bind(this)
    this.watchEvents = this.watchEvents.bind(this)
  }

  componentDidMount() {

    this.proposal.deployed().then((proposalInstance) => {
      this.proposalInstance = proposalInstance;
      return this.proposalInstance.voterCount();
      
    }).then((count) => {
      //console.log(count.toNumber() + " count");
      this.setState({voterCount: count.toNumber()});
    });


    // TODO: Refactor with promise chain
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account })
      this.proposal.deployed().then((proposalInstance) => {
        this.proposalInstance = proposalInstance
        this.watchEvents()
        this.proposalInstance.optionsCount().then((optionsCount) => {
          for (var i = 1; i <= optionsCount; i++) {
            this.proposalInstance.options(i).then((option) => {
              const options = [...this.state.options]
              options.push({
                id: option[0],
                name: option[1],
                voteCount: option[2]
              });
              this.setState({ options: options })
            });
          }
        })
        this.proposalInstance.voters(this.state.account).then((hasVoted) => {
          this.setState({ hasVoted, loading: false })
        })
      })
    });
    
    this.proposal.deployed().then((proposalInstance) => {
      this.proposalInstance = proposalInstance;
      return this.proposalInstance.selectedProposal();
    }).then((selected) => {
      console.log(selected[0].toNumber());
      console.log(selected[1]);
      if(selected[1] == "mint") {
        
        return this.proposalInstance.mintMotions(selected[0].toNumber()).then((result) => {
          this.setState({
            kind: selected[1],
            proposalNumber: result[0].toNumber(),
            proposalAmount: result[1].toNumber(),
            proposalComplete: result[2]
          });
          /*
          console.log(result[0].toNumber());
          console.log(result[1].toNumber());
          console.log(result[2]);
          */
        });
        
      }
      if(selected[1] == "transfer") {
        console.log("this is transfer");
        
        return this.proposalInstance.transferMotions(selected[0].toNumber()).then((result) => {
          console.log(result);
          this.setState({
            kind: selected[1],
            proposalNumber: result[0].toNumber(),
            proposalAmount: result[1].toNumber(),
            proposalAccount: result[2],
            proposalComplete: result[3]
          });

          console.log(this.state.proposalNumber);
          console.log(this.state.proposalAmount);
          console.log(this.state.proposalAccount);
          console.log(this.state.proposalComplete);
        });
        
      }
    });

    
  }

  watchEvents() {
    // TODO: trigger event when vote is counted, not when component renders
    this.proposalInstance.votedEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch((error, event) => {
      this.setState({ voting: false })
    })
  }

  castVote(optionId) {
    this.setState({ voting: true })
    this.proposalInstance.vote(optionId, { from: this.state.account }).then((result) =>
      this.setState({ hasVoted: true })
    )
  }

  render() {
    return (
      <div class='row'>
        <div class='col-lg-12 text-center' >
          <h1>Proposal Results</h1>
          <h2>Details: This is a proposal to {this.state.kind} {this.state.proposalAmount} tokens </h2>
          <h3>Requires: {this.state.voterCount} votes</h3>
          <br/>
          { this.state.loading || this.state.voting
            ? <p class='text-center'>Loading...</p>
            : <Content
                account={this.state.account}
                options={this.state.options}
                hasVoted={this.state.hasVoted}

                castVote={this.castVote} />
          }

          
        </div>
      </div>
    )
  }
}
export default Motion