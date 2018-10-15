import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Motion from './Components/Motion/Motion';
import BankEntry from './Components/DataEntry/Bank';
import VoterEntry from './Components/DataEntry/Voter';
import Register from './Components/Register/Register';
import MadLibs from './Components/MadLibs/Madlibs';
import Home from './Components/Home/Home';
import Selection from './Components/Selection/Selection';
import React, { Component } from 'react';

import Web3 from 'web3';
import TruffleContract from 'truffle-contract';
import OwnerToken from '../../build/contracts/OwnerToken';

class App extends Component {
  constructor(props) {
    super(props)
    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }

    this.web3 = new Web3(this.web3Provider)
    this.ownertoken = TruffleContract(OwnerToken)
    this.ownertoken.setProvider(this.web3Provider)
  }

  render() {
    return (
        <div>

        <Router>
            <div>
                <Route exact path="/" component={Home}/>
                <Route path="/selection" component={Selection}/>
                <Route path="/bank_entry" component={BankEntry}/>
                <Route path="/voter_entry" component={VoterEntry}/>
                <Route path="/register" component={Register}/>
                <Route path="/madlibs" component={MadLibs}/>
                <Route path="/motion" component={Motion} />
            </div>
        </Router>
      </div>
    );
  }
}


ReactDOM.render(
   <App />,
   document.querySelector('#root')
)
