var TokenSale = artifacts.require("./TokenSale.sol");
var OwnerToken = artifacts.require("./OwnerToken.sol");

module.exports = function(deployer) {
  deployer.deploy(OwnerToken, 1000000).then(function() {
    var tokenPrice = 1000000000000000;
    return deployer.deploy(TokenSale, OwnerToken.address, tokenPrice);
  });
};
