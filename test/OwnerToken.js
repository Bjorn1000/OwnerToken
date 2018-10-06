var OwnerToken = artifacts.require("./OwnerToken");

contract('OwnerToken', function(accounts) {
    var admin = accounts[0];
    var buyer = accounts[1];
    it('total Supply is 0', function() {
        return OwnerToken.deployed().then(function(instance) {
          tokenInstance = instance;
          return tokenInstance.totalSupply();
        }).then(function(ts) {
            assert.equal(ts, 0, 'Total supply initialized');
        });
    });
    it('can mint', function() {
        return OwnerToken.deployed().then(function(instance) {
            tokenInstance = instance;
            tokenInstance.mint(20);
            return tokenInstance.totalSupply();
        }).then(function(ts) {
            assert.equal(ts, 20, "Total supply increased by 20");
        })
    });
    it('proper balance', function() {
        return OwnerToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.balanceOf(admin);
        }).then(function(ts) {
            assert.equal(ts.toNumber(), 20, "balance is 20");
        })
    });
    it('can transfer between 2 accounts', function() {
        return OwnerToken.deployed().then(function(instance) {
            tokenInstance = instance;
            tokenInstance.transfer(buyer, 10, { from: admin });
            return tokenInstance.balanceOf(buyer);
        }).then(function(receipt) {
            assert.equal(receipt.toNumber(), 10, "balance is 10");
        });
    });
    

});