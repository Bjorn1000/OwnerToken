App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  tokenPrice: 1000000000000000,
  tokensSold: 0,
  tokensAvailable: 750000,
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
    $.getJSON("TokenSale.json", function(tokenSale) {
      App.contracts.TokenSale = TruffleContract(tokenSale);
      App.contracts.TokenSale.setProvider(App.web3Provider);
      App.contracts.TokenSale.deployed().then(function(tokenSale) {
        console.log("Dapp Token Sale Address:", tokenSale.address);
      });
    }).done(function() {
      $.getJSON("OwnerToken.json", function(ownerToken) {
        App.contracts.OwnerToken = TruffleContract(ownerToken);
        App.contracts.OwnerToken.setProvider(App.web3Provider);
        App.contracts.OwnerToken.deployed().then(function(ownerToken) {
          console.log("OwnerToken Address:", ownerToken.address);
        });
        App.listenForEvents();
        return App.render();
      });
    })
  },

  listenForEvents: function() {
    App.contracts.TokenSale.deployed().then(function(instance) {
      instance.Sell({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        console.log("event triggered", event);
        App.render();
      });
    });
  },

  render: function() {
    if(App.loading) {
      return;
    }
    App.loading = true;

    var loader = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if(err === null){
        console.log("account", account);
        App.account = account;
        $('#accountAddress').html("Your Account:" + account);
      }
    });

    App.contracts.TokenSale.deployed().then(function(instance) {
      tokenSaleInstance = instance;
      return tokenSaleInstance.tokenPrice();
    }).then(function(tokenPrice) {
      App.tokenPrice = tokenPrice;
      $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
      return tokenSaleInstance.tokensSold();
    }).then(function(tokensSold) {
      App.tokensSold = tokensSold.toNumber();
      $('.tokens-sold').html(App.tokensSold);
      $('.tokens-available').html(App.tokensAvailable);

      var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
      $('#progress').css('width', progressPercent + '%');

      App.contracts.OwnerToken.deployed().then(function(instance) {
        ownerTokenInstance = instance;
        return ownerTokenInstance.balanceOf(App.account);
      }).then(function(balance) {
        $('.ot-balance').html(balance.toNumber());
        App.loading = false;
        loader.hide();
        content.show();
      })
    });

  },

  buyTokens: function() {
    $('#content').hide();
    $('#loader').show();
    var numberOfTokens = $('#numberOfTokens').val();
    App.contracts.TokenSale.deployed().then(function(instance) {
      return instance.buyTokens(numberOfTokens, {
        from: App.account,
        value: numberOfTokens * App.tokenPrice,
        gas: 500000
      });
    }).then(function(result) {
      console.log("Tokens bought...")
      $('form').trigger('reset')
      // Wait for sell event
    });
  }
}

$(function() {
  $(window).load(function() {
    App.init();
  })
});