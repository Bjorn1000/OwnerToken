
var OwnerToken = artifacts.require("./OwnerToken.sol");

contract("OwnerToken", function(accounts) {
    var admin = accounts[0];
    var buyer = accounts[1];
    it("can get and set 2", function() {
        return OwnerToken.deployed().then(function(instance) {
            instance.mint(200);
            return instance.balanceOf(admin);
        }).then((smooth) => {
            assert.equal(smooth, 200);
        });
    });
    it("can transfer", function() {
        return OwnerToken.deployed().then(function(instance) {
            instance.transfer(buyer, 20, {from: admin})
            return instance.balanceOf(admin);
        }).then((smooth) => {
            assert.equal(smooth, 180);
        });
    });
});