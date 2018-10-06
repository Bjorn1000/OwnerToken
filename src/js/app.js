App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  tokenPrice: 1,
  init: function() {
    console.log("App initialed...");
    
    return App.initWeb3();
  },
  initWeb3: function() {
    if(typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    
    return App.initContracts();
  },
  initContracts: function() {
    
      $.getJSON("OwnerToken.json", function(ownerToken) {
        App.contracts.OwnerToken = TruffleContract(ownerToken);
        App.contracts.OwnerToken.setProvider(App.web3Provider);
        App.contracts.OwnerToken.deployed().then(function(ownerToken) {
          console.log("OwnerToken Address:", ownerToken.address);
        });
        return App.render();
      });
  },

  render: function() {
    if(App.loading) {
      return;
    }
    App.loading = true;

    // shows your account and sets state variable for account
    web3.eth.getCoinbase(function(err, account) {
      if(err === null){
        console.log("account", account);
        App.account = account;
        $('#accountAddress').html("Your Account:" + account);
      }
    });
   

    // Sets the value of the bank field
    App.contracts.OwnerToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.bank()
    }).then(function(get) {
      return tokenInstance.balanceOf(get);
    }).then(function(balance) {
      $('.bankBalance').val(balance.toNumber());
      return tokenInstance.balanceOf(App.account);
    }).then(function(balance) {
      $('.myBalance').val(balance.toNumber());
      return tokenInstance.totalSupply()
    }).then(function(balance) {
      $('.totalSupply').val(balance);
    });

    // Displays menus
    App.contracts.OwnerToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.bank();
    }).then(function(get) {
      if(App.account == get) {
        $(".bankMenu").show();
        $(".voterMenu").hide();
      }
      else {
        $(".bankMenu").hide();
        $(".voterMenu").show();
      }
    });
  },

  mintTokens: function() {
   
    var numberOfTokens = $('.mint').val();
    
    App.contracts.OwnerToken.deployed().then(function(instance) {
      instance.mint(numberOfTokens);
      return instance.totalSupply();
    }).then(function(result) {
      
      console.log("Tokens minted...")

    });
  },
  

  transferTokens: function() {
    var numberOfTokens = $('.transfer').val();
    
    App.contracts.OwnerToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.bank();
    }).then(function(admin) {
      tokenInstance.transfer(App.account, numberOfTokens, {from: admin });
      return tokenInstance.balanceOf(App.account);
    }).then(function(result) {
      console.log("Tokens transferred");
      $('form').trigger('reset')
      // Wait for sell event
    });
  }
};

$(function() {
  $(".bankMenu").hide();
    $(".voterMenu").hide();
  $(window).load(function() {
    
    App.init();
  });
});
