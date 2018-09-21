App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Motion.json", function(motion) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Motion = TruffleContract(motion);
      // Connect provider to interact with contract
      App.contracts.Motion.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  
  listenForEvents: function() {
    App.contracts.Motion.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var motionInstance;
    var loader = $("#loader");
    var content = $("#content");
    var finish = $("#finished");
    var numerator = $('#numerator');
    var denominator = $('#denominator');
    var voteCounter = $('#topright2');
    
    voteCounter.hide();



    loader.show();
    content.hide();
    finish.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
        App.contracts.Motion.deployed().then(function(instance) {
          motionInstance = instance;
          return motionInstance.newVoters(App.account);
        }).then(function(voter) {
          console.log(voter);
          $("#accountName").html("Welcome " + voter[0]);
        });
      }
    });

    // Load contract data
    App.contracts.Motion.deployed().then(function(instance) {
      motionInstance = instance;
      return motionInstance.optionsCount();
    }).then(function(optionsCount) {
      var optionsResults = $("#optionsResults");
      optionsResults.empty();

      var optionsSelect = $('#optionsSelect');
      optionsSelect.empty();

      for (var i = 1; i <= optionsCount; i++) {
        motionInstance.options(i).then(function(option) {
          var id = option[0];
          var choice = option[1];
          var voteCount = option[2];

          // Render option Result
          var optionTemplate = "<tr><td>" + choice + "</td><td>" + voteCount + "</td></tr>"
          optionsResults.append(optionTemplate);

          // Render option ballot option
          var optionOption = "<option value='" + id + "' >" + choice + "</ option>"
          optionsSelect.append(optionOption);
        });
      }
      return motionInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });

    // looks for voters and gets their data
    App.contracts.Motion.deployed().then(function(instance) {
      motionInstance = instance;
      return motionInstance.voterCount();
    }).then(function(voterCount) {

      var votingResults = $("#votingResults");
      votingResults.empty();
      for(var i = 1; i <= voterCount.toNumber(); i++) {
        motionInstance.indexVoters(i).then(function(voter) {
          var name = voter[0];
          var votingPrivilege = voter[1];
          var tokens = voter[2].toNumber();
          var votingTemplate = "<tr><th>" + name + "</th><td>" + tokens + "</td><td>" + votingPrivilege + "</td></tr>"
          votingResults.append(votingTemplate);
        });
      }
    });

    // If all the votes have been made this section is set off
    App.contracts.Motion.deployed().then(function(instance) {
      motionInstance = instance;
      filler = [];
      return motionInstance.totalVoteCount();
    }).then(function(count) {
      filler.push(count.toNumber());
      numerator.html(count.toNumber());
      return motionInstance.voteLimit();
    }).then(function(limit) {
      filler.push(limit.toNumber());
      denominator.html(limit.toNumber());
      voteCounter.show();
      if(filler[0] < filler[1]) {
      }
      else {
        $('form').hide();
        finish.show();
      }
    });
  },

  castVote: function() {
    var optionId = $('#optionsSelect').val();
    App.contracts.Motion.deployed().then(function(instance) {
      return instance.vote(optionId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});